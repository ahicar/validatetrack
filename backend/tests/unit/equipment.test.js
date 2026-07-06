const { mockClient } = require('aws-sdk-client-mock');
const { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

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