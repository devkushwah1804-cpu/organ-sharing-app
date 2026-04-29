/* ============================================================
   ORGAN SHARING — DONOR & FINDER APPLICATION
   Main JavaScript | Dev Kushwah
   ============================================================ */

'use strict';

/* ---- Sample Donor Data ---- */
const DONORS = [
  { id: 1, name: 'Ramesh Sharma',    age: 34, blood: 'O+',  city: 'Delhi',     organs: ['Kidney'],         contact: '9XXXXXXXXX', available: true,  urgency: 'Normal'  },
  { id: 2, name: 'Priya Mehta',      age: 28, blood: 'A+',  city: 'Mumbai',    organs: ['Liver','Cornea'], contact: '9XXXXXXXXX', available: true,  urgency: 'Urgent'  },
  { id: 3, name: 'Anil Gupta',       age: 45, blood: 'B+',  city: 'Jaipur',    organs: ['Kidney'],         contact: '9XXXXXXXXX', available: false, urgency: 'Normal'  },
  { id: 4, name: 'Sunita Patel',     age: 31, blood: 'AB+', city: 'Ahmedabad', organs: ['Cornea','Heart'], contact: '9XXXXXXXXX', available: true,  urgency: 'Critical'},
  { id: 5, name: 'Vikram Singh',     age: 39, blood: 'O-',  city: 'Delhi',     organs: ['Kidney','Liver'], contact: '9XXXXXXXXX', available: true,  urgency: 'Normal'  },
  { id: 6, name: 'Kavita Joshi',     age: 26, blood: 'A-',  city: 'Pune',      organs: ['Cornea'],         contact: '9XXXXXXXXX', available: true,  urgency: 'Normal'  },
  { id: 7, name: 'Rohit Yadav',      age: 52, blood: 'B-',  city: 'Lucknow',   organs: ['Kidney'],         contact: '9XXXXXXXXX', available: false, urgency: 'Urgent'  },
  { id: 8, name: 'Anjali Das',       age: 22, blood: 'O+',  city: 'Kolkata',   organs: ['Liver','Kidney'], contact: '9XXXXXXXXX', available: true,  urgency: 'Normal'  },
  { id: 9, name: 'Mohan Trivedi',    age: 48, blood: 'AB-', city: 'Bhopal',    organs: ['Lungs'],          contact: '9XXXXXXXXX', available: true,  urgency: 'Critical'},
  { id:10, name: 'Shweta Kapoor',    age: 35, blood: 'A+',  city: 'Mumbai',    organs: ['Kidney','Cornea'],contact: '9XXXXXXXXX', available: true,  urgency: 'Normal'  },
  { id:11, name: 'Deepak Malhotra',  age: 41, blood: 'B+',  city: 'Chennai',   organs: ['Heart'],          contact: '9XXXXXXXXX', available: true,  urgency: 'Critical'},
  { id:12, name: 'Pooja Verma',      age: 29, blood: 'O+',  city: 'Hyderabad', organs: ['Liver'],          contact: '9XXXXXXXXX', available: false, urgency: 'Normal'  },
];

const ADMIN_REQUESTS = [
  { id: 'REQ001', donor: 'Ramesh Sharma',   recipient: 'Arjun K.',  organ: 'Kidney', blood: 'O+',  status: 'approved' },
  { id: 'REQ002', donor: 'Priya Mehta',     recipient: 'Seema L.',  organ: 'Liver',  blood: 'A+',  status: 'pending'  },
  { id: 'REQ003', donor: 'Sunita Patel',    recipient: 'Ravi M.',   organ: 'Cornea', blood: 'AB+', status: 'matched'  },
  { id: 'REQ004', donor: 'Vikram Singh',    recipient: 'Nisha P.',  organ: 'Kidney', blood: 'O-',  status: 'pending'  },
  { id: 'REQ005', donor: 'Anjali Das',      recipient: 'Komal T.',  organ: 'Liver',  blood: 'O+',  status: 'approved' },
];

