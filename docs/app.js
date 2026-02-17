const STEP_DEFS = [
  {
    title: "Step 1 - Intake profile loaded from EHR",
    text:
      "Care starts with a prefilled profile plus social context, then confirms key timeline details needed for coordinated planning.",
    bullets: [
      "Baseline case: G2P1 patient with chronic hypertension on low-dose aspirin.",
      "Begin with an early whole-person needs assessment.",
      "No oversight escalation is needed at baseline intake.",
    ],
    tab: "careTab",
    highlights: ["patientProfileCard", "lmpFieldWrap"],
  },
  {
    title: "Step 2 - LMP confirmed and EDD calculated",
    text:
      "After LMP is captured, MedGemma computes EDD and anchors a predictable timeline for key check-ins and milestones.",
    bullets: [
      "Timeline anchor is now available for schedule generation.",
      "Care chat can now move to social-needs and access screening.",
      "Oversight receives high-level intake completion only.",
    ],
    tab: "careTab",
    highlights: ["lmpFieldWrap", "commentaryBox"],
  },
  {
    title: "Step 3 - Social needs + care model requested in chat",
    text:
      "MedGemma asks the patient to complete an embedded Gemini form covering care preferences and social drivers of health.",
    bullets: [
      "Guideline-aligned social domains include transportation, caregiving, and food access.",
      "Form is embedded directly in chat and captured as structured data.",
      "Data will be used to adjust modality and support referrals.",
    ],
    tab: "careTab",
    highlights: ["modalityCard", "careChatBox"],
  },
  {
    title: "Step 4 - Tailoring form submitted",
    text:
      "The patient submits care model preference and unmet social needs. MedGemma converts these selections into scheduling and referral constraints.",
    bullets: [
      "Care plan keeps essential in-person milestones while using flexible follow-up where appropriate.",
      "Resource mapping is generated from social needs and local support options.",
      "Care status advances to plan-generation ready.",
    ],
    tab: "careTab",
    highlights: ["careChatBox", "llmTailoredForm"],
  },
  {
    title: "Step 5 - Tailored prenatal plan generated",
    text:
      "A tailored plan is generated across Week 8 to Week 39, combining core prenatal milestones with social-needs-informed adjustments.",
    bullets: [
      "Includes core phases: onboarding, mid-pregnancy review, late-pregnancy preparation, and handoff planning.",
      "Flexible modality is used when appropriate to reduce access burden.",
      "Referrals are attached for childcare, transportation, and nutrition support.",
    ],
    tab: "careTab",
    highlights: ["planReportCard", "careTimelineImage"],
  },
  {
    title: "Step 6 - Oversight cockpit review",
    text:
      "Oversight shows high-level quality and safety markers without exposing full transcript details. Nurse can activate takeover when policy or safety needs intervention.",
    bullets: [
      "Shows intake, social screening, plan generation, and referral state.",
      "Tracks unresolved social-resource follow-up at a status level.",
      "Maintains role-based privacy boundaries for chat content.",
    ],
    tab: "oversightTab",
    highlights: ["oversightStatusCard", "takeoverBtn"],
  },
  {
    title: "Step 7 - Clinician handoff and plan review",
    text:
      "Clinician Cockpit receives the generated plan and uses the MedGemma agent to make targeted modifications based on patient context and logistics.",
    bullets: [
      "Clinician sees EDD, risk context, medical milestones, and social referrals.",
      "Agent supports natural-language edits with tracked change logs.",
      "Timeline is shared between care and clinician views.",
    ],
    tab: "clinicianTab",
    highlights: ["clinicianPlanCard", "agentCard"],
  },
  {
    title: "Step 8 - MedASR transcript informs refinement",
    text:
      "Conversation snippets are transcribed with MedASR and fed to MedGemma for final workflow refinements before ongoing prenatal follow-up.",
    bullets: [
      "Transcript captures practical barriers like transportation delays and childcare windows.",
      "Clinician can apply transcript-informed modifications immediately.",
      "Demo closes the loop across care, oversight, and clinician workflows.",
    ],
    tab: "clinicianTab",
    highlights: ["medasrCard", "transcriptionLog", "applyAgentBtn"],
  },
];

