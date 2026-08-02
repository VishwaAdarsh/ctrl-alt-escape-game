/* ==========================================================================
   CTRL + ALT + ESCAPE | Mission 03: The Glitch Engine Script
   Module: Digital Forensics & Investigation Interactions v2.1
   ========================================================================== */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. DYNAMIC FRAGMENT SETS & SESSION PERSISTENCE
  // --------------------------------------------------------------------------
  const FRAGMENT_SETS = [
    { set: 'A', f1: 'GE', f2: '42LK', f3: '91', key: 'GE-42LK-91' },
    { set: 'B', f1: 'GAM', f2: 'E09', f3: 'X17', key: 'GAM-E09-X17' },
    { set: 'C', f1: 'SYS', f2: 'K21', f3: 'P8A', key: 'SYS-K21-P8A' },
    { set: 'D', f1: 'NEO', f2: 'F88', f3: 'Q30', key: 'NEO-F88-Q30' },
    { set: 'E', f1: 'CYB', f2: 'R40', f3: 'V12', key: 'CYB-R40-V12' },
    { set: 'F', f1: 'PRT', f2: '77X', f3: 'W09', key: 'PRT-77X-W09' },
    { set: 'G', f1: 'HEX', f2: 'B19', f3: 'Z04', key: 'HEX-B19-Z04' },
    { set: 'H', f1: 'DRK', f2: 'L55', f3: 'T99', key: 'DRK-L55-T99' }
  ];

  let setIndex = parseInt(sessionStorage.getItem('glitch_set_index'), 10);
  if (isNaN(setIndex) || setIndex < 0 || setIndex >= FRAGMENT_SETS.length) {
    setIndex = 0; // Default set A matches PRD example ('GE', '42LK', '91', 'GE-42LK-91')
    sessionStorage.setItem('glitch_set_index', setIndex.toString());
  }

  const activeSet = FRAGMENT_SETS[setIndex];

  // --------------------------------------------------------------------------
  // 2. EVIDENCE DEFINITIONS (8 Total Evidence Items / Red Zones v2.1)
  // --------------------------------------------------------------------------
  const EVIDENCE_DEFINITIONS = [
    {
      id: 1,
      name: 'Evidence 01',
      title: 'ACCESS FRAGMENT',
      type: 'Access Fragment',
      typeClass: 'type-fragment',
      required: true,
      label: 'Fragment',
      getValue: () => activeSet.f1,
      subText: 'Fragment 01 extracted from header logo telemetry after 2s hold.',
      icon: '❖',
      redZoneId: '1'
    },
    {
      id: 2,
      name: 'Evidence 02',
      title: 'SYSTEM LOG',
      type: 'System Log',
      typeClass: 'type-log',
      required: false,
      label: 'Integrity',
      getValue: () => '48%',
      subText: 'Memory Sector #3 diagnostic log retrieved via double-click.',
      icon: '💻',
      redZoneId: '2'
    },
    {
      id: 3,
      name: 'Evidence 03',
      title: 'ACCESS FRAGMENT',
      type: 'Access Fragment',
      typeClass: 'type-fragment',
      required: true,
      label: 'Fragment',
      getValue: () => activeSet.f2,
      subText: 'Fragment 02 intercepted inside Footer after 5 clicks.',
      icon: '🛡️',
      redZoneId: '3'
    },
    {
      id: 4,
      name: 'Evidence 04',
      title: 'CORRUPTED ARCHIVE',
      type: 'Corrupted Archive',
      typeClass: 'type-archive',
      required: false,
      label: 'Archive ID',
      getValue: () => 'A-104',
      subText: 'Corrupted telemetry log extracted via 2s long press.',
      icon: '📦',
      redZoneId: '4'
    },
    {
      id: 5,
      name: 'Evidence 05',
      title: 'DELETED MESSAGE',
      type: 'Deleted Message',
      typeClass: 'type-message',
      required: false,
      label: 'Transmission',
      getValue: () => 'Restored',
      subText: 'Zero-Trust shield transmission decrypted via triple click.',
      icon: '✉️',
      redZoneId: '5'
    },
    {
      id: 6,
      name: 'Evidence 06',
      title: 'ACCESS FRAGMENT',
      type: 'Access Fragment',
      typeClass: 'type-fragment',
      required: true,
      label: 'Fragment',
      getValue: () => activeSet.f3,
      subText: 'Fragment 03 extracted via payload Drag & Drop.',
      icon: '©',
      redZoneId: '6'
    },
    {
      id: 7,
      name: 'Evidence 07',
      title: 'SECURITY REPORT',
      type: 'Security Report',
      typeClass: 'type-report',
      required: false,
      label: 'Firewall',
      getValue: () => 'Offline',
      subText: 'Sector 7 firewall report unlocked via 3-step order puzzle.',
      icon: '🚨',
      redZoneId: '7'
    },
    {
      id: 8,
      name: 'Evidence 08',
      title: 'AUTH RECORD',
      type: 'Authentication Record',
      typeClass: 'type-record',
      required: false,
      label: 'Auth Status',
      getValue: () => 'Recovered',
      subText: 'System version auth signature verified via 5s dual switch activation.',
      icon: '🔑',
      redZoneId: '8'
    }
  ];

  // State Management
  const state = {
    evidence: {
      1: sessionStorage.getItem('glitch_ev_1') === 'true',
      2: sessionStorage.getItem('glitch_ev_2') === 'true',
      3: sessionStorage.getItem('glitch_ev_3') === 'true',
      4: sessionStorage.getItem('glitch_ev_4') === 'true',
      5: sessionStorage.getItem('glitch_ev_5') === 'true',
      6: sessionStorage.getItem('glitch_ev_6') === 'true',
      7: sessionStorage.getItem('glitch_ev_7') === 'true',
      8: sessionStorage.getItem('glitch_ev_8') === 'true'
    },
    logs: JSON.parse(sessionStorage.getItem('glitch_investigation_logs') || '[]'),
    isReconstructed: sessionStorage.getItem('glitch_reconstructed') === 'true',
    sfxEnabled: true
  };

  // --------------------------------------------------------------------------
  // 3. WEB AUDIO API SYNTHESIZER
  // --------------------------------------------------------------------------
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playClick() {
    if (!state.sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  function playGlitchSound() {
    if (!state.sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const bufferSize = audioCtx.sampleRate * 0.15;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      whiteNoise.start();
      whiteNoise.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.warn('Audio noise error:', e);
    }
  }

  function playSuccessSound() {
    if (!state.sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = audioCtx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.2, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.25);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.25);
      });
    } catch (e) {
      console.warn('Audio success error:', e);
    }
  }

  // --------------------------------------------------------------------------
  // 4. DOM ELEMENTS & INITIALIZATION
  // --------------------------------------------------------------------------
  const elements = {
    soundToggleBtn: document.getElementById('soundToggleBtn'),
    soundIcon: document.getElementById('soundIcon'),
    navLogo: document.getElementById('navLogo'),
    logoHoverProgress: document.getElementById('logoHoverProgress'),
    cardCyberSecurity: document.getElementById('cardCyberSecurity'),
    footerCopyright: document.getElementById('footerCopyright'),
    glitchFlash: document.getElementById('glitchFlash'),
    // Red Zone Targets
    brokenImageNode: document.getElementById('brokenImageNode'),
    contactEmailZone: document.getElementById('contactEmailZone'),
    archiveCard: document.getElementById('archiveCard'),
    sysStatusWidget: document.getElementById('sysStatusWidget'),
    // Sidebar HUD v2.0 Elements
    sidebarHud: document.getElementById('sidebarHud'),
    sbProgressCount: document.getElementById('sbProgressCount'),
    sbProgressBarFill: document.getElementById('sbProgressBarFill'),
    sbProgressPct: document.getElementById('sbProgressPct'),
    sbEvidenceCardsList: document.getElementById('sbEvidenceCardsList'),
    sbFragBox1: document.getElementById('sbFragBox1'),
    sbFragVal1: document.getElementById('sbFragVal1'),
    sbFragBox2: document.getElementById('sbFragBox2'),
    sbFragVal2: document.getElementById('sbFragVal2'),
    sbFragBox3: document.getElementById('sbFragBox3'),
    sbFragVal3: document.getElementById('sbFragVal3'),
    sbAssemblyKeyString: document.getElementById('sbAssemblyKeyString'),
    sbReconstructArea: document.getElementById('sbReconstructArea'),
    sbReadyCard: document.getElementById('sbReadyCard'),
    reconstructBtn: document.getElementById('reconstructBtn'),
    sbAccessKeyPanel: document.getElementById('sbAccessKeyPanel'),
    sbAccessKeyValue: document.getElementById('sbAccessKeyValue'),
    sbCopyKeyBtn: document.getElementById('sbCopyKeyBtn'),
    sbActivityLog: document.getElementById('sbActivityLog'),
    // Top-Right Toast Notification
    toastNotification: document.getElementById('toastNotification'),
    toastTitle: document.getElementById('toastTitle'),
    toastLabel: document.getElementById('toastLabel'),
    toastVal: document.getElementById('toastVal'),
    toastCountBadge: document.getElementById('toastCountBadge'),
    // Modals
    keyModal: document.getElementById('keyModal'),
    scanningPhase: document.getElementById('scanningPhase'),
    resultPhase: document.getElementById('resultPhase'),
    scanProgressFill: document.getElementById('scanProgressFill'),
    finalAccessKeyDisplay: document.getElementById('finalAccessKeyDisplay'),
    keyModalFooter: document.getElementById('keyModalFooter'),
    copyKeyBtn: document.getElementById('copyKeyBtn')
  };

  // --------------------------------------------------------------------------
  // 5. TOP-RIGHT TOAST NOTIFICATION ENGINE (3 Seconds Duration)
  // --------------------------------------------------------------------------
  let toastTimer = null;

  function triggerToastNotification(evDef, totalCount) {
    playGlitchSound();

    if (elements.toastTitle) {
      elements.toastTitle.innerText = `${evDef.type.toUpperCase()} RECOVERED`;
    }
    if (elements.toastLabel) {
      elements.toastLabel.innerText = `${evDef.label}:`;
    }
    if (elements.toastVal) {
      elements.toastVal.innerText = evDef.getValue();
    }
    if (elements.toastCountBadge) {
      elements.toastCountBadge.innerText = `(${totalCount} / 8)`;
    }

    if (elements.toastNotification) {
      elements.toastNotification.classList.remove('active');
      void elements.toastNotification.offsetWidth; // Reflow for animation restart
      elements.toastNotification.classList.add('active');

      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        elements.toastNotification.classList.remove('active');
      }, 3000);
    }
  }

  // --------------------------------------------------------------------------
  // 6. PERSISTENT SIDEBAR HUD v2.0 RENDER ENGINE
  // --------------------------------------------------------------------------
  function updateDigitalForensicsUI() {
    let recoveredCount = 0;
    
    // Check evidence status & update Red Zone visual badges
    EVIDENCE_DEFINITIONS.forEach(ev => {
      const isRecovered = !!state.evidence[ev.id];
      if (isRecovered) {
        recoveredCount++;
      }

      // Update element investigated class & green investigated badge
      const rzElement = document.querySelector(`[data-redzone-id="${ev.redZoneId}"]`);
      if (rzElement) {
        if (isRecovered) {
          rzElement.classList.add('investigated');
        } else {
          rzElement.classList.remove('investigated');
        }
      }

      const badgeEl = document.getElementById(`rzBadge${ev.redZoneId}`);
      if (badgeEl) {
        badgeEl.innerHTML = isRecovered ? '🟢 INVESTIGATED' : '';
      }
    });

    const pct = Math.round((recoveredCount / 8) * 100);

    // 1. Progress Card Update
    if (elements.sbProgressCount) {
      elements.sbProgressCount.innerText = `${recoveredCount} / 8`;
    }
    if (elements.sbProgressBarFill) {
      elements.sbProgressBarFill.style.width = `${pct}%`;
    }
    if (elements.sbProgressPct) {
      elements.sbProgressPct.innerText = `${pct}% COMPLETE`;
    }

    // 2. Render 8 Live Evidence Cards with Type Status Colors
    if (elements.sbEvidenceCardsList) {
      elements.sbEvidenceCardsList.innerHTML = EVIDENCE_DEFINITIONS.map((ev, index) => {
        const isRecovered = !!state.evidence[ev.id];
        const numStr = String(index + 1).padStart(2, '0');
        return `
          <div class="sb-evidence-card ${ev.typeClass} ${isRecovered ? 'recovered' : ''}">
            <div class="sb-ev-left">
              <span class="sb-ev-num">[${numStr}]</span>
              <span>${ev.icon}</span>
              <span class="sb-ev-title">${ev.title}</span>
            </div>
            <span class="sb-ev-status">${isRecovered ? 'DETECTED ✓' : 'PENDING'}</span>
          </div>
        `;
      }).join('');
    }

    // 3. Access Fragments Assembly Boxes (Ev 1, 3, 6)
    const f1Found = !!state.evidence[1];
    const f2Found = !!state.evidence[3];
    const f3Found = !!state.evidence[6];

    if (elements.sbFragBox1 && elements.sbFragVal1) {
      elements.sbFragVal1.innerText = f1Found ? activeSet.f1 : '---';
      elements.sbFragBox1.classList.toggle('active', f1Found);
    }
    if (elements.sbFragBox2 && elements.sbFragVal2) {
      elements.sbFragVal2.innerText = f2Found ? activeSet.f2 : '---';
      elements.sbFragBox2.classList.toggle('active', f2Found);
    }
    if (elements.sbFragBox3 && elements.sbFragVal3) {
      elements.sbFragVal3.innerText = f3Found ? activeSet.f3 : '---';
      elements.sbFragBox3.classList.toggle('active', f3Found);
    }

    // Progressive Assembly Key String
    if (elements.sbAssemblyKeyString) {
      let parts = [];
      if (f1Found) parts.push(activeSet.f1);
      if (f2Found) parts.push(activeSet.f2);
      if (f3Found) parts.push(activeSet.f3);

      if (parts.length === 0) {
        elements.sbAssemblyKeyString.innerText = 'PENDING FRAGMENTS...';
      } else {
        elements.sbAssemblyKeyString.innerText = parts.join('-');
      }
    }

    // 4. Ready Card & Reconstruct CTA State
    const allRequiredFound = f1Found && f2Found && f3Found;
    if (elements.sbReadyCard) {
      elements.sbReadyCard.classList.toggle('hidden', !allRequiredFound || state.isReconstructed);
    }
    if (elements.reconstructBtn) {
      elements.reconstructBtn.disabled = !allRequiredFound;
    }

    // 5. Access Key Panel (Post Reconstruction)
    if (state.isReconstructed) {
      if (elements.sbReconstructArea) elements.sbReconstructArea.classList.add('hidden');
      if (elements.sbAccessKeyPanel) elements.sbAccessKeyPanel.classList.remove('hidden');
      if (elements.sbAccessKeyValue) elements.sbAccessKeyValue.innerText = activeSet.key;
    } else {
      if (elements.sbReconstructArea) elements.sbReconstructArea.classList.remove('hidden');
      if (elements.sbAccessKeyPanel) elements.sbAccessKeyPanel.classList.add('hidden');
    }

    // 6. Live Activity Log (Max 10 entries, newest on top)
    if (elements.sbActivityLog) {
      if (state.logs.length === 0) {
        elements.sbActivityLog.innerHTML = `<div class="log-empty">No evidence collected yet.</div>`;
      } else {
        const visibleLogs = state.logs.slice(0, 10);
        elements.sbActivityLog.innerHTML = visibleLogs.map(log => `
          <div class="log-entry">
            <span class="log-timestamp">[${log.timestamp}]</span>
            <span class="log-text">${log.text} (${log.name})</span>
          </div>
        `).join('');
      }
    }
  }

  function addLogEntry(evDef) {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0]; // HH:MM:SS
    const logItem = {
      timestamp: timestamp,
      text: `Recovered ${evDef.type}`,
      name: evDef.name
    };
    state.logs.unshift(logItem); // Newest at top
    sessionStorage.setItem('glitch_investigation_logs', JSON.stringify(state.logs));
  }

  function collectEvidence(evId) {
    if (state.evidence[evId]) return; // Collected only once

    const evDef = EVIDENCE_DEFINITIONS.find(e => e.id === evId);
    if (!evDef) return;

    state.evidence[evId] = true;
    sessionStorage.setItem(`glitch_ev_${evId}`, 'true');

    // Calculate updated count
    let currentCount = 0;
    Object.values(state.evidence).forEach(val => { if (val) currentCount++; });

    // Add Log Entry
    addLogEntry(evDef);

    // Trigger Top-Right Toast Notification
    triggerToastNotification(evDef, currentCount);

    // Live Sidebar UI Update
    updateDigitalForensicsUI();
  }

  // Sound Toggle Listener
  if (elements.soundToggleBtn) {
    elements.soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.sfxEnabled = !state.sfxEnabled;
      elements.soundIcon.innerText = state.sfxEnabled ? '🔊' : '🔇';
      const textEl = elements.soundToggleBtn.querySelector('.btn-text');
      if (textEl) {
        textEl.innerText = state.sfxEnabled ? 'SFX: ON' : 'SFX: OFF';
      }
      playClick();
    });
  }

  // --------------------------------------------------------------------------
  // 7. UPGRADED RECOVERY MECHANICS (8 Unique Interactions v2.1)
  // --------------------------------------------------------------------------

  // EVIDENCE 01: Access Fragment 1 (Hover Logo 2 Seconds)
  let logoHoverTimer = null;
  let logoHoverStartTime = 0;
  let logoHoverAnimFrame = null;

  function updateLogoHoverProgress() {
    if (!logoHoverStartTime) return;
    const elapsed = Date.now() - logoHoverStartTime;
    const pct = Math.min(100, (elapsed / 2000) * 100);
    if (elements.logoHoverProgress) {
      elements.logoHoverProgress.style.width = pct + '%';
    }

    if (pct < 100) {
      logoHoverAnimFrame = requestAnimationFrame(updateLogoHoverProgress);
    }
  }

  if (elements.navLogo) {
    elements.navLogo.addEventListener('mouseenter', () => {
      if (state.evidence[1]) return;
      logoHoverStartTime = Date.now();
      if (elements.logoHoverProgress) elements.logoHoverProgress.style.width = '0%';
      logoHoverAnimFrame = requestAnimationFrame(updateLogoHoverProgress);

      logoHoverTimer = setTimeout(() => {
        elements.navLogo.classList.add('glitch-active');
        collectEvidence(1);
        setTimeout(() => elements.navLogo.classList.remove('glitch-active'), 500);
        resetLogoHover();
      }, 2000);
    });

    elements.navLogo.addEventListener('mouseleave', resetLogoHover);
  }

  function resetLogoHover() {
    clearTimeout(logoHoverTimer);
    cancelAnimationFrame(logoHoverAnimFrame);
    logoHoverStartTime = 0;
    if (elements.logoHoverProgress) elements.logoHoverProgress.style.width = '0%';
  }

  // EVIDENCE 02: System Log (Double-Click Feature Card)
  if (elements.cardCyberSecurity) {
    elements.cardCyberSecurity.addEventListener('dblclick', () => {
      if (state.evidence[2]) return;
      playClick();
      elements.cardCyberSecurity.classList.add('glitch-active');
      setTimeout(() => elements.cardCyberSecurity.classList.remove('glitch-active'), 600);
      collectEvidence(2);
    });
  }

  // EVIDENCE 03: Access Fragment 2 (Click Footer 5 Times)
  let footerClickCount = 0;
  let footerResetTimer = null;

  if (elements.footerCopyright) {
    elements.footerCopyright.addEventListener('click', () => {
      if (state.evidence[3]) return;
      playClick();
      footerClickCount++;

      elements.footerCopyright.classList.add('glitch-active');
      setTimeout(() => elements.footerCopyright.classList.remove('glitch-active'), 200);

      clearTimeout(footerResetTimer);
      footerResetTimer = setTimeout(() => {
        footerClickCount = 0;
      }, 3000);

      if (footerClickCount >= 5) {
        footerClickCount = 0;
        if (elements.glitchFlash) {
          elements.glitchFlash.classList.add('active');
          setTimeout(() => elements.glitchFlash.classList.remove('active'), 500);
        }
        collectEvidence(3);
      }
    });
  }

  // EVIDENCE 04: Corrupted Archive (Long Press 2 Seconds)
  let longpressTimer = null;
  let longpressStartTime = 0;
  let longpressAnimFrame = null;

  const longpressBarEl = document.getElementById('longpressBar');

  function updateLongpressProgress() {
    if (!longpressStartTime) return;
    const elapsed = Date.now() - longpressStartTime;
    const pct = Math.min(100, (elapsed / 2000) * 100);
    if (longpressBarEl) {
      longpressBarEl.style.width = pct + '%';
    }

    if (pct < 100) {
      longpressAnimFrame = requestAnimationFrame(updateLongpressProgress);
    }
  }

  function startLongpress() {
    if (state.evidence[4]) return;
    longpressStartTime = Date.now();
    if (longpressBarEl) longpressBarEl.style.width = '0%';
    longpressAnimFrame = requestAnimationFrame(updateLongpressProgress);

    longpressTimer = setTimeout(() => {
      if (elements.brokenImageNode) {
        elements.brokenImageNode.classList.add('glitch-active');
        setTimeout(() => elements.brokenImageNode.classList.remove('glitch-active'), 500);
      }
      collectEvidence(4);
      resetLongpress();
    }, 2000);
  }

  function resetLongpress() {
    clearTimeout(longpressTimer);
    cancelAnimationFrame(longpressAnimFrame);
    longpressStartTime = 0;
    if (longpressBarEl) longpressBarEl.style.width = '0%';
  }

  if (elements.brokenImageNode) {
    elements.brokenImageNode.addEventListener('mousedown', startLongpress);
    elements.brokenImageNode.addEventListener('mouseup', resetLongpress);
    elements.brokenImageNode.addEventListener('mouseleave', resetLongpress);
    elements.brokenImageNode.addEventListener('touchstart', startLongpress);
    elements.brokenImageNode.addEventListener('touchend', resetLongpress);
  }

  // EVIDENCE 05: Deleted Message (Triple Click within 2 Seconds)
  let emailClicks = [];

  if (elements.contactEmailZone) {
    elements.contactEmailZone.addEventListener('click', () => {
      if (state.evidence[5]) return;
      playClick();
      const now = Date.now();
      emailClicks.push(now);

      // Keep only clicks within last 2000ms
      emailClicks = emailClicks.filter(t => now - t <= 2000);

      if (emailClicks.length >= 3) {
        emailClicks = [];
        elements.contactEmailZone.classList.add('glitch-active');
        setTimeout(() => elements.contactEmailZone.classList.remove('glitch-active'), 500);
        collectEvidence(5);
      }
    });
  }

  // EVIDENCE 06: Access Fragment 3 (Drag & Drop Recovery Zone)
  const dragSource = document.getElementById('dragCorruptedFile');
  const dropZone = document.getElementById('dropRecoveryZone');

  if (dragSource && dropZone) {
    dragSource.addEventListener('dragstart', (e) => {
      if (state.evidence[6]) return;
      playClick();
      e.dataTransfer.setData('text/plain', 'ev06');
    });

    dropZone.addEventListener('dragover', (e) => {
      if (state.evidence[6]) return;
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
      if (state.evidence[6]) return;
      e.preventDefault();
      dropZone.classList.remove('drag-over');

      playGlitchSound();
      dropZone.innerHTML = '<span style="color: #00ffaa; font-weight: 700">⚡ SCANNING & EXTRACTING FRAGMENT...</span>';

      setTimeout(() => {
        collectEvidence(6);
        dropZone.innerHTML = '<span style="color: #00ffaa; font-weight: 700">✓ FRAGMENT RECOVERED</span>';
      }, 800);
    });
  }

  // EVIDENCE 07: Security Report (Correct Order Puzzle: 1. FIREWALL -> 2. DATABASE -> 3. SERVER)
  let puzzleStepsEntered = [];
  const puzzleChip1 = document.getElementById('puzzleChip1');
  const puzzleChip2 = document.getElementById('puzzleChip2');
  const puzzleChip3 = document.getElementById('puzzleChip3');

  function handlePuzzleChipClick(stepNumber, btnEl) {
    if (state.evidence[7]) return;
    playClick();

    const expectedNext = puzzleStepsEntered.length + 1;
    if (stepNumber === expectedNext) {
      puzzleStepsEntered.push(stepNumber);
      btnEl.classList.add('active');

      if (puzzleStepsEntered.length === 3) {
        collectEvidence(7);
      }
    } else {
      // Wrong sequence -> Reset puzzle chips
      playGlitchSound();
      [puzzleChip1, puzzleChip2, puzzleChip3].forEach(b => {
        if (b) {
          b.classList.remove('active');
          b.classList.add('wrong');
          setTimeout(() => b.classList.remove('wrong'), 500);
        }
      });
      puzzleStepsEntered = [];
    }
  }

  if (puzzleChip1) puzzleChip1.addEventListener('click', () => handlePuzzleChipClick(1, puzzleChip1));
  if (puzzleChip2) puzzleChip2.addEventListener('click', () => handlePuzzleChipClick(2, puzzleChip2));
  if (puzzleChip3) puzzleChip3.addEventListener('click', () => handlePuzzleChipClick(3, puzzleChip3));

  // EVIDENCE 08: Authentication Record (Dual Activation within 5s)
  let switchAActive = false;
  let switchBActive = false;
  let dualSwitchTimer = null;

  const dualSwitchA = document.getElementById('dualSwitchA');
  const dualSwitchB = document.getElementById('dualSwitchB');

  function resetDualSwitches() {
    clearTimeout(dualSwitchTimer);
    dualSwitchTimer = null;
    switchAActive = false;
    switchBActive = false;
    if (dualSwitchA) {
      dualSwitchA.classList.remove('active');
      dualSwitchA.innerText = 'SW-A [OFF]';
    }
    if (dualSwitchB) {
      dualSwitchB.classList.remove('active');
      dualSwitchB.innerText = 'SW-B [OFF]';
    }
  }

  function handleDualSwitchClick(switchId) {
    if (state.evidence[8]) return;
    playClick();

    if (!dualSwitchTimer) {
      // Start 5 second countdown window
      dualSwitchTimer = setTimeout(() => {
        playGlitchSound();
        resetDualSwitches();
      }, 5000);
    }

    if (switchId === 'A') {
      switchAActive = !switchAActive;
      if (dualSwitchA) {
        dualSwitchA.classList.toggle('active', switchAActive);
        dualSwitchA.innerText = switchAActive ? 'SW-A [ON]' : 'SW-A [OFF]';
      }
    } else if (switchId === 'B') {
      switchBActive = !switchBActive;
      if (dualSwitchB) {
        dualSwitchB.classList.toggle('active', switchBActive);
        dualSwitchB.innerText = switchBActive ? 'SW-B [ON]' : 'SW-B [OFF]';
      }
    }

    if (switchAActive && switchBActive) {
      clearTimeout(dualSwitchTimer);
      dualSwitchTimer = null;
      collectEvidence(8);
    }
  }

  if (dualSwitchA) dualSwitchA.addEventListener('click', () => handleDualSwitchClick('A'));
  if (dualSwitchB) dualSwitchB.addEventListener('click', () => handleDualSwitchClick('B'));

  // --------------------------------------------------------------------------
  // 8. RECONSTRUCTION PANEL & ACCESS KEY GENERATION
  // --------------------------------------------------------------------------
  if (elements.reconstructBtn) {
    elements.reconstructBtn.addEventListener('click', () => {
      if (state.evidence[1] && state.evidence[3] && state.evidence[6]) {
        playClick();
        openReconstructionModal();
      }
    });
  }

  function openReconstructionModal() {
    if (!elements.keyModal) return;
    elements.keyModal.classList.add('active');
    if (elements.scanningPhase) elements.scanningPhase.classList.remove('hidden');
    if (elements.resultPhase) elements.resultPhase.classList.add('hidden');
    if (elements.keyModalFooter) elements.keyModalFooter.classList.add('hidden');
    if (elements.scanProgressFill) elements.scanProgressFill.style.width = '0%';

    playGlitchSound();

    let startTime = Date.now();
    let duration = 2000;

    let interval = setInterval(() => {
      let elapsed = Date.now() - startTime;
      let pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      if (elements.scanProgressFill) elements.scanProgressFill.style.width = pct + '%';

      if (pct % 25 === 0 && pct < 100) {
        playGlitchSound();
      }

      if (pct >= 100) {
        clearInterval(interval);
        finishReconstruction();
      }
    }, 50);
  }

  function finishReconstruction() {
    playSuccessSound();
    state.isReconstructed = true;
    sessionStorage.setItem('glitch_reconstructed', 'true');

    if (elements.scanningPhase) elements.scanningPhase.classList.add('hidden');
    if (elements.resultPhase) elements.resultPhase.classList.remove('hidden');
    if (elements.keyModalFooter) elements.keyModalFooter.classList.remove('hidden');
    if (elements.finalAccessKeyDisplay) elements.finalAccessKeyDisplay.innerText = activeSet.key;

    updateDigitalForensicsUI();
  }

  function handleCopyKey() {
    playClick();
    const key = activeSet.key;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(key).then(showCopiedFeedback, fallbackCopy);
    } else {
      fallbackCopy();
    }
  }

  if (elements.copyKeyBtn) {
    elements.copyKeyBtn.addEventListener('click', handleCopyKey);
  }
  if (elements.sbCopyKeyBtn) {
    elements.sbCopyKeyBtn.addEventListener('click', handleCopyKey);
  }

  function fallbackCopy() {
    const key = activeSet.key;
    const tempInput = document.createElement('input');
    tempInput.value = key;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showCopiedFeedback();
  }

  function showCopiedFeedback() {
    alert(`Access Key ${activeSet.key} copied to clipboard!\n\nReturn to Mission Console to verify and complete Mission 03.`);
    if (elements.keyModal) elements.keyModal.classList.remove('active');
  }

  // --------------------------------------------------------------------------
  // 9. RANDOM AMBIENT GLITCH ENGINE (Every 20-30s)
  // --------------------------------------------------------------------------
  function triggerAmbientGlitch() {
    const targets = [
      document.querySelector('.hero-title'),
      document.querySelector('.nav-brand'),
      document.querySelector('.about-terminal'),
      document.querySelector('.features-grid'),
      document.querySelector('.timeline'),
      document.querySelector('.footer')
    ];

    const randomTarget = targets[Math.floor(Math.random() * targets.length)];
    if (randomTarget) {
      randomTarget.classList.add('glitch-active');
      playGlitchSound();
      setTimeout(() => randomTarget.classList.remove('glitch-active'), 350);
    }

    scheduleNextGlitch();
  }

  function scheduleNextGlitch() {
    const randomDelay = Math.floor(Math.random() * 10000) + 20000;
    setTimeout(triggerAmbientGlitch, randomDelay);
  }

  // Initial Setup
  updateDigitalForensicsUI();
  scheduleNextGlitch();

})();
