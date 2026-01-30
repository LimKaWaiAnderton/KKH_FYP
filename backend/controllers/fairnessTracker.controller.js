import pool from "../db/pool.js";

// POST /api/auto-schedule/fairness-tracker
export const fairnessTracker = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" });
    }

    // 1. Get employees with Department info to determine eligibility
    const employeesResult = await pool.query(`
      SELECT u.id, u.first_name, u.last_name, d.name as department_name 
      FROM users u
      JOIN departments d ON u.department_id = d.id
      WHERE u.role_id = 2 AND u.is_active = true 
      ORDER BY u.first_name ASC
    `);
    
    // 2. Define Eligibility Logic (Matching the Generator logic)
    const employees = employeesResult.rows.map(emp => {
      const dept = emp.department_name;
      const name = emp.first_name;

      // GPAPN: Ward 75 (Aaron only), Ward 56, Ward 62, Ward 66
      const can_do_gpapn = 
        (dept === "Ward 75" && name === "Aaron") ||
        ["Ward 56", "Ward 62", "Ward 66"].includes(dept);

      // NNJ@Clinic: PAME (Wards) + NICU (Excluded CE in v11)
      const can_do_nnj = 
        dept.startsWith("Ward") || 
        dept.startsWith("NICU");

      return {
        ...emp,
        can_do_gpapn,
        can_do_nnj
      };
    });

    // 3. Get Counts
    const shiftCountsResult = await pool.query(`
      SELECT user_id, 
        SUM(CASE WHEN st.name = 'N' THEN 1 ELSE 0 END) AS night_count,
        SUM(CASE WHEN st.name = 'RRT' OR s.is_rrt = true THEN 1 ELSE 0 END) AS rrt_count,
        SUM(CASE WHEN st.name = 'GPAPN' OR s.title = 'GPAPN' THEN 1 ELSE 0 END) AS gpapn_count,
        SUM(CASE 
            WHEN st.name IN ('NNJ Clinic', 'NNJ@Home') OR s.title IN ('NNJ Clinic', 'NNJ@Home') 
            THEN 1 ELSE 0 
        END) AS nnj_count
      FROM shifts s
      LEFT JOIN shift_types st ON s.shift_type_id = st.id
      WHERE s.date BETWEEN $1 AND $2
      GROUP BY user_id
    `, [startDate, endDate]);

    const nightCounts = {};
    const rrtCounts = {};
    const gpapnCounts = {};
    const nnjCounts = {};

    shiftCountsResult.rows.forEach(row => {
      nightCounts[row.user_id] = Number(row.night_count);
      rrtCounts[row.user_id] = Number(row.rrt_count);
      gpapnCounts[row.user_id] = Number(row.gpapn_count);
      nnjCounts[row.user_id] = Number(row.nnj_count);
    });

    res.json({ nightCounts, rrtCounts, gpapnCounts, nnjCounts, employees });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch fairness tracker data", error: err.message });
  }
};