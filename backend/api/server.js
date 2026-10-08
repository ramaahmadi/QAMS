const http = require('http');
const { qamsData } = require('./qamsData');

const port = 3001;

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
    mode: 'demo'
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
          sendJson(res, 201, { success: true, resource: resourceKey, item: qamsData[resourceKey] });
          return;
        }

        const item = { ...body };
        if (resourceKey === 'users' && !item.password) item.password = 'demo123';
        if (!item.id) {
          item.id = Date.now();
        }
        collection.push(item);
        sendJson(res, 201, { success: true, resource: resourceKey, item });
        return;
      }

      if (req.method === 'PUT') {
        const collection = qamsData[resourceKey];

        if (!Array.isArray(collection)) {
          qamsData[resourceKey] = { ...collection, ...body };
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

server.listen(port, () => {
  console.log(`QAMS backend API running on http://localhost:${port}`);
});
