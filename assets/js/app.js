const app = {
  currentUser: null,
  selectedSection: "dashboardSection",
  charts: {},
  apiStatus: "checking"
};

const API_BASE = "http://localhost:3001";

async function fetchQamsJson(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload;
}

async function syncQamsDataFromApi() {
  if (!window.qamsData) {
    loadQamsData();
  }

  try {
    const [documents, ledSubmissions, kpis, audits, findings, followUps, notifications, users, activities, archive, systemSettings] = await Promise.all([
      fetchQamsJson("/api/documents"),
      fetchQamsJson("/api/led-lkps"),
      fetchQamsJson("/api/kpis"),
      fetchQamsJson("/api/audits"),
      fetchQamsJson("/api/findings"),
      fetchQamsJson("/api/follow-ups"),
      fetchQamsJson("/api/notifications"),
      fetchQamsJson("/api/users"),
      fetchQamsJson("/api/activities"),
      fetchQamsJson("/api/archive"),
      fetchQamsJson("/api/system-settings")
    ]);

    const mergedData = {
      ...window.qamsData,
      documents: Array.isArray(documents) ? documents : (window.qamsData.documents || []),
      ledSubmissions: Array.isArray(ledSubmissions) ? ledSubmissions : (window.qamsData.ledSubmissions || []),
      kpis: Array.isArray(kpis) ? kpis : (window.qamsData.kpis || []),
      audits: Array.isArray(audits) ? audits : (window.qamsData.audits || []),
      findings: Array.isArray(findings) ? findings : (window.qamsData.findings || []),
      followUps: Array.isArray(followUps) ? followUps : (window.qamsData.followUps || []),
      notifications: Array.isArray(notifications) ? notifications : (window.qamsData.notifications || []),
      users: Array.isArray(users) ? users : (window.qamsData.users || []),
      activities: Array.isArray(activities) ? activities : (window.qamsData.activities || []),
      archive: Array.isArray(archive) ? archive : (window.qamsData.archive || []),
      systemSettings: systemSettings || window.qamsData.systemSettings || {}
    };

    window.qamsData = mergedData;
    app.apiStatus = "online";
    saveQamsData();
    return mergedData;
  } catch (error) {
    console.warn("QAMS backend unavailable, falling back to local data.", error);
    app.apiStatus = "offline";
    return window.qamsData;
  }
}

async function updateApiStatusIndicator() {
  const badge = document.getElementById("apiStatusBadge");
  if (!badge) return;

  try {
    const response = await fetchQamsJson("/api/health");
    const isOnline = response && response.status === "ok";
    app.apiStatus = isOnline ? "online" : "offline";
  } catch (error) {
    app.apiStatus = "offline";
  }

  badge.classList.toggle("api-status-badge--online", app.apiStatus === "online");
  badge.classList.toggle("api-status-badge--offline", app.apiStatus !== "online");
  badge.innerHTML = `<span class="dot"></span><span>${app.apiStatus === "online" ? "API Online" : "Local Mode"}</span>`;
}

async function persistCollectionToApi(resource, method, record, id = null) {
  const url = new URL(`${API_BASE}/api/${resource}`);
  if (id) {
    url.searchParams.set("id", String(id));
  }

  const options = {
    method,
    headers: { "Content-Type": "application/json" }
  };

  if (record && method !== "DELETE") {
    options.body = JSON.stringify(record);
  }

  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || `Failed to ${method} ${resource}`);
  }

  return payload;
}

function showSystemPopup(message, title = "Informasi", type = "info", duration = 3600) {
  const host = document.getElementById("systemPopupHost");
  if (!host) return;

  const iconMap = {
    info: "bi-info-circle-fill",
    success: "bi-check-circle-fill",
    warning: "bi-exclamation-triangle-fill",
    danger: "bi-x-circle-fill",
    confirm: "bi-question-circle-fill"
  };

  const popup = document.createElement("div");
  popup.className = `system-popup system-popup--${type}`;
  popup.innerHTML = `
    <div class="system-popup__icon">
      <i class="bi ${iconMap[type] || iconMap.info}"></i>
    </div>
    <div class="system-popup__content">
      <div class="system-popup__title">${title}</div>
      <div class="system-popup__message">${message}</div>
    </div>
    <button class="system-popup__close" type="button" aria-label="Close">
      <i class="bi bi-x-lg"></i>
    </button>
  `;

  const close = () => {
    popup.classList.add("is-hidden");
    setTimeout(() => popup.remove(), 220);
  };

  popup.querySelector(".system-popup__close").addEventListener("click", close);
  host.appendChild(popup);
  setTimeout(close, duration);
}

function showSystemConfirm(message, title = "Konfirmasi") {
  return new Promise((resolve) => {
    const host = document.getElementById("systemModalHost");
    if (!host) {
      resolve(false);
      return;
    }

    const overlay = document.createElement("div");
    overlay.className = "system-confirm-overlay";
    overlay.innerHTML = `
      <div class="system-confirm">
        <div class="system-confirm__icon"><i class="bi bi-question-circle-fill"></i></div>
        <div class="system-confirm__title">${title}</div>
        <div class="system-confirm__message">${message}</div>
        <div class="system-confirm__actions">
          <button type="button" class="btn btn-light system-confirm__cancel">Batal</button>
          <button type="button" class="btn btn-primary system-confirm__ok">OK</button>
        </div>
      </div>
    `;

    const close = (result) => {
      overlay.classList.add("is-hidden");
      setTimeout(() => overlay.remove(), 180);
      resolve(result);
    };

    overlay.querySelector(".system-confirm__cancel").addEventListener("click", () => close(false));
    overlay.querySelector(".system-confirm__ok").addEventListener("click", () => close(true));
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close(false);
    });

    host.appendChild(overlay);
  });
}

const navItems = [
  { key: "dashboardSection", label: "Dashboard", icon: "bi-grid-1x2-fill" },
  { key: "documentSection", label: "Document Management", icon: "bi-file-earmark-text" },
  { key: "ledSection", label: "LED/LKPS Management", icon: "bi-folder2-open" },
  { key: "kpiSection", label: "KPI / Quality Indicators", icon: "bi-graph-up-arrow" },
  { key: "auditSection", label: "Internal Audit", icon: "bi-file-check" },
  { key: "findingSection", label: "Audit Findings", icon: "bi-search-heart" },
  { key: "followUpSection", label: "Audit Follow-Up", icon: "bi-arrow-repeat" },
  { key: "notificationSection", label: "Notifications", icon: "bi-bell" },
  { key: "reportsSection", label: "Reports", icon: "bi-bar-chart" },
  { key: "searchSection", label: "Search & Archive", icon: "bi-archive" },
  { key: "userManagementSection", label: "User Management", icon: "bi-people" },
  { key: "settingsSection", label: "System Settings", icon: "bi-gear" },
  { key: "profileSection", label: "Profile", icon: "bi-person-circle" }
];

const roleMenuMap = {
  Administrator: navItems,
  "QA Officer": navItems.filter((item) => !["userManagementSection", "settingsSection"].includes(item.key)),
  "Faculty Staff": navItems.filter((item) => ["dashboardSection", "documentSection", "ledSection", "kpiSection", "notificationSection", "reportsSection", "searchSection", "profileSection"].includes(item.key))
};

async function init() {
  loadQamsData();
  await syncQamsDataFromApi();

  bindLoginForm();
  bindLogout();
  bindSectionLinks();
  bindRoleAwareAction();
  bindDocumentActions();
  bindDocumentModalActions();
  bindLedActions();
  bindKpiActions();
  bindAuditActions();
  bindFindingActions();
  bindFollowUpActions();
  bindNotificationActions();
  bindProfileActions();
  bindSettingsActions();
  bindCommonActionButtons();
  renderLoginPreview();

  const storedUser = localStorage.getItem("qamsUser");
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      const valid = qamsData.users.find((user) => user.username === parsed.username || user.email === parsed.email);
      if (valid) {
        app.currentUser = valid;
        renderApp();
      }
    } catch (error) {
      console.warn("Stored user could not be restored.", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", init);

function renderLoginPreview() {
  const rememberCheckbox = document.getElementById("rememberMe");
  const savedRemember = localStorage.getItem("qamsRememberMe") === "true";
  if (rememberCheckbox) {
    rememberCheckbox.checked = savedRemember;
  }

  const inputs = [document.getElementById("username"), document.getElementById("password")];
  inputs.forEach((input) => {
    if (input) {
      input.value = "";
    }
  });

  const togglePasswordBtn = document.getElementById("togglePassword");
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const passwordInput = document.getElementById("password");
      const icon = togglePasswordBtn.querySelector("i");
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      icon.className = isHidden ? "bi bi-eye" : "bi bi-eye-slash";
    });
  }
}

function bindLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const alertBox = document.getElementById("loginAlert");

    if (!username || !password) {
      alertBox.className = "alert alert-danger";
      alertBox.textContent = "Username and password are required.";
      alertBox.classList.remove("d-none");
      showSystemPopup("Username and password are required.", "Login", "warning");
      return;
    }

    try {
      const payload = await fetchQamsJson(`/api/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      const user = payload.user;

      if (!user) {
        throw new Error("Invalid user");
      }

      await syncQamsDataFromApi();
      app.currentUser = user;
      const rememberChecked = document.getElementById("rememberMe")?.checked;
      localStorage.setItem("qamsRememberMe", String(Boolean(rememberChecked)));
      if (rememberChecked) {
        localStorage.setItem("qamsUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("qamsUser");
      }
      alertBox.classList.add("d-none");
      showSystemPopup(`Welcome back, ${user.name}.`, "Login", "success");
      renderApp();
    } catch (error) {
      alertBox.className = "alert alert-danger";
      alertBox.textContent = "Login failed. Please use a valid demo account.";
      alertBox.classList.remove("d-none");
      showSystemPopup("Login failed. Please use a valid demo account.", "Login", "danger");
    }
  });
}

function bindLogout() {
  const btn = document.getElementById("logoutBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    app.currentUser = null;
    localStorage.removeItem("qamsUser");
    localStorage.setItem("qamsRememberMe", "false");
    const rememberCheckbox = document.getElementById("rememberMe");
    if (rememberCheckbox) {
      rememberCheckbox.checked = false;
    }
    document.getElementById("loginScreen").classList.remove("d-none");
    document.getElementById("appShell").classList.add("d-none");
    document.getElementById("loginForm").reset();
  });
}

function bindSectionLinks() {
  document.querySelectorAll("[data-section]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const sectionKey = link.getAttribute("data-section");
      if (sectionKey) {
        event.preventDefault();
        showSection(sectionKey);
      }
    });
  });
}

function bindRoleAwareAction() {
  const nav = document.getElementById("sidebarNav");
  if (!nav) return;

  nav.addEventListener("click", (event) => {
    const target = event.target.closest(".nav-link");
    if (!target) return;
    const key = target.getAttribute("data-target");
    if (key) {
      showSection(key);
    }
  });
}

function renderApp() {
  if (!app.currentUser) {
    document.getElementById("loginScreen").classList.remove("d-none");
    document.getElementById("appShell").classList.add("d-none");
    return;
  }

  const loginScreen = document.getElementById("loginScreen");
  const appShell = document.getElementById("appShell");

  loginScreen.classList.add("d-none");
  appShell.classList.remove("d-none");

  renderSidebar();
  renderTopbar();
  renderDashboard();
  renderDocumentManagement();
  renderLedManagement();
  renderKpiManagement();
  renderAuditManagement();
  renderFindingManagement();
  renderFollowUpManagement();
  renderNotifications();
  renderReports();
  renderSearchArchive();
  renderUserManagement();
  renderProfile();
  renderSystemSettings();
  renderSection(app.selectedSection);
}

function renderSidebar() {
  const sidebarNav = document.getElementById("sidebarNav");
  const items = roleMenuMap[app.currentUser.role] || navItems;

  sidebarNav.innerHTML = items.map((item) => {
    const activeClass = app.selectedSection === item.key ? "active" : "";
    return `
      <div class="nav-link ${activeClass}" data-target="${item.key}" role="button">
        <span class="label">
          <i class="bi ${item.icon}"></i>
          <span>${item.label}</span>
        </span>
      </div>
    `;
  }).join("");
}

function renderTopbar() {
  const user = app.currentUser;
  document.getElementById("userNameTop").textContent = user.name;
  document.getElementById("userAvatar").textContent = user.name.charAt(0).toUpperCase();
  document.getElementById("notificationBadge").textContent = qamsData.notifications.filter((item) => item.status === "Unread").length;
  updateApiStatusIndicator();

  const breadcrumb = document.getElementById("pageBreadcrumb");
  breadcrumb.innerHTML = `<span class="text-muted">${user.role}</span>`;

  const pageTitleMap = {
    dashboardSection: "Dashboard",
    documentSection: "Document Management",
    ledSection: "LED/LKPS Management",
    kpiSection: "KPI / Quality Indicators",
    auditSection: "Internal Audit",
    findingSection: "Audit Findings",
    followUpSection: "Audit Follow-Up",
    notificationSection: "Notifications",
    reportsSection: "Reports",
    searchSection: "Search & Archive",
    userManagementSection: "User Management",
    settingsSection: "System Settings",
    profileSection: "Profile"
  };

  document.getElementById("pageTitle").textContent = pageTitleMap[app.selectedSection] || "Dashboard";
}

function showSection(key) {
  app.selectedSection = key;
  renderSidebar();
  renderTopbar();
  renderSection(key);
}

function renderSection(key) {
  const sections = document.querySelectorAll(".page-section");
  sections.forEach((section) => {
    section.classList.toggle("active", section.id === key);
  });

  const topTitle = document.getElementById("pageTitle");
  const names = {
    dashboardSection: "Dashboard",
    documentSection: "Document Management",
    ledSection: "LED/LKPS Management",
    kpiSection: "KPI / Quality Indicators",
    auditSection: "Internal Audit",
    findingSection: "Audit Findings",
    followUpSection: "Audit Follow-Up",
    notificationSection: "Notifications",
    reportsSection: "Reports",
    searchSection: "Search & Archive",
    userManagementSection: "User Management",
    settingsSection: "System Settings",
    profileSection: "Profile"
  };
  topTitle.textContent = names[key] || "Dashboard";
}

function renderDashboard() {
  const summaryCards = [
    { label: "Total Documents", value: qamsData.documents.length, icon: "bi-file-earmark-text", meta: "+2 this month" },
    { label: "Pending Documents", value: qamsData.documents.filter((doc) => ["Draft", "Submitted", "Under Review"].includes(doc.status)).length, icon: "bi-hourglass-split", meta: "Active queue" },
    { label: "Validated Documents", value: qamsData.documents.filter((d) => d.status === "Validated").length, icon: "bi-check-circle", meta: "Quality cleared" },
    { label: "Rejected Documents", value: qamsData.documents.filter((d) => d.status === "Rejected").length, icon: "bi-x-circle", meta: "Needs revision" },
    { label: "Total KPIs", value: qamsData.kpis.length, icon: "bi-graph-up", meta: "Performance index" },
    { label: "KPI Achievement Rate", value: `${averageAchievement()}%`, icon: "bi-percent", meta: "Across units" },
    { label: "Scheduled Audits", value: qamsData.audits.filter((a) => ["Scheduled", "In Progress"].includes(a.status)).length, icon: "bi-calendar3", meta: "Planned" },
    { label: "Open Audit Findings", value: qamsData.findings.filter((f) => ["Open", "In Progress"].includes(f.status)).length, icon: "bi-exclamation-triangle", meta: "Action needed" },
    { label: "Completed Follow-Up", value: qamsData.followUps.filter((f) => f.status === "Closed").length, icon: "bi-clipboard-check", meta: "Verified" },
    { label: "Upcoming Deadlines", value: qamsData.ledSubmissions.length + 2, icon: "bi-alarm", meta: "Within 30 days" }
  ];

  document.getElementById("summaryCards").innerHTML = summaryCards.map((card) => `
    <div class="col-md-6 col-xl-3">
      <div class="summary-card">
        <div class="summary-top">
          <div>
            <div class="text-muted small">${card.label}</div>
          </div>
          <div class="summary-icon"><i class="bi ${card.icon}"></i></div>
        </div>
        <p class="summary-value">${card.value}</p>
        <p class="summary-meta">${card.meta}</p>
      </div>
    </div>
  `).join("");

  const documentStatusData = {
    labels: ["Draft", "Submitted", "Under Review", "Validated", "Rejected"],
    values: [
      qamsData.documents.filter((d) => d.status === "Draft").length,
      qamsData.documents.filter((d) => d.status === "Submitted").length,
      qamsData.documents.filter((d) => d.status === "Under Review").length,
      qamsData.documents.filter((d) => d.status === "Validated").length,
      qamsData.documents.filter((d) => d.status === "Rejected").length
    ]
  };

  renderChart("documentStatusChart", "doughnut", {
    labels: documentStatusData.labels,
    datasets: [{
      data: documentStatusData.values,
      backgroundColor: ["#e0e7ff", "#7dd3fc", "#fbbf24", "#34d399", "#f87171"],
      borderWidth: 0
    }]
  });

  renderChart("kpiPerformanceChart", "bar", {
    labels: qamsData.kpis.map((kpi) => kpi.code),
    datasets: [{
      label: "Achievement %",
      data: qamsData.kpis.map((kpi) => Number(kpi.achievement.toFixed(1))),
      backgroundColor: "#2a6df6"
    }]
  });

  renderChart("auditStatusChart", "polarArea", {
    labels: ["Scheduled", "In Progress", "Completed", "Follow-Up"],
    datasets: [{
      data: [
        qamsData.audits.filter((a) => a.status === "Scheduled").length,
        qamsData.audits.filter((a) => a.status === "In Progress").length,
        qamsData.audits.filter((a) => a.status === "Completed").length,
        qamsData.audits.filter((a) => a.status === "Follow-Up").length
      ],
      backgroundColor: ["#60a5fa", "#fbbf24", "#34d399", "#f472b6"]
    }]
  });

  document.getElementById("deadlineList").innerHTML = [
    { name: "Revisi LKPS - Sistem Informasi", due: "Due in 3 days" },
    { name: "Audit Internal - Teknik Informatika", due: "Due in 4 days" },
    { name: "Tindak lanjut temuan - Manajemen", due: "Due in 7 days" },
    { name: "Dokumen SPMI - Fakultas Teknik", due: "Due in 11 days" }
  ].map((item) => `
    <div class="deadline-item">
      <div>
        <div class="deadline-name">${item.name}</div>
        <div class="deadline-meta">${item.due}</div>
      </div>
      <span class="status-badge status-under-review">Priority</span>
    </div>
  `).join("");

  document.getElementById("activityTableBody").innerHTML = qamsData.activities.map((a) => `
    <tr>
      <td>${a.user}</td>
      <td>${a.activity}</td>
      <td>${a.module}</td>
      <td>${a.dateTime}</td>
      <td><span class="status-badge status-${toStatusClass(a.status)}">${a.status}</span></td>
    </tr>
  `).join("");

  const signalItems = [
    { title: "Document completion", value: "78%", note: "Moderate compliance" },
    { title: "KPI achievement", value: `${averageAchievement()}%`, note: "Across monitored units" },
    { title: "Follow-up closure", value: "67%", note: "Needs improvement" }
  ];

  document.getElementById("qaSignal").innerHTML = signalItems.map((item) => `
    <div class="signal-item">
      <strong>${item.title}</strong>
      <div class="d-flex justify-content-between align-items-center mb-1">
        <span class="fw-bold">${item.value}</span>
      </div>
      <div class="progress"><div class="progress-bar bg-success" style="width: ${item.value.replace('%','')};"></div></div>
      <small class="text-muted d-block mt-2">${item.note}</small>
    </div>
  `).join("");
}

function renderDocumentManagement() {
  const filterStatus = document.getElementById("documentStatusFilter") ? document.getElementById("documentStatusFilter").value : "all";
  const filterCategory = document.getElementById("documentCategoryFilter") ? document.getElementById("documentCategoryFilter").value : "all";
  const searchTerm = document.getElementById("documentSearch") ? document.getElementById("documentSearch").value.toLowerCase() : "";

  let docs = qamsData.documents.filter((doc) => {
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;
    const matchesCategory = filterCategory === "all" || doc.category === filterCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm) || doc.id.toLowerCase().includes(searchTerm);
    return matchesStatus && matchesCategory && matchesSearch;
  });

  if (!docs.length) {
    document.getElementById("documentTableBody").innerHTML = `<tr><td colspan="7"><div class="empty-state">No documents found</div></td></tr>`;
    return;
  }

  document.getElementById("documentTableBody").innerHTML = docs.map((doc) => `
    <tr>
      <td>
        <div class="fw-semibold">${doc.title}</div>
        <small class="text-muted">${doc.id}</small>
      </td>
      <td>${doc.category}</td>
      <td>${doc.owner}</td>
      <td>${doc.version}</td>
      <td><span class="status-badge status-${toStatusClass(doc.status)}">${doc.status}</span></td>
      <td>${doc.lastUpdated}</td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-light" type="button" data-doc-action="view" data-doc-id="${doc.id}"><i class="bi bi-eye"></i></button>
          <button class="btn btn-light" type="button" data-doc-action="download" data-doc-id="${doc.id}"><i class="bi bi-download"></i></button>
          <button class="btn btn-light" type="button" data-doc-action="edit" data-doc-id="${doc.id}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-light" type="button" data-doc-action="review" data-doc-id="${doc.id}"><i class="bi bi-check2-square"></i></button>
          <button class="btn btn-light" type="button" data-doc-action="archive" data-doc-id="${doc.id}"><i class="bi bi-archive"></i></button>
          <button class="btn btn-light" type="button" data-doc-action="delete" data-doc-id="${doc.id}"><i class="bi bi-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join("");

  const searchInput = document.getElementById("documentSearch");
  const statusFilter = document.getElementById("documentStatusFilter");
  const categoryFilter = document.getElementById("documentCategoryFilter");
  const resetButton = document.getElementById("resetDocumentFilter");

  if (searchInput) {
    searchInput.oninput = () => renderDocumentManagement();
  }
  if (statusFilter) {
    statusFilter.onchange = () => renderDocumentManagement();
  }
  if (categoryFilter) {
    categoryFilter.onchange = () => renderDocumentManagement();
  }
  if (resetButton) {
    resetButton.onclick = () => {
      if (searchInput) searchInput.value = "";
      if (statusFilter) statusFilter.value = "all";
      if (categoryFilter) categoryFilter.value = "all";
      renderDocumentManagement();
    };
  }
}

function bindDocumentActions() {
  const tableBody = document.getElementById("documentTableBody");
  if (!tableBody) return;

  tableBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-doc-action]");
    if (!button) return;

    const action = button.dataset.docAction;
    const docId = button.dataset.docId;
    handleDocumentAction(action, docId);
  });
}

