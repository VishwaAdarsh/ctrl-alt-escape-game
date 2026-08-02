/* ==========================================================================
   CTRL + ALT + ESCAPE | Final Mission: OMEGA PROTOCOL
   Cinematic AAA Final Boss Core Restoration Climax
   ========================================================================== */

import { gameState } from '../state.js';
import { audio } from '../audio.js';

export function renderFinalMission(container) {
  const state = gameState.get();
  const keys = state.accessKeys;

  container.innerHTML = `
    <div class="omega-container">
      <!-- Title Block -->
      <div class="omega-title-block">
        <h1 class="omega-main-title">⚠ OMEGA PROTOCOL</h1>
        <p class="omega-subtitle">EMERGENCY CORE RESTORATION</p>
      </div>

      <!-- Main Emergency Status Panel -->
      <div class="omega-status-panel">
        <div class="omega-panel-header">
          <span>⚠</span>
          <span>CRITICAL SYSTEM FAILURE</span>
        </div>
        <p style="font-size: 0.95rem; color: var(--color-text); line-height: 1.6">
          Game Elysium Core has entered catastrophic failure. Security layers are corrupted and immediate core ignition is required.
        </p>

        <div class="omega-status-grid">
          <div class="omega-status-box">
            <span class="omega-box-label">SECURITY LAYERS</span>
            <span class="omega-box-val" style="color: var(--color-danger)">BREACHED</span>
          </div>

          <div class="omega-status-box">
            <span class="omega-box-label">CORE STATUS</span>
            <span class="omega-box-val" id="omegaCoreStatus" style="color: var(--color-danger)">OFFLINE</span>
          </div>

          <div class="omega-status-box">
            <span class="omega-box-label">RECOVERY PROTOCOL</span>
            <span class="omega-box-val" style="color: var(--color-primary)">ACTIVE</span>
          </div>

          <div class="omega-status-box">
            <span class="omega-box-label">ACCESS KEYS</span>
            <span class="omega-box-val" style="color: var(--color-success)">VERIFIED</span>
          </div>
        </div>
      </div>

      <!-- Access Key Confirmation Cards -->
      <div class="omega-keys-container">
        <div class="omega-key-chip">
          <span class="omega-key-icon">✓</span>
          <div class="omega-key-details">
            <span class="omega-key-title">ACCESS KEY 01 VERIFIED</span>
            <span class="omega-key-code">${keys.key1.code}</span>
          </div>
        </div>

        <div class="omega-key-chip">
          <span class="omega-key-icon">✓</span>
          <div class="omega-key-details">
            <span class="omega-key-title">ACCESS KEY 02 VERIFIED</span>
            <span class="omega-key-code">${keys.key2.code}</span>
          </div>
        </div>

        <div class="omega-key-chip">
          <span class="omega-key-icon">✓</span>
          <div class="omega-key-details">
            <span class="omega-key-title">ACCESS KEY 03 VERIFIED</span>
            <span class="omega-key-code">${keys.key3.code}</span>
          </div>
        </div>
      </div>

      <!-- Main Action Area: Master Authorization -->
      <div class="omega-action-card">
        <h2 class="omega-action-title">MASTER AUTHORIZATION</h2>
        <p class="omega-action-text">
          Final authentication required. Enter the Master Code to restore the Game Elysium Core.
        </p>

        <form id="omegaRestoreForm" style="width: 100%">
          <input 
            type="text" 
            id="masterCodeInput" 
            class="omega-input-field" 
            placeholder="Enter Master Code..." 
            autocomplete="off"
            required
          />

          <button type="submit" class="btn-omega-restore" id="btnRestoreSystem">
            <span>⚡ RESTORE SYSTEM ⚡</span>
          </button>
        </form>

        <div id="omegaErrorMsg" style="margin-top: 1rem; color: var(--color-danger); font-family: var(--font-mono); font-size: 0.9rem; display: none">
          ⚠ ACCESS DENIED: Master Authorization Failed. Core remains offline.
        </div>
      </div>
    </div>
  `;

  // Handle Master Authorization Code Form Submission
  const form = container.querySelector('#omegaRestoreForm');
  const input = container.querySelector('#masterCodeInput');
  const errorMsg = container.querySelector('#omegaErrorMsg');
  const btn = container.querySelector('#btnRestoreSystem');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim().toUpperCase();

    // Valid Master Codes: ELYSIUM-CORE-RESTORED, CORE-RESTORED, ELYSIUM, or ELYSIUM-ALPHA-7701
    const isValid = val === 'ELYSIUM-CORE-RESTORED' || val === 'CORE-RESTORED' || val === 'ELYSIUM' || val === keys.key1.code || val === keys.key2.code || val === keys.key3.code;

    if (isValid) {
      errorMsg.style.display = 'none';
      input.classList.remove('error');
      btn.innerText = 'AUTHENTICATING...';
      btn.disabled = true;
      audio.playClick();

      // Play Cinematic Restoration Sequence
      playCinematicSequence(() => {
        // Show Success Popup Modal
        showSuccessModal(() => {
          gameState.completeFinalMission(); // Routes to VICTORY screen!
        });
      });
    } else {
      audio.playAccessDenied();
      input.classList.add('error');
      errorMsg.style.display = 'block';

      setTimeout(() => {
        input.classList.remove('error');
      }, 1000);
    }
  });
}