const PREFILLED_PIPELINE_FIELDS = {
  patient_first_name: "Danielle",
  patient_last_name: "Carter",
  patient_dob: "1992-11-03",
  patient_ob_history: "G2P1",
  gender: "Female",
  previous_health_conditions: "Chronic hypertension (controlled)",
  current_health_problems: "Mild nausea, occasional headache",
  current_medications: "Prenatal vitamin, aspirin 81 mg nightly",
  standard_allergies: "Penicillin (rash)",
  baseline_social_context: "Single parent, hourly retail work, limited transportation",
};

const CARE_MODEL_OPTIONS = [
  "Targeted schedule: in-person for key tests, telemedicine for counseling/follow-up",
  "Traditional schedule: mostly in-person visits",
  "Telemedicine-heavy schedule when clinically safe",
];

const SOCIAL_NEED_OPTIONS = [
  {
    key: "transportation",
    label: "Transportation barriers",
    assistance: "Cab/public transit voucher referral",
    adjustment: "Telemedicine or targeted visit schedule",
  },
  {
    key: "childcare",
    label: "Childcare responsibilities",
    assistance: "Childcare agency and community center referral",
    adjustment: "Targeted visit schedule with late-day slots",
  },
  {
    key: "food_insecurity",
    label: "Food insecurity",
    assistance: "WIC/SNAP linkage and local food pantry referral",
    adjustment: "Nutrition consultation and weight-gain follow-up",
  },
  {
    key: "none",
    label: "No unmet social needs identified",
    assistance: "None",
    adjustment: "Standard support",
  },
];

const VISIT_TEMPLATE = [
  {
    visit: "V1",
    week: "Week 8",
    defaultModality: "In-person",
    requiresInPerson: true,
    tests: "Intake, baseline assessments, and care kickoff",
  },
  {
    visit: "V2",
    week: "Week 12",
    defaultModality: "In-person",
    requiresInPerson: true,
    tests: "Routine check-in, screening discussion, and psychosocial follow-up",
  },
  {
    visit: "V3",
    week: "Week 16",
    defaultModality: "Telemedicine",
    requiresInPerson: false,
    tests: "Education, warning-sign review, and social-resource follow-up",
  },
  {
    visit: "V4",
    week: "Week 20",
    defaultModality: "In-person",
    requiresInPerson: true,
    tests: "Mid-pregnancy imaging and growth review",
  },
  {
    visit: "V5",
    week: "Week 24",
    defaultModality: "In-person",
    requiresInPerson: true,
    tests: "Routine testing window and blood pressure review",
  },
  {
    visit: "V6",
    week: "Week 28",
    defaultModality: "Telemedicine",
    requiresInPerson: false,
    tests: "Results review, symptom education, and postpartum planning start",
  },
  {
    visit: "V7",
    week: "Week 32",
    defaultModality: "In-person",
    requiresInPerson: true,
    tests: "Third-trimester preventive care and trend monitoring",
  },
  {
    visit: "V8",
    week: "Week 36",
    defaultModality: "In-person",
    requiresInPerson: true,
    tests: "Late-pregnancy screening, delivery planning, and labor-sign counseling",
  },
  {
    visit: "V9",
    week: "Week 39",
    defaultModality: "In-person",
    requiresInPerson: true,
    tests: "Delivery readiness and postpartum care coordination",
  },
];

const TRANSCRIPT_SEGMENTS = [
  {
    speaker: "Patient",
    text: "My bus was late twice this month, so remote visits help when in-person services are not needed.",
  },
  {
    speaker: "Clinician",
    text: "We will keep key in-person milestones and convert counseling-heavy check-ins to telemedicine.",
  },
  {
    speaker: "Patient",
    text: "I also need late afternoon appointments because I do not have daytime childcare.",
  },
  {
    speaker: "Clinician",
    text: "I am adding childcare referral plus late-day scheduling flags and nutrition follow-up next visit.",
  },
];