function bindDocumentModalActions() {
  const saveBtn = document.getElementById("saveDocumentBtn");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", async () => {
    const title = document.getElementById("documentTitle").value.trim();
    if (!title) {
      showSystemPopup("Document title is required.", "Required", "warning");
      return;
    }

    const documentId = document.getElementById("documentId").value.trim();
    const category = document.getElementById("documentCategory").value;
    const status = document.getElementById("documentStatus").value;
    const studyProgram = document.getElementById("documentStudyProgram").value.trim() || "Teknik Informatika";
    const faculty = document.getElementById("documentFaculty").value.trim() || "Teknik";
    const academicYear = document.getElementById("documentAcademicYear").value.trim() || "2025/2026";
    const owner = document.getElementById("documentOwner").value.trim() || app.currentUser.name;
    const version = document.getElementById("documentVersion").value.trim() || "V1";
    const reviewer = document.getElementById("documentReviewer").value.trim() || "Nina Pratiwi";
    const today = new Date().toISOString().slice(0, 10);

    const payload = {
      id: documentId || `DOC-${new Date().getFullYear()}-${String(qamsData.documents.length + 1).padStart(3, "0")}`,
      title,
      category,
      faculty,
      studyProgram,
      academicYear,
      owner,
      version,
      uploadDate: today,
      lastUpdated: today,
      status,
      reviewer,
      validationDate: status === "Validated" ? today : "-",
      updated: today
    };

    const existingDoc = qamsData.documents.find((item) => item.id === documentId);
    try {
      if (existingDoc) {
        await persistCollectionToApi("documents", "PUT", payload, payload.id);
        const index = qamsData.documents.findIndex((item) => item.id === payload.id);
        if (index >= 0) {
          qamsData.documents[index] = { ...qamsData.documents[index], ...payload };
        }
      } else {
        await persistCollectionToApi("documents", "POST", payload);
        qamsData.documents.unshift(payload);
      }
    } catch (error) {
      console.warn("API document save failed, continuing with local fallback.", error);
      if (existingDoc) {
        existingDoc.title = title;
        existingDoc.category = category;
        existingDoc.status = status;
        existingDoc.studyProgram = studyProgram;
        existingDoc.faculty = faculty;
        existingDoc.academicYear = academicYear;
        existingDoc.owner = owner;
        existingDoc.version = version;
        existingDoc.reviewer = reviewer;
        existingDoc.lastUpdated = today;
        existingDoc.updated = today;
      } else {
        qamsData.documents.unshift(payload);
      }
    }

    const documentModal = bootstrap.Modal.getInstance(document.getElementById("documentModal"));
    document.getElementById("documentForm").reset();
    document.getElementById("documentStatus").value = "Draft";
    document.getElementById("documentCategory").value = "LED";
    document.getElementById("documentModalTitle").textContent = "Upload Document";
    if (documentModal) documentModal.hide();

    saveQamsData();
    renderDocumentManagement();
    renderDashboard();
    renderNotifications();
    renderTopbar();
  });

  const uploadButton = document.querySelector('[data-bs-target="#documentModal"]');
  if (uploadButton) {
    uploadButton.addEventListener("click", () => {
      document.getElementById("documentModalTitle").textContent = "Upload Document";
      document.getElementById("documentForm").reset();
      document.getElementById("documentStatus").value = "Draft";
      document.getElementById("documentCategory").value = "LED";
      document.getElementById("documentId").value = "";
    });
  }
}

async function handleDocumentAction(action, docId) {
  const doc = qamsData.documents.find((item) => item.id === docId);
  if (!doc) return;

  switch (action) {
    case "view":
      openDocumentDetail(doc);
      break;
    case "download":
      showSystemPopup(`Downloading: ${doc.title}`, "Download", "info");
      break;
    case "edit":
      openDocumentEditor(doc);
      break;
    case "review": {
      doc.status = "Under Review";
      doc.lastUpdated = new Date().toISOString().slice(0, 10);
      doc.updated = doc.lastUpdated;
      try {
        await persistCollectionToApi("documents", "PUT", doc, doc.id);
      } catch (error) {
        console.warn("Review update failed on API, local state updated only.", error);
      }
      qamsData.notifications.unshift({
        id: Date.now(),
        title: "Document review started",
        description: `${doc.title} is now under review by QA Officer.`,
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
        module: "Document Management",
        status: "Unread"
      });
      break;
    }
    case "archive":
      doc.status = "Archived";
      doc.lastUpdated = new Date().toISOString().slice(0, 10);
      doc.updated = doc.lastUpdated;
      try {
        await persistCollectionToApi("documents", "PUT", doc, doc.id);
      } catch (error) {
        console.warn("Archive update failed on API, local state updated only.", error);
      }
      break;
    case "delete": {
      const confirmed = await showSystemConfirm(`Hapus dokumen ${doc.title}?`, "Konfirmasi hapus");
      if (!confirmed) return;
      try {
        await persistCollectionToApi("documents", "DELETE", null, docId);
      } catch (error) {
        console.warn("Delete request failed on API, removing locally only.", error);
      }
      const index = qamsData.documents.findIndex((item) => item.id === docId);
      if (index !== -1) {
        qamsData.documents.splice(index, 1);
      }
      renderDocumentManagement();
      renderDashboard();
      renderNotifications();
      renderTopbar();
      return;
    }
    default:
      break;
  }

  saveQamsData();
  renderDocumentManagement();
  renderDashboard();
  renderNotifications();
  renderTopbar();
}

function openDocumentEditor(doc) {
  document.getElementById("documentModalTitle").textContent = "Edit Document";
  document.getElementById("documentId").value = doc.id;
  document.getElementById("documentTitle").value = doc.title;
  document.getElementById("documentCategory").value = doc.category;
  document.getElementById("documentStatus").value = doc.status;
  document.getElementById("documentStudyProgram").value = doc.studyProgram;
  document.getElementById("documentFaculty").value = doc.faculty;
  document.getElementById("documentAcademicYear").value = doc.academicYear;
  document.getElementById("documentOwner").value = doc.owner;
  document.getElementById("documentVersion").value = doc.version;
  document.getElementById("documentReviewer").value = doc.reviewer;

  const modal = new bootstrap.Modal(document.getElementById("documentModal"));
  modal.show();
}

