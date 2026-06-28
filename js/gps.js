// Legal GPS Data and Engine for AajNyay
const gpsFlows = {
  'upi-fraud': {
    title: 'UPI Fraud & Cyber Theft',
    resolutionTime: '7 - 14 Days',
    steps: [
      {
        type: 'select',
        question: 'How did the UPI fraud occur?',
        options: [
          { label: 'Scanned a QR code from an unknown sender', value: 'qr_scan', next: 1 },
          { label: 'Clicked a phishing link in SMS/Email', value: 'phishing_link', next: 1 },
          { label: 'Shared OTP/UPI PIN with a caller claiming to be a bank agent', value: 'otp_pin_shared', next: 1 },
          { label: 'Unauthorized transaction without PIN sharing (SIM swap/clone)', value: 'unauthorized_clone', next: 1 }
        ]
      },
      {
        type: 'select',
        question: 'When did the transaction take place?',
        options: [
          { label: 'Within the last 24 hours (Golden Hour)', value: 'under_24h', next: 2 },
          { label: 'Between 24 to 72 hours ago', value: '24h_to_72h', next: 2 },
          { label: 'More than 3 days (72 hours) ago', value: 'over_72h', next: 2 }
        ]
      },
      {
        type: 'select',
        question: 'What is the amount lost in the transaction?',
        options: [
          { label: 'Under ₹5,000', value: 'small_amount', next: 3 },
          { label: '₹5,000 to ₹50,000', value: 'medium_amount', next: 3 },
          { label: 'Above ₹50,000', value: 'large_amount', next: 3 }
        ]
      },
      {
        type: 'checkbox',
        question: 'What evidence do you have available? (Select all)',
        options: [
          { label: 'Transaction Reference ID & SMS alerts', value: 'evidence_sms' },
          { label: 'Bank account statement showing debit', value: 'evidence_statement' },
          { label: 'Screenshots of whatsapp chat or website of fraudster', value: 'evidence_chats' },
          { label: 'Phone number/UPI ID of the recipient fraudster', value: 'evidence_recipient' }
        ],
        next: null // Terminal step
      }
    ],
    generatePlan: (answers) => {
      const isGoldenHour = answers[1] === 'under_24h';
      const isHighAmount = answers[2] === 'large_amount';
      const urgency = isGoldenHour ? 'high' : (isHighAmount ? 'medium' : 'low');
      
      let nextAction = 'Call the National Cyber Crime Helpline at 1930 immediately to freeze the recipient bank account.';
      if (!isGoldenHour) {
        nextAction = 'File an official complaint on the Cyber Crime portal (cybercrime.gov.in) and submit the reference number to your bank.';
      }

      return {
        title: 'UPI Fraud Action Roadmap',
        urgency: urgency,
        urgencyLabel: urgency === 'high' ? 'CRITICAL (Immediate Action Required)' : (urgency === 'medium' ? 'HIGH PRIORITY' : 'MODERATE'),
        nextAction: nextAction,
        laws: [
          { name: 'Section 66D of the IT Act, 2000', desc: 'Punishment for cheating by personation using computer resource (up to 3 years imprisonment).' },
          { name: 'Section 420 of IPC / Section 318 of BNS', desc: 'Cheating and dishonestly inducing delivery of property.' },
          { name: 'RBI Circular on Customer Liability (2017)', desc: 'Zero liability if unauthorized transaction is reported within 3 days.' }
        ],
        documents: [
          'Bank statement showing the fraudulent debits',
          'UPI Transaction ID & Screenshot of the confirmation page',
          'Phone numbers / UPI ID of the fraudster (if available)',
          'Cyber complaint acknowledgement slip'
        ],
        authorities: [
          { name: 'National Cyber Crime Bureau', link: 'https://cybercrime.gov.in', contact: '1930 (Helpline)' },
          { name: 'Your Bank Branch Manager', desc: 'File written dispute letter within 3 days of transaction to claim RBI zero-liability protection.' }
        ],
        mistakes: [
          'Do NOT share your full UPI PIN or bank OTP with anyone promising to return your money.',
          'Do NOT delete SMS alerts or WhatsApp chats; these are crucial digital evidence.'
        ],
        escalations: [
          { time: 'Day 1', task: 'Call 1930 and file complaint at cybercrime.gov.in. Notify bank to block your UPI ID.' },
          { time: 'Day 3', task: 'Submit written complaint with cyber FIR copy to home branch and get an acknowledgement stamp.' },
          { time: 'Day 30', task: 'If bank does not resolve, escalate to the Banking Ombudsman (RBI CMS portal).' }
        ]
      };
    }
  },
  'salary-unpaid': {
    title: 'Unpaid Salary Recovery',
    resolutionTime: '30 - 60 Days',
    steps: [
      {
        type: 'select',
        question: 'How long has your salary been delayed?',
        options: [
          { label: '1 to 2 months', value: '1_to_2_months', next: 1 },
          { label: '3 to 6 months', value: '3_to_6_months', next: 1 },
          { label: 'More than 6 months', value: 'over_6_months', next: 1 }
        ]
      },
      {
        type: 'select',
        question: 'What is your employment category?',
        options: [
          { label: 'Permanent Employee (With appointment letter)', value: 'permanent_employee', next: 2 },
          { label: 'Contractual / Freelance worker', value: 'contractor', next: 2 },
          { label: 'Unorganized sector employee (No formal letter)', value: 'unorganized', next: 2 }
        ]
      },
      {
        type: 'select',
        question: 'Have you formally requested your outstanding salary in writing (Email/Letter)?',
        options: [
          { label: 'Yes, sent official emails and reminders', value: 'yes_requested', next: 3 },
          { label: 'No, only discussed verbally / on phone', value: 'no_requested', next: 3 }
        ]
      },
      {
        type: 'checkbox',
        question: 'Which of the following documents do you possess?',
        options: [
          { label: 'Employment Offer/Appointment Letter', value: 'doc_offer' },
          { label: 'Salary slips / Payslips (even old ones)', value: 'doc_slips' },
          { label: 'Bank Statement showing past salary credits', value: 'doc_statement' },
          { label: 'Official email ID chats or WhatsApp messages from HR/Manager', value: 'doc_emails' }
        ],
        next: null
      }
    ],
    generatePlan: (answers) => {
      const isLongDelay = answers[0] !== '1_to_2_months';
      const isContract = answers[1] === 'contractor';
      const hasWritten = answers[2] === 'yes_requested';
      
      const urgency = isLongDelay ? 'medium' : 'low';
      
      let nextAction = 'Draft and send a formal Demand Letter (Legal Notice) to the company requesting salary clearance within 15 days.';
      if (!hasWritten) {
        nextAction = 'Send an official email to the HR and CEO requesting salary clearance and detailing your unpaid dues before taking legal steps.';
      }

      return {
        title: 'Salary Recovery Action Roadmap',
        urgency: urgency,
        urgencyLabel: urgency === 'medium' ? 'HIGH PRIORITY' : 'MODERATE',
        nextAction: nextAction,
        laws: [
          { name: 'Payment of Wages Act, 1936', desc: 'Mandates salary payment before 7th or 10th of every month. Applies to salaries under limit.' },
          { name: 'Section 447 of Companies Act, 2013', desc: 'Frauds and non-payment of employee dues.' },
          { name: 'Section 70 of Indian Contract Act, 1872', desc: 'Obligation of person enjoying benefit of non-gratuitous act (for contractors).' }
        ],
        documents: [
          'Appointment letter / Contract agreement',
          'Bank statement showing the non-credit months',
          'Past salary slips',
          'Copy of communication (emails/chats) requesting outstanding dues'
        ],
        authorities: [
          { name: 'Office of the Labor Commissioner', desc: 'File a conciliation application under the Industrial Disputes Act.' },
          { name: 'National Company Law Tribunal (NCLT)', desc: 'If company is insolvent, initiate insolvency proceedings for dues above ₹1 Lakh.' },
          { name: 'Civil Court', desc: 'File a summary suit (Order 37 CPC) for recovery of money.' }
        ],
        mistakes: [
          'Do NOT sign any full-and-final settlement or resignation paper acknowledging receipt of dues before you actually get the money.',
          'Do NOT leave the company properties (laptop/ID) without written documentation, to avoid claims of assets withholding.'
        ],
        escalations: [
          { time: 'Day 1', task: 'Send formal final demand email to HR/Management. Draft demand summary.' },
          { time: 'Day 7', task: 'Consult a lawyer or use AajNyay template to draft and send an official Legal Notice.' },
          { time: 'Day 22', task: 'If no payment received, file a complaint with the Local Labor Court/Labor Commissioner office.' }
        ]
      };
    }
  },
  'consumer-complaint': {
    title: 'Consumer Complaint GPS',
    resolutionTime: '15 - 45 Days',
    steps: [
      {
        type: 'select',
        question: 'What is the nature of your consumer grievance?',
        options: [
          { label: 'Defective product received (Electronics, vehicle, etc.)', value: 'defective_product', next: 1 },
          { label: 'Deficient service (Travel, internet, banking delays)', value: 'deficient_service', next: 1 },
          { label: 'Overcharging / Selling above MRP', value: 'overcharging', next: 1 },
          { label: 'Refusal to refund / exchange within terms', value: 'refund_refusal', next: 1 }
        ]
      },
      {
        type: 'select',
        question: 'Have you registered a ticket/complaint with the brand\'s customer service?',
        options: [
          { label: 'Yes, received a ticket/case number', value: 'yes_ticket', next: 2 },
          { label: 'Yes, but received no response/resolution', value: 'yes_unresolved', next: 2 },
          { label: 'No, haven\'t contacted the brand directly yet', value: 'no_contact', next: 2 }
        ]
      },
      {
        type: 'select',
        question: 'What is the monetary value of the product or service?',
        options: [
          { label: 'Under ₹50,000', value: 'val_under_50k', next: 3 },
          { label: '₹50,000 to ₹5 Lakhs', value: 'val_50k_to_5l', next: 3 },
          { label: 'Above ₹5 Lakhs', value: 'val_over_5l', next: 3 }
        ]
      },
      {
        type: 'checkbox',
        question: 'Select the supporting documents you have:',
        options: [
          { label: 'Purchase invoice / Bill of transaction', value: 'doc_invoice' },
          { label: 'Warranty card / Service center job sheet', value: 'doc_warranty' },
          { label: 'Customer care ticket logs or emails', value: 'doc_ticket' },
          { label: 'Unboxing video / Photographs of defect', value: 'doc_photo' }
        ],
        next: null
      }
    ],
    generatePlan: (answers) => {
      const isUnresolved = answers[1] === 'yes_unresolved';
      const isLargeValue = answers[2] !== 'val_under_50k';
      
      const urgency = isUnresolved ? 'medium' : 'low';
      let nextAction = 'File an online complaint with the National Consumer Helpline (NCH) portal or call 1915.';
      if (answers[1] === 'no_contact') {
        nextAction = 'Register a complaint with the brand\'s support and obtain a support ticket number.';
      }

      return {
        title: 'Consumer Dispute Recovery Plan',
        urgency: urgency,
        urgencyLabel: urgency === 'medium' ? 'HIGH PRIORITY' : 'MODERATE',
        nextAction: nextAction,
        laws: [
          { name: 'Consumer Protection Act, 2019', desc: 'Establishes a 3-tier quasi-judicial mechanism (District, State, National) and introduces penalties for unfair trade practices.' },
          { name: 'Right to Safety, Information, Choice, and Redressal', desc: 'Key statutory rights of every consumer in India.' }
        ],
        documents: [
          'Purchase receipt / Tax invoice',
          'Photographs / Videos of the defect',
          'Emails sent to customer support & system tickets',
          'Warranty certificate (if applicable)'
        ],
        authorities: [
          { name: 'National Consumer Helpline (NCH)', link: 'https://consumerhelpline.gov.in', contact: '1915 (Helpline)' },
          { name: 'District Consumer Disputes Redressal Commission', desc: 'File formal consumer case if NCH conciliation fails.' }
        ],
        mistakes: [
          'Do NOT throw away the original packaging, labels, or shipping boxes, as brands often demand them for processing replacements.',
          'Do NOT delay filing; the statute of limitation for consumer complaints is 2 years from the cause of action.'
        ],
        escalations: [
          { time: 'Day 1', task: 'Register a complaint on consumerhelpline.gov.in or via the NCH app.' },
          { time: 'Day 15', task: 'If unresolved, send a formal Legal Notice to the company\'s registered office.' },
          { time: 'Day 30', task: 'File online case via the e-Daakhil portal (edaakhil.nic.in) to the District Commission.' }
        ]
      };
    }
  },
  'rental-deposit': {
    title: 'Rental Deposit Dispute Recovery',
    resolutionTime: '15 - 30 Days',
    steps: [
      {
        type: 'select',
        question: 'Do you have a registered rent agreement?',
        options: [
          { label: 'Yes, registered with stamp duty', value: 'yes_registered', next: 1 },
          { label: 'Yes, but notarized only (Not registered)', value: 'yes_notarized', next: 1 },
          { label: 'No agreement exists / Verbal contract only', value: 'no_agreement', next: 1 }
        ]
      },
      {
        type: 'select',
        question: 'What reason did the landlord give for withholding the deposit?',
        options: [
          { label: 'Unreasonable deductions for painting / wear & tear', value: 'painting_wear', next: 2 },
          { label: 'Refused to pay without giving any reason', value: 'no_reason', next: 2 },
          { label: 'Claims you damaged properties / broke lock-in period', value: 'damage_lockin', next: 2 }
        ]
      },
      {
        type: 'select',
        question: 'Have you officially vacated the premises and handed over the keys?',
        options: [
          { label: 'Yes, keys handed over and inventory checked', value: 'yes_vacated', next: 3 },
          { label: 'No, still in the house / Vacating soon', value: 'no_vacated', next: 3 }
        ]
      },
      {
        type: 'checkbox',
        question: 'Select the evidence you have:',
        options: [
          { label: 'Rent Agreement copy', value: 'evidence_rent_agreement' },
          { label: 'Security deposit receipt / Bank transaction slip', value: 'evidence_deposit_receipt' },
          { label: 'Photos of the flat condition when vacating', value: 'evidence_flat_photos' },
          { label: 'Chat messages (WhatsApp/Emails) showing deposit dispute', value: 'evidence_chats' }
        ],
        next: null
      }
    ],
    generatePlan: (answers) => {
      const hasAgreement = answers[0] !== 'no_agreement';
      const urgency = hasAgreement ? 'medium' : 'low';
      
      let nextAction = 'Send a written inventory handover report along with pictures to the landlord, and demand the deposit refund via registered email.';
      if (answers[1] === 'no_reason') {
        nextAction = 'Draft a formal Legal Notice to be sent to the landlord demanding deposit refund with interest within 15 days.';
      }

      return {
        title: 'Rental Deposit Dispute Guide',
        urgency: urgency,
        urgencyLabel: urgency === 'medium' ? 'HIGH PRIORITY' : 'MODERATE',
        nextAction: nextAction,
        laws: [
          { name: 'Model Tenancy Act, 2021', desc: 'Limits security deposit to maximum 2 months rent for residential and 6 months for commercial properties. Mandates deposit refund on premises handover.' },
          { name: 'State Rent Control Acts', desc: 'Governs local disputes and summary court actions.' }
        ],
        documents: [
          'Rent agreement copy',
          'Bank statement showing the security deposit credit',
          'Notice of vacating sent to the landlord',
          'Photographs showing the empty flat condition'
        ],
        authorities: [
          { name: 'Rent Authority / Rent Court', desc: 'File a petition under the local Model Tenancy Rules for dispute settlement.' },
          { name: 'Small Causes Civil Court', desc: 'File a recovery suit for the security deposit money.' }
        ],
        mistakes: [
          'Do NOT hand over keys without taking photographs of every room to prevent fake claims of damages.',
          'Do NOT accept verbal promises for deposit refund; insist on an electronic bank transfer date.'
        ],
        escalations: [
          { time: 'Day 1', task: 'Send a formal email requesting security deposit calculation with list of deductions.' },
          { time: 'Day 7', task: 'Send a Legal Notice detailing the Tenancy clauses and threat of litigation.' },
          { time: 'Day 22', task: 'File a dispute with the local Rent Tribunal/Authority.' }
        ]
      };
    }
  },
  'workplace-harassment': {
    title: 'Workplace Harassment Redressal',
    resolutionTime: '30 - 90 Days',
    steps: [
      {
        type: 'select',
        question: 'What is the nature of the harassment?',
        options: [
          { label: 'Sexual harassment (Unwelcome physical contact, remarks, demands)', value: 'sexual_harassment', next: 1 },
          { label: 'Bullying / Hostile work environment (Verbal abuse, mental pressure)', value: 'bullying_hostile', next: 1 },
          { label: 'Discriminatory practices (Gender, caste, religion biased treatment)', value: 'discrimination', next: 1 }
        ]
      },
      {
        type: 'select',
        question: 'Does your company have an Internal Complaints Committee (ICC)?',
        options: [
          { label: 'Yes, the company has a functioning ICC', value: 'yes_icc', next: 2 },
          { label: 'No, or I am unsure if an ICC exists', value: 'no_icc', next: 2 },
          { label: 'Company has fewer than 10 employees (No ICC required)', value: 'small_company', next: 2 }
        ]
      },
      {
        type: 'select',
        question: 'Have you recorded or logged the instances of harassment?',
        options: [
          { label: 'Yes, maintained logs with dates, times, and witnesses', value: 'yes_logged', next: 3 },
          { label: 'No, but I remember specific instances', value: 'no_logged', next: 3 }
        ]
      },
      {
        type: 'checkbox',
        question: 'Select the documentation/evidence you can collect:',
        options: [
          { label: 'Emails / Slack chats containing inappropriate text', value: 'evidence_chats' },
          { label: 'Audio recordings or call voice records', value: 'evidence_audio' },
          { label: 'Names of colleagues who witnessed the behavior', value: 'evidence_witnesses' },
          { label: 'Written journal detailing incidents with dates', value: 'evidence_journal' }
        ],
        next: null
      }
    ],
    generatePlan: (answers) => {
      const isPOSH = answers[0] === 'sexual_harassment';
      const hasICC = answers[1] === 'yes_icc';
      const urgency = isPOSH ? 'high' : 'medium';
      
      let nextAction = 'Submit a formal written complaint detailing all incidents to your company\'s Internal Complaints Committee (ICC).';
      if (!hasICC && isPOSH) {
        nextAction = 'Register a complaint on the She-Box portal (Government of India) or contact the Local Complaints Committee (LCC).';
      }

      return {
        title: 'Workplace Harassment Action Roadmap',
        urgency: urgency,
        urgencyLabel: urgency === 'high' ? 'CRITICAL (High Urgency)' : 'HIGH PRIORITY',
        nextAction: nextAction,
        laws: [
          { name: 'POSH Act, 2013', desc: 'Prevention, Prohibition and Redressal of Sexual Harassment of Women at Workplace. Mandates ICC for 10+ employees.' },
          { name: 'Section 354A of IPC / Section 75 of BNS', desc: 'Sexual harassment and punishment.' },
          { name: 'Labor Laws on Hostile Workplaces', desc: 'Protects employees from unfair termination or mental harassment.' }
        ],
        documents: [
          'Detailed narrative of incidents with dates and locations',
          'Screenshots of electronic communications (Slack, WhatsApp, Email)',
          'Any audio/video records of the behavior',
          'Medical certificate or psychological consult files (if relevant)'
        ],
        authorities: [
          { name: 'Internal Complaints Committee (ICC)', desc: 'Must investigate complaints within 90 days.' },
          { name: 'Local Complaints Committee (LCC)', desc: 'District level committee for unorganized sector or companies with <10 employees.' },
          { name: 'Ministry of WCD She-Box Portal', link: 'https://shebox.wcd.gov.in', contact: 'Ministry of Women and Child Development' }
        ],
        mistakes: [
          'Do NOT resign in haste. Resigning may weaken your case; consult a legal aid advocate first.',
          'Do NOT discuss details of your POSH complaint with other colleagues to maintain confidentiality rules.'
        ],
        escalations: [
          { time: 'Day 1', task: 'Write down a detailed log of all events. Identify witnesses.' },
          { time: 'Day 5', task: 'Submit official complaint to the ICC or LCC. Request interim protection (like transfer).' },
          { time: 'Day 90', task: 'If ICC does not complete investigation or gives biased report, appeal to the Labor Court/Tribunal within 90 days.' }
        ]
      };
    }
  },
  'property-dispute': {
    title: 'Property Dispute GPS',
    resolutionTime: '90 - 365 Days',
    steps: [
      {
        type: 'select',
        question: 'What is the nature of the property dispute?',
        options: [
          { label: 'Illegal possession / Encroachment of land', value: 'encroachment', next: 1 },
          { label: 'Inheritance / Partition of ancestral property', value: 'inheritance', next: 1 },
          { label: 'Builder delay / Breach of flat sale agreement', value: 'builder_breach', next: 1 },
          { label: 'Title dispute / Double selling of same plot', value: 'title_dispute', next: 1 }
        ]
      },
      {
        type: 'select',
        question: 'Do you have registered deeds for the property?',
        options: [
          { label: 'Yes, registered Sale Deed / Gift Deed', value: 'yes_deed', next: 2 },
          { label: 'No, property is unregistered / POA only', value: 'no_deed', next: 2 },
          { label: 'Unsure, inheritance documents are incomplete', value: 'incomplete_docs', next: 2 }
        ]
      },
      {
        type: 'select',
        question: 'Is there currently a physical threat of dispossession?',
        options: [
          { label: 'Yes, other party is trying to construct or evict physically', value: 'yes_threat', next: 3 },
          { label: 'No, it is a legal dispute without physical threats', value: 'no_threat', next: 3 }
        ]
      },
      {
        type: 'checkbox',
        question: 'Select the documents you currently hold:',
        options: [
          { label: 'Sale Deed / Registry papers', value: 'doc_sale_deed' },
          { label: 'Property Tax receipts', value: 'doc_tax_receipt' },
          { label: 'Land Mutation records (Khata/Jamabandi)', value: 'doc_mutation' },
          { label: 'Electricity or Water bill in your name', value: 'doc_utility_bills' }
        ],
        next: null
      }
    ],
    generatePlan: (answers) => {
      const isBuilder = answers[0] === 'builder_breach';
      const hasThreat = answers[2] === 'yes_threat';
      const urgency = hasThreat ? 'high' : 'medium';
      
      let nextAction = 'File an application for a Temporary Injunction (Stay Order) in Civil Court to prevent any changes or illegal construction.';
      if (isBuilder) {
        nextAction = 'File a complaint against the builder in the State Real Estate Regulatory Authority (RERA).';
      }

      return {
        title: 'Property Dispute Resolution Path',
        urgency: urgency,
        urgencyLabel: urgency === 'high' ? 'CRITICAL (Physical Threat / Action Needed)' : 'HIGH PRIORITY',
        nextAction: nextAction,
        laws: [
          { name: 'Specific Relief Act, 1963', desc: 'Allows filing suits for recovery of possession of property and injunctions.' },
          { name: 'RERA Act, 2016', desc: 'Protects home buyers from builder delays and projects failures.' },
          { name: 'Section 145 of CrPC', desc: 'Inquiry by Magistrate where dispute concerning land is likely to cause breach of peace.' }
        ],
        documents: [
          'Registered Sale Deed / Title deed',
          'Khata/Mutation certificates',
          'Approved layout plans / Building sanction documents',
          'Police complaint copy (in case of physical encroachment)'
        ],
        authorities: [
          { name: 'Civil Court of Competent Jurisdiction', desc: 'For partition, title declaration, and injunction suits.' },
          { name: 'Real Estate Regulatory Authority (RERA)', desc: 'For builder dispute resolution.' },
          { name: 'Local Revenue Authority (Tahsildar/Sub-Registrar)', desc: 'For demarcation, land survey, and mutation updates.' }
        ],
        mistakes: [
          'Do NOT leave your property completely unattended. Install fencing, signboards, and CCTV cameras.',
          'Do NOT delay taking action; long-term delay might lead to the other party claiming adverse possession.'
        ],
        escalations: [
          { time: 'Day 1', task: 'File a police complaint for criminal trespass or encroachment. Gather mutation records.' },
          { time: 'Day 5', task: 'Instruct a property advocate to draft a legal notice or petition for RERA/Civil Court.' },
          { time: 'Day 15', task: 'File suit in Civil Court for Permanent Injunction and Declaration of Title.' }
        ]
      };
    }
  },
  'cyberbullying': {
    title: 'Cyberbullying & Online Harassment',
    resolutionTime: '3 - 7 Days',
    steps: [
      {
        type: 'select',
        question: 'Where is the cyberbullying taking place?',
        options: [
          { label: 'Social media platforms (Instagram, FB, Twitter)', value: 'social_media', next: 1 },
          { label: 'Messaging applications (WhatsApp, Telegram)', value: 'messaging_apps', next: 1 },
          { label: 'Emails, forums, or online gaming portals', value: 'emails_forums', next: 1 }
        ]
      },
      {
        type: 'select',
        question: 'Are there threats of leaking personal pictures (doxxing/extortion)?',
        options: [
          { label: 'Yes, blackmailing to leak private/intimate images', value: 'yes_leak_threat', next: 2 },
          { label: 'No, but constant abusive comments/messages', value: 'no_leak_threat', next: 2 }
        ]
      },
      {
        type: 'select',
        question: 'Have you blocked the abuser?',
        options: [
          { label: 'Yes, blocked but they are creating new profiles', value: 'yes_blocked_new_profiles', next: 3 },
          { label: 'No, I have kept the channel open to monitor', value: 'no_blocked', next: 3 }
        ]
      },
      {
        type: 'checkbox',
        question: 'Which evidence have you collected?',
        options: [
          { label: 'Screenshots of comments/messages showing sender details', value: 'evidence_scr_comments' },
          { label: 'Links to the abuser\'s social media profile', value: 'evidence_links' },
          { label: 'Call audio or threatening voice notes', value: 'evidence_audio' },
          { label: 'Emails/Header details of sender IP', value: 'evidence_emails' }
        ],
        next: null
      }
    ],
    generatePlan: (answers) => {
      const isBlackmail = answers[1] === 'yes_leak_threat';
      const urgency = isBlackmail ? 'high' : 'medium';
      
      let nextAction = 'Report the account directly on the social platform and file a case at cybercrime.gov.in.';
      if (isBlackmail) {
        nextAction = 'Call 1930 immediately and file a cyber FIR to prevent dissemination of private files.';
      }

      return {
        title: 'Cyberbullying Protection Plan',
        urgency: urgency,
        urgencyLabel: urgency === 'high' ? 'CRITICAL (Extortion Risk)' : 'HIGH PRIORITY',
        nextAction: nextAction,
        laws: [
          { name: 'Section 66E of the IT Act, 2000', desc: 'Punishment for violation of privacy (publishing private area photos without consent).' },
          { name: 'Section 67 & 67A of the IT Act, 2000', desc: 'Publishing sexually explicit content online.' },
          { name: 'Section 354D of IPC / Section 78 of BNS', desc: 'Stalking (including online monitoring and harassment).' }
        ],
        documents: [
          'Full-screen screenshots of comments / chats (showing date, time, and user ID)',
          'Profile link / URL of the perpetrator',
          'Evidence of blackmail (chats/emails)'
        ],
        authorities: [
          { name: 'Cyber Crime Portal', link: 'https://cybercrime.gov.in' },
          { name: 'Platform Safety Portal', desc: 'Submit immediate takedown requests (Instagram/FB/X Help Centers).' }
        ],
        mistakes: [
          'Do NOT delete your account immediately. Lock/restrict it, but keep the evidence safe.',
          'Do NOT engage or argue with the bully online; this may provoke them.'
        ],
        escalations: [
          { time: 'Hour 1', task: 'Take screenshots, record links. Block the abuser on all platforms.' },
          { time: 'Hour 3', task: 'File complaint on cybercrime.gov.in under the "Women & Child Cybercrime" section if applicable.' },
          { time: 'Day 2', task: 'Request platforms to remove the offensive content using their grievance officer email.' }
        ]
      };
    }
  },
  'domestic-violence': {
    title: 'Domestic Violence Redressal',
    resolutionTime: '1 - 7 Days',
    steps: [
      {
        type: 'select',
        question: 'Are you currently in immediate physical danger?',
        options: [
          { label: 'Yes, I need immediate protection and safe shelter', value: 'yes_danger', next: 1 },
          { label: 'No, but there is recurring physical / mental abuse', value: 'no_immediate_danger', next: 1 }
        ]
      },
      {
        type: 'select',
        question: 'Do you have a safe place to go (parents, friends, shelter)?',
        options: [
          { label: 'Yes, I can relocate to a safe relative\'s house', value: 'yes_safe_place', next: 2 },
          { label: 'No, I have no external support network nearby', value: 'no_safe_place', next: 2 }
        ]
      },
      {
        type: 'select',
        question: 'Are there children involved?',
        options: [
          { label: 'Yes, children are with me and also affected', value: 'yes_children', next: 3 },
          { label: 'No children involved', value: 'no_children', next: 3 }
        ]
      },
      {
        type: 'checkbox',
        question: 'What documentation or evidence is accessible?',
        options: [
          { label: 'Medical reports / MLC of injuries', value: 'evidence_medical' },
          { label: 'Photos of injuries or domestic damages', value: 'evidence_photos' },
          { label: 'Audio recordings of threats/fights', value: 'evidence_audio' },
          { label: 'Previous police complaints / NC reports', value: 'evidence_police' }
        ],
        next: null
      }
    ],
    generatePlan: (answers) => {
      const inDanger = answers[0] === 'yes_danger';
      const urgency = inDanger ? 'high' : 'medium';
      
      let nextAction = 'Call the Women Helpline at 1091 or Police at 112 immediately for emergency evacuation.';
      if (!inDanger) {
        nextAction = 'Contact a local Protection Officer or registered NGO to file a Domestic Incident Report (DIR).';
      }

      return {
        title: 'Domestic Abuse Protection Plan',
        urgency: urgency,
        urgencyLabel: urgency === 'high' ? 'CRITICAL (Immediate Danger)' : 'HIGH PRIORITY',
        nextAction: nextAction,
        laws: [
          { name: 'Protection of Women from Domestic Violence Act, 2005', desc: 'Quasi-civil act providing protection orders, residence orders, and monetary relief.' },
          { name: 'Section 498A of IPC / Section 85 of BNS', desc: 'Cruelty by husband or relatives of husband (criminal offence).' }
        ],
        documents: [
          'Proof of marriage (Certificate/Photos)',
          'MLC / Medical certificates of physical abuse',
          'Details of the husband\'s income/assets (for maintenance requests)',
          'Detailed statement of abuse incidents'
        ],
        authorities: [
          { name: 'National Commission for Women (NCW)', link: 'http://ncw.nic.in', contact: '011-26942369' },
          { name: 'Women Helpline', contact: '1091 (Helpline)' },
          { name: 'Protection Officers (appointed under DV Act)', desc: 'Contact via local magistrate court to submit Domestic Incident Report.' }
        ],
        mistakes: [
          'Do NOT stay silent. Contact helplines to create an official paper trail of incidents.',
          'Do NOT leave your personal identification files (Aadhaar, Passport) behind if vacating the house.'
        ],
        escalations: [
          { time: 'Hour 1', task: 'Call 112/1091. Move to a safe location with children.' },
          { time: 'Day 1', task: 'Get medical checkup (MLC) at government hospital for any physical injuries.' },
          { time: 'Day 3', task: 'Meet Protection Officer or file application under DV Act for Residence/Protection Order.' }
        ]
      };
    }
  },
  'lost-documents': {
    title: 'Lost Official Documents Registry',
    resolutionTime: '3 - 10 Days',
    steps: [
      {
        type: 'select',
        question: 'Which primary document have you lost?',
        options: [
          { label: 'Passport', value: 'lost_passport', next: 1 },
          { label: 'Aadhaar Card / Voter ID / PAN Card', value: 'lost_gov_id', next: 1 },
          { label: 'Property Title Deeds / Registry papers', value: 'lost_property_deeds', next: 1 },
          { label: 'Academic Certificates (Degree/10th-12th marksheets)', value: 'lost_academic', next: 1 }
        ]
      },
      {
        type: 'select',
        question: 'Do you know the registration details (Passport No., Aadhaar No., Deed No.)?',
        options: [
          { label: 'Yes, I have a photocopy / digital copy of the lost doc', value: 'yes_copy', next: 2 },
          { label: 'No, but I remember the ID numbers', value: 'no_copy_remember', next: 2 },
          { label: 'No, I have absolutely no details recorded', value: 'no_details', next: 2 }
        ]
      },
      {
        type: 'select',
        question: 'How did you lose the document?',
        options: [
          { label: 'Lost in transit / Misplaced at home', value: 'misplaced', next: 3 },
          { label: 'Stolen / Theft / Robbery incident', value: 'stolen', next: 3 }
        ]
      },
      {
        type: 'checkbox',
        question: 'Do you have these ready for application?',
        options: [
          { label: 'Affidavit sworn before a notary', value: 'ready_affidavit' },
          { label: 'Application form of issuing authority', value: 'ready_form' },
          { label: 'Proof of identity (other ID card)', value: 'ready_identity' },
          { label: 'Newspaper advertisement copy (if required)', value: 'ready_newspaper' }
        ],
        next: null
      }
    ],
    generatePlan: (answers) => {
      const isPassport = answers[0] === 'lost_passport';
      const isStolen = answers[2] === 'stolen';
      const urgency = isPassport ? 'medium' : 'low';
      
      let nextAction = 'File an online Lost Report (LR) with the state police portal immediately.';
      if (isStolen) {
        nextAction = 'File a regular FIR for theft at the local police station to prevent misuse of your identity.';
      }

      return {
        title: 'Lost Document Replacement Roadmap',
        urgency: urgency,
        urgencyLabel: urgency === 'medium' ? 'HIGH PRIORITY' : 'MODERATE',
        nextAction: nextAction,
        laws: [
          { name: 'Passports Act, 1967', desc: 'Governs replacement procedures. Misuse of lost passport is a penal offence.' },
          { name: 'Registration Act, 1908', desc: 'Rules for obtaining certified copies of deeds.' }
        ],
        documents: [
          'Police Lost Report (LR) copy / FIR copy',
          'Photocopy of the lost document (if available)',
          'Notarized Affidavit explaining how the document was lost',
          'Address and Identity proofs'
        ],
        authorities: [
          { name: 'Local Police Station / State Police Online Portal', desc: 'Register Lost Report.' },
          { name: 'UIDAI / Passport Seva Kendra / Sub-Registrar Office', desc: 'Issuing authorities for Aadhaar, Passports, and Property Deeds respectively.' }
        ],
        mistakes: [
          'Do NOT delay reporting. If a lost ID is misused in a crime, you will have to prove the loss happened before the crime.',
          'Do NOT apply for duplication without a valid Police Report/FIR.'
        ],
        escalations: [
          { time: 'Day 1', task: 'Register Lost Report online on State Police Portal. Save the PDF receipt.' },
          { time: 'Day 2', task: 'Get an Affidavit drafted and signed by a Notary Public.' },
          { time: 'Day 4', task: 'Apply for duplicates on the respective official portal (e.g., Passport Seva / UIDAI).' }
        ]
      };
    }
  },
  'fake-loan-apps': {
    title: 'Fake Loan App Extortion Relief',
    resolutionTime: '3 - 7 Days',
    steps: [
      {
        type: 'select',
        question: 'Are they harassing your contacts list?',
        options: [
          { label: 'Yes, calling contacts and sending morphed photos', value: 'yes_contact_harass', next: 1 },
          { label: 'No, but sending threatening messages to me directly', value: 'no_contact_harass', next: 1 }
        ]
      },
      {
        type: 'select',
        question: 'Did the app request permissions for your contacts/gallery on install?',
        options: [
          { label: 'Yes, gave contacts and storage permission', value: 'yes_permissions', next: 2 },
          { label: 'No, or I uninstalled the app immediately', value: 'no_permissions', next: 2 }
        ]
      },
      {
        type: 'select',
        question: 'Have you paid any extortion/interest amount?',
        options: [
          { label: 'Yes, paid but they are demanding more money', value: 'yes_paid_demands', next: 3 },
          { label: 'No, refused to pay them anything', value: 'no_paid', next: 3 }
        ]
      },
      {
        type: 'checkbox',
        question: 'What details do you have of the fake loan app?',
        options: [
          { label: 'App Name and APK/Playstore link', value: 'app_link' },
          { label: 'Screenshots of whatsapp threat messages with sender numbers', value: 'app_screenshots' },
          { label: 'UPI ID or Bank account where you transferred money', value: 'app_bank_upi' },
          { label: 'Loan disbursement history / app ledger', value: 'app_ledger' }
        ],
        next: null
      }
    ],
    generatePlan: (answers) => {
      const isContactHarassed = answers[0] === 'yes_contact_harass';
      const urgency = isContactHarassed ? 'high' : 'medium';
      
      let nextAction = 'Block the extortionists, set your social profiles to private, and post a warning status for your contacts.';
      if (answers[2] === 'yes_paid_demands') {
        nextAction = 'Report the UPI transaction details to cybercrime.gov.in and call 1930 to block the extortionist\'s accounts.';
      }

      return {
        title: 'Fake Loan App Relief Roadmap',
        urgency: urgency,
        urgencyLabel: urgency === 'high' ? 'CRITICAL (Privacy & Extortion Risk)' : 'HIGH PRIORITY',
        nextAction: nextAction,
        laws: [
          { name: 'Section 384 of IPC / Section 308 BNS', desc: 'Punishment for Extortion (up to 3 years imprisonment).' },
          { name: 'Section 66D of IT Act, 2000', desc: 'Cheating by impersonation using computer resources.' },
          { name: 'RBI Fair Practices Code', desc: 'Mandates that only RBI registered NBFCs/Banks can disburse loans and restricts harassment.' }
        ],
        documents: [
          'Screenshots of threatening WhatsApp messages and WhatsApp profiles',
          'Payment screenshots with UPI Reference IDs',
          'SMS logs / app screenshots showing interest calculations',
          'Link to download the app / APK file name'
        ],
        authorities: [
          { name: 'Cyber Crime Police', link: 'https://cybercrime.gov.in', contact: '1930 (Helpline)' },
          { name: 'RBI Sachet Portal', link: 'https://sachet.rbi.org.in', desc: 'Register complaint against unregistered digital lending apps.' }
        ],
        mistakes: [
          'Do NOT pay any "processing fee" or "settlement fee" to stop the harassment; they will continue to blackmail you.',
          'Do NOT keep the app installed. Uninstall it immediately and reset your phone to terminate remote file syncs.'
        ],
        escalations: [
          { time: 'Hour 1', task: 'Uninstall the app. Take screenshots. Alert friends/family on WhatsApp status about the app fraud.' },
          { time: 'Hour 3', task: 'Call 1930 and file a complaint on cybercrime.gov.in. List bank details of recipient.' },
          { time: 'Day 2', task: 'If app was downloaded from Play Store, report it to Google for takedown.' }
        ]
      };
    }
  }
};

