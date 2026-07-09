<img width="3456" height="2234" alt="image" src="https://github.com/user-attachments/assets/6e48ede1-83f0-4147-addf-7304a52f1fc9" />

<img width="1074" height="549" alt="project_validate track_aws_success" src="https://github.com/user-attachments/assets/89d2ae5f-c256-48be-92cd-4548075d7abe" />

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

## Vercel deployment (detailed)

Follow these exact steps to deploy the `frontend` to Vercel and wire it to GitHub Actions.

1) Create a Vercel token

```bash
# using the Vercel CLI (recommended)
npm i -g vercel
vercel login
vercel tokens create my-token
# copy the printed token value for the next step
```

Or create a token in the Vercel dashboard: Account Settings → Tokens → Create Token.

2) (Optional) Get Org (Team) and Project IDs

- In Vercel: Project → Settings → General → Identify to find the **Project ID**.
- In Vercel: Account or Team → Settings → General → Identify to find the **Team/Org ID**.

You can also fetch these via the API:

```bash
curl -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v1/projects/<project-name>
curl -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v1/teams
```

3) Add GitHub repository secrets

- Go to your GitHub repo → Settings → Secrets and variables → Actions → New repository secret.
- Add:
   - `VERCEL_TOKEN` — the token from step 1
   - `VERCEL_ORG_ID` — (optional) Team/Org ID
   - `VERCEL_PROJECT_ID` — (optional) Project ID

4) Configure the Vercel project build settings (monorepo / `frontend` subfolder)

- In Vercel Project → Settings → Build & Development Settings:
   - Root Directory: `frontend`
   - Install Command: `npm ci`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5) Add environment variables in Vercel (production)

- In Vercel Project → Settings → Environment Variables add `VITE_API_URL` and set it to your backend API URL (the URL produced by `sam deploy` or your chosen backend host). Mark it for `Production` and `Preview` as desired.

6) Trigger a deployment

- Push to `main` (Vercel auto-deploys) or run the GitHub Action `Deploy Frontend to Vercel` (Actions → Deploy Frontend to Vercel → Run workflow). The workflow uses the `frontend` folder and the `VERCEL_TOKEN` secret.

7) Confirm the live site

- After the deploy completes, open the Vercel project page to get the production URL (e.g., `https://your-project.vercel.app`).

Notes and security
- Do NOT commit tokens or IDs into your repository. Use GitHub Secrets as shown above. I updated `.github/workflows/deploy-vercel.yml` to read `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` from secrets.
- If you prefer me to add a short section with CLI/API commands to find IDs automatically, tell me and I will add it.

