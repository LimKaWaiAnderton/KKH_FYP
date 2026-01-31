import pool from "../db/pool.js";

/* =========================
   GENERATE ROSTER (FINAL v12 - Custom Shift Types)
   
   UPDATES:
   - Uses REAL Shift IDs for: GPAPN, NNJ Clinic, AM (RES).
   - Logic checks if these exist in DB; if not, falls back to standard AM/PM.
   - CE Excluded from NNJ Clinic pool.
   - PAME/PAS/Onco/RRT rules preserved.
   ========================= */

// Static Singapore Public Holidays 2026
const SG_PUBLIC_HOLIDAYS_2026 = new Set([
  "2026-01-01", // New Year's Day
  "2026-02-17", // Chinese New Year
  "2026-02-18", // Chinese New Year
  "2026-03-30", // Hari Raya Puasa
  "2026-04-03", // Good Friday
  "2026-05-01", // Labour Day
  "2026-05-31", // Vesak Day
  "2026-06-06", // Hari Raya Haji
  "2026-08-09", // National Day
  "2026-11-08", // Deepavali
  "2026-12-25"  // Christmas Day
]);

export const generateRoster = async (req, res) => {
  const client = await pool.connect();

  try {
    let createdCount = 0;
    let skippedCount = 0;
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({ message: "Start date cannot be after end date" });
    }

    await client.query("BEGIN");

    /* =========================
       1) FETCH DATA
    ========================= */
    const employeesResult = await client.query(`
      SELECT u.id, u.first_name, u.last_name, u.department_id, d.name AS department_name
      FROM users u
      JOIN departments d ON u.department_id = d.id
      WHERE u.role_id = 2 AND u.is_active = true
      ORDER BY u.department_id, u.last_name, u.first_name
    `);
    const employees = employeesResult.rows;

    const shiftTypesResult = await client.query(`SELECT id, name, start_time, end_time FROM shift_types`);
    const shiftTypes = shiftTypesResult.rows;
    
    // Standard Types
    const amShiftType = shiftTypes.find(s => s.name === "AM");
    const pmShiftType = shiftTypes.find(s => s.name === "PM");
    const nightShiftType = shiftTypes.find(s => s.name === "N");
    const rrtShiftType = shiftTypes.find(s => s.name === "RRT");
    const doShiftType = shiftTypes.find(s => s.name === "DO");
    const rdShiftType = shiftTypes.find(s => s.name === "RD");
    
    // New Custom Types (with fallbacks if SQL wasn't run)
    const gpapnShiftType = shiftTypes.find(s => s.name === "GPAPN") || pmShiftType;
    const nnjClinicShiftType = shiftTypes.find(s => s.name === "NNJ Clinic") || amShiftType;
    const amResShiftType = shiftTypes.find(s => s.name === "AM (RES)") || { ...amShiftType, title: "AM (RES)", start_time: "08:00:00", end_time: "17:00:00" };
    
    // Fetch Existing Shifts
    const existingShiftsResult = await client.query(
      `SELECT 
         s.user_id, 
         s.date::text AS date, 
         s.is_rrt, 
         s.shift_type_id,
         d.name as department_name,
         s.title,
         st.name as shift_name
       FROM shifts s
       JOIN users u ON s.user_id = u.id
       JOIN departments d ON u.department_id = d.id
       LEFT JOIN shift_types st ON s.shift_type_id = st.id
       WHERE s.date BETWEEN $1 AND $2`,
      [startDate, endDate]
    );
    
    const existingSlots = new Set(existingShiftsResult.rows.map(r => `${r.user_id}-${r.date}`));
    skippedCount = existingSlots.size;
    
    // Coverage Tracking
    const rrtCoveredDates = new Set();
    const coverageStats = {}; 
    const employeeServiceCounts = { gpapn: {}, nnj: {} };

    // Initialize counts
    employees.forEach(e => {
        employeeServiceCounts.gpapn[e.id] = 0;
        employeeServiceCounts.nnj[e.id] = 0;
    });

    existingShiftsResult.rows.forEach(row => {
        if (row.is_rrt) rrtCoveredDates.add(row.date);
        
        // Track existing Service Counts by Name/Title
        if (row.shift_name === 'GPAPN' || row.title === 'GPAPN') employeeServiceCounts.gpapn[row.user_id]++;
        if (row.shift_name === 'NNJ Clinic' || row.title === 'NNJ Clinic') employeeServiceCounts.nnj[row.user_id]++;

        coverageStats[row.date] ??= {};
        coverageStats[row.date][row.department_name] ??= { AM: 0, PM: 0, RRT: 0 };
        
        const stats = coverageStats[row.date][row.department_name];
        const st = shiftTypes.find(t => t.id === row.shift_type_id);
        
        if (st) {
            if (st.name.includes('AM')) stats.AM++;
            if (st.name.includes('PM')) stats.PM++;
            if (st.name === 'RRT') stats.RRT++;
        }
    });

    /* =========================
       HELPERS & SETUP
    ========================= */
    const getDay = dateStr => new Date(dateStr).getDay(); 
    const getWeekKey = dateStr => {
      const d = new Date(dateStr);
      const sunday = new Date(d);
      sunday.setDate(d.getDate() - d.getDay());
      return sunday.toISOString().split("T")[0];
    };

    const allDates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      allDates.push(new Date(d).toISOString().split("T")[0]);
    }

    const employeeWeeklyWork = {};
    const employeeNightCount = {};
    const employeeRrtCount = {};
    const nightWorkedThisWeek = {};
    const forcedOffDays = new Set();
    
    /* --- DEPARTMENT GROUPS --- */
    const ceEmployees = employees.filter(e => e.department_name === "CE");
    const PAS_DEPARTMENTS = ["Surg/Clinic", "Surg/85", "Surg/55"];
    
    const RRT_DEPARTMENTS = [
        "Ward 65", "CICU", 
        "CE", "Ward 56", "Ward 62", 
        "Ward 75", "Ward 76", 
        "Surg/Clinic", "Surg/85", "Surg/55", 
        "NICU (Blue)", "NICU (Pink)", "Ward 66", "Ward 86", "Ward 31"
    ];
    const rrtEligibleEmployees = employees.filter(e => RRT_DEPARTMENTS.includes(e.department_name));

    /* --- SERVICE POOLS --- */
    // GPAPN: 7 specific PAME APNs
    const gpapnPool = employees.filter(e => 
        (e.department_name === "Ward 75" && e.first_name === "Aaron") ||
        ["Ward 56", "Ward 62", "Ward 66"].includes(e.department_name)
    );

    // NNJ Clinic: PAME + NICU (CE Excluded)
    const nnjPool = employees.filter(e => 
        e.department_name.startsWith("Ward") || 
        e.department_name.startsWith("NICU")
    );

    const getRrtPriorityScore = (deptName) => {
        if (["Ward 65", "CICU"].includes(deptName)) return 1; 
        if (["CE", "Ward 56", "Ward 62"].includes(deptName)) return 2;
        if (["Ward 75", "Ward 76"].includes(deptName)) return 3;
        if (deptName.includes("Surg")) return 4;
        return 5;
    };

    ceEmployees.forEach(e => employeeNightCount[e.id] = 0);
    rrtEligibleEmployees.forEach(e => employeeRrtCount[e.id] = 0);

    /* --- ASSIGN SHIFT HELPER --- */
    const assignShift = async (emp, date, shiftInfo, isRrt = false, force = false, isOff = false) => {
        const key = `${emp.id}-${date}`;
        if (existingSlots.has(key)) return false;

        const wk = getWeekKey(date);
        employeeWeeklyWork[emp.id] ??= {};
        employeeWeeklyWork[emp.id][wk] ??= 0;

        if (!isOff && !force && employeeWeeklyWork[emp.id][wk] >= 5) return false;

        // Use real ID if available, otherwise fallback logic handles titles
        const shiftTypeId = shiftInfo.id || null;
        const title = shiftInfo.id ? null : shiftInfo.title; 
        const startTime = shiftInfo.start_time;
        const endTime = shiftInfo.end_time;     
        
        await client.query(
            `INSERT INTO shifts (user_id, date, shift_type_id, title, start_time, end_time, published, is_rrt)
             VALUES ($1, $2, $3, $4, $5, $6, false, $7)`,
            [emp.id, date, shiftTypeId, title, startTime, endTime, isRrt]
        );

        createdCount++;
        existingSlots.add(key);
        if (isRrt) rrtCoveredDates.add(date);
        if (!isOff) employeeWeeklyWork[emp.id][wk]++;
        
        coverageStats[date] ??= {};
        coverageStats[date][emp.department_name] ??= { AM: 0, PM: 0, RRT: 0 };
        const stats = coverageStats[date][emp.department_name];

        if (isRrt) stats.RRT++;
        else if (shiftInfo.name?.includes('AM') || title === 'AM') stats.AM++;
        else if (shiftInfo.name?.includes('PM') || title === 'PM') stats.PM++;

        return true;
    };

    /* =========================
       PRE-CHECKS
    ========================= */
    const prevNightQuery = `
      SELECT user_id, date::text AS date, st.name AS shift_name
      FROM shifts s JOIN shift_types st ON s.shift_type_id = st.id
      WHERE date < $1 AND user_id = ANY($2) ORDER BY date DESC LIMIT 1
    `;
    for (const emp of ceEmployees) {
      const prevShiftRes = await client.query(prevNightQuery, [startDate, [emp.id]]);
      if (prevShiftRes.rows.length > 0 && prevShiftRes.rows[0].shift_name === "N") {
        if (allDates[0]) forcedOffDays.add(`${emp.id}-${allDates[0]}`);
      }
    }

    /* =========================
       SERVICE LAYERS (RUNS FIRST)
    ========================= */
    
    // 1. GPAPN Clinic (Wed PM, Non-PH)
    for (const date of allDates) {
        const day = getDay(date);
        const isPH = SG_PUBLIC_HOLIDAYS_2026.has(date);

        if (day === 3 && !isPH && gpapnShiftType) { // Wednesday
            const sorted = [...gpapnPool].sort((a, b) => 
                (employeeServiceCounts.gpapn[a.id] || 0) - (employeeServiceCounts.gpapn[b.id] || 0)
            );
            
            for (const emp of sorted) {
                if (await assignShift(emp, date, gpapnShiftType, false, true, false)) {
                    employeeServiceCounts.gpapn[emp.id]++;
                    break; 
                }
            }
        }
    }

    // 2. NNJ Clinic (Sunday & PH, AM)
    for (const date of allDates) {
        const day = getDay(date);
        const isPH = SG_PUBLIC_HOLIDAYS_2026.has(date);

        if ((day === 0 || isPH) && nnjClinicShiftType) { // Sunday or PH
            const sorted = [...nnjPool].sort((a, b) => 
                (employeeServiceCounts.nnj[a.id] || 0) - (employeeServiceCounts.nnj[b.id] || 0)
            );
            
            let assignedCount = 0;
            for (const emp of sorted) {
                if (assignedCount >= 2) break;
                
                if (await assignShift(emp, date, nnjClinicShiftType, false, true, false)) {
                    employeeServiceCounts.nnj[emp.id]++;
                    assignedCount++;
                }
            }
        }
    }

    /* =========================
       4) ONCO RULES
    ========================= */
    const oncoTeam = {
        A: employees.find(e => e.first_name === 'Daphne' && e.last_name === 'Koh'),
        C: employees.find(e => e.first_name === 'Ethan' && e.last_name === 'Low'),
        D: employees.find(e => e.first_name === 'Caleb' && e.last_name === 'Ng'),
        B: employees.find(e => e.department_name === 'Ward 75' && e.first_name === 'Beatrice') 
    };
    const weekendGroup = [oncoTeam.B, oncoTeam.C, oncoTeam.D].filter(Boolean);
    
    if (weekendGroup.length > 0) {
        const saturdays = allDates.filter(d => getDay(d) === 6);
        let rotationIndex = 0;
        for (const satDate of saturdays) {
            const d = new Date(satDate);
            d.setDate(d.getDate() + 1);
            const sunDate = d.toISOString().split("T")[0];
            const emp = weekendGroup[rotationIndex % weekendGroup.length];
            rotationIndex++;
            await assignShift(emp, satDate, amShiftType, false, true, false); 
            if (new Date(sunDate) <= end) {
                await assignShift(emp, sunDate, amShiftType, false, true, false);
            }
        }
    }

    const daphneShift = { id: amShiftType?.id, title: "AM", start_time: "08:00:00", end_time: "17:00:00" };
    for (const date of allDates) {
        const day = getDay(date);
        const isPH = SG_PUBLIC_HOLIDAYS_2026.has(date);

        if (oncoTeam.A && day >= 1 && day <= 5 && !isPH) {
            await assignShift(oncoTeam.A, date, daphneShift, false, true, false);
        }
        if (oncoTeam.C && !isPH) {
            if (day === 1) await assignShift(oncoTeam.C, date, amShiftType, false, true, false);
            if (day === 2) await assignShift(oncoTeam.C, date, pmShiftType, false, true, false);
        }
    }

    /* =========================
       5) PAME SPECIAL RULES
    ========================= */
    const pameTeam = {
        Aaron: employees.find(e => e.department_name === 'Ward 75' && e.first_name === 'Aaron'),
        Lydia: employees.find(e => e.department_name === 'Ward 31'),
        John: employees.find(e => e.department_name === 'Ward 62' && e.first_name === 'John'), // Resp APN
        Angelica: employees.find(e => e.department_name === 'Ward 62' && e.first_name === 'Angelica'),
        Kelvin: employees.find(e => e.department_name === 'Ward 66' && e.first_name === 'Kelvin'),
        Mabel: employees.find(e => e.department_name === 'Ward 86')
    };

    const shift8to5 = { id: amShiftType?.id, title: "AM", start_time: "08:00:00", end_time: "17:00:00" };

    for (const date of allDates) {
        const day = getDay(date);
        const isPH = SG_PUBLIC_HOLIDAYS_2026.has(date);

        if (!isPH) {
            if (pameTeam.Aaron) {
                if (day === 1) await assignShift(pameTeam.Aaron, date, shift8to5, false, true);
                if (day === 2) await assignShift(pameTeam.Aaron, date, amShiftType, false, true);
            }
            if (pameTeam.Lydia && day >= 1 && day <= 5) {
                await assignShift(pameTeam.Lydia, date, amShiftType, false, true);
            }
            if (pameTeam.John) {
                // John gets "AM (RES)" (Purple if SQL run)
                if (day === 1 || day === 4) await assignShift(pameTeam.John, date, amResShiftType, false, true);
                if (day === 2) await assignShift(pameTeam.John, date, amShiftType, false, true);
            }
            if (pameTeam.Kelvin && day === 4) {
                await assignShift(pameTeam.Kelvin, date, amShiftType, false, true);
            }
            if (pameTeam.Mabel && day === 5) {
                await assignShift(pameTeam.Mabel, date, amShiftType, false, true);
            }
        }
    }

    /* =========================
       NIGHT LOGIC
    ========================= */
    const weekNightDay = {};
    const weeksMap = new Map();
    for (const date of allDates) {
      const day = getDay(date);
      const isPH = SG_PUBLIC_HOLIDAYS_2026.has(date);
      if (day >= 1 && day <= 5 && !isPH) {
        const wk = getWeekKey(date);
        if (!weeksMap.has(wk)) weeksMap.set(wk, []);
        weeksMap.get(wk).push(date);
      }
    }
    weeksMap.forEach((dates, wk) => {
      if (dates.length) weekNightDay[wk] = dates[Math.floor(Math.random() * dates.length)];
    });

    /* =========================
       MAIN FILL LOOP
    ========================= */
    const phShift = { id: null, title: "PH", start_time: null, end_time: null };

    for (let j = 0; j < allDates.length; j++) {
      const date = allDates[j];
      const day = getDay(date);
      const weekKey = getWeekKey(date);
      const isPH = SG_PUBLIC_HOLIDAYS_2026.has(date);

      coverageStats[date] ??= {}; 

      /* ---------- (A) RRT ---------- */
      if (day >= 1 && day <= 5 && !isPH && rrtShiftType && !rrtCoveredDates.has(date)) {
        const sorted = [...rrtEligibleEmployees].sort((a, b) => {
            const countA = employeeRrtCount[a.id] ?? 0;
            const countB = employeeRrtCount[b.id] ?? 0;
            if (countA !== countB) return countA - countB;
            return getRrtPriorityScore(a.department_name) - getRrtPriorityScore(b.department_name); 
        });

        for (const emp of sorted) {
          const key = `${emp.id}-${date}`;
          if (existingSlots.has(key) || forcedOffDays.has(key)) continue;

          employeeWeeklyWork[emp.id] ??= {};
          employeeWeeklyWork[emp.id][weekKey] ??= 0;
          if (employeeWeeklyWork[emp.id][weekKey] < 5) {
             if (await assignShift(emp, date, rrtShiftType, true, false, false)) {
                employeeRrtCount[emp.id]++;
                break;
             }
          }
        }
      }

      /* ---------- (B) NIGHT ---------- */
      if (weekNightDay[weekKey] === date && nightShiftType) {
        const sortedCE = [...ceEmployees].sort((a, b) => (employeeNightCount[a.id] ?? 0) - (employeeNightCount[b.id] ?? 0));
        for (const emp of sortedCE) {
          const key = `${emp.id}-${date}`;
          if (existingSlots.has(key)) continue;

          const d = new Date(date);
          const weekStart = new Date(d); weekStart.setDate(d.getDate() - d.getDay()); 
          const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
          const existingNight = await client.query(
            `SELECT 1 FROM shifts s JOIN shift_types st ON s.shift_type_id = st.id
             WHERE s.user_id = $1 AND s.date BETWEEN $2 AND $3 AND st.name = 'N' LIMIT 1`,
            [emp.id, weekStart.toISOString().split("T")[0], weekEnd.toISOString().split("T")[0]]
          );
          if (existingNight.rows.length > 0) continue;
          if (nightWorkedThisWeek[emp.id]?.has(weekKey)) continue;

          if (await assignShift(emp, date, nightShiftType, false, false, false)) {
            employeeNightCount[emp.id]++;
            nightWorkedThisWeek[emp.id] ??= new Set();
            nightWorkedThisWeek[emp.id].add(weekKey);
            const nextDate = allDates[j + 1];
            if (nextDate) forcedOffDays.add(`${emp.id}-${nextDate}`);
            break;
          }
        }
      }

      /* ---------- (C) REGULAR / OFF ---------- */
      for (let i = 0; i < employees.length; i++) {
        const emp = employees[i];
        const key = `${emp.id}-${date}`;
        if (existingSlots.has(key)) {
          if (!forcedOffDays.has(key)) skippedCount++; 
          continue;
        }

        employeeWeeklyWork[emp.id] ??= {};
        employeeWeeklyWork[emp.id][weekKey] ??= 0;
        const worked = employeeWeeklyWork[emp.id][weekKey];
        const isPas = PAS_DEPARTMENTS.includes(emp.department_name);
        
        let shouldWork = false;

        if (day === 0 || isPH) {
            shouldWork = false; 
        } else if (isPas && day === 6) {
            shouldWork = false; 
        } else if (forcedOffDays.has(key)) {
            shouldWork = false;
        } else if (day === 6) {
            shouldWork = (nightWorkedThisWeek[emp.id]?.has(weekKey) && worked < 5);
        } else {
            shouldWork = worked < 5;
        }

        if (shouldWork) {
          coverageStats[date][emp.department_name] ??= { AM: 0, PM: 0, RRT: 0 };
          const stats = coverageStats[date][emp.department_name];
          
          const amCount = stats.AM;
          const pmEffectiveCount = stats.PM + stats.RRT;
          
          let shiftType;
          if (day === 6 || isPas) {
             shiftType = amShiftType;
          } else {
             if (pmShiftType && pmEffectiveCount < amCount) {
                 shiftType = pmShiftType;
             } else {
                 shiftType = amShiftType;
             }
          }
          await assignShift(emp, date, shiftType, false, false, false);
        } else {
          if (isPH) {
             await assignShift(emp, date, phShift, false, false, true);
          } else {
             const offType = (i + j) % 2 === 0 ? doShiftType : rdShiftType;
             await assignShift(emp, date, offType, false, false, true);
          }
        }
      }
    }

    await client.query("COMMIT");
    res.json({ message: "Roster generated!", created: createdCount, skipped: skippedCount });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Failed", error: err.message });
  } finally {
    client.release();
  }
};