/* ==========================================================================
   CTRL + ALT + ESCAPE | Mission Briefing Screen
   ========================================================================== */

import { gameState } from '../state.js';
import { audio } from '../audio.js';

export function renderBriefingScreen(container) {
  const state = gameState.get();

  container.innerHTML = `
    <div class="glass-panel" style="max-width: 800px; margin: 2rem auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0, 243, 255, 0.3); padding-bottom: 1rem; margin-bottom: 1.5rem">
        <h2 style="font-family: var(--font-header); color: var(--color-cyan); font-size: 1.5rem">
          MISSION BRIEFING // RECOVERY PROTOCOL
        </h2>
        <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-amber); border: 1px solid var(--color-amber); padding: 0.2rem 0.5rem; border-radius: 4px">
          CLEARANCE LEVEL: DRU AGENT
        </span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.2rem; font-size: 0.95rem; line-height: 1.6">
        <p>
          Welcome, <strong style="color: var(--color-cyan); font-family: var(--font-mono)">${state.teamName}</strong>. 
          The central operating system powering <strong>Game Elysium</strong> has suffered a catastrophic digital breach. 
          Multiple security layers are compromised, and total system blackout is imminent.
        </p>

        <div class="terminal-window">
          <div class="terminal-line warning">OBJECTIVES & OPERATION DIRECTIVES:</div>
          <div class="terminal-line">1. Complete Mission 01 (Binary Breaker) to extract Access Key #1.</div>
          <div class="terminal-line">2. Complete Mission 02 (QR Quest) to scan/decode transmission and recover Access Key #2.</div>
          <div class="terminal-line">3. Complete Mission 03 (The Glitch) to inspect corrupt nodes and recover Access Key #3.</div>
          <div class="terminal-line">4. Enter all 3 Access Keys into the Final Core Recovery Matrix to avert blackout.</div>
          <div class="terminal-line success">GLOBAL TIME LIMIT: 25 MINUTES.</div>
        </div>

        <p style="color: var(--color-text-dim); font-size: 0.85rem">
          * Notice: Every hint requested adds a +2 minute penalty to your total mission time. Incorrect Access Key submissions incur a +30 second penalty.
        </p>
      </div>

      <div style="margin-top: 2rem; display: flex; justify-content: flex-end; gap: 1rem">
        <button class="btn-cyber-primary" id="btnStartMission">
          START MISSION PROTOCOL (BEGIN TIMER) ➔
        </button>
      </div>
    </div>
  `;

  container.querySelector('#btnStartMission').addEventListener('click', () => {
    audio.playAccessGranted();
    gameState.startTimer();
    gameState.setView('HUB');
  });
}
