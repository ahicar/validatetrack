const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const EQUIPMENT_STORAGE_KEY = 'validatetrack-equipment';

function readLocalEquipment() {
    if (typeof window === 'undefined') return [];

    try {
        return JSON.parse(window.localStorage.getItem(EQUIPMENT_STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

function writeLocalEquipment(items) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(EQUIPMENT_STORAGE_KEY, JSON.stringify(items));
}

function createLocalEquipment(data) {
    const item = {
        id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        ...data,
        status: data.status || 'Qualified',
        createdAt: new Date().toISOString(),
    };

    const items = [...readLocalEquipment(), item];
    writeLocalEquipment(items);
    return item;
}

function deleteLocalEquipment(id) {
    const items = readLocalEquipment().filter((item) => item.id !== id);
    writeLocalEquipment(items);
    return null;
}

async function request(path, options = {}) {
    try {
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
    } catch (error) {
        if (path === '/equipment') {
            if (options.method === 'POST') {
                const payload = JSON.parse(options.body || '{}');
                return createLocalEquipment(payload);
            }

            if (options.method === 'DELETE') {
                return deleteLocalEquipment(path.split('/').pop());
            }

            return readLocalEquipment();
        }

        throw error;
    }
}

export const api = {
    getEquipment: () => request('/equipment'),
    createEquipment: (data) => request('/equipment', { method: 'POST', body: JSON.stringify(data) }),
    deleteEquipment: (id) => request(`/equipment/${id}`, { method: 'DELETE' }),
    getDeviations: () => request('/deviations'),
    createDeviation: (data) => request('/deviations', { method: 'POST', body: JSON.stringify(data) }),
    deleteDeviation: (id) => request(`/deviations/${id}`, { method: 'DELETE' }),
};