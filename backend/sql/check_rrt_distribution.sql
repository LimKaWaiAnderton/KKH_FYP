-- Check RRT distribution for all RRT-eligible employees (CE, Ward 56, Ward 62)
-- Date range: February 1-28, 2026

SELECT 
  u.first_name,
  u.last_name,
  d.name as department,
  COALESCE(COUNT(s.id), 0) as rrt_count
FROM users u
INNER JOIN departments d ON u.department_id = d.id
LEFT JOIN shifts s ON u.id = s.user_id 
  AND s.is_rrt = true
  AND s.date >= '2026-02-01'
  AND s.date <= '2026-02-28'
WHERE u.role_id = 2 
  AND u.is_active = true
  AND d.name IN ('CE', 'Ward 56', 'Ward 62')
GROUP BY u.id, u.first_name, u.last_name, d.name
ORDER BY rrt_count ASC, d.name, u.last_name;

-- Summary: Total RRT shifts assigned in February
SELECT 
  COUNT(*) as total_rrt_shifts,
  COUNT(DISTINCT user_id) as unique_employees_with_rrt
FROM shifts
WHERE is_rrt = true
  AND date >= '2026-02-01'
  AND date <= '2026-02-28';

-- Individual RRT counts with employee names
SELECT 
  u.first_name,
  u.last_name,
  d.name as department,
  COUNT(s.id) as rrt_count
FROM shifts s
INNER JOIN users u ON s.user_id = u.id
INNER JOIN departments d ON u.department_id = d.id
WHERE s.is_rrt = true
  AND s.date >= '2026-02-01'
  AND s.date <= '2026-02-28'
GROUP BY u.id, u.first_name, u.last_name, d.name
ORDER BY rrt_count DESC, d.name, u.last_name;
