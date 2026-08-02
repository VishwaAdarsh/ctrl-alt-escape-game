/* ==========================================================================
   CTRL + ALT + ESCAPE | Failure Screen (Mission Failed)
   ========================================================================== */

import { gameState } from '../state.js';
import { audio } from '../audio.js';

export function renderFailureScreen(container) {
  container.innerHTML = `
    <div class="glass-panel" style="max-width: 700px; margin: 3rem auto; text-align: center; border-color: var(--color-magenta); box-shadow: 0 0 50px var(--color-magenta-glow); animation: shake 0.5s">
      <div style="font-family: var(--font-mono); color: var(--color-magenta); font-size: 0.9rem; letter-spacing: 3px; margin-bottom: 0.5rem">
        EMERGENCY PROTOCOL EXPIRED
      </div>

      <h1 style="font-family: var(--font-header); font-size: 2.8rem; color: var(--color-magenta); text-shadow: 0 0 25px var(--color-magenta); margin-bottom: 1rem">
        MISSION FAILED
      </h1>

      <div class="terminal-window" style="margin-bottom: 2rem">
        <div class="terminal-line error">SYSTEM SHUTDOWN COMPLETE</div>
        <div class="terminal-line error">GAME ELYSIUM LOST</div>
        <div class="terminal-line">[LOG] Countdown timer reached 00:00 before core synchronization.</div>
      </div>

      <button class="btn-cyber-primary" id="btnRetryMission" style="background: linear-gradient(135deg, var(--color-magenta), #e11d48); color: white">
        🔄 REINITIALIZE DRU RECOVERY PROTOCOL
      </button>
    </div>
  `;

  container.querySelector('#btnRetryMission').addEventListener('click', () => {
    audio.playClick();
    gameState.resetAll();
    gameState.setView('DASHBOARD');
  });
}