/* ---- State ---- */
let filteredDonors = [...DONORS];
let activeTab = 'donor';   // donor | finder

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    document.querySelector('.scroll-top')?.classList.toggle('visible', window.scrollY > 400);
  });

  hamburger?.addEventListener('click', () => {
    navMobile?.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !navMobile?.contains(e.target)) {
      navMobile?.classList.remove('open');
    }
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: .4 });

  sections.forEach(s => observer.observe(s));
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCounter(el, target) {
  let start = 0;
  const duration = 1800;
  const increment = target / (duration / 16);
  const suffix = el.dataset.suffix || '';
  const timer = setInterval(() => {
    start = Math.min(start + increment, target);
    el.textContent = Math.floor(start).toLocaleString('en-IN') + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, +entry.target.dataset.count);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .5 });
  counters.forEach(c => observer.observe(c));
}

/* ============================================================
   FADE-UP ANIMATIONS
   ============================================================ */
function initFadeUp() {
  const els = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });
  els.forEach(el => observer.observe(el));
}

/* ============================================================
   DONOR REGISTRATION FORM
   ============================================================ */
function initRegisterForm() {
  const tabs = document.querySelectorAll('.tab-btn');
  const donorFields = document.getElementById('donorFields');
  const finderFields = document.getElementById('finderFields');
  const formTitle = document.getElementById('formTitle');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.tab;
      if (activeTab === 'donor') {
        donorFields?.classList.remove('hidden');
        finderFields?.classList.add('hidden');
        formTitle.textContent = 'Donor Registration';
      } else {
        donorFields?.classList.add('hidden');
        finderFields?.classList.remove('hidden');
        formTitle.textContent = 'Finder / Recipient Registration';
      }
    });
  });

  const form = document.getElementById('registerForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const organs = [...form.querySelectorAll('input[name="organ"]:checked')].map(c => c.value);
    data.organs = organs;
    data.id = Date.now();
    data.available = true;

    if (activeTab === 'donor') {
      DONORS.push({ ...data, age: +data.age });
      showToast('✅ Donor registered successfully! Awaiting admin verification.', 'success');
    } else {
      showToast('✅ Finder request submitted! Admin will contact you soon.', 'success');
    }

    form.reset();
    refreshDonorGrid();

    // Switch to search tab
    setTimeout(() => {
      document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  });
}

/* ============================================================
   SEARCH & FILTER
   ============================================================ */
function initSearch() {
  const searchInput  = document.getElementById('searchInput');
  const bloodFilter  = document.getElementById('bloodFilter');
  const organFilter  = document.getElementById('organFilter');
  const cityFilter   = document.getElementById('cityFilter');
  const availFilter  = document.getElementById('availFilter');
  const searchBtn    = document.getElementById('searchBtn');
  const clearBtn     = document.getElementById('clearSearch');

  function applyFilters() {
    const q     = searchInput?.value.trim().toLowerCase() || '';
    const blood = bloodFilter?.value || '';
    const organ = organFilter?.value || '';
    const city  = cityFilter?.value.toLowerCase() || '';
    const avail = availFilter?.value || '';

    filteredDonors = DONORS.filter(d => {
      const matchQ     = !q     || d.name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q);
      const matchBlood = !blood || d.blood === blood;
      const matchOrgan = !organ || d.organs.includes(organ);
      const matchCity  = !city  || d.city.toLowerCase().includes(city);
      const matchAvail = !avail || (avail === 'yes' ? d.available : !d.available);
      return matchQ && matchBlood && matchOrgan && matchCity && matchAvail;
    });

    renderDonors();
  }

  searchBtn?.addEventListener('click', applyFilters);
  searchInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyFilters(); });
  bloodFilter?.addEventListener('change', applyFilters);
  organFilter?.addEventListener('change', applyFilters);
  cityFilter?.addEventListener('input', applyFilters);
  availFilter?.addEventListener('change', applyFilters);
  clearBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (bloodFilter) bloodFilter.value = '';
    if (organFilter) organFilter.value = '';
    if (cityFilter)  cityFilter.value  = '';
    if (availFilter) availFilter.value = '';
    filteredDonors = [...DONORS];
    renderDonors();
  });
}

