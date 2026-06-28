// AajNyay AI Legal Navigator (Dialogue Manager)
const categoryKeywords = {
  'upi-fraud': ['upi', 'paytm', 'gpay', 'phonepe', 'bank', 'fraud', 'money lost', 'transaction', 'scam', 'sent money'],
  'salary-unpaid': ['salary', 'unpaid', 'salary delay', 'boss', 'company dues', 'hr', 'wages', 'employment payment'],
  'consumer-complaint': ['amazon', 'flipkart', 'product defect', 'refund', 'warranty', 'service delay', 'defect', 'bought', 'mrp'],
  'rental-deposit': ['rent', 'landlord', 'tenant', 'deposit', 'flat', 'agreement', 'owner', 'lease', 'eviction'],
  'workplace-harassment': ['harass', 'office abuse', 'bullying', 'posh', 'icc', 'boss treat', 'workplace'],
  'property-dispute': ['land', 'mutation', 'deed', 'property', 'plot', 'encroachment', 'builder', 'flat delay', 'ancestral'],
  'cyberbullying': ['harass online', 'troll', 'leaking photos', 'blackmail', 'instagram profile', 'whatsapp abuse', 'cyber bullying'],
  'domestic-violence': ['abuse home', 'wife', 'husband', 'physical violence', 'threat home', 'domestic', 'beating'],
  'lost-documents': ['lost passport', 'lost aadhaar', 'lost pan', 'lost deed', 'missing certificates'],
  'fake-loan-apps': ['loan app', 'loan blackmail', 'morph photo', 'extortion app', 'cash loan', 'recovery agent']
};

const dialogueTemplates = {
  'upi-fraud': {
    questions: [
      'Did you share your UPI PIN, OTP, or click any link sent via SMS/Email?',
      'When did the transaction take place? (Within 24 hours, 1-3 days, or longer?)',
      'What is the total amount lost and do you have the transaction ID?'
    ],
    generatePlan: (inputs) => ({
      title: 'UPI Fraud Action Plan',
      urgency: inputs[1].toLowerCase().includes('24') ? 'High' : 'Medium',
      rights: 'Right to Zero Liability under RBI guidelines for unauthorized electronic transactions reported within 3 days.',
      laws: 'Section 66D of the Information Technology Act, 2000 (Cheating by Personation) & Section 420 of IPC.',
      documents: 'Bank Statement showing debit, SMS alerts, UPI transaction ID screenshot, and a written dispute letter.',
      authorities: 'National Cyber Crime Bureau (cybercrime.gov.in) and your Bank Home Branch Manager.',
      steps: [
        'Call 1930 immediately to block/freeze the fraudster\'s account.',
        'File an online complaint at cybercrime.gov.in and save the PDF acknowledgement.',
        'Submit the cyber complaint slip and written dispute to your bank branch within 3 days.'
      ]
    })
  },
  'salary-unpaid': {
    questions: [
      'What is your employment type (Permanent/Contractual) and do you have a signed offer letter?',
      'How many months of salary are outstanding and have you sent written reminders?',
      'Is the company actively functioning, or are they shutting down / ignoring you?'
    ],
    generatePlan: (inputs) => ({
      title: 'Salary Recovery Plan',
      urgency: 'Medium',
      rights: 'Right to timely payment under the Payment of Wages Act, 1872 and Contractual terms.',
      laws: 'Payment of Wages Act, 1936 & Section 70 of the Indian Contract Act, 1872.',
      documents: 'Appointment/Offer Letter, Bank Statements showing non-payment, and printouts of emails sent to HR.',
      authorities: 'Office of the Labor Commissioner (Conciliation Office) or Civil Court.',
      steps: [
        'Send a formal Demand Letter (Legal Notice) to the company demanding dues within 15 days.',
        'If unresolved, file a conciliation case with the Local Labor Commissioner office.',
        'File a money recovery summary suit under Order 37 of CPC if needed.'
      ]
    })
  },
  'rental-deposit': {
    questions: [
      'Do you have a written rent agreement? If yes, is it registered or notarized?',
      'Has the lease period ended, and have you physically vacating and returned the keys?',
      'What deductions did the landlord specify for withholding your deposit?'
    ],
    generatePlan: (inputs) => ({
      title: 'Security Deposit Recovery Roadmap',
      urgency: 'Medium',
      rights: 'Right to refund of security deposit on handover of premises under Rent Control and Model Tenancy guidelines.',
      laws: 'Model Tenancy Act, 2021 & Section 106 of the Transfer of Property Act.',
      documents: 'Rent Agreement copy, Deposit transaction records, and inventory checklists with photos of vacating state.',
      authorities: 'Rent Authority / Rent Court or Small Causes Civil Court.',
      steps: [
        'Send a final calculation sheet with flat photographs demanding the refund.',
        'Serve a legal notice to the landlord citing the Model Tenancy Act clauses.',
        'File a dispute with the Local Rent Authority for recovery of security deposit.'
      ]
    })
  },
  'generic': {
    questions: [
      'Can you tell me if you have any written agreements or documents related to this matter?',
      'When did this problem start occurring?',
      'Have you already contacted any police, company support, or government authority?'
    ],
    generatePlan: (inputs) => ({
      title: 'General Legal Action Plan',
      urgency: 'Low',
      rights: 'Right to legal awareness and redressal of grievances under the Constitution.',
      laws: 'Indian Civil Procedure Code (CPC), 1908 & relevant civil statutes.',
      documents: 'All correspondence, contracts, payments records, and written statements.',
      authorities: 'District Legal Services Authority (DLSA) for free legal aid support, or a Civil Advocate.',
      steps: [
        'Compile all documents, statements, and timeline of the event.',
        'Consult the District Legal Aid center or AajNyay Legal GPS for specialized flows.',
        'Draft a formal written complaint or notification to the opposite party.'
      ]
    })
  }
};

