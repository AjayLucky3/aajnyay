document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTheme();
  initTiltEffect();
  initMouseParallax();
  initScrollReveal();
  initParticles();
  initLightTrails();
  initMobileMenu();
  initCinematicBackground();
  initDepthScrollTransitions();
});

/* --- NAVBAR SCROLL STATE --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* --- DARK / LIGHT THEME TOGGLE --- */
function initTheme() {
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  if (!themeToggleBtn) return;
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  themeToggleBtn.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  });
}

/* --- 3D TILT EFFECT WITH SPECULAR GLOWS --- */
function initTiltEffect() {
  document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return; // Disable tilt on mobile
    const card = e.target.closest('.tilt-card');
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate within the element
    const y = e.clientY - rect.top;  // y coordinate within the element
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    const dx = x - xc;
    const dy = y - yc;
    
    // Calculate tilts
    const tiltX = -(dy / yc) * 8; // Max tilt angle: 8deg
    const tiltY = (dx / xc) * 8;
    
    // Apply transforms
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // Update specular reflections cursor coordinates
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  });
  
  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.tilt-card');
    if (!card) return;
    
    // Check if the mouse actually left the card (not just moved to a child element)
    const related = e.relatedTarget;
    if (related && card.contains(related)) return;
    
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
}

/* --- 3D PERSPECTIVE PARALLAX & NETWORK ANIMATOR --- */
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;

function initMouseParallax() {
  const container = document.querySelector('.hero-visualizer');
  const scene = document.querySelector('.scene-3d');
  if (!container || !scene) return;
  
  container.style.perspective = '1500px';
  scene.style.transformStyle = 'preserve-3d';
  
  document.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    // Normalize coordinates from -1 to 1 based on center of visualizer
    targetMouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    targetMouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
  });
  
  container.addEventListener('mouseleave', () => {
    targetMouseX = 0;
    targetMouseY = 0;
  });
  
  // Start the combined animation loop
  animateScene();
}

function animateScene() {
  const container = document.querySelector('.hero-visualizer');
  const scene = document.querySelector('.scene-3d');
  if (!scene) return;
  
  const isMobile = window.innerWidth < 768;
  
  // Eased coordinates (linear interpolation)
  if (isMobile) {
    targetMouseX = 0;
    targetMouseY = 0;
  }
  mouseX += (targetMouseX - mouseX) * 0.08;
  mouseY += (targetMouseY - mouseY) * 0.08;
  
  // Rotate the entire scene in 3D perspective
  const tiltX = isMobile ? 0 : -mouseY * 15; // Max 15 degrees tilt
  const tiltY = isMobile ? 0 : mouseX * 15;
  scene.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  
  // Sinusoidal float timeline
  const time = Date.now() * 0.0012;
  
  const nodesConfig = [
    { selector: '.node-1', delay: 0.0, dist: 12, speed: 2.2 },
    { selector: '.node-2', delay: 1.5, dist: 18, speed: 1.4 },
    { selector: '.node-3', delay: 3.0, dist: -12, speed: 2.8 },
    { selector: '.node-4', delay: 4.5, dist: 22, speed: 1.8 },
    { selector: '.node-5', delay: 0.8, dist: -16, speed: 2.5 },
    { selector: '.node-6', delay: 2.2, dist: 14, speed: 2.0 },
    { selector: '.justice-core-sphere', delay: 2.0, dist: 6, speed: 0.6 },
    { selector: '.scene-3d > img', delay: 1.0, dist: 4, speed: 0.2 } // Floating backdrop image
  ];
  
  const sceneRect = scene.getBoundingClientRect();
  const centerX = sceneRect.width / 2;
  const centerY = sceneRect.height / 2;
  
  nodesConfig.forEach(cfg => {
    const el = scene.querySelector(cfg.selector);
    if (!el) return;
    
    // 1. Calculate floating offset
    const floatY = Math.sin(time * 1.5 + cfg.delay) * cfg.dist;
    
    // 2. Calculate mouse parallax offset
    const px = isMobile ? 0 : mouseX * cfg.speed * 25;
    const py = isMobile ? 0 : mouseY * cfg.speed * 25;
    const pz = isMobile ? 0 : cfg.speed * 25; // Z translation maps depth
    
    // Apply 3D translations
    el.style.transform = `translate3d(${px}px, ${py + floatY}px, ${pz}px)`;
    
    // 3. Update network lines to trace node center points
    if (cfg.selector.startsWith('.node-')) {
      const nodeIndex = cfg.selector.split('-')[1];
      const line = document.getElementById(`line-node-${nodeIndex}`);
      if (line) {
        const nodeRect = el.getBoundingClientRect();
        const xNode = (nodeRect.left + nodeRect.width / 2) - sceneRect.left;
        const yNode = (nodeRect.top + nodeRect.height / 2) - sceneRect.top;
        
        line.setAttribute('x1', centerX);
        line.setAttribute('y1', centerY);
        line.setAttribute('x2', xNode);
        line.setAttribute('y2', yNode);
      }
    }
  });
  
  requestAnimationFrame(animateScene);
}

