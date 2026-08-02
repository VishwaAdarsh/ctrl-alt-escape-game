/* ==========================================================================
   CTRL + ALT + ESCAPE | Welcome / Registration Screen
   ========================================================================== */

import { gameState } from '../state.js';
import { audio } from '../audio.js';

export function renderWelcomeScreen(container) {
  const state = gameState.get();

  container.innerHTML = `
    <div class="glass-panel welcome-card">
      <div>
        <div style="font-family: var(--font-mono); color: var(--color-cyan); font-size: 0.85rem; letter-spacing: 3px; margin-bottom: 0.5rem">
          TECHBIT 7.0 FLAGSHIP EVENT
        </div>
        <h1 class="welcome-title">CTRL + ALT + ESCAPE</h1>
        <p class="welcome-subtitle">GAME ELYSIUM DIGITAL RECOVERY CONSOLE</p>
      </div>

      <div class="terminal-window" style="text-align: left">
        <div class="terminal-line warning">[ALERT] CATASTROPHIC SYSTEM BREACH DETECTED</div>
        <div class="terminal-line">[SYSTEM] Core security modules offline. Corrupted data in sectors 1, 2 & 3.</div>
        <div class="terminal-line">[PROTOCOL] Emergency Recovery Protocol active. DRU authorization required.</div>
      </div>

      <form id="registrationForm" class="cyber-input-group">
        <label class="cyber-label" for="teamNameInput">ENTER DIGITAL RECOVERY UNIT (DRU) NAME:</label>
        <input 
          type="text" 
          id="teamNameInput" 
          class="cyber-input" 
          placeholder="e.g. CYBER-PIONEERS-07" 
          value="${state.teamName || ''}"
          required
        />
        <button type="submit" class="btn-cyber-primary" style="margin-top: 1rem">
          INITIALIZE MISSION CONSOLE ➔
        </button>
      </form>
    </div>
  `;

  const form = container.querySelector('#registrationForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    audio.playClick();
    const input = container.querySelector('#teamNameInput').value;
    gameState.setTeamName(input);
    gameState.setView('BRIEFING');
  });
}
