const{
    validateEquipment,
    validateDeviation,
    computeEquipmentStatus,
} = require('../../src/utils/validators');

describe('validateEquipment', () => {
    const validEquipment = {
        name: 'Autoclave Unit 3',
        location: 'Sterilization Room A',
        lastCalibrationDate: '2026-01-15',
        nextDueDate: '2026-07-15',
    };

    test('accepts a fully valid equipment record', () => {
        const { isValid, errors } = validateEquipment(validEquipment);
        expect(isValid).toBe(true);
    });

    test('rejects a record missing a name', () => {
        const { isValid, errors } = validateEquipment({ ...validEquipment, name: '' });
        expect(isValid).toBe(false);
        expect(errors).toContain('name is required')
    });

    test('rejects an invalid date format', () => {
        const { isValid, errors } = validateEquipment({ ...validEquipment, nextDueDate: 'not-a-date' });
        expect(isValid).toBe(false);
    });
});

describe ('computeEquipmentStatus', () => {
    const today = new Date('2026-06-01');

    test('returns Overdue when due date is in the past', () => {
        expect(computeEquipmentStatus('2026-05-01', today)).toBe('Overdue');
    });

    test('returns Due Soon when due date is within 30 days', () => {
        expect(computeEquipmentStatus('2026-06-20', today)).toBe('Due Soon');
    })

    test('returns Qualified when due date is far in the future', () => {
        expect(computeEquipmentStatus('2026-12-01', today)).toBe('Qualified');
    });
});

describe ('validateDeviation', () => {
    const validDeviation = {
        equipmentId: '332436',
        description: 'equipment error',
        severity: 'Major',
        status: 'Under Review',
    };

    test('validates a complete deviation record', () => {
        const { isValid, errors } = validateDeviation(validDeviation);
        expect(isValid).toBe(true);
    });

    test('rejects an empty equipmentId', () => {
        const { isValid, errors } = validateDeviation({ ...validDeviation, equipmentId: ''});
        expect(isValid).toBe(false);
        expect(errors).toContain('equipmentId is required');
    });

    test('rejects an empty description', () => {
        const { isValid, errors } = validateDeviation({ ...validDeviation, description: ''});
        expect(isValid).toBe(false);
        expect(errors).toContain('description is required');
    });

    test('accepts a valid severity', () => {
        const { isValid, errors } = validateDeviation({ ...validDeviation, severity: 'Major'});
        expect(isValid).toBe(true);
    });

    test('accepts a valid status', () => {
        const { isValid, errors } = validateDeviation({ ...validDeviation, status: 'Under Review'});
        expect(isValid).toBe(true);
    });
});