/* ========================================================
   PATHFinder Demo – app.js
   4-phase prenatal care workflow based on ACOG guidelines
   ======================================================== */

// ── Patient Data ──
const PATIENT = {
  firstName: "V",
  lastName: "B",
  dob: "01/01/1999",
  gender: "Female",
  pronouns: "She/Her",
  lmp: "2025-12-04",
  edd: "2026-09-11",
  gestAge: "Approximately 12 weeks by LMP",
  prevConditions: "None",
  currentProblems: "High blood pressure",
  allergies: "None reported",
  transportation: "Limited - relies on public transit",
  foodSecurity: "Occasionally food insecure",
  employment: "Part-time employed",
  housing: "Stable housing",
  insurance: "Medicaid",
  gravPara: "G1P0",
};

// ── ACOG Visit Schedule (Greater Than Average Risk – chronic hypertension) ──
const VISIT_SCHEDULE = [
  { week: 6,  visit: "Intake",  modality: "In-Person",    actions: "Initial history, risk assessment, routine prenatal labs (CBC, blood type, Rh(D), antibody screen, urinalysis, HBsAg, Hep C, HIV, syphilis, rubella, GC/CT, hemoglobinopathy)" },
  { week: 8,  visit: "Visit 1", modality: "In-Person",    actions: "Physical exam, BP assessment, aneuploidy screening discussion (cell-free DNA), early diabetes screen" },
  { week: 12, visit: "Visit 2", modality: "Telemedicine",  actions: "Review initial lab results, discuss genetic screening options, answer early pregnancy questions" },
  { week: 16, visit: "Visit 3", modality: "Telemedicine",  actions: "Check-in on symptoms, review home blood pressure log, discuss nutrition and weight gain" },
  { week: 18, visit: "US",      modality: "Imaging",       actions: "Detailed anatomy ultrasound to check on the baby's development" },
  { week: 20, visit: "Visit 4", modality: "Telemedicine",  actions: "Review ultrasound results, discuss fetal movement, and plan for second half of pregnancy" },
  { week: 24, visit: "Visit 5", modality: "In-Person",     actions: "Physical exam, measure fundal height, listen to fetal heart tones, review blood pressure log" },
  { week: 26, visit: "Visit 6", modality: "Telemedicine",  actions: "Check-in on well-being, discuss signs of preterm labor, select a newborn care clinician" },
  { week: 28, visit: "Visit 7", modality: "In-Person",     actions: "Glucose screening (GTT), complete blood count (CBC), Tdap vaccination, Rh(D) immunoglobulin if needed" },
  { week: 30, visit: "Visit 8", modality: "Telemedicine",  actions: "Review lab results, discuss birth preferences and planning, infant feeding education" },
  { week: 32, visit: "Visit 9", modality: "In-Person",     actions: "Physical exam, check fetal presentation, discuss signs of preeclampsia in detail" },
  { week: 34, visit: "Visit 10",modality: "In-Person",     actions: "Fetal presentation check, continue monitoring blood pressure, GBS screen" },
  { week: 36, visit: "Visit 11",modality: "In-Person",     actions: "Physical exam, review birth plan, discuss labor signs, preeclampsia warning signs" },
  { week: 37, visit: "Visit 12",modality: "Telemedicine",  actions: "Final check-in, FMLA/disability forms, postpartum depression awareness, seat belt use" },
  { week: 38, visit: "Visit 13",modality: "In-Person",     actions: "Final assessment, confirm delivery plan, post-term counseling if applicable, RSV vaccine (seasonal)" },
];

