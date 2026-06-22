/* ========================================================
   PATHFinder – app.js
   Landing page + 4-phase prenatal care demo (ACOG-based)
   Phases: Intake → Follow-up Questions → Report → Joint Review
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

// ── Phase Definitions (4 phases) ──
const PHASES = [
  {
    id: "phase-intake",
    label: "Step 1 of 4: Intake Form",
    title: "Standard Patient Intake",
    text: "The patient completes a standard intake form with personal details, medical history, allergies, and social determinants of health. Data is imported from the EHR where available. This follows the ACOG intake process for initial history and risk assessment.",
  },
  {
    id: "phase-questions",
    label: "Step 2 of 4: PATHFinder Questions",
    title: "PATHFinder Agent Follow-up Questions",
    text: "PATHFinder asks additional personalized questions based on intake data. Instead of free-text input, the agent provides dynamic interaction affordances — buttons, multiple-choice checkboxes, sliders — making it easier for patients to respond accurately and quickly.",
  },
  {
    id: "phase-report",
    label: "Step 3 of 4: Draft Report Review",
    title: "Draft Report & Care Plan",
    text: "PATHFinder generates a personalized prenatal care report based on ACOG guidelines for greater-than-average-risk patients (chronic hypertension). The patient reviews the report and can ask clarifying questions in plain language through the chat panel.",
  },
  {
    id: "phase-joint",
    label: "Step 4 of 4: Joint Clinician + Patient Review",
    title: "Shared Clinician & Patient Review",
    text: "The clinician and patient review the plan together. In this shared conversation the patient raises a real-life constraint, the clinician proposes a change, and PATHFinder updates the plan live — keeping medically required visits in person while easing access where it is safe to do so.",
  },
];

// ── Joint review scripted conversation ──
const JOINT_SCRIPT = [
  { role: "agent", name: "PATHFinder",
    text: "Welcome to your shared review. Dr. Smith and PATHFinder are here with you, V, to finalize your prenatal care plan together." },
  { role: "clinician", name: "Dr. Smith",
    text: "Hi V — I've reviewed your draft plan and it's a solid approach for managing your blood pressure during pregnancy. Is there anything about the visit schedule that worries you?" },
  { role: "patient", name: "V (Patient)",
    text: "The Week 24 visit is in-person. That's a long bus ride for me and I work part-time, so taking the whole day off is hard. Could that one be virtual?" },
  { role: "clinician", name: "Dr. Smith",
    text: "Good point. The Week 24 visit is mostly a blood-pressure and well-being check. If you keep logging your readings at home, we can safely do that one by video. Let's switch it to telemedicine." },
  { role: "update",
    week: 24,
    text: "Week 24 · Visit 5", from: "In-Person", to: "Telemedicine" },
  { role: "agent", name: "PATHFinder",
    text: "Done — Week 24 is now a telemedicine visit. I'm keeping the Week 28 visit in person, since it includes the glucose screening lab draw and Tdap vaccination that need to be done on site." },
  { role: "patient", name: "V (Patient)",
    text: "That makes sense, thank you! The in-person ones that really need a lab or shot are fine." },
  { role: "clinician", name: "Dr. Smith",
    text: "Great. I'll also add a note so the office mails you home blood-pressure cuff instructions before Week 12. Everything else in the plan looks good to me — approved." },
  { role: "agent", name: "PATHFinder",
    text: "Plan finalized and shared with both of you. An updated copy has been sent to V's patient portal, and the change is logged in the clinical record." },
];

// ── State ──
const state = {
  currentPhase: 0,
  autoplayIdx: 0,
  autoplayTimer: null,
  questionAnswers: {},
  jointTimer: null,
  jointWk24Updated: false,
};

// ── DOM Helpers ──
function $(id) { return document.getElementById(id); }
function $$(sel) { return Array.from(document.querySelectorAll(sel)); }
function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── Theme Toggle (Light / Sepia / Dark) ──
const THEME_CYCLE = ["light", "sepia", "dark"];
const THEME_ICONS = { light: "☀", sepia: "📖", dark: "🌙" };
const THEME_LABELS = { light: "Light", sepia: "Sepia", dark: "Dark" };

function getStoredTheme() {
  try { return localStorage.getItem("pf-theme") || "sepia"; } catch { return "sepia"; }
}
function setStoredTheme(t) {
  try { localStorage.setItem("pf-theme", t); } catch {}
}

function applyTheme(pref) {
  if (!THEME_CYCLE.includes(pref)) pref = "light";
  document.documentElement.setAttribute("data-theme", pref);
  $("themeToggleIcon").textContent = THEME_ICONS[pref];
  $("themeToggleLabel").textContent = THEME_LABELS[pref];
}

function initTheme() {
  applyTheme(getStoredTheme());
  $("themeToggleBtn").addEventListener("click", () => {
    const current = getStoredTheme();
    const idx = THEME_CYCLE.indexOf(current);
    const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
    setStoredTheme(next);
    applyTheme(next);
  });
}

// ── Lottie hero animation ──
function initLottie() {
  if (!window.lottie || !$("lottieHero")) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  try {
    lottie.loadAnimation({
      container: $("lottieHero"),
      renderer: "svg",
      loop: !reduced,
      autoplay: !reduced,
      path: "pathfinder_lottie.json",
    });
  } catch (e) { /* animation is decorative; ignore load errors */ }
}

