-- Cleaned Seed Script for KKH_FYP

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- 1. Base Tables
INSERT INTO public.departments OVERRIDING SYSTEM VALUE VALUES (1, 'CE');
INSERT INTO public.departments OVERRIDING SYSTEM VALUE VALUES (2, 'Ward 65');
INSERT INTO public.departments OVERRIDING SYSTEM VALUE VALUES (3, 'CICU');
INSERT INTO public.departments OVERRIDING SYSTEM VALUE VALUES (4, 'NICU (Blue)');
INSERT INTO public.departments OVERRIDING SYSTEM VALUE VALUES (5, 'NICU (Pink)');
INSERT INTO public.departments OVERRIDING SYSTEM VALUE VALUES (6, 'Ward 31');
INSERT INTO public.departments OVERRIDING SYSTEM VALUE VALUES (7, 'Ward 56');
INSERT INTO public.departments OVERRIDING SYSTEM VALUE VALUES (8, 'Ward 62');
INSERT INTO public.departments OVERRIDING SYSTEM VALUE VALUES (9, 'Ward 66');
INSERT INTO public.departments OVERRIDING SYSTEM VALUE VALUES (10, 'Ward 75');
INSERT INTO public.departments OVERRIDING SYSTEM VALUE VALUES (11, 'Ward 76');
INSERT INTO public.departments OVERRIDING SYSTEM VALUE VALUES (12, 'Surg/Clinic');
INSERT INTO public.departments OVERRIDING SYSTEM VALUE VALUES (13, 'Surg/85');
INSERT INTO public.departments OVERRIDING SYSTEM VALUE VALUES (14, 'Surg/55');
INSERT INTO public.departments OVERRIDING SYSTEM VALUE VALUES (15, 'Ward 86');

INSERT INTO public.leave_types OVERRIDING SYSTEM VALUE VALUES (1, 'Annual Leave');
INSERT INTO public.leave_types OVERRIDING SYSTEM VALUE VALUES (2, 'Sick Leave');
INSERT INTO public.leave_types OVERRIDING SYSTEM VALUE VALUES (3, 'Childcare Leave');

INSERT INTO public.roles OVERRIDING SYSTEM VALUE VALUES (1, 'admin');
INSERT INTO public.roles OVERRIDING SYSTEM VALUE VALUES (2, 'user');