let navState = {
  active: false,
  category: '',
  stepIndex: 0,
  answers: []
};

// Start or reset assistant conversation
// Start or reset assistant conversation
function initChatNavigator() {
  const msgContainer = document.getElementById('chat-messages');
  if (!msgContainer) return;
  
  msgContainer.innerHTML = '';
  navState = { active: false, category: '', stepIndex: 0, answers: [] };
  
  setOrbState('idle');
  appendBotMessage("Hello! I am your <b>AajNyay Legal Navigator</b>. I'm here to act as your GPS through the Indian legal system. Rather than just giving a short answer, I will guide you step-by-step.");
  
  setTimeout(() => {
    appendBotMessage("Describe your legal problem in simple language. What situation are you facing today?");
  }, 800);
}

function handleUserMessage(text) {
  if (!text || text.trim() === '') return;
  
  appendUserMessage(text);
  
  const inputEl = document.getElementById('chat-input-text');
  if (inputEl) inputEl.value = '';
  
  showThinkingIndicator();
  setOrbState('thinking');
  
  setTimeout(() => {
    removeThinkingIndicator();
    setOrbState('responding');
    setTimeout(() => setOrbState('idle'), 1500);
    
    if (!navState.active) {
      // Analyze input to find category
      let detectedCat = 'generic';
      const cleanText = text.toLowerCase();
      
      for (const [cat, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(kw => cleanText.includes(kw))) {
          detectedCat = cat;
          break;
        }
      }
      
      navState.active = true;
      navState.category = detectedCat;
      navState.stepIndex = 0;
      navState.answers = [];
      
      const catLabel = detectedCat === 'generic' ? 'your query' : detectedCat.replace('-', ' ').toUpperCase();
      appendBotMessage(`I understand. It looks like this relates to <b>${catLabel}</b>. Let's analyze this step-by-step.`);
      
      setTimeout(() => {
        askClarifyingQuestion();
      }, 1000);
      
    } else {
      // Save answer and proceed
      navState.answers.push(text);
      navState.stepIndex++;
      
      const template = dialogueTemplates[navState.category] || dialogueTemplates['generic'];
      if (navState.stepIndex < template.questions.length) {
        askClarifyingQuestion();
      } else {
        generateDialoguePlan();
      }
    }
  }, 1200);
}

function askClarifyingQuestion() {
  const template = dialogueTemplates[navState.category] || dialogueTemplates['generic'];
  const question = template.questions[navState.stepIndex];
  
  setOrbState('responding');
  setTimeout(() => setOrbState('idle'), 1000);
  
  // Custom step progress
  const stepLabel = `[Clarifying Detail ${navState.stepIndex + 1} of ${template.questions.length}]`;
  appendBotMessage(`<span style="color:var(--accent); font-weight:700; font-size:0.8rem;">${stepLabel}</span><br>${question}`);
}