function openDocumentDetail(doc) {
  const body = document.getElementById("documentDetailBody");
  body.innerHTML = `
    <div class="row g-3">
      <div class="col-md-6"><strong>Document ID</strong><div>${doc.id}</div></div>
      <div class="col-md-6"><strong>Title</strong><div>${doc.title}</div></div>
      <div class="col-md-6"><strong>Category</strong><div>${doc.category}</div></div>
      <div class="col-md-6"><strong>Status</strong><div><span class="status-badge status-${toStatusClass(doc.status)}">${doc.status}</span></div></div>
      <div class="col-md-6"><strong>Study Program</strong><div>${doc.studyProgram}</div></div>
      <div class="col-md-6"><strong>Faculty</strong><div>${doc.faculty}</div></div>
      <div class="col-md-6"><strong>Academic Year</strong><div>${doc.academicYear}</div></div>
      <div class="col-md-6"><strong>Owner</strong><div>${doc.owner}</div></div>
      <div class="col-md-6"><strong>Version</strong><div>${doc.version}</div></div>
      <div class="col-md-6"><strong>Reviewer</strong><div>${doc.reviewer}</div></div>
      <div class="col-md-6"><strong>Upload Date</strong><div>${doc.uploadDate}</div></div>
      <div class="col-md-6"><strong>Last Updated</strong><div>${doc.lastUpdated}</div></div>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById("documentDetailModal"));
  modal.show();
}

function renderLedManagement() {
  const list = document.getElementById("ledSubmissionList");
  if (!list) return;

  const items = Array.isArray(qamsData.ledSubmissions) ? qamsData.ledSubmissions : [];
  list.innerHTML = items.map((item) => `
    <div class="col-lg-4 col-md-6">
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <div class="text-uppercase small text-muted fw-semibold">${item.id}</div>
              <h3 class="h5 mb-0 mt-1">${item.studyProgram}</h3>
            </div>
            <span class="status-badge status-${toStatusClass(item.status)}">${item.status}</span>
          </div>

          <div class="mb-2"><strong>Type:</strong> ${item.documentType}</div>
          <div class="mb-2"><strong>Academic Year:</strong> ${item.academicYear}</div>
          <div class="mb-2"><strong>Reviewer:</strong> ${item.reviewer}</div>
          <div class="mb-2"><strong>Deadline:</strong> ${item.deadline}</div>

          <div class="mt-3">
            <div class="d-flex justify-content-between small text-muted mb-1">
              <span>Progress</span>
              <span>${item.progress}%</span>
            </div>
            <div class="progress"><div class="progress-bar bg-primary" style="width: ${item.progress}%"></div></div>
          </div>

          <div class="btn-group btn-group-sm mt-3 w-100">
            <button class="btn btn-light" type="button" data-led-action="edit" data-led-id="${item.id}"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-light" type="button" data-led-action="validate" data-led-id="${item.id}"><i class="bi bi-check2-square"></i></button>
            <button class="btn btn-light" type="button" data-led-action="delete" data-led-id="${item.id}"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

function bindLedActions() {
  const ledList = document.getElementById("ledSubmissionList");
  if (!ledList) return;

  ledList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-led-action]");
    if (!button) return;

    const action = button.dataset.ledAction;
    const id = button.dataset.ledId;
    handleLedAction(action, id);
  });

  const openBtn = document.querySelector("#ledSection .btn-primary");
  if (openBtn) {
    openBtn.addEventListener("click", () => openLedSubmissionModal());
  }

  const saveBtn = document.getElementById("saveLedSubmissionBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const id = document.getElementById("ledSubmissionId").value.trim();
      const studyProgram = document.getElementById("ledStudyProgram").value.trim();
      const academicYear = document.getElementById("ledAcademicYear").value.trim();
      const documentType = document.getElementById("ledDocumentType").value;
      const reviewer = document.getElementById("ledReviewer").value.trim();
      const status = document.getElementById("ledStatus").value;
      const deadline = document.getElementById("ledDeadline").value;
      const progress = Number(document.getElementById("ledProgress").value || 0);

      if (!studyProgram || !academicYear) {
        showSystemPopup("Study program and academic year are required.", "Required", "warning");
        return;
      }

      const payload = {
        id: id || `LED-${new Date().getFullYear()}-${String(qamsData.ledSubmissions.length + 1).padStart(2, "0")}`,
        studyProgram,
        academicYear,
        documentType,
        submissionDate: new Date().toISOString().slice(0, 10),
        reviewer,
        status,
        deadline: deadline || new Date().toISOString().slice(0, 10),
        progress,
        type: documentType
      };

      const existing = qamsData.ledSubmissions.find((item) => item.id === id);
      try {
        if (existing) {
          await persistCollectionToApi("led-lkps", "PUT", payload, payload.id);
          const index = qamsData.ledSubmissions.findIndex((item) => item.id === payload.id);
          if (index >= 0) {
            qamsData.ledSubmissions[index] = { ...qamsData.ledSubmissions[index], ...payload };
          }
        } else {
          await persistCollectionToApi("led-lkps", "POST", payload);
          qamsData.ledSubmissions.unshift(payload);
        }
      } catch (error) {
        console.warn("API LED save failed, falling back to local state.", error);
        if (existing) {
          existing.studyProgram = studyProgram;
          existing.academicYear = academicYear;
          existing.documentType = documentType;
          existing.reviewer = reviewer;
          existing.status = status;
          existing.deadline = deadline || existing.deadline;
          existing.progress = progress;
        } else {
          qamsData.ledSubmissions.unshift(payload);
        }
      }

      const modal = bootstrap.Modal.getInstance(document.getElementById("ledSubmissionModal"));
      document.getElementById("ledSubmissionForm").reset();
      if (modal) modal.hide();
      saveQamsData();
      renderLedManagement();
      renderDashboard();
      renderNotifications();
    });
  }
}

function openLedSubmissionModal(item = null) {
  const modalTitle = document.getElementById("ledSubmissionModalTitle");
  const form = document.getElementById("ledSubmissionForm");
  const actionText = item ? "Edit LED/LKPS Submission" : "Create LED/LKPS Submission";
  modalTitle.textContent = actionText;
  form.reset();

  if (item) {
    document.getElementById("ledSubmissionId").value = item.id;
    document.getElementById("ledStudyProgram").value = item.studyProgram;
    document.getElementById("ledAcademicYear").value = item.academicYear;
    document.getElementById("ledDocumentType").value = item.documentType;
    document.getElementById("ledReviewer").value = item.reviewer;
    document.getElementById("ledStatus").value = item.status;
    document.getElementById("ledDeadline").value = item.deadline;
    document.getElementById("ledProgress").value = item.progress;
  }

  const modal = new bootstrap.Modal(document.getElementById("ledSubmissionModal"));
  modal.show();
}

async function handleLedAction(action, id) {
  const item = qamsData.ledSubmissions.find((entry) => entry.id === id);
  if (!item) return;

  switch (action) {
    case "edit":
      openLedSubmissionModal(item);
      return;
    case "validate":
      item.status = "Validated";
      item.progress = 100;
      try {
        await persistCollectionToApi("led-lkps", "PUT", item, item.id);
      } catch (error) {
        console.warn("LED validation update failed on API, local state updated only.", error);
      }
      break;
    case "delete": {
      try {
        await persistCollectionToApi("led-lkps", "DELETE", null, id);
      } catch (error) {
        console.warn("Delete request failed on API, removing locally only.", error);
      }
      qamsData.ledSubmissions = qamsData.ledSubmissions.filter((entry) => entry.id !== id);
      break;
    }
    default:
      break;
  }

  saveQamsData();
  renderLedManagement();
  renderDashboard();
}