const state = {
  currentStep: 0,
  activePage: "demoPage",
  activeTab: "careTab",
  theme: "light",
  lmpDate: "",
  careModelChoice: "",
  socialNeedKeys: [],
  takeoverActive: false,
  clinicianChanges: [],
  transcriptCount: 0,
};

const THEME_STORAGE_KEY = "pathfinder-theme";
const MOBILE_NAV_BREAKPOINT = 900;

const pageTabButtons = Array.from(document.querySelectorAll(".page-tab-btn"));
const pagePanels = Array.from(document.querySelectorAll(".page-panel"));
const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));
const topNav = document.getElementById("topNav");
const brandHomeBtn = document.getElementById("brandHomeBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeToggleIcon = document.getElementById("themeToggleIcon");
const themeToggleLabel = document.getElementById("themeToggleLabel");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function setActiveTab(tabId) {
  state.activeTab = tabId;
  tabButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tabTarget === tabId);
  });
  tabPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === tabId);
  });
}

function setActivePage(pageId) {
  state.activePage = pageId;
  pageTabButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.pageTarget === pageId);
  });
  pagePanels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === pageId);
  });
  setMobileMenuOpen(false);
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function updateThemeToggleUi(theme) {
  if (!themeToggleBtn || !themeToggleIcon || !themeToggleLabel) return;
  themeToggleIcon.textContent = theme === "dark" ? "☾" : "☀";
  themeToggleLabel.textContent = theme === "dark" ? "Dark" : "Light";
  themeToggleBtn.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
}

function applyTheme(theme, persist = true) {
  const normalizedTheme = theme === "dark" ? "dark" : "light";
  state.theme = normalizedTheme;
  document.documentElement.setAttribute("data-theme", normalizedTheme);
  updateThemeToggleUi(normalizedTheme);

  if (!persist) return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, normalizedTheme);
  } catch (_err) {
    // Ignore storage failures and continue with in-memory theme.
  }
}

function initTheme() {
  let savedTheme = "";
  try {
    savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "";
  } catch (_err) {
    savedTheme = "";
  }

  const initialTheme = savedTheme === "dark" || savedTheme === "light"
    ? savedTheme
    : getSystemTheme();

  applyTheme(initialTheme, false);
}

function toggleTheme() {
  applyTheme(state.theme === "dark" ? "light" : "dark", true);
}

function setMobileMenuOpen(isOpen) {
  if (!topNav || !mobileMenuBtn) return;
  topNav.classList.toggle("menu-open", isOpen);
  mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
  mobileMenuBtn.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
}

function computeEddIso(lmpIso) {
  if (!lmpIso) return "";
  const parts = lmpIso.split("-").map((part) => Number(part));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return "";

  const dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  dt.setUTCDate(dt.getUTCDate() + 280);
  return dt.toISOString().slice(0, 10);
}

function normalizeSocialNeedKeys(keys) {
  const allowed = new Set(SOCIAL_NEED_OPTIONS.map((option) => option.key));
  const deduped = Array.from(new Set(keys.filter((key) => allowed.has(key))));
  if (deduped.includes("none")) return ["none"];
  return deduped;
}

function getSocialNeedOption(key) {
  return SOCIAL_NEED_OPTIONS.find((option) => option.key === key);
}

function getSocialNeedLabels(keys) {
  if (keys.length === 0) return ["Not captured"];
  return keys
    .map((key) => getSocialNeedOption(key))
    .filter((option) => Boolean(option))
    .map((option) => option.label);
}

function getResourceLines(keys) {
  if (keys.length === 0) return ["Social resource plan pending intake form submission."];
  if (keys.includes("none")) return ["No targeted social referrals needed from intake screening."];

  return keys
    .map((key) => getSocialNeedOption(key))
    .filter((option) => Boolean(option))
    .map(
      (option) =>
        `${option.label}: assistance -> ${option.assistance}; care adjustment -> ${option.adjustment}`
    );
}

