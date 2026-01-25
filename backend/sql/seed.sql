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

INSERT INTO public.shift_types (name, color_hex, start_time, end_time) VALUES
('AM', '#000000', '07:00:00', '16:00:00'),
('PM', '#1E8A3C', '11:30:00', '20:30:00'),
('RRT', '#005983', NULL, NULL),
('DO', '#E69A00', NULL, NULL),
('RD', '#E69A00', NULL, NULL);

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


------------------------------------------------------------------------------------------
-- FOR TESTING PURPOSES: INSERT SAMPLE LEAVE REQUESTS & UPDAT LEAVE BALANCE FOR USERS ----
------------------------------------------------------------------------------------------
-- 7 approved leave requests on 2 Feb 2026
INSERT INTO public.leave_requests
  (user_id, leave_type_id, start_date, end_date, total_days, status)
VALUES
-- Clara – Annual Leave
(
  (SELECT id FROM public.users WHERE email = 'clara@kkh.com.sg'),
  (SELECT id FROM public.leave_types WHERE name = 'Annual Leave'),
  '2026-02-02', '2026-02-02', 1, 'approved'
),

-- Sonia – Sick Leave
(
  (SELECT id FROM public.users WHERE email = 'sonia@kkh.com.sg'),
  (SELECT id FROM public.leave_types WHERE name = 'Sick Leave'),
  '2026-02-02', '2026-02-02', 1, 'approved'
),

-- Nico – Childcare Leave
(
  (SELECT id FROM public.users WHERE email = 'nico@kkh.com.sg'),
  (SELECT id FROM public.leave_types WHERE name = 'Childcare Leave'),
  '2026-02-02', '2026-02-02', 1, 'approved'
),

-- Likai – Annual Leave
(
  (SELECT id FROM public.users WHERE email = 'likai@kkh.com.sg'),
  (SELECT id FROM public.leave_types WHERE name = 'Annual Leave'),
  '2026-02-02', '2026-02-02', 1, 'approved'
),

-- Charlotte – Sick Leave
(
  (SELECT id FROM public.users WHERE email = 'charlotte@kkh.com.sg'),
  (SELECT id FROM public.leave_types WHERE name = 'Sick Leave'),
  '2026-02-02', '2026-02-02', 1, 'approved'
),

-- Insyirah – Annual Leave
(
  (SELECT id FROM public.users WHERE email = 'insyirah@kkh.com.sg'),
  (SELECT id FROM public.leave_types WHERE name = 'Annual Leave'),
  '2026-02-02', '2026-02-02', 1, 'approved'
),

-- Angelica – Childcare Leave (7th person)
(
  (SELECT id FROM public.users WHERE email = 'angelica@kkh.com.sg'),
  (SELECT id FROM public.leave_types WHERE name = 'Childcare Leave'),
  '2026-02-02', '2026-02-02', 1, 'approved'
);

-- Insert leave shifts (draft, unpublished)
INSERT INTO public.shifts
  (user_id, date, title, color_hex, start_time, end_time, published)
SELECT
  lr.user_id,
  lr.start_date,
  lt.name,          
  '#009999',        
  NULL,
  NULL,
  true             
FROM public.leave_requests lr
JOIN public.leave_types lt
  ON lr.leave_type_id = lt.id
WHERE lr.status = 'approved'
  AND lr.start_date = '2026-02-02';

-- Update user leave balances
UPDATE public.user_leave_balance ulb
SET
  used_days = used_days + 1,
  remaining_days = remaining_days - 1
WHERE (user_id, leave_type_id) IN (

  ((SELECT id FROM public.users WHERE email = 'clara@kkh.com.sg'),
   (SELECT id FROM public.leave_types WHERE name = 'Annual Leave')),

  ((SELECT id FROM public.users WHERE email = 'sonia@kkh.com.sg'),
   (SELECT id FROM public.leave_types WHERE name = 'Sick Leave')),

  ((SELECT id FROM public.users WHERE email = 'nico@kkh.com.sg'),
   (SELECT id FROM public.leave_types WHERE name = 'Childcare Leave')),

  ((SELECT id FROM public.users WHERE email = 'likai@kkh.com.sg'),
   (SELECT id FROM public.leave_types WHERE name = 'Annual Leave')),

  ((SELECT id FROM public.users WHERE email = 'charlotte@kkh.com.sg'),
   (SELECT id FROM public.leave_types WHERE name = 'Sick Leave')),

  ((SELECT id FROM public.users WHERE email = 'insyirah@kkh.com.sg'),
   (SELECT id FROM public.leave_types WHERE name = 'Annual Leave')),

  ((SELECT id FROM public.users WHERE email = 'angelica@kkh.com.sg'),
   (SELECT id FROM public.leave_types WHERE name = 'Childcare Leave'))
);

COMMIT;
