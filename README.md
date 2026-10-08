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