function buildVisitPlan(careModelChoice, socialNeedKeys) {
  return VISIT_TEMPLATE.map((row) => {
    let modality = row.defaultModality;

    if (careModelChoice === CARE_MODEL_OPTIONS[1] && !row.requiresInPerson) {
      modality = "In-person";
    }

    if (careModelChoice === CARE_MODEL_OPTIONS[2] && !row.requiresInPerson) {
      modality = "Telemedicine";
    }

    let tests = row.tests;
    if (socialNeedKeys.includes("transportation") && modality === "Telemedicine") {
      tests += " + transportation-sensitive virtual slot";
    }
    if (socialNeedKeys.includes("childcare") && modality === "In-person") {
      tests += " + late afternoon scheduling preference";
    }
    if (socialNeedKeys.includes("food_insecurity") && row.week === "Week 16") {
      tests += " + WIC/SNAP onboarding";
    }

    return {
      visit: row.visit,
      week: row.week,
      modality,
      tests,
    };
  });
}

function getDerivedState(step) {
  const lmpDate = state.lmpDate || (step >= 1 ? "2025-06-02" : "");
  const eddDate = computeEddIso(lmpDate);
  const careModelChoice =
    state.careModelChoice || (step >= 3 ? CARE_MODEL_OPTIONS[0] : "");
  const socialNeedKeys =
    state.socialNeedKeys.length > 0
      ? normalizeSocialNeedKeys(state.socialNeedKeys)
      : step >= 3
      ? ["transportation", "childcare", "food_insecurity"]
      : [];

  const socialNeedLabels = getSocialNeedLabels(socialNeedKeys);
  const resourceLines = getResourceLines(socialNeedKeys);
  const tailoredVisits = buildVisitPlan(careModelChoice, socialNeedKeys);

  const statusItems = [
    {
      label: "Pre-filled intake fields loaded (demographics, history, medications, allergies)",
      complete: true,
    },
    { label: "LMP captured and EDD computed", complete: step >= 1 },
    { label: "Social drivers + care model requested in chat", complete: step >= 2 },
    { label: "Gemini structured form submitted", complete: step >= 3 },
    { label: "Tailored care plan generated (Week 8-39)", complete: step >= 4 },
    { label: "Social support referrals generated", complete: step >= 4 },
    { label: "Clinician handoff completed", complete: step >= 6 },
  ];

  const oversightNotes = [
    "High-level only: intake profile synchronized.",
    step >= 1
      ? `High-level only: LMP/EDD available (${lmpDate} -> ${eddDate}).`
      : "Pending: LMP/EDD confirmation.",
    step >= 3
      ? `High-level only: social needs flagged -> ${socialNeedLabels.join(", ")}.`
      : "Pending: social needs screen.",
    step >= 4
      ? "High-level only: targeted plan and referrals generated."
      : "Pending: plan and social referral generation.",
    state.takeoverActive
      ? "Nurse takeover currently active."
      : "Nurse takeover currently inactive.",
  ];

  const careMessages = [];
  if (step >= 2) {
    careMessages.push({
      role: "assistant",
      author: "Care Assistant (MedGemma)",
      text:
        "Thanks for confirming LMP. Next, please select your preferred care model and any unmet social needs so I can tailor your prenatal schedule.",
    });

    careMessages.push({
      role: "assistant",
      author: "UI Generator (Gemini)",
      text:
        "I rendered an in-chat structured form for care model and social drivers of health. Your selections will be converted into scheduling and referral actions.",
      hasEmbeddedForm: true,
    });
  }

  if (step >= 3) {
    careMessages.push({
      role: "patient",
      author: "Danielle Carter",
      text: `Submitted tailored-care form -> Model: ${careModelChoice}. Social needs: ${socialNeedLabels.join(
        ", "
      )}.`,
    });
  }

  if (step >= 4) {
    careMessages.push({
      role: "assistant",
      author: "Care Planner (MedGemma)",
      text:
        "Tailored plan generated with guideline-aligned milestones, social support referrals, and modality adjustments.",
    });
  }

  const clinicianSummary =
    step >= 6
      ? `Clinician view of MedGemma report:\n- LMP: ${lmpDate}\n- EDD: ${eddDate}\n- Risk context: chronic hypertension on aspirin 81 mg\n- Care model: ${careModelChoice}\n- Social needs: ${socialNeedLabels.join(", ")}\n- Milestones: baseline assessment, mid-pregnancy imaging, late-pregnancy screening, delivery-readiness review\n- Social plan: ${resourceLines.join(" | ")}`
      : "Clinician handoff pending.";

  return {
    lmpDate,
    eddDate,
    careModelChoice,
    socialNeedKeys,
    socialNeedLabels,
    resourceLines,
    tailoredVisits,
    statusItems,
    oversightNotes,
    careMessages,
    clinicianSummary,
    planReady: step >= 4,
    tailoringFormEnabled: step >= 2,
    tailoringFormSubmitted: step >= 3,
    oversightReady: step >= 5,
    clinicianReady: step >= 6,
    transcriptionReady: step >= 7,
    commentaryContext: {
      lmpDate: lmpDate || "Not captured",
      eddDate: eddDate || "Not captured",
      careModel: careModelChoice || "Not captured",
      socialNeeds: socialNeedLabels.join(", "),
      careFormSource:
        "",
    },
  };
}

