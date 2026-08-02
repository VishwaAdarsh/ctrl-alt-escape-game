/* ==========================================================================
   CTRL + ALT + ESCAPE | Mission 03: The Glitch Engine Script
   ========================================================================== */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. DYNAMIC FRAGMENT SETS & SESSION PERSISTENCE
  // --------------------------------------------------------------------------
  const FRAGMENT_SETS = [
    { set: 'A', f1: 'ELY', f2: 'S1U', f3: 'M42', key: 'GE-42LK-91' },
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
    setIndex = Math.floor(Math.random() * FRAGMENT_SETS.length);
    sessionStorage.setItem('glitch_set_index', setIndex.toString());
  }

  const activeSet = FRAGMENT_SETS[setIndex];

  // State Management
  const state = {
    fragments: {
      1: sessionStorage.getItem('glitch_frag_1') === 'true',
      2: sessionStorage.getItem('glitch_frag_2') === 'true',
      3: sessionStorage.getItem('glitch_frag_3') === 'true'
    },
    sfxEnabled: true
  };

  // --------------------------------------------------------------------------
  // 2. WEB AUDIO API SYNTHESIZER
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

  function playBeep() {
    if (!state.sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
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
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
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
  // 3. UI CONTROLS & HUD PANEL
  // --------------------------------------------------------------------------
  const elements = {
    soundToggleBtn: document.getElementById('soundToggleBtn'),
    soundIcon: document.getElementById('soundIcon'),
    navLogo: document.getElementById('navLogo'),
    logoHoverProgress: document.getElementById('logoHoverProgress'),
    cardCyberSecurity: document.getElementById('cardCyberSecurity'),
    footerCopyright: document.getElementById('footerCopyright'),
    copyrightPulse: document.getElementById('copyrightPulse'),
    hudCounter: document.getElementById('hudCounter'),
    slot1Val: document.getElementById('slot1Val'),
    slot2Val: document.getElementById('slot2Val'),
    slot3Val: document.getElementById('slot3Val'),
    slot1: document.getElementById('slot1'),
    slot2: document.getElementById('slot2'),
    slot3: document.getElementById('slot3'),
    reconstructBtn: document.getElementById('reconstructBtn'),
    fragmentModal: document.getElementById('fragmentModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalDesc: document.getElementById('modalDesc'),
    modalBadgeIcon: document.getElementById('modalBadgeIcon'),
    modalFragCode: document.getElementById('modalFragCode'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    keyModal: document.getElementById('keyModal'),
    scanningPhase: document.getElementById('scanningPhase'),
    resultPhase: document.getElementById('resultPhase'),
    scanProgressFill: document.getElementById('scanProgressFill'),
    finalAccessKeyDisplay: document.getElementById('finalAccessKeyDisplay'),
    keyModalFooter: document.getElementById('keyModalFooter'),
    copyKeyBtn: document.getElementById('copyKeyBtn'),
    glitchFlash: document.getElementById('glitchFlash')
  };

  function updateHUD() {
    let count = 0;
    if (state.fragments[1]) {
      count++;
      elements.slot1Val.innerText = activeSet.f1;
      elements.slot1.classList.add('active');
    } else {
      elements.slot1Val.innerText = '---';
      elements.slot1.classList.remove('active');
    }

    if (state.fragments[2]) {
      count++;
      elements.slot2Val.innerText = activeSet.f2;
      elements.slot2.classList.add('active');
    } else {
      elements.slot2Val.innerText = '---';
      elements.slot2.classList.remove('active');
    }

    if (state.fragments[3]) {
      count++;
      elements.slot3Val.innerText = activeSet.f3;
      elements.slot3.classList.add('active');
    } else {
      elements.slot3Val.innerText = '---';
      elements.slot3.classList.remove('active');
    }

    elements.hudCounter.innerText = `${count} / 3`;
    elements.reconstructBtn.disabled = count < 3;
  }

  function showFragmentModal(title, desc, code, icon) {
    playBeep();
    elements.modalTitle.innerText = title;
    elements.modalDesc.innerText = desc;
    elements.modalFragCode.innerText = code;
    elements.modalBadgeIcon.innerText = icon || '📡';
    elements.fragmentModal.classList.add('active');
  }

  function markFragmentFound(num, code, title, desc, icon) {
    if (state.fragments[num]) return;
    state.fragments[num] = true;
    sessionStorage.setItem(`glitch_frag_${num}`, 'true');
    updateHUD();
    showFragmentModal(title, desc, code, icon);
  }

  // Sound Toggle Listener
  elements.soundToggleBtn.addEventListener('click', () => {
    state.sfxEnabled = !state.sfxEnabled;
    elements.soundIcon.innerText = state.sfxEnabled ? '🔊' : '🔇';
    const textEl = elements.soundToggleBtn.querySelector('.btn-text');
    if (textEl) {
      textEl.innerText = state.sfxEnabled ? 'SFX: ON' : 'SFX: OFF';
    }
    playClick();
  });

  // Modal Close
  elements.modalCloseBtn.addEventListener('click', () => {
    playClick();
    elements.fragmentModal.classList.remove('active');
  });

  // --------------------------------------------------------------------------
  // 4. HIDDEN INTERACTIONS
  // --------------------------------------------------------------------------

  // Fragment 1: Logo Hover for 2 Seconds
  let hoverTimer = null;
  let hoverStartTime = 0;
  let hoverAnimFrame = null;

  function updateHoverProgress() {
    if (!hoverStartTime) return;
    const elapsed = Date.now() - hoverStartTime;
    const pct = Math.min(100, (elapsed / 2000) * 100);
    elements.logoHoverProgress.style.width = pct + '%';

    if (pct < 100) {
      hoverAnimFrame = requestAnimationFrame(updateHoverProgress);
    }
  }

  elements.navLogo.addEventListener('mouseenter', () => {
    if (state.fragments[1]) return;
    hoverStartTime = Date.now();
    elements.logoHoverProgress.style.width = '0%';
    hoverAnimFrame = requestAnimationFrame(updateHoverProgress);

    hoverTimer = setTimeout(() => {
      elements.navLogo.classList.add('glitch-active');
      playGlitchSound();
      markFragmentFound(
        1,
        activeSet.f1,
        'SIGNAL RECOVERED',
        'Fragment 01 extracted from header logo telemetry.',
        '❖'
      );
      setTimeout(() => elements.navLogo.classList.remove('glitch-active'), 500);
      resetLogoHover();
    }, 2000);
  });

  elements.navLogo.addEventListener('mouseleave', resetLogoHover);

  function resetLogoHover() {
    clearTimeout(hoverTimer);
    cancelAnimationFrame(hoverAnimFrame);
    hoverStartTime = 0;
    elements.logoHoverProgress.style.width = '0%';
  }

  // Fragment 2: Double Click on Feature Card 2
  elements.cardCyberSecurity.addEventListener('dblclick', () => {
    playGlitchSound();
    elements.cardCyberSecurity.classList.add('glitch-active');
    setTimeout(() => elements.cardCyberSecurity.classList.remove('glitch-active'), 600);

    markFragmentFound(
      2,
      activeSet.f2,
      'TRANSMISSION FOUND',
      'Fragment 02 intercepted inside Cyber Security module matrix.',
      '🛡️'
    );
  });

  // Fragment 3: Click Footer Copyright 5 Times
  let copyrightClickCount = 0;
  let clickResetTimer = null;

  elements.footerCopyright.addEventListener('click', () => {
    playClick();
    copyrightClickCount++;

    // Visual Feedback
    elements.footerCopyright.classList.add('glitch-active');
    setTimeout(() => elements.footerCopyright.classList.remove('glitch-active'), 200);

    clearTimeout(clickResetTimer);
    clickResetTimer = setTimeout(() => {
      copyrightClickCount = 0;
    }, 3000);

    if (copyrightClickCount >= 5) {
      copyrightClickCount = 0;
      playGlitchSound();

      // Flash Screen
      elements.glitchFlash.classList.add('active');
      setTimeout(() => elements.glitchFlash.classList.remove('active'), 500);

      markFragmentFound(
        3,
        activeSet.f3,
        'DATA RECOVERED',
        'Fragment 03 unmasked in system copyright ledger node.',
        '©'
      );
    }
  });

  // --------------------------------------------------------------------------
  // 5. RECONSTRUCTION PANEL & ACCESS KEY GENERATION
  // --------------------------------------------------------------------------
  elements.reconstructBtn.addEventListener('click', () => {
    if (state.fragments[1] && state.fragments[2] && state.fragments[3]) {
      playClick();
      openReconstructionModal();
    }
  });

  function openReconstructionModal() {
    elements.keyModal.classList.add('active');
    elements.scanningPhase.classList.remove('hidden');
    elements.resultPhase.classList.add('hidden');
    elements.keyModalFooter.classList.add('hidden');
    elements.scanProgressFill.style.width = '0%';

    playGlitchSound();

    let startTime = Date.now();
    let duration = 2000;

    let interval = setInterval(() => {
      let elapsed = Date.now() - startTime;
      let pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      elements.scanProgressFill.style.width = pct + '%';

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
    elements.scanningPhase.classList.add('hidden');
    elements.resultPhase.classList.remove('hidden');
    elements.keyModalFooter.classList.remove('hidden');
    elements.finalAccessKeyDisplay.innerText = activeSet.key;
  }

  elements.copyKeyBtn.addEventListener('click', () => {
    playClick();
    const key = activeSet.key;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(key).then(showCopiedFeedback, fallbackCopy);
    } else {
      fallbackCopy();
    }
  });

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
    elements.keyModal.classList.remove('active');
  }

  // --------------------------------------------------------------------------
  // 6. RANDOM AMBIENT GLITCH ENGINE (Every 20-30s)
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
    const randomDelay = Math.floor(Math.random() * 10000) + 20000; // 20-30s
    setTimeout(triggerAmbientGlitch, randomDelay);
  }

  // Initial Setup
  updateHUD();
  scheduleNextGlitch();

})();
