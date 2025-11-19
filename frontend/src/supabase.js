import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://abgrvizxheoghmsenwoz.supabase.co";      
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZ3J2aXp4aGVvZ2htc2Vud296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDk0OTcsImV4cCI6MjA3ODYyNTQ5N30.ruYTqZ6RpakbnDuYqoJsN4h1biGkLhZcX9Mt1sJu7Dg";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