let currentFlow = null;
let currentFlowId = '';
let currentStepIndex = 0;
let userAnswers = {};

function startGPSFlow(caseId) {
  currentFlow = gpsFlows[caseId];
  if (!currentFlow) return;
  
  currentFlowId = caseId;
  currentStepIndex = 0;
  userAnswers = {};
  
  // Toggle visibility of UI panes
  const introPane = document.getElementById('gps-intro-pane');
  const flowPane = document.getElementById('gps-flow-pane');
  const summaryPane = document.getElementById('gps-summary-pane');
  
  if (introPane) introPane.style.display = 'none';
  if (flowPane) flowPane.style.display = 'block';
  if (summaryPane) summaryPane.style.display = 'none';
  
  // Update Flow Title
  const flowTitleEl = document.getElementById('gps-flow-title');
  if (flowTitleEl) flowTitleEl.textContent = currentFlow.title;
  
  renderStep();
}

function renderStep() {
  if (!currentFlow) return;
  
  const step = currentFlow.steps[currentStepIndex];
  const totalSteps = currentFlow.steps.length;
  
  // Update Progress indicators
  const stepIndicatorEl = document.getElementById('gps-step-indicator');
  if (stepIndicatorEl) {
    stepIndicatorEl.textContent = `Step ${currentStepIndex + 1} of ${totalSteps}`;
  }
  
  const progressFillEl = document.getElementById('gps-progress-fill');
  if (progressFillEl) {
    const percentage = ((currentStepIndex + 1) / totalSteps) * 100;
    progressFillEl.style.width = `${percentage}%`;
  }
  
  // Render step body
  const bodyEl = document.getElementById('gps-step-body');
  if (!bodyEl) return;
  bodyEl.innerHTML = '';
  
  const questionEl = document.createElement('h3');
  questionEl.className = 'gps-question';
  questionEl.textContent = step.question;
  bodyEl.appendChild(questionEl);
  
  if (step.type === 'select') {
    const optionsGrid = document.createElement('div');
    optionsGrid.className = 'gps-options-grid';
    
    step.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = `btn btn-secondary gps-option-btn glass-card ${userAnswers[currentStepIndex] === opt.value ? 'active' : ''}`;
      btn.innerHTML = `
        <h4>${opt.label}</h4>
      `;
      btn.addEventListener('click', () => {
        handleAnswer(opt.value);
      });
      optionsGrid.appendChild(btn);
    });
    bodyEl.appendChild(optionsGrid);
  } else if (step.type === 'checkbox') {
    const optionsGrid = document.createElement('div');
    optionsGrid.className = 'gps-options-grid';
    
    // Store array for checkboxes
    if (!userAnswers[currentStepIndex]) {
      userAnswers[currentStepIndex] = [];
    }
    
    step.options.forEach(opt => {
      const label = document.createElement('label');
      label.className = 'btn btn-secondary gps-option-btn glass-card checklist-item';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = opt.value;
      checkbox.checked = userAnswers[currentStepIndex].includes(opt.value);
      
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          userAnswers[currentStepIndex].push(opt.value);
        } else {
          const idx = userAnswers[currentStepIndex].indexOf(opt.value);
          if (idx > -1) userAnswers[currentStepIndex].splice(idx, 1);
        }
      });
      
      const span = document.createElement('span');
      span.textContent = opt.label;
      
      label.appendChild(checkbox);
      label.appendChild(span);
      optionsGrid.appendChild(label);
    });
    bodyEl.appendChild(optionsGrid);
  }
  
  // Update Buttons
  const backBtn = document.getElementById('gps-back-btn');
  const nextBtn = document.getElementById('gps-next-btn');
  
  if (backBtn) {
    backBtn.style.display = currentStepIndex === 0 ? 'none' : 'inline-flex';
  }
  
  if (nextBtn) {
    if (step.type === 'checkbox') {
      nextBtn.textContent = 'Complete Mission';
    } else {
      nextBtn.textContent = 'Next Step';
    }
  }
  
  // Update the 3D glowing pathway progress indicators
  updatePathwayUI();
}