function generateDialoguePlan() {
  const template = dialogueTemplates[navState.category] || dialogueTemplates['generic'];
  const plan = template.generatePlan(navState.answers);
  
  setOrbState('responding');
  appendBotMessage("Thank you for sharing these details. I have analyzed your situation against Indian statutes and compiled your <b>Personalized Legal Action Plan</b>.");
  
  setTimeout(() => {
    showThinkingIndicator();
    setOrbState('thinking');
    setTimeout(() => {
      removeThinkingIndicator();
      setOrbState('responding');
      setTimeout(() => setOrbState('idle'), 2500);
      
      let stepListHtml = '';
      plan.steps.forEach((step, index) => {
        stepListHtml += `<li><b>Step ${index + 1}:</b> ${step}</li>`;
      });
      
      const planHtml = `
        <div class="glass-panel reveal-3d active" style="padding: 1.5rem; background: var(--bg-secondary); margin-top: 1rem; border-left: 4px solid var(--accent); box-shadow: 0 10px 30px var(--glass-shadow); border-radius: var(--radius-md);">
          <h3 style="font-size:1.15rem; color:var(--accent); margin-bottom:0.75rem;"><i data-lucide="shield"></i> ${plan.title}</h3>
          <p style="margin-bottom:0.75rem;"><b>Urgency:</b> <span class="urgency-badge urgency-${plan.urgency.toLowerCase()}">${plan.urgency}</span></p>
          <p style="margin-bottom:0.75rem;"><b>Your Rights:</b> ${plan.rights}</p>
          <p style="margin-bottom:0.75rem;"><b>Relevant Laws:</b> ${plan.laws}</p>
          <p style="margin-bottom:0.75rem;"><b>Required Documents:</b> ${plan.documents}</p>
          <p style="margin-bottom:0.75rem;"><b>Government Authorities:</b> ${plan.authorities}</p>
          
          <h4 style="margin-top:1rem; margin-bottom:0.5rem; color:var(--text-main);">Your Escalation Roadmap:</h4>
          <ol style="padding-left:1.2rem; margin-bottom:1rem; font-size:0.9rem;">
            ${stepListHtml}
          </ol>
          
          <button onclick="downloadAIMap('${plan.title}')" class="btn btn-primary btn-primary-small" style="font-size:0.8rem; padding:0.5rem 1rem;">
            <i data-lucide="download" style="width:1rem; height:1rem;"></i> Save Action Plan (PDF)
          </button>
        </div>
      `;
      
      appendBotMessage(planHtml);
      
      // Save journey to DB if logged in
      if (window.AajNyayAuth && window.AajNyayAuth.isAuthenticated) {
        saveJourneyToDB(navState.category, plan.title, navState.answers, plan);
      }
      
      // Reset Navigator state
      navState = { active: false, category: '', stepIndex: 0, answers: [] };
      
      setTimeout(() => {
        appendBotMessage("If you have another situation or want to ask another question, feel free to describe it below!");
      }, 1500);
      
    }, 1500);
  }, 1000);
}

async function saveJourneyToDB(caseId, title, answers, plan) {
  try {
    const res = await fetch('/api/journeys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ case_id: caseId, title: title, answers: answers, plan: plan })
    });
    const data = await res.json();
    if (data.success) {
      window.showToast('Roadmap synced to My GPS Dashboard', 'success');
    }
  } catch (err) {
    console.warn('Failed to save legal journey:', err);
  }
}

