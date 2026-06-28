// Rights Library Database & Interactive Controller
const rightsLibraryData = {
  'consumer': {
    title: 'Consumer Rights',
    icon: 'shopping-bag',
    overview: 'Protects customers against unfair trade practices, defective items, and services deficits under the Consumer Protection Act, 2019.',
    rights: [
      { name: 'Right to Safety', desc: 'Protection against goods and services which are hazardous to life and property.' },
      { name: 'Right to Information', desc: 'To be informed about the quality, quantity, potency, purity, standard, and price of goods or services.' },
      { name: 'Right to Choice', desc: 'To be assured access to a variety of goods and services at competitive prices.' },
      { name: 'Right to Redressal', desc: 'To seek legal remedy against unfair trade practices or exploitation.' }
    ],
    scenarios: [
      { situation: 'Received a defective electronic item and the retailer refuses a refund.', action: 'Register complaint at NCH portal (1915).' },
      { situation: 'Travel agency cancels flight bookings and refuses to process refunds.', action: 'Send legal demand notice, then file case on e-Daakhil.' }
    ],
    laws: [
      { name: 'Consumer Protection Act, 2019', details: 'Establishes central regulatory authority (CCPA) and district/state/national Commissions.' }
    ],
    faqs: [
      { q: 'Is there a limit on filing consumer cases?', a: 'Yes, a complaint must be filed within 2 years from the date the dispute arose.' },
      { q: 'Do I need a lawyer in Consumer Court?', a: 'No, consumers can represent themselves or appoint an authorized representative.' }
    ],
    resources: [
      { name: 'National Consumer Helpline', url: 'https://consumerhelpline.gov.in' },
      { name: 'e-Daakhil Filing Portal', url: 'https://edaakhil.nic.in' }
    ]
  },
  'labour': {
    title: 'Labour & Employment Rights',
    icon: 'briefcase',
    overview: 'Ensures fair treatment, timely wages, safe working conditions, and protection against arbitrary layoffs for working citizens.',
    rights: [
      { name: 'Equal Pay for Equal Work', desc: 'No discrimination based on gender in payment of wages for similar work.' },
      { name: 'Right to Minimum Wages', desc: 'Wages cannot be lower than state-notified minimum thresholds.' },
      { name: 'Safe Working Environment', desc: 'Right to basic drinking water, clean washrooms, ventilation, and safety equipment.' },
      { name: 'Right against Forced Labour', desc: 'Constitutional guarantee prohibiting bonded or forced work.' }
    ],
    scenarios: [
      { situation: 'Employer delays salary payment for three consecutive months.', action: 'File conciliation complaint with the Labour Commissioner.' },
      { situation: 'Terminated from job without notice or contractually agreed severance pay.', action: 'Serve legal notice under Industrial Disputes Act.' }
    ],
    laws: [
      { name: 'Industrial Disputes Act, 1947', details: 'Governs industrial disputes, strikes, retrenchments, and layoffs.' },
      { name: 'Equal Remuneration Act, 1976', details: 'Ensures equal pay and restricts gender discrimination.' }
    ],
    faqs: [
      { q: 'What is the standard working hour limit?', a: 'Generally 8-9 hours per day (48 hours per week) under the Factories Act and state Shops Acts.' },
      { q: 'Is an employment contract mandatory?', a: 'Yes, to enforce rights, you must demand a written appointment letter or contract.' }
    ],
    resources: [
      { name: 'Ministry of Labour & Employment', url: 'https://labour.gov.in' },
      { name: 'Shram Suvidha Portal', url: 'https://shramsuvidha.gov.in' }
    ]
  },
  'womens': {
    title: 'Women\'s Rights',
    icon: 'user',
    overview: 'Protects women from harassment, domestic abuse, sexual misconduct, and guarantees equal inheritance under specialized laws.',
    rights: [
      { name: 'Protection against Harassment (POSH)', desc: 'Right to have a safe work environment free from sexual advances or hostile environments.' },
      { name: 'Right to Maternity Benefits', desc: '26 weeks of paid leave for female employees under the Maternity Benefit Act.' },
      { name: 'Right against Domestic Violence', desc: 'Comprehensive legal shield against physical, emotional, and financial abuse.' },
      { name: 'Right to Equal Property Share', desc: 'Equal right to inherit ancestral property under Hindu Succession Amendment Act.' }
    ],
    scenarios: [
      { situation: 'Facing mental and physical abuse from husband and in-laws.', action: 'Call 1091 (Women helpline) or file case under DV Act.' },
      { situation: 'Colleague makes inappropriate gestures and comments in office.', action: 'Submit written complaint to the company\'s Internal Complaints Committee (ICC).' }
    ],
    laws: [
      { name: 'POSH Act, 2013', details: 'Requires all firms with 10+ employees to constitute an ICC.' },
      { name: 'Protection of Women from Domestic Violence Act, 2005', details: 'Civil remedies like protection, residence, and maintenance orders.' }
    ],
    faqs: [
      { q: 'What is a zero FIR?', a: 'A woman can file a criminal complaint at ANY police station, regardless of where the incident occurred. It will later be transferred.' },
      { q: 'Is maternity leave paid?', a: 'Yes, full average daily wage must be paid during maternity leave.' }
    ],
    resources: [
      { name: 'National Commission for Women', url: 'http://ncw.nic.in' },
      { name: 'She-Box Online Portal', url: 'https://shebox.wcd.gov.in' }
    ]
  },
  'property': {
    title: 'Property & Land Rights',
    icon: 'home',
    overview: 'Governs registry of deeds, protection of titles, partition, tenancy, and real estate buyers protection.',
    rights: [
      { name: 'Right to Own Property', desc: 'Constitutional right under Article 300A protecting citizens from arbitrary seizure of property.' },
      { name: 'Right to Land Mutation', desc: 'Right to update land registers (Khata/Jamabandi) post registration.' },
      { name: 'RERA Protections', desc: 'Homebuyers right to claim interest and compensation for builder delays.' }
    ],
    scenarios: [
      { situation: 'Builder delays flat possession by more than 2 years.', action: 'File compensation case with State RERA.' },
      { situation: 'Encroachers build temporary structure on agricultural land.', action: 'File civil suit for injunction and recovery of possession.' }
    ],
    laws: [
      { name: 'Transfer of Property Act, 1882', details: 'Governs sale, lease, mortgage, and exchange of immovable property.' },
      { name: 'RERA Act, 2016', details: 'Real Estate Regulatory Authority framework.' }
    ],
    faqs: [
      { q: 'What is land mutation?', a: 'Transfer of ownership title in the local revenue authority registers. Sale deed registry is not complete without mutation.' },
      { q: 'How long can a civil property suit take?', a: 'Usually 1 to 3 years in trial courts, but ADR (Mediation) can expedite it.' }
    ],
    resources: [
      { name: 'Ministry of Housing and Urban Affairs', url: 'https://mohua.gov.in' },
      { name: 'State RERA Portals', url: 'https://rera.delhi.gov.in' } // Placeholder for state RERA
    ]
  },
  'cyber': {
    title: 'Cyber Crime & Privacy',
    icon: 'shield',
    overview: 'Shields citizens against identity theft, credit card cloning, online extortion, data breaches, and cyberstalking.',
    rights: [
      { name: 'Right to Digital Privacy', desc: 'Right to protect personal credentials under IT rules and DPDP Act.' },
      { name: 'Right against Online Stalking', desc: 'Protection against abusers tracking/calling you online.' },
      { name: 'Right to Data Removal', desc: 'Request search engines or platforms to remove defamatory/morphed pictures.' }
    ],
    scenarios: [
      { situation: 'Morphed photos leaked on instagram by online blackmailer.', action: 'File case at cybercrime.gov.in and platform safety desk.' },
      { situation: 'Received phishing calls offering loan updates and asking for OTP.', action: 'Call 1930 and report numbers to TRAI (Chakshu portal).' }
    ],
    laws: [
      { name: 'Information Technology Act, 2000', details: 'Governs electronic signatures, computer resource offences, and digital liabilities.' },
      { name: 'DPDP Act, 2023', details: 'Digital Personal Data Protection framework for user consent.' }
    ],
    faqs: [
      { q: 'What is the timeline to report cyber financial fraud?', a: 'Within 2 hours (Golden Hour) is best to freeze transaction loops, but not later than 24 hours.' },
      { q: 'Is sharing an OTP a crime?', a: 'Not a crime, but it increases customer liability under bank rules. Report it immediately.' }
    ],
    resources: [
      { name: 'National Cyber Crime Reporting Portal', url: 'https://cybercrime.gov.in' },
      { name: 'Sanchar Saathi (Chakshu)', url: 'https://sancharsaathi.gov.in' }
    ]
  },
  'student': {
    title: 'Student Rights',
    icon: 'graduation-cap',
    overview: 'Guarantees access to free elementary education, protects from ragging, and defines grievance procedures for college exams.',
    rights: [
      { name: 'Right to Education (RTE)', desc: 'Free and compulsory education for children aged 6 to 14 under Article 21A.' },
      { name: 'Right against Ragging', desc: 'Constitutional and statutory protection from mental/physical abuse in institutions.' },
      { name: 'Access to Answer Scripts', desc: 'Right to obtain certified photocopies of evaluative exam answer sheets under RTI.' }
    ],
    scenarios: [
      { situation: 'College seniors forcing juniors to perform degrading tasks.', action: 'File complaint with UGC anti-ragging cell (1800-180-5522).' },
      { situation: 'Board exam revaluation request ignored without any reason.', action: 'File application under RTI Act for answer sheet retrieval.' }
    ],
    laws: [
      { name: 'Right of Children to Free and Compulsory Education Act, 2009', details: 'Statutory mandate for universal elementary schooling.' },
      { name: 'UGC Anti-Ragging Regulations, 2009', details: 'Severe penal actions against ragging in higher education.' }
    ],
    faqs: [
      { q: 'What is the anti-ragging helpline?', a: 'Toll-free national anti-ragging helpline is 1800-180-5522.' },
      { q: 'Can a school refuse admission due to lack of document?', a: 'Under RTE, schools cannot deny admission for lack of birth certificates or documents.' }
    ],
    resources: [
      { name: 'National Anti-Ragging Portal', url: 'https://antiragging.in' },
      { name: 'Ministry of Education', url: 'https://education.gov.in' }
    ]
  },
  'senior': {
    title: 'Senior Citizen Rights',
    icon: 'users',
    overview: 'Ensures elderly care, maintenance claims from offspring, hospital priorities, and protective pension rights.',
    rights: [
      { name: 'Right to Maintenance', desc: 'Elderly parents can claim monthly maintenance from children if unable to support themselves.' },
      { name: 'Asset Revocation', desc: 'Right to revoke property gifted to offspring if they fail to provide basic care.' },
      { name: 'Priority in Legal Cases', desc: 'Expedited hearings and court chambers for senior citizens.' }
    ],
    scenarios: [
      { situation: 'Children vacate parents from ancestral home after transferring title deeds.', action: 'File petition with Maintenance Tribunal to cancel the gift deed.' },
      { situation: 'Hospital refuses senior citizen priority queue/bed allotment.', action: 'Escalate to Chief Medical Officer citing Senior Citizens guidelines.' }
    ],
    laws: [
      { name: 'Maintenance and Welfare of Parents and Senior Citizens Act, 2007', details: 'Makes it legal obligation for children to provide food, shelter, and medical care.' }
    ],
    faqs: [
      { q: 'Who counts as a senior citizen?', a: 'Any citizen of India who has attained the age of 60 years or above.' },
      { q: 'What is the maximum maintenance amount?', a: 'Under the 2007 Act, Maintenance Tribunals can award up to ₹10,000 per month.' }
    ],
    resources: [
      { name: 'Elderline National Helpline', url: 'https://elderline.dosje.gov.in' }, // 14567
      { name: 'Ministry of Social Justice', url: 'https://socialjustice.gov.in' }
    ]
  },
  'rti': {
    title: 'RTI Rights',
    icon: 'file-text',
    overview: 'Empowers citizens to demand files, logs, records, and information from any public authority or department.',
    rights: [
      { name: 'Right to Inspect Public Work', desc: 'Inspect state files, public records, and sample materials of ongoing work.' },
      { name: 'Right to Certified Copies', desc: 'Demand certified sheets of government data, circulars, or files.' },
      { name: 'Right to Timely Response', desc: 'Public Information Officers (PIO) must provide files within 30 days.' }
    ],
    scenarios: [
      { situation: 'Road repairs in the locality delayed for months despite budget allocations.', action: 'File RTI query asking for contract papers, sanctions, and release statements.' },
      { situation: 'Government job exam results delayed by 6 months without notice.', action: 'Submit online RTI seeking selection files and timelines.' }
    ],
    laws: [
      { name: 'Right to Information Act, 2005', details: 'Statutory mandate for government transparency and public information accessibility.' }
    ],
    faqs: [
      { q: 'What is the fee to file an RTI?', a: '₹10 for general category. Below Poverty Line (BPL) applicants are exempt from payment.' },
      { q: 'What if PIO fails to reply in 30 days?', a: 'You can file a First Appeal within 30 days to the designated First Appellate Authority.' }
    ],
    resources: [
      { name: 'RTI Online Portal', url: 'https://rtionline.gov.in' },
      { name: 'Central Information Commission', url: 'https://cic.gov.in' }
    ]
  }
};

