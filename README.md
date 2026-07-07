# ValidateTrack

## What does it do?
ValidateTrack is a small full-stack application for tracking equipment calibration status and deviations. It lets users record equipment, view its current status, and manage related quality issues in a simple workflow.

## Why this domain?
This domain matters because equipment qualification and deviation tracking are core parts of regulated environments such as pharmaceutical and medical device manufacturing. Good records help teams maintain compliance, reduce risk, and respond quickly when equipment issues arise.

## What tech did you use, and why does each piece matter?
- React + Vite: provides the user interface and a fast local development experience.
- Node.js and AWS Lambda: power the backend logic in a serverless architecture that is lightweight and scalable.
- DynamoDB: stores equipment and deviation records in a durable NoSQL database.
- Jest: verifies backend logic through unit tests.
- Cypress: exercises the app end to end and checks the user workflow.
- Git: keeps the project versioned and easy to collaborate on.

## How does someone run it?
1. Install dependencies for the frontend and backend:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
2. Start the frontend:
   ```bash
   cd ../frontend
   npm run dev
   ```
3. In a second terminal, start the backend locally or deploy it with SAM if you want the full API flow.
4. If you are using the deployed API, set the frontend environment variable:
   ```bash
   echo "VITE_API_URL=https://your-api-url" > frontend/.env
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

