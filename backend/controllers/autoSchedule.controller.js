import pool from "../db/pool.js";

/* =========================
   GENERATE ROSTER
   Automatically generates shifts for employees within a date range
   - Respects existing leaves (approved)
   - Does not overwrite unpublished shifts already assigned by manager
   ========================= */
export const generateRoster = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return res.status(400).json({ message: "Start date cannot be after end date" });
    }

    // Start transaction
    await pool.query('BEGIN');

    // 1. Get all active employees (users with role_id = 2)
    const employeesResult = await pool.query(
      `
      SELECT id, first_name, last_name, department_id
      FROM users
      WHERE role_id = 2 AND is_active = true
      ORDER BY department_id, last_name, first_name
      `
    );

    const employees = employeesResult.rows;

    if (employees.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ message: "No active employees found" });
    }

    // 2. Get all shift types to use for rotation
    const shiftTypesResult = await pool.query(
      `
      SELECT id, name, start_time, end_time, color_hex
      FROM shift_types
      ORDER BY id
      `
    );

    const shiftTypes = shiftTypesResult.rows;

    if (shiftTypes.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ message: "No shift types found in the system" });
    }

    // 3. Get all dates that have existing shifts or approved leaves
    // to exclude them from generation
    // Note: Approved leaves are stored in shifts table with title (not shift_type_id)
    const existingShiftsResult = await pool.query(
      `
      SELECT DISTINCT user_id, date::text as date
      FROM shifts
      WHERE date >= $1 AND date <= $2
      `,
      [startDate, endDate]
    );

    // Create a Set of "userId-date" combinations to check against
    const existingSlots = new Set(
      existingShiftsResult.rows.map(row => `${row.user_id}-${row.date}`)
    );

    // 4. Generate shifts for each employee on each date
    let shiftsCreated = 0;
    let shiftsSkipped = 0;
    const allDates = [];
    
    // Generate array of all dates in range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      allDates.push(new Date(d).toISOString().split('T')[0]);
    }

    // Simple rotation algorithm: assign shifts in a round-robin fashion
    // You can customize this logic based on your requirements
    for (let i = 0; i < employees.length; i++) {
      const employee = employees[i];
      
      for (let j = 0; j < allDates.length; j++) {
        const date = allDates[j];
        const slotKey = `${employee.id}-${date}`;
        
        // Skip if employee already has a shift or leave on this date
        if (existingSlots.has(slotKey)) {
          shiftsSkipped++;
          continue;
        }

        // Rotate through shift types based on date index and employee index
        // This ensures variety and fair distribution
        const shiftTypeIndex = (i + j) % shiftTypes.length;
        const shiftType = shiftTypes[shiftTypeIndex];

        // Insert the shift as unpublished (draft)
        await pool.query(
          `
          INSERT INTO shifts
          (user_id, date, shift_type_id, start_time, end_time, published)
          VALUES ($1, $2, $3, $4, $5, false)
          `,
          [employee.id, date, shiftType.id, shiftType.start_time, shiftType.end_time]
        );

        shiftsCreated++;
      }
    }

    // Commit transaction
    await pool.query('COMMIT');

    res.json({
      message: "Roster generated successfully",
      shiftsCreated,
      shiftsSkipped,
      employeesProcessed: employees.length,
      dateRange: { startDate, endDate }
    });

  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error generating roster:', err);
    res.status(500).json({ message: "Failed to generate roster", error: err.message });
  }
};
