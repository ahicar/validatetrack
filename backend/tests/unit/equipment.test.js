const { mockClient } = require('aws-sdk-client-mock');
const { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const ddbMock = mockClient(DynamoDBDocumentClient);
process.env.EQUIPMENT_TABLE = 'ValidateTrack-Equipment-test';
const { handler } = require('../../src/handlers/equipment');

beforeEach(() => {
    ddbMock.reset();
});

test('GET /equipment returns 200 with a list', async () => {
    ddbMock.on(ScanCommand).resolves({ Items: [{ id: '1', name: 'Autoclave Unit 3'}] });

    const result = await handler({ httpMethod: 'GET', pathParameters: null });

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toHaveLength(1);
});

test('GET /equipment/:id returns 200 when item exists', async () => {
    ddbMock.on(GetCommand).resolves({ Item: { id: '1', name: 'Autoclave Unit 3' } });

    const result = await handler({ httpMethod: 'GET', pathParameters: { id: '1' } });

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.id).toBe('1');
});

test('GET /equipment/:id returns 404 when item does not exist', async () => {
    ddbMock.on(GetCommand).resolves({});

    const result = await handler({ httpMethod: 'GET', pathParameters: { id: 'missing-id' } });

    expect(result.statusCode).toBe(404);
});

test('returns 405 for unsupported methods', async () => {
    const result = await handler({ httpMethod: 'PATCH', pathParameters: null });

    expect(result.statusCode).toBe(405);
});

test('returns 500 when DynamoDB throws', async () => {
    ddbMock.on(ScanCommand).rejects(new Error('db down'));

    const result = await handler({ httpMethod: 'GET', pathParameters: null });

    expect(result.statusCode).toBe(500);
});

test('POST /equipment returns 400 on invalid payload', async () => {
    const result = await handler({
        httpMethod: 'POST',
        pathParameters: null,
        body: JSON.stringify({ name: ''}),
    });

    expect(result.statusCode).toBe(400);
});

test('POST /equipment returns 201 on valid payload', async () => {
    ddbMock.on(PutCommand).resolves({});

    const result = await handler({
        httpMethod: 'POST',
        pathParameters: null,
        body: JSON.stringify({
            name: 'Autoclave Unit 3',
            location: 'Sterilization Room A',
            lastCalibrationDate: '2026-01-15',
            nextDueDate: '2026-12-15',
        }),
    });

    expect(result.statusCode).toBe(201);
});

test('PUT /equipment returns 404 when item does not exist', async () => {
    ddbMock.on(GetCommand).resolves({});

    const result = await handler({
        httpMethod: 'PUT',
        pathParameters: { id: 'missing-id' },
        body: JSON.stringify({
            name: 'Autoclave Unit 3',
            location: 'Sterilization Room A',
            lastCalibrationDate: '2026-01-15',
            nextDueDate: '2026-12-15',
        }),
    });

    expect(result.statusCode).toBe(404);
});

test('PUT /equipment returns 200 on valid update', async () => {
    ddbMock.on(GetCommand).resolves({ Item: { id: 'existing-id', name: 'Old Name', location: 'Old Room', lastCalibrationDate: '2026-01-15', nextDueDate: '2026-06-15' } });
    ddbMock.on(PutCommand).resolves({});

    const result = await handler({
        httpMethod: 'PUT',
        pathParameters: { id: 'existing-id' },
        body: JSON.stringify({
            name: 'Updated Name',
            location: 'New Room',
            lastCalibrationDate: '2026-01-15',
            nextDueDate: '2026-12-15',
        }),
    });

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.name).toBe('Updated Name');
    expect(body.location).toBe('New Room');
});

test('DELETE /equipment returns 204', async () => {
    ddbMock.on(DeleteCommand).resolves({});

    const result = await handler({ httpMethod: 'DELETE', pathParameters: { id: 'test-id' } });

    expect(result.statusCode).toBe(204);
});