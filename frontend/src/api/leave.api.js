import { authFetch } from "../utils/authFetch";

// USER & ADMIN
export async function fetchHistory() {
    try {
        const res = await authFetch('http://localhost:5000/api/leaves');
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.msg || 'Failed to fetch leave request history');
        }

        return data;

    } catch (error) {
        console.error('Error fetching leave request history:', error);
        throw error;
    }
};

// USER
export async function addLeaveRequest(newRequest) {
    try {
        const res = await authFetch(`http://localhost:5000/api/leaves`, {
            method: 'POST',
            body: JSON.stringify(newRequest)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.msg || 'Failed to submit leave request');
        }

        return data;

    } catch (error) {
        console.error('Error submitting leave request:', error);
        throw error;
    }
};

export async function fetchLeaveBalance() {
    try {
        const res = await authFetch('http://localhost:5000/api/leaves/balance');
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.msg || 'Failed to fetch leave balance');
        }

        return data;

    } catch (error) {
        console.error('Error fetching leave request balance:', error);
        throw error;
    }
};

export async function fetchLeaveTypeName() {
    try {
        const res = await authFetch('http://localhost:5000/api/leaves/types');
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.msg || 'Failed to fetch leave type names');
        }

        return data;

    } catch (error) {
        console.error('Error fetching leave type name:', error);
        throw error;
    }
}

// ADMIN
export async function fetchRequestedHistory(leaveReq) {
    const { id } = leaveReq;
    try {
        const res = await authFetch(`http://localhost:5000/api/leaves/${id}`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.msg || 'Failed to fetch leave request history');
        }

        return data;

    } catch (error) {
        console.error('Error fetching leave request history:', error);
    }
}

export async function updateLeaveRequest(request) {
    const { id } = request;
    try {
        const res = await authFetch(`http://localhost:5000/api/leaves/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.msg || 'Failed to approve leave request');
        }

        return data;

    } catch (error) {
        throw error;
    }
} 