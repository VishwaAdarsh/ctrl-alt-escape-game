/* ==========================================================================
   CTRL + ALT + ESCAPE | Progress & Access Keys Tracker
   ========================================================================== */

import { gameState } from '../state.js';

export function renderProgressTracker() {
  const state = gameState.get();
  const progressPercent = gameState.getProgressPercentage();

  const key1 = state.accessKeys.key1;
  const key2 = state.accessKeys.key2;
  const key3 = state.accessKeys.key3;

  return `
    <div class="progress-hud glass-panel">
      <div class="progress-header">
        <span class="progress-title">GAME ELYSIUM SYSTEM RECOVERY PROGRESS</span>
        <span class="progress-value">${progressPercent}% COMPLETED</span>
      </div>

      <div class="progress-bar-track">
        <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
      </div>

      <div class="access-keys-vault">
        <div class="key-card ${key1.recovered ? 'unlocked' : ''}">
          <div class="key-icon">${key1.recovered ? '✓' : '🔒'}</div>
          <div class="key-details">
            <span class="key-name">ACCESS KEY #1 (BINARY)</span>
            <span class="key-code">${key1.recovered ? key1.code : '••••••••••••'}</span>
          </div>
        </div>

        <div class="key-card ${key2.recovered ? 'unlocked' : ''}">
          <div class="key-icon">${key2.recovered ? '✓' : '🔒'}</div>
          <div class="key-details">
            <span class="key-name">ACCESS KEY #2 (QR QUEST)</span>
            <span class="key-code">${key2.recovered ? key2.code : '••••••••••••'}</span>
          </div>
        </div>

        <div class="key-card ${key3.recovered ? 'unlocked' : ''}">
          <div class="key-icon">${key3.recovered ? '✓' : '🔒'}</div>
          <div class="key-details">
            <span class="key-name">ACCESS KEY #3 (THE GLITCH)</span>
            <span class="key-code">${key3.recovered ? key3.code : '••••••••••••'}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
