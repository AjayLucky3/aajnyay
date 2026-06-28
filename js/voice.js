// Multilingual AI Voice Assistant - AajNyay "Talk to AajNyay"
const languageCodes = {
  'en': 'en-IN',
  'hi': 'hi-IN',
  'te': 'te-IN',
  'ta': 'ta-IN',
  'kn': 'kn-IN',
  'mr': 'mr-IN'
};

const voiceWelcomeMessages = {
  'en': 'Welcome to AajNyay voice assistant. Describe your legal situation, and I will guide you.',
  'hi': 'आजन्याय वॉइस असिस्टेंट में आपका स्वागत है। अपनी कानूनी समस्या का वर्णन करें, और मैं आपका मार्गदर्शन करूँगा।',
  'te': 'ఆజ్ న్యాయ్ వాయిస్ అసిస్టెంట్ కు స్వాగతం. మీ న్యాయపరమైన సమస్యను వివరించండి, నేను మీకు మార్గనిర్దేశం చేస్తాను.',
  'ta': 'ஆஜ்நியாய் குரல் உதவியாளருக்கு உங்களை வரவேற்கிறோம். உங்கள் சட்டச் சிக்கலை விளக்குங்கள், நான் உங்களுக்கு வழிகாட்டுவேன்.',
  'kn': 'ಆಜ್ ನ್ಯಾಯ್ ಧ್ವನಿ ಸಹಾಯಕಕ್ಕೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಕಾನೂನು ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ, ನಾನು ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತೇನೆ.',
  'mr': 'आजन्‍याय व्हॉईस असिस्टंटमध्‍ये आपले स्‍वागत आहे. आपली कायदेशीर समस्‍या सांगा, मी आपल्‍याला मार्गदर्शिन करेन.'
};

const voiceCaseConfirmation = {
  'en': 'Opening Legal GPS for ',
  'hi': 'इसके लिए लीगल जीपीएस खोल रहे हैं: ',
  'te': 'దీని కోసం లీగల్ జీపీఎస్ ప్రారంభిస్తున్నాము: ',
  'ta': 'இதற்கான சட்ட ஜிபிஎஸ் திறக்கப்படுகிறது: ',
  'kn': 'ಇದಕ್ಕಾಗಿ ಕಾನೂನು ಜಿಪಿಎಸ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ: ',
  'mr': 'याच्यासाठी लीगल जीपीएस उघडत आहे: '
};

let recognition = null;
let selectedLang = 'en';
let isListening = false;
let waveAnimationId = null;
let currentTranscript = '';

