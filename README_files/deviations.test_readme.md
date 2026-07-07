# Deviations Handler Tests

This repository contains unit tests for the `deviations` Lambda handler. The tests validate the CRUD (Create, Read, Update, Delete) functionality of the API gateway endpoint interacting with Amazon DynamoDB, using mocked AWS clients to ensure speed and isolation.

---

## Features Tested

The test suite covers the following HTTP methods and scenarios for the `/deviations` endpoint:

| HTTP Method | Scenario | Expected Status | Description |
| :--- | :--- | :--- | :--- |
| **GET** | Fetch all deviations | `200 OK` | Returns a list of all tracked deviation records. |
| **POST** | Invalid payload | `400 Bad Request` | Fails validation if required fields (like a non-empty description) are missing. |
| **POST** | Valid payload | `201 Created` | Successfully creates a new deviation with a default status of `Open`. |
| **PUT** | Item not found | `404 Not Found` | Fails gracefully if trying to update a non-existent deviation ID. |
| **PUT** | Valid update | `200 OK` | Successfully updates an existing deviation's attributes (e.g., severity, description, status). |
| **DELETE** | Delete deviation | `204 No Content` | Successfully removes a deviation by its unique ID. |

---

## Tech Stack & Tools

* **Testing Framework:** [Jest](https://jestjs.io/)
* **AWS SDK Framework:** AWS SDK for JavaScript v3 (`@aws-sdk/lib-dynamodb`)
* **Mocking Library:** `aws-sdk-client-mock` (used to mock `DynamoDBDocumentClient` commands without making real network requests)

---

## Environment Variables

The test suite automatically injects the following environment variable required by the handler:

* `DEVIATIONS_TABLE`: Hardcoded to `ValidateTrack-Deviations-test` during the test execution runtime.

---

## Getting Started

### Prerequisites

Ensure you have Node.js installed, then install the required dependencies:

```bash
npm install --save-dev jest aws-sdk-client-mock @aws-sdk/lib-dynamodb
```
---


# This is a Jest unit test file for deviations.js.

## Key parts

- `aws-sdk-client-mock` mocks AWS SDK DynamoDB calls.
- `DynamoDBDocumentClient` and command classes are imported so tests can intercept `ScanCommand`, `GetCommand`, `PutCommand`, and `DeleteCommand`.
- `process.env.DEVIATIONS_TABLE` is set to a test table name before loading the handler.
- `handler` is the function under test.

## Test cases

1. `GET /deviations returns 200 with a list`
   - Mocks `ScanCommand` to return one item.
   - Calls handler with `GET` and no `pathParameters`.
   - Verifies response status is `200` and body contains one item.

2. `POST /deviations returns 400 on invalid payload`
   - Sends invalid POST data with empty `description`.
   - Verifies the handler returns `400`.

3. `POST /deviations returns 201 on valid payload`
   - Mocks `PutCommand` success.
   - Sends valid deviation payload.
   - Verifies response is `201` and the created item has `status: 'Open'`.

4. `PUT /deviations returns 404 when item does not exist`
   - Mocks `GetCommand` to return no item.
   - Sends a PUT for `missing-id`.
   - Verifies response is `404`.

5. `PUT /deviations returns 200 on valid update`
   - Mocks `GetCommand` to return an existing deviation.
   - Mocks `PutCommand` success.
   - Sends updated deviation data.
   - Verifies response is `200` and the returned body contains updated fields.

6. `DELETE /deviations returns 204`
   - Mocks `DeleteCommand` success.
   - Calls handler with `DELETE`.
   - Verifies response is `204`.

## Overall behavior

These tests confirm the deviations handler:
- handles CRUD HTTP methods,
- validates payloads,
- returns the appropriate HTTP status codes,
- and uses mocked DynamoDB operations instead of real AWS calls. 