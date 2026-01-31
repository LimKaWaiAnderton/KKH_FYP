-- Cleaned Schema Script for KKH_FYP

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

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';

SET default_tablespace = '';
SET default_table_access_method = heap;

-- Tables
CREATE TABLE public.departments (
    id bigint NOT NULL,
    name character varying(100) NOT NULL
);

ALTER TABLE public.departments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.departments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.leave_requests (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    leave_type_id bigint NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    total_days integer NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    applied_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone,
    CONSTRAINT chk_leave_dates CHECK ((end_date >= start_date)),
    CONSTRAINT chk_leave_status CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'cancelled'::character varying] )::text[])))
);

ALTER TABLE public.leave_requests ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.leave_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.leave_types (
    id bigint NOT NULL,
    name character varying(50) NOT NULL
);

ALTER TABLE public.leave_types ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.leave_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    title character varying(100) NOT NULL,
    message text NOT NULL,
    type character varying(20) NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_notification_type CHECK (((type)::text = ANY ((ARRAY['info'::character varying, 'warning'::character varying, 'success'::character varying])::text[])))
);

ALTER TABLE public.notifications ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.password_reset_tokens (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    token character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.password_reset_tokens ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.password_reset_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.roles (
    id bigint NOT NULL,
    name character varying(50) NOT NULL,
    CONSTRAINT roles_name_check CHECK (((name)::text = ANY ((ARRAY['admin'::character varying, 'user'::character varying])::text[])))
);

ALTER TABLE public.roles ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.shift_requests (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    date date NOT NULL,
    shift_type_id bigint,
    title character varying(50),
    start_time time without time zone,
    end_time time without time zone,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_sr_shift_definition CHECK ((((shift_type_id IS NOT NULL) AND (title IS NULL)) OR ((shift_type_id IS NULL) AND (title IS NOT NULL)))),
    CONSTRAINT chk_sr_status CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[]))),
    CONSTRAINT chk_sr_time_consistency CHECK ((((start_time IS NULL) AND (end_time IS NULL)) OR ((start_time IS NOT NULL) AND (end_time IS NOT NULL))))
);

ALTER TABLE public.shift_requests ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.shift_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.shift_types (
    id bigint NOT NULL,
    name character varying(20) NOT NULL,
    color_hex character varying(7) NOT NULL,
    start_time time without time zone,
    end_time time without time zone
);

ALTER TABLE public.shift_types ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.shift_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.shifts (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    date date NOT NULL,
    shift_type_id bigint,
    title character varying(50),
    color_hex character varying(7),
    start_time time without time zone,
    end_time time without time zone,
    published boolean DEFAULT false NOT NULL,
    is_rrt boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_shift_time_consistency CHECK ((((start_time IS NULL) AND (end_time IS NULL)) OR ((start_time IS NOT NULL) AND (end_time IS NOT NULL)))),
    CONSTRAINT chk_shifts_definition CHECK ((((shift_type_id IS NOT NULL) AND (title IS NULL)) OR ((shift_type_id IS NULL) AND (title IS NOT NULL))))
);

ALTER TABLE public.shifts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.shifts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.user_leave_balance (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    leave_type_id bigint NOT NULL,
    used_days numeric(10, 1) DEFAULT 0 NOT NULL, 
    remaining_days numeric(10, 1) NOT NULL,      
    total_quota numeric(10, 1) NOT NULL,         
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    adjustment_reason character varying(255),
    CONSTRAINT chk_leave_balance CHECK (((used_days >= 0) AND (remaining_days >= 0) AND (total_quota >= 0) AND ((used_days + remaining_days) = total_quota)))
);

ALTER TABLE public.user_leave_balance ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_leave_balance_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    mobile_number bigint,
    department_id bigint NOT NULL,
    role_id bigint NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true NOT NULL
);

-- Constraints
ALTER TABLE ONLY public.departments ADD CONSTRAINT departments_name_key UNIQUE (name);
ALTER TABLE ONLY public.departments ADD CONSTRAINT departments_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.leave_requests ADD CONSTRAINT leave_requests_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.leave_types ADD CONSTRAINT leave_types_name_key UNIQUE (name);
ALTER TABLE ONLY public.leave_types ADD CONSTRAINT leave_types_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.notifications ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.password_reset_tokens ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.password_reset_tokens ADD CONSTRAINT password_reset_tokens_token_key UNIQUE (token);
ALTER TABLE ONLY public.roles ADD CONSTRAINT roles_name_key UNIQUE (name);
ALTER TABLE ONLY public.roles ADD CONSTRAINT roles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.shift_requests ADD CONSTRAINT shift_requests_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.shift_types ADD CONSTRAINT shift_types_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.shifts ADD CONSTRAINT shifts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.shift_types ADD CONSTRAINT uq_shift_types_name UNIQUE (name);
ALTER TABLE ONLY public.user_leave_balance ADD CONSTRAINT uq_user_leave_type UNIQUE (user_id, leave_type_id);
ALTER TABLE ONLY public.user_leave_balance ADD CONSTRAINT user_leave_balance_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- Foreign Keys
ALTER TABLE ONLY public.leave_requests ADD CONSTRAINT fk_leave_requests_leave_type FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id);
ALTER TABLE ONLY public.leave_requests ADD CONSTRAINT fk_leave_requests_user FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.notifications ADD CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.password_reset_tokens ADD CONSTRAINT fk_prt_user FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.shifts ADD CONSTRAINT fk_shifts_shift_type FOREIGN KEY (shift_type_id) REFERENCES public.shift_types(id);
ALTER TABLE ONLY public.shifts ADD CONSTRAINT fk_shifts_user FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.shift_requests ADD CONSTRAINT fk_sr_shift_type FOREIGN KEY (shift_type_id) REFERENCES public.shift_types(id);
ALTER TABLE ONLY public.shift_requests ADD CONSTRAINT fk_sr_user FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.user_leave_balance ADD CONSTRAINT fk_ulb_leave_type FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id);
ALTER TABLE ONLY public.user_leave_balance ADD CONSTRAINT fk_ulb_user FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.users ADD CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES public.departments(id);
ALTER TABLE ONLY public.users ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES public.roles(id);