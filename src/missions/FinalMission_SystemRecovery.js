/* ==========================================================================
   CTRL + ALT + ESCAPE | Final Mission: OMEGA PROTOCOL
   Sprint 5.2 - Master Code Verification & Final Authorization Engine
   ========================================================================== */

import { gameState } from '../state.js';
import { audio } from '../audio.js';
import { api } from '../api.js';

export function renderFinalMission(container) {
  const state = gameState.get();
  const keys = state.accessKeys;

  // 1. Initial UX 2-Second Fade-In Overlay
  const introOverlay = document.createElement('div');
  introOverlay.className = 'omega-intro-overlay';
  introOverlay.innerHTML = `
    <div class="omega-intro-content">
      <div class="omega-intro-badge">ACCESS LEVEL: OMEGA</div>
      <div class="omega-intro-status">Decrypting Final Authorization...</div>
      <div class="omega-intro-sub">Restoring Core Interface...</div>
    </div>
  `;
  document.body.appendChild(introOverlay);

  setTimeout(() => {
    introOverlay.classList.add('fade-out');
    setTimeout(() => {
      if (introOverlay.parentNode) {
        introOverlay.remove();
      }
    }, 600);
  }, 2000);

  // 2. Render Omega Protocol Command Center Layout
  container.innerHTML = `
    <div class="omega-container">
      
      <!-- Top Bar: Header & Critical Status Badge -->
      <div class="omega-top-bar">
        <div class="omega-title-block" style="text-align: left; margin-bottom: 0;">
          <h1 class="omega-main-title" style="font-size: 2.2rem; margin: 0;">OMEGA PROTOCOL</h1>
          <div class="omega-subtitle" id="omegaSubHeader" style="font-size: 0.85rem; margin-top: 0.2rem;">FINAL SYSTEM RESTORATION</div>
        </div>

        <div class="omega-status-badge" id="omegaStatusBadge">
          <span class="pulse-dot-red" id="omegaStatusDot"></span>
          <span id="omegaStatusText">SYSTEM STATUS: CRITICAL</span>
        </div>
      </div>

      <!-- Story Briefing Card -->
      <div class="glass-card omega-story-card">
        <div class="omega-story-header">
          <span>📜 OMEGA PROTOCOL BRIEFING</span>
        </div>
        <div class="omega-story-body">
          <p>All security layers have been restored.</p>
          <p>Three Access Keys have successfully been verified.</p>
          <p>The Core System remains locked.</p>
          <p>Final authorization is now required.</p>
          <p>Only the Master Code can restore the Game Elysium Operating System.</p>
          <p style="color: var(--color-warning); font-weight: 700; margin-top: 0.4rem;">This is your final opportunity. Proceed with caution.</p>
        </div>
      </div>

      <!-- Main Section: 2 Column Grid -->
      <div class="omega-main-grid">
        
        <!-- Left Column: Critical Warning Panel & Master Code Input Card -->
        <div class="omega-left-col">
          
          <!-- Warning Panel Card -->
          <div class="omega-status-panel">
            <div class="omega-panel-header">
              <span>⚠️</span>
              <span id="omegaPanelHeader">FINAL AUTHORIZATION REQUIRED</span>
            </div>

            <div class="omega-status-grid" style="grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));">
              <div class="omega-status-box">
                <span class="omega-box-label">CORE INTEGRITY</span>
                <span class="omega-box-val" id="valCoreIntegrity" style="color: var(--color-danger)">12%</span>
              </div>
              <div class="omega-status-box">
                <span class="omega-box-label">NETWORK</span>
                <span class="omega-box-val" style="color: var(--color-success)">RESTORED</span>
              </div>
              <div class="omega-status-box">
                <span class="omega-box-label">SECURITY KEYS</span>
                <span class="omega-box-val" style="color: var(--color-success)">3 / 3 VERIFIED</span>
              </div>
              <div class="omega-status-box">
                <span class="omega-box-label">SYSTEM STATE</span>
                <span class="omega-box-val" id="valSystemState" style="color: var(--color-danger)">LOCKED</span>
              </div>
              <div class="omega-status-box">
                <span class="omega-box-label">AUTHORIZATION</span>
                <span class="omega-box-val" id="valAuthorization" style="color: var(--color-warning)">PENDING</span>
              </div>
            </div>
          </div>

          <!-- Master Code Panel Card -->
          <div class="omega-action-card" id="omegaActionCard">
            <h2 class="omega-action-title">MASTER CODE</h2>
            <p class="omega-action-text">
              Enter the recovered Master Code to begin final system restoration.
            </p>

            <form id="omegaForm" style="width: 100%" onsubmit="event.preventDefault();">
              <input 
                type="text" 
                id="masterCodeInput" 
                class="omega-input-field" 
                placeholder="ENTER MASTER CODE" 
                autocomplete="off"
                style="text-transform: uppercase;"
              />

              <button type="submit" class="btn-omega-restore" id="btnInitializeOmega" disabled>
                <span>⚡ INITIALIZE OMEGA PROTOCOL ⚡</span>
              </button>
            </form>
          </div>

        </div>

        <!-- Right Column: System Monitor Card & Mission History Card -->
        <div class="omega-right-col">
          
          <!-- System Monitor Card -->
          <div class="glass-card" style="padding: 1.2rem;">
            <div style="font-family: var(--font-header); font-size: 0.9rem; font-weight: 700; color: var(--color-primary); letter-spacing: 1px; margin-bottom: 0.5rem;">
              🖥️ CORE STATUS
            </div>

            <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-text); display: flex; justify-content: space-between;">
              <span>RESTORATION:</span>
              <span id="txtRestorationPercent" style="color: var(--color-primary); font-weight: 700;">62%</span>
            </div>

            <div class="omega-progress-track">
              <div class="omega-progress-fill" id="barRestorationProgress" style="width: 62%;"></div>
            </div>

            <div class="omega-subsystem-list">
              <div class="omega-subsystem-item verified">
                <span>Authentication</span>
                <span>✓ RESTORED</span>
              </div>
              <div class="omega-subsystem-item verified">
                <span>Security</span>
                <span>✓ RESTORED</span>
              </div>
              <div class="omega-subsystem-item verified">
                <span>Communications</span>
                <span>✓ RESTORED</span>
              </div>
              <div class="omega-subsystem-item verified">
                <span>Recovery</span>
                <span>✓ RESTORED</span>
              </div>
              <div class="omega-subsystem-item pending" id="itemCoreEngine">
                <span>Core Engine</span>
                <span id="txtCoreEngineState">⏳ PENDING</span>
              </div>
            </div>
          </div>

          <!-- Mission History Card -->
          <div class="glass-card" style="padding: 1.2rem;">
            <div style="font-family: var(--font-header); font-size: 0.9rem; font-weight: 700; color: var(--color-primary); letter-spacing: 1px; margin-bottom: 0.6rem;">
              📊 MISSION STATUS
            </div>

            <div class="omega-history-list">
              <div class="omega-history-item">
                <span>Mission 01 (Binary Breaker)</span>
                <span>✓ VERIFIED</span>
              </div>
              <div class="omega-history-item">
                <span>Mission 02 (QR Quest)</span>
                <span>✓ VERIFIED</span>
              </div>
              <div class="omega-history-item">
                <span>Mission 03 (The Glitch)</span>
                <span>✓ VERIFIED</span>
              </div>
              <div class="omega-history-item ready" id="itemOmegaHistory">
                <span>Omega Protocol</span>
                <span id="txtOmegaHistoryState">READY</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- Digital Terminal Console -->
      <div class="omega-terminal-box">
        <div class="omega-terminal-header">
          <span>💻 SYSTEM LOG</span>
        </div>
        <div class="omega-terminal-logs" id="omegaTerminalLogs"></div>
      </div>

    </div>
  `;

  // Helper: Append terminal log line with auto-scroll
  const logContainer = container.querySelector('#omegaTerminalLogs');
  function appendTerminalLog(tag, text) {
    if (!logContainer) return;
    const lineEl = document.createElement('div');
    lineEl.className = 'omega-terminal-line';
    const tagClass = tag === 'ERROR' ? 'style="color: var(--color-danger); font-weight: 700;"' : 'class="term-tag"';
    lineEl.innerHTML = `<span ${tagClass}>[${tag}]</span> <span>${text}</span>`;
    logContainer.appendChild(lineEl);
    logContainer.scrollTop = logContainer.scrollHeight;
  }

  // 3. Auto Typing Initial Digital Terminal Logs
  if (logContainer) {
    const initialLogs = [
      'Access Key #1 Verified...',
      'Access Key #2 Verified...',
      'Access Key #3 Verified...',
      'Awaiting Master Code...'
    ];

    let currentLog = 0;
    function typeNextLine() {
      if (currentLog >= initialLogs.length) return;
      const lineText = initialLogs[currentLog];
      const lineEl = document.createElement('div');
      lineEl.className = 'omega-terminal-line';
      lineEl.innerHTML = `<span class="term-tag">[SYSTEM]</span> <span class="term-text"></span><span class="term-cursor"></span>`;
      logContainer.appendChild(lineEl);

      const textEl = lineEl.querySelector('.term-text');
      const cursorEl = lineEl.querySelector('.term-cursor');

      let charIndex = 0;
      const interval = setInterval(() => {
        textEl.textContent += lineText[charIndex];
        charIndex++;
        if (charIndex >= lineText.length) {
          clearInterval(interval);
          cursorEl.remove();
          currentLog++;
          logContainer.scrollTop = logContainer.scrollHeight;
          setTimeout(typeNextLine, 300);
        }
      }, 30);
    }

    setTimeout(typeNextLine, 800);
  }

  // 4. Input & Verification Handler
  const input = container.querySelector('#masterCodeInput');
  const btn = container.querySelector('#btnInitializeOmega');
  const form = container.querySelector('#omegaForm');

  if (input && btn) {
    input.addEventListener('input', () => {
      audio.playClick();
      const hasText = input.value.trim().length > 0;
      btn.disabled = !hasText;
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawVal = input ? input.value : '';
      const cleanVal = rawVal.trim().toUpperCase();

      if (!cleanVal) return;

      // SECURITY RULE: Prevent rapid repeated clicks / disable inputs immediately
      if (input) input.disabled = true;
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>⚡ VERIFYING... ⚡</span>';
      }

      audio.playClick();
      executeAuthenticationSequence(cleanVal);
    });
  }

  // 5. Sprint 5.2 Fullscreen Authentication Sequence
  function executeAuthenticationSequence(submittedCode) {
    // Check Master Code validity
    const key1Code = (keys.key1 && keys.key1.code) ? keys.key1.code.trim().toUpperCase() : 'ELYSIUM-ALPHA-7701';
    const key2Code = (keys.key2 && keys.key2.code) ? keys.key2.code.trim().toUpperCase() : 'ASTRA-3194';
    const key3Code = (keys.key3 && keys.key3.code) ? keys.key3.code.trim().toUpperCase() : 'CYBER-GAMMA-9123';

    const validMasterCodes = new Set([
      'ELYSIUM-CORE-RESTORED',
      'OMEGA-RESTORE-2026',
      'OMEGA-PROTOCOL',
      'ELYSIUM',
      'OMEGA',
      key1Code,
      key2Code,
      key3Code,
      `${key1Code}-${key2Code}-${key3Code}`,
      `${key1Code} ${key2Code} ${key3Code}`
    ]);

    const isValid = validMasterCodes.has(submittedCode);

    // Sync Master Code evaluation with backend
    api.verifyMasterCode(submittedCode);

    // Create Fullscreen HUD Overlay
    const overlay = document.createElement('div');
    overlay.className = 'omega-auth-overlay';
    overlay.id = 'omegaAuthOverlay';
    overlay.innerHTML = `
      <div class="omega-auth-hud-card">
        <div class="omega-auth-badge">OMEGA SECURITY KERNEL</div>
        <h2 class="omega-auth-title">AUTHENTICATION SEQUENCE</h2>

        <div class="omega-auth-steps-list">
          <div class="omega-auth-step-item active" id="authStep1">
            <div class="omega-auth-step-header">
              <span>Step 1: Establishing Secure Connection...</span>
              <span class="step-status">IN PROGRESS</span>
            </div>
            <div class="omega-auth-step-bar-track">
              <div class="omega-auth-step-bar-fill" style="width: 0%;"></div>
            </div>
          </div>

          <div class="omega-auth-step-item" id="authStep2">
            <div class="omega-auth-step-header">
              <span>Step 2: Access Keys Verified...</span>
              <span class="step-status">PENDING</span>
            </div>
            <div class="omega-auth-step-bar-track">
              <div class="omega-auth-step-bar-fill" style="width: 0%;"></div>
            </div>
          </div>

          <div class="omega-auth-step-item" id="authStep3">
            <div class="omega-auth-step-header">
              <span>Step 3: Decrypting Core...</span>
              <span class="step-status">PENDING</span>
            </div>
            <div class="omega-auth-step-bar-track">
              <div class="omega-auth-step-bar-fill" style="width: 0%;"></div>
            </div>
          </div>

          <div class="omega-auth-step-item" id="authStep4">
            <div class="omega-auth-step-header">
              <span>Step 4: Authenticating Master Code...</span>
              <span class="step-status">PENDING</span>
            </div>
            <div class="omega-auth-step-bar-track">
              <div class="omega-auth-step-bar-fill" style="width: 0%;"></div>
            </div>
          </div>

          <div class="omega-auth-step-item" id="authStep5">
            <div class="omega-auth-step-header">
              <span>Step 5: Final Authorization...</span>
              <span class="step-status">PENDING</span>
            </div>
            <div class="omega-auth-step-bar-track">
              <div class="omega-auth-step-bar-fill" style="width: 0%;"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Sequence timing: 5 steps across 5 seconds (1000ms intervals)
    const steps = [
      { id: 'authStep1', log: 'Access Key #1 ........ VERIFIED', delay: 200 },
      { id: 'authStep2', log: 'Access Key #2 ........ VERIFIED', delay: 1100 },
      { id: 'authStep3', log: 'Access Key #3 ........ VERIFIED', delay: 2000 },
      { id: 'authStep4', log: 'Decrypting Core Database...', delay: 2900 },
      { id: 'authStep5', log: 'Validating Master Code...', delay: 3800 }
    ];

    steps.forEach(stepObj => {
      setTimeout(() => {
        const stepEl = overlay.querySelector(`#${stepObj.id}`);
        if (stepEl) {
          stepEl.classList.add('active');
          const fill = stepEl.querySelector('.omega-auth-step-bar-fill');
          const status = stepEl.querySelector('.step-status');
          if (fill) fill.style.width = '100%';
          if (status) status.textContent = 'IN PROGRESS';
        }
        appendTerminalLog('SYSTEM', stepObj.log);
      }, stepObj.delay);

      setTimeout(() => {
        const stepEl = overlay.querySelector(`#${stepObj.id}`);
        if (stepEl) {
          stepEl.classList.remove('active');
          stepEl.classList.add('completed');
          const status = stepEl.querySelector('.step-status');
          if (status) status.textContent = '✓ COMPLETED';
        }
      }, stepObj.delay + 800);
    });

    // Final evaluation after 4.8 seconds
    setTimeout(() => {
      if (overlay.parentNode) overlay.remove();

      if (isValid) {
        handleMasterCodeSuccess();
      } else {
        handleMasterCodeFailure();
      }
    }, 4800);
  }

  // 6. Success Flow: Correct Master Code
  function handleMasterCodeSuccess() {
    audio.playAccessGranted();

    appendTerminalLog('SYSTEM', 'MASTER CODE VERIFIED');
    appendTerminalLog('SYSTEM', 'AUTHORIZATION SUCCESSFUL');

    // Update Top Status Badge to Green Success
    const statusBadge = container.querySelector('#omegaStatusBadge');
    if (statusBadge) {
      statusBadge.style.background = 'rgba(0, 255, 138, 0.15)';
      statusBadge.style.borderColor = 'var(--color-success)';
      statusBadge.style.color = 'var(--color-success)';
      statusBadge.innerHTML = `
        <span class="pulse-dot-green"></span>
        <span>SYSTEM STATUS: AUTHORIZATION SUCCESSFUL</span>
      `;
    }

    // Update Header Status Subtitle
    const subHeader = container.querySelector('#omegaSubHeader');
    if (subHeader) {
      subHeader.textContent = 'AUTHORIZATION SUCCESSFUL // READY FOR RESTORATION';
      subHeader.style.color = 'var(--color-success)';
    }

    // Update Warning Panel Card to Green Verified
    const panelHeader = container.querySelector('#omegaPanelHeader');
    if (panelHeader) {
      panelHeader.textContent = 'AUTHORIZATION GRANTED';
      panelHeader.style.color = 'var(--color-success)';
    }

    const valState = container.querySelector('#valSystemState');
    if (valState) {
      valState.textContent = 'READY';
      valState.style.color = 'var(--color-success)';
    }

    const valAuth = container.querySelector('#valAuthorization');
    if (valAuth) {
      valAuth.textContent = 'VERIFIED';
      valAuth.style.color = 'var(--color-success)';
    }

    const valIntegrity = container.querySelector('#valCoreIntegrity');
    if (valIntegrity) {
      valIntegrity.textContent = '100%';
      valIntegrity.style.color = 'var(--color-success)';
    }

    // Update Subsystem Monitor Card
    const txtPercent = container.querySelector('#txtRestorationPercent');
    if (txtPercent) txtPercent.textContent = '100%';

    const barProgress = container.querySelector('#barRestorationProgress');
    if (barProgress) barProgress.style.width = '100%';

    const itemCoreEngine = container.querySelector('#itemCoreEngine');
    if (itemCoreEngine) {
      itemCoreEngine.className = 'omega-subsystem-item verified';
      const stateTxt = container.querySelector('#txtCoreEngineState');
      if (stateTxt) stateTxt.textContent = '✓ RESTORED';
    }

    const txtOmegaState = container.querySelector('#txtOmegaHistoryState');
    if (txtOmegaState) {
      txtOmegaState.textContent = '✓ VERIFIED';
      txtOmegaState.style.color = 'var(--color-success)';
    }

    // Replace Master Code Input Card with Green Authorization Card
    const actionCard = container.querySelector('#omegaActionCard');
    if (actionCard) {
      actionCard.innerHTML = `
        <div class="omega-success-card">
          <div class="omega-success-badge">[SYSTEM AUTHORIZATION GRANTED]</div>
          <h2 class="omega-success-title">MASTER CODE VERIFIED</h2>
          <div class="omega-success-status">STATUS: AUTHORIZATION SUCCESSFUL</div>

          <div id="omegaSystemResponseSlot">
            <div class="omega-system-response-box">
              <div style="font-weight: 700; margin-bottom: 0.3rem;">SYSTEM RESPONSE</div>
              <div style="color: var(--color-text);">Authorization Accepted...</div>
              <div style="color: var(--color-success); font-weight: 700; margin-top: 0.2rem;">Preparing Restoration Protocol...</div>
            </div>
          </div>
        </div>
      `;

      // ⭐ Small UX Improvement: 2-Second Pause before displaying BEGIN SYSTEM RESTORATION button
      setTimeout(() => {
        const slot = actionCard.querySelector('#omegaSystemResponseSlot');
        if (slot) {
          slot.innerHTML = `
            <button id="btnBeginRestoration" class="btn-omega-begin-restoration">
              <span>⚡ BEGIN SYSTEM RESTORATION ⚡</span>
            </button>
          `;

          const beginBtn = slot.querySelector('#btnBeginRestoration');
          if (beginBtn) {
            beginBtn.addEventListener('click', () => {
              audio.playClick();
              startSystemRestorationCinematic();
            });
          }
        }
      }, 2000);
    }
  }

  // 7. Failure Flow: Incorrect Master Code
  function handleMasterCodeFailure() {
    audio.playAccessDenied();
    appendTerminalLog('ERROR', 'INVALID MASTER CODE DETECTED. ACCESS DENIED.');

    // Render Error Overlay
    const errorOverlay = document.createElement('div');
    errorOverlay.className = 'omega-error-overlay';
    errorOverlay.id = 'omegaErrorOverlay';
    errorOverlay.innerHTML = `
      <div class="omega-error-card">
        <div class="omega-error-icon">🚨</div>
        <h2 class="omega-error-title">ACCESS DENIED</h2>
        <div class="omega-error-subtitle">INVALID MASTER CODE</div>
        <p class="omega-error-desc">
          Please verify your recovered code and try again.
        </p>
      </div>
    `;
    document.body.appendChild(errorOverlay);

    // After 2 seconds: close error overlay and re-enable input/button with value preserved
    setTimeout(() => {
      if (errorOverlay.parentNode) errorOverlay.remove();

      if (input) input.disabled = false;
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>⚡ INITIALIZE OMEGA PROTOCOL ⚡</span>';
      }

      if (input) input.focus();
    }, 2000);
  }

  // 8. Sprint 5.3 Fullscreen System Restoration Cinematic Sequence
  function startSystemRestorationCinematic() {
    // Create Fullscreen Restoration Terminal Overlay
    const terminalOverlay = document.createElement('div');
    terminalOverlay.className = 'omega-restoration-terminal-overlay';
    terminalOverlay.id = 'restorationTerminalOverlay';
    terminalOverlay.innerHTML = `
      <div class="omega-restoration-terminal-card">
        <div class="omega-auth-badge">OMEGA CORE RESTORATION ENGINE</div>
        <h2 class="omega-restoration-stage-title" id="restorationStageTitle">INITIALIZING OMEGA PROTOCOL...</h2>

        <div class="omega-restoration-progress-box">
          <div class="omega-restoration-progress-bar-track">
            <div class="omega-restoration-progress-bar-fill" id="restorationBarFill"></div>
          </div>
          <div class="omega-restoration-percentage" id="restorationPercentText">0%</div>
        </div>

        <div class="omega-restoration-terminal-logs" id="restorationLogs">
          <div>[SYSTEM] INITIALIZING CORE RESTORATION PROTOCOL...</div>
        </div>
      </div>
    `;
    document.body.appendChild(terminalOverlay);

    const stageTitle = terminalOverlay.querySelector('#restorationStageTitle');
    const barFill = terminalOverlay.querySelector('#restorationBarFill');
    const percentText = terminalOverlay.querySelector('#restorationPercentText');
    const logsContainer = terminalOverlay.querySelector('#restorationLogs');

    function appendLog(lineText) {
      if (!logsContainer) return;
      const logLine = document.createElement('div');
      logLine.style.color = 'var(--color-success)';
      logLine.textContent = `[SYSTEM] ${lineText}`;
      logsContainer.appendChild(logLine);
      logsContainer.scrollTop = logsContainer.scrollHeight;
    }

    // Stage 1: Restoring AI Core (25%) - t = 800ms
    setTimeout(() => {
      if (stageTitle) stageTitle.textContent = 'RESTORING AI CORE...';
      if (barFill) barFill.style.width = '25%';
      if (percentText) percentText.textContent = '25%';
      appendLog('Restoring AI Core Subsystem...');
    }, 800);

    // Stage 2: Rebuilding Network (50%) - t = 1800ms
    setTimeout(() => {
      if (stageTitle) stageTitle.textContent = 'REBUILDING NETWORK...';
      if (barFill) barFill.style.width = '50%';
      if (percentText) percentText.textContent = '50%';
      appendLog('Rebuilding Neural Network Nodes...');
    }, 1800);

    // Stage 3: Recovering Memory (75%) - t = 2800ms
    setTimeout(() => {
      if (stageTitle) stageTitle.textContent = 'RECOVERING MEMORY...';
      if (barFill) barFill.style.width = '75%';
      if (percentText) percentText.textContent = '75%';
      appendLog('Recovering Main Database Sectors...');
    }, 2800);

    // Stage 4: Synchronizing Core Systems (100%) - t = 3800ms
    setTimeout(() => {
      if (stageTitle) stageTitle.textContent = 'SYNCHRONIZING CORE SYSTEMS...';
      if (barFill) barFill.style.width = '100%';
      if (percentText) percentText.textContent = '100%';
      appendLog('Synchronizing Operating System Kernels...');
    }, 3800);

    // Stage 5: Final Log Print (Line by Line) - t = 4600ms
    setTimeout(() => {
      const finalLogs = [
        'Core Engine........ONLINE',
        'Security Layer.....ONLINE',
        'AI Engine..........ONLINE',
        'Communications.....ONLINE',
        'Network............ONLINE',
        'System Integrity...100%'
      ];

      finalLogs.forEach((line, index) => {
        setTimeout(() => {
          appendLog(line);
        }, index * 250);
      });
    }, 4600);

    // Stage 6: Cinematic White Flash & Victory Screen Transition - t = 6400ms
    setTimeout(() => {
      // Create White Flash Effect
      const flash = document.createElement('div');
      flash.className = 'omega-cinematic-white-flash';
      document.body.appendChild(flash);

      audio.playVictory();

      setTimeout(() => {
        if (terminalOverlay.parentNode) terminalOverlay.remove();
        if (flash.parentNode) flash.remove();
        gameState.completeFinalMission();
      }, 600);
    }, 6400);
  }
}


