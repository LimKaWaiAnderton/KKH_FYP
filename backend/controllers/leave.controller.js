import pool from '../db/pool.js';

const roleName = {
    admin: 1,
    employee: 2,
};

export const getLeaveRequests = async (req, res) => {
    const { id, role } = req.user;
    let leaveReqHistory;

    try {
        if (role === roleName.admin) {
            leaveReqHistory = await pool.query(
                `SELECT
                    lr.id,
                    lr.start_date,
                    lr.end_date,
                    lr.total_days,
                    lr.status,
                    lr.applied_date,
                    lt.name AS leave_type,
                    u.first_name,
                    u.last_name
                FROM leave_requests lr
                JOIN leave_types lt
                ON lr.leave_type_id = lt.id
                JOIN users u
                ON lr.user_id = u.id
                ORDER BY lr.applied_date DESC`
            );
        } else {
            leaveReqHistory = await pool.query(
                `SELECT
                    lr.id,
                    lr.start_date,
                    lr.end_date,
                    lr.total_days,
                    lr.status,
                    lr.applied_date,
                    lt.name AS leave_type
                FROM leave_requests lr
                JOIN leave_types lt
                ON lr.leave_type_id = lt.id
                WHERE lr.user_id = $1
                ORDER BY lr.applied_date DESC`,
                [id]
            );
        }
        res.json(leaveReqHistory.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const getLeaveBalance = async (req, res) => {
    const { id } = req.user;
    try {
        const balance = await pool.query(
            `SELECT
                ulb.id,
                ulb.used_days,
                ulb.remaining_days,
                ulb.total_quota,
                lt.name AS leave_type
            FROM user_leave_balance ulb
            JOIN leave_types lt
            ON ulb.leave_type_id = lt.id
            WHERE ulb.user_id = $1`,
            [id]
        );
        res.json(balance.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const getLeaveType = async (req, res) => {
    try {
        const leaveTypes = await pool.query(
            `SELECT * FROM leave_types`
        );
        res.json(leaveTypes.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export const applyLeave = async (req, res) => {
    const { id } = req.user;
    try {
        const { leave_type_id, start_date, end_date } = req.body;

        if (!leave_type_id || !start_date || !end_date) {
            return res.status(400).json({ msg: 'Please provide all required fields.' });
        }

        if (new Date(start_date) > new Date(end_date)) {
            return res.status(400).json({ msg: 'End date must be after start date.' });
        }

        const overlapCheck = await pool.query(
            `
            SELECT 1
            FROM leave_requests
            WHERE user_id = $1
              AND status IN ('pending', 'approved')
              AND start_date <= $3
              AND end_date >= $2
            `,
            [id, start_date, end_date]
        );

        if (overlapCheck.rows.length > 0) {
            return res.status(400).json({
                msg: 'You already have a leave request overlapping these dates.'
            });
        }

        const start = new Date(start_date);
        const end = new Date(end_date);
        const total_days =
            Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        const balanceRes = await pool.query(
            `SELECT remaining_days
            FROM user_leave_balance
            WHERE user_id = $1 AND leave_type_id = $2`,
            [id, leave_type_id]
        );

        if (balanceRes.rows.length === 0) {
            return res.status(400).json({ msg: 'Leave balance not found for this leave type.' });
        }

        const { remaining_days } = balanceRes.rows[0];
        if (remaining_days < total_days) {
            return res.status(400).json({
                msg: `Insufficient leave balance. You only have ${remaining_days} day(s) left.`
            });
        }

        const insertRes = await pool.query(
            `INSERT INTO leave_requests
                (user_id, leave_type_id, start_date, end_date, total_days)
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING *`,
            [id, leave_type_id, start_date, end_date, total_days]
        );

        // Fetch user's name for the notification message
        const userRes = await pool.query(
            `SELECT first_name, last_name FROM users WHERE id = $1`,
            [id]
        );

        const userName = `${userRes.rows[0].first_name} ${userRes.rows[0].last_name}`;

        // Notify admins
        await pool.query(
            `
            INSERT INTO notifications (user_id, title, message, type)
            SELECT
                u.id,
                'Leave Application',
                $1,
                'info'
            FROM users u
            JOIN roles r
            ON u.role_id = r.id
            WHERE r.name = 'admin'
            `,
            [`${userName} applied for leave from ${start_date} to ${end_date}.`]
        );

        const leaveId = insertRes.rows[0].id;

        // Fetch the newly created leave request with leave type name to update UI
        const newLeaveReq = await pool.query(
            `SELECT
            lr.id,
            lr.start_date,
            lr.end_date,
            lr.total_days,
            lr.status,
            lr.applied_date,
            lt.name AS leave_type
        FROM leave_requests lr
        JOIN leave_types lt
        ON lr.leave_type_id = lt.id
        WHERE lr.id = $1`,
            [leaveId]
        );

        res.status(201).json(newLeaveReq.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const getLeaveRequestById = async (req, res) => {
    const { id } = req.params;
    try {
        const leaveRes = await pool.query(
            `SELECT
                lr.id,
                lr.start_date,
                lr.end_date,
                lr.total_days,
                lr.status,
                lr.applied_date,
                lt.name AS leave_type,
                u.first_name,
                u.last_name,
                d.name AS department_name
            FROM leave_requests lr
            JOIN leave_types lt
            ON lr.leave_type_id = lt.id
            JOIN users u
            ON lr.user_id = u.id
            JOIN departments d
            ON u.department_id = d.id
            WHERE lr.id = $1`,
            [id]
        );

        if (leaveRes.rows.length === 0) {
            return res.status(404).json({ msg: 'Leave application not found.' });
        }

        res.json(leaveRes.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const manageLeaveRequest = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['approved', 'rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ msg: 'Invalid status value.' });
    }

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const leaveRes = await client.query(
            `SELECT user_id, leave_type_id, total_days, status
            FROM leave_requests
            WHERE id = $1
            FOR UPDATE`,
            [id]
        );

        if (leaveRes.rows.length === 0) {
            throw new Error('Leave request not found.');
        };

        const leave = leaveRes.rows[0];

        if (leave.status !== 'pending') {
            throw new Error('Leave request already processed.');
        };

        if (status === 'approved') {
            const balanceRes = await client.query(
                `SELECT remaining_days
                FROM user_leave_balance
                WHERE user_id = $1 AND leave_type_id = $2
                FOR UPDATE`,
                [leave.user_id, leave.leave_type_id]
            );

            if (balanceRes.rows.length === 0) {
                throw new Error('Leave balance not found.');
            }

            if (balanceRes.rows[0].remaining_days < leave.total_days) {
                throw new Error('Insufficient leave balance.');
            }

            const conflictRes = await client.query(
                `
                SELECT COUNT(*) AS conflict_count
                FROM shifts s
                JOIN leave_requests lr ON lr.id = $1
                JOIN generate_series(
                lr.start_date,
                lr.end_date,
                interval '1 day'
                ) d ON s.date = d::date
                 WHERE s.user_id = lr.user_id
                `,
                [id]
            );

            if (Number(conflictRes.rows[0].conflict_count) > 0) {
                throw new Error(
                    'User already has assigned shifts during the leave period.'
                );
            }

            const leaveCapRes = await client.query(
                `
                SELECT
                  d::date AS leave_date,
                  COUNT(s.id) AS leave_count
                FROM leave_requests lr
                JOIN generate_series(
                  lr.start_date,
                  lr.end_date,
                  interval '1 day'
                ) d ON true
                LEFT JOIN shifts s
                  ON s.date = d::date
                  AND s.title IS NOT NULL
                  AND s.shift_type_id IS NULL
                WHERE lr.id = $1
                GROUP BY d::date
                HAVING COUNT(s.id) >= 7
                `,
                [id]
              );
              
              if (leaveCapRes.rows.length > 0) {
                throw new Error(
                  'Leave limit reached. Maximum 7 staff can be on leave on a given day.'
                );
              }              

            await client.query(
                `
                UPDATE user_leave_balance
                SET
                  used_days = used_days + $1,
                  remaining_days = remaining_days - $1
                WHERE user_id = $2
                  AND leave_type_id = $3
                `,
                [leave.total_days, leave.user_id, leave.leave_type_id]
            );
        }

        await client.query(
            `UPDATE leave_requests
            SET status = $1, updated_at = NOW()
            WHERE id = $2`,
            [status, id]
        );

        const updatedLeaveReq = await client.query(
            `SELECT
            lr.id,
            lr.start_date,
            lr.end_date,
            lr.total_days,
            lr.status,
            lr.applied_date,
            lt.name AS leave_type,
            u.first_name,
            u.last_name
        FROM leave_requests lr
        JOIN leave_types lt
        ON lr.leave_type_id = lt.id
        JOIN users u
        ON lr.user_id = u.id
        WHERE lr.id = $1`,
            [id]
        );

        if (status === 'approved') {
            await client.query(
                `
                INSERT INTO shifts (user_id, date, title, color_hex, published)
                SELECT
                  lr.user_id,
                  d::date,
                  lt.name,
                  '#009999',
                  true
                FROM leave_requests lr
                JOIN leave_types lt ON lr.leave_type_id = lt.id
                JOIN generate_series(lr.start_date, lr.end_date, interval '1 day') d
                  ON true
                WHERE lr.id = $1
                `,
                [id]
            );
        }

        // Get leave request details for notification
        const leaveDetails = updatedLeaveReq.rows[0];
        const startDate = new Date(leaveDetails.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const endDate = new Date(leaveDetails.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const dateRange = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
        
        const title = status === 'approved'
            ? `Your ${leaveDetails.leave_type} has been approved`
            : `Your ${leaveDetails.leave_type} has been rejected`;
            
        const message = status === 'approved'
            ? `Your ${leaveDetails.leave_type} request for ${dateRange} (${leaveDetails.total_days} day${leaveDetails.total_days > 1 ? 's' : ''}) has been approved.`
            : `Your ${leaveDetails.leave_type} request for ${dateRange} has been rejected.`;

        await client.query(
            `
            INSERT INTO notifications (user_id, title, message, type)
            VALUES ($1, $2, $3, $4)
            `,
            [leave.user_id, title, message, 'info']
        );

        await client.query('COMMIT');

        return res.json(updatedLeaveReq.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).json({ msg: err.message });
    } finally {
        client.release();
    }
};