function updatePathwayUI() {
  if (!currentFlow) return;
  const total = currentFlow.steps.length;
  const idx = currentStepIndex;
  
  // Elements
  const step2 = document.getElementById('path-step-2');
  const line2 = document.getElementById('path-line-2');
  const step3 = document.getElementById('path-step-3');
  const line3 = document.getElementById('path-line-3');
  const step4 = document.getElementById('path-step-4');
  const line4 = document.getElementById('path-line-4');
  const step5 = document.getElementById('path-step-5');
  
  // Reset all
  [step2, step3, step4, step5].forEach(el => {
    if (el) el.className = 'pathway-step';
  });
  [line2, line3, line4].forEach(el => {
    if (el) el.className = 'pathway-line';
  });
  
  // Set completed Case Selection (Step 1)
  const step1 = document.getElementById('path-step-1');
  if (step1) step1.className = 'pathway-step completed';
  const line1 = document.getElementById('path-line-1');
  if (line1) line1.className = 'pathway-line completed';
  
  if (idx < Math.floor(total / 2)) {
    // Stage 1: Analysis active
    if (step2) step2.className = 'pathway-step active';
    if (line2) line2.className = 'pathway-line active';
  } else if (idx < total - 1) {
    // Stage 2: Rights Identified active
    if (step2) step2.className = 'pathway-step completed';
    if (line2) line2.className = 'pathway-line completed';
    if (step3) step3.className = 'pathway-step active';
    if (line3) line3.className = 'pathway-line active';
  } else {
    // Stage 3: Documents Check active
    if (step2) step2.className = 'pathway-step completed';
    if (line2) line2.className = 'pathway-line completed';
    if (step3) step3.className = 'pathway-step completed';
    if (line3) line3.className = 'pathway-line completed';
    if (step4) step4.className = 'pathway-step active';
    if (line4) line4.className = 'pathway-line active';
  }
}

