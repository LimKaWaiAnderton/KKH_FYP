import React, { useState, useMemo, useEffect } from "react";
import WeeklyGrid from "../../components/ShiftRequestComponents/WeeklyGrid";
import AddShiftModal from "../../components/ShiftRequestComponents/AddShiftModal";
import MonthSelector from "../../components/ShiftRequestComponents/MonthSelector";
import Header from "../../components/ShiftRequestComponents/Header";
import { authFetch } from "../../utils/authFetch";
import "../../styles/ShiftRequest/ShiftRequestPage.css";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function ShiftRequestPage() {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-based
  const [modalOpen, setModalOpen] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [shiftTypes, setShiftTypes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD LOGGED IN USER
     ========================= */
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await authFetch("http://localhost:5000/auth/me");
        if (!res || !res.ok) throw new Error("Auth failed");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("❌ Failed to load user", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  /* =========================
     LOAD SHIFT REQUESTS
     ========================= */
  useEffect(() => {
    if (!user) return;

    async function loadShifts() {
      const res = await authFetch("http://localhost:5000/api/shifts");
      if (!res || !res.ok) return;

      const data = await res.json();
      setShifts(data);
    }

    loadShifts();
  }, [user]);

  /* =========================
     LOAD SHIFT TYPES
     ========================= */
  useEffect(() => {
    async function loadTypes() {
      const res = await authFetch("http://localhost:5000/api/shifts/types");
      if (!res || !res.ok) return;

      const data = await res.json();
      setShiftTypes(data);
    }

    loadTypes();
  }, []);

  /* =========================
     🔴 IMPORTANT FIX HERE
     NORMALISE DATE STRINGS
     ========================= */
  const shiftMap = useMemo(() => {
    const map = new Map();

    shifts.forEach((s) => {
      // ✅ FIX: convert Postgres timestamp → YYYY-MM-DD
      const dateKey = new Date(s.date).toISOString().split("T")[0];

      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey).push(s);
    });

    return map;
  }, [shifts]);

  /* =========================
     WEEK HELPERS
     ========================= */
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

  /* =========================
     ADD SHIFT
     ========================= */
  const handleAddShift = async (newShift) => {
    if (!user) return { error: "no-user" };

    if (countShiftsInWeek(newShift.date) >= 5)
      return { error: "week-limit" };

    if (shifts.some((s) => new Date(s.date).toISOString().split("T")[0] === newShift.date))
      return { error: "duplicate" };

    const type = shiftTypes.find((t) => t.name === newShift.label);

    const res = await authFetch("http://localhost:5000/api/shifts", {
      method: "POST",
      body: JSON.stringify({
        date: newShift.date,
        preferred_shift: newShift.label,
        time: newShift.time || "",
        shift_type_id: type?.id ?? null,
      }),
    });

    if (!res || !res.ok) return { error: "db-error" };

    // Reload shifts
    const refresh = await authFetch("http://localhost:5000/api/shifts");
    setShifts(await refresh.json());

    setModalOpen(false);
    return { success: true };
  };

  /* =========================
     BUILD WEEKS
     ========================= */
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks = useMemo(() => {
    const arr = [];
    let weekNumber = 1;
    let start = 1;

    while (start <= daysInMonth) {
      const end = Math.min(start + 6, daysInMonth);
      const w = { weekNumber, month: month + 1, start, end, shifts: [] };

      for (let d = start; d <= end; d++) {
        const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
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

  /* =========================
     LOADING
     ========================= */
  if (loading) {
    return (
      <div style={{ padding: 40 }}>Loading shifts…</div>
    );
  }

  /* =========================
     RENDER
     ========================= */
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
        onSave={handleAddShift}
        checkDuplicate={(d) =>
          shifts.some(
            (s) => new Date(s.date).toISOString().split("T")[0] === d
          )
        }
      />
    </div>
  );
}