function appendBotMessage(html) {
  const msgContainer = document.getElementById('chat-messages');
  if (!msgContainer) return;
  
  const msg = document.createElement('div');
  msg.className = 'chat-msg chat-msg-bot';
  msg.innerHTML = `
    <div class="msg-avatar"><i data-lucide="bot"></i></div>
    <div class="msg-bubble"></div>
  `;
  
  msgContainer.appendChild(msg);
  const bubble = msg.querySelector('.msg-bubble');
  
  // If the message contains complex HTML elements, render it with a smooth fade/rise transition
  if (html.includes('<div') || html.includes('<ol')) {
    bubble.innerHTML = html;
    bubble.style.opacity = '0';
    bubble.style.transform = 'translateY(10px)';
    bubble.style.transition = 'all 0.5s ease';
    setTimeout(() => {
      bubble.style.opacity = '1';
      bubble.style.transform = 'translateY(0)';
    }, 50);
  } else {
    // Standard text message: Typewriter word-by-word effect
    let wordIndex = 0;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textWords = tempDiv.innerHTML.split(' ');
    
    function typeWord() {
      if (wordIndex < textWords.length) {
        bubble.innerHTML += (wordIndex === 0 ? '' : ' ') + textWords[wordIndex];
        wordIndex++;
        msgContainer.scrollTop = msgContainer.scrollHeight;
        setTimeout(typeWord, 35);
      } else {
        bubble.innerHTML = html; // Final check to restore complete markup
      }
    }
    typeWord();
  }
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function appendUserMessage(text) {
  const msgContainer = document.getElementById('chat-messages');
  if (!msgContainer) return;
  
  const msg = document.createElement('div');
  msg.className = 'chat-msg chat-msg-user';
  msg.innerHTML = `
    <div class="msg-avatar"><i data-lucide="user"></i></div>
    <div class="msg-bubble">${text}</div>
  `;
  
  msgContainer.appendChild(msg);
  msgContainer.scrollTop = msgContainer.scrollHeight;
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function showThinkingIndicator() {
  const msgContainer = document.getElementById('chat-messages');
  if (!msgContainer) return;
  
  const indicator = document.createElement('div');
  indicator.className = 'chat-msg chat-msg-bot';
  indicator.id = 'chat-thinking-indicator';
  indicator.innerHTML = `
    <div class="msg-avatar"><i data-lucide="bot"></i></div>
    <div class="msg-bubble">
      <div class="thinking-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  
  msgContainer.appendChild(indicator);
  msgContainer.scrollTop = msgContainer.scrollHeight;
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function removeThinkingIndicator() {
  const indicator = document.getElementById('chat-thinking-indicator');
  if (indicator) indicator.remove();
}

function selectQuickChip(chipText) {
  const inputEl = document.getElementById('chat-input-text');
  if (inputEl) {
    inputEl.value = chipText;
    handleUserMessage(chipText);
  }
}

function downloadAIMap(title) {
  // Triggers print format just like Legal GPS
  const printWindow = window.open('', '_blank');
  const chatMessagesHTML = document.getElementById('chat-messages').innerHTML;
  
  printWindow.document.write(`
    <html>
      <head>
        <title>AajNyay AI Legal Plan</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; }
          .chat-msg-user { display: none; }
          .msg-avatar { display: none; }
          .msg-bubble { margin-bottom: 20px; }
          .glass-panel { border: 1px solid #ccc; padding: 20px; border-radius: 8px; background: #fafafa; }
          .urgency-badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; }
          .urgency-high { background: #fee2e2; color: #ef4444; }
          .urgency-medium { background: #fef9c3; color: #eab308; }
          .urgency-low { background: #dcfce7; color: #22c55e; }
          .btn { display: none; }
          h3, h4 { color: #0b2545; }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #e06a3b; margin-bottom: 5px;">AAJNYAY AI NAVIGATOR</h1>
          <p>India's Legal GPS - Personalised Action Plan: ${title}</p>
        </div>
        ${chatMessagesHTML}
        <div style="text-align: center; margin-top: 50px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px;">
          Disclaimer: AajNyay provides educational legal guidance and does not replace professional legal advice.
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// Attach listeners
document.addEventListener('DOMContentLoaded', () => {
  const chatInputEl = document.getElementById('chat-input-text');
  const chatSendBtn = document.getElementById('chat-send-btn');
  
  if (chatInputEl) {
    chatInputEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleUserMessage(chatInputEl.value);
      }
    });
  }
  
  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', () => {
      if (chatInputEl) {
        handleUserMessage(chatInputEl.value);
      }
    });
  }
  
  initChatNavigator();
  
  // Initialize Orb Visualizer Canvas
  initOrbCanvas();
});

/* --- HOLOGRAPHIC ORB CORE CONTROLLERS --- */
let canvas, ctx;
let wavePhase = 0;
let targetWaveAmplitude = 5;
let currentWaveAmplitude = 5;