// ── PATHFinder Agent Questions (dynamic UI) ──
const AGENT_QUESTIONS = [
  {
    qNum: 1, total: 4,
    intro: "Thank you for completing your intake form. Based on your information, I have a few follow-up questions to personalize your care plan.",
    question: "You mentioned experiencing high blood pressure. How would you describe your blood pressure management currently?",
    type: "buttons",
    formTitle: "Blood Pressure Management",
    formHelp: "Select the option that best describes your current situation.",
    options: [
      "Well-controlled with medication",
      "Monitoring at home without medication",
      "Not currently monitoring",
      "Recently diagnosed, unsure how to manage",
    ],
  },
  {
    qNum: 2, total: 4,
    intro: "Thank you.",
    question: "You indicated that you have limited transportation access. Could you elaborate on what kind of challenges you face, such as transportation, work schedule, or childcare responsibilities?",
    type: "checkboxes",
    formTitle: "Appointment Challenges",
    formHelp: "Please tell us what makes it difficult to keep your healthcare appointments.",
    label: "What challenges prevent you from keeping healthcare appointments?",
    options: [
      "Transportation issues",
      "Work schedule conflicts",
      "Childcare responsibilities",
      "Cost of appointments or medication",
      "Lack of time",
      "Feeling too unwell to attend",
      "Other",
    ],
  },
  {
    qNum: 3, total: 4,
    intro: "Got it, thank you for sharing that.",
    question: "Given your situation, would you prefer a mix of in-person and telemedicine visits? This can help reduce transportation burden while ensuring you receive necessary in-person care.",
    type: "buttons",
    formTitle: "Visit Modality Preference",
    formHelp: "Choose your preferred appointment style.",
    options: [
      "Mix of in-person and telemedicine",
      "Mostly in-person visits",
      "Mostly telemedicine visits",
      "No preference",
    ],
  },
  {
    qNum: 4, total: 4,
    intro: "Great choice.",
    question: "How comfortable are you with monitoring your blood pressure at home and sharing readings with your care team between visits?",
    type: "slider",
    formTitle: "Home Monitoring Comfort",
    formHelp: "Rate your comfort level from 1 (not comfortable) to 5 (very comfortable).",
    sliderMin: 1, sliderMax: 5,
    sliderLabels: ["Not comfortable", "Very comfortable"],
  },
];

// ── Phase Definitions ──
const PHASES = [
  {
    id: "phase-intake",
    label: "Phase 1 of 4: Intake Form",
    title: "Standard Patient Intake",
    text: "The patient completes a standard intake form with personal details, medical history, allergies, and social determinants of health. Data is imported from EHR where available. This follows the ACOG intake process for initial history and risk assessment.",
  },
  {
    id: "phase-questions",
    label: "Phase 2 of 4: PATHFinder Questions",
    title: "PATHFinder Agent Follow-up Questions",
    text: "PATHFinder asks additional personalized questions based on intake data. Instead of free-text input, the agent provides dynamic interaction affordances \u2014 buttons, multiple-choice checkboxes, sliders \u2014 making it easier for patients to respond accurately and quickly.",
  },
  {
    id: "phase-report",
    label: "Phase 3 of 4: Patient Report",
    title: "Draft Report & Care Timeline",
    text: "PATHFinder generates a personalized prenatal care report and timeline based on ACOG guidelines for greater-than-average-risk patients (chronic hypertension). The patient can review the report, timeline, and ask clarifying questions through the chat panel.",
  },
  {
    id: "phase-clinician",
    label: "Phase 4 of 4: Clinician Review",
    title: "Clinician Review & Editing",
    text: "The clinician receives the AI-generated patient summary, full report, and care timeline. They can review, edit the report, modify the timeline, search medical evidence, and flag concerns through the chat interface. All actions are logged.",
  },
];