// ── BibTeX copy ──
function initBibtexCopy() {
  const btn = $("copyBibtexBtn");
  const block = $("bibtexBlock");
  if (!btn || !block) return;
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(block.textContent);
      const orig = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => { btn.textContent = orig; }, 1600);
    } catch {
      // Fallback: select the text for manual copy
      const range = document.createRange();
      range.selectNodeContents(block);
      const sel = window.getSelection();
      sel.removeAllRanges(); sel.addRange(range);
    }
  });
}

// ── Page Tabs (Overview / Demo) ──
function showPage(targetId) {
  $$(".page-tab-btn").forEach((b) => {
    const isTarget = b.dataset.pageTarget === targetId;
    b.classList.toggle("active", isTarget);
    if (isTarget) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  });
  $$(".page-panel").forEach((p) => p.classList.toggle("active", p.id === targetId));
}

function initPageTabs() {
  $$(".page-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => showPage(btn.dataset.pageTarget));
  });
  // "Try the Demo" buttons on the landing page
  $$("[data-goto-demo]").forEach((btn) => {
    btn.addEventListener("click", () => showPage("demoPage"));
  });
  // Smooth-scroll to citation
  $$('a[href="#citation"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const el = $("citation");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// ── Step Progress Bar ──
function updateStepBar() {
  $$(".step-dot").forEach((dot, i) => {
    dot.classList.remove("active", "completed");
    if (i < state.currentPhase) dot.classList.add("completed");
    else if (i === state.currentPhase) { dot.classList.add("active"); dot.setAttribute("aria-current", "step"); }
    if (i !== state.currentPhase) dot.removeAttribute("aria-current");
  });
  $$(".step-connector").forEach((conn, i) => {
    conn.classList.toggle("done", i < state.currentPhase);
  });
}

// ── Show Phase ──
function showPhase(idx) {
  stopJoint();
  state.currentPhase = idx;
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
  if (idx === 3) renderJointReview();
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
        <div style="margin-bottom:0.2rem;font-size:0.88rem;">${escHtml(q.label)} <span class="q-form-required">*</span></div>
        ${q.options.map((opt) => `<label class="q-check-row"><input type="checkbox" value="${escHtml(opt)}" />${escHtml(opt)}</label>`).join("")}
        <div style="font-size:0.78rem;color:var(--muted);margin-top:0.2rem;">Select all that apply.</div>
        <div style="margin-top:0.4rem;"><button class="btn btn-primary">Submit answers</button></div>
      </div>`;
  } else if (q.type === "slider") {
    formHtml = `
      <div class="q-form-shell">
        <div class="q-form-title">${escHtml(q.formTitle)}</div>
        <div class="q-form-help">${escHtml(q.formHelp)}</div>
        <div class="q-slider-row">
          <span style="font-size:0.8rem;">${escHtml(q.sliderLabels[0])}</span>
          <input type="range" min="${q.sliderMin}" max="${q.sliderMax}" value="3" aria-label="${escHtml(q.formTitle)}" />
          <span style="font-size:0.8rem;">${escHtml(q.sliderLabels[1])}</span>
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

// ── Phase 3: Patient Report (report HTML + ask questions) ──
function modalityClass(m) {
  if (m === "In-Person") return "modality-ip";
  if (m === "Telemedicine") return "modality-tele";
  if (m === "Imaging") return "modality-us";
  return "";
}

function renderPatientReport() {
  $("reportContent").innerHTML = `
    <div class="report-section">
      <h4>Prenatal Care Visit Schedule</h4>
      <p>Personalized plan for ${PATIENT.firstName} ${PATIENT.lastName} — Greater Than Average Risk (Chronic Hypertension)</p>
      <p style="font-size:0.78rem;color:var(--muted);">Based on ACOG Clinical Consensus No. 8, Appendix 1</p>
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
      <h4>Your Most Important Next Steps</h4>
      <ul>
        <li>Start a daily prenatal vitamin with at least 400 mcg of folic acid.</li>
        <li>Monitor your blood pressure at home once or twice a day and keep a log.</li>
        <li>Talk to your doctor about starting daily low-dose (81 mg) aspirin to help prevent preeclampsia.</li>
      </ul>
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

  $("patientChatMessages").innerHTML = `
    <div class="chat-msg system">Select any text in the report and ask a follow-up question, or type below. PATHFinder answers in plain language.</div>
    <div class="chat-bubble role-patient"><span class="cb-role">You</span>What does "low-dose aspirin" do for me?</div>
    <div class="chat-bubble role-agent"><span class="cb-role">PATHFinder</span>For people with high blood pressure in pregnancy, a daily baby aspirin (81 mg) lowers the chance of preeclampsia — a serious rise in blood pressure. It's a common, well-studied recommendation. Your clinician will confirm it's right for you at your next visit.</div>
  `;
}

// ── Phase 4: Joint Clinician + Patient Review ──
function renderJointPlan() {
  const rows = VISIT_SCHEDULE.map((v) => {
    const updated = state.jointWk24Updated && v.week === 24;
    const modality = updated ? "Telemedicine" : v.modality;
    return `
      <div class="plan-row ${updated ? "pr-updated" : ""}">
        <span class="pr-week">${v.week} wk</span>
        <span style="flex:1;">${escHtml(v.visit)} — <span class="${modalityClass(modality)}">${escHtml(modality)}</span>${updated ? ' <strong>(updated)</strong>' : ''}<br/><span style="color:var(--muted);font-size:0.82rem;">${escHtml(v.actions)}</span></span>
      </div>`;
  }).join("");
  $("jointPlan").innerHTML = `
    <h4 style="margin:0 0 0.4rem;color:var(--primary-2);font-size:1rem;">Care plan for ${PATIENT.firstName} ${PATIENT.lastName}</h4>
    <p style="font-size:0.8rem;color:var(--muted);margin:0 0 0.6rem;">Greater than average risk · chronic hypertension · ${VISIT_SCHEDULE.length} visits</p>
    ${rows}
  `;
}

function appendJointMessage(item) {
  const box = $("jointChatMessages");
  if (!box) return;
  if (item.role === "update") {
    state.jointWk24Updated = true;
    renderJointPlan();
    const div = document.createElement("div");
    div.className = "plan-update";
    div.innerHTML = `<span class="pu-label">Plan updated</span>${escHtml(item.text)}: <del>${escHtml(item.from)}</del> → <ins>${escHtml(item.to)}</ins>`;
    box.appendChild(div);
  } else {
    const div = document.createElement("div");
    div.className = `chat-bubble role-${item.role}`;
    div.innerHTML = `<span class="cb-role">${escHtml(item.name)}</span>${escHtml(item.text)}`;
    box.appendChild(div);
  }
  box.scrollTop = box.scrollHeight;
}

function stopJoint() {
  if (state.jointTimer) { clearTimeout(state.jointTimer); state.jointTimer = null; }
}

function playJoint() {
  stopJoint();
  state.jointWk24Updated = false;
  renderJointPlan();
  $("jointChatMessages").innerHTML = "";
  let i = 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const step = () => {
    if (i >= JOINT_SCRIPT.length) { state.jointTimer = null; return; }
    appendJointMessage(JOINT_SCRIPT[i]);
    i++;
    const delay = reduced ? 250 : (JOINT_SCRIPT[i - 1] && JOINT_SCRIPT[i - 1].role === "update" ? 3700 : 3500);
    state.jointTimer = setTimeout(step, delay);
  };
  step();
}

function renderJointReview() {
  state.jointWk24Updated = false;
  renderJointPlan();
  if ($("jointChatMessages")) $("jointChatMessages").innerHTML = "";
  // Auto-play the scripted conversation on entering the phase
  playJoint();
}

function initJointControls() {
  const play = $("jointPlayBtn");
  const reset = $("jointResetBtn");
  if (play) play.addEventListener("click", playJoint);
  if (reset) reset.addEventListener("click", () => {
    stopJoint();
    state.jointWk24Updated = false;
    renderJointPlan();
    $("jointChatMessages").innerHTML = `<div class="chat-msg system">Press "Play conversation" to replay the shared review.</div>`;
  });
}

// ── Intake Tab Switching ──
function initIntakeTabs() {
  $$(".intake-tab").forEach((tab) => {
    tab.addEventListener("click", () => renderIntakeTab(tab.dataset.itab));
  });
}

// ── Step Dot Navigation ──
function initStepDots() {
  $$(".step-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      const idx = parseInt(dot.dataset.step, 10);
      showPhase(idx);
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

// ── Autoplay: flat list of all sub-steps across all phases ──
const AUTOPLAY_STEPS = [
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
  { phase: 1, action: { type: "question", idx: 0 },
    prompt: "PATHFinder asks about blood pressure management using interactive buttons — no free-text needed." },
  { phase: 1, action: { type: "question", idx: 1 },
    prompt: "Appointment challenges: patient selects barriers (transportation, work, childcare) via checkboxes." },
  { phase: 1, action: { type: "question", idx: 2 },
    prompt: "Visit modality preference: patient chooses between in-person, telemedicine, or a mix using buttons." },
  { phase: 1, action: { type: "question", idx: 3 },
    prompt: "Home monitoring comfort: patient rates willingness to track BP at home using a slider (1–5)." },
  { phase: 2, action: { type: "show" },
    prompt: "PATHFinder generates a personalized 13-visit ACOG care plan and a chat window where the patient can ask questions in plain language." },
  { phase: 3, action: { type: "show" },
    prompt: "Clinician and patient review the plan together. The patient raises a transport concern and PATHFinder updates the Week 24 visit to telemedicine live." },
];

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
  const nextStep = AUTOPLAY_STEPS[state.autoplayIdx];
  const isPhaseChange = nextStep.phase !== state.currentPhase;
  const delay = isPhaseChange ? getPhaseDelay() : getSubStepDelay();
  state.autoplayTimer = setTimeout(advanceAutoplay, delay);
}

function startAutoplay() {
  stopAutoplay();
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

  if (step.phase !== state.currentPhase) {
    showPhase(step.phase);
  }

  const action = step.action;
  if (action.type === "intake-tab") {
    renderIntakeTab(action.tab);
  } else if (action.type === "question") {
    renderQuestion(action.idx);
  }

  if (step.prompt) {
    $("commentaryText").textContent = step.prompt;
  }

  state.autoplayIdx++;

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
  const chatMessages = $("patientChatMessages");

  function handleSelection() {
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : "";
    if (text.length > 5 && chatMessages) {
      const indicator = document.createElement("div");
      indicator.className = "selected-text-indicator";
      indicator.innerHTML = `<div class="sti-label">Selected from report:</div>"${escHtml(text.substring(0, 120))}${text.length > 120 ? "..." : ""}"`;
      chatMessages.appendChild(indicator);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  if (reportContent) reportContent.addEventListener("mouseup", handleSelection);
}

// ── Lightbox ──
function initLightbox() {
  const lb = $("lightbox");
  const lbImg = $("lbImg");
  const lbCaption = $("lbCaption");
  const lbCounter = $("lbCounter");
  const lbClose = $("lbClose");
  const lbPrev = $("lbPrev");
  const lbNext = $("lbNext");
  if (!lb) return;

  let images = [];
  let current = 0;

  function collectImages() {
    images = Array.from(document.querySelectorAll("#overviewPage .fig img")).map((img) => ({
      src: img.src,
      alt: img.alt,
      caption: img.closest("figure")?.querySelector("figcaption")?.textContent || "",
    }));
  }

  function openAt(idx) {
    collectImages();
    if (!images.length) return;
    current = ((idx % images.length) + images.length) % images.length;
    const item = images[current];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbCaption.textContent = item.caption;
    lbCounter.textContent = `${current + 1} / ${images.length}`;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }

  function close() {
    lb.hidden = true;
    document.body.style.overflow = "";
  }

  function navigate(dir) {
    openAt(current + dir);
  }

  document.addEventListener("click", (e) => {
    const img = e.target.closest("#overviewPage .fig img");
    if (img) {
      collectImages();
      const idx = images.findIndex((it) => it.src === img.src);
      openAt(idx >= 0 ? idx : 0);
    }
  });

  lbClose.addEventListener("click", close);

  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });

  lbPrev.addEventListener("click", () => navigate(-1));
  lbNext.addEventListener("click", () => navigate(1));

  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
  });

  lb.addEventListener("wheel", (e) => {
    e.preventDefault();
    navigate(e.deltaY > 0 ? 1 : -1);
  }, { passive: false });
}

// ── Initialize ──
function init() {
  initTheme();
  initLottie();
  initBibtexCopy();
  initPageTabs();
  initIntakeTabs();
  initStepDots();
  initNavButtons();
  initJointControls();
  initAutoplay();
  initReportTextSelection();
  initLightbox();
  showPhase(0);
}

init();
