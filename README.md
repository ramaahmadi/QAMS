# Quality Assurance Monitoring System (QAMS)

A responsive web prototype for the research-based Quality Assurance Monitoring System for Indonesian higher education institutions.

## Project Overview

This prototype demonstrates the core functions of the Internal Quality Assurance System (SPMI/IQA) and PPEPP cycle adapted for higher education institutions. It includes assessment modules for:

- Document management
- LED/LKPS management
- KPI and quality indicators
- Internal audit
- Audit findings
- Corrective actions and follow-up
- Notifications
- Reports
- Search and archive
- User management
- Activity audit logs

## Demo Credentials

- Admin: admin / admin123
- QA Officer: qao / qao123
- Faculty Staff: faculty / faculty123

## Run locally

Quick start:

```bash
chmod +x start-dev.sh
./start-dev.sh
```

This starts both the frontend and the backend API automatically.

Manual run:

```bash
python3 -m http.server 8000
```

Then open:

http://localhost:8000

Run the backend API mock:

```bash
node backend/api/server.js
```

Then the API is available at:

- http://localhost:3001/api/dashboard
- http://localhost:3001/api/documents
- http://localhost:3001/api/kpis
- http://localhost:3001/api/audits
- http://localhost:3001/api/findings
- http://localhost:3001/api/follow-ups
- http://localhost:3001/api/notifications
- http://localhost:3001/api/reports

## Tech Stack for Prototype

- HTML5
- Bootstrap 5
- JavaScript
- Chart.js
- Static demo data (JSON / localStorage)

This prototype is designed as an API-ready frontend foundation for a possible Laravel + MySQL architecture.

## Database & Backend Architecture

See:

- backend/schema/qams_schema.sql
- backend/laravel/README.md

## Research Alignment

The interface is aligned with the research contribution of a centralized monitoring system that supports document management, KPI oversight, internal audits, notifications, reporting, and searchable QA record retention.

## Deployment

### Vercel Deployment with Neon Database

This project is configured for deployment on Vercel with Neon (serverless PostgreSQL) as the database.

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Set up Neon Database**:
   - Create an account at https://neon.tech
   - Create a new project/database
   - Copy the connection string (DATABASE_URL)
   - The connection string looks like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```

4. **Configure Environment Variables in Vercel**:
   - Go to your project settings in Vercel dashboard
   - Add environment variable: `DATABASE_URL`
   - Paste your Neon connection string
   - Redeploy to apply changes

### Environment Variables

- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `PORT`: Server port (default: 3001, automatically set by Vercel)

### Local Development with Neon

For local development with Neon:

1. Copy `.env.example` to `.env`
2. Add your Neon DATABASE_URL to `.env`
3. Run: `npm install` (to install dependencies)
4. Run: `node server.js`