let currentCategoryFilter = 'all';

function renderLibraryCards() {
  const container = document.getElementById('library-cards-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  const searchInput = document.getElementById('library-search-input');
  const query = searchInput ? searchInput.value.toLowerCase() : '';
  
  for (const [id, data] of Object.entries(rightsLibraryData)) {
    // Filter logic
    if (currentCategoryFilter !== 'all' && currentCategoryFilter !== id) continue;
    
    // Search logic
    if (query && !data.title.toLowerCase().includes(query) && !data.overview.toLowerCase().includes(query)) continue;
    
    const colors = {
      'consumer': '245, 158, 11', // amber
      'labour': '100, 116, 139', // slate
      'womens': '236, 72, 153', // pink
      'property': '37, 99, 235', // blue
      'cyber': '239, 68, 68', // red
      'student': '16, 185, 129', // emerald
      'senior': '255, 153, 51', // saffron
      'rti': '139, 92, 246' // violet
    };
    const cardColor = colors[id] || '37, 99, 235';

    const card = document.createElement('div');
    card.className = 'glass-card library-card tilt-card reveal-3d';
    card.style.setProperty('--portal-color', cardColor);
    card.setAttribute('onclick', `expandLibraryCategory('${id}')`);
    card.innerHTML = `
      <div class="library-header">
        <div class="library-icon">
          <i data-lucide="${data.icon}"></i>
        </div>
        <h3>${data.title}</h3>
      </div>
      <p class="library-content-preview">${data.overview}</p>
      <a href="javascript:void(0)" class="library-footer-link">
        Explore Category Detail <i data-lucide="arrow-right" style="width:1.1rem; height:1.1rem;"></i>
      </a>
    `;
    container.appendChild(card);
  }
  
  // Re-run lucide and tilt effect
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // Custom reveal activation since cards are appended dynamically
  setTimeout(() => {
    const revealElements = container.querySelectorAll('.reveal, .reveal-3d');
    revealElements.forEach(el => el.classList.add('active'));
  }, 100);
}

function filterLibrary(catId, btnEl) {
  currentCategoryFilter = catId;
  
  // Toggle active class on buttons
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (btnEl) btnEl.classList.add('active');
  
  renderLibraryCards();
}

function expandLibraryCategory(id) {
  const data = rightsLibraryData[id];
  if (!data) return;
  
  // Close existing expanded view if open
  const mainContentEl = document.getElementById('library-main-content');
  if (!mainContentEl) return;
  
  // Renders the full structured panel
  let rightsHtml = '';
  data.rights.forEach(r => {
    rightsHtml += `
      <div class="glass-card right-detail-card">
        <h3>${r.name}</h3>
        <p>${r.desc}</p>
      </div>
    `;
  });
  
  let scenariosHtml = '';
  data.scenarios.forEach(s => {
    scenariosHtml += `
      <div class="glass-card" style="padding:1.25rem; margin-bottom:0.75rem;">
        <h4 style="color:var(--text-main); font-weight:700;"><i data-lucide="help-circle" style="color:var(--accent); display:inline-block; vertical-align:middle; margin-right:0.5rem; width:1.2rem; height:1.2rem;"></i> Scenario: ${s.situation}</h4>
        <p style="margin-top:0.5rem; font-size:0.95rem; font-weight:500;"><span style="color:#22c55e;">✔ Action Path:</span> ${s.action}</p>
      </div>
    `;
  });
  
  let lawsHtml = '';
  data.laws.forEach(l => {
    lawsHtml += `
      <div class="glass-card" style="padding:1.25rem; border-left: 4px solid var(--primary); margin-bottom:0.75rem;">
        <h4 style="color:var(--text-main);">${l.name}</h4>
        <p style="font-size:0.9rem; margin-top:0.25rem;">${l.details}</p>
      </div>
    `;
  });
  
  let faqsHtml = '';
  data.faqs.forEach((faq, idx) => {
    faqsHtml += `
      <div class="faq-item glass-card" id="lib-faq-${idx}" style="padding:0; margin-bottom:0.75rem;">
        <button class="faq-trigger" onclick="toggleLibFAQ('lib-faq-${idx}')">
          <span>${faq.q}</span>
          <i data-lucide="chevron-down"></i>
        </button>
        <div class="faq-content">
          <div class="faq-content-inner">
            <p>${faq.a}</p>
          </div>
        </div>
      </div>
    `;
  });
  
  let resourcesHtml = '';
  data.resources.forEach(res => {
    resourcesHtml += `
      <a href="${res.url}" target="_blank" class="resource-link-box">
        <span>${res.name}</span>
        <i data-lucide="external-link" style="width:1.1rem; height:1.1rem;"></i>
      </a>
    `;
  });
  
  mainContentEl.innerHTML = `
    <div class="expanded-category-panel fade-in">
      <div class="category-hero">
        <div class="category-hero-icon">
          <i data-lucide="${data.icon}"></i>
        </div>
        <div class="category-hero-details">
          <button onclick="resetLibraryView()" class="btn btn-secondary" style="padding:0.4rem 0.8rem; font-size:0.8rem; margin-bottom:0.5rem;">
            <i data-lucide="arrow-left" style="width:0.85rem; height:0.85rem;"></i> Back to Library Grid
          </button>
          <h2>${data.title}</h2>
          <p>${data.overview}</p>
        </div>
      </div>
      
      <div>
        <h3 style="font-size:1.5rem; margin-bottom:1.25rem; border-bottom:2px solid var(--border); padding-bottom:0.5rem;">Guaranteed Statutory Rights</h3>
        <div class="rights-section-grid">
          ${rightsHtml}
        </div>
      </div>
      
      <div>
        <h3 style="font-size:1.5rem; margin-bottom:1.25rem; border-bottom:2px solid var(--border); padding-bottom:0.5rem;">Common Real-Life Scenarios</h3>
        ${scenariosHtml}
      </div>
      
      <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap:2rem;">
        <div>
          <h3 style="font-size:1.5rem; margin-bottom:1.25rem; border-bottom:2px solid var(--border); padding-bottom:0.5rem;">Frequently Asked Questions</h3>
          <div class="faq-accordion">
            ${faqsHtml}
          </div>
        </div>
        <div>
          <h3 style="font-size:1.5rem; margin-bottom:1.25rem; border-bottom:2px solid var(--border); padding-bottom:0.5rem;">Official Authorities & Laws</h3>
          <h4 style="font-size:1.1rem; margin-bottom:0.75rem;">Relevant Acts:</h4>
          ${lawsHtml}
          
          <h4 style="font-size:1.1rem; margin-top:1.5rem; margin-bottom:0.75rem;">Verified Portals:</h4>
          <div style="display:flex; flex-direction:column; gap:0.5rem;">
            ${resourcesHtml}
          </div>
        </div>
      </div>
    </div>
  `;
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function resetLibraryView() {
  const mainContentEl = document.getElementById('library-main-content');
  if (!mainContentEl) return;
  
  mainContentEl.innerHTML = `
    <div id="library-cards-container" class="library-grid">
      <!-- Appended by JS -->
    </div>
  `;
  renderLibraryCards();
}

function toggleLibFAQ(itemId) {
  const item = document.getElementById(itemId);
  if (!item) return;
  
  const content = item.querySelector('.faq-content');
  const isActive = item.classList.contains('active');
  
  // Close all other FAQs in this container
  const parent = item.closest('.faq-accordion');
  if (parent) {
    parent.querySelectorAll('.faq-item').forEach(el => {
      el.classList.remove('active');
      const c = el.querySelector('.faq-content');
      if (c) c.style.maxHeight = null;
    });
  }
  
  if (!isActive) {
    item.classList.add('active');
    content.style.maxHeight = content.scrollHeight + "px";
  } else {
    item.classList.remove('active');
    content.style.maxHeight = null;
  }
}

// Attach event listeners
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('library-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      // If we are currently viewing an expanded detail, reset back to grid first
      const container = document.getElementById('library-cards-container');
      if (!container) {
        resetLibraryView();
      } else {
        renderLibraryCards();
      }
    });
  }
  
  renderLibraryCards();
});

window.filterLibrary = filterLibrary;
window.expandLibraryCategory = expandLibraryCategory;
window.resetLibraryView = resetLibraryView;
window.toggleLibFAQ = toggleLibFAQ;
window.renderLibraryCards = renderLibraryCards;
