/* ==========================================================================
   CTRL + ALT + ESCAPE | Targeted Header HUD Component
   Does NOT rebuild DOM on every timer tick to prevent screen flickering.
   ========================================================================== */

import { gameState } from '../state.js';
import { audio } from '../audio.js';

export function renderHeader(container) {
  const state = gameState.get();

  const mins = Math.floor(state.timerSeconds / 60).toString().padStart(2, '0');
  const secs = (state.timerSeconds % 60).toString().padStart(2, '0');
  const isCritical = state.timerSeconds <= 300 && state.timerRunning;

  // Determine Mission Badge text
  let missionBadgeLabel = 'MISSION CONSOLE';
  if (state.view === 'MISSION_1') missionBadgeLabel = 'MISSION 01';
  else if (state.view === 'MISSION_2') missionBadgeLabel = 'MISSION 02';
  else if (state.view === 'MISSION_3') missionBadgeLabel = 'MISSION 03';
  else if (state.view === 'FINAL_MISSION') missionBadgeLabel = 'FINAL STAGE';
  else if (state.view === 'VICTORY') missionBadgeLabel = 'SYSTEM RESTORED';
  else if (state.view === 'FAILURE') missionBadgeLabel = 'SYSTEM SHUTDOWN';
  else if (state.view === 'DASHBOARD') missionBadgeLabel = 'MISSION DASHBOARD';

  const showNavDashboard = state.view !== 'DASHBOARD';
  const showTerminate = state.timerStarted && state.view !== 'VICTORY' && state.view !== 'FAILURE';

  // 1. FAST TARGETED UPDATE if header is already in DOM
  const clockEl = container.querySelector('.hud-timer-clock');
  const badgeEl = container.querySelector('.hud-mission-badge');
  const statusEl = container.querySelector('.hud-chip-value');
  const navDashBtn = container.querySelector('#btnNavDashboard');
  const navDashDiv = container.querySelector('#navDashDivider');
  const terminateBtn = container.querySelector('#btnTerminateMission');

  if (clockEl && badgeEl && statusEl) {
    clockEl.innerText = `${mins}:${secs}`;
    clockEl.classList.toggle('critical', isCritical);
    badgeEl.innerText = missionBadgeLabel;
    statusEl.innerText = state.view === 'VICTORY' ? 'RESTORED' : 'ONLINE';
    if (navDashBtn) navDashBtn.style.display = showNavDashboard ? 'inline-flex' : 'none';
    if (navDashDiv) navDashDiv.style.display = showNavDashboard ? 'block' : 'none';
    if (terminateBtn) terminateBtn.style.display = showTerminate ? 'inline-flex' : 'none';
    return;
  }

  // 2. INITIAL FULL DOM MOUNT (Only done once)
  container.innerHTML = `
    <!-- Top Left Brand & Navigation -->
    <div class="hud-brand-group">
      <div class="hud-title-brand">
        <span>GAME ELYSIUM</span>
      </div>
      <div class="hud-divider"></div>
      <span class="hud-subtitle-tag">MISSION CONSOLE</span>
      <div class="hud-divider" id="navDashDivider" style="display: ${showNavDashboard ? 'block' : 'none'}"></div>
      <button class="hud-btn" id="btnNavDashboard" style="display: ${showNavDashboard ? 'inline-flex' : 'none'}; gap: 0.4rem; padding: 0.4rem 0.9rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-primary); border-color: rgba(0, 229, 255, 0.4); text-transform: uppercase;">
        ← MISSION DASHBOARD
      </button>
    </div>

    <!-- Top Center Mission Badge -->
    <div style="display: flex; justify-content: center">
      <div class="hud-mission-badge">
        ${missionBadgeLabel}
      </div>
    </div>

    <!-- Top Right System Status, Timer & Controls -->
    <div class="hud-right-group">
      <div class="hud-status-chip">
        <span class="hud-chip-label">SYSTEM STATUS</span>
        <span class="hud-chip-value">
          ${state.view === 'VICTORY' ? 'RESTORED' : 'ONLINE'}
        </span>
      </div>

      <div class="hud-timer-container">
        <span class="hud-timer-title">TIME REMAINING</span>
        <span class="hud-timer-clock ${isCritical ? 'critical' : ''}">${mins}:${secs}</span>
      </div>

      <button class="hud-btn" id="btnTerminateMission" style="display: ${showTerminate ? 'inline-flex' : 'none'}; color: var(--color-danger); border-color: rgba(255, 77, 109, 0.4); font-family: var(--font-mono); font-size: 0.75rem; padding: 0.4rem 0.8rem; text-transform: uppercase;" title="Terminate Active Mission Run">
        🛑 TERMINATE
      </button>

      <button class="hud-btn" id="btnAudioMute" title="Toggle Sound Effects">
        ${audio.isMuted() ? '🔇' : '🔊'}
      </button>

      <button class="hud-btn" id="btnAdmin" title="Organizer Admin (Ctrl+Alt+Shift+E)">
        ⚙️
      </button>
    </div>
  `;

  // Attach Event Handlers (Only attached once on mount)
  container.querySelector('#btnNavDashboard')?.addEventListener('click', () => {
    audio.playClick();
    gameState.setView('DASHBOARD');
  });

  container.querySelector('#btnTerminateMission')?.addEventListener('click', () => {
    audio.playClick();
    showTerminateConfirmationModal();
  });

  container.querySelector('#btnAudioMute')?.addEventListener('click', () => {
    const isMuted = audio.toggleMute();
    const btn = container.querySelector('#btnAudioMute');
    if (btn) btn.innerHTML = isMuted ? '🔇' : '🔊';
  });

  container.querySelector('#btnAdmin')?.addEventListener('click', () => {
    audio.playClick();
    const adminModal = document.getElementById('adminModal');
    if (adminModal) {
      adminModal.classList.remove('hidden');
      renderAdminModal(adminModal);
    }
  });
}

function showTerminateConfirmationModal() {
  const modal = document.getElementById('notificationModal');
  const content = document.getElementById('modalContent');
  if (!modal || !content) return;

  content.className = 'modal-card denied';
  content.innerHTML = `
    <h3 class="modal-title" style="color: var(--color-danger)">TERMINATE MISSION</h3>
    <p style="white-space: pre-line; font-size: 0.95rem; color: var(--color-text); margin-bottom: 1.2rem">
      Are you sure you want to terminate the current mission?
      Current progress will be lost.
    </p>

    <div style="display: flex; gap: 0.8rem; justify-content: center; width: 100%">
      <button class="hud-btn" id="btnModalCancelTerminate" style="flex: 1; justify-content: center; padding: 0.7rem 1rem">
        CANCEL
      </button>
      <button class="btn-verify" id="btnModalConfirmTerminate" style="flex: 1; justify-content: center; padding: 0.7rem 1rem; background: linear-gradient(135deg, var(--color-danger), #ff1744); border-color: var(--color-danger); box-shadow: 0 0 15px var(--color-danger-glow);">
        TERMINATE
      </button>
    </div>
  `;

  modal.classList.remove('hidden');

  content.querySelector('#btnModalCancelTerminate').addEventListener('click', () => {
    audio.playClick();
    modal.classList.add('hidden');
  });

  content.querySelector('#btnModalConfirmTerminate').addEventListener('click', () => {
    audio.playClick();
    modal.classList.add('hidden');
    gameState.resetAll();
    gameState.setView('DASHBOARD');
  });
}