function handleAnswer(value) {
  userAnswers[currentStepIndex] = value;
  
  const step = currentFlow.steps[currentStepIndex];
  if (step.type === 'select') {
    const selectedOpt = step.options.find(o => o.value === value);
    if (selectedOpt.next !== null && selectedOpt.next !== undefined) {
      currentStepIndex = selectedOpt.next;
      renderStep();
    } else {
      finishFlow();
    }
  }
}

function nextStep() {
  const step = currentFlow.steps[currentStepIndex];
  
  // Verify that an answer has been selected / completed
  if (step.type === 'select' && !userAnswers[currentStepIndex]) {
    window.showToast('Please select an option to proceed', 'error');
    return;
  }
  
  if (step.next !== null && step.next !== undefined) {
    currentStepIndex = step.next;
    renderStep();
  } else {
    finishFlow();
  }
}

function prevStep() {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    renderStep();
  }
}

function finishFlow() {
  const plan = currentFlow.generatePlan(userAnswers);
  
  const flowPane = document.getElementById('gps-flow-pane');
  const summaryPane = document.getElementById('gps-summary-pane');
  
  if (flowPane) flowPane.style.display = 'none';
  if (summaryPane) summaryPane.style.display = 'block';
  
  // Render Plan Screen
  const planContainer = document.getElementById('gps-roadmap-container');
  if (!planContainer) return;
  
  // Urgency class
  let urgencyClass = 'urgency-low';
  if (plan.urgency === 'medium') urgencyClass = 'urgency-medium';
  if (plan.urgency === 'high') urgencyClass = 'urgency-high';
  
  // Required Docs Checklist
  let docsHtml = '';
  plan.documents.forEach((doc, idx) => {
    docsHtml += `
      <div class="checklist-item">
        <input type="checkbox" id="doc-${idx}">
        <span>${doc}</span>
      </div>
    `;
  });
  
  // Authorities List
  let authHtml = '';
  plan.authorities.forEach(auth => {
    authHtml += `
      <div class="glass-card" style="padding: 1rem; margin-bottom: 0.75rem;">
        <h4 style="color: var(--accent);">${auth.name}</h4>
        ${auth.desc ? `<p style="font-size:0.85rem; margin-top:0.25rem;">${auth.desc}</p>` : ''}
        ${auth.contact ? `<p style="font-size:0.85rem; font-weight:700; color:var(--text-main); margin-top:0.25rem;">Contact: ${auth.contact}</p>` : ''}
        ${auth.link ? `<a href="${auth.link}" target="_blank" class="btn btn-secondary" style="font-size:0.8rem; padding:0.4rem 0.8rem; margin-top:0.5rem; width:fit-content;">Visit Site</a>` : ''}
      </div>
    `;
  });
  
  // Timeline Escalation
  let timelineHtml = '';
  plan.escalations.forEach(esc => {
    timelineHtml += `
      <div class="roadmap-step">
        <div class="roadmap-step-badge"></div>
        <span class="timeline-date" style="margin-bottom:0.15rem;">${esc.time}</span>
        <h4>${esc.task}</h4>
      </div>
    `;
  });
  
  // Mistakes Checklist
  let mistakesHtml = '';
  plan.mistakes.forEach(mistake => {
    mistakesHtml += `
      <li style="color:#ef4444; font-size:0.9rem; margin-bottom:0.5rem;">${mistake}</li>
    `;
  });
  
  // Relevant Laws
  let lawsHtml = '';
  plan.laws.forEach(law => {
    lawsHtml += `
      <div style="margin-bottom:0.75rem;">
        <h4 style="font-size:0.95rem; color:var(--text-main);">${law.name}</h4>
        <p style="font-size:0.85rem;">${law.desc}</p>
      </div>
    `;
  });
  
  planContainer.innerHTML = `
    <div class="gps-summary">
      <div class="summary-heading-box">
        <div class="summary-icon">
          <i data-lucide="check-circle" style="width: 2.2rem; height: 2.2rem;"></i>
        </div>
        <div class="summary-title-desc">
          <h2>${plan.title} Generated</h2>
          <span class="urgency-badge ${urgencyClass}">
            <span class="pulse-badge" style="background-color: currentColor; width: 6px; height: 6px;"></span>
            ${plan.urgencyLabel}
          </span>
        </div>
      </div>
      
      <div class="glass-panel" style="padding: 1.5rem 2rem; border-left: 4px solid var(--accent);">
        <h3 style="font-size:1.15rem; color:var(--text-main); margin-bottom:0.5rem;">Immediate Next Action</h3>
        <p style="font-size:1.05rem; font-weight:500; color:var(--text-main);">${plan.nextAction}</p>
      </div>
      
      <div class="summary-grid">
        <div class="glass-panel" style="padding: 1.5rem 2rem;">
          <h3 style="font-size:1.2rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;"><i data-lucide="file-text" style="color:var(--accent);"></i> Required Documents</h3>
          <div class="event-checklist">
            ${docsHtml}
          </div>
        </div>
        
        <div class="glass-panel" style="padding: 1.5rem 2rem;">
          <h3 style="font-size:1.2rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;"><i data-lucide="landmark" style="color:var(--accent);"></i> Competent Authorities</h3>
          ${authHtml}
        </div>
        
        <div class="glass-panel summary-full-width" style="padding: 2rem;">
          <h3 style="font-size:1.2rem; margin-bottom:1.5rem; display:flex; align-items:center; gap:0.5rem;"><i data-lucide="calendar" style="color:var(--accent);"></i> Guided Escalation Path</h3>
          <div class="roadmap-timeline">
            ${timelineHtml}
          </div>
        </div>
        
        <div class="glass-panel" style="padding: 1.5rem 2rem;">
          <h3 style="font-size:1.2rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;"><i data-lucide="alert-triangle" style="color:#ef4444;"></i> Mistakes to Avoid</h3>
          <ul style="padding-left:1.2rem;">
            ${mistakesHtml}
          </ul>
        </div>
        
        <div class="glass-panel" style="padding: 1.5rem 2rem;">
          <h3 style="font-size:1.2rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;"><i data-lucide="book-open" style="color:var(--accent);"></i> Applicable Laws & Statutes</h3>
          ${lawsHtml}
        </div>
      </div>
      
      <div class="roadmap-actions">
        <button onclick="restartGPS()" class="btn btn-secondary">Start New GPS Mission</button>
        <button onclick="downloadRoadmap()" class="btn btn-primary"><i data-lucide="download"></i> Download Action Plan</button>
      </div>
    </div>
  `;
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  window.showToast('Your personalized legal roadmap is ready!', 'success');
  
  if (window.AajNyayAuth && window.AajNyayAuth.isAuthenticated) {
    saveJourneyToDB(currentFlowId, plan.title, userAnswers, plan);
  }
}