function renderCommentary(step, derived) {
  const def = STEP_DEFS[step];
  document.getElementById("stepLabel").textContent = `Step ${step + 1} of ${STEP_DEFS.length}`;
  document.getElementById("commentaryTitle").textContent = def.title;

  const commentaryText =
    `${def.text} Current capture -> LMP: ${derived.commentaryContext.lmpDate}; ` +
    `EDD: ${derived.commentaryContext.eddDate}; ` +
    `Care model: ${derived.commentaryContext.careModel}; ` +
    `Social needs: ${derived.commentaryContext.socialNeeds}.`;

  document.getElementById("commentaryText").textContent = commentaryText;
  document.getElementById("commentaryBullets").innerHTML = [
    ...def.bullets,
    ...derived.resourceLines,
  ]
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  document.getElementById("prevStepBtn").disabled = step === 0;
  document.getElementById("nextStepBtn").disabled = step === STEP_DEFS.length - 1;
}

function renderHighlights(step) {
  document.querySelectorAll(".highlight").forEach((el) => el.classList.remove("highlight"));
  STEP_DEFS[step].highlights.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add("highlight");
    }
  });
}

function renderEmbeddedTailoredForm(derived) {
  const formLocked = Boolean(derived.tailoringFormSubmitted);

  const careModelMarkup = CARE_MODEL_OPTIONS.map((option) => `
      <label class="radio-card embedded-option">
        <input
          type="radio"
          name="careModelChoice"
          value="${escapeHtml(option)}"
          ${derived.careModelChoice === option ? "checked" : ""}
          ${!derived.tailoringFormEnabled || formLocked ? "disabled" : ""}
        />
        <span>${escapeHtml(option)}</span>
      </label>
  `).join("");

  const socialNeedMarkup = SOCIAL_NEED_OPTIONS.map((option) => `
      <label class="radio-card embedded-option">
        <input
          type="checkbox"
          name="socialNeedKey"
          value="${escapeHtml(option.key)}"
          ${derived.socialNeedKeys.includes(option.key) ? "checked" : ""}
          ${!derived.tailoringFormEnabled || formLocked ? "disabled" : ""}
        />
        <span>${escapeHtml(option.label)}</span>
      </label>
  `).join("");

  return `
    <div class="llm-form-shell" id="llmTailoredForm">
      <div class="llm-form-title">LLM-generated tailored care form (Gemini UI)</div>
      <div class="llm-form-help">
        Captures a care model plus unmet social needs to drive scheduling and referral logic.
      </div>
      ${formLocked ? '<div class="llm-form-help">Response submitted and locked.</div>' : ""}
      <form id="embeddedTailoredForm" class="embedded-form-grid">
        <div class="embedded-label">Care delivery model</div>
        ${careModelMarkup}
        <div class="embedded-label">Unmet social needs (select all that apply)</div>
        ${socialNeedMarkup}
        <div class="form-actions">
          <button
            id="embeddedSubmitTailoredBtn"
            class="btn btn-secondary"
            type="submit"
            ${!derived.tailoringFormEnabled || formLocked ? "disabled" : ""}
          >
            Submit tailored-care form
          </button>
        </div>
      </form>
    </div>
  `;
}

