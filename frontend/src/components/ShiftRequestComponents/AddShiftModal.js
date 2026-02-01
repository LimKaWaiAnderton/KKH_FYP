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

  // Full list of your shift types based on the project requirements
  const templates = [
    { id: 1, label: "AM", time: "07:00 – 16:00" },
    { id: 2, label: "PM", time: "11:00 – 20:00" },
    { id: 3, label: "N", time: "20:00 – 07:30" },
    { id: 4, label: "RRT", time: "07:00 – 16:00" },
    { id: 5, label: "GPAPN", time: "11:30 – 20:30" },
    { id: 6, label: "NNJ Clinic", time: "07:00 – 16:00" },
    { id: 7, label: "AM (RES)", time: "08:00 – 17:00" }
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
    }
    setActiveTab("details");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!date || !label) {
      setError("Please fill all required fields.");
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

    if (result?.error) {
      setError(result.message || "Failed to submit request.");
    }
  };

  if (!open) return null;

  return (
    <div className="as-overlay" onClick={onClose}>
      <div className="as-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="as-header">
          <h3 className="as-title">Request Shift</h3>
          <button className="as-close-btn" onClick={onClose}>×</button>
        </div>

        {/* TABS */}
        <div className="as-tabs">
          <button
            className={`as-tab-item ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Shift Details
          </button>
          <button
            className={`as-tab-item ${activeTab === "templates" ? "active" : ""}`}
            onClick={() => setActiveTab("templates")}
          >
            Templates
          </button>
        </div>

        {/* BODY */}
        <div className="as-body">
          {error && <div className="as-error-banner">{error}</div>}

          {activeTab === "details" ? (
            <div className="as-form-content">
              <div className="as-input-group">
                <label>Shift Title <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. AM, PM, RRT"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>

              <div className="as-input-group">
                <label>Date <span className="req">*</span></label>
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="as-row">
                <div className="as-input-group">
                  <label>Start</label>
                  <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
                </div>
                <div className="as-input-group">
                  <label>End</label>
                  <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
                </div>
              </div>
            </div>
          ) : (
            <div className="as-templates-content">
              <input
                className="as-search-bar"
                placeholder="Search shift types..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="as-template-list">
                {filteredTemplates.map((t) => (
                  <div key={t.id} className="as-template-item" onClick={() => applyTemplate(t)}>
                    <div className="as-template-info">
                      <span className="as-t-label">{t.label}</span>
                      <span className="as-t-time">{t.time}</span>
                    </div>
                    <div className="as-t-plus">+</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="as-footer">
          <button className="as-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="as-btn-submit" onClick={handleSubmit}>Submit Request</button>
        </div>
      </div>
    </div>
  );
}