function renderDonors() {
  const grid = document.getElementById('donorsGrid');
  const countEl = document.getElementById('resultsCount');
  if (!grid) return;

  if (countEl) countEl.innerHTML = `Showing <span>${filteredDonors.length}</span> of <span>${DONORS.length}</span> donors`;

  if (filteredDonors.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--mid)">
        <div style="font-size:3rem;margin-bottom:16px">🔍</div>
        <h3 style="margin-bottom:8px;color:var(--slate)">No donors found</h3>
        <p>Try adjusting your search filters</p>
      </div>`;
    return;
  }

  grid.innerHTML = filteredDonors.map(d => `
    <div class="donor-card fade-up">
      <div class="card-accent"></div>
      <div class="donor-header">
        <div class="donor-avatar">${d.name.charAt(0)}</div>
        <div class="donor-name-block">
          <h4>${d.name}</h4>
          <p>Age: ${d.age} • ${d.urgency || 'Normal'}</p>
        </div>
      </div>
      <div class="donor-tags">
        <span class="tag tag-blood">🩸 ${d.blood}</span>
        ${d.organs.map(o => `<span class="tag tag-organ">🫀 ${o}</span>`).join('')}
        <span class="tag tag-city">📍 ${d.city}</span>
        <span class="tag tag-avail" style="${d.available ? '' : 'background:rgba(120,120,120,.1);color:var(--mid)'}">${d.available ? '✅ Available' : '⏸ Unavailable'}</span>
      </div>
      <div class="donor-meta">
        <div class="meta-item"><strong>Blood Group</strong>${d.blood}</div>
        <div class="meta-item"><strong>City</strong>${d.city}</div>
        <div class="meta-item"><strong>Organs</strong>${d.organs.join(', ')}</div>
        <div class="meta-item"><strong>Status</strong>${d.available ? 'Available' : 'Unavailable'}</div>
      </div>
      <div class="donor-actions">
        <button class="btn btn-primary btn-sm" onclick="sendRequest(${d.id})">📨 Send Request</button>
        <button class="btn btn-ghost btn-sm" onclick="viewProfile(${d.id})">👁 View Profile</button>
      </div>
    </div>
  `).join('');

  initFadeUp();
}

function refreshDonorGrid() {
  filteredDonors = [...DONORS];
  renderDonors();
}

/* ============================================================
   DONOR ACTIONS
   ============================================================ */
function sendRequest(id) {
  const donor = DONORS.find(d => d.id === id);
  if (!donor) return;
  if (!donor.available) {
    showToast('⚠️ This donor is currently unavailable.', 'error');
    return;
  }
  showToast(`📨 Request sent to ${donor.name}! Admin has been notified.`, 'success');
}

function viewProfile(id) {
  const d = DONORS.find(d => d.id === id);
  if (!d) return;

  const modal = document.getElementById('profileModal');
  const body  = document.getElementById('profileModalBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="text-align:center;margin-bottom:28px">
      <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--red-soft),var(--red));display:grid;place-items:center;margin:0 auto 16px;color:#fff;font-family:'Playfair Display',serif;font-size:2rem;font-weight:700">${d.name.charAt(0)}</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:1.5rem;margin-bottom:4px">${d.name}</h2>
      <p style="color:var(--mid)">Organ Donor</p>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;background:var(--cream);padding:20px;border-radius:var(--radius);margin-bottom:20px">
      ${[['Age',d.age],['Blood Group',d.blood],['City',d.city],['Status',d.available?'Available':'Unavailable']].map(([k,v])=>`
        <div>
          <p style="font-size:.78rem;color:var(--mid);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">${k}</p>
          <p style="font-weight:600;color:var(--charcoal)">${v}</p>
        </div>`).join('')}
    </div>
    <div style="margin-bottom:20px">
      <p style="font-size:.84rem;color:var(--mid);margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">Organs Available for Donation</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        ${d.organs.map(o=>`<span class="tag tag-organ" style="font-size:.85rem;padding:6px 14px">🫀 ${o}</span>`).join('')}
      </div>
    </div>
    <div style="background:rgba(30,132,73,.06);border:1px solid rgba(30,132,73,.15);border-radius:var(--radius);padding:14px;margin-bottom:20px;font-size:.84rem;color:var(--green)">
      ℹ️ Contact details will be shared by the admin upon sending a request and receiving approval.
    </div>
    <div style="display:flex;gap:12px;justify-content:center">
      <button class="btn btn-primary" onclick="sendRequest(${d.id});closeModal('profileModal')">📨 Send Request</button>
      <button class="btn btn-ghost" onclick="closeModal('profileModal')">Close</button>
    </div>`;

  openModal('profileModal');
}

