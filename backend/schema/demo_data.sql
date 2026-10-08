USE qams_db;

INSERT INTO roles (name, description) VALUES
('Administrator', 'Manage system configuration and all quality assurance data'),
('QA Officer', 'Manage document review, audits, and monitoring activities'),
('Faculty Staff', 'Upload required documents and support quality assurance data');

INSERT INTO permissions (name, module, action) VALUES
('dashboard.view', 'dashboard', 'view'),
('dashboard.export', 'dashboard', 'export'),
('documents.read', 'documents', 'read'),
('documents.create', 'documents', 'create'),
('documents.update', 'documents', 'update'),
('documents.delete', 'documents', 'delete'),
('documents.review', 'documents', 'review'),
('led.read', 'led_lkps', 'read'),
('led.create', 'led_lkps', 'create'),
('led.update', 'led_lkps', 'update'),
('led.validate', 'led_lkps', 'validate'),
('kpis.read', 'kpis', 'read'),
('kpis.create', 'kpis', 'create'),
('kpis.update', 'kpis', 'update'),
('audits.read', 'audits', 'read'),
('audits.create', 'audits', 'create'),
('audits.update', 'audits', 'update'),
('findings.read', 'findings', 'read'),
('findings.create', 'findings', 'create'),
('followups.read', 'followups', 'read'),
('followups.create', 'followups', 'create'),
('notifications.read', 'notifications', 'read'),
('reports.read', 'reports', 'read'),
('users.manage', 'users', 'manage'),
('settings.manage', 'settings', 'manage');

INSERT INTO faculties (name, code, dean_name) VALUES
('Fakultas Teknik', 'FT', 'Prof. Dr. H. Andi Wijaya'),
('Fakultas Ekonomi', 'FE', 'Dr. Rina Dewi'),
('Fakultas Ilmu Sosial dan Humaniora', 'FISH', 'Dr. Siti Khadijah');

INSERT INTO study_programs (faculty_id, name, code, accreditation_status) VALUES
(1, 'Teknik Informatika', 'TI', 'A'),
(1, 'Sistem Informasi', 'SI', 'A'),
(1, 'Teknik Industri', 'TI-IND', 'A'),
(2, 'Manajemen', 'MNJ', 'A'),
(2, 'Akuntansi', 'AKT', 'A'),
(3, 'Sastra Inggris', 'SAS-ING', 'A');

