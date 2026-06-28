// Life Events Dashboard Database & Scripting
const lifeEventsData = {
  'renting-house': {
    title: 'Renting a House',
    desc: 'Important clauses, deposit safety, and tenancy rules you must verify before signing a lease.',
    checklist: [
      'Verify Landlord identity papers (Aadhaar/PAN/Sale Deed copy)',
      'Inspect flat for existing damages and note down inventory',
      'Confirm lock-in period, rent review cycle, and notice terms',
      'Ensure agreement is registered if lease exceeds 11 months',
      'Verify electricity meter reading and old utility clearances'
    ],
    rights: [
      'Right to basic quiet enjoyment without arbitrary landlord intrusion.',
      'Right to deposit refund immediately upon key handover.',
      'Protection from arbitrary eviction without court notices.'
    ],
    obligations: [
      'Pay rent on or before the due date agreed in the lease.',
      'Maintain the property in clean and good structural condition.',
      'Permit reasonable landlord inspections with 24h prior notice.'
    ],
    documents: [
      'Notarized/Registered Rent Agreement copy',
      'Security deposit transfer receipt',
      'Utility bills clearance certificate',
      'No-Objection Certificate (NOC) from housing society'
    ],
    timeline: 'Agreement registration should ideally be done within 4 months of execution. Standard Notice Period is 1-2 months.',
    risks: 'Automatic high deductions for "painting" or "repairs" without proof. Unregistered agreements might not be accepted in Rent Court.',
    actionPath: 'startGPSFlow(\'rental-deposit\')'
  },
  'buying-property': {
    title: 'Buying Property',
    desc: 'Verify title deeds, RERA registrations, and avoid builders scams in Indian property investments.',
    checklist: [
      'Conduct a 30-year search of Title Deeds at Sub-Registrar office',
      'Verify RERA registration status on State RERA portal',
      'Obtain Encumbrance Certificate (EC) showing clear title',
      'Ensure building layout plan has local municipal approvals',
      'Request No-Objection Certificate (NOC) from bank if mortgaged'
    ],
    rights: [
      'Right to claim refund with interest for project delays under RERA.',
      'Right to inspect sanction plans and developer contracts.',
      'Right to get standard construction quality assurances.'
    ],
    obligations: [
      'Pay stamp duty and registration fees during conveyance.',
      'Adhere to the payment schedule agreed in the sale contract.',
      'Participate in registering the resident association.'
    ],
    documents: [
      'Registered Sale Deed / Conveyance Deed',
      'Allotment letter & Builder-Buyer Agreement',
      'No-Objection Certificate (NOC) from fire, water, and power boards',
      'Occupancy Certificate (OC) & Completion Certificate (CC)'
    ],
    timeline: 'Register sale agreement within 4 months of execution. Builder must deliver possession on RERA-notified timeline.',
    risks: 'Buying unapproved layouts. Paying full money without obtaining Occupancy Certificate (OC). Undisclosed bank mortgages.',
    actionPath: 'startGPSFlow(\'property-dispute\')'
  },
  'starting-business': {
    title: 'Starting a Business',
    desc: 'Legal registrations, tax structures, and compliance rules for Indian startups.',
    checklist: [
      'Select structure (LLP, Private Limited, or Proprietorship)',
      'Apply for Director Identification Number (DIN) & Digital Signatures',
      'Register business name on MCA portal',
      'Apply for corporate PAN, TAN, and GST registration',
      'Obtain local Shops & Establishments License'
    ],
    rights: [
      'Startup India tax exemptions and funding scheme qualifications.',
      'Right to trade and operate legally across Indian states.',
      'Patent/Trademark priority rights upon filing.'
    ],
    obligations: [
      'File annual financial statements with MCA/ROC.',
      'Comply with monthly GST and quarterly TDS tax filings.',
      'Maintain employee PF/ESI contributions if headcount exceeds thresholds.'
    ],
    documents: [
      'Certificate of Incorporation / Partnership Deed',
      'Memorandum of Association (MoA) & Articles of Association (AoA)',
      'GSTIN Certificate & corporate PAN Card',
      'Intellectual Property / Trademark filing proofs'
    ],
    timeline: 'Incorporation takes 5-10 working days on MCA portal. GST registration takes 3-7 days. Trademark priority starts on filing.',
    risks: 'Operating under generic partner names without written LLPs. Co-founder disputes without vesting agreements.',
    actionPath: 'window.showToast(\'AI Business Setup advisor coming soon! Use GPS for contract questions.\', \'info\')'
  },
  'marriage': {
    title: 'Marriage & Family Laws',
    desc: 'Registration protocols, marriage act choices, and statutory asset protections.',
    checklist: [
      'Select governing act (Hindu Marriage Act, Special Marriage Act)',
      'Obtain joint passport size photos and marriage invitation card',
      'Arrange two witnesses with Aadhaar/voter identity papers',
      'File joint application form at the Sub-Registrar office',
      'Collect official Marriage Certificate post registry'
    ],
    rights: [
      'Right to maintenance and separate residence under family codes.',
      'Right to joint asset registrations and family pensions.',
      'Right to child custody review based on child welfare standards.'
    ],
    obligations: [
      'Provide mutual support, care, and cohabitation.',
      'Duty to maintain minor children and dependent parents.',
      'Resolve family disputes through reconciliation before courts.'
    ],
    documents: [
      'Age proof documents (10th marksheet or Birth certificate)',
      'Address proof of both spouses',
      'Affidavit of marital status and nationality',
      'Official Marriage Certificate copy'
    ],
    timeline: 'Register within 60 days under Hindu Marriage Act. Special Marriage Act requires 30-day public notice beforehand.',
    risks: 'Failing to register the marriage, leading to inheritance delays or visa issues. Morphed pictures and extortion from third parties.',
    actionPath: 'window.showToast(\'Family reconciliation GPS coming soon.\', \'info\')'
  },
  'divorce': {
    title: 'Divorce & Separation',
    desc: 'Understand mutual consent procedures, alimony guidelines, and child custody rules.',
    checklist: [
      'Draft mutual consent agreement detailing asset split',
      'Formulate child custody schedules and visitation rights',
      'Calculate lump-sum alimony or monthly maintenance amounts',
      'File joint petition under Section 13B of Hindu Marriage Act',
      'Attend first motion counseling and wait for statutory cooling period'
    ],
    rights: [
      'Right to seek alimony/maintenance during and after case.',
      'Right to separate custody assessment based on child\'s preference.',
      'Right to reside in shared household during proceedings.'
    ],
    obligations: [
      'Disclose all assets, income, and liabilities truthfully to Court.',
      'Provide child maintenance funds as ordered.',
      'Refrain from hiding assets or transferring title deeds during case.'
    ],
    documents: [
      'Marriage registration certificate',
      'Income tax returns / salary slips of both partners',
      'Evidence of separation period (minimum 1 year for mutual consent)',
      'Agreement/MOU on children and financial settlements'
    ],
    timeline: 'Mutual Consent divorce takes 6-18 months. Contested divorce can span 2-5 years depending on court volumes.',
    risks: 'Signing settlements without reviewing hidden assets. Violating custody orders leading to contempt proceedings.',
    actionPath: 'startGPSFlow(\'domestic-violence\')'
  },
  'employment': {
    title: 'Employment & Career Compliance',
    desc: 'Verify NDA clauses, non-competes, and legal rights during notice periods.',
    checklist: [
      'Review contract non-compete clauses for geographic limits',
      'Check Intellectual Property (IP) assignment rules',
      'Confirm probation period duration and extension clauses',
      'Understand notice period buyout and termination payouts',
      'Verify Provident Fund (PF) account activation and monthly credits'
    ],
    rights: [
      'Right to receive gratuity after 5 years of continuous service.',
      'Right to take accrued paid leave or get encashment.',
      'Protection against wrongful dismissal without reasonable grounds.'
    ],
    obligations: [
      'Observe trade secrets and protect company confidential data.',
      'Deliver notice period service or compensate according to contract.',
      'Refrain from poaching clients during restriction terms.'
    ],
    documents: [
      'Signed Appointment Letter & Annexures',
      'UAN (Provident Fund) Number and account logs',
      'Relieving certificate & Experience letter from past jobs',
      'Form 16 / TDS tax certificates'
    ],
    timeline: 'Standard Notice period is 30-90 days. Relieving letters must be issued on the last working day or within 15 days.',
    risks: 'Agreeing to wide non-competes that prevent working in the same city. Forfeiting variable pays due to unclear notice dates.',
    actionPath: 'startGPSFlow(\'salary-unpaid\')'
  },
  'cyber-fraud': {
    title: 'Cyber Fraud Protections',
    desc: 'Step-by-step checklist to recover from online banking scams and credit card theft.',
    checklist: [
      'Immediately lock/block debit cards and online banking login',
      'Call National Cyber Helpline (1930) within 2 hours of fraud',
      'File cyber complaint at cybercrime.gov.in',
      'Submit the police receipt to your bank home branch manager',
      'Request bank to freeze transactions on destination accounts'
    ],
    rights: [
      'RBI Zero Liability protection if scam is reported within 3 days.',
      'Right to digital privacy and financial transaction security.',
      'Right to receive quick banking ombudsman dispute reviews.'
    ],
    obligations: [
      'Do not share passwords, pins, OTPs, or CVV details.',
      'Maintain secure software and report loss of mobile device immediately.',
      'Submit true and correct facts during cyber investigations.'
    ],
    documents: [
      'Bank statement showing the unauthorized debit transaction',
      'UPI ID or bank account of the recipient sender',
      'Copy of SMS notifications / bank statements',
      'Cyber FIR copy'
    ],
    timeline: 'Reporting within 2 hours maximizes recovery chance. Bank must resolve disputes within 90 days of registry.',
    risks: 'Interacting with fake customer care numbers on Google. Delaying reporting past 3 days increases customer liability.',
    actionPath: 'startGPSFlow(\'upi-fraud\')'
  },
  'consumer-purchases': {
    title: 'Consumer Purchases Safety',
    desc: 'Verify guarantees, return policies, and avoid cheating by merchants.',
    checklist: [
      'Insist on a tax invoice with printed GST registration number',
      'Check manufacture date, expiry date, and retail price (MRP)',
      'Verify warranty terms on manufacturer official portal',
      'Take unboxing video for high-value online products',
      'Double check refund and replacement policies on website'
    ],
    rights: [
      'Right to get refund if product is defective or differs from specs.',
      'Right to be protected from misleading advertisements.',
      'Right to claim compensation for injuries caused by defective goods.'
    ],
    obligations: [
      'Use the product according to manufacturer guidelines.',
      'Report defects within the warranty or return window.',
      'Pay the agreed purchase price and taxes.'
    ],
    documents: [
      'Original tax invoice / cash memo',
      'Warranty card with dealer signature/stamp',
      'Log of emails sent to merchant regarding defective product',
      'Delivery receipt copy'
    ],
    timeline: 'Standard return windows are 7-15 days. Warranty claims last 1-2 years. Consumer cases must be filed within 2 years.',
    risks: 'Buying without invoice, which voids warranty and limits consumer court eligibility. Accepting products with damaged seal.',
    actionPath: 'startGPSFlow(\'consumer-complaint\')'
  }
};

