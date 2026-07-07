# ValidateTrack

A serverless full-stack app for tracking equipment qualification/calibration status and
deviations (non-conformances) — the exact kind of record-keeping CIQA Engineering's clients
(FDA-regulated pharma, biotech, and medical device companies) rely on for cGMP compliance.

Built to demonstrate the stack listed in CIQA's Junior Full Stack Developer & Testing Analyst
posting: JavaScript (ES6+), Node.js, React, AWS Lambda/S3/DynamoDB, Jest, Cypress, Git.

## Local deployment

From the backend folder:

```bash
sam build
sam deploy --guided
```

Once deployed, include the API key when calling the API locally:

```bash
curl -H "x-api-key: local-dev-api-key-1234567890" https://<api-id>.execute-api.<region>.amazonaws.com/dev/equipment

Replace <api-id> and <region> with the values from your deployed stack output.
```

