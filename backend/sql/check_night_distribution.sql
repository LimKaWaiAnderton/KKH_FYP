-- Check Night shift distribution for CE employees
-- Date range: March 1-31, 2026

SELECT 
  u.first_name,
  u.last_name,
  d.name as department,
  COUNT(s.id) as night_shift_count,
  STRING_AGG(TO_CHAR(s.date, 'Mon DD'), ', ' ORDER BY s.date) as night_shift_dates
FROM shifts s
INNER JOIN users u ON s.user_id = u.id
INNER JOIN departments d ON u.department_id = d.id
WHERE s.shift_type_id = (SELECT id FROM shift_types WHERE name = 'N')
  AND s.date >= '2026-03-01'
  AND s.date <= '2026-03-31'
  AND d.name = 'CE'
GROUP BY u.id, u.first_name, u.last_name, d.name
ORDER BY night_shift_count DESC, u.last_name;

-- Individual total N shift count per CE employee (like RRT SQL)
SELECT 
  u.first_name,
  u.last_name,
  d.name as department,
  COUNT(s.id) as n_shift_count
FROM shifts s
INNER JOIN users u ON s.user_id = u.id
INNER JOIN departments d ON u.department_id = d.id
WHERE s.shift_type_id = (SELECT id FROM shift_types WHERE name = 'N')
  AND s.date >= '2026-03-01'
  AND s.date <= '2026-03-31'
  AND d.name = 'CE'
GROUP BY u.id, u.first_name, u.last_name, d.name
ORDER BY n_shift_count ASC, d.name, u.last_name;

SELECT 
  DATE_TRUNC('week', s.date)::date as week_start,
  TO_CHAR(s.date, 'Day') as day_of_week,
  TO_CHAR(s.date, 'Mon DD') as shift_date,
  u.first_name || ' ' || u.last_name as employee_name,
  COUNT(*) as night_shifts_this_week
FROM shifts s
INNER JOIN users u ON s.user_id = u.id
WHERE s.shift_type_id = (SELECT id FROM shift_types WHERE name = 'N')
  AND s.date >= '2026-03-01'
  AND s.date <= '2026-03-31'
GROUP BY DATE_TRUNC('week', s.date), s.date, u.first_name, u.last_name
ORDER BY week_start, s.date;

SELECT 
  d.name as department,
  COUNT(s.id) as night_shift_count
FROM shifts s
INNER JOIN users u ON s.user_id = u.id
INNER JOIN departments d ON u.department_id = d.id
WHERE s.shift_type_id = (SELECT id FROM shift_types WHERE name = 'N')
  AND s.date >= '2026-03-01'
  AND s.date <= '2026-03-31'
GROUP BY d.name
ORDER BY night_shift_count DESC;