function renderCare(derived) {
  document.getElementById("patientFirstNameField").value = PREFILLED_PIPELINE_FIELDS.patient_first_name;
  document.getElementById("patientLastNameField").value = PREFILLED_PIPELINE_FIELDS.patient_last_name;
  document.getElementById("patientDobField").value = PREFILLED_PIPELINE_FIELDS.patient_dob;
  document.getElementById("patientObHistoryField").value = PREFILLED_PIPELINE_FIELDS.patient_ob_history;
  document.getElementById("patientGenderField").value = PREFILLED_PIPELINE_FIELDS.gender;
  document.getElementById("prevHealthField").value = PREFILLED_PIPELINE_FIELDS.previous_health_conditions;
  document.getElementById("currentSymptomsField").value = PREFILLED_PIPELINE_FIELDS.current_health_problems;
  document.getElementById("currentMedsField").value = PREFILLED_PIPELINE_FIELDS.current_medications;
  document.getElementById("standardAllergiesField").value = PREFILLED_PIPELINE_FIELDS.standard_allergies;
  document.getElementById("baselineSocialField").value = PREFILLED_PIPELINE_FIELDS.baseline_social_context;

  document.getElementById("lmpDateInput").value = derived.lmpDate;
  document.getElementById("confirmLmpBtn").disabled = false;

  const careChatBox = document.getElementById("careChatBox");
  if (derived.careMessages.length === 0) {
    careChatBox.innerHTML =
      '<div class="message assistant"><span class="meta">Care Assistant (MedGemma)</span>Waiting for LMP before launching tailored social-needs screening.</div>';
  } else {
    careChatBox.innerHTML = derived.careMessages
      .map(
        (msg) => `
          <div class="message ${escapeHtml(msg.role)}">
            <span class="meta">${escapeHtml(msg.author)}</span>
            ${escapeHtml(msg.text)}
            ${msg.hasEmbeddedForm ? renderEmbeddedTailoredForm(derived) : ""}
          </div>`
      )
      .join("");
  }

  const summary = document.getElementById("planSummary");
  const planCard = document.getElementById("planReportCard");
  const visitTableBody = document.getElementById("visitTableBody");
  const timeline = document.getElementById("careTimelineImage");

  if (!derived.planReady) {
    summary.textContent =
      "Plan not generated yet. MedGemma will create a Week 8 to Week 39 tailored report after care-model and social-needs submission.";
    visitTableBody.innerHTML = "";
    timeline.style.opacity = "0.2";
    planCard.style.opacity = "0.7";
    return;
  }

  planCard.style.opacity = "1";
  timeline.style.opacity = "1";
  summary.textContent =
    `Generated using LMP ${derived.lmpDate} (EDD ${derived.eddDate}), ` +
    `care model "${derived.careModelChoice}", and social needs ` +
    `${derived.socialNeedLabels.join(", ")}. `;

  visitTableBody.innerHTML = derived.tailoredVisits
    .map(
      (row) => `
    <tr>
      <td>${escapeHtml(row.visit)}</td>
      <td>${escapeHtml(row.week)}</td>
      <td>${escapeHtml(row.modality)}</td>
      <td>${escapeHtml(row.tests)}</td>
    </tr>
  `
    )
    .join("");
}

