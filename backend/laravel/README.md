# Laravel Backend Architecture Draft

This folder describes the recommended Laravel backend structure for the QAMS platform.

## Recommended Modules

- Authentication and authorization
- User management
- Faculty and study program management
- Documents and document versions
- LED/LKPS submission and evidence management
- KPI management and measurement tracking
- Audit scheduling and findings
- Corrective actions and follow-ups
- Notifications and activity logs
- Reporting and archive services

## Suggested Laravel Folder Structure

```text
app/
  Http/
    Controllers/
      AuthController.php
      DashboardController.php
      DocumentController.php
      LedLkpsController.php
      KpiController.php
      AuditController.php
      FindingController.php
      FollowUpController.php
      NotificationController.php
      ReportController.php
      UserController.php
  Models/
    User.php
    Role.php
    Permission.php
    Faculty.php
    StudyProgram.php
    Document.php
    DocumentVersion.php
    DocumentReview.php
    LedLkps.php
    LedLkpsEvidence.php
    Kpi.php
    KpiMeasurement.php
    Audit.php
    AuditFinding.php
    CorrectiveAction.php
    Notification.php
    ActivityLog.php
config/
  qams.php
routes/
  api.php
  web.php
database/
  migrations/
  seeders/
    RoleSeeder.php
    FacultySeeder.php
    StudyProgramSeeder.php
    DemoUserSeeder.php
    QamsDemoSeeder.php
```

## Core Design Principles

- Use Laravel Sanctum or JWT for authentication.
- Use Role-based access control for Administrator, QA Officer, and Faculty Staff.
- Implement policy classes for each module.
- Support file versioning and soft deletion.
- Add event listeners for notifications and activity logs.
- Build service classes for KPI calculation, audit reporting, and document validation.

## API-ready Architecture

The application exposes JSON endpoints such as:

- /api/login
- /api/dashboard
- /api/documents
- /api/led-lkps
- /api/kpis
- /api/audits
- /api/findings
- /api/follow-ups
- /api/notifications
- /api/reports

A working mock implementation is available in backend/api/server.js and can be run with:

```bash
node backend/api/server.js
```

This serves the same QAMS data model used for the prototype and is ready to evolve into Laravel controllers and services.

## Extension Readiness

The schema and application architecture are deliberately future-ready for:

- predictive analytics
- accreditation readiness scoring
- external integration with PDDikti
- AI-powered monitoring modules
- mobile application APIs

## MySQL Notes

The database schema in backend/schema/qams_schema.sql is designed to match the Laravel model layer and can be migrated via proper Laravel migrations.
