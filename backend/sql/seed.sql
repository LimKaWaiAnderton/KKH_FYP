BEGIN;

INSERT INTO public.departments (name) VALUES
('CE'),
('Ward 65'),
('CICU'),
('NICU (Blue)'),
('NICU (Pink)'),
('Ward 31'),
('Ward 56'),
('Ward 62'),
('Ward 66'),
('Ward 75'),
('Ward 76'),
('Surg/Clinic'),
('Surg/85'),
('Surg/55');

INSERT INTO public.roles (name) VALUES
('admin'),
('user');

INSERT INTO public.users (id, first_name, last_name, email, department_id, role_id, password_hash) VALUES
-- Password for all users: mypassword
(gen_random_uuid(), 'Anderton', 'Lim', 'anderton@kkh.com.sg', 1, 1, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa'),
(gen_random_uuid(), 'Clara', 'Lim', 'clara@kkh.com.sg', 1, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa'),
(gen_random_uuid(), 'Sonia', 'Yeong', 'sonia@kkh.com.sg', 1, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa'),
(gen_random_uuid(), 'Nico', 'Sim', 'nico@kkh.com.sg', 1, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa'),
(gen_random_uuid(), 'Likai', 'Tan', 'likai@kkh.com.sg', 1, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa'),
(gen_random_uuid(), 'Charlotte', 'Chia', 'charlotte@kkh.com.sg', 7, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa'),
(gen_random_uuid(), 'Insyirah', 'Nur', 'insyirah@kkh.com.sg', 7, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa'),
(gen_random_uuid(), 'Angelica', 'Torres', 'angelica@kkh.com.sg', 8, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa'),
(gen_random_uuid(), 'John', 'Doe', 'john@kkh.com.sg', 8, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa');

INSERT INTO public.shift_types (name, color_hex) VALUES
('AM', '#000000'),
('PM', '#1E8A3C'),
('RRT', '#005983'),
('DO', '#E69A00'),
('RD', '#E69A00');

INSERT INTO public.shifts (shift_type_id, title, color_hex, start_time, end_time)
SELECT
  st.id,
  st.name,
  st.color_hex,
  CASE st.name
    WHEN 'AM' THEN TIME '07:00'
    WHEN 'PM' THEN TIME '15:00'
    WHEN 'RRT' THEN TIME '19:00'
    ELSE NULL
  END,
  CASE st.name
    WHEN 'AM' THEN TIME '15:00'
    WHEN 'PM' THEN TIME '23:00'
    WHEN 'RRT' THEN TIME '07:00'
    ELSE NULL
  END
FROM public.shift_types st
WHERE st.name IN ('AM', 'PM', 'RRT', 'RD', 'DO');

INSERT INTO public.leave_types (name) VALUES
('Annual Leave'),
('Sick Leave'),
('Childcare Leave');

INSERT INTO public.user_leave_balance (user_id, leave_type_id, used_days, remaining_days, total_quota)
SELECT 
  u.id,
  lt.id,
  0,
  CASE lt.name
    WHEN 'Annual Leave' THEN 7
    WHEN 'Sick Leave' THEN 14
    WHEN 'Childcare Leave' THEN 7
  END,
  CASE lt.name
    WHEN 'Annual Leave' THEN 7
    WHEN 'Sick Leave' THEN 14
    WHEN 'Childcare Leave' THEN 7
  END
FROM public.users u
CROSS JOIN public.leave_types lt
WHERE u.role_id != 1; -- exclude admin

COMMIT;