-- 2. Users
INSERT INTO public.users VALUES ('095a7fca-c294-440e-b108-5effafbcd15e', 'Anderton', 'Lim', 'anderton@kkh.com.sg', 12348594, 1, 1, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:54:45.582252', true);
INSERT INTO public.users VALUES ('a213d2e4-4377-418f-9db8-973d2ab04c19', 'Clara', 'Lim', 'clara@kkh.com.sg', 95737291, 1, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:54:45.582252', true);
INSERT INTO public.users VALUES ('ba8c0f60-3ed2-456b-bc7a-82a5e643072d', 'Sonia', 'Yeong', 'sonia@kkh.com.sg', 93028374, 1, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:54:45.582252', true);
INSERT INTO public.users VALUES ('e7560f2b-3ed3-425c-bbb0-88703fa83b5d', 'Nico', 'Sim', 'nico@kkh.com.sg', 64838264, 1, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:54:45.582252', true);
INSERT INTO public.users VALUES ('8bd79ad0-196c-4013-8404-7464f73773d7', 'Likai', 'Tan', 'likai@kkh.com.sg', 71359402, 1, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:54:45.582252', true);
INSERT INTO public.users VALUES ('f9bf981c-1eb9-4ec9-9d1a-22692882f8bf', 'Charlotte', 'Chia', 'charlotte@kkh.com.sg', 46920261, 7, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:54:45.582252', true);
INSERT INTO public.users VALUES ('3d741d2b-7918-4348-bc22-737f7fce75dc', 'Insyirah', 'Nur', 'insyirah@kkh.com.sg', 84629140, 7, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:54:45.582252', true);
INSERT INTO public.users VALUES ('15037117-ef62-49ce-b746-3887b60f9ecb', 'Angelica', 'Torres', 'angelica@kkh.com.sg', 12345678, 8, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:54:45.582252', true);
INSERT INTO public.users VALUES ('c92c04a1-7b45-4357-ae50-e46a792f9c91', 'John', 'Doe', 'john@kkh.com.sg', 83021443, 8, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:54:45.582252', true);
INSERT INTO public.users VALUES ('b6d0c3fa-1e74-4d01-b321-1bb551238adc', 'Aaron', 'Tan', 'aaron75onco@kkh.com.sg', 90010001, 10, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:56:41.244367', true);
INSERT INTO public.users VALUES ('79901283-bfb9-41a3-8b48-3adec2a55b5a', 'Beatrice', 'Lim', 'beatrice75pame@kkh.com.sg', 90010002, 10, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:56:41.244367', true);
INSERT INTO public.users VALUES ('4e286f25-0ac8-43f5-a8af-4f9686833a7a', 'Caleb', 'Ng', 'caleb76onco@kkh.com.sg', 90010003, 11, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:56:41.244367', true);
INSERT INTO public.users VALUES ('223242be-eb27-445d-be9b-523831f4b955', 'Daphne', 'Koh', 'daphne76onco@kkh.com.sg', 90010004, 11, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:56:41.244367', true);
INSERT INTO public.users VALUES ('d4b2d549-4694-455a-8960-f84bf46f3b5b', 'Ethan', 'Low', 'ethan76onco@kkh.com.sg', 90010005, 11, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:56:41.244367', true);
INSERT INTO public.users VALUES ('b42ba9b1-8c00-4068-9d4e-8783194e6337', 'Farah', 'Ali', 'farah85pas@kkh.com.sg', 90010006, 13, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:56:41.244367', true);
INSERT INTO public.users VALUES ('3e172696-3fbf-4eec-bab2-4f62d7378071', 'Gavin', 'Chua', 'gavin55pas@kkh.com.sg', 90010007, 14, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:56:41.244367', true);
INSERT INTO public.users VALUES ('f510cef9-2592-458c-822d-171f2f397837', 'Hannah', 'Teo', 'hannahclinicpas@kkh.com.sg', 90010008, 12, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:56:41.244367', true);
INSERT INTO public.users VALUES ('8207927d-3281-4fc0-9f5a-cab827c66275', 'Irfan', 'Rahman', 'irfanpainpas@kkh.com.sg', 90010009, 12, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:56:41.244367', true);
INSERT INTO public.users VALUES ('6bebceab-31a2-4798-abbe-713e64721ec9', 'Jolene', 'Wong', 'jolene66pame@kkh.com.sg', 90010010, 9, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:56:41.244367', true);
INSERT INTO public.users VALUES ('545e1502-92da-4e3c-920b-f000ea5d718b', 'Kelvin', 'Ho', 'kelvin66pame@kkh.com.sg', 90010011, 9, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:56:41.244367', true);
INSERT INTO public.users VALUES ('88cb6094-bec3-4b43-b6e2-ef12d4493f3d', 'Lydia', 'Sim', 'lydia31pame@kkh.com.sg', 90010012, 6, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:56:41.244367', true);
INSERT INTO public.users VALUES ('de9c175b-5695-4748-b013-eeff61af86aa', 'Marcus', 'Lee', 'marcus65acute@kkh.com.sg', 90010013, 2, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:56:41.244367', true);
INSERT INTO public.users VALUES ('69e85c17-b5fa-4685-bed9-1fa904ae88fe', 'Nur', 'Aisyah', 'nurcicuacute@kkh.com.sg', 90010014, 3, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:56:41.244367', true);
INSERT INTO public.users VALUES ('6b3c2094-1211-4956-8ea1-979819ac11cb', 'Olivia', 'Chen', 'olivianicu@kkh.com.sg', 90010015, 5, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:56:41.244367', true);
INSERT INTO public.users VALUES ('0cff9e54-a360-45c9-b9a9-7fae2c9c7593', 'Pravin', 'Kumar', 'pravinnicu@kkh.com.sg', 90010016, 4, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 00:56:41.244367', true);
INSERT INTO public.users VALUES ('73fd8eeb-612d-462b-b249-7b97d1385d20', 'Mabel', 'Sim', 'mabel@kkh.com.sg', 90003001, 15, 2, '$2b$10$0xXkA7/kUrmDJa.B5vVO2.Ik/DrQcf6/Zm/Vtf9ME6fQnI8TCIcoa', '2026-01-31 03:28:07.07082', true);

-- 3. Leave Requests
INSERT INTO public.leave_requests OVERRIDING SYSTEM VALUE VALUES (1, 'a213d2e4-4377-418f-9db8-973d2ab04c19', 1, '2026-02-02', '2026-02-02', 1, 'approved', '2026-01-31 00:54:45.582252', '2026-01-31 00:54:45.582252', NULL);
INSERT INTO public.leave_requests OVERRIDING SYSTEM VALUE VALUES (2, 'ba8c0f60-3ed2-456b-bc7a-82a5e643072d', 2, '2026-02-02', '2026-02-02', 1, 'approved', '2026-01-31 00:54:45.582252', '2026-01-31 00:54:45.582252', NULL);
INSERT INTO public.leave_requests OVERRIDING SYSTEM VALUE VALUES (3, 'e7560f2b-3ed3-425c-bbb0-88703fa83b5d', 3, '2026-02-02', '2026-02-02', 1, 'approved', '2026-01-31 00:54:45.582252', '2026-01-31 00:54:45.582252', NULL);
INSERT INTO public.leave_requests OVERRIDING SYSTEM VALUE VALUES (4, '8bd79ad0-196c-4013-8404-7464f73773d7', 1, '2026-02-02', '2026-02-02', 1, 'approved', '2026-01-31 00:54:45.582252', '2026-01-31 00:54:45.582252', NULL);
INSERT INTO public.leave_requests OVERRIDING SYSTEM VALUE VALUES (5, 'f9bf981c-1eb9-4ec9-9d1a-22692882f8bf', 2, '2026-02-02', '2026-02-02', 1, 'approved', '2026-01-31 00:54:45.582252', '2026-01-31 00:54:45.582252', NULL);
INSERT INTO public.leave_requests OVERRIDING SYSTEM VALUE VALUES (6, '3d741d2b-7918-4348-bc22-737f7fce75dc', 1, '2026-02-02', '2026-02-02', 1, 'approved', '2026-01-31 00:54:45.582252', '2026-01-31 00:54:45.582252', NULL);
INSERT INTO public.leave_requests OVERRIDING SYSTEM VALUE VALUES (7, '15037117-ef62-49ce-b746-3887b60f9ecb', 3, '2026-02-02', '2026-02-02', 1, 'approved', '2026-01-31 00:54:45.582252', '2026-01-31 00:54:45.582252', NULL);

-- [REMOVED] Notifications Block (as requested)

-- 4. Shift Types
INSERT INTO public.shift_types OVERRIDING SYSTEM VALUE VALUES (1, 'AM', '#000000', '07:00:00', '16:00:00');
INSERT INTO public.shift_types OVERRIDING SYSTEM VALUE VALUES (2, 'PM', '#1E8A3C', '11:30:00', '20:30:00');
INSERT INTO public.shift_types OVERRIDING SYSTEM VALUE VALUES (3, 'N', '#800080', '20:00:00', '07:30:00');
INSERT INTO public.shift_types OVERRIDING SYSTEM VALUE VALUES (4, 'RRT', '#005983', NULL, NULL);
INSERT INTO public.shift_types OVERRIDING SYSTEM VALUE VALUES (5, 'DO', '#E69A00', NULL, NULL);
INSERT INTO public.shift_types OVERRIDING SYSTEM VALUE VALUES (6, 'RD', '#E69A00', NULL, NULL);
INSERT INTO public.shift_types OVERRIDING SYSTEM VALUE VALUES (7, 'GPAPN', '#FF5733', '11:30:00', '20:30:00');
INSERT INTO public.shift_types OVERRIDING SYSTEM VALUE VALUES (8, 'NNJ Clinic', '#C70039', '07:00:00', '16:00:00');
INSERT INTO public.shift_types OVERRIDING SYSTEM VALUE VALUES (9, 'NNJ@Home', '#900C3F', '07:00:00', '16:00:00');
INSERT INTO public.shift_types OVERRIDING SYSTEM VALUE VALUES (10, 'AM (RES)', '#581845', '08:00:00', '17:00:00');
INSERT INTO public.shift_types OVERRIDING SYSTEM VALUE VALUES (11, 'PM (RES)', '#28B463', '11:30:00', '20:30:00');

-- 5. User Leave Balances (Initial Seed)
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (2, 'ba8c0f60-3ed2-456b-bc7a-82a5e643072d', 1, 0, 7, 7, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (3, 'e7560f2b-3ed3-425c-bbb0-88703fa83b5d', 1, 0, 7, 7, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (5, 'f9bf981c-1eb9-4ec9-9d1a-22692882f8bf', 1, 0, 7, 7, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (7, '15037117-ef62-49ce-b746-3887b60f9ecb', 1, 0, 7, 7, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (8, 'c92c04a1-7b45-4357-ae50-e46a792f9c91', 1, 0, 7, 7, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (9, 'a213d2e4-4377-418f-9db8-973d2ab04c19', 2, 0, 14, 14, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (11, 'e7560f2b-3ed3-425c-bbb0-88703fa83b5d', 2, 0, 14, 14, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (12, '8bd79ad0-196c-4013-8404-7464f73773d7', 2, 0, 14, 14, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (14, '3d741d2b-7918-4348-bc22-737f7fce75dc', 2, 0, 14, 14, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (15, '15037117-ef62-49ce-b746-3887b60f9ecb', 2, 0, 14, 14, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (16, 'c92c04a1-7b45-4357-ae50-e46a792f9c91', 2, 0, 14, 14, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (17, 'a213d2e4-4377-418f-9db8-973d2ab04c19', 3, 0, 7, 7, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (18, 'ba8c0f60-3ed2-456b-bc7a-82a5e643072d', 3, 0, 7, 7, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (20, '8bd79ad0-196c-4013-8404-7464f73773d7', 3, 0, 7, 7, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (21, 'f9bf981c-1eb9-4ec9-9d1a-22692882f8bf', 3, 0, 7, 7, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (22, '3d741d2b-7918-4348-bc22-737f7fce75dc', 3, 0, 7, 7, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (24, 'c92c04a1-7b45-4357-ae50-e46a792f9c91', 3, 0, 7, 7, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (1, 'a213d2e4-4377-418f-9db8-973d2ab04c19', 1, 1, 6, 7, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (4, '8bd79ad0-196c-4013-8404-7464f73773d7', 1, 1, 6, 7, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (6, '3d741d2b-7918-4348-bc22-737f7fce75dc', 1, 1, 6, 7, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (10, 'ba8c0f60-3ed2-456b-bc7a-82a5e643072d', 2, 1, 13, 14, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (13, 'f9bf981c-1eb9-4ec9-9d1a-22692882f8bf', 2, 1, 13, 14, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (19, 'e7560f2b-3ed3-425c-bbb0-88703fa83b5d', 3, 1, 6, 7, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (23, '15037117-ef62-49ce-b746-3887b60f9ecb', 3, 1, 6, 7, '2026-01-31 00:54:45.582252');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (25, '3e172696-3fbf-4eec-bab2-4f62d7378071', 2, 0, 14, 14, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (26, '6bebceab-31a2-4798-abbe-713e64721ec9', 2, 0, 14, 14, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (27, '545e1502-92da-4e3c-920b-f000ea5d718b', 3, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (28, '69e85c17-b5fa-4685-bed9-1fa904ae88fe', 3, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (29, 'f510cef9-2592-458c-822d-171f2f397837', 2, 0, 14, 14, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (30, 'b42ba9b1-8c00-4068-9d4e-8783194e6337', 3, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (31, '6b3c2094-1211-4956-8ea1-979819ac11cb', 3, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (32, 'b6d0c3fa-1e74-4d01-b321-1bb551238adc', 3, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (33, '0cff9e54-a360-45c9-b9a9-7fae2c9c7593', 2, 0, 14, 14, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (34, 'b42ba9b1-8c00-4068-9d4e-8783194e6337', 1, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (35, '6b3c2094-1211-4956-8ea1-979819ac11cb', 1, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (36, 'b6d0c3fa-1e74-4d01-b321-1bb551238adc', 1, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (37, '8207927d-3281-4fc0-9f5a-cab827c66275', 2, 0, 14, 14, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (38, '545e1502-92da-4e3c-920b-f000ea5d718b', 1, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (39, '69e85c17-b5fa-4685-bed9-1fa904ae88fe', 1, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (40, 'de9c175b-5695-4748-b013-eeff61af86aa', 2, 0, 14, 14, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (41, 'd4b2d549-4694-455a-8960-f84bf46f3b5b', 2, 0, 14, 14, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (42, '4e286f25-0ac8-43f5-a8af-4f9686833a7a', 3, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (43, '88cb6094-bec3-4b43-b6e2-ef12d4493f3d', 1, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (44, '4e286f25-0ac8-43f5-a8af-4f9686833a7a', 1, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (45, '88cb6094-bec3-4b43-b6e2-ef12d4493f3d', 3, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (46, '79901283-bfb9-41a3-8b48-3adec2a55b5a', 2, 0, 14, 14, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (47, '223242be-eb27-445d-be9b-523831f4b955', 2, 0, 14, 14, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (48, '4e286f25-0ac8-43f5-a8af-4f9686833a7a', 2, 0, 14, 14, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (49, 'd4b2d549-4694-455a-8960-f84bf46f3b5b', 3, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (50, '79901283-bfb9-41a3-8b48-3adec2a55b5a', 1, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (51, 'de9c175b-5695-4748-b013-eeff61af86aa', 3, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (52, '223242be-eb27-445d-be9b-523831f4b955', 1, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (53, 'd4b2d549-4694-455a-8960-f84bf46f3b5b', 1, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (54, '79901283-bfb9-41a3-8b48-3adec2a55b5a', 3, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (55, '223242be-eb27-445d-be9b-523831f4b955', 3, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (56, 'de9c175b-5695-4748-b013-eeff61af86aa', 1, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (57, '88cb6094-bec3-4b43-b6e2-ef12d4493f3d', 2, 0, 14, 14, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (58, 'b6d0c3fa-1e74-4d01-b321-1bb551238adc', 2, 0, 14, 14, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (59, '0cff9e54-a360-45c9-b9a9-7fae2c9c7593', 3, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (60, 'f510cef9-2592-458c-822d-171f2f397837', 3, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (61, 'b42ba9b1-8c00-4068-9d4e-8783194e6337', 2, 0, 14, 14, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (62, '6b3c2094-1211-4956-8ea1-979819ac11cb', 2, 0, 14, 14, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (63, '3e172696-3fbf-4eec-bab2-4f62d7378071', 3, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (64, '6bebceab-31a2-4798-abbe-713e64721ec9', 3, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (65, '8207927d-3281-4fc0-9f5a-cab827c66275', 1, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (66, '545e1502-92da-4e3c-920b-f000ea5d718b', 2, 0, 14, 14, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (67, '69e85c17-b5fa-4685-bed9-1fa904ae88fe', 2, 0, 14, 14, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (68, '6bebceab-31a2-4798-abbe-713e64721ec9', 1, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (69, '8207927d-3281-4fc0-9f5a-cab827c66275', 3, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (70, '3e172696-3fbf-4eec-bab2-4f62d7378071', 1, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (71, '0cff9e54-a360-45c9-b9a9-7fae2c9c7593', 1, 0, 7, 7, '2026-01-31 00:56:55.657794');
INSERT INTO public.user_leave_balance OVERRIDING SYSTEM VALUE VALUES (72, 'f510cef9-2592-458c-822d-171f2f397837', 1, 0, 7, 7, '2026-01-31 00:56:55.657794');

-- 6. Insert Approved Shifts
INSERT INTO public.shifts (user_id, date, title, color_hex, start_time, end_time, published)
SELECT
    lr.user_id,
    lr.start_date,
    lt.name,
    '#009999',
    NULL,
    NULL,
    true
FROM public.leave_requests lr
JOIN public.leave_types lt ON lr.leave_type_id = lt.id
WHERE lr.status = 'approved' AND lr.start_date = '2026-02-02';

-- 7. Update User Leave Balances
UPDATE public.user_leave_balance ulb
SET used_days = used_days + 1, remaining_days = remaining_days - 1
WHERE (user_id, leave_type_id) IN (
    ((SELECT id FROM public.users WHERE email = 'clara@kkh.com.sg'), (SELECT id FROM public.leave_types WHERE name = 'Annual Leave')),
    ((SELECT id FROM public.users WHERE email = 'sonia@kkh.com.sg'), (SELECT id FROM public.leave_types WHERE name = 'Sick Leave')),
    ((SELECT id FROM public.users WHERE email = 'nico@kkh.com.sg'), (SELECT id FROM public.leave_types WHERE name = 'Childcare Leave')),
    ((SELECT id FROM public.users WHERE email = 'likai@kkh.com.sg'), (SELECT id FROM public.leave_types WHERE name = 'Annual Leave')),
    ((SELECT id FROM public.users WHERE email = 'charlotte@kkh.com.sg'), (SELECT id FROM public.leave_types WHERE name = 'Sick Leave')),
    ((SELECT id FROM public.users WHERE email = 'insyirah@kkh.com.sg'), (SELECT id FROM public.leave_types WHERE name = 'Annual Leave')),
    ((SELECT id FROM public.users WHERE email = 'angelica@kkh.com.sg'), (SELECT id FROM public.leave_types WHERE name = 'Childcare Leave'))
);

-- 8. Reset Sequences
SELECT pg_catalog.setval('public.departments_id_seq', 15, true);
SELECT pg_catalog.setval('public.leave_requests_id_seq', 7, true);
SELECT pg_catalog.setval('public.leave_types_id_seq', 3, true);
-- SELECT pg_catalog.setval('public.notifications_id_seq', 50, true); -- [REMOVED]
SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 1, false);
SELECT pg_catalog.setval('public.roles_id_seq', 2, true);
SELECT pg_catalog.setval('public.shift_requests_id_seq', 1, false);
SELECT pg_catalog.setval('public.shift_types_id_seq', 11, true);
SELECT pg_catalog.setval('public.shifts_id_seq', 43582, true);
SELECT pg_catalog.setval('public.user_leave_balance_id_seq', 72, true);