function renderKpiManagement() {
  const categoryFilter = document.getElementById("kpiCategoryFilter");
  const statusFilter = document.getElementById("kpiStatusFilter");
  const resetButton = document.getElementById("resetKpiFilter");

  const safeKpis = Array.isArray(qamsData.kpis) ? qamsData.kpis : [];
  let rows = safeKpis.filter((kpi) => {
    const catMatch = categoryFilter ? (categoryFilter.value === "all" || kpi.category === categoryFilter.value) : true;
    const statusMatch = statusFilter ? (statusFilter.value === "all" || kpi.status === statusFilter.value) : true;
    return catMatch && statusMatch;
  });

  document.getElementById("kpiTableBody").innerHTML = rows.map((kpi) => `
    <tr>
      <td>${kpi.code}</td>
      <td>${kpi.name}</td>
      <td>${kpi.category}</td>
      <td>${kpi.target} ${kpi.unit}</td>
      <td>${kpi.actual} ${kpi.unit}</td>
      <td>
        <div class="fw-semibold">${Number(kpi.achievement).toFixed(1)}%</div>
        <div class="kpi-meter mt-2"><span style="width: ${Math.min(Number(kpi.achievement), 100)}%"></span></div>
      </td>
      <td><span class="status-badge status-${toStatusClass(kpi.status)}">${kpi.status}</span></td>
      <td>${kpi.responsibleUnit}</td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-light" type="button" data-kpi-action="edit" data-kpi-code="${kpi.code}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-light" type="button" data-kpi-action="delete" data-kpi-code="${kpi.code}"><i class="bi bi-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join("");

  if (categoryFilter) {
    categoryFilter.onchange = () => renderKpiManagement();
  }
  if (statusFilter) {
    statusFilter.onchange = () => renderKpiManagement();
  }
  if (resetButton) {
    resetButton.onclick = () => {
      categoryFilter.value = "all";
      statusFilter.value = "all";
      renderKpiManagement();
    };
  }
}

function bindKpiActions() {
  const tableBody = document.getElementById("kpiTableBody");
  if (!tableBody) return;

  tableBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-kpi-action]");
    if (!button) return;
    const action = button.dataset.kpiAction;
    const code = button.dataset.kpiCode;
    handleKpiAction(action, code);
  });

  const addButton = document.querySelector("#kpiSection .btn-primary");
  if (addButton) {
    addButton.addEventListener("click", () => openKpiModal());
  }

  const saveBtn = document.getElementById("saveKpiBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const code = document.getElementById("kpiCode").value.trim();
      const name = document.getElementById("kpiName").value.trim();
      if (!name) {
        showSystemPopup("KPI name is required.", "Required", "warning");
        return;
      }

      const category = document.getElementById("kpiCategory").value;
      const unit = document.getElementById("kpiUnit").value.trim() || "%";
      const target = Number(document.getElementById("kpiTarget").value || 0);
      const actual = Number(document.getElementById("kpiActual").value || 0);
      const responsibleUnit = document.getElementById("kpiResponsibleUnit").value.trim() || "Unit Mutu";
      const measurementPeriod = document.getElementById("kpiPeriod").value.trim() || "2025/2026";
      const evidence = document.getElementById("kpiEvidence").value.trim() || "Bukti pendukung";
      const status = document.getElementById("kpiStatus").value;
      const achievement = target === 0 ? 0 : (actual / target) * 100;
      const payload = {
        code: code || `KPI-${String(qamsData.kpis.length + 1).padStart(2, "0")}`,
        name,
        description: `KPI ${name}`,
        category,
        unit,
        target,
        actual,
        achievement,
        responsibleUnit,
        period: measurementPeriod,
        evidence,
        status
      };

      const existing = qamsData.kpis.find((item) => item.code === payload.code);
      try {
        if (existing) {
          await persistCollectionToApi("kpis", "PUT", payload, payload.code);
          const index = qamsData.kpis.findIndex((item) => item.code === payload.code);
          if (index >= 0) {
            qamsData.kpis[index] = { ...qamsData.kpis[index], ...payload };
          }
        } else {
          await persistCollectionToApi("kpis", "POST", payload);
          qamsData.kpis.unshift(payload);
        }
      } catch (error) {
        console.warn("API KPI save failed, switching to local state.", error);
        if (existing) {
          existing.name = name;
          existing.category = category;
          existing.unit = unit;
          existing.target = target;
          existing.actual = actual;
          existing.achievement = achievement;
          existing.responsibleUnit = responsibleUnit;
          existing.period = measurementPeriod;
          existing.evidence = evidence;
          existing.status = status;
        } else {
          qamsData.kpis.unshift(payload);
        }
      }

      const modal = bootstrap.Modal.getInstance(document.getElementById("kpiModal"));
      document.getElementById("kpiForm").reset();
      if (modal) modal.hide();
      saveQamsData();
      renderKpiManagement();
      renderDashboard();
    });
  }
}

function openKpiModal(item = null) {
  document.getElementById("kpiModalTitle").textContent = item ? "Edit KPI" : "Add KPI";
  document.getElementById("kpiForm").reset();

  if (item) {
    document.getElementById("kpiCode").value = item.code;
    document.getElementById("kpiName").value = item.name;
    document.getElementById("kpiCategory").value = item.category;
    document.getElementById("kpiUnit").value = item.unit;
    document.getElementById("kpiTarget").value = item.target;
    document.getElementById("kpiActual").value = item.actual;
    document.getElementById("kpiResponsibleUnit").value = item.responsibleUnit;
    document.getElementById("kpiPeriod").value = item.period;
    document.getElementById("kpiEvidence").value = item.evidence;
    document.getElementById("kpiStatus").value = item.status;
  }

  const modal = new bootstrap.Modal(document.getElementById("kpiModal"));
  modal.show();
}

async function handleKpiAction(action, code) {
  const item = qamsData.kpis.find((entry) => entry.code === code);
  if (!item) return;

  if (action === "edit") {
    openKpiModal(item);
    return;
  }

  if (action === "delete") {
    const confirmed = await showSystemConfirm(`Hapus KPI ${code}?`, "Konfirmasi hapus");
    if (!confirmed) return;
    try {
      await persistCollectionToApi("kpis", "DELETE", null, code);
    } catch (error) {
      console.warn("Delete request failed on API, removing locally only.", error);
    }
    qamsData.kpis = qamsData.kpis.filter((entry) => entry.code !== code);
    saveQamsData();
    renderKpiManagement();
    renderDashboard();
  }
}

function bindAuditActions() {
  const table = document.getElementById("auditTableContainer");
  if (table) {
    table.addEventListener("click", (event) => {
      const button = event.target.closest("[data-audit-action]");
      if (!button) return;
      handleAuditAction(button.dataset.auditAction, button.dataset.auditId);
    });
  }

  const addButton = document.querySelector("#auditSection .btn-primary");
  if (addButton) {
    addButton.addEventListener("click", () => openAuditModal());
  }

  const saveBtn = document.getElementById("saveAuditBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const id = document.getElementById("auditId").value.trim();
      const title = document.getElementById("auditTitle").value.trim();
      const faculty = document.getElementById("auditFaculty").value.trim();
      const studyProgram = document.getElementById("auditStudyProgram").value.trim();
      const auditor = document.getElementById("auditAuditor").value.trim();
      const auditDate = document.getElementById("auditDate").value;
      const scope = document.getElementById("auditScope").value.trim();
      const status = document.getElementById("auditStatus").value;

      if (!title || !faculty || !studyProgram || !auditor) {
        showSystemPopup("Please complete all required audit fields.", "Required", "warning");
        return;
      }

      const payload = { id: id || `AUD-${new Date().getFullYear()}-${String(qamsData.audits.length + 1).padStart(2, "0")}`, title, faculty, studyProgram, auditor, auditDate: auditDate || new Date().toISOString().slice(0, 10), scope: scope || "Audit internal program studi", status };
      const index = qamsData.audits.findIndex((item) => item.id === payload.id);
      try {
        if (index >= 0) {
          await persistCollectionToApi("audits", "PUT", payload, payload.id);
          qamsData.audits[index] = { ...qamsData.audits[index], ...payload };
        } else {
          await persistCollectionToApi("audits", "POST", payload);
          qamsData.audits.unshift(payload);
        }
      } catch (error) {
        console.warn("Audit API save failed, using local fallback.", error);
        if (index >= 0) {
          qamsData.audits[index] = { ...qamsData.audits[index], ...payload };
        } else {
          qamsData.audits.unshift(payload);
        }
      }

      const modal = bootstrap.Modal.getInstance(document.getElementById("auditModal"));
      document.getElementById("auditForm").reset();
      if (modal) modal.hide();
      saveQamsData();
      renderAuditManagement();
      renderDashboard();
      renderNotifications();
    });
  }
}

function openAuditModal(item = null) {
  document.getElementById("auditModalTitle").textContent = item ? "Edit Audit" : "Schedule Audit";
  document.getElementById("auditForm").reset();

  if (item) {
    document.getElementById("auditId").value = item.id;
    document.getElementById("auditTitle").value = item.title;
    document.getElementById("auditFaculty").value = item.faculty;
    document.getElementById("auditStudyProgram").value = item.studyProgram;
    document.getElementById("auditAuditor").value = item.auditor;
    document.getElementById("auditDate").value = item.auditDate;
    document.getElementById("auditScope").value = item.scope;
    document.getElementById("auditStatus").value = item.status;
  }

  const modal = new bootstrap.Modal(document.getElementById("auditModal"));
  modal.show();
}

async function handleAuditAction(action, id) {
  const item = qamsData.audits.find((entry) => entry.id === id);
  if (!item) return;

  if (action === "edit") {
    openAuditModal(item);
    return;
  }

  if (action === "complete") {
    item.status = "Completed";
    try {
      await persistCollectionToApi("audits", "PUT", item, item.id);
    } catch (error) {
      console.warn("Audit completion update failed on API, local state updated only.", error);
    }
  }

  if (action === "delete") {
    try {
      await persistCollectionToApi("audits", "DELETE", null, id);
    } catch (error) {
      console.warn("Audit delete failed on API, local state updated only.", error);
    }
    qamsData.audits = qamsData.audits.filter((entry) => entry.id !== id);
  }

  saveQamsData();
  renderAuditManagement();
  renderDashboard();
}

function bindFindingActions() {
  const table = document.getElementById("findingTableContainer");
  if (table) {
    table.addEventListener("click", (event) => {
      const button = event.target.closest("[data-finding-action]");
      if (!button) return;
      handleFindingAction(button.dataset.findingAction, button.dataset.findingId);
    });
  }

  const addButton = document.querySelector("#findingSection .btn-primary");
  if (addButton) {
    addButton.addEventListener("click", () => openFindingModal());
  }

  const saveBtn = document.getElementById("saveFindingBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const id = document.getElementById("findingId").value.trim();
      const auditId = document.getElementById("findingAuditId").value.trim();
      const category = document.getElementById("findingCategory").value;
      const description = document.getElementById("findingDescription").value.trim();
      const severity = document.getElementById("findingSeverity").value;
      const responsibleUnit = document.getElementById("findingResponsibleUnit").value.trim();
      const deadline = document.getElementById("findingDeadline").value;
      const status = document.getElementById("findingStatus").value;

      if (!description || !auditId || !responsibleUnit) {
        showSystemPopup("Please complete all required finding fields.", "Required", "warning");
        return;
      }

      const payload = { id: id || `FND-${String(qamsData.findings.length + 1).padStart(3, "0")}`, auditId, category, description, severity, responsibleUnit, recommendation: "Follow-up required", deadline: deadline || "2026-11-15", status };
      const index = qamsData.findings.findIndex((item) => item.id === payload.id);
      try {
        if (index >= 0) {
          await persistCollectionToApi("findings", "PUT", payload, payload.id);
          qamsData.findings[index] = { ...qamsData.findings[index], ...payload };
        } else {
          await persistCollectionToApi("findings", "POST", payload);
          qamsData.findings.unshift(payload);
        }
      } catch (error) {
        console.warn("Finding API save failed, using local fallback.", error);
        if (index >= 0) {
          qamsData.findings[index] = { ...qamsData.findings[index], ...payload };
        } else {
          qamsData.findings.unshift(payload);
        }
      }

      const modal = bootstrap.Modal.getInstance(document.getElementById("findingModal"));
      document.getElementById("findingForm").reset();
      if (modal) modal.hide();
      saveQamsData();
      renderFindingManagement();
      renderDashboard();
    });
  }
}

function openFindingModal(item = null) {
  document.getElementById("findingModalTitle").textContent = item ? "Edit Finding" : "Add Finding";
  document.getElementById("findingForm").reset();

  if (item) {
    document.getElementById("findingId").value = item.id;
    document.getElementById("findingAuditId").value = item.auditId;
    document.getElementById("findingCategory").value = item.category;
    document.getElementById("findingDescription").value = item.description;
    document.getElementById("findingSeverity").value = item.severity;
    document.getElementById("findingResponsibleUnit").value = item.responsibleUnit;
    document.getElementById("findingDeadline").value = item.deadline;
    document.getElementById("findingStatus").value = item.status;
  }

  const modal = new bootstrap.Modal(document.getElementById("findingModal"));
  modal.show();
}

async function handleFindingAction(action, id) {
  const item = qamsData.findings.find((entry) => entry.id === id);
  if (!item) return;

  if (action === "edit") {
    openFindingModal(item);
    return;
  }

  if (action === "resolve") {
    item.status = "Resolved";
    try {
      await persistCollectionToApi("findings", "PUT", item, item.id);
    } catch (error) {
      console.warn("Finding resolution update failed on API, local state updated only.", error);
    }
  }

  if (action === "delete") {
    try {
      await persistCollectionToApi("findings", "DELETE", null, id);
    } catch (error) {
      console.warn("Finding delete failed on API, local state updated only.", error);
    }
    qamsData.findings = qamsData.findings.filter((entry) => entry.id !== id);
  }

  saveQamsData();
  renderFindingManagement();
  renderDashboard();
}

function bindFollowUpActions() {
  const list = document.getElementById("followUpList");
  if (list) {
    list.addEventListener("click", (event) => {
      const button = event.target.closest("[data-followup-action]");
      if (!button) return;
      handleFollowUpAction(button.dataset.followupAction, button.dataset.followupId);
    });
  }

  const addButton = document.querySelector("#followUpSection .btn-primary");
  if (addButton) {
    addButton.addEventListener("click", () => openFollowUpModal());
  }

  const saveBtn = document.getElementById("saveFollowUpBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const id = document.getElementById("followUpId").value.trim();
      const finding = document.getElementById("followUpFinding").value.trim();
      const action = document.getElementById("followUpAction").value.trim();
      const responsible = document.getElementById("followUpResponsible").value.trim();
      const targetDate = document.getElementById("followUpTargetDate").value;
      const progress = Number(document.getElementById("followUpProgress").value || 0);
      const evidence = document.getElementById("followUpEvidence").value.trim();
      const verification = document.getElementById("followUpVerification").value.trim();
      const status = document.getElementById("followUpStatus").value;

      if (!finding || !responsible) {
        showSystemPopup("Finding and responsible unit are required.", "Required", "warning");
        return;
      }

      const payload = { id: id || `CF-${String(qamsData.followUps.length + 1).padStart(3, "0")}`, finding, action, responsible, targetDate: targetDate || "2026-11-15", progress, evidence: evidence || "Evidence attached", verification: verification || "Pending", status };
      const index = qamsData.followUps.findIndex((item) => item.id === payload.id);
      try {
        if (index >= 0) {
          await persistCollectionToApi("follow-ups", "PUT", payload, payload.id);
          qamsData.followUps[index] = { ...qamsData.followUps[index], ...payload };
        } else {
          await persistCollectionToApi("follow-ups", "POST", payload);
          qamsData.followUps.unshift(payload);
        }
      } catch (error) {
        console.warn("Follow-up API save failed, using local fallback.", error);
        if (index >= 0) {
          qamsData.followUps[index] = { ...qamsData.followUps[index], ...payload };
        } else {
          qamsData.followUps.unshift(payload);
        }
      }

      const modal = bootstrap.Modal.getInstance(document.getElementById("followUpModal"));
      document.getElementById("followUpForm").reset();
      if (modal) modal.hide();
      saveQamsData();
      renderFollowUpManagement();
      renderDashboard();
    });
  }
}

function openFollowUpModal(item = null) {
  document.getElementById("followUpModalTitle").textContent = item ? "Edit Follow-Up" : "New Follow-Up";
  document.getElementById("followUpForm").reset();

  if (item) {
    document.getElementById("followUpId").value = item.id;
    document.getElementById("followUpFinding").value = item.finding;
    document.getElementById("followUpAction").value = item.action;
    document.getElementById("followUpResponsible").value = item.responsible;
    document.getElementById("followUpTargetDate").value = item.targetDate;
    document.getElementById("followUpProgress").value = item.progress;
    document.getElementById("followUpEvidence").value = item.evidence;
    document.getElementById("followUpVerification").value = item.verification;
    document.getElementById("followUpStatus").value = item.status;
  }

  const modal = new bootstrap.Modal(document.getElementById("followUpModal"));
  modal.show();
}

async function handleFollowUpAction(action, id) {
  const item = qamsData.followUps.find((entry) => entry.id === id);
  if (!item) return;

  if (action === "edit") {
    openFollowUpModal(item);
    return;
  }

  if (action === "close") {
    item.status = "Closed";
    item.progress = 100;
    try {
      await persistCollectionToApi("follow-ups", "PUT", item, item.id);
    } catch (error) {
      console.warn("Follow-up close update failed on API, local state updated only.", error);
    }
  }

  if (action === "delete") {
    try {
      await persistCollectionToApi("follow-ups", "DELETE", null, id);
    } catch (error) {
      console.warn("Follow-up delete failed on API, local state updated only.", error);
    }
    qamsData.followUps = qamsData.followUps.filter((entry) => entry.id !== id);
  }

  saveQamsData();
  renderFollowUpManagement();
  renderDashboard();
}

function downloadGeneratedFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function buildPrintableReportHtml() {
  const summary = {
    documents: qamsData.documents.length,
    validatedDocuments: qamsData.documents.filter((doc) => doc.status === "Validated").length,
    pendingDocuments: qamsData.documents.filter((doc) => ["Draft", "Submitted", "Under Review"].includes(doc.status)).length,
    kpis: qamsData.kpis.length,
    audits: qamsData.audits.length,
    findings: qamsData.findings.length,
    followUps: qamsData.followUps.length
  };

  const statsRows = Object.entries(summary).map(([key, value]) => `
    <tr>
      <td>${key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())}</td>
      <td>${value}</td>
    </tr>
  `).join("");

  const documentRows = qamsData.documents.slice(0, 8).map((doc) => `
    <tr>
      <td>${doc.id}</td>
      <td>${doc.title}</td>
      <td>${doc.status}</td>
      <td>${doc.faculty}</td>
    </tr>
  `).join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>QAMS Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 32px; color: #1f2937; }
          h1 { margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 18px; }
          th, td { border: 1px solid #d1d5db; padding: 8px 10px; text-align: left; }
          th { background: #f3f4f6; }
        </style>
      </head>
      <body>
        <h1>QAMS Quality Assurance Monitoring Report</h1>
        <p>Generated on: ${new Date().toISOString()}</p>

        <table>
          <thead><tr><th>Metric</th><th>Value</th></tr></thead>
          <tbody>${statsRows}</tbody>
        </table>

        <h2>Recent Documents</h2>
        <table>
          <thead><tr><th>ID</th><th>Title</th><th>Status</th><th>Faculty</th></tr></thead>
          <tbody>${documentRows}</tbody>
        </table>
      </body>
    </html>
  `;
}

