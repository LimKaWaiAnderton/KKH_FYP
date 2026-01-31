import pool from "../db/pool.js";

/* =========================
   ROSTER VALIDATOR (v5 - Reusable Logic)
   - Exports 'checkRosterRules' for internal use (by Publish).
   - Exports 'validateRoster' for API use (by Frontend).
   ========================= */

const SG_PUBLIC_HOLIDAYS_2026 = new Set([
  "2026-01-01", "2026-02-17", "2026-02-18", "2026-03-30", 
  "2026-04-03", "2026-05-01", "2026-05-31", "2026-06-06", 
  "2026-08-09", "2026-11-08", "2026-12-25"
]);

// --- THE CORE LOGIC (Returns an array of violations) ---
export const checkRosterRules = async (startDate, endDate) => {
  const client = await pool.connect();
  try {
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
      WHERE s.published = false
      AND s.date BETWEEN $1 AND $2
      ORDER BY s.date ASC
    `;
    
    const { rows } = await client.query(query, [startDate, endDate]);
    const violations = [];

    const addError = (date, name, rule, message) => {
      violations.push({ date, name, rule, message });
    };

    // Helpers
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
        if (['DO', 'RD', 'AL', 'SL', 'HL', 'PH', 'OFF'].includes(name)) return false;
        if (title === 'PH' || title === 'OFF' || title === 'REST') return false;
        if (['AM', 'PM', 'N', 'RRT', 'GPAPN', 'NNJ CLINIC', 'AM (RES)'].includes(name)) return true;
        if (title.includes('AM') || title.includes('PM')) return true;
        if (row.start_time) return true;
        return false; 
    };

    const shiftsByDate = {};
    const shiftsByUser = {};

    rows.forEach(row => {
        shiftsByDate[row.date] = shiftsByDate[row.date] || [];
        shiftsByDate[row.date].push(row);

        shiftsByUser[row.user_id] = shiftsByUser[row.user_id] || [];
        shiftsByUser[row.user_id].push(row);
    });

    // --- RUN CHECKS ---
    rows.forEach(row => {
        const day = new Date(row.date).getDay();
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

    // Sleep Day
    for (const userId in shiftsByUser) {
        const userShifts = shiftsByUser[userId].sort((a,b) => new Date(a.date) - new Date(b.date));
        for (let i = 0; i < userShifts.length - 1; i++) {
            const current = userShifts[i];
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

    // Coverage
    for (const date in shiftsByDate) {
        const dayShifts = shiftsByDate[date];
        const day = new Date(date).getDay();
        const isPH = SG_PUBLIC_HOLIDAYS_2026.has(date);

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

// --- THE CONTROLLER (Used by Route /validate) ---
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