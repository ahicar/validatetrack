const { mockClient } = require('aws-sdk-client-mock');
const { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const ddbMock = mockClient(DynamoDBDocumentClient);
process.env.DEVIATIONS_TABLE = 'ValidateTrack-Deviations-test';
const { handler } = require('../../src/handlers/deviations');

beforeEach(() => {
    ddbMock.reset();
});

test('GET /deviations returns 200 with a list', async () => {
    ddbMock.on(ScanCommand).resolves({ Items: [{ id: '1', equipmentId: 'eq-1', description: 'Broken seal', severity: 'Major', status: 'Open' }] });

    const result = await handler({ httpMethod: 'GET', pathParameters: null });

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toHaveLength(1);
});

test('GET /deviations/:id returns 200 when item exists', async () => {
    ddbMock.on(GetCommand).resolves({ Item: { id: '1', equipmentId: 'eq-1', description: 'Broken seal', severity: 'Major', status: 'Open' } });

    const result = await handler({ httpMethod: 'GET', pathParameters: { id: '1' } });

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.id).toBe('1');
});

test('GET /deviations/:id returns 404 when item does not exist', async () => {
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

test('POST /deviations returns 400 on invalid payload', async () => {
    const result = await handler({
        httpMethod: 'POST',
        pathParameters: null,
        body: JSON.stringify({ equipmentId: 'eq-1', description: '' }),
    });

    expect(result.statusCode).toBe(400);
});

test('POST /deviations returns 201 on valid payload', async () => {
    ddbMock.on(PutCommand).resolves({});

    const result = await handler({
        httpMethod: 'POST',
        pathParameters: null,
        body: JSON.stringify({
            equipmentId: 'eq-1',
            description: 'Calibration deviation',
            severity: 'Minor',
        }),
    });

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body);
    expect(body.status).toBe('Open');
    expect(body.equipmentId).toBe('eq-1');
});

test('PUT /deviations returns 404 when item does not exist', async () => {
    ddbMock.on(GetCommand).resolves({});

    const result = await handler({
        httpMethod: 'PUT',
        pathParameters: { id: 'missing-id' },
        body: JSON.stringify({
            equipmentId: 'eq-1',
            description: 'Updated description',
            severity: 'Major',
            status: 'Under Review',
        }),
    });

    expect(result.statusCode).toBe(404);
});

test('PUT /deviations returns 200 on valid update', async () => {
    const existingItem = {
        Item: {
            id: 'existing-id',
            equipmentId: 'eq-1',
            description: 'Old issue',
            severity: 'Minor',
            status: 'Open',
        },
    };

    ddbMock.on(GetCommand).resolves(existingItem);
    ddbMock.on(PutCommand).resolves({});

    const result = await handler({
        httpMethod: 'PUT',
        pathParameters: { id: 'existing-id' },
        body: JSON.stringify({
            equipmentId: 'eq-1',
            description: 'Updated issue description',
            severity: 'Major',
            status: 'Under Review',
        }),
    });

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.id).toBe('existing-id');
    expect(body.description).toBe('Updated issue description');
    expect(body.severity).toBe('Major');
    expect(body.status).toBe('Under Review');
});

test('PUT /deviations preserves the existing status when none is provided', async () => {
    const existingItem = {
        Item: {
            id: 'existing-id',
            equipmentId: 'eq-1',
            description: 'Old issue',
            severity: 'Minor',
            status: 'Open',
        },
    };

    ddbMock.on(GetCommand).resolves(existingItem);
    ddbMock.on(PutCommand).resolves({});

    const result = await handler({
        httpMethod: 'PUT',
        pathParameters: { id: 'existing-id' },
        body: JSON.stringify({
            equipmentId: 'eq-1',
            description: 'Updated issue description',
            severity: 'Major',
        }),
    });

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.status).toBe('Open');
});

test('DELETE /deviations returns 204', async () => {
    ddbMock.on(DeleteCommand).resolves({});

    const result = await handler({
        httpMethod: 'DELETE',
        pathParameters: { id: 'test-id' },
    });

    expect(result.statusCode).toBe(204);
});
