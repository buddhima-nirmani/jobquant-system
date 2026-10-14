# JobQuant

JobQuant is a web-based job management system for small-scale print and advertising businesses. It brings job tracking, design approvals, payments, invoices, and client communication into one role-based workspace, with machine-learning cost estimates for print jobs.

## Features

- **Admin workspace:** manage jobs, clients, staff, payments, and operational dashboards.
- **Staff workspace:** create and update jobs, manage assigned work, submit designs, and follow payment status.
- **Client portal:** track orders, review designs, view invoices, and submit payment confirmations.
- **Design workflow:** upload design versions, exchange comments, request revisions, and approve artwork.
- **Job costing:** request a cost estimate from the included scikit-learn model, then record an approved job cost.
- **Payments and invoices:** upload payment slips, verify or reject payments, and attach invoices to jobs.
- **Notifications and reporting:** receive job updates and export supported views from the frontend.

## Technology

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** FastAPI, SQLAlchemy, Pydantic, SQLite
- **Machine learning:** scikit-learn model loaded with joblib

## Project Structure

```text
backend/                 FastAPI application and Python dependencies
  app/                   Routes, models, schemas, and services
  .env.example           Optional email and application settings
  requirements.txt
frontend/                Next.js application
  src/                   App Router pages, components, and API client
  public/                Logos and static assets
ml-model/
  models/                 Trained model used by the prediction endpoint
  notebooks/              Model development notebook
```

## Requirements

- Python 3.10 or newer
- Node.js 20.9 or newer and npm

## Run Locally

Run the backend and frontend in separate terminals from the repository root.

### 1. Start the backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

If PowerShell blocks virtual-environment activation, use `cmd.exe` and activate with `.venv\Scripts\activate.bat`, or run the virtual environment's Python directly.

The API creates the SQLite database (`backend/jobquant.db`) and upload directories when it starts. The database and uploaded files are local runtime data and are not included in Git.

### 2. Start the frontend

In a second terminal:

```powershell
cd frontend
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The frontend uses `http://localhost:8000` as its API URL by default. To use another backend address, set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` before starting the frontend, for example:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Use the application

- Frontend: [http://localhost:3000](http://localhost:3000)
- API health check: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- Interactive API documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

Public registration creates a client account. Staff and admin accounts are intended to be managed by an administrator; the repository does not include demo credentials.

## Configuration

The backend reads optional settings from `backend/.env`. Copy `backend/.env.example` to that location to configure them.

- `SECRET_KEY`: signing key for authentication tokens. The app generates and persists a local key if none is set. Set a strong, stable value explicitly in deployed environments.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `FROM_EMAIL`: SMTP settings for password-reset emails. Without these values, password reset uses the development response containing the reset link.
- `FRONTEND_URL`: base URL used when composing password-reset links; defaults in the example to `http://localhost:3000`.

Never commit real credentials or production secrets.

## Useful Commands

From `frontend/`:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

From `backend/`, after activating the virtual environment:

```bash
uvicorn app.main:app --reload
```

## Notes

- Cost predictions require `ml-model/models/jobquant_final_random_forest_model.pkl`, which is included in the repository.
- SQLite and uploaded files are local by default. Back up or replace these storage choices before deploying for shared or production use.
- Configure production CORS origins, secrets, email delivery, and persistent storage for your deployment environment.

## User Interfaces

### Landing Page

<img width="1910" height="4131" alt="Client Landing Page" src="https://github.com/user-attachments/assets/5545c48b-4d2d-49d3-8f81-4d1c963dbe9d" />

### Admin Dashboard

<img width="1910" height="2260" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/2687d6ea-0e6d-44d7-a86a-417fb4306b0c" />

### Job Creation Page

<img width="1910" height="3522" alt="Staff Job Creation Page (Before Creating a job)" src="https://github.com/user-attachments/assets/dbbb4ba0-45cf-49b3-9c3b-c46a0e4feac4" />

### Staff Job Details Page

<img width="1910" height="3462" alt="Staff Job Details Page" src="https://github.com/user-attachments/assets/0c37065a-5069-4296-af46-f7bc018afbe6" />

### Client Job Details Page

<img width="1910" height="3316" alt="Client Order Details Page" src="https://github.com/user-attachments/assets/b1dcbb8b-fa70-4aa1-8841-128fdda3c859" />
