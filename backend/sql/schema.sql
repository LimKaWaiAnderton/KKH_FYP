begin;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

create table
  public.departments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
  );

CREATE TABLE
  public.roles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    CONSTRAINT roles_name_check CHECK (name IN ('admin', 'user'))
  );

create table
  public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES public.departments (id),
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES public.roles (id)
  );

-------------------------------
-- Types of leaves available --
-------------------------------
create table
  public.leave_types (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
  );

---------------------------------------
-- Leave requests submitted by users --
---------------------------------------
create table
  public.leave_requests (
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
    CONSTRAINT fk_leave_requests_user FOREIGN KEY (user_id) REFERENCES public.users (id),
    CONSTRAINT fk_leave_requests_leave_type FOREIGN KEY (leave_type_id) REFERENCES public.leave_types (id),
    CONSTRAINT chk_leave_status CHECK (status IN ('pending', 'approved', 'rejected')),
    CONSTRAINT chk_leave_dates CHECK (end_date >= start_date)
  );

----------------------------------------
-- User leave balances per leave type --
----------------------------------------
create table
  public.user_leave_balance (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL,
    leave_type_id BIGINT NOT NULL,
    used_days INTEGER NOT NULL DEFAULT 0,
    remaining_days INTEGER NOT NULL,
    total_quota INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ulb_user FOREIGN KEY (user_id) REFERENCES public.users (id),
    CONSTRAINT fk_ulb_leave_type FOREIGN KEY (leave_type_id) REFERENCES public.leave_types (id),
    CONSTRAINT uq_user_leave_type UNIQUE (user_id, leave_type_id),
    CONSTRAINT chk_leave_balance CHECK (
      used_days >= 0
      AND remaining_days >= 0
      AND total_quota >= 0
      AND used_days + remaining_days = total_quota
    )
  );

---------------------------------------------------
-- Shift types templates (AM, PM, Night, RD, DO) --
---------------------------------------------------
create table
  public.shift_types (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    color_hex VARCHAR(7) NOT NULL,
    CONSTRAINT uq_shift_types_name UNIQUE (name)
  );

------------------------------------------------------------
-- Actual shifts derived from templates or custom defined --
------------------------------------------------------------
CREATE TABLE
  public.shifts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- NULL = custom approved shift
    -- NOT NULL = based on a template
    shift_type_id BIGINT,
    -- For custom shifts
    title VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7) NOT NULL DEFAULT '#FFFFFF',
    -- NULL for leave / off / full-day shifts
    start_time TIME,
    end_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shifts_shift_type FOREIGN KEY (shift_type_id) REFERENCES public.shift_types (id),
    CONSTRAINT chk_shift_time_consistency CHECK (
      (
        start_time IS NULL
        AND end_time IS NULL
      )
      OR (
        start_time IS NOT NULL
        AND end_time IS NOT NULL
      )
    )
  );

--------------------------------
-- Shift change / shift requests
--------------------------------
CREATE TABLE
  public.shift_requests (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    -- Template-based request
    shift_type_id BIGINT,
    -- Custom shift proposal
    title VARCHAR(50),
    start_time TIME,
    end_time TIME,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sr_user FOREIGN KEY (user_id) REFERENCES public.users (id),
    CONSTRAINT fk_sr_shift_type FOREIGN KEY (shift_type_id) REFERENCES public.shift_types (id),
    CONSTRAINT chk_sr_status CHECK (status IN ('pending', 'approved', 'rejected')),
    -- Either template OR custom, never both
    CONSTRAINT chk_sr_shift_definition CHECK (
      (
        shift_type_id IS NOT NULL
        AND title IS NULL
      )
      OR (
        shift_type_id IS NULL
        AND title IS NOT NULL
      )
    ),
    CONSTRAINT chk_sr_time_consistency CHECK (
      (
        start_time IS NULL
        AND end_time IS NULL
      )
      OR (
        start_time IS NOT NULL
        AND end_time IS NOT NULL
      )
    )
  );

------------------------------------
-- Daily schedules per department --
------------------------------------
create table
  public.schedules (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    date DATE NOT NULL,
    department_id BIGINT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_schedules_department FOREIGN KEY (department_id) REFERENCES public.departments (id),
    CONSTRAINT uq_schedule_per_day UNIQUE (date, department_id)
  );

-------------------------------------------------------------------------
-- Nurse assignments within a schedule (Which nurse works which shift) --
-------------------------------------------------------------------------
CREATE TABLE
  public.nurse_schedule (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    schedule_id BIGINT NOT NULL,
    user_id UUID NOT NULL,
    shift_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ns_schedule FOREIGN KEY (schedule_id) REFERENCES public.schedules (id),
    CONSTRAINT fk_ns_user FOREIGN KEY (user_id) REFERENCES public.users (id),
    CONSTRAINT fk_ns_shift FOREIGN KEY (shift_id) REFERENCES public.shifts (id),
    CONSTRAINT uq_nurse_per_schedule UNIQUE (schedule_id, user_id)
  );

create table
  public.notifications (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES public.users (id),
    CONSTRAINT chk_notification_type CHECK (type IN ('info', 'warning', 'success'))
  );

commit;