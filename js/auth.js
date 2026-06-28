// AajNyay Frontend Auth Controller
window.AajNyayAuth = {
  user: null,
  isAuthenticated: false,

  // Check state on load
  async checkState() {
    try {
      const response = await fetch('/api/auth/state');
      const data = await response.json();
      
      if (data.authenticated) {
        this.isAuthenticated = true;
        this.user = data.user;
        localStorage.setItem('aajnyay_logged_in_user', JSON.stringify(data.user));
      } else {
        this.isAuthenticated = false;
        this.user = null;
        localStorage.removeItem('aajnyay_logged_in_user');
      }
      this.updateNavbarUI();
      return this.isAuthenticated;
    } catch (e) {
      console.warn('Backend connection failed, falling back to LocalStorage auth');
      const cachedUser = localStorage.getItem('aajnyay_logged_in_user');
      if (cachedUser) {
        this.isAuthenticated = true;
        this.user = JSON.parse(cachedUser);
      } else {
        this.isAuthenticated = false;
        this.user = null;
      }
      this.updateNavbarUI();
      return this.isAuthenticated;
    }
  },

  // Submit Register
  async register(name, email, password) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }
      return data;
    } catch (e) {
      console.warn('Register API failed, running in fallback localstorage mode:', e.message);
      // Fallback local registration
      const users = JSON.parse(localStorage.getItem('aajnyay_users') || '[]');
      if (users.find(u => u.email === email)) {
        window.showToast('Email already registered', 'error');
        throw new Error('Email already registered');
      }
      const newUser = {
        id: users.length + 1,
        name,
        email,
        joined: new Date().toISOString(),
        language: 'en'
      };
      users.push(newUser);
      localStorage.setItem('aajnyay_users', JSON.stringify(users));
      // Auto-log in
      localStorage.setItem('aajnyay_logged_in_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    }
  },

  // Submit Login
  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Login failed');
      }
      
      this.isAuthenticated = true;
      this.user = data.user;
      localStorage.setItem('aajnyay_logged_in_user', JSON.stringify(data.user));
      this.updateNavbarUI();
      window.showToast(`Welcome back, ${this.user.name}!`, 'success');
      return data;
    } catch (e) {
      console.warn('Login API failed, checking local fallback credentials:', e.message);
      const users = JSON.parse(localStorage.getItem('aajnyay_users') || '[]');
      const matchedUser = users.find(u => u.email === email);
      if (!matchedUser) {
        window.showToast('Invalid email or password (or user not registered locally)', 'error');
        throw new Error('Invalid email or password');
      }
      
      this.isAuthenticated = true;
      this.user = matchedUser;
      localStorage.setItem('aajnyay_logged_in_user', JSON.stringify(matchedUser));
      this.updateNavbarUI();
      window.showToast(`Welcome back, ${this.user.name}! (Offline Mode)`, 'success');
      return { success: true, user: matchedUser };
    }
  },

  // Submit Logout
  async logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('API logout failed, performing local logout:', e.message);
    } finally {
      this.isAuthenticated = false;
      this.user = null;
      localStorage.removeItem('aajnyay_logged_in_user');
      this.updateNavbarUI();
      window.showToast('Logged out successfully', 'success');
      setTimeout(() => {
        window.location.href = '/index.html';
      }, 1000);
    }
  },

  // Dynamically update the header links
  updateNavbarUI() {
    const navActions = document.querySelector('.nav-actions');
    const navMenu = document.querySelector('#nav-menu');
    if (!navActions) return;
    
    // Clean old profile items
    const existingProfileBtn = document.querySelector('#nav-profile-btn');
    const existingDashboardLink = document.querySelector('#nav-dash-link');
    if (existingProfileBtn) existingProfileBtn.remove();
    if (existingDashboardLink) existingDashboardLink.remove();
    
    // Find the primary button (usually GPS link)
    const primaryBtn = navActions.querySelector('.btn-primary');
    
    if (this.isAuthenticated) {
      // 1. Add Dashboard to main menu if not present
      if (navMenu && !navMenu.querySelector('a[href="dashboard.html"]')) {
        const li = document.createElement('li');
        li.id = 'nav-dash-link';
        li.innerHTML = `<a href="dashboard.html" class="nav-link">My GPS Dashboard</a>`;
        navMenu.appendChild(li);
      }
      
      // 2. Replace Start GPS btn or append a Profile avatar button
      const profileBtn = document.createElement('div');
      profileBtn.id = 'nav-profile-btn';
      profileBtn.style.position = 'relative';
      profileBtn.innerHTML = `
        <button onclick="toggleProfileMenu(event)" class="btn btn-secondary" style="display:flex; align-items:center; gap:0.5rem; border-color:var(--accent);">
          <i data-lucide="user"></i>
          <span>${this.user.name.split(' ')[0]}</span>
          <i data-lucide="chevron-down" style="width:1rem; height:1rem;"></i>
        </button>
        <div id="profile-dropdown-menu" class="glass-panel" style="display:none; position:absolute; top:3rem; right:0; width:200px; padding:1rem; z-index:1000; box-shadow:0 10px 25px rgba(0,0,0,0.1);">
          <div style="font-size:0.85rem; font-weight:700; color:var(--text-muted); margin-bottom:0.5rem; word-break:break-all;">${this.user.email}</div>
          <hr style="border:0; border-top:1px solid var(--border); margin-bottom:0.5rem;">
          <a href="dashboard.html" style="display:flex; align-items:center; gap:0.5rem; font-size:0.9rem; padding:0.4rem 0; color:var(--text-main);"><i data-lucide="compass" style="width:1rem; height:1rem;"></i> My Legal Journey</a>
          <a href="javascript:window.AajNyayAuth.logout()" style="display:flex; align-items:center; gap:0.5rem; font-size:0.9rem; padding:0.4rem 0; color:#ef4444;"><i data-lucide="log-out" style="width:1rem; height:1rem;"></i> Logout</a>
        </div>
      `;
      navActions.insertBefore(profileBtn, navActions.querySelector('.hamburger') || navActions.lastChild);
      
      // Hide main sign-in or other link if they exist
      if (primaryBtn && (primaryBtn.textContent.includes('Login') || primaryBtn.textContent.includes('Start GPS'))) {
        // Change button to Start GPS if it was showing Login
        primaryBtn.innerHTML = `Start GPS <i data-lucide="navigation" style="width:1rem; height:1rem;"></i>`;
        primaryBtn.setAttribute('href', 'gps.html');
      }
    } else {
      // User is not authenticated
      if (primaryBtn) {
        primaryBtn.innerHTML = `Login / Sign Up <i data-lucide="log-in" style="width:1rem; height:1rem;"></i>`;
        primaryBtn.setAttribute('href', 'login.html');
      }
    }
    
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};

// Global click handler to close dropdown
function toggleProfileMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('profile-dropdown-menu');
  if (menu) {
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  }
}

document.addEventListener('click', () => {
  const menu = document.getElementById('profile-dropdown-menu');
  if (menu) menu.style.display = 'none';
});

// Run state check on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.AajNyayAuth.checkState().then((isAuth) => {
    // If we are on dashboard.html and unauthorized, redirect
    if (window.location.pathname.endsWith('dashboard.html') && !isAuth) {
      window.showToast('Please log in to access your Legal Dashboard', 'error');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1200);
    }
  });
});
