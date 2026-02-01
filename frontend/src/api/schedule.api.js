import { authFetch } from "../utils/authFetch";

// Generate roster for a date range
export async function generateRoster(startDate, endDate) {
    try {
        const res = await authFetch('https://kkh-fyp-backend.onrender.com/api/auto-schedule/generate', {
            method: 'POST',
            body: JSON.stringify({ startDate, endDate })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Failed to generate roster');
        }

        return data;

    } catch (error) {
        console.error('Error generating roster:', error);
        throw error;
    }
}