function renderOversight(derived) {
  const statuses = document.getElementById("oversightStatuses");
  statuses.innerHTML = derived.statusItems
    .map(
      (item) => `
      <div class="status-item ${item.complete ? "complete" : "pending"}">
        ${item.complete ? "Complete" : "Pending"}: ${escapeHtml(item.label)}
      </div>`
    )
    .join("");

  const notes = document.getElementById("oversightNotes");
  notes.innerHTML = derived.oversightNotes
    .map((note) => `<div class="event-item">${escapeHtml(note)}</div>`)
    .join("");

  const takeoverBtn = document.getElementById("takeoverBtn");
  takeoverBtn.disabled = !derived.oversightReady;
  document.getElementById("takeoverState").textContent = state.takeoverActive
    ? "Takeover active"
    : "Takeover inactive";
}

function renderClinician(derived) {
  const summary = document.getElementById("clinicianPlanSummary");
  summary.textContent = derived.clinicianSummary;

  const clinicianTimeline = document.getElementById("clinicianTimelineImage");
  clinicianTimeline.style.opacity = derived.clinicianReady ? "1" : "0.2";

  const applyAgentBtn = document.getElementById("applyAgentBtn");
  const simulateTranscriptionBtn = document.getElementById("simulateTranscriptionBtn");
  applyAgentBtn.disabled = !derived.clinicianReady;
  simulateTranscriptionBtn.disabled = !derived.transcriptionReady;

  const changesLog = document.getElementById("agentChangesLog");
  if (!derived.clinicianReady) {
    changesLog.innerHTML = '<div class="event-item">Clinician handoff pending.</div>';
  } else if (state.clinicianChanges.length === 0) {
    changesLog.innerHTML = '<div class="event-item">No clinician modifications applied yet.</div>';
  } else {
    changesLog.innerHTML = state.clinicianChanges
      .map((change) => `<div class="event-item">${escapeHtml(change)}</div>`)
      .join("");
  }

  const transcriptionLog = document.getElementById("transcriptionLog");
  if (!derived.transcriptionReady) {
    transcriptionLog.innerHTML =
      '<div class="message assistant"><span class="meta">MedASR</span>Transcription feed will start at Step 8.</div>';
    return;
  }

  const activeSegments = TRANSCRIPT_SEGMENTS.slice(0, Math.max(1, state.transcriptCount));
  transcriptionLog.innerHTML = activeSegments
    .map(
      (segment, idx) => `
        <div class="message clinician">
          <span class="meta">MedASR Segment ${idx + 1} | ${escapeHtml(segment.speaker)}</span>
          ${escapeHtml(segment.text)}
        </div>`
    )
    .join("");
}

function renderAll() {
  const step = state.currentStep;
  const derived = getDerivedState(step);
  const defaultTab = STEP_DEFS[step].tab;
  setActiveTab(defaultTab);
  renderCommentary(step, derived);
  renderCare(derived);
  renderOversight(derived);
  renderClinician(derived);
  renderHighlights(step);
}

function goToStep(nextStep) {
  if (nextStep < 0 || nextStep >= STEP_DEFS.length) return;

  if (nextStep < state.currentStep) {
    if (nextStep < 1) state.lmpDate = "";
    if (nextStep < 3) {
      state.careModelChoice = "";
      state.socialNeedKeys = [];
    }
    if (nextStep < 7) state.transcriptCount = 0;
    if (nextStep < 6) state.clinicianChanges = [];
    state.takeoverActive = false;
  }

  state.currentStep = nextStep;
  renderAll();
}

function bindTabs() {
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActiveTab(btn.dataset.tabTarget);
    });
  });
}

function bindPageTabs() {
  pageTabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActivePage(btn.dataset.pageTarget);
    });
  });
}

function bindThemeActions() {
  if (!themeToggleBtn) return;
  themeToggleBtn.addEventListener("click", () => {
    toggleTheme();
  });
}