function setOrbState(state) {
  const orb = document.getElementById('hologram-orb');
  const text = document.getElementById('orb-status-text');
  if (!orb) return;
  
  orb.classList.remove('orb-thinking');
  
  if (state === 'idle') {
    if (text) text.textContent = 'System Idle';
    targetWaveAmplitude = 5;
  } else if (state === 'listening') {
    if (text) text.textContent = 'Active Listening...';
    targetWaveAmplitude = 25;
  } else if (state === 'thinking') {
    if (text) text.textContent = 'Analyzing Statutes...';
    orb.classList.add('orb-thinking');
    targetWaveAmplitude = 38;
  } else if (state === 'responding') {
    if (text) text.textContent = 'Synthesizing Roadmap...';
    targetWaveAmplitude = 18;
  }
}

function initOrbCanvas() {
  canvas = document.getElementById('orb-wave-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  
  canvas.width = 260;
  canvas.height = 260;
  
  animateOrbWaves();
}

let hologramParticles = [];

function animateOrbWaves() {
  if (!canvas || !ctx) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  
  currentWaveAmplitude += (targetWaveAmplitude - currentWaveAmplitude) * 0.08;
  wavePhase += 0.045;
  
  // 1. Draw dynamic sound/thinking waves
  for (let layer = 0; layer < 3; layer++) {
    ctx.beginPath();
    ctx.strokeStyle = layer === 0 ? 'rgba(37, 99, 235, 0.35)' : (layer === 1 ? 'rgba(255, 153, 51, 0.28)' : 'rgba(59, 130, 246, 0.12)');
    ctx.lineWidth = 1.5 + (2 - layer) * 1.5;
    
    const points = 75;
    const baseRadius = 55 + layer * 14;
    
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const freq = 4 + layer * 2;
      const amp = currentWaveAmplitude * (0.4 + Math.sin(wavePhase * 1.8 + layer) * 0.6);
      const radialOffset = Math.sin(angle * freq + wavePhase * (layer === 1 ? -1.2 : 1)) * amp;
      
      const r = baseRadius + radialOffset;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }
  
  // 2. Setup and Draw Orbiting Holographic Neural Connections
  if (hologramParticles.length === 0) {
    const pCount = 9;
    for (let i = 0; i < pCount; i++) {
      hologramParticles.push({
        angle: (i / pCount) * Math.PI * 2,
        speed: 0.012 + Math.random() * 0.012,
        radius: 84 + Math.random() * 18,
        size: 1.5 + Math.random() * 2,
        pulseSpeed: 0.03 + Math.random() * 0.04,
        pulsePhase: Math.random() * Math.PI
      });
    }
  }
  
  const positions = [];
  hologramParticles.forEach(p => {
    p.angle += p.speed;
    p.pulsePhase += p.pulseSpeed;
    const px = cx + Math.cos(p.angle) * p.radius;
    const py = cy + Math.sin(p.angle) * p.radius;
    positions.push({ x: px, y: py });
  });
  
  // Draw connecting dashed neural links
  ctx.strokeStyle = 'rgba(37, 99, 235, 0.07)';
  ctx.lineWidth = 0.8;
  ctx.setLineDash([2, 2]);
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dx = positions[i].x - positions[j].x;
      const dy = positions[i].y - positions[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 65) {
        ctx.beginPath();
        ctx.moveTo(positions[i].x, positions[i].y);
        ctx.lineTo(positions[j].x, positions[j].y);
        ctx.stroke();
      }
    }
  }
  ctx.setLineDash([]); // Reset line dash
  
  // Draw particle nodes
  hologramParticles.forEach((p, idx) => {
    const pos = positions[idx];
    const opacity = 0.25 + Math.sin(p.pulsePhase) * 0.45;
    const color = idx % 2 === 0 ? '37, 99, 235' : '255, 153, 51';
    
    // Outer particle glow
    ctx.beginPath();
    const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, p.size * 3.5);
    grad.addColorStop(0, `rgba(${color}, ${opacity})`);
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.arc(pos.x, pos.y, p.size * 3.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Core dot
    ctx.beginPath();
    ctx.fillStyle = idx % 2 === 0 ? 'rgba(37, 99, 235, 0.85)' : 'rgba(255, 153, 51, 0.85)';
    ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  
  requestAnimationFrame(animateOrbWaves);
}

// Bind to window to allow access from voice.js
window.setOrbState = setOrbState;
window.selectQuickChip = selectQuickChip;
window.downloadAIMap = downloadAIMap;