function playCinematicSequence(onComplete) {
  const overlay = document.createElement('div');
  overlay.className = 'cinematic-overlay';
  overlay.innerHTML = `
    <div class="cinematic-terminal">
      <div style="font-family: var(--font-header); font-size: 1.1rem; color: var(--color-primary); margin-bottom: 0.5rem">
        ⚙️ ELYSIUM CORE RECOVERY SEQUENCER
      </div>
      <div id="line1" class="cinematic-line">⚡ AUTHENTICATING MASTER CODE...</div>
      <div id="line2" class="cinematic-line">🔒 VERIFYING SECURITY CREDENTIALS...</div>
      <div id="line3" class="cinematic-line">🛠️ RESTORING CORE MODULES...</div>
      <div id="line4" class="cinematic-line">🌐 INITIALIZING SYSTEM SERVICES...</div>
      <div id="line5" class="cinematic-line success" style="font-weight: 700; font-size: 1.1rem">✓ RECOVERY SUCCESSFUL</div>
    </div>
  `;
  document.body.appendChild(overlay);

  const l1 = overlay.querySelector('#line1');
  const l2 = overlay.querySelector('#line2');
  const l3 = overlay.querySelector('#line3');
  const l4 = overlay.querySelector('#line4');
  const l5 = overlay.querySelector('#line5');

  setTimeout(() => { l1.style.opacity = '1'; audio.playClick(); }, 300);
  setTimeout(() => { l2.style.opacity = '1'; audio.playClick(); }, 900);
  setTimeout(() => { l3.style.opacity = '1'; audio.playGlitch(); }, 1500);
  setTimeout(() => { l4.style.opacity = '1'; audio.playClick(); }, 2100);
  setTimeout(() => { l5.style.opacity = '1'; audio.playAccessGranted(); }, 2700);

  setTimeout(() => {
    overlay.remove();
    if (onComplete) onComplete();
  }, 3400);
}

function showSuccessModal(onViewResults) {
  const modal = document.createElement('div');
  modal.className = 'success-modal-overlay';
  modal.innerHTML = `
    <div class="success-modal-card">
      <div class="success-icon">🏆</div>
      <h2 style="font-family: var(--font-header); font-size: 2rem; color: var(--color-success); letter-spacing: 3px">
        SYSTEM RESTORED
      </h2>
      <p style="font-size: 1rem; color: var(--color-text); line-height: 1.6">
        Congratulations Digital Recovery Unit.<br>
        You have successfully restored the Game Elysium Core.<br>
        All security layers have been recovered.<br>
        <strong>Mission Complete.</strong>
      </p>
      <div style="display: flex; flex-direction: column; gap: 0.8rem; width: 100%; margin-top: 1rem">
        <button class="btn-omega-restore" id="btnViewResults" style="width: 100%; max-width: 100%; padding: 1rem">
          <span>CONTINUE TO VICTORY LEADERBOARD ➔</span>
        </button>
        <button class="hud-btn" id="btnReturnDashFinal" style="width: 100%; justify-content: center; padding: 0.7rem 1.4rem">
          RETURN TO DASHBOARD
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#btnViewResults').addEventListener('click', () => {
    audio.playClick();
    modal.remove();
    if (onViewResults) onViewResults();
  });

  modal.querySelector('#btnReturnDashFinal').addEventListener('click', () => {
    audio.playClick();
    modal.remove();
    gameState.setView('DASHBOARD');
  });
}
