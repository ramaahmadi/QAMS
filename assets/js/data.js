const defaultQamsData = {
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
      status: "Active",
      lastLogin: "2026-10-08 08:20"
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
      status: "Active",
      lastLogin: "2026-10-08 09:05"
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
      status: "Active",
      lastLogin: "2026-10-08 07:48"
    },
    {
      id: 4,
      name: "Rudi Hartono",
      email: "rudi.staff@universitas.ac.id",
      username: "rudi",
      password: "rudi123",
      role: "Faculty Staff",
      faculty: "Fakultas Komputer",
      studyProgram: "Sistem Informasi",
      status: "Active",
      lastLogin: "2026-10-07 14:20"
    },
    {
      id: 5,
      name: "Dewi Lestari",
      email: "dewi.qa@universitas.ac.id",
      username: "dewi",
      password: "dewi123",
      role: "QA Officer",
      faculty: "Fakultas Ekonomi",
      studyProgram: "Akuntansi",
      status: "Active",
      lastLogin: "2026-10-06 12:05"
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
      uploadDate: "2026-10-02",
      lastUpdated: "2026-10-05",
      status: "Validated",
      reviewer: "Nina Pratiwi",
      validationDate: "2026-10-06",
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
      uploadDate: "2026-09-18",
      lastUpdated: "2026-10-04",
      status: "Under Review",
      reviewer: "Nina Pratiwi",
      validationDate: "-",
      updated: "2026-10-04"
    },
    {
      id: "DOC-2026-021",
      title: "Dokumen SPMI Fakultas Teknik",
      category: "SPMI",
      faculty: "Fakultas Teknik",
      studyProgram: "Fakultas",
      academicYear: "2025/2026",
      owner: "Rani Kurnia",
      version: "V1",
      uploadDate: "2026-09-27",
      lastUpdated: "2026-10-07",
      status: "Submitted",
      reviewer: "Nina Pratiwi",
      validationDate: "-",
      updated: "2026-10-07"
    },
    {
      id: "DOC-2026-032",
      title: "Audit Internal Standar Mutu Prodi",
      category: "Audit",
      faculty: "Fakultas Teknik",
      studyProgram: "Teknik Industri",
      academicYear: "2025/2026",
      owner: "Budi Santoso",
      version: "V2",
      uploadDate: "2026-09-24",
      lastUpdated: "2026-10-01",
      status: "Rejected",
      reviewer: "Nina Pratiwi",
      validationDate: "2026-10-02",
      updated: "2026-10-01"
    },
    {
      id: "DOC-2026-055",
      title: "Bukti Kinerja Kegiatan Tridharma",
      category: "Evidence",
      faculty: "Fakultas Ekonomi",
      studyProgram: "Manajemen",
      academicYear: "2025/2026",
      owner: "Sari Maulida",
      version: "V1",
      uploadDate: "2026-10-06",
      lastUpdated: "2026-10-06",
      status: "Draft",
      reviewer: "-",
      validationDate: "-",
      updated: "2026-10-06"
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
      uploadDate: "2026-10-03",
      lastUpdated: "2026-10-08",
      status: "Submitted",
      reviewer: "Nina Pratiwi",
      validationDate: "-",
      updated: "2026-10-08"
    },
    {
      id: "DOC-2026-091",
      title: "Daftar Ketersediaan Sarana Laboratorium",
      category: "Evidence",
      faculty: "Fakultas Teknik",
      studyProgram: "Teknik Elektro",
      academicYear: "2025/2026",
      owner: "Agus Prasetyo",
      version: "V1",
      uploadDate: "2026-09-29",
      lastUpdated: "2026-10-06",
      status: "Validated",
      reviewer: "Rama Ahmadi",
      validationDate: "2026-10-07",
      updated: "2026-10-06"
    },
    {
      id: "DOC-2026-104",
      title: "Bukti Evaluasi Kebijakan Akademik",
      category: "SPMI",
      faculty: "Fakultas Hukum",
      studyProgram: "Ilmu Hukum",
      academicYear: "2025/2026",
      owner: "Yulia Sari",
      version: "V1",
      uploadDate: "2026-10-01",
      lastUpdated: "2026-10-07",
      status: "Draft",
      reviewer: "-",
      validationDate: "-",
      updated: "2026-10-07"
    }
  ],
  ledSubmissions: [
    {
      id: "LED-2026-01",
      studyProgram: "Teknik Informatika",
      academicYear: "2025/2026",
      documentType: "LED",
      submissionDate: "2026-09-24",
      reviewer: "Nina Pratiwi",
      status: "Validated",
      deadline: "2026-10-15",
      progress: 100,
      type: "LED"
    },
    {
      id: "LED-2026-02",
      studyProgram: "Sistem Informasi",
      academicYear: "2025/2026",
      documentType: "LKPS",
      submissionDate: "2026-10-02",
      reviewer: "Nina Pratiwi",
      status: "Revision",
      deadline: "2026-10-18",
      progress: 72,
      type: "LKPS"
    },
    {
      id: "LED-2026-03",
      studyProgram: "Teknik Industri",
      academicYear: "2025/2026",
      documentType: "LED",
      submissionDate: "2026-10-05",
      reviewer: "Rama Ahmadi",
      status: "Under Review",
      deadline: "2026-10-22",
      progress: 52,
      type: "LED"
    },
    {
      id: "LED-2026-04",
      studyProgram: "Akuntansi",
      academicYear: "2025/2026",
      documentType: "LKPS",
      submissionDate: "2026-10-01",
      reviewer: "Dewi Lestari",
      status: "Submitted",
      deadline: "2026-10-25",
      progress: 64,
      type: "LKPS"
    },
    {
      id: "LED-2026-05",
      studyProgram: "Ilmu Hukum",
      academicYear: "2025/2026",
      documentType: "LED",
      submissionDate: "2026-09-28",
      reviewer: "Nina Pratiwi",
      status: "Validated",
      deadline: "2026-10-19",
      progress: 96,
      type: "LED"
    }
  ],
  kpis: [
    {
      code: "KPI-01",
      name: "Persentase lulusan yang mendapat pekerjaan dalam 6 bulan",
      description: "Mengukur ketercapaian lulusan dalam penyerapan kerja.",
      category: "Student",
      unit: "%",
      target: 85,
      actual: 88,
      achievement: 103.53,
      responsibleUnit: "Biro Karir",
      period: "2025/2026",
      evidence: "Laporan Tracer Study",
      status: "Excellent"
    },
    {
      code: "KPI-02",
      name: "Rasio dosen berkualifikasi S3",
      description: "Ketersediaan SDM dosen dengan kualifikasi pendidikan S3.",
      category: "HR",
      unit: "%",
      target: 70,
      actual: 62,
      achievement: 88.57,
      responsibleUnit: "Fakultas Teknik",
      period: "2025/2026",
      evidence: "Data SDM Prodi",
      status: "Achieved"
    },
    {
      code: "KPI-03",
      name: "Persentase mata kuliah menggunakan e-learning",
      description: "Kepatuhan perkuliahan berbasis digital.",
      category: "Academic",
      unit: "%",
      target: 90,
      actual: 78,
      achievement: 86.67,
      responsibleUnit: "Pusat Pembelajaran",
      period: "2025/2026",
      evidence: "LMS report",
      status: "Achieved"
    },
    {
      code: "KPI-04",
      name: "Kepuasan mahasiswa terhadap layanan akademik",
      description: "Tingkat kepuasan mahasiswa terhadap layanan akademik.",
      category: "Student",
      unit: "%",
      target: 80,
      actual: 74,
      achievement: 92.5,
      responsibleUnit: "BPM",
      period: "2025/2026",
      evidence: "Survey mahasiswa",
      status: "Achieved"
    },
    {
      code: "KPI-05",
      name: "Ketersediaan ruang kelas dan laboratorium",
      description: "Ketersediaan fasilitas pendukung proses pembelajaran.",
      category: "Facilities",
      unit: "%",
      target: 95,
      actual: 69,
      achievement: 72.63,
      responsibleUnit: "Unit Sarpras",
      period: "2025/2026",
      evidence: "Inventaris fasilitas",
      status: "Partially Achieved"
    },
    {
      code: "KPI-06",
      name: "Persentase penyerapan dana penelitian dosen",
      description: "Penggunaan anggaran penelitian dosen sesuai rencana kerja.",
      category: "Academic",
      unit: "%",
      target: 88,
      actual: 74,
      achievement: 84.09,
      responsibleUnit: "LPPM",
      period: "2025/2026",
      evidence: "Laporan realisasi anggaran",
      status: "Achieved"
    },
    {
      code: "KPI-07",
      name: "Rasio dosen pembimbing tugas akhir yang sesuai kualifikasi",
      description: "Kesesuaian kualifikasi dosen pembimbing dengan kebutuhan program studi.",
      category: "HR",
      unit: "%",
      target: 100,
      actual: 88,
      achievement: 88,
      responsibleUnit: "Prodi Teknik Informatika",
      period: "2025/2026",
      evidence: "Data pembimbing TA",
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
      scope: "Sistem penjaminan mutu internal dan dokumentasi kurikulum",
      criteria: "Standar 4.0 dan 5.0 SPMI",
      status: "Scheduled"
    },
    {
      id: "AUD-2026-02",
      title: "Audit Dokumen LKPS Prodi Sistem Informasi",
      faculty: "Fakultas Komputer",
      studyProgram: "Sistem Informasi",
      auditor: "Rama Ahmadi",
      auditDate: "2026-10-20",
      scope: "Kelengkapan data dan bukti pendukung LKPS",
      criteria: "LKPS 2025",
      status: "In Progress"
    },
    {
      id: "AUD-2026-03",
      title: "Evaluasi Tindak Lanjut Temuan Audit",
      faculty: "Fakultas Ekonomi",
      studyProgram: "Manajemen",
      auditor: "Nina Pratiwi",
      auditDate: "2026-10-28",
      scope: "Pemenuhan rekomendasi audit",
      criteria: "Follow-up action review",
      status: "Follow-Up"
    },
    {
      id: "AUD-2026-04",
      title: "Audit Manual Mutu Prodi Akuntansi",
      faculty: "Fakultas Ekonomi",
      studyProgram: "Akuntansi",
      auditor: "Dewi Lestari",
      auditDate: "2026-11-03",
      scope: "Kelengkapan indikator dan bukti hasil pembelajaran",
      criteria: "Standar lulusan, kurikulum, dan evaluasi",
      status: "Scheduled"
    },
    {
      id: "AUD-2026-05",
      title: "Verifikasi Penerapan SPMI Fakultas Hukum",
      faculty: "Fakultas Hukum",
      studyProgram: "Ilmu Hukum",
      auditor: "Rama Ahmadi",
      auditDate: "2026-11-10",
      scope: "Proses perencanaan, pelaksanaan, dan evaluasi mutu",
      criteria: "Standar 6.0 dan 7.0",
      status: "Planned"
    }
  ],
  findings: [
    {
      id: "FND-001",
      auditId: "AUD-2026-01",
      category: "Documentation",
      description: "Dokumen bukti kegiatan tidak lengkap pada beberapa indikator.",
      evidence: "Laporan audit dan sample dokumen",
      severity: "Major",
      responsibleUnit: "Prodi Teknik Informatika",
      recommendation: "Melengkapi bukti dan menyusun daftar indikator terdokumentasi.",
      deadline: "2026-10-18",
      status: "Open"
    },
    {
      id: "FND-002",
      auditId: "AUD-2026-02",
      category: "Process",
      description: "Beberapa data tracer study belum terverifikasi dan belum tercatat secara konsisten.",
      evidence: "Data tracer study dan hasil wawancara",
      severity: "Minor",
      responsibleUnit: "Kepala Program Studi",
      recommendation: "Menyusun validasi data dan jadwal review berkala.",
      deadline: "2026-10-25",
      status: "In Progress"
    },
    {
      id: "FND-003",
      auditId: "AUD-2026-03",
      category: "Governance",
      description: "Kebijakan tindak lanjut belum terdokumentasi dalam satu sistem integrasi.",
      evidence: "Catatan rapat dan dokumen kebijakan",
      severity: "Observation",
      responsibleUnit: "Unit Mutu",
      recommendation: "Integrasikan catatan tindak lanjut dalam sistem QA.",
      deadline: "2026-11-02",
      status: "Resolved"
    },
    {
      id: "FND-004",
      auditId: "AUD-2026-04",
      category: "Academic",
      description: "Rerata capaian pembelajaran belum dibuktikan dalam dokumen evaluasi per mata kuliah.",
      evidence: "Dokumen hasil evaluasi kuliah",
      severity: "Major",
      responsibleUnit: "Ketua Prodi Akuntansi",
      recommendation: "Merekap hasil evaluasi per semester dan lampirkan dokumen pendukung.",
      deadline: "2026-11-05",
      status: "Open"
    },
    {
      id: "FND-005",
      auditId: "AUD-2026-05",
      category: "Facilities",
      description: "Penggunaan ruang laboratorium belum dipantau secara berkala dan terdokumentasi.",
      evidence: "Jadwal pemakaian dan catatan observasi",
      severity: "Minor",
      responsibleUnit: "Unit Sarpras",
      recommendation: "Menyusun jadwal pemakaian yang terdata dan dijadwalkan review rutin.",
      deadline: "2026-11-12",
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
      evidence: "File dokumen revisi",
      verification: "Menunggu validasi QA Officer",
      status: "In Progress"
    },
    {
      id: "CF-002",
      finding: "Validasi tracer study belum lengkap",
      action: "Merekap data tracer study dan validasi sumber data",
      responsible: "Biro Karir",
      targetDate: "2026-10-26",
      progress: 45,
      evidence: "Spreadsheet data terbarui",
      verification: "Dalam proses review",
      status: "Open"
    },
    {
      id: "CF-003",
      finding: "Kebijakan tindak lanjut belum terdokumentasi",
      action: "Menyusun SOP tindak lanjut dan form pemantauan",
      responsible: "Unit Mutu",
      targetDate: "2026-11-03",
      progress: 100,
      evidence: "SOP dan form tindak lanjut",
      verification: "Sudah diverifikasi",
      status: "Closed"
    },
    {
      id: "CF-004",
      finding: "Rerata capaian pembelajaran belum terdokumentasi",
      action: "Menyusun matriks evaluasi per mata kuliah dan validasi data",
      responsible: "Prodi Akuntansi",
      targetDate: "2026-11-05",
      progress: 60,
      evidence: "Matriks evaluasi dan sertifikat validasi",
      verification: "Menunggu review kabinet mutu",
      status: "In Progress"
    },
    {
      id: "CF-005",
      finding: "Pemantauan ruang laboratorium belum rutin",
      action: "Menyusun jadwal pemakaian lab dan checklist monitoring",
      responsible: "Unit Sarpras",
      targetDate: "2026-11-12",
      progress: 80,
      evidence: "Checklist monitoring dan jadwal lab",
      verification: "Tertutup sementara",
      status: "Open"
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
    },
    {
      id: 3,
      title: "Jadwal audit ditetapkan",
      description: "Audit Fakultas Teknik dijadwalkan pada 12 Oktober 2026.",
      date: "2026-10-06 11:30",
      module: "Internal Audit",
      status: "Unread"
    },
    {
      id: 4,
      title: "Tenggat follow-up mendekati batas",
      description: "Follow-up dokumen bukti kegiatan akan jatuh tempo dalam 3 hari.",
      date: "2026-10-05 09:45",
      module: "Audit Follow-Up",
      status: "Unread"
    },
    {
      id: 5,
      title: "Dokumen LKPS Akuntansi telah disetujui",
      description: "Review LKPS Program Studi Akuntansi berhasil disetujui tingkat fakultas.",
      date: "2026-10-04 10:20",
      module: "LED/LKPS",
      status: "Read"
    },
    {
      id: 6,
      title: "Reminder pengajuan bukti evaluasi",
      description: "Prodi Ilmu Hukum diminta mengunggah bukti evaluasi sebelum 12 Oktober.",
      date: "2026-10-03 16:00",
      module: "Document Management",
      status: "Unread"
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
    },
    {
      user: "Rama Ahmadi",
      activity: "Reviewed audit follow-up",
      module: "Audit Follow-Up",
      dateTime: "2026-10-07 13:18",
      status: "Reviewed"
    },
    {
      user: "Rudi Hartono",
      activity: "Submitted corrective action evidence",
      module: "Audit Follow-Up",
      dateTime: "2026-10-06 10:05",
      status: "Submitted"
    },
    {
      user: "Dewi Lestari",
      activity: "Scheduled quality audit for Akuntansi",
      module: "Internal Audit",
      dateTime: "2026-10-05 09:25",
      status: "Scheduled"
    },
    {
      user: "Agus Prasetyo",
      activity: "Uploaded laboratory evidence file",
      module: "Document Management",
      dateTime: "2026-10-04 15:35",
      status: "Submitted"
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
    },
    {
      type: "Audit",
      title: "Evaluasi Pelaksanaan SPMI 2024",
      faculty: "Fakultas Komputer",
      status: "Completed",
      year: "2024/2025"
    },
    {
      type: "Document",
      title: "Manual Mutu 2023",
      faculty: "Fakultas Hukum",
      status: "Validated",
      year: "2023/2024"
    },
    {
      type: "Finding",
      title: "Temuan Dokumen 2023",
      faculty: "Fakultas Teknik",
      status: "Resolved",
      year: "2023/2024"
    }
  ]
};

