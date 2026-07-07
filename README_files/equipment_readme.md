# Equipment Management Lambda Handler

A Node.js AWS Lambda-style handler for managing equipment records in an Amazon DynamoDB table. This service provides a REST-style backend for full CRUD operations with built-in data validation, automatic status computation, and standard HTTP response routing.

---

## Architecture Overview

The handler acts as a single entry point for API requests, routing them to specific CRUD operations based on the HTTP method.

### Main Components

* **AWS SDK Clients:** Uses `DynamoDBClient` and `DynamoDBDocumentClient` for optimized DynamoDB operations.
* **UUID Generation:** Leverages `uuidv4()` to guarantee unique identifiers for new equipment records.
* **Validation Engine:** `validateEquipment()` enforces data integrity on incoming request payloads.
* **State Machine:** `computeEquipmentStatus()` dynamically derives the operational status of an asset based on its `nextDueDate`.
* **Response Helper:** `response()` standardizes API gateway-compatible HTTP responses.

---

## Environment Variables

The handler relies on the following environment variable being present in the execution environment:

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `EQUIPMENT_TABLE` | The name of the target Amazon DynamoDB Table. | `Production-Equipment-Inventory` |

---

## Routing & Entry Point

The core entry point is the `handler(event)` function. It intercepts incoming API gateway events and routes them according to the `event.httpMethod`:

| HTTP Method | Action | Description |
| :--- | :--- | :--- |
| **GET** | `getAll()` or `getOne(id)` | Retrieves all items or a single specific record. |
| **POST** | `create(data)` | Validates and provisions a new equipment asset. |
| **PUT** | `update(id, data)` | Modifies and re-evaluates an existing record. |
| **DELETE** | `remove(id)` | Permanently deletes a record. |
| *Any other* | *Fallback* | Returns `405 Method not allowed`. |

> 💡 **Error Handling:** The handler is wrapped in a global `try/catch` block. Any unhandled exceptions are caught automatically, logging the failure and returning a `500 Internal server error`.

---

## CRUD API Reference

### Get All Equipment
* **Method:** `GET`
* **Action:** `getAll()`
* **Behavior:** Performs a `ScanCommand` across the designated DynamoDB table.
* **Response:** `200 OK` with an array of all equipment records.

### Get Single Equipment
* **Method:** `GET` (with ID)
* **Action:** `getOne(id)`
* **Behavior:** Fetches a single item using `GetCommand`.
* **Responses:** * `200 OK` with the item payload if found.
    * `404 Not Found` (`Equipment not found`) if the ID does not exist.

### Create Equipment
* **Method:** `POST`
* **Action:** `create(data)`
* **Behavior:** 1. Runs payload through `validateEquipment()`.
    2. Generates a new record schema:
        * `id`: Automatically assigned UUID.
        * `name`, `location`, `lastCalibrationDate`, `nextDueDate`: Extracted from payload.
        * `status`: System-calculated via `nextDueDate`.
        * `createdAt`: Current ISO timestamp.
    3. Persists data using `PutCommand`.
* **Responses:**
    * `201 Created` with the newly provisioned item.
    * `400 Bad Request` (`Validation failed`) alongside validation errors if input is malformed.

### Update Equipment
* **Method:** `PUT`
* **Action:** `update(id, data)`
* **Behavior:** 1. Verifies asset existence via a DynamoDB lookup.
    2. Validates the incoming update data.
    3. Merges new fields into the existing record.
    4. Recomputes the asset `status` and sets an `updatedAt` timestamp.
    5. Overwrites the record via `PutCommand`.
* **Responses:**
    * `200 OK` with the freshly updated item.
    * `400 Bad Request` if validation checks fail.
    * `404 Not Found` if the targeted equipment ID does not exist.

### Remove Equipment
* **Method:** `DELETE`
* **Action:** `remove(id)`
* **Behavior:** Removes the specified item from the table using `DeleteCommand`.
* **Response:** `204 No Content` with an empty response body upon successful deletion.

---

## Security & IAM Policies
To ensure proper functionality in production, the execution IAM Role assigned to this Lambda function requires the following permissions on the target DynamoDB resource:

```JSON
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Scan",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/YOUR_EQUIPMENT_TABLE_NAME"
    }
  ]
}
```
## Local Testing
You can locally invoke the handler inside your unit test suites or development setups by passing a mock API Gateway event:

```JavaScript
const { handler } = require('./index');

const mockEvent = {
    httpMethod: 'POST',
    body: JSON.stringify({
        name: "Laser Interlocking System",
        location: "Optics Suite",
        lastCalibrationDate: "2026-05-10",
        nextDueDate: "2027-05-10"
    }),
    pathParameters: null
};

// Execution example
handler(mockEvent).then(response => console.log(response));
```