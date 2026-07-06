# Equipment Validation Test Suite (`validators.test.js`)

This document outlines the test coverage, structure, and execution for the utility validation functions used in the equipment management system. These tests ensure data integrity for equipment records, deviations, and status calculations.

---

## Technical Overview

The test suite is written using **Jest** and targets the following modules imported from `../../src/utils/validators`:
* `validateEquipment`
* `validateDeviation`
* `computeEquipmentStatus`

---

## Test Suites Breakdown

### 1. `validateEquipment`
Ensures that equipment objects conform to system schema requirements before they are processed or saved.

* **Test Cases:**
    * `accepts a fully valid equipment record`: Verifies a structurally sound object (`name`, `location`, `lastCalibrationDate`, `nextDueDate`) returns `isValid: true`.
    * `rejects a record missing a name`: Validates that empty strings trigger a failure state and return the specific error message `name is required`.
    * `rejects an invalid date format`: Ensures fallback logic flags poorly formatted date strings (e.g., `'not-a-date'`) as invalid.

### 2. `computeEquipmentStatus`
Verifies the time-sensitive business logic that determines an asset's compliance state relative to a static anchor date (`2026-06-01`).

| Scenario | Target Due Date | Expected Status |
| :--- | :--- | :--- |
| Due date has passed | `2026-05-01` | **`Overdue`** |
| Due date is within 30 days | `2026-06-20` | **`Due Soon`** |
| Due date is far in the future | `2026-12-01` | **`Qualified`** |

### 3. `validateDeviation`

The `validateDeviation` function is responsible for ensuring that all deviation records contain the required fields and adhere to acceptable data constraints before they are processed further. 

#### Validation Schema & Rules

A valid deviation object must include the following properties:

| Property | Type | Required | Description / Constraints |
| :--- | :--- | :--- | :--- |
| `equipmentId` | `string` | **Yes** | Cannot be empty. |
| `description` | `string` | **Yes** | Cannot be empty. Describes the nature of the error. |
| `severity` | `string` | **Yes** | Must match an accepted severity tier (e.g., `'Major'`). |
| `status` | `string` | **Yes** | Must match an accepted workflow status (e.g., `'Under Review'`). |

#### Test Coverage

The test suite ensures robust data integrity by verifying both happy paths and edge cases:

* **Happy Path Verification:**
    * Confirms a complete, correctly formatted deviation record passes validation (`isValid: true`).
* **Required Field Enforcement:**
    * Rejects empty `equipmentId` strings and returns an `'equipmentId is required'` error.
    * Rejects empty `description` strings and returns a `'description is required'` error.
* **Enumeration & Value Checks:**
    * Validates that accepted values for `severity` and `status` are processed successfully.

---

## Mock Data Structures

The suite utilizes a standardized mock equipment object for testing mutations safely without affecting a live database:

```javascript
{
    name: 'Autoclave Unit 3',
    location: 'Sterilization Room A',
    lastCalibrationDate: '2026-01-15',
    nextDueDate: '2026-07-15',
}

```
The suite also uses a mock deviation record for testing valid deviations:

```javascript
{
    equipmentId: '332436',
    description: 'equipment error',
    severity: 'Major',
    status: 'Under Review',
}