async function saveJourneyToDB(caseId, title, answers, plan) {
  const localPayload = {
    id: Date.now(), // Unique local identifier
    case_id: caseId,
    title: title,
    answers: answers,
    plan: plan,
    created_at: new Date().toISOString()
  };
  
  try {
    const res = await fetch('/api/journeys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ case_id: caseId, title: title, answers: answers, plan: plan })
    });
    const data = await res.json();
    if (data.success) {
      window.showToast('Roadmap synced to My GPS Dashboard', 'success');
      return;
    }
    throw new Error(data.error || 'Server error');
  } catch (err) {
    console.warn('Failed to sync roadmap with API, saving locally:', err.message);
    const localJourneys = JSON.parse(localStorage.getItem('aajnyay_journeys') || '[]');
    localJourneys.push(localPayload);
    localStorage.setItem('aajnyay_journeys', JSON.stringify(localJourneys));
    window.showToast('Roadmap saved locally to your device (Offline Mode)', 'success');
  }
}

function restartGPS() {
  const introPane = document.getElementById('gps-intro-pane');
  const flowPane = document.getElementById('gps-flow-pane');
  const summaryPane = document.getElementById('gps-summary-pane');
  
  if (introPane) introPane.style.display = 'grid';
  if (flowPane) flowPane.style.display = 'none';
  if (summaryPane) summaryPane.style.display = 'none';
}