function selectEventTab(eventId, tabEl) {
  // Update Tab States
  const tabs = document.querySelectorAll('.events-tab');
  tabs.forEach(t => t.classList.remove('active'));
  
  if (tabEl) {
    tabEl.classList.add('active');
  } else {
    // Fallback search button activation
    const matchingTab = Array.from(tabs).find(t => t.getAttribute('onclick').includes(eventId));
    if (matchingTab) matchingTab.classList.add('active');
  }
  
  const event = lifeEventsData[eventId];
  if (!event) return;
  
  // Render details panel
  const panelEl = document.getElementById('events-details-panel');
  if (!panelEl) return;
  
  // Checklist HTML
  let checklistHtml = '';
  event.checklist.forEach((item, idx) => {
    checklistHtml += `
      <div class="checklist-item">
        <input type="checkbox" id="chk-${eventId}-${idx}">
        <span>${item}</span>
      </div>
    `;
  });
  
  // Rights & Obligations list HTML
  let rightsHtml = '';
  event.rights.forEach(r => {
    rightsHtml += `<li style="font-size:0.95rem; margin-bottom:0.5rem; line-height:1.5;">${r}</li>`;
  });
  
  let obligationsHtml = '';
  event.obligations.forEach(o => {
    obligationsHtml += `<li style="font-size:0.95rem; margin-bottom:0.5rem; line-height:1.5;">${o}</li>`;
  });
  
  // Documents checklist
  let docsHtml = '';
  event.documents.forEach((doc, idx) => {
    docsHtml += `
      <div class="checklist-item">
        <input type="checkbox" id="doc-${eventId}-${idx}">
        <span>${doc}</span>
      </div>
    `;
  });
  
  panelEl.innerHTML = `
    <div class="events-pane active">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h2>${event.title}</h2>
          <p>${event.desc}</p>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button onclick="downloadEventChecklist('${eventId}')" class="btn btn-secondary" style="font-size:0.85rem; padding:0.5rem 1rem;"><i data-lucide="download"></i> Save Guide</button>
          <button onclick="${event.actionPath}" class="btn btn-primary" style="font-size:0.85rem; padding:0.5rem 1rem;">Launch GPS Guide</button>
        </div>
      </div>
      
      <div class="event-details-grid">
        <div class="glass-panel" style="padding: 1.5rem 2rem;">
          <h3 style="font-size:1.2rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;"><i data-lucide="check-circle" style="color:var(--accent);"></i> Pre-Execution Checklist</h3>
          <div class="event-checklist">
            ${checklistHtml}
          </div>
        </div>
        
        <div class="glass-panel" style="padding: 1.5rem 2rem;">
          <h3 style="font-size:1.2rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;"><i data-lucide="file-text" style="color:var(--accent);"></i> Required Documents</h3>
          <div class="event-checklist">
            ${docsHtml}
          </div>
        </div>
        
        <div class="glass-panel" style="padding: 1.5rem 2rem;">
          <h3 style="font-size:1.2rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;"><i data-lucide="shield" style="color:var(--accent);"></i> Your Rights</h3>
          <ul style="padding-left:1.2rem;">
            ${rightsHtml}
          </ul>
        </div>
        
        <div class="glass-panel" style="padding: 1.5rem 2rem;">
          <h3 style="font-size:1.2rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;"><i data-lucide="alert-circle" style="color:var(--accent);"></i> Your Obligations</h3>
          <ul style="padding-left:1.2rem;">
            ${obligationsHtml}
          </ul>
        </div>
        
        <div class="glass-panel" style="padding: 1.5rem 2rem;">
          <h3 style="font-size:1.2rem; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;"><i data-lucide="calendar" style="color:var(--accent);"></i> Key Timelines</h3>
          <p style="font-size:0.95rem;">${event.timeline}</p>
        </div>
        
        <div class="glass-panel" style="padding: 1.5rem 2rem; border-left:4px solid #ef4444;">
          <h3 style="font-size:1.2rem; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem; color:#ef4444;"><i data-lucide="alert-triangle"></i> Legal Risks to Avoid</h3>
          <p style="font-size:0.95rem;">${event.risks}</p>
        </div>
      </div>
    </div>
  `;
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function downloadEventChecklist(eventId) {
  const event = lifeEventsData[eventId];
  if (!event) return;
  
  const printWindow = window.open('', '_blank');
  
  let checklistHtml = '';
  event.checklist.forEach(item => {
    checklistHtml += `<li>[ ] ${item}</li>`;
  });
  
  let docsHtml = '';
  event.documents.forEach(doc => {
    docsHtml += `<li>[ ] ${doc}</li>`;
  });
  
  let rightsHtml = '';
  event.rights.forEach(r => {
    rightsHtml += `<li>${r}</li>`;
  });
  
  let obligationsHtml = '';
  event.obligations.forEach(o => {
    obligationsHtml += `<li>${o}</li>`;
  });
  
  printWindow.document.write(`
    <html>
      <head>
        <title>AajNyay Legal Guide - ${event.title}</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; }
          .section { border: 1px solid #ccc; padding: 20px; border-radius: 8px; margin-bottom: 20px; background: #fafafa; }
          ul { padding-left: 20px; }
          li { margin-bottom: 10px; }
          h2, h3 { color: #0b2545; }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #e06a3b; margin-bottom: 5px;">AAJNYAY LEGAL LIFE NAVIGATOR</h1>
          <p>Guide: ${event.title}</p>
        </div>
        
        <p><strong>Description:</strong> ${event.desc}</p>
        
        <div class="section">
          <h3>Pre-Execution Checklist</h3>
          <ul>${checklistHtml}</ul>
        </div>
        
        <div class="section">
          <h3>Required Documents</h3>
          <ul>${docsHtml}</ul>
        </div>
        
        <div class="section">
          <h3>Your Rights & Protections</h3>
          <ul>${rightsHtml}</ul>
        </div>
        
        <div class="section">
          <h3>Your Obligations</h3>
          <ul>${obligationsHtml}</ul>
        </div>
        
        <div class="section">
          <h3>Key Timelines</h3>
          <p>${event.timeline}</p>
        </div>
        
        <div class="section" style="border-left: 4px solid #ef4444;">
          <h3>Legal Risks to Avoid</h3>
          <p>${event.risks}</p>
        </div>
        
        <div style="text-align: center; margin-top: 50px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px;">
          Disclaimer: AajNyay provides educational legal guidance and does not replace professional legal advice.
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
  
  window.showToast(`Guide checklist for "${event.title}" saved.`, 'success');
}

function selectEventPortal(eventId, portalEl, isInitialLoad = false) {
  // Clear portal active states
  const portals = document.querySelectorAll('.portal-grid .portal-card');
  portals.forEach(p => p.classList.remove('selected'));
  
  // Find current portal card if not passed
  if (!portalEl) {
    const list = Array.from(portals);
    portalEl = list.find(p => p.getAttribute('onclick') && p.getAttribute('onclick').includes(`'${eventId}'`));
  }
  
  if (portalEl) {
    portalEl.classList.add('selected');
  }
  
  // Show details panel
  const panelEl = document.getElementById('events-details-panel');
  if (panelEl) {
    panelEl.style.display = 'block';
    
    // Transition the border color to match portal color
    if (portalEl) {
      const portalColor = portalEl.style.getPropertyValue('--portal-color') || '37, 99, 235';
      panelEl.style.borderTopColor = `rgb(${portalColor})`;
      
      // Also apply a dynamic CSS variable for accent colors inside the panel
      panelEl.style.setProperty('--panel-accent-color', `rgb(${portalColor})`);
    }
  }
  
  // Render the contents using selectEventTab
  selectEventTab(eventId, null);
  
  // Execute a smooth scroll alignment to the details card if not initial load
  if (!isInitialLoad && panelEl) {
    panelEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Initialise defaults on page load
document.addEventListener('DOMContentLoaded', () => {
  // Load default panel on home page launch without scroll jump
  selectEventPortal('renting-house', null, true);
});

window.selectEventTab = selectEventTab;
window.selectEventPortal = selectEventPortal;
window.downloadEventChecklist = downloadEventChecklist;