// Spawn floating microphone button and overlay modal
function initVoiceAssistant() {
  // If button already exists, skip
  if (document.getElementById('voice-floating-btn')) return;
  
  // 1. Create floating button
  const voiceBtn = document.createElement('div');
  voiceBtn.id = 'voice-floating-btn';
  voiceBtn.className = 'glass-card';
  voiceBtn.style.position = 'fixed';
  voiceBtn.style.bottom = '2rem';
  voiceBtn.style.left = '2rem'; // Placed on left so it doesn't overlap default support widgets
  voiceBtn.style.zIndex = '999';
  voiceBtn.style.width = '3.5rem';
  voiceBtn.style.height = '3.5rem';
  voiceBtn.style.borderRadius = '50%';
  voiceBtn.style.display = 'flex';
  voiceBtn.style.alignItems = 'center';
  voiceBtn.style.justifyContent = 'center';
  voiceBtn.style.cursor = 'pointer';
  voiceBtn.style.border = '2px solid var(--accent)';
  voiceBtn.style.boxShadow = '0 10px 25px rgba(255, 153, 51, 0.3)';
  voiceBtn.style.background = 'var(--glass-bg)';
  voiceBtn.style.transition = 'all 0.3s ease';
  
  voiceBtn.innerHTML = `
    <i data-lucide="mic" style="color:var(--accent); width:1.5rem; height:1.5rem; transition:transform 0.3s ease;"></i>
  `;
  
  voiceBtn.addEventListener('mouseenter', () => {
    voiceBtn.style.transform = 'scale(1.1)';
    voiceBtn.style.boxShadow = '0 15px 30px rgba(255, 153, 51, 0.5)';
  });
  
  voiceBtn.addEventListener('mouseleave', () => {
    voiceBtn.style.transform = 'scale(1)';
    voiceBtn.style.boxShadow = '0 10px 25px rgba(255, 153, 51, 0.3)';
  });
  
  voiceBtn.addEventListener('click', openVoiceOverlay);
  document.body.appendChild(voiceBtn);
  
  // 2. Create Modal Overlay
  const overlay = document.createElement('div');
  overlay.id = 'voice-overlay-modal';
  overlay.className = 'glass-panel';
  overlay.style.display = 'none';
  overlay.style.position = 'fixed';
  overlay.style.top = '50%';
  overlay.style.left = '50%';
  overlay.style.transform = 'translate(-50%, -50%)';
  overlay.style.zIndex = '1001';
  overlay.style.width = '90%';
  overlay.style.maxWidth = '550px';
  overlay.style.padding = '2.5rem';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.gap = '1.5rem';
  overlay.style.textAlign = 'center';
  
  overlay.innerHTML = `
    <div style="width:100%; display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
      <h3 style="font-size:1.25rem; display:flex; align-items:center; gap:0.5rem; color:var(--text-main);"><i data-lucide="bot" style="color:var(--accent);"></i> Talk to AajNyay</h3>
      <button onclick="closeVoiceOverlay()" style="cursor:pointer; color:var(--text-muted);"><i data-lucide="x"></i></button>
    </div>
    
    <div>
      <label style="font-size:0.85rem; font-weight:700; color:var(--text-muted); margin-right:0.5rem;">Select Language:</label>
      <select id="voice-lang-select" class="gps-text-input" style="width:160px; height:2.2rem; display:inline-block; font-size:0.85rem; padding:0 0.5rem;" onchange="changeVoiceLanguage(this.value)">
        <option value="en">English (India)</option>
        <option value="hi">हिंदी (Hindi)</option>
        <option value="te">తెలుగు (Telugu)</option>
        <option value="ta">தமிழ் (Tamil)</option>
        <option value="kn">ಕನ್ನಡ (Kannada)</option>
        <option value="mr">मराठी (Marathi)</option>
      </select>
    </div>
    
    <div id="voice-status-msg" style="font-weight:600; color:var(--text-muted); font-size:1.05rem; min-height:1.5rem;">Ready to listen...</div>
    
    <div style="position:relative; width:100%; height:80px; display:flex; align-items:center; justify-content:center;">
      <canvas id="voice-waveform" width="400" height="80" style="width:100%; height:100%; pointer-events:none;"></canvas>
      <button id="voice-rec-trigger" style="position:absolute; width:65px; height:65px; border-radius:50%; background:var(--accent); color:white; border:none; outline:none; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 8px 20px rgba(255,153,51,0.3); transition:all 0.3s ease;">
        <i data-lucide="mic" id="voice-mic-icon" style="width:1.75rem; height:1.75rem;"></i>
      </button>
    </div>
    
    <div style="width:100%; text-align:left;">
      <label style="font-size:0.85rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:0.4rem;">Speech Transcript:</label>
      <textarea id="voice-transcript-box" class="gps-textarea-input" style="height:80px; font-size:0.95rem; line-height:1.4;" placeholder="Your spoken text will appear here. You can also edit it before submitting."></textarea>
    </div>
    
    <div style="display:flex; gap:1rem; width:100%;">
      <button onclick="clearVoiceTranscript()" class="btn btn-secondary" style="flex:1;">Clear</button>
      <button onclick="submitVoiceText()" class="btn btn-primary" style="flex:1.5;">Identify Issue <i data-lucide="arrow-right"></i></button>
    </div>
  `;
  
  // Create backdrop dark layer
  const backdrop = document.createElement('div');
  backdrop.id = 'voice-modal-backdrop';
  backdrop.style.display = 'none';
  backdrop.style.position = 'fixed';
  backdrop.style.top = '0';
  backdrop.style.left = '0';
  backdrop.style.width = '100vw';
  backdrop.style.height = '100vh';
  backdrop.style.background = 'rgba(0, 0, 0, 0.4)';
  backdrop.style.backdropFilter = 'blur(5px)';
  backdrop.style.zIndex = '1000';
  backdrop.addEventListener('click', closeVoiceOverlay);
  
  document.body.appendChild(backdrop);
  document.body.appendChild(overlay);
  
  // Hook mic button trigger
  document.getElementById('voice-rec-trigger').addEventListener('click', toggleRecording);
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // Initialise Speech Recognition
  initRecognition();
}

function initRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('Web Speech API is not supported in this browser.');
    document.getElementById('voice-status-msg').textContent = 'Web Speech not supported in this browser. Please type instead.';
    return;
  }
  
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  
  recognition.onstart = () => {
    isListening = true;
    document.getElementById('voice-status-msg').textContent = 'Listening... Speak now.';
    document.getElementById('voice-rec-trigger').style.background = '#ef4444';
    document.getElementById('voice-rec-trigger').style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.5)';
    document.getElementById('voice-mic-icon').setAttribute('data-lucide', 'mic-off');
    if (window.lucide) window.lucide.createIcons();
    startWaveAnimation();
  };
  
  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    
    currentTranscript = finalTranscript || interimTranscript;
    document.getElementById('voice-transcript-box').value = currentTranscript;
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    stopRecordingUI();
    if (event.error === 'not-allowed') {
      window.showToast('Microphone access denied. Enable permissions in settings.', 'error');
    }
  };
  
  recognition.onend = () => {
    stopRecordingUI();
  };
}

function openVoiceOverlay() {
  document.getElementById('voice-modal-backdrop').style.display = 'block';
  const overlay = document.getElementById('voice-overlay-modal');
  overlay.style.display = 'flex';
  overlay.style.animation = 'fade-in 0.3s ease';
  
  // Clear any past state
  clearVoiceTranscript();
  
  // Speak welcome prompt
  speakAssistantGreeting();
}

