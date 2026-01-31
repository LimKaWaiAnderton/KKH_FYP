import React from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import '../../../styles/PublishNotificationModal.css'; // Reusing your modal styles

export default function ValidationErrorsModal({ isOpen, onClose, violations }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                
                {/* Header - Red for Danger/Error */}
                <div className="modal-header" style={{ borderBottom: '2px solid #EF4444' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444' }}>
                        <HiOutlineExclamationCircle size={24} />
                        <h2 className="modal-title" style={{ color: '#EF4444' }}>Validation Failed</h2>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="publish-info-banner" style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' }}>
                        <span className="banner-text">
                            The roster cannot be published because <strong>{violations.length} rules</strong> were broken.
                            Please fix these shifts and try again.
                        </span>
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '16px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#F9FAFB' }}>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>
                                    <th style={{ padding: '12px', fontWeight: '600', color: '#374151' }}>Date</th>
                                    <th style={{ padding: '12px', fontWeight: '600', color: '#374151' }}>Staff</th>
                                    <th style={{ padding: '12px', fontWeight: '600', color: '#374151' }}>Rule Broken</th>
                                    <th style={{ padding: '12px', fontWeight: '600', color: '#374151' }}>Issue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {violations.map((err, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: index % 2 === 0 ? '#fff' : '#F9FAFB' }}>
                                        <td style={{ padding: '12px', color: '#111827', whiteSpace: 'nowrap' }}>{err.date}</td>
                                        <td style={{ padding: '12px', fontWeight: '500', color: '#111827' }}>{err.name}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>
                                                {err.rule}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', color: '#4B5563' }}>{err.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose} style={{ width: '100%' }}>
                        Close & Fix Roster
                    </button>
                </div>
            </div>
        </div>
    );
}