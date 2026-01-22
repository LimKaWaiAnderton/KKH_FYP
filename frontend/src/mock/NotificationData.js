// Mock Notification Data
// Structure: id, type (info/warning), message, time, isNew, isRead

const notificationData = [
    {
        id: 1,
        type: 'info',
        message: 'Schedule for November 2025 has been released.',
        time: '10 min ago',
        isNew: true,
        isRead: false
    },
    {
        id: 2,
        type: 'info',
        message: 'Your leave request has been approved.',
        time: '2 hours ago',
        isNew: false,
        isRead: false
    },
    {
        id: 3,
        type: 'warning',
        message: 'Please confirm your availability for December shifts.',
        time: '1 day ago',
        isNew: false,
        isRead: false
    },
    {
        id: 4,
        type: 'info',
        message: 'Monthly roster updated for January 2026.',
        time: '2 days ago',
        isNew: false,
        isRead: false
    },
    {
        id: 5,
        type: 'warning',
        message: 'Action required: Update your contact information.',
        time: '3 days ago',
        isNew: false,
        isRead: false
    }
];

export default notificationData;
