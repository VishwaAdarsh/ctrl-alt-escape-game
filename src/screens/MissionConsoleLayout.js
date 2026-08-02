/* ==========================================================================
   CTRL + ALT + ESCAPE | Layout B: Reused Mission Console Wrapper
   ========================================================================== */

import { gameState } from '../state.js';
import { audio } from '../audio.js';
import { renderProgressTracker } from '../components/ProgressTracker.js';

export function renderMissionConsoleLayout(container, missionConfig) {
  const state = gameState.get();
  const keyState = state.accessKeys[missionConfig.keyId];
  const isCompleted = keyState ? keyState.recovered : false;

  container.innerHTML = `
    <div class="console-container">
      <!-- Mission Header Block -->
      <div class="mission-header-block">
        <div class="main-mission-number">${missionConfig.missionNumberLabel}</div>
        <h1 class="main-mission-title">${missionConfig.title}</h1>
        <p class="main-mission-subtitle">${missionConfig.subtitle}</p>
      </div>

      <!-- Objective Card -->
      <div class="glass-card">
        <div style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.6rem; color: var(--color-primary); font-family: var(--font-header); font-size: 1.05rem; font-weight: 700">
          <span>🎯</span>
          <span>OBJECTIVE</span>
        </div>
        <p style="font-size: 0.95rem; color: var(--color-text); line-height: 1.6">
          ${missionConfig.objectiveText}
        </p>
      </div>

      <!-- Mission Clue Card -->
      <div class="glass-card">
        <div style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.6rem; color: var(--color-primary); font-family: var(--font-header); font-size: 1.05rem; font-weight: 700">
          <span>ℹ️</span>
          <span>MISSION CLUE</span>
        </div>
        <p style="font-size: 0.95rem; color: var(--color-text); line-height: 1.6">
          ${missionConfig.clueText}
        </p>
      </div>

      <!-- MISSION MODULE (Only this section changes per mission!) -->
      <div id="missionModuleSlot" style="margin-top: 0.5rem; margin-bottom: 0.5rem">
        <!-- Injected dynamically by mission module render function -->
      </div>

      <!-- Access Key Card -->
      <div class="access-key-card">
        <h3 class="access-key-title">ENTER ACCESS KEY</h3>

        <form id="keyVerifyForm" style="width: 100%">
          <div style="position: relative; margin-bottom: 1.2rem">
            <input 
              type="text" 
              id="keyInput" 
              class="cyber-input" 
              placeholder="Enter the decoded Access Key..." 
              value="${isCompleted ? (keyState ? keyState.code : '') : ''}"
              ${isCompleted ? 'disabled' : ''}
              autocomplete="off"
              aria-label="Enter the decoded Access Key"
              aria-required="true"
              required
            />
          </div>

          <button type="submit" class="btn-verify" ${isCompleted ? 'disabled' : ''} aria-label="Verify Access Key Code">
            <span>${isCompleted ? 'ACCESS GRANTED ✓' : 'VERIFY KEY'}</span>
            <span>➔</span>
          </button>
        </form>
      </div>

      <!-- Footer: Mission Progress Bar -->
      <div id="progressTrackerSlot">
        ${renderProgressTracker()}
      </div>
    </div>
  `;

  // Render the specific Mission Module into the slot
  const slot = container.querySelector('#missionModuleSlot');
  if (slot && typeof missionConfig.renderModule === 'function') {
    missionConfig.renderModule(slot);
  }

  // UX Polish: Autofocus on input when screen opens
  const inputEl = container.querySelector('#keyInput');
  if (inputEl && !isCompleted) {
    setTimeout(() => {
      inputEl.focus();
    }, 80);
  }

  // UX Polish: ESC Key Listener to close active modal
  const handleEscKey = (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('notificationModal');
      if (modal && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
      }
    }
  };
  window.addEventListener('keydown', handleEscKey);

  // Handle Access Key Verification Form Submission
  const verifyForm = container.querySelector('#keyVerifyForm');
  verifyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = verifyForm.querySelector('button[type="submit"]');
    const val = inputEl ? inputEl.value : '';

    // UX Polish: Prevent double click / spamming
    if (submitBtn) submitBtn.disabled = true;

    let res;
    if (missionConfig.keyId === 'master') {
      // Final Mission Ignition
      const clean = val.trim().toUpperCase();
      if (clean === 'ELYSIUM-CORE-RESTORED' || (state.accessKeys.key1.recovered && state.accessKeys.key2.recovered && state.accessKeys.key3.recovered)) {
        audio.playVictory();
        gameState.completeFinalMission();
        return;
      } else {
        res = { success: false, reason: 'ACCESS_DENIED' };
      }
    } else {
      res = gameState.verifyAccessKey(missionConfig.keyId, val);
    }

    if (res.success) {
      audio.playAccessGranted();

      // UX Polish: Soft green glow on input
      if (inputEl) {
        inputEl.classList.remove('error');
        inputEl.classList.add('success');
        inputEl.disabled = true;
      }

      let nextView = 'DASHBOARD';
      if (missionConfig.keyId === 'key1') nextView = 'MISSION_2';
      else if (missionConfig.keyId === 'key2') nextView = 'MISSION_3';
      else if (missionConfig.keyId === 'key3') nextView = 'FINAL_MISSION';

      showMissionCompletePopup({
        keyId: missionConfig.keyId,
        recoveredKey: res.key,
        onContinue: () => {
          window.removeEventListener('keydown', handleEscKey);
          gameState.setView(nextView);
        },
        onDashboard: () => {
          window.removeEventListener('keydown', handleEscKey);
          gameState.setView('DASHBOARD');
        }
      });
    } else {
      audio.playAccessDenied();

      // UX Polish: Red error border flash, keep text visible & focus input
      if (inputEl) {
        inputEl.classList.add('error');
        setTimeout(() => {
          inputEl.classList.remove('error');
        }, 800);
        inputEl.focus();
      }

      // Re-enable button for retry
      if (submitBtn) submitBtn.disabled = false;

      const attempts = res.attempts || 1;
      let feedbackMsg = `Incorrect transmission.\nPlease try again.`;
      if (attempts === 2) {
        feedbackMsg = `The transmission is still incorrect.\nReview the binary carefully.`;
      } else if (attempts >= 3) {
        feedbackMsg = `Multiple incorrect attempts detected.\nConsider using a hint.`;
      }

      showNotification('ACCESS DENIED', feedbackMsg, 'denied');
    }
  });
}

