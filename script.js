const STORAGE_KEY = "ai_pribadi_second_brain_ideas";

let ideas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  {
    id: Date.now(),
    title: "AI pengingat belajar",
    category: "Produktivitas",
    description: "Membantu mengingat jadwal belajar dan tugas harian.",
    priority: "Tinggi",
    createdAt: new Date().toLocaleDateString("id-ID")
  }
];

const elements = {
  navItems: document.querySelectorAll(".nav-item"),
  views: {
    dashboard: document.getElementById("dashboardView"),
    addIdea: document.getElementById("addIdeaView"),
    allIdeas: document.getElementById("allIdeasView"),
    projects: document.getElementById("projectsView"),
    notes: document.getElementById("notesView"),
    settings: document.getElementById("settingsView")
  },
  pageTitle: document.getElementById("pageTitle"),
  pageSubtitle: document.getElementById("pageSubtitle"),
  searchInput: document.getElementById("searchInput"),
  ideaForm: document.getElementById("ideaForm"),
  ideasGrid: document.getElementById("ideasGrid"),
  categoryFilter: document.getElementById("categoryFilter"),
  priorityFilter: document.getElementById("priorityFilter"),
  totalIdeas: document.getElementById("totalIdeas"),
  totalProjects: document.getElementById("totalProjects"),
  totalNotes: document.getElementById("totalNotes"),
  recentActivities: document.getElementById("recentActivities"),
  toast: document.getElementById("toast"),
  modal: document.getElementById("modal"),
  modalBody: document.getElementById("modalBody"),
  closeModal: document.getElementById("closeModal")
};

function saveIdeas() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  setTimeout(() => elements.toast.classList.remove("show"), 1800);
}

function setView(viewName) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  Object.values(elements.views).forEach(v => v.classList.remove("active"));

  if (viewName === "dashboard") elements.views.dashboard.classList.add("active");
  if (viewName === "add-idea") elements.views.addIdea.classList.add("active");
  if (viewName === "all-ideas") elements.views.allIdeas.classList.add("active");
  if (viewName === "projects") elements.views.projects.classList.add("active");
  if (viewName === "notes") elements.views.notes.classList.add("active");
  if (viewName === "settings") elements.views.settings.classList.add("active");

  elements.navItems.forEach(btn => btn.classList.toggle("active", btn.dataset.view === viewName));
  const titles = {
    dashboard: ["Dashboard", "Kelola ide, catatan, dan proyekmu di satu tempat."],
    "add-idea": ["Tambah Ide", "Tambahkan ide baru ke second brain."],
    "all-ideas": ["Semua Ide", "Lihat, cari, filter, dan kelola ide."],
    projects: ["Proyek", "Ruang untuk pengembangan proyek."],
    notes: ["Catatan", "Ruang untuk catatan penting."],
    settings: ["Pengaturan", "Atur preferensi aplikasi."]
  };
  elements.pageTitle.textContent = titles[viewName][0];
  elements.pageSubtitle.textContent = titles[viewName][1];
}

function getFilteredIdeas() {
  const keyword = elements.searchInput.value.toLowerCase();
  const category = elements.categoryFilter.value;
  const priority = elements.priorityFilter.value;

  return ideas.filter(idea => {
    const matchesKeyword =
      idea.title.toLowerCase().includes(keyword) ||
      idea.category.toLowerCase().includes(keyword) ||
      idea.description.toLowerCase().includes(keyword);

    const matchesCategory = category === "all" || idea.category === category;
    const matchesPriority = priority === "all" || idea.priority === priority;

    return matchesKeyword && matchesCategory && matchesPriority;
  });
}