function bindNavActions() {
  if (brandHomeBtn) {
    brandHomeBtn.addEventListener("click", (event) => {
      event.preventDefault();
      setActivePage("demoPage");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = topNav ? topNav.classList.contains("menu-open") : false;
      setMobileMenuOpen(!isOpen);
    });
  }

  document.addEventListener("click", (event) => {
    if (!topNav || !mobileMenuBtn) return;
    if (!topNav.classList.contains("menu-open")) return;
    if (!(event.target instanceof Node)) return;
    if (topNav.contains(event.target)) return;
    setMobileMenuOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > MOBILE_NAV_BREAKPOINT) {
      setMobileMenuOpen(false);
    }
  });
}

function bindStepControls() {
  document.getElementById("prevStepBtn").addEventListener("click", () => {
    goToStep(state.currentStep - 1);
  });

  document.getElementById("nextStepBtn").addEventListener("click", () => {
    goToStep(state.currentStep + 1);
  });
}

function bindCareActions() {
  document.getElementById("confirmLmpBtn").addEventListener("click", () => {
    const input = document.getElementById("lmpDateInput");
    if (!input.value) return;

    state.lmpDate = input.value;
    if (state.currentStep < 1) {
      goToStep(1);
      return;
    }
    renderAll();
  });

  const careChatBox = document.getElementById("careChatBox");

  careChatBox.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;

    if (target.name === "careModelChoice") {
      state.careModelChoice = target.value;
      return;
    }

    if (target.name !== "socialNeedKey") return;

    if (target.checked) {
      if (target.value === "none") {
        state.socialNeedKeys = ["none"];
      } else {
        state.socialNeedKeys = state.socialNeedKeys.filter((key) => key !== "none");
        if (!state.socialNeedKeys.includes(target.value)) {
          state.socialNeedKeys.push(target.value);
        }
      }
    } else {
      state.socialNeedKeys = state.socialNeedKeys.filter((key) => key !== target.value);
    }
  });

  careChatBox.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (form.id !== "embeddedTailoredForm") return;

    event.preventDefault();

    const selectedCareModel = form.querySelector('input[name="careModelChoice"]:checked');
    if (!(selectedCareModel instanceof HTMLInputElement)) return;

    const checkedNeeds = Array.from(
      form.querySelectorAll('input[name="socialNeedKey"]:checked')
    )
      .filter((node) => node instanceof HTMLInputElement)
      .map((node) => node.value);

    state.careModelChoice = selectedCareModel.value;

    if (checkedNeeds.length === 0) {
      state.socialNeedKeys = ["none"];
    } else {
      state.socialNeedKeys = normalizeSocialNeedKeys(checkedNeeds);
    }

    if (state.currentStep < 3) {
      goToStep(3);
      return;
    }
    renderAll();
  });
}

function bindOversightActions() {
  document.getElementById("takeoverBtn").addEventListener("click", () => {
    if (state.currentStep < 5) return;
    state.takeoverActive = !state.takeoverActive;
    renderAll();
  });
}

function bindClinicianActions() {
  document.getElementById("applyAgentBtn").addEventListener("click", () => {
    if (state.currentStep < 6) return;

    const input = document.getElementById("agentInstructionInput");
    const text = input.value.trim();
    if (!text) return;

    const entry = `MedGemma agent applied clinician instruction: ${text}`;
    state.clinicianChanges.push(entry);
    input.value = "";
    renderAll();
  });

  document.getElementById("simulateTranscriptionBtn").addEventListener("click", () => {
    if (state.currentStep < 7) return;
    state.transcriptCount = Math.min(TRANSCRIPT_SEGMENTS.length, state.transcriptCount + 1);
    if (state.transcriptCount === 0) state.transcriptCount = 1;
    renderAll();
  });
}

initTheme();
bindPageTabs();
bindThemeActions();
bindNavActions();
bindTabs();
bindStepControls();
bindCareActions();
bindOversightActions();
bindClinicianActions();
setActivePage(state.activePage);
renderAll();
