export const leaveRequestHistoryData = [
    {
        "id": 1,
        "user_id": 12,
        "start_date": "2025-03-10",
        "end_date": "2025-03-12",
        "total_days": 3,
        "status": "Approved",
        "applied_date": "2025-02-28",
        "leave_types": { "id": 1, "name": "Annual Leave" }
      },
      {
        "id": 2,
        "user_id": 12,
        "start_date": "2025-04-05",
        "end_date": "2025-04-05",
        "total_days": 1,
        "status": "Pending",
        "applied_date": "2025-03-30",
        "leave_types": { "id": 2, "name": "Sick Leave" }
      },
      {
        "id": 3,
        "user_id": 12,
        "start_date": "2025-05-05",
        "end_date": "2025-05-06",
        "total_days": 2,
        "status": "Rejected",
        "applied_date": "2025-04-01",
        "leave_types": { "id": 1, "name": "Annual Leave" }
      },
    
      /* More dataset for pagination */
      {
        "id": 4,
        "user_id": 12,
        "start_date": "2025-06-01",
        "end_date": "2025-06-03",
        "total_days": 3,
        "status": "Approved",
        "applied_date": "2025-05-20",
        "leave_types": { "id": 3, "name": "Childcare Leave" }
      },
      {
        "id": 5,
        "user_id": 12,
        "start_date": "2025-06-10",
        "end_date": "2025-06-10",
        "total_days": 1,
        "status": "Approved",
        "applied_date": "2025-06-01",
        "leave_types": { "id": 2, "name": "Sick Leave" }
      },
      {
        "id": 6,
        "user_id": 12,
        "start_date": "2025-07-15",
        "end_date": "2025-07-18",
        "total_days": 4,
        "status": "Pending",
        "applied_date": "2025-07-01",
        "leave_types": { "id": 4, "name": "Compassionate Leave" }
      },
      {
        "id": 7,
        "user_id": 12,
        "start_date": "2025-08-02",
        "end_date": "2025-08-03",
        "total_days": 2,
        "status": "Rejected",
        "applied_date": "2025-07-28",
        "leave_types": { "id": 1, "name": "Annual Leave" }
      },
      {
        "id": 8,
        "user_id": 12,
        "start_date": "2025-08-10",
        "end_date": "2025-08-12",
        "total_days": 3,
        "status": "Approved",
        "applied_date": "2025-08-01",
        "leave_types": { "id": 2, "name": "Sick Leave" }
      },
      {
        "id": 9,
        "user_id": 12,
        "start_date": "2025-09-01",
        "end_date": "2025-09-01",
        "total_days": 1,
        "status": "Pending",
        "applied_date": "2025-08-25",
        "leave_types": { "id": 5, "name": "Hospitalisation Leave" }
      },
      {
        "id": 10,
        "user_id": 12,
        "start_date": "2025-10-12",
        "end_date": "2025-10-14",
        "total_days": 3,
        "status": "Approved",
        "applied_date": "2025-10-01",
        "leave_types": { "id": 1, "name": "Annual Leave" }
      },
      {
        "id": 11,
        "user_id": 12,
        "start_date": "2025-10-20",
        "end_date": "2025-10-20",
        "total_days": 1,
        "status": "Rejected",
        "applied_date": "2025-10-15",
        "leave_types": { "id": 6, "name": "Marriage Leave" }
      },
      {
        "id": 12,
        "user_id": 12,
        "start_date": "2025-11-03",
        "end_date": "2025-11-05",
        "total_days": 3,
        "status": "Pending",
        "applied_date": "2025-10-29",
        "leave_types": { "id": 1, "name": "Annual Leave" }
      },
      {
        "id": 13,
        "user_id": 12,
        "start_date": "2025-11-15",
        "end_date": "2025-11-15",
        "total_days": 1,
        "status": "Approved",
        "applied_date": "2025-11-11",
        "leave_types": { "id": 2, "name": "Sick Leave" }
      },
      {
        "id": 14,
        "user_id": 12,
        "start_date": "2025-11-20",
        "end_date": "2025-11-22",
        "total_days": 3,
        "status": "Rejected",
        "applied_date": "2025-11-14",
        "leave_types": { "id": 3, "name": "Childcare Leave" }
      },
      {
        "id": 15,
        "user_id": 12,
        "start_date": "2025-12-02",
        "end_date": "2025-12-04",
        "total_days": 3,
        "status": "Approved",
        "applied_date": "2025-11-25",
        "leave_types": { "id": 1, "name": "Annual Leave" }
      }
]

export const leaveBalanceData = [
    {
        id: 1,
        user_id: 12,
        leave_type_id: 1,
        used_days: 5,
        remaining_days: 7,
        leave_types: {
            id: 1,
            name: "Annual Leave",
            annual_quota: 12
        }
    },
    {
        id: 2,
        user_id: 12,
        leave_type_id: 2,
        used_days: 2,
        remaining_days: 12,
        leave_types: {
            id: 2,
            name: "Sick Leave",
            annual_quota: 14
        }
    },
    {
        id: 3,
        user_id: 12,
        leave_type_id: 3,
        used_days: 3,
        remaining_days: 7,
        leave_types: {
            id: 3,
            name: "Childcare Leave",
            annual_quota: 10
        }
    }
];

export const leaveBalance = {
  "Annual Leave": 7,
  "Sick Leave": 12,
  "Childcare Leave": 6
};