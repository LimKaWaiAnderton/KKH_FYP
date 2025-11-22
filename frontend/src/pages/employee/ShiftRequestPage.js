import React, { useState, useMemo, useEffect } from "react";
import WeeklyGrid from "../../components/ShiftRequestComponents/WeeklyGrid";
import AddShiftModal from "../../components/ShiftRequestComponents/AddShiftModal";
import MonthSelector from "../../components/ShiftRequestComponents/MonthSelector";
import Header from "../../components/ShiftRequestComponents/Header";
import { supabase } from "../../supabase";
import "../../styles/ShiftRequest/ShiftRequestPage.css";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function ShiftRequestPage() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(9);
  const [modalOpen, setModalOpen] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [user, setUser] = useState(null);

  // ---------------------------
  // Fetch user
  // ---------------------------
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetch();
  }, []);

  // Load user's shift requests
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("shift_requests")
        .select("*")
        .eq("user_id", user.id);

      if (!error) setShifts(data);
    };

    load();
  }, [user]);

  // ---------------------------
  // Lookup map
  // ---------------------------
  const shiftMap = useMemo(() => {
    const map = new Map();
    shifts.forEach((s) => {
      if (!map.has(s.date)) map.set(s.date, []);
      map.get(s.date).push(s);
    });
    return map;
  }, [shifts]);

  // ---------------------------
  // Get week range
  // ---------------------------
  function getWeekRange(dateStr) {
    const d = new Date(dateStr);
    const dayOfWeek = d.getDay(); // 0 = Sun

    // Week starts on Monday
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((dayOfWeek + 6) % 7));

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  }

  function countShiftsInWeek(dateStr) {
    const { monday, sunday } = getWeekRange(dateStr);

    return shifts.filter((s) => {
      const sd = new Date(s.date);
      return sd >= monday && sd <= sunday;
    }).length;
  }

  // ---------------------------
  // Insert shift (NOW RETURNS ERROR CODES)
  // ---------------------------
  const handleAddShift = async (newShift) => {
    if (!user) return { error: "no-user" };

    const weekCount = countShiftsInWeek(newShift.date);
    if (weekCount >= 5) {
      return { error: "week-limit" };  // 🔥 AddShiftModal will display red box
    }

    const duplicate = shifts.some((s) => s.date === newShift.date);
    if (duplicate) {
      return { error: "duplicate" }; // AddShiftModal handles this too
    }

    // Insert
    const shiftTypeMap = { RD: 5, PM: 6, AM: 4, OFF: 7 };
    const shift_type_id = shiftTypeMap[newShift.label];

    const { error } = await supabase.from("shift_requests").insert({
      user_id: user.id,
      date: newShift.date,
      preferred_shift: newShift.label,
      shift_type_id,
      time: newShift.time || "",
      status: "Pending"
    });

    if (error) {
      return { error: "db-error", message: error.message };
    }

    // Reload
    const { data } = await supabase
      .from("shift_requests")
      .select("*")
      .eq("user_id", user.id);

    setShifts(data);
    setModalOpen(false);

    return { success: true };
  };

  // ---------------------------
  // Build weeks
  // ---------------------------
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks = useMemo(() => {
    const arr = [];
    let weekNumber = 1;
    let start = 1;

    while (start <= daysInMonth) {
      const end = Math.min(start + 6, daysInMonth);
      const w = { weekNumber, month: month + 1, start, end, shifts: [] };

      for (let d = start; d <= end; d++) {
        const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(
          d
        ).padStart(2, "0")}`;

        const list = shiftMap.get(iso) || [];

        list.forEach((s) =>
          w.shifts.push({
            day: d,
            label: s.preferred_shift,
            time: s.time,
            color: "#249D46",
            bgColor: "#D8F7D8"
          })
        );
      }

      w.shifts.sort((a, b) => a.day - b.day);
      w.shifts.forEach((s, i) => (s.rowIndex = i));
      arr.push(w);

      weekNumber++;
      start = end + 1;
    }

    return arr;
  }, [year, month, shiftMap]);

  // ---------------------------
  // Return UI
  // ---------------------------
  return (
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
        onSave={handleAddShift} // returns {error: "..."}
        checkDuplicate={(d) => shifts.some((s) => s.date === d)}
      />
    </div>
  );
}