function closeVoiceOverlay() {
  stopRecording();
  document.getElementById('voice-modal-backdrop').style.display = 'none';
  document.getElementById('voice-overlay-modal').style.display = 'none';
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function changeVoiceLanguage(lang) {
  selectedLang = lang;
  if (recognition) {
    recognition.lang = languageCodes[lang];
  }
  // Speak new welcome
  speakAssistantGreeting();
}

function speakAssistantGreeting() {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel(); // Stop old speak loops
  
  const msg = voiceWelcomeMessages[selectedLang];
  const utterance = new SpeechSynthesisUtterance(msg);
  // Match language accent
  utterance.lang = languageCodes[selectedLang];
  window.speechSynthesis.speak(utterance);
}

function toggleRecording() {
  if (!recognition) {
    window.showToast('Speech recognition not available', 'error');
    return;
  }
  
  if (isListening) {
    stopRecording();
  } else {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    recognition.lang = languageCodes[selectedLang];
    recognition.start();
    if (window.setOrbState) window.setOrbState('listening');
  }
}

function stopRecording() {
  if (recognition && isListening) {
    recognition.stop();
  }
}

function stopRecordingUI() {
  isListening = false;
  document.getElementById('voice-status-msg').textContent = 'Listening stopped. Edit text or submit.';
  document.getElementById('voice-rec-trigger').style.background = 'var(--accent)';
  document.getElementById('voice-rec-trigger').style.boxShadow = '0 8px 20px rgba(255,153,51,0.3)';
  document.getElementById('voice-mic-icon').setAttribute('data-lucide', 'mic');
  if (window.lucide) window.lucide.createIcons();
  stopWaveAnimation();
  if (window.setOrbState) window.setOrbState('idle');
}

function clearVoiceTranscript() {
  currentTranscript = '';
  const box = document.getElementById('voice-transcript-box');
  if (box) box.value = '';
}

// Visual Waveform Animation Loop
function startWaveAnimation() {
  const canvas = document.getElementById('voice-waveform');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let phase = 0;
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw 3 layered sine waves with dynamic phase offsets
    ctx.lineWidth = 2;
    
    // Primary Blue Wave
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.4)';
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height / 2 + Math.sin(x * 0.02 + phase) * 22;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Accent Saffron Wave
    ctx.strokeStyle = 'rgba(255, 153, 51, 0.4)';
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height / 2 + Math.cos(x * 0.03 + phase) * 16;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Light Background Wave
    ctx.strokeStyle = 'rgba(22, 163, 74, 0.2)';
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height / 2 + Math.sin(x * 0.015 - phase) * 12;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    phase += 0.12;
    waveAnimationId = requestAnimationFrame(draw);
  }
  
  draw();
}

function stopWaveAnimation() {
  if (waveAnimationId) {
    cancelAnimationFrame(waveAnimationId);
    waveAnimationId = null;
  }
  // Clear canvas
  const canvas = document.getElementById('voice-waveform');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// Match transcript to GPS flows
async function submitVoiceText() {
  const text = document.getElementById('voice-transcript-box').value.trim();
  if (!text) {
    window.showToast('Transcript is empty. Please speak first.', 'error');
    return;
  }
  
  closeVoiceOverlay();
  
  // Categorize
  let detectedCat = null;
  const cleanText = text.toLowerCase();
  
  // Categories matching loops
  const keywords = {
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
  
  for (const [cat, words] of Object.entries(keywords)) {
    if (words.some(kw => cleanText.includes(kw))) {
      detectedCat = cat;
      break;
    }
  }
  
  const label = detectedCat ? detectedCat.replace('-', ' ') : 'General Case';
  const confirmationMsg = `${voiceCaseConfirmation[selectedLang]} ${label}`;
  
  // Speak confirmation
  if (window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance(confirmationMsg);
    utterance.lang = languageCodes[selectedLang];
    window.speechSynthesis.speak(utterance);
  }
  
  window.showToast(confirmationMsg, 'info');
  
  // Save voice transcript to history API if logged in
  if (window.AajNyayAuth && window.AajNyayAuth.isAuthenticated) {
    try {
      await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text, response_text: confirmationMsg })
      });
    } catch (e) {
      console.warn('Failed to save voice history:', e);
    }
  }
  
  // Route to page
  setTimeout(() => {
    if (detectedCat) {
      window.location.href = `gps.html?case=${detectedCat}`;
    } else {
      // General fall-through goes to assistant
      window.location.href = `assistant.html`;
    }
  }, 1200);
}

// Initialise assistant floating assets on page load
document.addEventListener('DOMContentLoaded', () => {
  initVoiceAssistant();
});

window.closeVoiceOverlay = closeVoiceOverlay;
window.changeVoiceLanguage = changeVoiceLanguage;
window.clearVoiceTranscript = clearVoiceTranscript;
window.submitVoiceText = submitVoiceText;
