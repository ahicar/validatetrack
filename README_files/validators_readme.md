# Data Validators & Business Logic Layer (`validators.js`)

This module provides data validation logic and automated lifecycle state computation for core system assets, specifically targeting **Equipment Management** and **Operational Deviations**. It ensures data integrity and schema compliance before database mutation operations.

## Core Enums & Enforced States

The module enforces standard taxonomies through immutable arrays:

* **`EQUIPMENT_STATUSES`**: `'Qualified'`, `'Due Soon'`, `'Overdue'`
* **`DEVIATION_SEVERITIES`**: `'Minor'`, `'Major'`, `'Critical'`
* **`DEVIATION_STATUSES`**: `'Open'`, `'Under Review'`, `'Closed'`

---

## API Reference

### 1. `validateEquipment(data)`
Validates an equipment configuration object against system requirements.

* **Parameters:** `data` (Object) - The target payload to validate.
* **Returns:** An object structured as follows:
    ```javascript
    {
      isValid: boolean,
      errors: string[] // Array of validation error messages
    }
    ```

#### Validation Specifications
| Field | Type | Rules / Constraints |
| :--- | :--- | :--- |
| `name` | `string` | Required. Must be a non-empty string after trimming whitespace. |
| `location` | `string` | Required. Must be a valid string primitive. |
| `lastCalibrationDate` | `string` / `Date` | Required. Must resolve to a valid calendar date representation. |
| `nextDueDate` | `string` / `Date` | Required. Must resolve to a valid calendar date representation. |
| `status` | `string` | Optional. If supplied, must exactly match a value within `EQUIPMENT_STATUSES`. |

---

### 2. `validateDeviation(data)`
Validates an operational deviation report payload.

* **Parameters:** `data` (Object) - The deviation data payload.
* **Returns:**
    ```javascript
    {
      isValid: boolean,
      errors: string[]
    }
    ```

#### Validation Specifications
| Field | Type | Rules / Constraints |
| :--- | :--- | :--- |
| `equipmentId` | `string` | Required. Must be a valid string linking to a parent equipment record. |
| `description` | `string` | Required. Must be a non-empty string after trimming whitespace. |
| `severity` | `string` | Required. Must exactly match one of: `Minor`, `Major`, or `Critical`. |
| `status` | `string` | Optional. If supplied, must exactly match one of: `Open`, `Under Review`, or `Closed`. |

---

### 3. `computeEquipmentStatus(nextDueDate, today)`
Calculates the context-aware operational status of a piece of equipment based on its next validation/calibration due date.

* **Parameters:**
    * `nextDueDate` (`string` | `Date`) - The target deadline.
    * `today` (`Date`, *Optional*) - Reference date anchor. Defaults to the current execution system timestamp (`new Date()`).
* **Returns:** `string` (Exactly maps to one of the values in `EQUIPMENT_STATUSES`)

#### Lifecycle State Timeline Logic
```
  > 30 Days Remaining             0 to 30 Days Remaining          < 0 Days (Past Due)
[-----------------------] | [---------------------------] | [--------------------]
       Qualified                      Due Soon                        Overdue
```

* **`'Qualified'`**: Returned when the deadline is safely more than 30 days away.
* **`'Due Soon'`**: Returned when the deadline falls within the next 30 days (inclusive of 0).
* **`'Overdue'`**: Returned when the deadline has passed (negative days remaining).

---

## Usage Examples

### Validating Inbound Payloads
```javascript
const { validateEquipment, validateDeviation } = require('./validators');

// Example: Invalid Equipment Payload
const equipmentResult = validateEquipment({
    name: " ",
    location: "Cleanroom Alpha",
    lastCalibrationDate: "invalid-date"
});

console.log(equipmentResult.isValid); // false
console.log(equipmentResult.errors);  // ['name is required', ...]
```

### Computing Lifecycle Statuses Dynamically
```javascript
const { computeEquipmentStatus } = require('./validators');

// Scenario 1: Date is far in the future (> 30 days)
console.log(computeEquipmentStatus('2026-12-25', new Date('2026-07-05'))); // "Qualified"

// Scenario 2: Date is approaching (<= 30 days)
console.log(computeEquipmentStatus('2026-07-20', new Date('2026-07-05'))); // "Due Soon"

// Scenario 3: Date has passed (< 0 days)
console.log(computeEquipmentStatus('2026-06-01', new Date('2026-07-05'))); // "Overdue"
```

---

## Technical Notes
* **Deterministic Fallback:** The state machine evaluates explicitly to a default state of `'Qualified'`. It guarantees that a valid status string matching `EQUIPMENT_STATUSES` is returned under all chronological conditions, eliminating unhandled `undefined` states in consuming services.
* **Data Isolation:** The validation utilities operate entirely via pure functions. They do not read or modify external databases directly, making them safe for pre-save middleware and unit testing suites.