// ── Autoplay: flat list of all sub-steps across all phases ──
// Each entry: { phase, action, prompt }
// Steps that start a new phase get a longer delay; in-phase transitions are shorter.
const AUTOPLAY_STEPS = [
  // Phase 0 (Intake): cycle tabs
  { phase: 0, action: { type: "intake-tab", tab: "personal" },
    prompt: "Patient enters personal information: name, date of birth, gender, and pronouns." },
  { phase: 0, action: { type: "intake-tab", tab: "health" },
    prompt: "Health history section: LMP date, previous conditions, surgeries, and current symptoms like high blood pressure." },
  { phase: 0, action: { type: "intake-tab", tab: "allergies" },
    prompt: "Allergies section: known drug and environmental allergies are recorded." },
  { phase: 0, action: { type: "intake-tab", tab: "social" },
    prompt: "Social determinants of health: housing, transportation access, employment, food security, and support system." },
  { phase: 0, action: { type: "intake-tab", tab: "ehr" },
    prompt: "EHR data imported automatically: MRN, insurance (Medicaid), primary provider, and obstetric history (G1P0)." },
  // Phase 1 (Questions): show each question
  { phase: 1, action: { type: "question", idx: 0 },
    prompt: "PATHFinder asks about blood pressure management using interactive buttons \u2014 no free-text needed." },
  { phase: 1, action: { type: "question", idx: 1 },
    prompt: "Appointment challenges: patient selects barriers (transportation, work, childcare) via checkboxes." },
  { phase: 1, action: { type: "question", idx: 2 },
    prompt: "Visit modality preference: patient chooses between in-person, telemedicine, or a mix using buttons." },
  { phase: 1, action: { type: "question", idx: 3 },
    prompt: "Home monitoring comfort: patient rates willingness to track BP at home using a slider (1\u20135)." },
  // Phase 2 (Report)
  { phase: 2, action: { type: "show" },
    prompt: "PATHFinder generates a personalized 13-visit ACOG care plan, timeline, and a chat window for patient questions." },
  // Phase 3 (Clinician)
  { phase: 3, action: { type: "show" },
    prompt: "Clinician receives AI summary, full report PDF, care timeline, and a chat interface to edit, flag concerns, or search evidence." },
];

// ── State ──
const state = {
  currentPhase: 0,
  autoplayIdx: 0,
  autoplayTimer: null,
  questionAnswers: {},
};

// ── DOM Helpers ──
function $(id) { return document.getElementById(id); }
function $$(sel) { return Array.from(document.querySelectorAll(sel)); }
function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── Theme Toggle (Light / Dark / System) ──
const THEME_CYCLE = ["light", "dark", "system"];
const THEME_ICONS = { light: "\u2600", dark: "\uD83C\uDF19", system: "\uD83D\uDDA5" };
const THEME_LABELS = { light: "Light", dark: "Dark", system: "System" };

function getStoredTheme() {
  try { return localStorage.getItem("pf-theme") || "light"; } catch { return "light"; }
}
function setStoredTheme(t) {
  try { localStorage.setItem("pf-theme", t); } catch {}
}

function applyTheme(pref) {
  const root = document.documentElement;
  if (pref === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
  } else {
    root.setAttribute("data-theme", pref);
  }
  $("themeToggleIcon").textContent = THEME_ICONS[pref];
  $("themeToggleLabel").textContent = THEME_LABELS[pref];
}

function initTheme() {
  const stored = getStoredTheme();
  applyTheme(stored);

  $("themeToggleBtn").addEventListener("click", () => {
    const current = getStoredTheme();
    const idx = THEME_CYCLE.indexOf(current);
    const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
    setStoredTheme(next);
    applyTheme(next);
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getStoredTheme() === "system") applyTheme("system");
  });
}

// ── Page Tabs (Demo / About) ──
function initPageTabs() {
  $$(".page-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".page-tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      $$(".page-panel").forEach((p) => p.classList.remove("active"));
      const target = $(btn.dataset.pageTarget);
      if (target) target.classList.add("active");
    });
  });
}

// ── Step Progress Bar ──
function updateStepBar() {
  $$(".step-dot").forEach((dot, i) => {
    dot.classList.remove("active", "completed");
    if (i < state.currentPhase) dot.classList.add("completed");
    else if (i === state.currentPhase) dot.classList.add("active");
  });
  $$(".step-connector").forEach((conn, i) => {
    conn.classList.toggle("done", i < state.currentPhase);
  });
}