function renderCategoryFilter() {
  const categories = [...new Set(ideas.map(i => i.category))];
  const current = elements.categoryFilter.value;

  elements.categoryFilter.innerHTML = `<option value="all">Semua Kategori</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    elements.categoryFilter.appendChild(option);
  });

  elements.categoryFilter.value = categories.includes(current) ? current : "all";
}

function priorityClass(priority) {
  if (priority === "Tinggi") return "priority-high";
  if (priority === "Sedang") return "priority-medium";
  return "priority-low";
}

function renderIdeas() {
  const list = getFilteredIdeas();
  elements.ideasGrid.innerHTML = list.length
    ? list.map(idea => `
      <div class="card">
        <h4>${idea.title}</h4>
        <div class="meta">Kategori: ${idea.category}</div>
        <div class="meta ${priorityClass(idea.priority)}">Prioritas: ${idea.priority}</div>
        <div class="meta">Dibuat: ${idea.createdAt}</div>
        <div class="card-actions">
          <button onclick="viewIdea(${idea.id})">Lihat</button>
          <button onclick="editIdea(${idea.id})">Edit</button>
          <button onclick="deleteIdea(${idea.id})">Hapus</button>
        </div>
      </div>
    `).join("")
    : `<div class="activity-item">Belum ada ide yang cocok dengan filter.</div>`;
}

function renderDashboard() {
  elements.totalIdeas.textContent = ideas.length;
  elements.totalProjects.textContent = "0";
  elements.totalNotes.textContent = "0";

  const recent = [...ideas].slice(-5).reverse();
  elements.recentActivities.innerHTML = recent.length
    ? recent.map(idea => `
      <div class="activity-item">
        <strong>${idea.title}</strong>
        <div class="meta">Ide baru ditambahkan pada ${idea.createdAt}</div>
      </div>
    `).join("")
    : `<div class="activity-item">Belum ada aktivitas.</div>`;
}

function openModal(content) {
  elements.modalBody.innerHTML = content;
  elements.modal.classList.remove("hidden");
}

window.viewIdea = function(id) {
  const idea = ideas.find(i => i.id === id);
  if (!idea) return;
  openModal(`
    <p><strong>Judul:</strong> ${idea.title}</p>
    <p><strong>Kategori:</strong> ${idea.category}</p>
    <p><strong>Prioritas:</strong> ${idea.priority}</p>
    <p><strong>Tanggal:</strong> ${idea.createdAt}</p>
    <p><strong>Deskripsi:</strong><br />${idea.description}</p>
  `);
};

window.editIdea = function(id) {
  const idea = ideas.find(i => i.id === id);
  if (!idea) return;

  document.getElementById("ideaTitle").value = idea.title;
  document.getElementById("ideaCategory").value = idea.category;
  document.getElementById("ideaDescription").value = idea.description;
  document.getElementById("ideaPriority").value = idea.priority;

  ideas = ideas.filter(i => i.id !== id);
  saveIdeas();
  renderCategoryFilter();
  renderIdeas();
  renderDashboard();
  setView("add-idea");
  showToast("Ide siap diedit. Silakan simpan kembali.");
};

window.deleteIdea = function(id) {
  const idea = ideas.find(i => i.id === id);
  if (!idea) return;
  if (!confirm(`Hapus ide "${idea.title}"?`)) return;

  ideas = ideas.filter(i => i.id !== id);
  saveIdeas();
  renderCategoryFilter();
  renderIdeas();
  renderDashboard();
  showToast("Ide berhasil dihapus.");
};

elements.navItems.forEach(btn => {
  btn.addEventListener("click", () => setView(btn.dataset.view));
});

elements.ideaForm.addEventListener("submit", e => {
  e.preventDefault();

  const newIdea = {
    id: Date.now(),
    title: document.getElementById("ideaTitle").value.trim(),
    category: document.getElementById("ideaCategory").value.trim(),
    description: document.getElementById("ideaDescription").value.trim(),
    priority: document.getElementById("ideaPriority").value,
    createdAt: new Date().toLocaleDateString("id-ID")
  };

  ideas.push(newIdea);
  saveIdeas();
  elements.ideaForm.reset();
  renderCategoryFilter();
  renderIdeas();
  renderDashboard();
  showToast("Ide berhasil disimpan.");
  setView("all-ideas");
});

elements.searchInput.addEventListener("input", renderIdeas);
elements.categoryFilter.addEventListener("change", renderIdeas);
elements.priorityFilter.addEventListener("change", renderIdeas);

elements.closeModal.addEventListener("click", () => elements.modal.classList.add("hidden"));
elements.modal.addEventListener("click", e => {
  if (e.target === elements.modal) elements.modal.classList.add("hidden");
});

renderCategoryFilter();
renderIdeas();
renderDashboard();
setView("dashboard");