/* --- SCROLL REVEAL (INTERSECTION OBSERVER) --- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-3d');
  if (revealElements.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -80px 0px'
  });
  
  revealElements.forEach(el => {
    observer.observe(el);
  });
}

/* --- DYNAMIC LIGHT TRAILS --- */
function initLightTrails() {
  const container = document.body;
  if (!container) return;
  
  setInterval(() => {
    if (document.hidden) return;
    
    const trail = document.createElement('div');
    trail.className = 'light-trail';
    
    const startY = Math.random() * window.innerHeight;
    const startX = -150;
    
    trail.style.top = `${startY}px`;
    trail.style.left = `${startX}px`;
    trail.style.opacity = `${0.15 + Math.random() * 0.35}`;
    
    const colors = [
      'rgba(37, 99, 235, 0.4)', // blue
      'rgba(255, 153, 51, 0.4)' // saffron
    ];
    const gradColor = colors[Math.floor(Math.random() * colors.length)];
    trail.style.background = `linear-gradient(90deg, transparent, ${gradColor}, transparent)`;
    
    container.appendChild(trail);
    
    const duration = 4000 + Math.random() * 4000;
    const anim = trail.animate([
      { transform: `translate3d(0, 0, 0)`, left: `${startX}px` },
      { transform: `translate3d(${window.innerWidth + 200}px, ${Math.random() * 100 - 50}px, 0)`, left: `${window.innerWidth}px` }
    ], {
      duration: duration,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    });
    
    anim.onfinish = () => {
      trail.remove();
    };
  }, 2500);
}

/* --- TOAST NOTIFICATIONS --- */
function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Select icon based on type
  let icon = '<i data-lucide="info"></i>';
  if (type === 'success') icon = '<i data-lucide="check-circle"></i>';
  if (type === 'error') icon = '<i data-lucide="alert-triangle"></i>';
  
  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  // Initialize lucide icons for the new toast
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // Remove toast after 4s
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

