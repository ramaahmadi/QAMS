const http = require('http');
const { neon } = require('@neondatabase/serverless');

// Initialize Neon PostgreSQL connection
const sql = process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : null;

// Initial data structure
const initialData = {
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
      evidence: "File dokumen revisi",
      verification: "Menunggu validasi QA Officer",
      status: "In Progress"
    },
    {
      id: "CF-003",
      finding: "Kebijakan tindak lanjut belum terdokumentasi",
      action: "Menyusun SOP tindak lanjut dan form pemantauan",
      responsible: "Unit Mutu",
      targetDate: "2026-11-03",
      progress: 100,
      evidence: "SOP terlampir",
      verification: "Valid",
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
  ],
  systemSettings: {
    institutionName: "Universitas Teknologi Bandung",
    qualityAssuranceCycle: "2025/2026",
    reviewDeadline: "2026-10-20",
    sendDocumentAlert: true,
    autoReminder: true,
    auditEscalation: true
  }
};

// In-memory data (fallback if Neon not configured)
let qamsData = initialData;

// Initialize Neon database
async function initNeonDB() {
  if (!sql) {
    console.log('Neon DB not configured, using in-memory data');
    return;
  }

  try {
    // Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS qams_data (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Check if data exists
    const result = await sql`SELECT data FROM qams_data WHERE id = 1`;

    if (result.length === 0) {
      // Insert initial data
      await sql`
        INSERT INTO qams_data (id, data)
        VALUES (1, ${JSON.stringify(initialData)}::jsonb)
      `;
      qamsData = initialData;
      console.log('Neon DB initialized with initial data');
    } else {
      // Load existing data
      qamsData = result[0].data;
      console.log('Data loaded from Neon DB');
    }
  } catch (error) {
    console.warn('Neon DB initialization failed, using in-memory data:', error.message);
  }
}

// Save data to Neon
async function saveToNeon() {
  if (!sql) return;

  try {
    await sql`
      UPDATE qams_data
      SET data = ${JSON.stringify(qamsData)}::jsonb, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `;
    console.log('Data saved to Neon DB');
  } catch (error) {
    console.warn('Failed to save to Neon DB:', error.message);
  }
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(payload));
}

function buildDashboardSummary() {
  const docs = qamsData.documents || [];
  const kpis = qamsData.kpis || [];
  const audits = qamsData.audits || [];
  const findings = qamsData.findings || [];
  const followUps = qamsData.followUps || [];

  const totalDocs = docs.length;
  const validatedDocs = docs.filter((doc) => doc.status === 'Validated').length;
  const pendingDocs = docs.filter((doc) => ['Draft', 'Submitted', 'Under Review'].includes(doc.status)).length;
  const openFindings = findings.filter((item) => ['Open', 'In Progress'].includes(item.status)).length;
  const completedFollowUp = followUps.filter((item) => item.status === 'Closed').length;
  const avgKpi = kpis.length
    ? (kpis.reduce((sum, item) => sum + Number(item.achievement || 0), 0) / kpis.length).toFixed(1)
    : '0.0';

  return {
    totals: {
      documents: totalDocs,
      validatedDocuments: validatedDocs,
      pendingDocuments: pendingDocs,
      kpis: kpis.length,
      audits: audits.length,
      findings: findings.length,
      followUps: followUps.length,
      openFindings,
      completedFollowUp,
      averageKpi: Number(avgKpi)
    },
    data: qamsData
  };
}

const routes = {
  '/api/login': () => ({ message: 'Use query parameters username and password.' }),
  '/api/health': () => ({
    status: 'ok',
    service: 'qams-api',
    timestamp: new Date().toISOString(),
    mode: process.env.DATABASE_URL ? 'production (Neon)' : 'demo (In-memory)'
  }),
  '/api/dashboard': () => buildDashboardSummary(),
  '/api/documents': () => qamsData.documents,
  '/api/led-lkps': () => qamsData.ledSubmissions,
  '/api/kpis': () => qamsData.kpis,
  '/api/audits': () => qamsData.audits,
  '/api/findings': () => qamsData.findings,
  '/api/follow-ups': () => qamsData.followUps,
  '/api/notifications': () => qamsData.notifications,
  '/api/users': () => qamsData.users,
  '/api/activities': () => qamsData.activities,
  '/api/archive': () => qamsData.archive,
  '/api/system-settings': () => qamsData.systemSettings,
  '/api/reports': () => ({
    documentSummary: {
      total: qamsData.documents.length,
      validated: qamsData.documents.filter((doc) => doc.status === 'Validated').length,
      review: qamsData.documents.filter((doc) => ['Under Review', 'Submitted'].includes(doc.status)).length
    },
    kpiSummary: {
      averageAchievement: Number(((qamsData.kpis.reduce((sum, kpi) => sum + Number(kpi.achievement || 0), 0) / qamsData.kpis.length) || 0).toFixed(1))
    },
    findings: qamsData.findings
  })
};

