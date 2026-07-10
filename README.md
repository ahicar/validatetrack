

# Live demo

Project demo on verceL.
https://validatetrack.vercel.app

# ValidateTrack
"An equipment qualification and deviation tracker built for FDA-regulated manufacturing environments."

## What does it do?
ValidateTrack is a small full-stack application for tracking equipment calibration status and deviations. It lets users record equipment, view its current status, and manage related quality issues in a simple workflow.

## Why this domain?
This domain matters because equipment qualification and deviation tracking are core parts of regulated environments such as pharmaceutical and medical device manufacturing. Good records help teams maintain compliance, reduce risk, and respond quickly when equipment issues arise.

I built this instead of a generic CRUD app because it's a close match to what CIQA's clients actually need — tracking calibration schedules and logging deviations is exactly the kind of record-keeping that supports FDA compliance work.

## What tech did you use, and why does each piece matter?
- React + Vite: provides the user interface and a fast local development experience.
- Node.js and AWS Lambda: power the backend logic in a serverless architecture that is lightweight and scalable.
- DynamoDB: stores equipment and deviation records in a durable NoSQL database.
- Jest: verifies backend logic through unit tests.
- Cypress: exercises the app end to end and checks the user workflow.
- Git: keeps the project versioned and easy to collaborate on.

## App architecture
ValidateTrack is built as a simple full-stack web app with a clean separation between frontend and backend.
- Frontend: React components compiled by Vite, running in the browser. It uses `frontend/src/api/client.js` to call the backend API and falls back to local storage when the backend is unavailable.
- Backend: AWS Lambda functions defined in `backend/template.yaml`, exposed through API Gateway. The backend handles REST-style endpoints for equipment and deviations.
- Data flow: the frontend sends JSON requests to the API, the backend validates and stores data in DynamoDB, and the response is returned as JSON for the UI to render.
- Local fallback: the current implementation can default to in-browser storage for equipment and deviation data when API requests fail, enabling a basic offline-like experience.

## Future v2 UI plans
For v2, the user interface will be improved with a dedicated CSS design and a refactor into separate React components. The goal is to move from a compact proof-of-concept UI into a cleaner, more modular component structure with reusable presentation and form components.

## How does someone run it?
1. Deploy the backend (requires an AWS account — see BUILD_GUIDE.md for full setup):
```bash
   cd backend && npm install
   sam build && sam deploy --guided
```
2. Set the frontend environment variable to the API URL printed by the deploy:
```bash
   echo "VITE_API_URL=https://your-api-url" > frontend/.env
```
3. Install frontend dependencies and start it:
```bash
   cd frontend && npm install
   npm run dev
```

## Testing
- Backend unit tests:
  ```bash
  cd backend && npm test
  ```
- Frontend end-to-end tests:
  ```bash
  cd frontend && npx cypress run --spec cypress/e2e/equipment.cy.js
  ```


## Quick deploy (summary)

- Build and deploy backend (AWS SAM):
```bash
cd backend && npm install
sam build && sam deploy --guided
```
- Set frontend API env and run locally:
```bash
echo "VITE_API_URL=https://your-api-url" > frontend/.env
cd frontend && npm install
npm run dev
```

<img width="1074" height="549" alt="project_ValidateTrack_aws_success" src="https://github.com/user-attachments/assets/89d2ae5f-c256-48be-92cd-4548075d7abe" />

app V1 preview:
project_validate track_vite_localhost_success
<img width="1551" height="792" alt="project_validate track_vite_localhost_success" src="https://github.com/user-attachments/assets/553687e6-edbf-48f4-9a18-5c0813adf1d0" />

