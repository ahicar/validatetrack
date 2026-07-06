# Equipment Management Lambda Handler

This module contains an AWS Lambda handler designed to manage equipment records in an Amazon DynamoDB table. It provides full CRUD (Create, Read, Update, Delete) functionality using the AWS SDK for JavaScript v3 (`@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb`).

---

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [API Endpoints](#api-endpoints)
- [Code Structure & Functions](#code-structure--functions)
- [Environment Variables](#environment-variables)

---

## Architecture Overview

The script acts as a router inside an AWS Lambda function, typically fronted by an Amazon API Gateway. Depending on the incoming HTTP method (`GET`, `POST`, `PUT`, `DELETE`), it routes the request to the appropriate CRUD helper function interacting with DynamoDB.

---

## API Endpoints

| HTTP Method | Path | Action | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/equipment` | `getAll()` | Scans and retrieves all equipment records. |
| **GET** | `/equipment/{id}` | `getOne(id)` | Fetches a specific equipment record by its unique ID. |
| **POST** | `/equipment` | `create(data)` | Validates, generates an ID, computes status, and stores a new piece of equipment. |
| **PUT** | `/equipment/{id}` | `update(id, data)` | Fetches, validates, updates, and re-computes status for an existing record. |
| **DELETE**| `/equipment/{id}` | `remove(id)` | Deletes an equipment record by its ID. |

---

## Code Structure & Functions

### `handler(event)`
The entry point for the Lambda function. It parses the `httpMethod` and `pathParameters` from the API Gateway event to route the request to its matching CRUD operation. It also handles global error catching.

### Helper Operations
* **`getAll()`**: Uses the DynamoDB `ScanCommand` to retrieve all items from the table.
* **`getOne(id)`**: Uses `GetCommand` to fetch a single item. Returns a `404` if the item is not found.
* **`create(data)`**: Validates incoming payloads via `validateEquipment`. If valid, it assigns a unique `uuidv4()` ID, calculates the equipment status based on its next calibration due date, and writes it to the database via `PutCommand`.
* **`update(id, data)`**: Verifies if the record exists, runs validations on the new data, updates fields, updates the `status`, and saves the modified entry.
* **`remove(id)`**: Executes a `DeleteCommand` to remove the specified item.

---

## Environment Variables

The function relies on the following environment variable being configured in your Lambda environment:

| Variable Name | Description |
| :--- | :--- |
| `EQUIPMENT_TABLE` | The name of the target Amazon DynamoDB table. |

---
