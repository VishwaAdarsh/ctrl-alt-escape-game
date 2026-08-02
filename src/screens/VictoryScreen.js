/* ==========================================================================
   CTRL + ALT + ESCAPE | Victory Screen (System Restored)
   ========================================================================== */

import { gameState } from '../state.js';
import { audio } from '../audio.js';

export function renderVictoryScreen(container) {
  const state = gameState.get();

  const elapsedMins = Math.floor(state.elapsedSeconds / 60);
  const elapsedSecs = (state.elapsedSeconds % 60).toString().padStart(2, '0');

  const totalTimeSecs = state.elapsedSeconds + state.penaltySeconds;
  const totalMins = Math.floor(totalTimeSecs / 60);
  const totalSecs = (totalTimeSecs % 60).toString().padStart(2, '0');

  // Performance Grade
  let grade = 'A';
  if (totalTimeSecs <= 900 && state.hintsUsed === 0) grade = 'S+';
  else if (totalTimeSecs <= 1200) grade = 'A';
  else grade = 'B';

  container.innerHTML = `
    <div class="glass-panel" style="max-width: 750px; margin: 2rem auto; text-align: center; border-color: var(--color-emerald); box-shadow: 0 0 50px var(--color-emerald-glow)">
      <div style="font-family: var(--font-mono); color: var(--color-emerald); font-size: 0.9rem; letter-spacing: 3px; margin-bottom: 0.5rem">
        SYSTEM RESTORATION COMPLETE
      </div>

      <h1 style="font-family: var(--font-header); font-size: 2.5rem; color: var(--color-emerald); text-shadow: 0 0 25px var(--color-emerald); margin-bottom: 1rem">
        GAME ELYSIUM RESTORED!
      </h1>

      <p style="font-size: 1rem; color: var(--color-text-main); margin-bottom: 2rem">
        Congratulations DRU Team <strong style="color: var(--color-cyan); font-family: var(--font-mono)">${state.teamName}</strong>! 
        All 3 Access Keys were successfully verified and the core ignition protocol was completed before system collapse.
      </p>

      <!-- Stats Summary Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 2rem">
        <div style="background: rgba(6, 9, 14, 0.8); border: 1px solid var(--color-emerald); padding: 1rem; border-radius: var(--radius-md)">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-dim)">RAW ELAPSED TIME</div>
          <div style="font-family: var(--font-header); font-size: 1.5rem; color: var(--color-cyan); margin-top: 0.3rem">
            ${elapsedMins}:${elapsedSecs}
          </div>
        </div>

        <div style="background: rgba(6, 9, 14, 0.8); border: 1px solid var(--color-amber); padding: 1rem; border-radius: var(--radius-md)">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-dim)">PENALTY TIME</div>
          <div style="font-family: var(--font-header); font-size: 1.5rem; color: var(--color-amber); margin-top: 0.3rem">
            +${Math.floor(state.penaltySeconds / 60)}m ${state.penaltySeconds % 60}s
          </div>
        </div>

        <div style="background: rgba(6, 9, 14, 0.8); border: 1px solid var(--color-emerald); padding: 1rem; border-radius: var(--radius-md)">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-dim)">OFFICIAL MISSION TIME</div>
          <div style="font-family: var(--font-header); font-size: 1.5rem; color: var(--color-emerald); margin-top: 0.3rem">
            ${totalMins}:${totalSecs}
          </div>
        </div>

        <div style="background: rgba(6, 9, 14, 0.8); border: 1px solid var(--color-cyan); padding: 1rem; border-radius: var(--radius-md)">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-dim)">PERFORMANCE GRADE</div>
          <div style="font-family: var(--font-header); font-size: 1.5rem; color: var(--color-cyan); margin-top: 0.3rem">
            ${grade}
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center">
        <button class="btn-cyber-primary" id="btnRestartSession">
          PLAY AGAIN / RESTART SESSION
        </button>
      </div>
    </div>
  `;

  container.querySelector('#btnRestartSession').addEventListener('click', () => {
    audio.playClick();
    gameState.resetAll();
    gameState.setView('DASHBOARD');
  });
}