/* --- BACKGROUND DYNAMIC PARTICLES --- */
function initParticles() {
  const container = document.querySelector('.particle-container');
  if (!container) return;
  
  const count = 30;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position and delay
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 15}s`;
    particle.style.animationDuration = `${10 + Math.random() * 15}s`;
    particle.style.width = `${2 + Math.random() * 4}px`;
    particle.style.height = particle.style.width;
    particle.style.opacity = `${0.1 + Math.random() * 0.4}`;
    
    container.appendChild(particle);
  }
}

/* --- MOBILE NAVIGATION MENU --- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (!hamburger || !navMenu) return;
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });
  
  // Close menu when clicking nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
}

/* --- DYNAMIC MESH GRADIENT & CINEMATIC BACKGROUND CANVAS --- */
function initCinematicBackground() {
  const container = document.querySelector('.bg-mesh-container');
  if (!container) return;
  
  // Prevent double canvas injection if DOM is re-rendered
  if (document.getElementById('bg-cinematic-canvas')) return;
  
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-cinematic-canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  // Set up background translucent bokeh particles
  const particles = [];
  const particleCount = 40;
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -0.12 - Math.random() * 0.2,
      radius: 4 + Math.random() * 16,
      alpha: 0.02 + Math.random() * 0.07,
      speedFactor: 0.015 + Math.random() * 0.035,
      color: Math.random() > 0.45 ? '37, 99, 235' : '255, 153, 51' // sapphire blue or saffron accent
    });
  }
  
  // Slowly morphing fluid mesh gradient blobs
  const blobs = [
    { x: width * 0.15, y: height * 0.25, targetX: width * 0.15, targetY: height * 0.25, r: Math.min(width, height) * 0.5, color: 'rgba(37, 99, 235, 0.07)', angle: 0, speed: 0.0006 },
    { x: width * 0.85, y: height * 0.75, targetX: width * 0.85, targetY: height * 0.75, r: Math.min(width, height) * 0.55, color: 'rgba(255, 153, 51, 0.05)', angle: Math.PI, speed: 0.0004 },
    { x: width * 0.5, y: height * 0.5, targetX: width * 0.5, targetY: height * 0.5, r: Math.min(width, height) * 0.4, color: 'rgba(100, 116, 139, 0.03)', angle: Math.PI / 2, speed: 0.0009 }
  ];
  
  function draw() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw morphing mesh gradient circles
    blobs.forEach((blob) => {
      blob.angle += blob.speed;
      const offsetRadius = Math.min(width, height) * 0.12;
      blob.x = blob.targetX + Math.sin(blob.angle * 2.2) * offsetRadius;
      blob.y = blob.targetY + Math.cos(blob.angle * 1.5) * offsetRadius;
      
      const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
      grad.addColorStop(0, blob.color);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw cinematic volumetric light rays
    const time = Date.now() * 0.0002;
    const rayCount = 4;
    for (let i = 0; i < rayCount; i++) {
      const angle = 0.08 + Math.sin(time * 0.9 + i * 0.8) * 0.07;
      const widthFactor = 0.05 + Math.cos(time * 0.7 + i * 0.5) * 0.015;
      
      const grad = ctx.createRadialGradient(0, 0, 0, width * 0.6, height * 0.6, Math.max(width, height));
      grad.addColorStop(0, `rgba(37, 99, 235, ${0.012 + Math.sin(time * 1.5 + i) * 0.004})`);
      grad.addColorStop(0.5, `rgba(255, 153, 51, ${0.006 + Math.cos(time * 0.9 + i) * 0.002})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const x1 = Math.cos(angle - widthFactor) * width * 1.6;
      const y1 = Math.sin(angle - widthFactor) * height * 1.6;
      const x2 = Math.cos(angle + widthFactor) * width * 1.6;
      const y2 = Math.sin(angle + widthFactor) * height * 1.6;
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.closePath();
      ctx.fill();
    }
    
    // Draw floating bokeh particles
    particles.forEach(p => {
      const dx = targetMouseX * width * p.speedFactor;
      const dy = targetMouseY * height * p.speedFactor;
      
      p.y += p.vy;
      if (p.y < -30) {
        p.y = height + 30;
        p.x = Math.random() * width;
      }
      
      const drawX = p.x + dx;
      const drawY = p.y + dy;
      
      ctx.beginPath();
      const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, p.radius);
      grad.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
      grad.addColorStop(0.8, `rgba(${p.color}, ${p.alpha * 0.25})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = grad;
      ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    
    requestAnimationFrame(draw);
  }
  
  draw();
}

/* --- STEREOSCOPIC CAMERA DEPTH SCROLL TRANSITIONS --- */
function initDepthScrollTransitions() {
  const elements = document.querySelectorAll('.reveal, .reveal-3d');
  if (elements.length === 0) return;
  
  function updateScrollTransforms() {
    const isMobile = window.innerWidth < 768;
    const viewportHeight = window.innerHeight;
    
    elements.forEach(el => {
      if (isMobile) {
        el.style.transform = '';
        return;
      }
      // Do not conflict if mouse is currently hovering over the card
      if (el.matches(':hover')) return;
      
      const rect = el.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      
      // Calculate normalized distance from center of viewport (-1 to 1)
      let dist = (elementCenter - viewportCenter) / viewportCenter;
      dist = Math.max(-1.5, Math.min(1.5, dist));
      
      if (el.classList.contains('active')) {
        if (el.classList.contains('reveal-3d')) {
          // Dynamic scale-down and tilt back as card moves away from center viewport
          const translateZ = -Math.abs(dist) * 90;
          const rotateX = dist * 12;
          const translateY = dist * 20; // Parallax delay
          el.style.transform = `perspective(1200px) translate3d(0, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg)`;
        } else {
          // Standard reveal elements get light scroll offset
          const translateY = dist * 12;
          el.style.transform = `translateY(${translateY}px)`;
        }
      }
    });
  }
  
  window.addEventListener('scroll', updateScrollTransforms, { passive: true });
  window.addEventListener('resize', updateScrollTransforms);
  
  // Initial compute
  setTimeout(updateScrollTransforms, 200);
}

// Export toast function globally
window.showToast = showToast;