function normalizeQamsData(data) {
  const safeDefault = JSON.parse(JSON.stringify(defaultQamsData));
  const source = data && typeof data === "object" ? data : {};

  Object.keys(safeDefault).forEach((key) => {
    if (Array.isArray(source[key])) {
      safeDefault[key] = source[key].length ? source[key] : safeDefault[key];
    } else if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      safeDefault[key] = { ...safeDefault[key], ...source[key] };
    }
  });

  return safeDefault;
}

function loadQamsData() {
  try {
    const stored = localStorage.getItem("qamsPrototypeData");
    if (!stored) {
      window.qamsData = JSON.parse(JSON.stringify(defaultQamsData));
      return window.qamsData;
    }

    const parsed = JSON.parse(stored);
    const merged = normalizeQamsData(parsed);
    window.qamsData = merged;
    return merged;
  } catch (error) {
    window.qamsData = JSON.parse(JSON.stringify(defaultQamsData));
    return window.qamsData;
  }
}

function saveQamsData() {
  try {
    localStorage.setItem("qamsPrototypeData", JSON.stringify(window.qamsData));
  } catch (error) {
    console.warn("QAMS data could not be persisted to localStorage:", error);
  }
}

function resetQamsData() {
  window.qamsData = JSON.parse(JSON.stringify(defaultQamsData));
  saveQamsData();
  return window.qamsData;
}

window.qamsData = loadQamsData();