function bindCommonActionButtons() {
  const bellBtn = document.getElementById("notificationBellBtn");
  if (bellBtn) {
    bellBtn.addEventListener("click", () => showSection("notificationSection"));
  }

  const dashboardReportBtn = document.getElementById("generateDashboardReportBtn");
  if (dashboardReportBtn) {
    dashboardReportBtn.addEventListener("click", () => {
      showSection("reportsSection");
      renderReports();
    });
  }

  const scheduleAuditBtn = document.getElementById("scheduleAuditBtn");
  if (scheduleAuditBtn) {
    scheduleAuditBtn.addEventListener("click", () => openAuditModal());
  }

  const addFindingBtn = document.getElementById("addFindingBtn");
  if (addFindingBtn) {
    addFindingBtn.addEventListener("click", () => openFindingModal());
  }

  const newFollowUpBtn = document.getElementById("newFollowUpBtn");
  if (newFollowUpBtn) {
    newFollowUpBtn.addEventListener("click", () => openFollowUpModal());
  }

  const markAllReadBtn = document.getElementById("markAllReadBtn");
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", () => {
      qamsData.notifications = qamsData.notifications.map((item, index) => ({ ...item, id: item.id ?? index + 1, status: "Read" }));
      saveQamsData();
      renderNotifications();
    });
  }

  const printBtn = document.getElementById("printReportBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }

  const pdfBtn = document.getElementById("exportPdfBtn");
  if (pdfBtn) {
    pdfBtn.addEventListener("click", () => {
      const htmlReport = buildPrintableReportHtml();
      downloadGeneratedFile("qams-report.html", htmlReport, "text/html;charset=utf-8");
      showSystemPopup("QAMS report file downloaded. Open it and print to PDF if needed.", "Export", "success");
    });
  }

  const excelBtn = document.getElementById("exportExcelBtn");
  if (excelBtn) {
    excelBtn.addEventListener("click", () => {
      const rows = [
        ["Type", "Title", "Status", "Faculty", "Year"],
        ...qamsData.documents.map((doc) => ["Document", doc.title, doc.status, doc.faculty, doc.academicYear]),
        ...qamsData.kpis.map((kpi) => ["KPI", kpi.name, kpi.status, kpi.responsibleUnit, kpi.period])
      ];
      const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      downloadGeneratedFile("qams-report.csv", csv, "text/csv;charset=utf-8;");
      showSystemPopup("QAMS CSV report downloaded.", "Export", "success");
    });
  }

  const addUserBtn = document.getElementById("addUserBtn");
  if (addUserBtn) {
    addUserBtn.addEventListener("click", () => {
      const nextId = qamsData.users.length + 1;
      const username = `faculty${nextId}`;
      qamsData.users.push({
        id: nextId,
        name: `Faculty User ${nextId}`,
        email: `${username}@university.ac.id`,
        username,
        password: "123456",
        role: "Faculty Staff",
        faculty: "Fakultas Teknik",
        studyProgram: "Teknik Informatika",
        status: "Active",
        lastLogin: "Just now"
      });
      saveQamsData();
      renderUserManagement();
      showSystemPopup("Demo user successfully added.", "Sukses", "success");
    });
  }

  const resetDemoDataBtn = document.getElementById("resetDemoDataBtn");
  if (resetDemoDataBtn) {
    resetDemoDataBtn.addEventListener("click", async () => {
      const confirmed = await showSystemConfirm("Reset all demo data to the original prototype state?", "Konfirmasi reset");
      if (!confirmed) return;

      resetQamsData();
      app.currentUser = qamsData.users.find((user) => user.username === app.currentUser?.username) || app.currentUser;
      renderApp();
      showSection("dashboardSection");
      showSystemPopup("Demo data has been reset.", "Sukses", "success");
    });
  }
}