function downloadRoadmap() {
  // Simple print friendly formatter
  const printContent = document.getElementById('gps-roadmap-container').innerHTML;
  const originalContent = document.body.innerHTML;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>AajNyay Legal GPS Action Plan</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; }
          .glass-panel { border: 1px solid #ccc; padding: 20px; border-radius: 8px; margin-bottom: 20px; background: #fafafa; }
          .glass-card { border: 1px solid #ddd; padding: 15px; border-radius: 6px; margin-bottom: 10px; }
          .urgency-badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; }
          .urgency-high { background: #fee2e2; color: #ef4444; }
          .urgency-medium { background: #fef9c3; color: #eab308; }
          .urgency-low { background: #dcfce7; color: #22c55e; }
          .roadmap-timeline { border-left: 2px solid #ccc; padding-left: 20px; }
          .roadmap-step { margin-bottom: 20px; position: relative; }
          .roadmap-step-badge { width: 10px; height: 10px; background: #e06a3b; border-radius: 50%; position: absolute; left: -26px; top: 6px; }
          .roadmap-actions { display: none; }
          h2, h3, h4 { color: #0b2545; }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #e06a3b; margin-bottom: 5px;">AAJNYAY</h1>
          <p>India's Legal GPS - Justice Made Understandable</p>
        </div>
        ${printContent}
        <div style="text-align: center; margin-top: 50px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px;">
          Disclaimer: AajNyay provides educational legal guidance and does not replace professional legal advice.
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// Export functions to global scope
window.startGPSFlow = startGPSFlow;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.restartGPS = restartGPS;
window.downloadRoadmap = downloadRoadmap;
window.saveJourneyToDB = saveJourneyToDB;

