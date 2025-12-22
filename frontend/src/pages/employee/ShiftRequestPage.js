import React, { useState, useMemo, useEffect } from "react";
import WeeklyGrid from "../../components/ShiftRequestComponents/WeeklyGrid";
import AddShiftModal from "../../components/ShiftRequestComponents/AddShiftModal";
import MonthSelector from "../../components/ShiftRequestComponents/MonthSelector";
import Header from "../../components/ShiftRequestComponents/Header";
import { supabase } from "../../supabase";
import "../../styles/ShiftRequest/ShiftRequestPage.css";
import EmployeeLayout from "../../layouts/EmployeeLayout.js";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function ShiftRequestPage() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(9);
  const [modalOpen, setModalOpen] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [shiftTypes, setShiftTypes] = useState([]);
  const [user, setUser] = useState(null);

  // Get logged in user
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    loadUser();
  }, []);

  // Load user shift requests
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("shift_requests")
        .select("*")
        .eq("user_id", user.id);

      if (data) setShifts(data);
    };
    load();
  }, [user]);

  // Load shift types with colors
  useEffect(() => {
    const loadTypes = async () => {
      const { data } = await supabase.from("shift_types").select("*");
      if (data) setShiftTypes(data);
    };
    loadTypes();
  }, []);

  // Convert shifts to map
  const shiftMap = useMemo(() => {
    const map = new Map();
    shifts.forEach((s) => {
      if (!map.has(s.date)) map.set(s.date, []);
      map.get(s.date).push(s);
    });
    return map;
  }, [shifts]);

  // Week range (Mon–Sun)
  const getWeekRange = (dateStr) => {
    const d = new Date(dateStr);
    const dow = (d.getDay() + 6) % 7;
    const monday = new Date(d);
    monday.setDate(d.getDate() - dow);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { monday, sunday };
  };

  const countShiftsInWeek = (dateStr) => {
    const { monday, sunday } = getWeekRange(dateStr);
    return shifts.filter((s) => {
      const sd = new Date(s.date);
      return sd >= monday && sd <= sunday;
    }).length;
  };

  // Add shift
  const handleAddShift = async (newShift) => {
    if (!user) return { error: "no-user" };

    if (countShiftsInWeek(newShift.date) >= 5) {
      return { error: "week-limit" };
    }

    if (shifts.some((s) => s.date === newShift.date)) {
      return { error: "duplicate" };
    }

    const type = shiftTypes.find((t) => t.name === newShift.label);

    const { error } = await supabase.from("shift_requests").insert({
      user_id: user.id,
      date: newShift.date,
      preferred_shift: newShift.label,
      time: newShift.time || "",
      shift_type_id: type?.id ?? null,
      status: "Pending",
    });

    if (error) return { error: "db-error", message: error.message };

    const { data } = await supabase
      .from("shift_requests")
      .select("*")
      .eq("user_id", user.id);

    setShifts(data);
    setModalOpen(false);
    return { success: true };
  };

  // Build weeks
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks = useMemo(() => {
    const arr = [];
    let weekNumber = 1;
    let start = 1;

    while (start <= daysInMonth) {
      const end = Math.min(start + 6, daysInMonth);
      const w = { weekNumber, month: month + 1, start, end, shifts: [] };

      for (let d = start; d <= end; d++) {
        const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2,"0")}`;
        const list = shiftMap.get(iso) || [];

        list.forEach((s) => {
          const st = shiftTypes.find((t) => t.id === s.shift_type_id);
          const bg = st ? `${st.color_hex}20` : "#DFF7DF";
          const border = st ? st.color_hex : "#249D46";

          w.shifts.push({
            day: d,
            label: s.preferred_shift,
            time: s.time,
            bgColor: bg,
            borderColor: border,
            rowIndex: w.shifts.length,
          });
        });
      }

      arr.push(w);
      weekNumber++;
      start = end + 1;
    }

    return arr;
  }, [year, month, shiftMap, shiftTypes]);

  return (
    <EmployeeLayout>
      <div className="sr-page">
        <Header onAddShift={() => setModalOpen(true)} />

        <div className="sr-container">
          <MonthSelector
            month={month}
            year={year}
            setMonth={setMonth}
            setYear={setYear}
            monthNames={monthNames}
          />

          <div className="weekly-container">
            {weeks.map((w) => (
              <WeeklyGrid key={w.weekNumber} week={w} />
            ))}
          </div>
        </div>

        <AddShiftModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleAddShift}
          checkDuplicate={(d) => shifts.some((s) => s.date === d)}
        />
      </div>
    </EmployeeLayout>
  );
}
