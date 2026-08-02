/* ==========================================================================
   CTRL + ALT + ESCAPE | Organizer / Admin Control Modal
   ========================================================================== */

import { gameState } from '../state.js';
import { audio } from '../audio.js';

export function renderAdminModal(container) {
  const state = gameState.get();

  container.innerHTML = `
    <div class="admin-card">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-amber); padding-bottom: 0.5rem">
        <h3 style="font-family: var(--font-header); color: var(--color-amber)">⚙️ ORGANIZER CONTROL PANEL</h3>
        <button id="btnCloseAdmin" style="background: none; border: none; color: var(--color-text-dim); font-size: 1.2rem; cursor: pointer">✕</button>
      </div>

      <p style="font-size: 0.85rem; color: var(--color-text-dim)">
        Authorized access for Game Master / Event Controllers only.
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem">
        <button class="hud-btn" id="adminAdd5">➕ Add 5 Mins</button>
        <button class="hud-btn warning" id="adminSub5">➖ Sub 5 Mins</button>
        <button class="hud-btn" id="adminToggleTimer">
          ${state.timerRunning ? '⏸️ Pause Timer' : '▶️ Resume Timer'}
        </button>
        <button class="hud-btn" id="adminUnlockAll">🔓 Unlock All Missions</button>
      </div>

      <div style="margin-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 1rem">
        <button class="hud-btn warning" id="adminReset" style="width: 100%; justify-content: center">
          ⚠️ RESET ENTIRE GAME SESSION
        </button>
      </div>
    </div>
  `;

  // Handlers
  container.querySelector('#btnCloseAdmin')?.addEventListener('click', () => {
    container.classList.add('hidden');
  });

  container.querySelector('#adminAdd5')?.addEventListener('click', () => {
    audio.playClick();
    gameState.addTime(300);
  });

  container.querySelector('#adminSub5')?.addEventListener('click', () => {
    audio.playClick();
    gameState.addTime(-300);
  });

  container.querySelector('#adminToggleTimer')?.addEventListener('click', () => {
    audio.playClick();
    if (gameState.get().timerRunning) {
      gameState.pauseTimer();
    } else {
      gameState.startTimer();
    }
    renderAdminModal(container);
  });

  container.querySelector('#adminUnlockAll')?.addEventListener('click', () => {
    audio.playClick();
    const st = gameState.get();
    st.accessKeys.key1.recovered = true;
    st.accessKeys.key2.recovered = true;
    st.accessKeys.key3.recovered = true;
    st.missions.mission1.status = 'COMPLETED';
    st.missions.mission2.status = 'COMPLETED';
    st.missions.mission3.status = 'COMPLETED';
    st.missions.finalMission.status = 'UNLOCKED';
    gameState.notify();
    container.classList.add('hidden');
  });

  container.querySelector('#adminReset')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all team progress, keys, and timer?')) {
      audio.playClick();
      gameState.resetAll();
      container.classList.add('hidden');
    }
  });
}
