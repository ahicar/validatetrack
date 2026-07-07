# Deviation Management Service (AWS Lambda + DynamoDB)

A lightweight, serverless CRUD (Create, Read, Update, Delete) microservice handler designed for industrial and regulated environment validation systems. It handles event logging and tracking for equipment calibrations, variance logging, and deviation compliance reporting.

## Features

- **AWS SDK v3 Integration**: Built using the modern `@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb` client ecosystem.
- **RESTful Event Handler**: Implements a centralized router mapped to standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
- **Strict Data Validation**: Leverages isolated validation utilities to ensure compliance standards before hitting the data tier.
- **Auto-generated Metadata**: Built-in automated tracking for unique IDs (`uuidv4`), creation timestamps (`ISO 8601`), and open lifecycle states.

---

## Prerequisites & Architecture Dependencies

This module expects the following external utilities and infrastructure contexts:

1. **DynamoDB Table**: A table configured with a primary partition key named `id` (String).
2. **Local Utilities**:
   - `../utils/response`: An HTTP response formatter wrapping status codes and body structure payloads.
   - `../utils/validators`: Module exporting `validateDeviation(data)` returning an object match `{ isValid: boolean, errors: [] }`.

---

## Environment Variables

The function relies on the following runtime context configuration:

| Variable Name | Type | Description |
| :--- | :--- | :--- |
| `DEVIATIONS_TABLE` | `String` | The name of the target AWS DynamoDB table. |

---

## Endpoint Specification & API Reference

### 1. Get All Deviations
* **Method**: `GET`
* **Path Context**: `/deviations`
* **Response**: `200 OK`
  ```json
  [
    {
      "id": "e4b5df54-df23-4b68-b76e-ec9e41ff5733",
      "equipmentId": "EQ-204-PUMP",
      "description": "Calibration offset detected during quarterly validation.",
      "severity": "Medium",
      "status": "Open",
      "createdAt": "2026-07-06T22:15:00.000Z"
    }
  ]
### 2. Get Single Deviation
* **Method**: `GET`
* **Path Context**: `/deviations/{id}`
* **Path Parameters**: `id` (UUIDv4 String)
* **Responses**:
  - **200 OK**: Returns the matched record object.
  - **404 Not Found**: `{ "message": "Deviation not found" }`

---

### 3. Create Deviation Record
* **Method**: `POST`
* **Path Context**: `/deviations`
* **Request Body Payload**:
  ```json
  {
    "equipmentId": "EQ-204-PUMP",
    "description": "Calibration offset detected during quarterly validation.",
    "severity": "Medium"
  }

 * **Responses**:
  - **201 Created**: Returns the full persisted entity containing generated data keys (`id`, `status: "Open"`, `createdAt`).
  - **400 Bad Request**: Validation failure. `{ "message": "Validation failed", "errors": [...] }`

---

### 4. Update Existing Deviation
* **Method**: `PUT`
* **Path Context**: `/deviations/{id}`
* **Path Parameters**: `id` (UUIDv4 String)
* **Request Body Payload**:
  ```json
  {
    "equipmentId": "EQ-204-PUMP",
    "description": "Recalibration finalized. Metrics stable.",
    "severity": "Medium",
    "status": "Closed"
  }

 * **Responses**:
  - **200 OK**: Returns the freshly altered data object including updated timestamps.
  - **400 Bad Request**: Validation failure on modified properties.
  - **404 Not Found**: No historical log entry matches the parameters provided.

---

### 5. Remove Log Entry
* **Method**: `DELETE`
* **Path Context**: `/deviations/{id}`
* **Path Parameters**: `id` (UUIDv4 String)
* **Response**: `204 No Content`

---

## Exposed Module Functions

If importing this handler within an orchestrated testing suite (e.g., using `Jest`), the script explicitly exports individual sub-routines:

```javascript
const deviationService = require('./handlers/deviationHandler');

// Direct invocation alternatives for functional integration testing
// deviationService.handler(mockEvent);
// deviationService.getAll();
// deviationService.getOne(id);
// deviationService.create(data);
// deviationService.update(id, data);
// deviationService.remove(id); 
```

## Error Handling Standards

* **405 Method Not Allowed**: Occurs when an incoming request event utilizes an unsupported standard method hook.
* **500 Internal Server Error**: Catches unhandled SDK client dynamic connections or execution breaks safely, reporting runtime errors to cloud logs (`console.error`) without leaking sensitive connection details inside operational API footprints.