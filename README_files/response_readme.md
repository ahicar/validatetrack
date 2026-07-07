# API Response Helper

A simple utility function for generating standard, consistent HTTP response objects for AWS Lambda (API Gateway proxy integration) or other Node.js serverless functions. It automatically includes CORS headers and stringifies the JSON body.

## Features

- **Standardized Structure**: Returns an object with `statusCode`, `headers`, and `body` fields compatible with AWS Lambda proxy integrations.
- **CORS Enabled by Default**: Includes `'Access-Control-Allow-Origin': '*'` headers to prevent Cross-Origin Resource Sharing issues.
- **JSON Formatting**: Automatically serializes the response body using `JSON.stringify()`.

## Installation

Simply copy the function into your project utility directory or include it in your lambda handler file.

## Usage

### Importing the Function

```javascript
const { response } = require('./path-to-file');

# Code Explainer

## Example: AWS Lambda Handler
```JavaScript
const { response } = require('./responseHelper');

exports.handler = async (event) => {
    try {
        const data = {
            message: "Success",
            items: [
                { id: 1, name: "Item One" },
                { id: 2, name: "Item Two" }
            ]
        };
        
        // Return a 200 OK response with the data
        return response(200, data);
        
    } catch (error) {
        // Return a 500 Internal Server Error response
        return response(500, { error: error.message });
    }
};
```
## Function Signature
```JavaScript
function response(statusCode, body)
ParametersParameterTypeDescriptionstatusCodenumberThe HTTP status code to return (e.g., 200, 400, 404, 500).bodyanyThe response data/object that will be serialized into a JSON string.Return ValueReturns an object structured as follows:JavaScript{
    statusCode: number,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    body: string
}
```
## License MIT


