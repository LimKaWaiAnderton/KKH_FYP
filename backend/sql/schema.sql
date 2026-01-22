begin; 

CREATE EXTENSION IF NOT EXISTS pgcrypto;

create table public.departments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE public.roles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,

  CONSTRAINT roles_name_check
    CHECK (name IN ('admin', 'user'))
);

create table public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  department_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT true,


  CONSTRAINT fk_users_department
    FOREIGN KEY (department_id)
    REFERENCES public.departments(id),

  CONSTRAINT fk_users_role
    FOREIGN KEY (role_id)
    REFERENCES public.roles(id)
);

create table public.leave_types (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

create table public.shift_types (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(20) NOT NULL,
  color_hex VARCHAR(7) NOT NULL
);

create table public.leave_requests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  user_id UUID NOT NULL,
  leave_type_id BIGINT NOT NULL,

  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,

  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  applied_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,

  CONSTRAINT fk_leave_requests_user
    FOREIGN KEY (user_id)
    REFERENCES public.users(id),

  CONSTRAINT fk_leave_requests_leave_type
    FOREIGN KEY (leave_type_id)
    REFERENCES public.leave_types(id),

  CONSTRAINT chk_leave_status
    CHECK (status IN ('pending', 'approved', 'rejected')),

  CONSTRAINT chk_leave_dates
    CHECK (end_date >= start_date)
);

create table public.user_leave_balance (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  user_id UUID NOT NULL,
  leave_type_id BIGINT NOT NULL,

  used_days INTEGER NOT NULL DEFAULT 0,
  remaining_days INTEGER NOT NULL,
  total_quota INTEGER NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_ulb_user
    FOREIGN KEY (user_id)
    REFERENCES public.users(id),

  CONSTRAINT fk_ulb_leave_type
    FOREIGN KEY (leave_type_id)
    REFERENCES public.leave_types(id),

  CONSTRAINT uq_user_leave_type
    UNIQUE (user_id, leave_type_id),

  CONSTRAINT chk_leave_balance
    CHECK (
      used_days >= 0 AND
      remaining_days >= 0 AND
      total_quota >= 0 AND
      used_days + remaining_days = total_quota
    )
);

create table public.shift_requests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  user_id UUID NOT NULL,
  date DATE NOT NULL,
  preferred_shift VARCHAR(20),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  shift_type_id BIGINT,
  time VARCHAR(20),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_shift_requests_user
    FOREIGN KEY (user_id)
    REFERENCES public.users(id),

  CONSTRAINT fk_shift_requests_shift_type
    FOREIGN KEY (shift_type_id)
    REFERENCES public.shift_types(id),

  CONSTRAINT chk_shift_request_status
    CHECK (status IN ('pending', 'approved', 'rejected'))
);

create table public.schedules (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  date DATE NOT NULL,
  department_id BIGINT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_schedules_department
    FOREIGN KEY (department_id)
    REFERENCES public.departments(id),

  CONSTRAINT uq_schedule_per_day
    UNIQUE (date, department_id)
);

create table public.nurse_schedule (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  schedule_id BIGINT NOT NULL,
  user_id UUID NOT NULL,
  shift_type_id BIGINT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_nurse_schedule_schedule
    FOREIGN KEY (schedule_id)
    REFERENCES public.schedules(id),

  CONSTRAINT fk_nurse_schedule_user
    FOREIGN KEY (user_id)
    REFERENCES public.users(id),

  CONSTRAINT fk_nurse_schedule_shift_type
    FOREIGN KEY (shift_type_id)
    REFERENCES public.shift_types(id),

  CONSTRAINT uq_nurse_per_schedule
    UNIQUE (schedule_id, user_id)
);

create table public.notifications (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  user_id UUID NOT NULL,
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id)
    REFERENCES public.users(id),

  CONSTRAINT chk_notification_type
    CHECK (type IN ('info', 'warning', 'success'))
);


commit;