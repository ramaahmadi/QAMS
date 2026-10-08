const qamsData = {
  users: [
    {
      id: 1,
      name: "Rama Ahmadi",
      email: "rama.admin@universitas.ac.id",
      username: "admin",
      password: "admin123",
      role: "Administrator",
      faculty: "Pusat Administrasi",
      studyProgram: "Direktorat Mutu",
      status: "Active"
    },
    {
      id: 2,
      name: "Nina Pratiwi",
      email: "nina.qa@universitas.ac.id",
      username: "qao",
      password: "qao123",
      role: "QA Officer",
      faculty: "Fakultas Teknik",
      studyProgram: "Teknik Informatika",
      status: "Active"
    },
    {
      id: 3,
      name: "Sari Maulida",
      email: "sari.staff@universitas.ac.id",
      username: "faculty",
      password: "faculty123",
      role: "Faculty Staff",
      faculty: "Fakultas Ekonomi",
      studyProgram: "Manajemen",
      status: "Active"
    }
  ],
  documents: [
    {
      id: "DOC-2026-001",
      title: "LED Program Studi Teknik Informatika",
      category: "LED",
      faculty: "Fakultas Teknik",
      studyProgram: "Teknik Informatika",
      academicYear: "2025/2026",
      owner: "Sari Maulida",
      version: "V3",
      status: "Validated",
      reviewer: "Nina Pratiwi",
      updated: "2026-10-05"
    },
    {
      id: "DOC-2026-014",
      title: "LKPS Program Studi Sistem Informasi",
      category: "LKPS",
      faculty: "Fakultas Komputer",
      studyProgram: "Sistem Informasi",
      academicYear: "2025/2026",
      owner: "Rudi Hartono",
      version: "V2",
      status: "Under Review",
      reviewer: "Nina Pratiwi",
      updated: "2026-10-04"
    },
    {
      id: "DOC-2026-078",
      title: "Rencana Tindak Lanjut Audit Fakultas Ekonomi",
      category: "Audit",
      faculty: "Fakultas Ekonomi",
      studyProgram: "Akuntansi",
      academicYear: "2025/2026",
      owner: "Dewi Lestari",
      version: "V2",
      status: "Submitted",
      reviewer: "Nina Pratiwi",
      updated: "2026-10-08"
    }
  ],
  ledSubmissions: [
    {
      id: "LED-2026-01",
      studyProgram: "Teknik Informatika",
      academicYear: "2025/2026",
      documentType: "LED",
      reviewer: "Nina Pratiwi",
      status: "Validated",
      deadline: "2026-10-15",
      progress: 100
    },
    {
      id: "LED-2026-04",
      studyProgram: "Akuntansi",
      academicYear: "2025/2026",
      documentType: "LKPS",
      reviewer: "Dewi Lestari",
      status: "Submitted",
      deadline: "2026-10-25",
      progress: 64
    }
  ],
  kpis: [
    {
      code: "KPI-01",
      name: "Persentase lulusan yang mendapat pekerjaan dalam 6 bulan",
      category: "Student",
      target: 85,
      actual: 88,
      achievement: 103.53,
      responsibleUnit: "Biro Karir",
      status: "Excellent"
    },
    {
      code: "KPI-02",
      name: "Rasio dosen berkualifikasi S3",
      category: "HR",
      target: 70,
      actual: 62,
      achievement: 88.57,
      responsibleUnit: "Fakultas Teknik",
      status: "Achieved"
    },
    {
      code: "KPI-05",
      name: "Ketersediaan ruang kelas dan laboratorium",
      category: "Facilities",
      target: 95,
      actual: 69,
      achievement: 72.63,
      responsibleUnit: "Unit Sarpras",
      status: "Partially Achieved"
    }
  ],
  audits: [
    {
      id: "AUD-2026-01",
      title: "Audit Mutu Internal Fakultas Teknik",
      faculty: "Fakultas Teknik",
      studyProgram: "Teknik Informatika",
      auditor: "Nina Pratiwi",
      auditDate: "2026-10-12",
      status: "Scheduled"
    },
    {
      id: "AUD-2026-02",
      title: "Audit Dokumen LKPS Prodi Sistem Informasi",
      faculty: "Fakultas Komputer",
      studyProgram: "Sistem Informasi",
      auditor: "Rama Ahmadi",
      auditDate: "2026-10-20",
      status: "In Progress"
    }
  ],
  findings: [
    {
      id: "FND-001",
      auditId: "AUD-2026-01",
      category: "Documentation",
      description: "Dokumen bukti kegiatan tidak lengkap pada beberapa indikator.",
      severity: "Major",
      responsibleUnit: "Prodi Teknik Informatika",
      deadline: "2026-10-18",
      status: "Open"
    },
    {
      id: "FND-002",
      auditId: "AUD-2026-02",
      category: "Process",
      description: "Beberapa data tracer study belum terverifikasi dan belum tercatat secara konsisten.",
      severity: "Minor",
      responsibleUnit: "Kepala Program Studi",
      deadline: "2026-10-25",
      status: "In Progress"
    }
  ],
  followUps: [
    {
      id: "CF-001",
      finding: "Dokumen bukti kegiatan tidak lengkap",
      action: "Melengkapi file bukti dan revisi daftar indikator",
      responsible: "Prodi Teknik Informatika",
      targetDate: "2026-10-18",
      progress: 75,
      status: "In Progress"
    },
    {
      id: "CF-003",
      finding: "Kebijakan tindak lanjut belum terdokumentasi",
      action: "Menyusun SOP tindak lanjut dan form pemantauan",
      responsible: "Unit Mutu",
      targetDate: "2026-11-03",
      progress: 100,
      status: "Closed"
    }
  ],
  notifications: [
    {
      id: 1,
      title: "Dokumen baru dikirim",
      description: "LED Program Studi Teknik Informatika telah disubmit untuk ditinjau.",
      date: "2026-10-08 08:15",
      module: "Document Management",
      status: "Unread"
    },
    {
      id: 2,
      title: "Revisi LKPS diperlukan",
      description: "Reviewer meminta revisi pada bagian bukti evaluasi program studi.",
      date: "2026-10-07 15:10",
      module: "LED/LKPS",
      status: "Read"
    }
  ],
  systemSettings: {
    institutionName: "Universitas Teknologi Bandung",
    qualityAssuranceCycle: "2025/2026",
    reviewDeadline: "2026-10-20",
    sendDocumentAlert: true,
    autoReminder: true,
    auditEscalation: true
  },
  activities: [
    {
      user: "Sari Maulida",
      activity: "Uploaded LED document",
      module: "Document Management",
      dateTime: "2026-10-08 08:15",
      status: "Submitted"
    },
    {
      user: "Nina Pratiwi",
      activity: "Validated LKPS document",
      module: "LED/LKPS",
      dateTime: "2026-10-07 17:42",
      status: "Validated"
    }
  ],
  archive: [
    {
      type: "Document",
      title: "Audit Internal 2024",
      faculty: "Fakultas Teknik",
      status: "Validated",
      year: "2024/2025"
    },
    {
      type: "KPI",
      title: "Tracer Study Lulusan 2024",
      faculty: "Fakultas Ekonomi",
      status: "Achieved",
      year: "2024/2025"
    }
  ]
};

module.exports = { qamsData };
