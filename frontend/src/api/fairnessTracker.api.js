import { authFetch } from "../utils/authFetch";

// Get fairness tracker data (N and RRT shift counts per employee)
export async function getFairnessTrackerData(startDate, endDate) {
    const res = await authFetch('http://localhost:5000/api/auto-schedule/fairness-tracker', {
        method: 'POST',
        body: JSON.stringify({ startDate, endDate })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch fairness tracker data');
    return data;
}
