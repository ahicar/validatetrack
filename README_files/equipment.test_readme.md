# Equipment Handler Test Suite

This directory contains unit tests for the **Equipment AWS Lambda Handler**. The tests utilize `jest` as the testing framework and `aws-sdk-client-mock` to isolate testing logic from live AWS infrastructure.

## Overview

The test file (`equipment.test.js`) validates the functionality of the equipment API endpoints, specifically handling `GET` and `POST` requests. It mocks interactions with **Amazon DynamoDB** using the `aws-sdk-client-mock` library to ensure tests run quickly and reliably without making actual network calls.

## Core Technologies

* **Testing Framework:** `jest`
* **Mocking Library:** `aws-sdk-client-mock`
* **AWS SDK Version:** AWS SDK for JavaScript v3 (`@aws-sdk/lib-dynamodb`)

## Setup & Environment Variables

Before running the tests, the suite configures the necessary environment variables and resets the DynamoDB mock state:

* **Table Name:** The `process.env.EQUIPMENT_TABLE` is explicitly set to `ValidateTrack-Equipment-test`.
* **State Reset:** A `beforeEach` hook is used to run `ddbMock.reset()`, ensuring that mocked behaviors do not leak between individual test cases.

## Test Scenarios

The test suite covers three main scenarios:

### 1. Fetching Equipment List
* **Endpoint:** `GET /equipment`
* **Mocked Behavior:** Intercepts `ScanCommand` and resolves it with a mock array containing a single equipment item (`Autoclave Unit 3`).
* **Assertions:** * Expects a HTTP status code `200`.
    * Expects the response body array to have a length of `1`.

### 2. Validation Failure (Create Equipment)
* **Endpoint:** `POST /equipment` (with invalid payload)
* **Mocked Behavior:** None required (fails gracefully on validation logic).
* **Assertions:** * Expects a HTTP status code `400` when the `name` field is empty.

### 3. Successful Creation (Create Equipment)
* **Endpoint:** `POST /equipment` (with valid payload)
* **Mocked Behavior:** Intercepts `PutCommand` and resolves successfully.
* **Assertions:** * Expects a HTTP status code `201` when given a full, valid payload containing `name`, `location`, `lastCalibrationDate`, and `nextDueDate`.