// ── Show Phase ──
function showPhase(idx) {
  state.currentPhase = idx;
  // Only toggle the phase content panels, not the page-level panels
  $$(".phase-content").forEach((p) => p.classList.remove("active"));
  $(PHASES[idx].id).classList.add("active");
  $("phaseLabel").textContent = PHASES[idx].label;
  $("commentaryTitle").textContent = PHASES[idx].title;
  $("commentaryText").textContent = PHASES[idx].text;
  $("prevBtn").disabled = idx === 0;
  $("nextBtn").disabled = idx === PHASES.length - 1;
  updateStepBar();

  if (idx === 0) renderIntakeTab("personal");
  if (idx === 1) renderQuestion(0);
  if (idx === 2) renderPatientReport();
  if (idx === 3) renderClinicianView();
}

// ── Phase 1: Intake ──
function renderIntakeTab(tab) {
  $$(".intake-tab").forEach((t) => t.classList.remove("active-itab"));
  $$(".intake-content").forEach((c) => c.classList.add("hidden"));
  const tabBtn = $$(".intake-tab").find((t) => t.dataset.itab === tab);
  if (tabBtn) tabBtn.classList.add("active-itab");
  const content = $("itab-" + tab);
  if (content) content.classList.remove("hidden");
  const tabs = ["ehr", "personal", "health", "allergies", "social"];
  const idx = tabs.indexOf(tab);
  $("intakeProgressFill").style.width = ((idx + 1) / tabs.length * 100) + "%";
}

// ── Phase 2: Questions ──
function renderQuestion(qIdx) {
  if (qIdx >= AGENT_QUESTIONS.length) return;
  const q = AGENT_QUESTIONS[qIdx];
  const pct = Math.round((qIdx / q.total) * 100);

  $("questionProgress").innerHTML = `
    <span>Question ${q.qNum} of ${q.total}</span>
    <div class="q-progress-bar"><div class="q-progress-fill" style="width:${pct}%"></div></div>
    <span>${pct}%</span>
  `;

  let formHtml = "";
  if (q.type === "buttons") {
    formHtml = `
      <div class="q-form-shell">
        <div class="q-form-title">${escHtml(q.formTitle)}</div>
        <div class="q-form-help">${escHtml(q.formHelp)}</div>
        <div class="q-btn-grid">
          ${q.options.map((opt) => `<button class="q-option-btn" data-val="${escHtml(opt)}">${escHtml(opt)}</button>`).join("")}
        </div>
      </div>`;
  } else if (q.type === "checkboxes") {
    formHtml = `
      <div class="q-form-shell">
        <div class="q-form-title">${escHtml(q.formTitle)}</div>
        <div class="q-form-help">${escHtml(q.formHelp)}</div>
        <div style="margin-bottom:0.2rem;font-size:0.82rem;">${escHtml(q.label)} <span class="q-form-required">*</span></div>
        ${q.options.map((opt) => `<label class="q-check-row"><input type="checkbox" value="${escHtml(opt)}" />${escHtml(opt)}</label>`).join("")}
        <div style="font-size:0.72rem;color:var(--muted);margin-top:0.2rem;">Select all that apply.</div>
        <div style="margin-top:0.4rem;"><button class="btn btn-primary">Submit answers</button></div>
      </div>`;
  } else if (q.type === "slider") {
    formHtml = `
      <div class="q-form-shell">
        <div class="q-form-title">${escHtml(q.formTitle)}</div>
        <div class="q-form-help">${escHtml(q.formHelp)}</div>
        <div class="q-slider-row">
          <span style="font-size:0.75rem;">${escHtml(q.sliderLabels[0])}</span>
          <input type="range" min="${q.sliderMin}" max="${q.sliderMax}" value="3" />
          <span style="font-size:0.75rem;">${escHtml(q.sliderLabels[1])}</span>
        </div>
        <div style="margin-top:0.4rem;"><button class="btn btn-primary">Submit</button></div>
      </div>`;
  }

  $("questionArea").innerHTML = `
    <div class="q-message assistant">
      <span class="q-meta">Assistant</span>
      ${escHtml(q.intro)}<br/>
      <span class="q-bold">Question ${q.qNum} of ${q.total}:</span> ${escHtml(q.question)}
      ${formHtml}
    </div>
  `;

  $("questionArea").querySelectorAll(".q-option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $("questionArea").querySelectorAll(".q-option-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.questionAnswers[q.qNum] = btn.dataset.val;
    });
  });
}

