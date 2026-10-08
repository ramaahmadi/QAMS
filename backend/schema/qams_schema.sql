CREATE DATABASE IF NOT EXISTS qams_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qams_db;

CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE faculties (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    dean_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE study_programs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    faculty_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    accreditation_status VARCHAR(30) DEFAULT 'A',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_study_programs_faculty FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE
);

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    username VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    faculty_id BIGINT UNSIGNED NULL,
    study_program_id BIGINT UNSIGNED NULL,
    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT fk_users_faculty FOREIGN KEY (faculty_id) REFERENCES faculties(id),
    CONSTRAINT fk_users_study_program FOREIGN KEY (study_program_id) REFERENCES study_programs(id)
);

CREATE TABLE documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    document_code VARCHAR(80) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    faculty_id BIGINT UNSIGNED NULL,
    study_program_id BIGINT UNSIGNED NULL,
    academic_year VARCHAR(20) NOT NULL,
    owner_user_id BIGINT UNSIGNED NOT NULL,
    version VARCHAR(20) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('Draft', 'Submitted', 'Under Review', 'Validated', 'Rejected', 'Archived') NOT NULL,
    reviewer_user_id BIGINT UNSIGNED NULL,
    validation_date TIMESTAMP NULL,
    file_path VARCHAR(255),
    metadata JSON,
    CONSTRAINT fk_documents_faculty FOREIGN KEY (faculty_id) REFERENCES faculties(id),
    CONSTRAINT fk_documents_study_program FOREIGN KEY (study_program_id) REFERENCES study_programs(id),
    CONSTRAINT fk_documents_owner FOREIGN KEY (owner_user_id) REFERENCES users(id),
    CONSTRAINT fk_documents_reviewer FOREIGN KEY (reviewer_user_id) REFERENCES users(id)
);

CREATE TABLE document_versions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    document_id BIGINT UNSIGNED NOT NULL,
    version VARCHAR(20) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    change_note TEXT,
    uploaded_by BIGINT UNSIGNED NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_document_versions_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    CONSTRAINT fk_document_versions_user FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE TABLE document_reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    document_id BIGINT UNSIGNED NOT NULL,
    reviewer_user_id BIGINT UNSIGNED NOT NULL,
    review_status ENUM('Draft', 'Submitted', 'Under Review', 'Validated', 'Rejected', 'Archived') NOT NULL,
    comment TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_document_reviews_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    CONSTRAINT fk_document_reviews_user FOREIGN KEY (reviewer_user_id) REFERENCES users(id)
);

CREATE TABLE led_lkps (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    submission_code VARCHAR(80) NOT NULL UNIQUE,
    study_program_id BIGINT UNSIGNED NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    document_type ENUM('LED', 'LKPS') NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewer_user_id BIGINT UNSIGNED NULL,
    status ENUM('Draft', 'Submitted', 'Review', 'Revision', 'Resubmitted', 'Validated') NOT NULL,
    deadline TIMESTAMP NULL,
    progress INT DEFAULT 0,
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_led_lkps_study_program FOREIGN KEY (study_program_id) REFERENCES study_programs(id),
    CONSTRAINT fk_led_lkps_reviewer FOREIGN KEY (reviewer_user_id) REFERENCES users(id)
);

