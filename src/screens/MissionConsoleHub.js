/* ==========================================================================
   CTRL + ALT + ESCAPE | Mission Console Hub Screen
   ========================================================================== */

import { gameState } from '../state.js';
import { audio } from '../audio.js';
import { renderProgressTracker } from '../components/ProgressTracker.js';

export function renderMissionConsoleHub(container) {
  const state = gameState.get();
  const m = state.missions;
  const keys = state.accessKeys;

  container.innerHTML = `
    ${renderProgressTracker()}

    <div class="glass-panel">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0, 243, 255, 0.2); padding-bottom: 1rem">
        <div>
          <h2 style="font-family: var(--font-header); color: var(--color-cyan); font-size: 1.5rem">
            MISSION CONTROL CENTER
          </h2>
          <p style="font-size: 0.85rem; color: var(--color-text-dim)">
            Select an unlocked mission card to investigate and recover security Access Keys.
          </p>
        </div>
      </div>

      <div class="mission-grid">
        <!-- Mission 1 Card -->
        <div class="mission-card ${m.mission1.status.toLowerCase()}" id="cardM1">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem">
              <span class="mission-card-badge">${m.mission1.status}</span>
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-dim)">MISSION 01</span>
            </div>
            <h3 class="mission-card-title">BINARY BREAKER</h3>
            <p class="mission-card-desc">Intercept telemetry data stream, decode bitwise frequency and hex bytes to extract Access Key #1.</p>
          </div>
          <div>
            <button class="hud-btn" style="width: 100%; justify-content: center" id="btnLaunchM1">
              ${keys.key1.recovered ? 'REVIEW MISSION ✓' : 'LAUNCH MISSION 01 ➔'}
            </button>
          </div>
        </div>

        <!-- Mission 2 Card -->
        <div class="mission-card ${m.mission2.status.toLowerCase()}" id="cardM2">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem">
              <span class="mission-card-badge">${m.mission2.status}</span>
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-dim)">MISSION 02</span>
            </div>
            <h3 class="mission-card-title">QR QUEST</h3>
            <p class="mission-card-desc">Scan mobile QR payload or demodulate signal downlink frequency to recover Access Key #2.</p>
          </div>
          <div>
            <button class="hud-btn" style="width: 100%; justify-content: center" id="btnLaunchM2" ${m.mission2.status === 'LOCKED' ? 'disabled' : ''}>
              ${m.mission2.status === 'LOCKED' ? '🔒 REQUIRES KEY #1' : keys.key2.recovered ? 'REVIEW MISSION ✓' : 'LAUNCH MISSION 02 ➔'}
            </button>
          </div>
        </div>

        <!-- Mission 3 Card -->
        <div class="mission-card ${m.mission3.status.toLowerCase()}" id="cardM3">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem">
              <span class="mission-card-badge">${m.mission3.status}</span>
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-dim)">MISSION 03</span>
            </div>
            <h3 class="mission-card-title">THE GLITCH</h3>
            <p class="mission-card-desc">Inspect corrupted system memory blocks, purge anomaly payloads, and reconstruct Access Key #3.</p>
          </div>
          <div>
            <button class="hud-btn" style="width: 100%; justify-content: center" id="btnLaunchM3" ${m.mission3.status === 'LOCKED' ? 'disabled' : ''}>
              ${m.mission3.status === 'LOCKED' ? '🔒 REQUIRES KEY #2' : keys.key3.recovered ? 'REVIEW MISSION ✓' : 'LAUNCH MISSION 03 ➔'}
            </button>
          </div>
        </div>

        <!-- Final Mission Card -->
        <div class="mission-card ${m.finalMission.status.toLowerCase()}" id="cardFM" style="border-color: var(--color-emerald)">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem">
              <span class="mission-card-badge">${m.finalMission.status}</span>
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-dim)">FINAL STAGE</span>
            </div>
            <h3 class="mission-card-title" style="color: var(--color-emerald)">SYSTEM RECOVERY</h3>
            <p class="mission-card-desc">Synchronize core phase nodes and trigger ignition sequence to permanently restore Game Elysium.</p>
          </div>
          <div>
            <button class="btn-cyber-primary" style="width: 100%; justify-content: center; font-size: 0.9rem" id="btnLaunchFM" ${m.finalMission.status === 'LOCKED' ? 'disabled' : ''}>
              ${m.finalMission.status === 'LOCKED' ? '🔒 REQUIRES ALL 3 KEYS' : 'INITIATE CORE RECOVERY ⚡'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Launch Clickers
  container.querySelector('#btnLaunchM1').addEventListener('click', () => {
    audio.playClick();
    gameState.setView('MISSION_1');
  });

  container.querySelector('#btnLaunchM2').addEventListener('click', () => {
    if (m.mission2.status !== 'LOCKED') {
      audio.playClick();
      gameState.setView('MISSION_2');
    }
  });

  container.querySelector('#btnLaunchM3').addEventListener('click', () => {
    if (m.mission3.status !== 'LOCKED') {
      audio.playClick();
      gameState.setView('MISSION_3');
    }
  });

  container.querySelector('#btnLaunchFM').addEventListener('click', () => {
    if (m.finalMission.status !== 'LOCKED') {
      audio.playClick();
      gameState.setView('FINAL_MISSION');
    }
  });
}
