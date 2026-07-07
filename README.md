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

## Live demo

- **Project pages (auto):** After the first successful CI run, the frontend will be published to GitHub Pages at:

   https://ahicar.github.io/validatetrack/

- **Notes:** The repository contains a GitHub Actions workflow that builds the frontend and publishes `frontend/dist` to GitHub Pages on pushes to `main`. The site becomes available after the workflow runs once and GitHub Pages finishes provisioning. If you prefer Vercel for previews and easy environment variable management, connect the repo to Vercel and set `VITE_API_URL` to your backend API URL.

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

