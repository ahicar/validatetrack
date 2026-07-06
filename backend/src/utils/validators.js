const EQUIPMENT_STATUSES = ['Qualified', 'Due Soon', 'Overdue'];
const DEVIATION_SEVERITIES = ['Minor', 'Major', 'Critical'];
const DEVIATION_STATUSES = ['Open', 'Under Review', 'Closed'];

function validateEquipment(data){
    const errors = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
        errors.push('name is required');    
    } //
    if (!data.location || typeof data.location !== 'string') {
        errors.push('location is required');
    }
    if (!data.lastCalibrationDate || isNaN(Date.parse(data.lastCalibrationDate))) {
        errors.push('lastCalibrationDate must be a valid date (YYYY-MM-DD)');
    } 
    if (!data.nextDueDate || isNaN(Date.parse(data.nextDueDate))) {
        errors.push('nextDueDate must be a valid date (YYYY-MM-DD)');
    }
    if (data.status && !EQUIPMENT_STATUSES.includes(data.status)) {
        errors.push(`status must be one of: ${EQUIPMENT_STATUSES.join(', ')}`);
    }

    return { isValid: errors.length === 0, errors };
} 

function validateDeviation(data){
    const errors = [];

    if (!data.equipmentId || typeof data.equipmentId !== 'string') {
        errors.push('equipmentId is required');
    }
    if (!data.description || data.description.trim() === '') {
        errors.push('description is required'); 
    }
    if (!data.severity || !DEVIATION_SEVERITIES.includes(data.severity)) {
        errors.push(`severity must be one of: ${DEVIATION_SEVERITIES.join(', ')}`);
    }
    if (data.status && !DEVIATION_STATUSES.includes(data.status)) {
        errors.push(`status must be one of: ${DEVIATION_STATUSES.join(', ')}`);
    }

    return { isValid: errors.length === 0, errors };
}

function computeEquipmentStatus(nextDueDate, today = new Date()) {
    const due = new Date(nextDueDate);
    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return 'Overdue';
    if (daysUntilDue <= 30) return 'Due Soon';

    // Default fallback state for equipment with > 30 days remaining
    return 'Qualified';
}

module.exports = {
    validateEquipment,
    validateDeviation,
    computeEquipmentStatus,
    EQUIPMENT_STATUSES,
    DEVIATION_SEVERITIES,
    DEVIATION_STATUSES,
};