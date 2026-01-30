import React, { useEffect, useRef } from 'react';
import './FairnessTrackerModal.css';

export default function FairnessTrackerModal({ 
  open, 
  onClose, 
  nightCounts, 
  rrtCounts, 
  gpapnCounts, 
  nnjCounts, 
  employees, 
  mode, 
  setMode, 
  isLoading, 
  selectedMonth, 
  setSelectedMonth, 
  selectedYear, 
  setSelectedYear, 
  fetchFairnessData 
}) {
  
  const prevMonth = useRef(selectedMonth);
  const prevYear = useRef(selectedYear);
  
  useEffect(() => {
    // Refresh data if year/month changes while modal is open
    if (open) {
      if (mode === 'month' && (prevMonth.current !== selectedMonth || prevYear.current !== selectedYear)) {
        fetchFairnessData('month');
        prevMonth.current = selectedMonth;
        prevYear.current = selectedYear;
      }
      if (mode === 'year' && prevYear.current !== selectedYear) {
        fetchFairnessData('year');
        prevYear.current = selectedYear;
      }
    }
    // eslint-disable-next-line
  }, [selectedMonth, selectedYear, mode, open]);

  if (!open) return null;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear - 7; y <= currentYear + 1; y++) {
    years.push(y);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Fairness Tracker</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Week Button */}
          <button
            className={mode === 'week' ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setMode('week')}
            disabled={isLoading}
          >
            Current Week
          </button>

          {/* Month Button */}
          <button
            className={mode === 'month' ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setMode('month')}
            disabled={isLoading}
          >
            Select Month
          </button>

          {/* Year Button (NEW) */}
          <button
            className={mode === 'year' ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setMode('year')}
            disabled={isLoading}
          >
            Whole Year
          </button>
          
          {/* Selectors */}
          {mode === 'month' && (
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              disabled={isLoading}
              style={{ marginLeft: 8 }}
            >
              {months.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>
          )}

          {(mode === 'month' || mode === 'year') && (
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              disabled={isLoading}
              style={{ marginLeft: 8 }}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          )}
        </div>

        <div className="modal-body">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 24 }}>Loading...</div>
          ) : (
            <table className="fairness-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Night (N)</th>
                  <th>RRT</th>
                  <th>GPAPN</th>
                  <th>NNJ@Clinic</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.first_name} {emp.last_name}</td>
                    
                    <td>{nightCounts[emp.id] || 0}</td>
                    <td>{rrtCounts[emp.id] || 0}</td>

                    <td style={{ color: emp.can_do_gpapn ? 'inherit' : '#ccc' }}>
                        {emp.can_do_gpapn ? (gpapnCounts?.[emp.id] || 0) : '-'}
                    </td>

                    <td style={{ color: emp.can_do_nnj ? 'inherit' : '#ccc' }}>
                        {emp.can_do_nnj ? (nnjCounts?.[emp.id] || 0) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}