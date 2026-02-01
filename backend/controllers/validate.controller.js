import pool from "../db/pool.js";

/* =========================
   ROSTER VALIDATOR (v7 - Fatigue & Workload Logic)
   - Fetches history to catch consecutive day violations across weeks.
   - Ignores Weekend PMs (as requested).
   ========================= */

const SG_PUBLIC_HOLIDAYS_2026 = new Set([
  "2026-01-01", "2026-02-17", "2026-02-18", "2026-03-30", 
  "2026-04-03", "2026-05-01", "2026-05-31", "2026-06-06", 
  "2026-08-09", "2026-11-08", "2026-12-25"
]);

// --- THE CORE LOGIC ---
export const checkRosterRules = async (startDate, endDate) => {
  const client = await pool.connect();
  try {
    // 1. Look back 7 days to check fatigue/consecutive streaks
    const rosterStart = new Date(startDate);
    const historyStart = new Date(rosterStart);
    historyStart.setDate(rosterStart.getDate() - 7); 
    const queryStart = historyStart.toISOString().split('T')[0];

    const query = `
      SELECT 
        s.date::text AS date,
        s.user_id,
        u.first_name,
        u.last_name,
        d.name as department_name,
        st.name as shift_name,
        s.title,
        st.start_time,
        st.end_time
      FROM shifts s
      JOIN users u ON s.user_id = u.id
      JOIN departments d ON u.department_id = d.id
      LEFT JOIN shift_types st ON s.shift_type_id = st.id
      WHERE s.date BETWEEN $1 AND $2 
      -- Fetch published history + current unpublished drafts
      AND (s.published = true OR s.date >= $3) 
      ORDER BY s.user_id, s.date ASC
    `;
    
    const { rows } = await client.query(query, [queryStart, endDate, startDate]);
    const violations = [];

    const addError = (date, name, rule, message) => {
      // Only report errors for the current roster week
      if (date >= startDate && date <= endDate) {
        violations.push({ date, name, rule, message });
      }
    };

    // --- HELPERS ---
    const isPmOrNight = (row) => {
        const name = (row.shift_name || "").toUpperCase();
        const title = (row.title || "").toUpperCase();
        if (name === 'PM' || name === 'N') return true;
        if (title.includes('PM')) return true;
        if (row.start_time && parseInt(row.start_time.split(':')[0]) >= 11) return true;
        return false;
    };

    const isExplicitWorkingShift = (row) => {
        const name = (row.shift_name || "").toUpperCase();
        const title = (row.title || "").toUpperCase();
        // 1. Filter out obvious non-working shifts
        if (['DO', 'RD', 'AL', 'SL', 'HL', 'PH', 'OFF'].includes(name)) return false;
        if (title === 'PH' || title === 'OFF' || title === 'REST') return false;
        // 2. Explicitly include working shifts
        if (['AM', 'PM', 'N', 'RRT', 'GPAPN', 'NNJ CLINIC', 'AM (RES)'].includes(name)) return true;
        if (title.includes('AM') || title.includes('PM')) return true;
        if (row.start_time) return true;
        return false; 
    };

    const getWeekKey = (dateStr) => {
        const d = new Date(dateStr);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to start on Monday
        const monday = new Date(d.setDate(diff));
        return monday.toISOString().slice(0, 10);
    };

    const shiftsByDate = {};
    const shiftsByUser = {};

    rows.forEach(row => {
        // Group for Date checks
        if (row.date >= startDate) {
            shiftsByDate[row.date] = shiftsByDate[row.date] || [];
            shiftsByDate[row.date].push(row);
        }
        // Group for User checks
        shiftsByUser[row.user_id] = shiftsByUser[row.user_id] || [];
        shiftsByUser[row.user_id].push(row);
    });

    // --- RUN USER CHECKS (Fatigue & Sleep Day) ---
    for (const userId in shiftsByUser) {
        const userShifts = shiftsByUser[userId];
        const workDaysPerWeek = {}; 
        let consecutiveDays = 0;

        // Ensure chronological order
        userShifts.sort((a,b) => new Date(a.date) - new Date(b.date));

        for (let i = 0; i < userShifts.length; i++) {
            const current = userShifts[i];
            const isWork = isExplicitWorkingShift(current);

            // 1. Count Consecutive Days (Spanning weeks)
            if (isWork) {
                consecutiveDays++;
            } else {
                consecutiveDays = 0; // Reset on Rest Day
            }

            // RULE: Max 6 Consecutive Days
            // (If they worked 5 days last week + 1 this week, this triggers on the 6th day)
            if (consecutiveDays > 6) {
                addError(current.date, current.first_name, "Fatigue Rule", `Working ${consecutiveDays} days in a row (Needs a Break).`);
            }

            // 2. Count Total Days in THIS week
            if (isWork && current.date >= startDate) {
                const wk = getWeekKey(current.date);
                workDaysPerWeek[wk] = (workDaysPerWeek[wk] || 0) + 1;
            }

            // 3. Sleep Day Rule (Night -> Next Day Work)
            if (i < userShifts.length - 1) {
                const next = userShifts[i+1];
                if (current.shift_name === 'N') {
                    const dayDiff = (new Date(next.date) - new Date(current.date)) / (1000 * 60 * 60 * 24);
                    if (dayDiff === 1 && isExplicitWorkingShift(next)) {
                         const nextLabel = next.shift_name || next.title || "Unknown Shift";
                         addError(next.date, current.first_name, "Sleep Day", `Working '${nextLabel}' immediately after Night shift.`);
                    }
                }
            }
        }

        // RULE: Max 5 Working Days Per Week (Soft Warning / Check RDs)
        for (const [weekStart, count] of Object.entries(workDaysPerWeek)) {
            if (count > 5) {
                // Find a shift to attach this error to
                const shift = userShifts.find(s => getWeekKey(s.date) === weekStart && s.date >= startDate);
                if (shift) {
                    addError(shift.date, shift.first_name, "Workload Limit", `Worked ${count} days this week. Ensure 1-2 Rest Days.`);
                }
            }
        }
    }

    // --- RUN DATE CHECKS (Coverage & Fixed Rules) ---
    for (const date in shiftsByDate) {
        const dayShifts = shiftsByDate[date];
        const day = new Date(date).getDay(); // 0=Sun, 6=Sat
        const isPH = SG_PUBLIC_HOLIDAYS_2026.has(date);

        dayShifts.forEach(row => {
            // PAS Rule
            if (["Surg/Clinic", "Surg/85", "Surg/55"].includes(row.department_name)) {
                if (isPmOrNight(row) && row.shift_name !== 'RRT' && row.title !== 'RRT') {
                    const label = row.shift_name || row.title || "Unknown";
                    addError(row.date, row.first_name, "PAS Rule", `Assigned '${label}' (PM/Night) but PAS is AM/RRT only.`);
                }
            }
            // PAME Fixed
            if (row.department_name === "Ward 31" && day >= 1 && day <= 5) {
                if (isPmOrNight(row)) addError(row.date, row.first_name, "PAME Fixed", "Lydia assigned PM/Night on weekday.");
            }
            if (row.department_name === "Ward 75" && row.first_name === "Aaron") {
                 if ((day === 1 || day === 2) && isPmOrNight(row)) addError(row.date, "Aaron", "PAME Fixed", "Aaron assigned PM on Mon/Tue.");
            }
        });

        // Coverage Rules
        if (day === 3 && !isPH) {
            const hasGpapn = dayShifts.some(s => s.title === 'GPAPN' || s.shift_name === 'GPAPN');
            if (!hasGpapn) addError(date, "System", "Coverage", "Wednesday missing GPAPN assignment.");
        }
        if (day === 0 || isPH) {
            const nnjCount = dayShifts.filter(s => s.title === 'NNJ Clinic' || s.shift_name === 'NNJ Clinic').length;
            if (nnjCount < 2) addError(date, "System", "Coverage", `Sunday/PH has only ${nnjCount} NNJ Clinic staff (Needs 2).`);
            
            const ceDoingNnj = dayShifts.find(s => (s.title === 'NNJ Clinic' || s.shift_name === 'NNJ Clinic') && s.department_name === 'CE');
            if (ceDoingNnj) addError(date, ceDoingNnj.first_name, "NNJ Rule", "CE staff assigned to NNJ Clinic (Not allowed).");
        }
    }

    return violations;

  } finally {
    client.release();
  }
};

// --- THE CONTROLLER ---
export const validateRoster = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const violations = await checkRosterRules(startDate, endDate);
    
    if (violations.length === 0) {
        res.json({ status: "PASS", message: "All rules validated successfully! Roster is safe to publish." });
    } else {
        res.json({ status: "FAIL", violationCount: violations.length, violations });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Validation failed", error: err.message });
  }
};