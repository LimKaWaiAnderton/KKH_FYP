import { HiOutlineBell } from 'react-icons/hi';

export default function HeaderWithPublishBtn({ title, onPublish, onNotifications }) {
  return (
    <header>
      <div className="header-content">
        <h2>{title}</h2>
        <div className="schedule-header-actions">
          <button className="publish-btn" onClick={onPublish}>
            Publish
          </button>
          <button className="notification-btn" onClick={onNotifications}>
            <HiOutlineBell/>
          </button>
        </div>
      </div>
    </header>
  );
}