/* ============================================================
   MODAL
   ============================================================ */
function openModal(id) {
  document.getElementById(id)?.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});

/* ============================================================
   TOAST
   ============================================================ */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */
function initAdminTable() {
  const tbody = document.getElementById('adminTbody');
  if (!tbody) return;

  function renderTable() {
    tbody.innerHTML = ADMIN_REQUESTS.map(r => `
      <tr>
        <td><code style="font-family:'DM Mono',monospace;font-size:.78rem;opacity:.7">${r.id}</code></td>
        <td>${r.donor}</td>
        <td>${r.recipient}</td>
        <td>${r.organ}</td>
        <td><span class="tag tag-blood">${r.blood}</span></td>
        <td><span class="status-badge ${r.status}">${r.status.toUpperCase()}</span></td>
        <td>
          ${r.status === 'pending' ? `
            <button class="btn btn-sm" style="background:rgba(30,132,73,.2);color:#A9DFBF;border:none;cursor:pointer" onclick="updateStatus('${r.id}','approved')">✓</button>
            <button class="btn btn-sm" style="background:rgba(192,57,43,.2);color:#E8B4B8;border:none;cursor:pointer;margin-left:4px" onclick="updateStatus('${r.id}','rejected')">✗</button>
          ` : '<span style="opacity:.4;font-size:.8rem">—</span>'}
        </td>
      </tr>`).join('');
  }

  renderTable();
  window.updateStatus = function(id, status) {
    const req = ADMIN_REQUESTS.find(r => r.id === id);
    if (req) {
      req.status = status;
      renderTable();
      showToast(`Request ${id} marked as ${status}`, status === 'approved' ? 'success' : 'error');
    }
  };
}

/* ============================================================
   SCROLL TOP
   ============================================================ */
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  btn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.getElementById('navMobile')?.classList.remove('open');
      }
    });
  });
}

/* ============================================================
   STAT METRICS (live-ish)
   ============================================================ */
function updateDashMetrics() {
  const total  = document.getElementById('metricTotal');
  const avail  = document.getElementById('metricAvail');
  const req    = document.getElementById('metricReq');
  const matched = document.getElementById('metricMatched');

  if (total)   total.textContent   = DONORS.length;
  if (avail)   avail.textContent   = DONORS.filter(d => d.available).length;
  if (req)     req.textContent     = ADMIN_REQUESTS.length;
  if (matched) matched.textContent = ADMIN_REQUESTS.filter(r => r.status === 'matched').length;
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCounters();
  initFadeUp();
  initRegisterForm();
  initSearch();
  initAdminTable();
  initScrollTop();
  initSmoothScroll();
  renderDonors();
  updateDashMetrics();
});