// ── Phase 3: Patient Report ──
function renderPatientReport() {
  const modalityClass = (m) => {
    if (m === "In-Person") return "modality-ip";
    if (m === "Telemedicine") return "modality-tele";
    if (m === "Imaging") return "modality-us";
    return "";
  };

  $("reportContent").innerHTML = `
    <div class="report-section">
      <h4>Prenatal Care Visit Schedule</h4>
      <p>Personalized plan for ${PATIENT.firstName} ${PATIENT.lastName} \u2014 Greater Than Average Risk (Chronic Hypertension)</p>
      <p style="font-size:0.76rem;color:var(--muted);">Based on ACOG Clinical Consensus No. 8, Appendix 1</p>
      <table class="report-table">
        <thead><tr><th>Weeks Gestation</th><th>Visit Type</th><th>Modality</th><th>Key Activities &amp; Discussion Topics</th></tr></thead>
        <tbody>
          ${VISIT_SCHEDULE.map((v) => `
            <tr>
              <td><strong>${v.week} weeks</strong></td>
              <td>${escHtml(v.visit)}</td>
              <td><span class="${modalityClass(v.modality)}">${escHtml(v.modality)}</span></td>
              <td>${escHtml(v.actions)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    <div class="report-section">
      <h4>Psychosocial Screening (All Trimesters)</h4>
      <ul>
        <li>Mental health conditions screening</li>
        <li>Substance use/abuse screening</li>
        <li>Intimate partner violence (IPV) / Trauma screening</li>
        <li>Social drivers of health (1st trimester)</li>
      </ul>
    </div>
    <div class="report-section">
      <h4>Immunizations (3rd Trimester)</h4>
      <ul><li>Tdap vaccination</li><li>Rh(D) Immunoglobulin (if Rh-negative and indicated)</li><li>RSV vaccine (seasonal)</li></ul>
    </div>
  `;

  const timelineWeeks = [
    { range: "Week 6-8", items: [
      "Complete initial prenatal labs and physical exam.",
      "Discuss aneuploidy screening options (e.g., cell-free DNA).",
      '<span class="tl-highlight">Begin home blood pressure monitoring 1-2 times daily.</span>',
      "Discuss starting daily low-dose aspirin (81 mg) with your clinician to reduce preeclampsia risk.",
    ]},
    { range: "Week 12-16", items: [
      "Attend telemedicine or in-person visit to review initial labs and discuss genetic screening options.",
      '<span class="tl-highlight">Start taking a daily prenatal vitamin with at least 400 mcg of folic acid.</span>',
      "Check-in on symptoms, review home blood pressure log, discuss nutrition and weight gain.",
    ]},
    { range: "Week 18-22", items: [
      "Schedule and attend the in-person anatomy ultrasound to check the baby's development.",
      "Have a telemedicine visit to review ultrasound results and discuss fetal movement.",
      "Focus on a low-sodium diet to help manage blood pressure.",
    ]},
    { range: "Week 24-28", items: [
      "Physical exam, measure fundal height, listen to fetal heart tones.",
      "Discuss signs of preterm labor and select a newborn care clinician.",
      '<span class="tl-highlight">Glucose screening for gestational diabetes (GTT).</span>',
      "Tdap vaccination, Rh(D) immunoglobulin if needed.",
      "Continue monitoring blood pressure at home and maintain a log for review.",
    ]},
    { range: "Week 30-34", items: [
      "Review lab results, discuss birth preferences and planning, infant feeding education.",
      "Physical exam, check fetal presentation, discuss signs of preeclampsia in detail.",
      "GBS screen (Group B Strep).",
    ]},
    { range: "Week 36-38", items: [
      "Review birth plan, discuss labor signs and preeclampsia warning signs.",
      "Final assessment, confirm delivery plan.",
      "FMLA/Disability forms, postpartum depression awareness.",
      "RSV vaccine (seasonal).",
    ]},
  ];

  $("timelineContent").innerHTML = `
    <h4 style="margin:0 0 0.4rem;color:var(--primary-2);font-size:1rem;">Prenatal Care Timeline</h4>
    <p style="font-size:0.78rem;color:var(--muted);margin:0 0 0.6rem;">Personalized plan for ${PATIENT.firstName} ${PATIENT.lastName}</p>
    ${timelineWeeks.map((tw) => `
      <div class="timeline-block">
        <h4>${tw.range}</h4>
        <div class="tl-date">Date range TBD</div>
        <ul>${tw.items.map((it) => `<li>${it}</li>`).join("")}</ul>
      </div>
    `).join("")}
  `;

  $("patientChatMessages").innerHTML = `
    <div class="chat-msg system">Select text from report/timeline and ask follow-up questions.</div>
  `;
}

// ── Phase 4: Clinician Review ──
function renderClinicianView() {
  $("clinicianSummary").innerHTML = `
    <div class="summary-field"><strong>Clinical Summary: ${PATIENT.firstName} ${PATIENT.lastName} - Initial Prenatal Visit</strong></div>
    <div class="summary-field"><strong>Patient:</strong> ${PATIENT.firstName} ${PATIENT.lastName}, a 27-year-old female (DOB: ${PATIENT.dob}), presenting for initial prenatal care. This appears to be her first pregnancy (${PATIENT.gravPara}).</div>
    <div class="summary-field"><strong>LMP:</strong> ${PATIENT.lmp}</div>
    <div class="summary-field"><strong>EDD:</strong> ${PATIENT.edd}</div>
    <div class="summary-field"><strong>Gestational Age:</strong> ${PATIENT.gestAge}</div>
    <div class="summary-field"><strong>Key Health History &amp; Current Concerns:</strong></div>
    <div class="summary-field"><strong>Chronic Hypertension:</strong> The patient reports a history of high blood pressure. Given the early gestational age, this should be managed as pre-existing chronic hypertension. This significantly increases the risk for maternal and fetal complications, including superimposed preeclampsia, fetal growth restriction (FGR), placental abruption, and preterm birth.</div>
    <div class="summary-field"><strong>Past Medical/Surgical History:</strong> Otherwise unremarkable, with no other reported conditions or prior hospitalizations.</div>
    <div class="summary-field"><strong>Social Determinants of Health:</strong></div>
    <div class="summary-field">Transportation: Limited (relies on public transit) \u2014 consider telemedicine for appropriate visits.</div>
    <div class="summary-field">Food Security: Occasionally food insecure \u2014 refer to WIC and local food assistance programs.</div>
    <div class="summary-field">Insurance: Medicaid \u2014 ensure all referrals are in-network.</div>
    <div class="summary-field"><strong>Risk Classification:</strong> Greater than average risk per ACOG guidelines. Recommend 13-visit schedule with closer monitoring.</div>
  `;

  $("ptab-reportPdf").innerHTML = `
    <div class="pdf-viewer">
      <div class="pdf-toolbar">
        <span>\u2630</span>
        <span>pathfinder_report...</span>
        <span>7 / 9</span>
        <span>73%</span>
      </div>
      <div class="pdf-page">
        <p style="font-size:0.75rem;color:#6b7280;margin:0 0 0.3rem;">Since we know getting to the clinic can be difficult...</p>
        <h4 style="margin:0.3rem 0;">Your Most Important Next Steps</h4>
        <p style="font-size:0.78rem;">To get started on the right foot, please focus on these three things:</p>
        <ol style="font-size:0.78rem;line-height:1.5;">
          <li><strong>Start a Daily Prenatal Vitamin:</strong> If you haven't already, please begin taking a prenatal vitamin with at least 400 mcg of folic acid every day. This is very important for your baby's early development.</li>
          <li><strong>Monitor Your Blood Pressure at Home:</strong> Please continue checking your blood pressure at home once or twice a day. Keep a simple log of the numbers and bring it with you to every appointment \u2014 even the virtual ones! This is the best way for us to partner with you in managing your health.</li>
          <li><strong>Talk to Your Doctor About Low-Dose Aspirin:</strong> At your next visit, please discuss starting a daily low-dose (81 mg) aspirin with your clinician. This is a common and safe recommendation for pregnant individuals with high blood pressure to help prevent complications.</li>
        </ol>
        <h4 style="margin:0.5rem 0 0.2rem;">What to Watch For</h4>
        <p style="font-size:0.78rem;">Please don't hesitate to call your doctor's office right away if you experience any of these symptoms:</p>
        <ul style="font-size:0.78rem;line-height:1.5;">
          <li>A very bad headache that doesn't go away</li>
          <li>Changes in your eyesight, like seeing spots or blurry vision</li>
          <li>Sudden swelling in your hands or face</li>
          <li>A blood pressure reading higher than 140/90</li>
        </ul>
        <h4 style="margin:0.5rem 0 0.2rem;">Help with Transportation</h4>
        <p style="font-size:0.78rem;">We understand that getting to your appointments can be a challenge. We found a few local resources that may be able to help with rides. We encourage you to contact them to see if you qualify for their services:</p>
        <ul style="font-size:0.78rem;">
          <li>NON-EMERGENCY MEDICAL TRANSPORTATION</li>
          <li>NON-EMERGENCY MEDICAL TRANSPORTATION FOR MEDICAID RECIPIENTS</li>
          <li>MEDICAL APPOINTMENTS TRANSPORTATION</li>
        </ul>
        <p style="font-size:0.78rem;margin-top:0.5rem;">We are so glad to be on this journey with you. Remember, managing your blood pressure is a team effort, and you've already taken a great first step by monitoring it at home. We're here to answer all your questions and make sure you feel confident and cared for.</p>
        <p style="font-size:0.78rem;font-style:italic;">Warmly,<br/>Your Prenatal Care Team</p>
      </div>
    </div>
  `;

  $("ptab-careTimeline").innerHTML = $("timelineContent") ? $("timelineContent").innerHTML : "<p>Timeline will appear after report generation.</p>";

  $("clinicianChatMessages").innerHTML = `
    <div class="chat-msg system">Use the actions below to modify the report, request timeline changes, or search medical evidence online. All actions are logged for clinician review notes.</div>
  `;
}

// ── Intake Tab Switching ──
function initIntakeTabs() {
  $$(".intake-tab").forEach((tab) => {
    tab.addEventListener("click", () => renderIntakeTab(tab.dataset.itab));
  });
}

// ── Panel Tab Switching (Clinician Report/Timeline) ──
function initPanelTabs() {
  $$(".panel-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".panel-tab").forEach((t) => t.classList.remove("active-ptab"));
      tab.classList.add("active-ptab");
      $$(".ptab-content").forEach((c) => c.classList.add("hidden"));
      const el = $("ptab-" + tab.dataset.ptab);
      if (el) el.classList.remove("hidden");
    });
  });
}

// ── Step Dot Navigation ──
function initStepDots() {
  $$(".step-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      const idx = parseInt(dot.dataset.step, 10);
      showPhase(idx);
      // Sync autoplay index to start of this phase
      state.autoplayIdx = AUTOPLAY_STEPS.findIndex((s) => s.phase === idx);
      if (state.autoplayIdx < 0) state.autoplayIdx = 0;
    });
  });
}

// ── Prev/Next Buttons ──
function initNavButtons() {
  $("prevBtn").addEventListener("click", () => {
    if (state.currentPhase > 0) {
      showPhase(state.currentPhase - 1);
      state.autoplayIdx = AUTOPLAY_STEPS.findIndex((s) => s.phase === state.currentPhase);
      if (state.autoplayIdx < 0) state.autoplayIdx = 0;
    }
  });
  $("nextBtn").addEventListener("click", () => {
    if (state.currentPhase < PHASES.length - 1) {
      showPhase(state.currentPhase + 1);
      state.autoplayIdx = AUTOPLAY_STEPS.findIndex((s) => s.phase === state.currentPhase);
      if (state.autoplayIdx < 0) state.autoplayIdx = 0;
    }
  });
  $("submitIntakeBtn").addEventListener("click", () => {
    showPhase(1);
    state.autoplayIdx = AUTOPLAY_STEPS.findIndex((s) => s.phase === 1);
  });
}

// ── Autoplay (across ALL phases and sub-steps) ──
// Phase transitions get the full user-selected delay (longer, so user can read).
// In-phase sub-step transitions use 40% of that delay (shorter, snappier).
function getPhaseDelay() {
  return parseInt($("autoplayDelay").value, 10);
}
function getSubStepDelay() {
  return Math.round(getPhaseDelay() * 0.4);
}

function scheduleNext() {
  if (state.autoplayIdx >= AUTOPLAY_STEPS.length) {
    stopAutoplay();
    $("autoplayToggle").checked = false;
    return;
  }
  // Determine if the NEXT step crosses a phase boundary
  const nextStep = AUTOPLAY_STEPS[state.autoplayIdx];
  const isPhaseChange = nextStep.phase !== state.currentPhase;
  const delay = isPhaseChange ? getPhaseDelay() : getSubStepDelay();
  state.autoplayTimer = setTimeout(advanceAutoplay, delay);
}

function startAutoplay() {
  stopAutoplay();
  // Execute the first step immediately, then schedule
  advanceAutoplay();
}

function stopAutoplay() {
  if (state.autoplayTimer) {
    clearTimeout(state.autoplayTimer);
    state.autoplayTimer = null;
  }
}

function advanceAutoplay() {
  state.autoplayTimer = null;

  if (state.autoplayIdx >= AUTOPLAY_STEPS.length) {
    stopAutoplay();
    $("autoplayToggle").checked = false;
    return;
  }

  const step = AUTOPLAY_STEPS[state.autoplayIdx];

  // Switch phase if needed
  if (step.phase !== state.currentPhase) {
    showPhase(step.phase);
  }

  // Execute action within the phase
  const action = step.action;
  if (action.type === "intake-tab") {
    renderIntakeTab(action.tab);
  } else if (action.type === "question") {
    renderQuestion(action.idx);
  }

  // Show the autoplay prompt in the commentary box
  if (step.prompt) {
    $("commentaryText").textContent = step.prompt;
  }

  state.autoplayIdx++;

  // Schedule the next step
  if ($("autoplayToggle").checked) {
    scheduleNext();
  }
}

function initAutoplay() {
  $("autoplayToggle").addEventListener("change", (e) => {
    if (e.target.checked) startAutoplay();
    else stopAutoplay();
  });
}

// ── Report text selection for patient chat ──
function initReportTextSelection() {
  const reportContent = $("reportContent");
  const timelineContent = $("timelineContent");
  const chatMessages = $("patientChatMessages");

  function handleSelection(source) {
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : "";
    if (text.length > 5 && chatMessages) {
      const indicator = document.createElement("div");
      indicator.className = "selected-text-indicator";
      indicator.innerHTML = `<div class="sti-label">Selected from ${source} pane:</div>"${escHtml(text.substring(0, 120))}${text.length > 120 ? "..." : ""}"`;
      chatMessages.appendChild(indicator);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  if (reportContent) reportContent.addEventListener("mouseup", () => handleSelection("report"));
  if (timelineContent) timelineContent.addEventListener("mouseup", () => handleSelection("timeline"));
}

// ── Initialize ──
function init() {
  initTheme();
  initPageTabs();
  initIntakeTabs();
  initPanelTabs();
  initStepDots();
  initNavButtons();
  initAutoplay();
  initReportTextSelection();
  showPhase(0);
}

init();
