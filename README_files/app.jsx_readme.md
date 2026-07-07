# ValidateTrack - Equipment Calibration Management

A React application for managing and tracking equipment calibration status and schedules.

---

## 📋 Table of Contents

- [Features](#features)
- [Technical Stack](#technical-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Code Explanation](#code-explanation)
- [**API** Integration](#api-integration)
- [Validation Rules](#validation-rules)
- [Component Structure](#component-structure)
- [Development](#development)
- [Contributing](#contributing)

---

## Features

- **Equipment Management**: Add and view calibration equipment
- **Form Validation**: Real-time validation for all input fields
- **Date Tracking**: Manage last calibration and next due dates
- **Error Handling**: Comprehensive validation with user-friendly error messages
- ****API** Integration**: Persistent storage via **REST** **API**

---

## Technical Stack

- **React**: Functional components with Hooks (useState, useEffect)
- **JavaScript**: **ES6**+ syntax
- **CSS**: Inline styles for basic styling (ready for customization)

---

## Installation

## Clone the repository:

```bash git clone [repository-url] cd validatetrack ```

## Install dependencies:

```bash npm install ```

## Start the development server:

```bash npm start ```

---

## Usage

### Adding New Equipment

## Fill in the form fields:

    - **Name**: Equipment identifier (required)
    - **Location**: Physical location (required)
    - **Last Calibration Date**: Date of last calibration (required)
    - **Next Due Date**: When calibration is next due (required)

## The form validates automatically:

    - All fields are required
    - Dates must be valid
    - Next due date must be after last calibration date

## Click **Save** to add the equipment

### Viewing Equipment List

- All saved equipment appears in a list below the form
- Each item shows: Name and Status

---

## Code Explanation

### 1. Imports and Dependencies

```javascript
import { useEffect, useState } from 'react';
import { api } from './api/client';
```
- **React Hooks**: `useEffect` for side effects (data fetching), `useState` for state management
- ****API** Client**: Custom **API** module for making **HTTP** requests to the backend

---

### 2. Validation Function

```javascript
function validateForm(values) {
    const errors = {};
    // ... validation logic
    return errors;
}
```

**Purpose**: Centralized validation logic for the equipment form

**How it works**:
- Takes form values as input
- Returns an errors object where:
    - Keys are field names
    - Values are error messages
    - Empty object means no errors

**Validation Rules**:
1. **Name**: Required, not empty or whitespace
2. **Location**: Required, not empty or whitespace
3. **Last Calibration Date**: Required and valid date format
4. **Next Due Date**: Required, valid date, and must be after last calibration

**Key Implementation Details**:
```javascript
if (!values.name.trim()) {
    errors.name = 'Name is required.';
}
```
- Uses `.trim()` to check for whitespace-only input
- Falls back to checking if date string is valid using `Date.parse()`

---

### 3. Main Component - App

```javascript
export default function App() {
    const [equipment, setEquipment] = useState([]);
    const [form, setForm] = useState({ name: '', location: '', lastCalibrationDate: '', nextDueDate: '' });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    // ... component logic
}
```

**State Management**:

| State | Type | Purpose |
|-------|------|---------|
| `equipment` | Array | Stores all equipment items from API |
| `form` | Object | Current form field values |
| `errors` | Object | Validation error messages per field |
| `submitError` | String | General API/network error message |

---

### 4. Data Fetching with useEffect

```javascript
useEffect(() => {
    api.getEquipment()
    .then(setEquipment)
    .catch(error => console.error('failed to load equipment:', error));
}, []);
```

**Behavior**:
- Runs once on component mount (empty dependency array)
- Fetches existing equipment data
- Updates state on success, logs error on failure

---

### 5. Form Validation State

```javascript const formErrors = validateForm(form); const isFormValid = Object.keys(formErrors).length === 0; ```

**Logic**:
- Re-validates form on every render
- `isFormValid` determines if Save button should be enabled
- Provides real-time validation feedback

---

### 6. Form Submission Handler

```javascript
async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
    }

    try {
    const created = await api.createEquipment(form);
    setEquipment([...equipment, created]);
    setForm({ name: '', location: '', lastCalibrationDate: '', nextDueDate: '' });
    setErrors({});
    setSubmitError('');
    } catch (error) {
    setSubmitError(error.message || 'Failed to create equipment.');
    console.error('Failed to create equipment:', error);
    }
}
```

**Flow**: ## Prevent default form submission ## Validate form data ## If invalid, display errors and stop ## If valid, call API to create equipment ## Update equipment list with new item ## Reset form fields and errors ## Handle any API errors

---

### 7. Change Handler

```javascript
function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
    setSubmitError('');
}
```

**Features**:
- Updates specific field in form state
- Clears error for that field (live error removal)
- Clears any previous submit errors
- Uses functional updates for reliable state changes

---

### 8. Render Logic

```javascript
return (
    <div>
    <h1>ValidateTrack</h1>
    <form onSubmit={handleSubmit} noValidate>
    {/* Form fields with error display */}
    <button type=*submit* disabled={!isFormValid}>Save</button>
    {submitError && <div style={{ color: 'red', marginTop: '0.75rem' }}>{submitError}</div>}
    </form>
    <ul>
    {equipment.map((item) => (
    <li key={item.id}>{item.name} - {item.status}</li>
    ))}
    </ul>
    </div>
);
```

**Key Points**:
- `noValidate` attribute prevents browser's default validation
- Save button disabled when form is invalid
- Conditional rendering for errors
- Each equipment item uses `item.id` as React key
- Shows status along with equipment name

---

### 9. Error Display Patterns

**Field-Specific Errors**:
```javascript
{errors.name && <div style={{ color: 'red', fontSize: '0.9rem' }}>{errors.name}</div>}
```
- Only renders if error exists
- Consistent styling for all field errors

**Submit Error**:
```javascript
{submitError && <div style={{ color: 'red', marginTop: '0.75rem' }}>{submitError}</div>}
```
- Appears below form when **API** error occurs
- Cleared on new form input

---

## API Integration

The application uses a **REST** **API** client (`./api/client`) with the following endpoints:

### GET `/api/equipment`

Fetches all equipment records

### POST `/api/equipment`

Creates a new equipment record

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Name | Must not be empty or whitespace only | *Name is required.* |
| Location | Must not be empty or whitespace only | *Location is required.* |
| Last Calibration Date | Must be a valid date | *Enter a valid date.* / *Last calibration date is required.* |
| Next Due Date | Must be a valid date and after Last Calibration Date | *Enter a valid date.* / *Next due date must be after last calibration.* |

---

## Component Structure

```
App
├── Header
│   └── *ValidateTrack*
├── Form (Equipment Entry)
│   ├── Name input
│   ├── Location input  
│   ├── Last Calibration Date (type=*date*)
│   ├── Next Due Date (type=*date*)
│   └── Save button (disabled if form invalid)
├── Error Display
│   ├── Field-specific errors (red text)
│   └── Submit errors (red text)
└── Equipment List
    ├── Equipment item 1
    ├── Equipment item 2
    └── Equipment item N
```

---

## Development

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

### Suggested Improvements

1. **Extract Validation**: Move `validateForm` to a separate utility file
2. **Custom Hooks**: Create `useEquipment` hook for **API** operations
3. **Component Split**: Break form and equipment list into separate components
4. **Styling**: Use **CSS** modules or styled-components
5. **Loading States**: Add loading spinners during **API** calls
6. **Delete Feature**: Add ability to remove equipment
7. **Edit Feature**: Allow updating existing equipment
8. **Testing**: Add unit tests for validation and components

---

## Contributing

## Fork the repository

## Create your feature branch (`git checkout -b feature/amazing-feature`) ## Commit your changes (`git commit -m 'Add some amazing feature'`) ## Push to the branch (`git push origin feature/amazing-feature`) ## Open a Pull Request

---

## License

This project is licensed under the **MIT** License.

---

## Contact

For questions or support, please open an issue in the repository.