CREATE TABLE led_lkps_evidence (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    led_lkps_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(200) NOT NULL,
    file_path VARCHAR(255),
    description TEXT,
    uploaded_by BIGINT UNSIGNED NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_led_evidence_submission FOREIGN KEY (led_lkps_id) REFERENCES led_lkps(id) ON DELETE CASCADE,
    CONSTRAINT fk_led_evidence_user FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE TABLE kpis (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    target DECIMAL(10,2) NOT NULL,
    actual DECIMAL(10,2) DEFAULT 0,
    achievement_percent DECIMAL(10,2) DEFAULT 0,
    responsible_unit VARCHAR(150) NOT NULL,
    measurement_period VARCHAR(30) NOT NULL,
    evidence_path VARCHAR(255),
    status ENUM('Excellent', 'Achieved', 'Partially Achieved', 'Not Achieved') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE kpi_measurements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    kpi_id BIGINT UNSIGNED NOT NULL,
    measurement_period VARCHAR(30) NOT NULL,
    actual_value DECIMAL(10,2) NOT NULL,
    target_value DECIMAL(10,2) NOT NULL,
    achievement_percent DECIMAL(10,2) NOT NULL,
    evidence_path VARCHAR(255),
    recorded_by BIGINT UNSIGNED NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_kpi_measurements_kpi FOREIGN KEY (kpi_id) REFERENCES kpis(id) ON DELETE CASCADE,
    CONSTRAINT fk_kpi_measurements_user FOREIGN KEY (recorded_by) REFERENCES users(id)
);

CREATE TABLE audits (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    audit_code VARCHAR(80) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    faculty_id BIGINT UNSIGNED NULL,
    study_program_id BIGINT UNSIGNED NULL,
    auditor_user_id BIGINT UNSIGNED NOT NULL,
    audit_date TIMESTAMP NOT NULL,
    audit_scope TEXT,
    audit_criteria TEXT,
    status ENUM('Planned', 'Scheduled', 'In Progress', 'Completed', 'Follow-Up') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_audits_faculty FOREIGN KEY (faculty_id) REFERENCES faculties(id),
    CONSTRAINT fk_audits_study_program FOREIGN KEY (study_program_id) REFERENCES study_programs(id),
    CONSTRAINT fk_audits_user FOREIGN KEY (auditor_user_id) REFERENCES users(id)
);

CREATE TABLE audit_members (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    audit_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    role VARCHAR(50) NOT NULL,
    CONSTRAINT fk_audit_members_audit FOREIGN KEY (audit_id) REFERENCES audits(id) ON DELETE CASCADE,
    CONSTRAINT fk_audit_members_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE audit_findings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    audit_id BIGINT UNSIGNED NOT NULL,
    finding_code VARCHAR(80) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    evidence_path VARCHAR(255),
    severity ENUM('Observation', 'Minor', 'Major') NOT NULL,
    responsible_unit VARCHAR(150) NOT NULL,
    recommendation TEXT,
    deadline TIMESTAMP NULL,
    status ENUM('Open', 'In Progress', 'Resolved', 'Verified', 'Closed') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_findings_audit FOREIGN KEY (audit_id) REFERENCES audits(id) ON DELETE CASCADE
);

CREATE TABLE corrective_actions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    finding_id BIGINT UNSIGNED NOT NULL,
    corrective_action TEXT NOT NULL,
    responsible_person VARCHAR(150) NOT NULL,
    target_completion_date TIMESTAMP NOT NULL,
    progress INT DEFAULT 0,
    evidence_path VARCHAR(255),
    verification_note TEXT,
    status ENUM('Open', 'In Progress', 'Closed') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_corrective_actions_finding FOREIGN KEY (finding_id) REFERENCES audit_findings(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    module_name VARCHAR(100) NOT NULL,
    event_type VARCHAR(80) NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    activity VARCHAR(200) NOT NULL,
    module_name VARCHAR(100) NOT NULL,
    object_name VARCHAR(150),
    action VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activity_logs_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE system_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(100) NOT NULL UNIQUE,
    value_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO roles (name, description) VALUES
('Administrator', 'Manage system configuration and all quality assurance data'),
('QA Officer', 'Manage document review, audits, and monitoring activities'),
('Faculty Staff', 'Upload required documents and support quality assurance data');

INSERT INTO permissions (name, module, action) VALUES
('manage_documents', 'documents', 'create'),
('review_documents', 'documents', 'review'),
('manage_kpis', 'kpis', 'manage'),
('manage_audits', 'audits', 'manage'),
('manage_users', 'users', 'manage'),
('view_reports', 'reports', 'read');

INSERT INTO faculties (name, code, dean_name) VALUES
('Fakultas Teknik', 'FT', 'Prof. Dr. H. Adi Saptari'),
('Fakultas Ekonomi', 'FE', 'Dr. Sarwono Suryanto'),
('Fakultas Ilmu Komputer', 'FIK', 'Dr. Aulia Rahmadani');

INSERT INTO study_programs (faculty_id, name, code, accreditation_status) VALUES
(1, 'Teknik Informatika', 'TI', 'A'),
(1, 'Teknik Industri', 'TI-IND', 'A'),
(2, 'Manajemen', 'MNJ', 'A'),
(3, 'Sistem Informasi', 'SI', 'A');

INSERT INTO system_settings (key_name, value_text) VALUES
('institution_name', 'Universitas Teknologi Bandung'),
('qa_cycle', '2025/2026'),
('review_deadline', '2026-10-20');
