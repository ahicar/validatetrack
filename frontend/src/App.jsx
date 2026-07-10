import { useEffect, useState } from 'react';
import { api } from './api/client';

function validateForm(values) {
    const errors = {};

    if (!values.name.trim()) {
        errors.name = 'Name is required.';
    }

    if (!values.location.trim()) {
        errors.location = 'Location is required.';
    }

    if (!values.lastCalibrationDate) {
        errors.lastCalibrationDate = 'Last calibration date is required.';
    } else if (isNaN(Date.parse(values.lastCalibrationDate))) {
        errors.lastCalibrationDate = 'Enter a valid date.';
    }

    if (!values.nextDueDate) {
        errors.nextDueDate = 'Next due date is required.';
    } else if (isNaN(Date.parse(values.nextDueDate))) {
        errors.nextDueDate = 'Enter a valid date.';
    }

    if (
        values.lastCalibrationDate &&
        values.nextDueDate &&
        !isNaN(Date.parse(values.lastCalibrationDate)) &&
        !isNaN(Date.parse(values.nextDueDate))
    ) {
        const lastDate = new Date(values.lastCalibrationDate);
        const nextDate = new Date(values.nextDueDate);
        if (nextDate < lastDate) {
            errors.nextDueDate = 'Next due date must be after last calibration.';
        }
    }

    return errors;
}

export default function App() {
    const [equipment, setEquipment] = useState([]);
    const [form, setForm] = useState({ name: '', location: '', lastCalibrationDate: '', nextDueDate: '' });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        api.getEquipment().then(setEquipment).catch(error => console.error('failed to load equipment:', error));
    }, []);

    const formErrors = validateForm(form);
    const isFormValid = Object.keys(formErrors).length === 0;

    async function handleSubmit(e) {
        e.preventDefault();
        const validationErrors = validateForm(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const created = await api.createEquipment(form);
            setEquipment((prev) => [...prev, created]);
            setForm({ name: '', location: '', lastCalibrationDate: '', nextDueDate: '' });
            setErrors({});
            setSubmitError('');
        } catch (error) {
            setSubmitError(error.message || 'Failed to create equipment.');
            console.error('Failed to create equipment:', error);
        }
    }

    function handleChange(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
        setSubmitError('');
    }

    return (
        <div>
            <h1>ValidateTrack</h1>
            <form onSubmit={handleSubmit} noValidate>
                <label style={{ display: 'block', marginBottom: '0.75rem' }}>
                    Equipment Name
                    <input
                        placeholder="e.g. Autoclave Unit 3"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
                    />
                    {errors.name && <div style={{ color: 'red', fontSize: '0.9rem' }}>{errors.name}</div>}
                </label>

                <label style={{ display: 'block', marginBottom: '0.75rem' }}>
                    Location
                    <input
                        placeholder="e.g. Sterilization Room A"
                        value={form.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
                    />
                    {errors.location && <div style={{ color: 'red', fontSize: '0.9rem' }}>{errors.location}</div>}
                </label>

                <label style={{ display: 'block', marginBottom: '0.75rem' }}>
                    Last Calibration Date
                    <input
                        type="date"
                        value={form.lastCalibrationDate}
                        onChange={(e) => handleChange('lastCalibrationDate', e.target.value)}
                        style={{ display: 'block', marginTop: '0.25rem' }}
                    />
                    {errors.lastCalibrationDate && (
                        <div style={{ color: 'red', fontSize: '0.9rem' }}>{errors.lastCalibrationDate}</div>
                    )}
                </label>

                <label style={{ display: 'block', marginBottom: '0.75rem' }}>
                    Next Due Date
                    <input
                        type="date"
                        value={form.nextDueDate}
                        onChange={(e) => handleChange('nextDueDate', e.target.value)}
                        style={{ display: 'block', marginTop: '0.25rem' }}
                    />
                    {errors.nextDueDate && <div style={{ color: 'red', fontSize: '0.9rem' }}>{errors.nextDueDate}</div>}
                </label>

                <button type="submit" disabled={!isFormValid}>Save Equipment</button>
                {submitError && <div style={{ color: 'red', marginTop: '0.75rem' }}>{submitError}</div>}
            </form>
            <ul>
                {equipment.map((item) => (
                    <li key={item.id}>{item.name} - {item.status}</li>
                ))}
            </ul>
        </div>
    );
}