function bindNotificationActions() {
  const notificationTable = document.getElementById("notificationTableBody");
  if (notificationTable) {
    notificationTable.addEventListener("click", (event) => {
      const row = event.target.closest("tr[data-notification-id]");
      if (!row) return;
      const id = Number(row.dataset.notificationId);
      const item = qamsData.notifications.find((entry, index) => (entry.id ?? index + 1) === id);
      if (!item) return;
      item.status = "Read";
      saveQamsData();
      renderNotifications();
    });
  }
}

function renderAuditManagement() {
  const table = document.getElementById("auditTableContainer");
  if (!table) return;
  const audits = Array.isArray(qamsData.audits) ? qamsData.audits : [];
  table.innerHTML = `
    <table class="table table-hover align-middle mb-0">
      <thead>
        <tr>
          <th>Audit ID</th>
          <th>Title</th>
          <th>Faculty / Study Program</th>
          <th>Auditor</th>
          <th>Audit Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${audits.map((audit) => `
          <tr>
            <td>${audit.id}</td>
            <td>${audit.title}</td>
            <td>${audit.faculty}<br><small class="text-muted">${audit.studyProgram}</small></td>
            <td>${audit.auditor}</td>
            <td>${audit.auditDate}</td>
            <td><span class="status-badge status-${toStatusClass(audit.status)}">${audit.status}</span></td>
            <td>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-light" type="button" data-audit-action="edit" data-audit-id="${audit.id}"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-light" type="button" data-audit-action="complete" data-audit-id="${audit.id}"><i class="bi bi-check2-square"></i></button>
                <button class="btn btn-light" type="button" data-audit-action="delete" data-audit-id="${audit.id}"><i class="bi bi-trash"></i></button>
              </div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderFindingManagement() {
  const table = document.getElementById("findingTableContainer");
  if (!table) return;
  const findings = Array.isArray(qamsData.findings) ? qamsData.findings : [];
  table.innerHTML = `
    <table class="table table-hover align-middle mb-0">
      <thead>
        <tr>
          <th>Finding ID</th>
          <th>Audit ID</th>
          <th>Category</th>
          <th>Severity</th>
          <th>Responsible Unit</th>
          <th>Deadline</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${findings.map((finding) => `
          <tr>
            <td>${finding.id}</td>
            <td>${finding.auditId}</td>
            <td>${finding.category}</td>
            <td>${finding.severity}</td>
            <td>${finding.responsibleUnit}</td>
            <td>${finding.deadline}</td>
            <td><span class="status-badge status-${toStatusClass(finding.status)}">${finding.status}</span></td>
            <td>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-light" type="button" data-finding-action="edit" data-finding-id="${finding.id}"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-light" type="button" data-finding-action="resolve" data-finding-id="${finding.id}"><i class="bi bi-check2"></i></button>
                <button class="btn btn-light" type="button" data-finding-action="delete" data-finding-id="${finding.id}"><i class="bi bi-trash"></i></button>
              </div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderFollowUpManagement() {
  const list = document.getElementById("followUpList");
  if (!list) return;
  const followUps = Array.isArray(qamsData.followUps) ? qamsData.followUps : [];
  list.innerHTML = followUps.map((item) => `
    <div class="col-lg-4">
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <h3 class="h5 mb-0">${item.id}</h3>
            <span class="status-badge status-${toStatusClass(item.status)}">${item.status}</span>
          </div>
          <p class="fw-semibold mb-2">${item.finding}</p>
          <p class="text-muted small mb-3">${item.action}</p>
          <div class="mb-2"><strong>Responsible:</strong> ${item.responsible}</div>
          <div class="mb-2"><strong>Target:</strong> ${item.targetDate}</div>
          <div class="mb-2"><strong>Evidence:</strong> ${item.evidence}</div>
          <div class="mb-2"><strong>Verification:</strong> ${item.verification}</div>
          <div class="mt-3">
            <div class="d-flex justify-content-between small text-muted mb-1">
              <span>Progress</span>
              <span>${item.progress}%</span>
            </div>
            <div class="progress"><div class="progress-bar bg-success" style="width: ${item.progress}%"></div></div>
          </div>
          <div class="btn-group btn-group-sm mt-3 w-100">
            <button class="btn btn-light" type="button" data-followup-action="edit" data-followup-id="${item.id}"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-light" type="button" data-followup-action="close" data-followup-id="${item.id}"><i class="bi bi-check2-circle"></i></button>
            <button class="btn btn-light" type="button" data-followup-action="delete" data-followup-id="${item.id}"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

function renderNotifications() {
  const notifications = Array.isArray(qamsData.notifications) ? qamsData.notifications : [];
  const normalizedNotifications = notifications.map((item, index) => ({ ...item, id: item.id ?? index + 1 }));
  qamsData.notifications = normalizedNotifications;

  const unreadCount = normalizedNotifications.filter((n) => n.status === "Unread").length;
  const badge = document.getElementById("notificationBadge");
  if (badge) badge.textContent = unreadCount;

  const table = document.getElementById("notificationTableBody");
  if (!table) return;

  table.innerHTML = normalizedNotifications.map((item) => `
    <tr data-notification-id="${item.id}">
      <td><strong>${item.title}</strong></td>
      <td>${item.description}</td>
      <td>${item.module}</td>
      <td>${item.date}</td>
      <td><span class="status-badge status-${item.status === "Unread" ? "open" : "validated"}">${item.status}</span></td>
    </tr>
  `).join("");
}

function renderReports() {
  const docs = Array.isArray(qamsData.documents) ? qamsData.documents : [];
  const kpis = Array.isArray(qamsData.kpis) ? qamsData.kpis : [];
  const audits = Array.isArray(qamsData.audits) ? qamsData.audits : [];
  const findings = Array.isArray(qamsData.findings) ? qamsData.findings : [];
  const followUps = Array.isArray(qamsData.followUps) ? qamsData.followUps : [];

  const documentSummary = {
    total: docs.length,
    validated: docs.filter((d) => d.status === "Validated").length,
    review: docs.filter((d) => ["Under Review", "Submitted"].includes(d.status)).length,
    rejected: docs.filter((d) => d.status === "Rejected").length
  };

  const avgKpi = kpis.length ? (kpis.reduce((sum, item) => sum + Number(item.achievement || 0), 0) / kpis.length).toFixed(1) : "0.0";
  const achievedKpi = kpis.filter((item) => ["Excellent", "Achieved"].includes(item.status)).length;
  const openFindings = findings.filter((item) => ["Open", "In Progress"].includes(item.status)).length;
  const inProgressFollowUps = followUps.filter((item) => ["Open", "In Progress"].includes(item.status)).length;

  const cards = [
    { title: "Document Report", text: `Total documents: ${documentSummary.total} | Validated: ${documentSummary.validated} | Review: ${documentSummary.review} | Rejected: ${documentSummary.rejected}`, accent: "primary" },
    { title: "KPI Report", text: `Average achievement: ${avgKpi}% | ${achievedKpi} unit(s) achieved target.`, accent: "success" },
    { title: "Audit Report", text: `${audits.length} audits tracked | ${openFindings} findings open | ${inProgressFollowUps} follow-ups in progress`, accent: "warning" },
    { title: "Quality Assurance Report", text: "Overall QA status is stable with focus on documentation completeness and follow-up closure.", accent: "danger" }
  ];

  const reportCards = document.getElementById("reportCards");
  if (!reportCards) return;

  reportCards.innerHTML = cards.map((card) => `
    <div class="col-md-6 col-xl-3">
      <div class="report-card border-${card.accent}">
        <div class="d-flex justify-content-between align-items-center">
          <span class="badge bg-${card.accent}-subtle text-${card.accent}">Report</span>
        </div>
        <h3>${card.title}</h3>
        <p class="text-muted mb-0">${card.text}</p>
      </div>
    </div>
  `).join("");
}

function renderSearchArchive() {
  const input = document.getElementById("globalSearchInput");
  const categoryFilter = document.getElementById("globalCategoryFilter");
  const facultyFilter = document.getElementById("globalFacultyFilter");
  const statusFilter = document.getElementById("globalStatusFilter");
  const button = document.getElementById("executeGlobalSearch");

  function performSearch() {
    const query = (input ? input.value : "").toLowerCase();
    const category = categoryFilter ? categoryFilter.value : "all";
    const faculty = facultyFilter ? facultyFilter.value : "all";
    const status = statusFilter ? statusFilter.value : "all";

    const allItems = [
      ...qamsData.documents.map((d) => ({ type: "Document", title: d.title, faculty: d.faculty, status: d.status, year: d.academicYear })),
      ...qamsData.kpis.map((k) => ({ type: "KPI", title: k.name, faculty: k.responsibleUnit, status: k.status, year: k.period })),
      ...qamsData.audits.map((a) => ({ type: "Audit", title: a.title, faculty: a.faculty, status: a.status, year: a.auditDate })),
      ...qamsData.findings.map((f) => ({ type: "Finding", title: f.description, faculty: f.responsibleUnit, status: f.status, year: "2025/2026" }))
    ];

    const results = allItems.filter((item) => {
      const matchesQuery = !query || item.title.toLowerCase().includes(query) || item.type.toLowerCase().includes(query);
      const matchesCategory = category === "all" || item.type === category;
      const matchesFaculty = faculty === "all" || item.faculty.includes(faculty);
      const matchesStatus = status === "all" || item.status === status;
      return matchesQuery && matchesCategory && matchesFaculty && matchesStatus;
    });

    const container = document.getElementById("searchResults");
    if (!results.length) {
      container.innerHTML = `<div class="col-12"><div class="empty-state">No matching records</div></div>`;
      return;
    }

    container.innerHTML = results.map((item) => `
      <div class="col-lg-4 col-md-6">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="badge bg-primary-subtle text-primary">${item.type}</span>
              <span class="status-badge status-${toStatusClass(item.status)}">${item.status}</span>
            </div>
            <h3 class="h5">${item.title}</h3>
            <div class="small text-muted">Faculty: ${item.faculty}</div>
            <div class="small text-muted">Year: ${item.year}</div>
          </div>
        </div>
      </div>
    `).join("");
  }

  if (button) button.onclick = performSearch;
  [input, categoryFilter, facultyFilter, statusFilter].forEach((field) => {
    if (field) field.addEventListener("input", performSearch);
    if (field) field.addEventListener("change", performSearch);
  });

  performSearch();
}

function renderUserManagement() {
  document.getElementById("userTableBody").innerHTML = qamsData.users.map((user) => `
    <tr>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.username}</td>
      <td>${user.role}</td>
      <td>${user.faculty}</td>
      <td>${user.studyProgram}</td>
      <td><span class="status-badge status-${user.status === "Active" ? "validated" : "archived"}">${user.status}</span></td>
      <td>${user.lastLogin}</td>
    </tr>
  `).join("");
}

function renderProfile() {
  const user = app.currentUser;
  document.getElementById("profileAvatar").textContent = user.name.charAt(0).toUpperCase();
  document.getElementById("profileName").textContent = user.name;
  document.getElementById("profileRole").textContent = user.role;
  document.getElementById("profileFullName").value = user.name;
  document.getElementById("profileEmail").value = user.email;
  document.getElementById("profileUsername").value = user.username;
  document.getElementById("profileFaculty").value = user.faculty;
}

function renderSystemSettings() {
  const settings = qamsData.systemSettings || {};
  const institutionName = document.getElementById("institutionName");
  const qualityAssuranceCycle = document.getElementById("qualityAssuranceCycle");
  const reviewDeadline = document.getElementById("reviewDeadline");
  const sendDocumentAlert = document.getElementById("sendDocumentAlert");
  const autoReminder = document.getElementById("autoReminder");
  const auditEscalation = document.getElementById("auditEscalation");

  if (institutionName) institutionName.value = settings.institutionName || "Universitas Teknologi Bandung";
  if (qualityAssuranceCycle) qualityAssuranceCycle.value = settings.qualityAssuranceCycle || "2025/2026";
  if (reviewDeadline) reviewDeadline.value = settings.reviewDeadline || "2026-10-20";
  if (sendDocumentAlert) sendDocumentAlert.checked = settings.sendDocumentAlert !== false;
  if (autoReminder) autoReminder.checked = settings.autoReminder !== false;
  if (auditEscalation) auditEscalation.checked = settings.auditEscalation !== false;
}

function bindProfileActions() {
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  if (!saveProfileBtn) return;

  saveProfileBtn.addEventListener("click", async () => {
    const fullName = document.getElementById("profileFullName").value.trim();
    const email = document.getElementById("profileEmail").value.trim();
    const username = document.getElementById("profileUsername").value.trim();
    const faculty = document.getElementById("profileFaculty").value.trim();

    if (!fullName || !email || !username || !faculty) {
      showSystemPopup("Semua field profil harus diisi.", "Required", "warning");
      return;
    }

    const user = qamsData.users.find((item) => item.id === app.currentUser.id);
    if (!user) return;

    const updatedUser = { ...user, name: fullName, email, username, faculty, lastLogin: new Date().toISOString().slice(0, 16).replace("T", " ") };
    try {
      await persistCollectionToApi("users", "PUT", updatedUser, updatedUser.id);
    } catch (error) {
      console.warn("Profile update failed on API, keeping local sync only.", error);
    }

    const userIndex = qamsData.users.findIndex((item) => item.id === updatedUser.id);
    if (userIndex >= 0) {
      qamsData.users[userIndex] = updatedUser;
    }

    app.currentUser = { ...updatedUser };
    localStorage.setItem("qamsUser", JSON.stringify(app.currentUser));
    saveQamsData();
    renderApp();
    showSection("profileSection");
    showSystemPopup("Profil berhasil diperbarui.", "Sukses", "success");
  });
}

function bindSettingsActions() {
  const saveSettingsBtn = document.getElementById("saveSettingsBtn");
  if (!saveSettingsBtn) return;

  saveSettingsBtn.addEventListener("click", async () => {
    const settings = qamsData.systemSettings || {};

    const nextSettings = {
      ...settings,
      institutionName: document.getElementById("institutionName").value.trim() || "Universitas Teknologi Bandung",
      qualityAssuranceCycle: document.getElementById("qualityAssuranceCycle").value.trim() || "2025/2026",
      reviewDeadline: document.getElementById("reviewDeadline").value || "2026-10-20",
      sendDocumentAlert: document.getElementById("sendDocumentAlert").checked,
      autoReminder: document.getElementById("autoReminder").checked,
      auditEscalation: document.getElementById("auditEscalation").checked
    };

    try {
      await persistCollectionToApi("system-settings", "PUT", nextSettings, "settings");
    } catch (error) {
      console.warn("Settings update failed on API, keeping local sync only.", error);
    }

    qamsData.systemSettings = nextSettings;
    saveQamsData();
    renderSystemSettings();
    showSystemPopup("Pengaturan sistem berhasil disimpan.", "Sukses", "success");
  });
}

function averageAchievement() {
  const avg = qamsData.kpis.reduce((sum, kpi) => sum + Number(kpi.achievement), 0) / qamsData.kpis.length;
  return avg.toFixed(1);
}

function toStatusClass(status) {
  const map = {
    Draft: "draft",
    Submitted: "submitted",
    "Under Review": "under-review",
    Validated: "validated",
    Rejected: "rejected",
    Archived: "archived",
    Planned: "planned",
    Scheduled: "scheduled",
    "In Progress": "in-progress",
    Completed: "completed",
    "Follow-Up": "follow-up",
    Open: "open",
    Resolved: "resolved",
    Verified: "verified",
    Closed: "closed",
    Excellent: "excellent",
    Achieved: "achieved",
    "Partially Achieved": "partially-achieved",
    "Not Achieved": "not-achieved",
    Revision: "under-review",
    "Under Review": "under-review",
    Reviewed: "validated"
  };

  return map[status] || "draft";
}

function renderChart(canvasId, type, config) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (app.charts[canvasId]) {
    app.charts[canvasId].destroy();
  }

  const baseDataset = config.datasets.map((dataset, index) => ({
    ...dataset,
    borderWidth: dataset.borderWidth ?? 0,
    borderColor: dataset.borderColor ?? "rgba(255,255,255,0.9)",
    borderRadius: dataset.borderRadius ?? (type === "bar" ? 10 : 0),
    borderSkipped: dataset.borderSkipped ?? false,
    tension: dataset.tension ?? 0.3,
    fill: dataset.fill ?? false,
    backgroundColor: dataset.backgroundColor ?? ["#2a6df6", "#60a5fa", "#34d399", "#fbbf24", "#f87171"][index % 5]
  }));

  app.charts[canvasId] = new Chart(canvas, {
    type,
    data: {
      labels: config.labels,
      datasets: baseDataset
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 800,
        easing: "easeOutQuart"
      },
      layout: {
        padding: 8
      },
      plugins: {
        legend: {
          display: type !== "bar",
          position: "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 10,
            boxHeight: 10,
            color: "#475467",
            padding: 16,
            font: {
              weight: "600"
            }
          }
        },
        tooltip: {
          backgroundColor: "#0f2a52",
          titleColor: "#ffffff",
          bodyColor: "#eaf2ff",
          borderColor: "rgba(255,255,255,0.08)",
          borderWidth: 1,
          displayColors: true,
          padding: 10
        }
      },
      scales: type === "bar" ? {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: "#475467",
            font: {
              weight: "600"
            }
          }
        },
        y: {
          beginAtZero: true,
          max: 120,
          grid: {
            color: "rgba(148, 163, 184, 0.18)",
            drawBorder: false
          },
          ticks: {
            color: "#475467",
            font: {
              weight: "600"
            }
          }
        }
      } : {
        r: {
          grid: {
            color: "rgba(148, 163, 184, 0.25)"
          },
          pointLabels: {
            color: "#475467",
            font: {
              weight: "600"
            }
          },
          ticks: {
            display: false
          }
        }
      }
    }
  });
}

