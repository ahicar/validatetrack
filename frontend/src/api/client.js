const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    if (res.status === 204) return null;

    const data = await res.json();
    if (!res.ok) {
        const message = data.errors ? data.errors.join(', ') : data.message || 'Request failed'; 
        throw new Error(message);
    }
    return data;
}

export const api = {
    getEquipment: () => request('/equipment'),
    createEquipment: (data) => request('/equipment', { method: 'POST', body: JSON.stringify(data) }),
    deleteEquipment:  (id) => request(`/equipment/${id}`, { method: 'DELETE' }),
    getDeviations: () => request('/deviations'),
    createDeviation: (data) => request('/deviations', {methods: 'POST', body: JSON.stringify(data) }),
    deleteDeviation: (id) => request(`/deviations/${id}`, { method: 'DELETE' }),
}