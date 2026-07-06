const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const{
    DynamoDBDocumentClient,
    ScanCommand,
    GetCommand,
    PutCommand,
    DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const { response } = require('../utils/response');
const { validateEquipment, computeEquipmentStatus } = require('../utils/validators');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.EQUIPMENT_TABLE;

async function handler(event) {
    const { httpMethod, pathParameters } = event;
    const id = pathParameters && pathParameters.id;

    try {
        switch (httpMethod) {
            case 'GET':
                return id ? await getOne(id) : await getAll();
            case 'POST':
                return await create(JSON.parse(event.body || '{}'));
            case 'PUT':
                return await update(id, JSON.parse(event.body || '{}'));
            case 'DELETE':
                return await remove(id);
            default:
                return response(405, { message: `Method ${httpMethod} not allowed` });               
        }
    } catch (err) {
        console.error('Unhandled error', err);
        return response(500, { message: 'Internal server error' });
    }
}

async function getAll() {
    const result = await docClient.send(new ScanCommand ({ TableName: TABLE_NAME }));
    return response(200, result.Items || []);    
}

async function getOne(id) {
    const result = await docClient.send(new GetCommand ({ TableName: TABLE_NAME, Key: { id } }));
    if (!result.Item) return response(404, {message: 'Equipment not found' });
    return response(200, result.Item);
}

async function create(data) {
    const { isValid, errors } = validateEquipment(data);
    if (!isValid) return response(400, { message: 'Validation failed', errors });

    const item = {
        id: uuidv4(),
        name: data.name,
        location: data.location,
        lastCalibrationDate: data.lastCalibrationDate,
        nextDueDate: data.nextDueDate,
        status: computeEquipmentStatus(data.nextDueDate),
        createdAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
    return response(201, item);
}

async function update(id, data) {
    const existing = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
    if (!existing.Item) return response(404, { message: 'Equipment not found' });

    const { isValid, errors} = validateEquipment(data);
    if (!isValid) return response(400, { message: 'Validation failed', errors });

    const updated = {
        ...existing.Item,
        name: data.name,
        location: data.location,
        lastCalibrationDate: data.lastCalibrationDate,
        nextDueDate: data.nextDueDate,
        status: computeEquipmentStatus(data.nextDueDate),
        updatedAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: updated }));
    return response(200, updated);
}

async function remove(id) {
    await docClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }));
    return response(204, {});
}

module.exports = { handler, getAll, getOne, create, update, remove };