INSERT INTO users (name, email, username, password_hash, role_id, faculty_id, study_program_id, status, last_login) VALUES
('Rama Ahmadi', 'rama.admin@universitas.ac.id', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/9kd1qQ7o8GqgG', 1, NULL, NULL, 'Active', '2026-10-08 08:20:00'),
('Nina Pratiwi', 'nina.qa@universitas.ac.id', 'qao', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/9kd1qQ7o8GqgG', 2, 1, 1, 'Active', '2026-10-08 09:05:00'),
('Sari Maulida', 'sari.staff@universitas.ac.id', 'faculty', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/9kd1qQ7o8GqgG', 3, 2, 4, 'Active', '2026-10-08 07:48:00'),
('Rudi Hartono', 'rudi.staff@universitas.ac.id', 'rudi', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/9kd1qQ7o8GqgG', 3, 1, 2, 'Active', '2026-10-07 16:30:00'),
('Budi Santoso', 'budi.staff@universitas.ac.id', 'budi', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/9kd1qQ7o8GqgG', 3, 1, 3, 'Active', '2026-10-06 12:10:00'),
('Rani Kurnia', 'rani.staff@universitas.ac.id', 'rani', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/9kd1qQ7o8GqgG', 3, 1, 1, 'Active', '2026-10-05 09:40:00');

INSERT INTO documents (document_code, title, category, faculty_id, study_program_id, academic_year, owner_user_id, version, upload_date, last_updated, status, reviewer_user_id, validation_date, file_path, metadata) VALUES
('DOC-2026-001', 'LED Program Studi Teknik Informatika', 'LED', 1, 1, '2025/2026', 6, 'V3', '2026-10-02 00:00:00', '2026-10-05 00:00:00', 'Validated', 2, '2026-10-06 00:00:00', '/documents/led-ti-v3.pdf', JSON_OBJECT('owner', 'Rani Kurnia', 'faculty', 'Fakultas Teknik')),
('DOC-2026-014', 'LKPS Program Studi Sistem Informasi', 'LKPS', 1, 2, '2025/2026', 4, 'V2', '2026-09-18 00:00:00', '2026-10-04 00:00:00', 'Under Review', 2, NULL, '/documents/lkps-si-v2.pdf', JSON_OBJECT('owner', 'Rudi Hartono', 'faculty', 'Fakultas Teknik')),
('DOC-2026-021', 'Dokumen SPMI Fakultas Teknik', 'SPMI', 1, NULL, '2025/2026', 2, 'V1', '2026-09-27 00:00:00', '2026-10-07 00:00:00', 'Submitted', 2, NULL, '/documents/spmi-ft-v1.pdf', JSON_OBJECT('owner', 'Nina Pratiwi', 'faculty', 'Fakultas Teknik')),
('DOC-2026-032', 'Audit Internal Standar Mutu Prodi', 'Audit', 1, 3, '2025/2026', 5, 'V2', '2026-09-24 00:00:00', '2026-10-01 00:00:00', 'Rejected', 2, '2026-10-02 00:00:00', '/documents/audit-ti-v2.pdf', JSON_OBJECT('owner', 'Budi Santoso', 'faculty', 'Fakultas Teknik')),
('DOC-2026-055', 'Bukti Kinerja Kegiatan Tridharma', 'Evidence', 2, 4, '2025/2026', 3, 'V1', '2026-10-06 00:00:00', '2026-10-06 00:00:00', 'Draft', NULL, NULL, '/documents/tridharma-fe-v1.pdf', JSON_OBJECT('owner', 'Sari Maulida', 'faculty', 'Fakultas Ekonomi'));

INSERT INTO document_versions (document_id, version, file_path, change_note, uploaded_by, uploaded_at) VALUES
(1, 'V1', '/documents/led-ti-v1.pdf', 'Awal pembuatan dokumen LED', 6, '2026-09-01 00:00:00'),
(1, 'V2', '/documents/led-ti-v2.pdf', 'Revisi berdasarkan masukan QA', 6, '2026-09-15 00:00:00'),
(1, 'V3', '/documents/led-ti-v3.pdf', 'Perbaikan format dan bukti pendukung', 6, '2026-10-02 00:00:00'),
(2, 'V1', '/documents/lkps-si-v1.pdf', 'Upload awal LKPS', 4, '2026-08-23 00:00:00'),
(2, 'V2', '/documents/lkps-si-v2.pdf', 'Revisi untuk kelengkapan data', 4, '2026-09-18 00:00:00'),
(3, 'V1', '/documents/spmi-ft-v1.pdf', 'Dokumen SPMI fakultas baru', 2, '2026-09-27 00:00:00');

INSERT INTO document_reviews (document_id, reviewer_user_id, review_status, comment, review_date) VALUES
(1, 2, 'Validated', 'Dokumen lengkap dan sesuai kebutuhan akreditasi.', '2026-10-06 00:00:00'),
(2, 2, 'Under Review', 'Masih ada beberapa bukti kegiatan yang perlu dilengkapi.', '2026-10-04 00:00:00'),
(3, 2, 'Submitted', 'Dokumen sedang menunggu review QA.', '2026-10-07 00:00:00'),
(4, 2, 'Rejected', 'Beberapa format dokumen belum sesuai template SPMI.', '2026-10-02 00:00:00');

INSERT INTO led_lkps (submission_code, study_program_id, academic_year, document_type, submission_date, reviewer_user_id, status, deadline, progress, file_path) VALUES
('LED-2026-01', 1, '2025/2026', 'LED', '2026-09-24 00:00:00', 2, 'Validated', '2026-10-15 00:00:00', 100, '/led/led-ti-2026.pdf'),
('LED-2026-02', 2, '2025/2026', 'LKPS', '2026-10-02 00:00:00', 2, 'Revision', '2026-10-18 00:00:00', 72, '/led/lkps-si-2026.pdf'),
('LED-2026-03', 3, '2025/2026', 'LED', '2026-10-05 00:00:00', 1, 'Review', '2026-10-22 00:00:00', 52, '/led/led-ti-ind-2026.pdf');

INSERT INTO led_lkps_evidence (led_lkps_id, title, file_path, description, uploaded_by, uploaded_at) VALUES
(1, 'Bukti RKAT Prodi Teknik Informatika', '/evidence/rkat-ti.pdf', 'Rencana kegiatan akademik dan pengembangan program.', 6, '2026-09-24 00:00:00'),
(1, 'Rekap Tridharma', '/evidence/tridharma-ti.pdf', 'Data kegiatan pengajaran, penelitian, dan pengabdian.', 6, '2026-09-28 00:00:00'),
(2, 'Data Mahasiswa Baru', '/evidence/mahasiswa-si.xlsx', 'Data mahasiswa yang masuk tahun ajaran terkait.', 4, '2026-10-02 00:00:00');

INSERT INTO kpis (code, name, description, category, unit, target, actual, achievement_percent, responsible_unit, measurement_period, evidence_path, status) VALUES
('KPI-01', 'Persentase lulusan yang mendapat pekerjaan dalam 6 bulan', 'Mengukur ketercapaian lulusan dalam penyerapan kerja.', 'Student', '%', 85, 88, 103.53, 'Biro Karir', '2025/2026', '/evidence/tracer-study.pdf', 'Excellent'),
('KPI-02', 'Rasio dosen berkualifikasi S3', 'Ketersediaan SDM dosen dengan kualifikasi pendidikan S3.', 'HR', '%', 70, 62, 88.57, 'Fakultas Teknik', '2025/2026', '/evidence/dosen-s3.xlsx', 'Achieved'),
('KPI-03', 'Persentase mata kuliah menggunakan e-learning', 'Kepatuhan perkuliahan berbasis digital.', 'Academic', '%', 90, 78, 86.67, 'Pusat Pembelajaran', '2025/2026', '/evidence/lms-report.pdf', 'Achieved'),
('KPI-04', 'Kepuasan mahasiswa terhadap layanan akademik', 'Tingkat kepuasan mahasiswa terhadap layanan akademik.', 'Student', '%', 80, 74, 92.50, 'BPM', '2025/2026', '/evidence/survey-mahasiswa.pdf', 'Achieved'),
('KPI-05', 'Ketersediaan ruang kelas dan laboratorium', 'Ketersediaan fasilitas pendukung proses pembelajaran.', 'Infrastructure', '%', 85, 67, 78.82, 'Bagian Sarana', '2025/2026', '/evidence/sarana-laboratorium.xlsx', 'Partially Achieved');

INSERT INTO kpi_measurements (kpi_id, measurement_period, actual_value, target_value, achievement_percent, evidence_path, recorded_by, recorded_at) VALUES
(1, '2025/2026', 88, 85, 103.53, '/evidence/tracer-study.pdf', 1, '2026-09-30 00:00:00'),
(2, '2025/2026', 62, 70, 88.57, '/evidence/dosen-s3.xlsx', 2, '2026-09-29 00:00:00'),
(3, '2025/2026', 78, 90, 86.67, '/evidence/lms-report.pdf', 2, '2026-09-27 00:00:00'),
(4, '2025/2026', 74, 80, 92.50, '/evidence/survey-mahasiswa.pdf', 3, '2026-09-26 00:00:00');

INSERT INTO audits (audit_code, title, faculty_id, study_program_id, auditor_user_id, audit_date, audit_scope, audit_criteria, status) VALUES
('AUD-2026-01', 'Audit Mutu Internal Fakultas Teknik', 1, 1, 2, '2026-10-12 00:00:00', 'Sistem penjaminan mutu internal dan dokumentasi kurikulum', 'Standar 4.0 dan 5.0 SPMI', 'Scheduled'),
('AUD-2026-02', 'Audit Dokumen LKPS Prodi Sistem Informasi', 1, 2, 2, '2026-10-20 00:00:00', 'Kelengkapan data dan bukti pendukung LKPS', 'LKPS 2025', 'In Progress'),
('AUD-2026-03', 'Audit Kinerja Unit Fakultas Ekonomi', 2, 4, 1, '2026-10-25 00:00:00', 'Kinerja unit, dokumen, dan indikator mutu fakultas', 'Panduan audit internal', 'Completed');

INSERT INTO audit_members (audit_id, user_id, role) VALUES
(1, 2, 'Lead Auditor'),
(1, 4, 'Member'),
(1, 6, 'Member'),
(2, 2, 'Lead Auditor'),
(2, 3, 'Member'),
(2, 4, 'Member'),
(3, 1, 'Lead Auditor'),
(3, 3, 'Member');

INSERT INTO audit_findings (audit_id, finding_code, category, description, evidence_path, severity, responsible_unit, recommendation, deadline, status) VALUES
(1, 'FND-001', 'Documentation', 'Dokumen bukti kegiatan tidak lengkap pada beberapa indikator.', '/evidence/finding-doc-1.pdf', 'Major', 'Prodi Teknik Informatika', 'Melengkapi bukti dan menyusun daftar indikator terdokumentasi.', '2026-10-18 00:00:00', 'Open'),
(1, 'FND-002', 'Process', 'Beberapa data tracer study belum terverifikasi secara konsisten.', '/evidence/finding-doc-2.pdf', 'Minor', 'Kepala Program Studi', 'Menyusun validasi data dan jadwal review berkala.', '2026-10-25 00:00:00', 'In Progress'),
(2, 'FND-003', 'Evidence', 'Dokumen pendukung LKPS belum sesuai format terbaru.', '/evidence/finding-lkps.pdf', 'Major', 'Unit Administrasi Prodi', 'Melakukan penyesuaian template dan menambahkan bukti pendukung.', '2026-10-22 00:00:00', 'Open'),
(3, 'FND-004', 'Monitoring', 'Kinerja indikator fakultas masih ada target yang belum tercapai.', '/evidence/finding-fe.pdf', 'Minor', 'Fakultas Ekonomi', 'Menyusun strategi perbaikan dan evaluasi kuartalan.', '2026-10-30 00:00:00', 'Verified');

INSERT INTO corrective_actions (finding_id, corrective_action, responsible_person, target_completion_date, progress, evidence_path, verification_note, status) VALUES
(1, 'Melengkapi dokumen bukti untuk indikator yang belum lengkap.', 'Rani Kurnia', '2026-10-18 00:00:00', 60, '/evidence/action-fnd-001.pdf', 'Dokumen sudah diperiksa sebagian.', 'In Progress'),
(2, 'Menyusun jadwal validasi data tracer study dan update template monitoring.', 'Nina Pratiwi', '2026-10-25 00:00:00', 45, '/evidence/action-fnd-002.pdf', 'Validasi data masih berlangsung.', 'In Progress'),
(3, 'Memperbarui template LKPS dan menambahkan bukti pendukung yang kurang.', 'Rudi Hartono', '2026-10-22 00:00:00', 80, '/evidence/action-fnd-003.pdf', 'Telah dilakukan revisi format.', 'Closed'),
(4, 'Menyusun strategi peningkatan capaian indikator dan monitoring kuartalan.', 'Sari Maulida', '2026-10-30 00:00:00', 100, '/evidence/action-fnd-004.pdf', 'Tindak lanjut telah diverifikasi oleh QA Officer.', 'Closed');

INSERT INTO notifications (user_id, title, description, module_name, event_type, is_read, created_at) VALUES
(3, 'Dokumen baru dikirim', 'LED Program Studi Teknik Informatika telah disubmit untuk ditinjau.', 'Document Management', 'document_submitted', 0, '2026-10-08 08:15:00'),
(2, 'Jadwal audit ditetapkan', 'Audit Fakultas Teknik dijadwalkan pada 12 Oktober 2026.', 'Internal Audit', 'audit_scheduled', 0, '2026-10-06 11:30:00'),
(1, 'Laporan KPI semesteran siap', 'Laporan KPI periode 2025/2026 siap untuk ditinjau.', 'KPI / Quality Indicators', 'kpi_report_ready', 1, '2026-10-05 14:00:00'),
(4, 'Perbaikan LKPS dibutuhkan', 'LKPS Program Studi Sistem Informasi memerlukan revisi dokumen.', 'LED/LKPS Management', 'revision_required', 0, '2026-10-04 10:20:00'),
(6, 'Temuan audit baru', 'Temuan baru telah dibuat untuk audit dokumentasi.', 'Audit Findings', 'finding_created', 0, '2026-10-03 09:15:00');

INSERT INTO activity_logs (user_id, activity, module_name, object_name, action, ip_address, created_at) VALUES
(3, 'Uploaded LED document', 'Document Management', 'LED Program Studi Teknik Informatika', 'create', '192.168.1.15', '2026-10-08 08:15:00'),
(2, 'Validated LKPS document', 'LED/LKPS', 'LKPS Program Studi Sistem Informasi', 'update', '192.168.1.22', '2026-10-07 17:42:00'),
(1, 'Reviewed KPI performance', 'KPI / Quality Indicators', 'KPI Dashboard', 'read', '192.168.1.10', '2026-10-06 15:45:00'),
(4, 'Submitted document revision', 'LED/LKPS Management', 'LKPS Program Studi Sistem Informasi', 'update', '192.168.1.33', '2026-10-05 11:08:00'),
(5, 'Added audit checklist', 'Internal Audit', 'Audit Internal Standar Mutu Prodi', 'create', '192.168.1.18', '2026-10-02 08:30:00');

INSERT INTO system_settings (key_name, value_text) VALUES
('institution_name', 'Universitas Teknologi Bandung'),
('quality_cycle', '2025/2026'),
('review_deadline', '2026-10-20'),
('document_alert_enabled', '1'),
('deadline_reminder_enabled', '1');