const resourceMap = {
  '/api/documents': 'documents',
  '/api/led-lkps': 'ledSubmissions',
  '/api/kpis': 'kpis',
  '/api/audits': 'audits',
  '/api/findings': 'findings',
  '/api/follow-ups': 'followUps',
  '/api/notifications': 'notifications',
  '/api/users': 'users',
  '/api/activities': 'activities',
  '/api/archive': 'archive',
  '/api/system-settings': 'systemSettings'
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';

    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });

    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error('Invalid JSON payload'));
      }
    });

    req.on('error', reject);
  });
}

const port = process.env.PORT || 3001;

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  const pathname = requestUrl.pathname.replace(/\/+$/, '') || '/';
  const routeHandler = routes[pathname];

  if (!routeHandler && !resourceMap[pathname]) {
    sendJson(res, 404, { message: 'Route not found', path: pathname });
    return;
  }

  if (pathname === '/api/login') {
    const username = requestUrl.searchParams.get('username') || '';
    const password = requestUrl.searchParams.get('password') || '';
    const user = qamsData.users.find((item) => {
      return (item.username === username || item.email === username) && item.password === password;
    });

    if (!user) {
      sendJson(res, 401, { message: 'Invalid username or password' });
      return;
    }

    const safeUser = { ...user };
    delete safeUser.password;
    sendJson(res, 200, { user: safeUser, token: 'demo-token' });
    return;
  }

  if (req.method === 'GET') {
    sendJson(res, 200, routeHandler ? routeHandler() : qamsData[resourceMap[pathname]]);
    return;
  }

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    const resourceKey = resourceMap[pathname];
    if (!resourceKey) {
      sendJson(res, 400, { message: 'Unsupported resource operation' });
      return;
    }

    if (req.method === 'DELETE') {
      const id = requestUrl.searchParams.get('id');
      if (!id) {
        sendJson(res, 400, { message: 'Delete request requires an id query parameter.' });
        return;
      }

      const target = qamsData[resourceKey];
      const nextItems = target.filter((item) => String(item.id ?? item.code ?? item.title) !== String(id));
      qamsData[resourceKey] = nextItems;
      await saveToNeon();
      sendJson(res, 200, { success: true, deletedId: id, resource: resourceKey, data: qamsData[resourceKey] });
      return;
    }

    try {
      const body = await readBody(req);
      if (!body || typeof body !== 'object') {
        sendJson(res, 400, { message: 'Request body must be a JSON object.' });
        return;
      }

      if (req.method === 'POST') {
        const collection = qamsData[resourceKey];
        if (!Array.isArray(collection)) {
          qamsData[resourceKey] = { ...body };
          await saveToNeon();
          sendJson(res, 201, { success: true, resource: resourceKey, item: qamsData[resourceKey] });
          return;
        }

        const item = { ...body };
        if (resourceKey === 'users' && !item.password) item.password = 'demo123';
        if (!item.id) {
          item.id = Date.now();
        }
        collection.push(item);
        await saveToNeon();
        sendJson(res, 201, { success: true, resource: resourceKey, item });
        return;
      }

      if (req.method === 'PUT') {
        const collection = qamsData[resourceKey];

        if (!Array.isArray(collection)) {
          qamsData[resourceKey] = { ...collection, ...body };
          await saveToNeon();
          sendJson(res, 200, { success: true, resource: resourceKey, item: qamsData[resourceKey] });
          return;
        }

        const id = requestUrl.searchParams.get('id') || body.id;
        if (!id) {
          sendJson(res, 400, { message: 'Update request requires an id.' });
          return;
        }

        const index = collection.findIndex((item) => String(item.id ?? item.code ?? item.title) === String(id));

        if (index === -1) {
          sendJson(res, 404, { message: 'Resource not found', id });
          return;
        }

        collection[index] = { ...collection[index], ...body };
        await saveToNeon();
        sendJson(res, 200, { success: true, resource: resourceKey, item: collection[index] });
        return;
      }
    } catch (error) {
      sendJson(res, 400, { message: error.message || 'Invalid request body.' });
      return;
    }
  }

  sendJson(res, 200, routeHandler ? routeHandler() : qamsData[resourceMap[pathname]]);
});

// Initialize and start server
initNeonDB().then(() => {
  server.listen(port, () => {
    console.log(`QAMS backend API running on http://localhost:${port}`);
    console.log(`Mode: ${process.env.DATABASE_URL ? 'Production (Neon DB)' : 'Demo (In-memory)'}`);
  });
}).catch((error) => {
  console.error('Failed to initialize server:', error);
  process.exit(1);
});

module.exports = { app: server };
