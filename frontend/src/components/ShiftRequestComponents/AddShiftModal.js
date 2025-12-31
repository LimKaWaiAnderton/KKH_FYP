// src/components/ShiftRequestComponents/AddShiftModal.js
import React, { useState, useMemo } from "react";
import "../../styles/ShiftRequest/AddShiftModal.css";

export default function AddShiftModal({
  open,
  onClose,
  onSave,
  checkDuplicate
}) {
  const [activeTab, setActiveTab] = useState("details");

  const [date, setDate] = useState("");
  const [label, setLabel] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Templates
  const templates = [
    { id: 1, label: "AM", time: "07:00 – 16:00" },
    { id: 2, label: "PM", time: "11:00 – 20:00" },
    { id: 3, label: "NNJ", time: "" },
    { id: 4, label: "NNJ@HOME", time: "" },
    { id: 5, label: "RRT", time: "" }
  ];

  const filteredTemplates = useMemo(
    () =>
      templates.filter((t) =>
        `${t.label} ${t.time}`.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const applyTemplate = (template) => {
    setLabel(template.label);

    if (template.time.includes("–")) {
      const [s, e] = template.time.split("–").map((x) => x.trim());
      setStart(s);
      setEnd(e);
    } else {
      setStart("");
      setEnd("");
    }

    setActiveTab("details");
  };

  // FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear previous

    if (!date || !label) {
      setError("Please fill all required fields.");
      return;
    }

    if (date < today) {
      setError("Cannot request past dates.");
      return;
    }

    if (checkDuplicate && checkDuplicate(date)) {
      setError("You already submitted a request for this date.");
      return;
    }

    const payload = {
      date,
      label,
      start,
      end,
      time: start && end ? `${start} – ${end}` : ""
    };

    const result = await onSave(payload);

    // NEW — handle week-limit inline red box
    if (result?.error === "week-limit") {
      setError("You can only request UP TO 5 shifts per week.");
      return;
    }
  };

  if (!open) return null;

  const titleText = date
    ? new Date(date).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : "Request Shift";

  return (
    <div className="as-overlay">
      <div className="as-modal" role="dialog" aria-modal="true">
        {/* HEADER */}
        <div className="as-header">
          <button className="as-close" onClick={onClose}>
            ×
          </button>
          <div className="as-header-title">{titleText}</div>
        </div>

        {/* TABS */}
        <div className="as-tabs">
          <button
            className={`as-tab ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Shift Details
          </button>
          <button
            className={`as-tab ${activeTab === "templates" ? "active" : ""}`}
            onClick={() => setActiveTab("templates")}
          >
            Templates
          </button>
        </div>

        {/* FORM */}
        <form className="as-form" onSubmit={handleSubmit}>
          {/* Red error box */}
          {error && <div className="as-error">{error}</div>}

          <div className="as-body">
            {activeTab === "details" && (
              <div className="as-section">
                <div className="as-field">
                  <label className="as-label">
                    Shift Title <span className="as-required">*</span>
                  </label>
                  <input
                    className="as-input"
                    placeholder="Type here"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                  />
                </div>

                <div className="as-field">
                  <label className="as-label">
                    Date <span className="as-required">*</span>
                  </label>
                  <input
                    type="date"
                    min={today}
                    className="as-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="as-field-row">
                  <div className="as-field half">
                    <label className="as-label">Start</label>
                    <select
                      className="as-input"
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                    >
                      <option value="">Select time</option>
                      <option value="07:00">7:00am</option>
                      <option value="08:00">8:00am</option>
                      <option value="09:00">9:00am</option>
                    </select>
                  </div>

                  <div className="as-field half">
                    <label className="as-label">End</label>
                    <select
                      className="as-input"
                      value={end}
                      onChange={(e) => setEnd(e.target.value)}
                    >
                      <option value="">Select time</option>
                      <option value="16:00">4:00pm</option>
                      <option value="17:00">5:00pm</option>
                      <option value="20:00">8:00pm</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "templates" && (
              <div className="as-section">
                <div className="as-search-wrapper">
                  <span className="as-search-icon">🔍</span>
                  <input
                    className="as-search"
                    placeholder="Search.."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="as-template-grid">
                  {filteredTemplates.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className="as-template-card"
                      onClick={() => applyTemplate(t)}
                    >
                      {t.time && (
                        <div className="as-template-time">{t.time}</div>
                      )}
                      <div className="as-template-label">{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="as-footer">
            <button
              type="button"
              className="as-btn as-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="as-btn as-btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
