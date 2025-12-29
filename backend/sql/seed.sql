begin; 

insert into public.departments (name) VALUES
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

insert into public.roles (name) VALUES
('admin'),
('user');

insert into public.users
(id, first_name, last_name, email, department_id, role_id, password_hash)
VALUES
-- Clara = regular user
-- Anderton = admin user
(
  '43f7e8dc-365b-4aa1-ace6-44b790687780',
  'Clara',
  'Lim',
  'clara@kkh.com.sg',
  1,
  2,
  '$2b$10$1vbz4yLy.5F7hlkX.9xbAeHoJ/rLsGi.TSQGzUDtoGKdB/mRPLWOW'
),
(
  'a1b2c3d4-e5f6-7890-1234-abcdef987654',
  'Anderton',
  'Lim',
  'anderton@kkh.com.sg',
  1,
  1,
  '$2b$10$benyyj6c0edbcqGbHEMQ7uunkKGy7UPDZaHyZK.8mE.dQPMNdmm9y'
);

insert into public.leave_types (name) VALUES
('Annual Leave'),
('Sick Leave'),
('Childcare Leave');

insert into public.user_leave_balance
(user_id, leave_type_id, used_days, remaining_days, total_quota)
VALUES
('43f7e8dc-365b-4aa1-ace6-44b790687780', 1, 0, 7, 7),
('43f7e8dc-365b-4aa1-ace6-44b790687780', 2, 0, 14, 14),
('43f7e8dc-365b-4aa1-ace6-44b790687780', 3, 0, 7, 7);

insert into public.shift_types (name, color_hex) VALUES
('AM', '#000000'),
('RD', '#E69A00'),
('PM', '#1E8A3C'),
('OFF', '#CCCCCC');

commit;