function showMissionCompletePopup({ keyId, recoveredKey, onContinue, onDashboard }) {
  const modal = document.getElementById('notificationModal');
  const content = document.getElementById('modalContent');
  if (!modal || !content) return;

  let missionTitle = 'MISSION COMPLETED';
  let subtitleText = 'Transmission successfully decoded.';
  let keyLabel = 'ACCESS KEY SECURED';
  let nextLabel = 'CONTINUE TO NEXT MISSION ➔';
  let nextInfo = 'Next mission is now available.';

  if (keyId === 'key1') {
    missionTitle = 'MISSION 01 COMPLETED';
    subtitleText = 'Binary transmission successfully decoded.';
    keyLabel = 'ACCESS KEY #1 SECURED';
    nextLabel = 'CONTINUE TO MISSION 02 ➔';
    nextInfo = 'Mission 02 is now available.';
  } else if (keyId === 'key2') {
    missionTitle = 'MISSION 02 COMPLETED';
    subtitleText = 'QR Quest downlink successfully decoded.';
    keyLabel = 'ACCESS KEY #2 SECURED';
    nextLabel = 'CONTINUE TO MISSION 03 ➔';
    nextInfo = 'Mission 03 is now available.';
  } else if (keyId === 'key3') {
    missionTitle = 'MISSION 03 COMPLETED';
    subtitleText = 'Glitch memory anomalies successfully purged.';
    keyLabel = 'ACCESS KEY #3 SECURED';
    nextLabel = 'CONTINUE TO OMEGA PROTOCOL ⚡';
    nextInfo = 'Omega Protocol is now unlocked.';
  }

  content.className = 'modal-card granted';
  content.innerHTML = `
    <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-success); letter-spacing: 2px; margin-bottom: 0.3rem">
      [ACCESS GRANTED]
    </div>
    <h3 class="modal-title" style="color: var(--color-success); margin-bottom: 0.4rem">
      ${missionTitle}
    </h3>
    <p style="font-size: 0.85rem; color: var(--color-muted); margin-bottom: 1rem">
      ${subtitleText}
    </p>

    <!-- Revealed Access Key Container -->
    <div style="background: rgba(5, 7, 13, 0.85); border: 1px solid var(--color-success); box-shadow: 0 0 15px rgba(0, 255, 138, 0.2); border-radius: var(--radius-sm); padding: 0.8rem 1rem; margin-bottom: 1rem; text-align: center">
      <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-success); letter-spacing: 1.5px; margin-bottom: 0.3rem">
        🔑 ${keyLabel}
      </div>
      <div style="font-family: var(--font-mono); font-size: 1.15rem; font-weight: 700; color: var(--color-text); letter-spacing: 2px">
        ${recoveredKey || 'ELYSIUM-ALPHA-7701'}
      </div>
    </div>

    <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-primary); margin-bottom: 1.2rem">
      ${nextInfo}
    </div>

    <div style="display: flex; flex-direction: column; gap: 0.8rem; width: 100%">
      <button class="btn-verify" id="btnModalContinue" style="padding: 0.85rem 1.4rem">
        ${nextLabel}
      </button>
      <button class="hud-btn" id="btnModalDashboard" style="width: 100%; justify-content: center; padding: 0.6rem 1.4rem">
        RETURN TO DASHBOARD
      </button>
    </div>
  `;

  modal.classList.remove('hidden');

  content.querySelector('#btnModalContinue').addEventListener('click', () => {
    audio.playClick();
    modal.classList.add('hidden');
    if (onContinue) onContinue();
  });

  content.querySelector('#btnModalDashboard').addEventListener('click', () => {
    audio.playClick();
    modal.classList.add('hidden');
    if (onDashboard) onDashboard();
  });
}

function showNotification(title, message, type, onClose, buttonText = 'PROCEED ➔') {
  const modal = document.getElementById('notificationModal');
  const content = document.getElementById('modalContent');
  if (!modal || !content) return;

  content.className = `modal-card ${type}`;
  content.innerHTML = `
    <h3 class="modal-title">${title}</h3>
    <p style="white-space: pre-line; font-size: 0.95rem; color: var(--color-text)">${message}</p>
    <button class="btn-verify" id="btnModalClose" style="margin-top: 0.8rem; padding: 0.7rem 1.4rem">${buttonText}</button>
  `;

  modal.classList.remove('hidden');

  content.querySelector('#btnModalClose').addEventListener('click', () => {
    audio.playClick();
    modal.classList.add('hidden');
    if (onClose) onClose();
  });
}
