/* ==========================================================================
   CTRL + ALT + ESCAPE | Victory Screen (System Restored & Final Cinematic)
   Sprint 5.3 - System Restoration & Victory Sequence
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
    <div class="glass-panel" style="max-width: 820px; margin: 2rem auto; text-align: center; border-color: var(--color-success); box-shadow: 0 0 60px rgba(0, 255, 138, 0.25);">
      
      <!-- 🏆 Golden Achievement Badge -->
      <div class="victory-golden-badge">
        <div class="victory-golden-icon">🏆</div>
        <div class="victory-golden-title">MISSION ACCOMPLISHED</div>
        <div class="victory-golden-sub">CTRL + ALT + ESCAPE COMPLETED</div>
      </div>

      <!-- 3-Stage Status Transition Reveal -->
      <div class="victory-reveal-container">
        <span class="victory-reveal-step step-critical">CRITICAL</span>
        <span class="victory-arrow">➔</span>
        <span class="victory-reveal-step step-recovering" id="stepRecovering">RECOVERING</span>
        <span class="victory-arrow">➔</span>
        <span class="victory-reveal-step step-stable" id="stepStable">STABLE</span>
        <span class="victory-arrow">➔</span>
        <span class="victory-reveal-step step-online" id="stepOnline">✓ ONLINE</span>
      </div>

      <!-- Main Title Block -->
      <div style="font-family: var(--font-mono); color: var(--color-success); font-size: 0.85rem; letter-spacing: 3px; margin-bottom: 0.4rem; text-transform: uppercase;">
        [SYSTEM STATUS: ONLINE]
      </div>

      <h1 style="font-family: var(--font-header); font-size: 2.5rem; color: var(--color-success); text-shadow: 0 0 25px rgba(0, 255, 138, 0.5); margin-bottom: 0.8rem; text-transform: uppercase;">
        SYSTEM RESTORED
      </h1>

      <div style="font-family: var(--font-header); font-size: 1.15rem; color: #fff; letter-spacing: 2px; margin-bottom: 1.8rem; text-transform: uppercase;">
        GAME ELYSIUM HAS BEEN RECOVERED
      </div>

      <!-- Mission Report Breakdown -->
      <div class="victory-report-card">
        <div class="victory-report-header">
          <span>📜 MISSION REPORT</span>
        </div>

        <div class="victory-report-grid">
          <div class="victory-report-item">
            <span>Mission 01 (Binary Breaker)</span>
            <span class="status-tag">✓ COMPLETE</span>
          </div>
          <div class="victory-report-item">
            <span>Mission 02 (QR Quest)</span>
            <span class="status-tag">✓ COMPLETE</span>
          </div>
          <div class="victory-report-item">
            <span>Mission 03 (The Glitch)</span>
            <span class="status-tag">✓ COMPLETE</span>
          </div>
          <div class="victory-report-item">
            <span>Omega Protocol</span>
            <span class="status-tag">✓ COMPLETE</span>
          </div>
        </div>
      </div>

      <!-- Team Performance Statistics Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 1.8rem">
        <div style="background: rgba(4, 8, 18, 0.85); border: 1px solid var(--color-primary); padding: 1rem; border-radius: var(--radius-md)">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-muted)">RAW ELAPSED TIME</div>
          <div style="font-family: var(--font-header); font-size: 1.5rem; color: var(--color-primary); margin-top: 0.3rem">
            ${elapsedMins}:${elapsedSecs}
          </div>
        </div>

        <div style="background: rgba(4, 8, 18, 0.85); border: 1px solid var(--color-warning); padding: 1rem; border-radius: var(--radius-md)">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-muted)">PENALTY TIME</div>
          <div style="font-family: var(--font-header); font-size: 1.5rem; color: var(--color-warning); margin-top: 0.3rem">
            +${Math.floor(state.penaltySeconds / 60)}m ${state.penaltySeconds % 60}s
          </div>
        </div>

        <div style="background: rgba(4, 8, 18, 0.85); border: 1px solid var(--color-success); padding: 1rem; border-radius: var(--radius-md)">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-muted)">OFFICIAL MISSION TIME</div>
          <div style="font-family: var(--font-header); font-size: 1.5rem; color: var(--color-success); margin-top: 0.3rem">
            ${totalMins}:${totalSecs}
          </div>
        </div>

        <div style="background: rgba(4, 8, 18, 0.85); border: 1px solid #ffd700; padding: 1rem; border-radius: var(--radius-md)">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-muted)">PERFORMANCE GRADE</div>
          <div style="font-family: var(--font-header); font-size: 1.5rem; color: #ffd700; margin-top: 0.3rem">
            ${grade}
          </div>
        </div>
      </div>

      <!-- Final Message Block -->
      <div style="background: rgba(0, 255, 138, 0.05); border: 1px solid rgba(0, 255, 138, 0.2); border-radius: var(--radius-md); padding: 1.2rem; margin-bottom: 2rem; text-align: center;">
        <p style="font-size: 1.05rem; color: var(--color-text); line-height: 1.7; margin-bottom: 0.5rem;">
          Congratulations Digital Recovery Unit <strong style="color: var(--color-primary); font-family: var(--font-mono);">${state.teamName}</strong>!
        </p>
        <p style="font-size: 0.95rem; color: var(--color-muted); line-height: 1.6; margin-bottom: 0.8rem;">
          You successfully restored the Game Elysium Operating System. All corrupted security layers have been purged.
        </p>
        <div style="font-family: var(--font-mono); font-size: 0.9rem; font-weight: 700; color: var(--color-success); letter-spacing: 2px;">
          MISSION STATUS: SUCCESS
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-muted); margin-top: 0.4rem;">
          Thank you for participating in CTRL + ALT + ESCAPE
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center">
        <button class="btn-omega-begin-restoration" id="btnViewLeaderboard" style="max-width: 320px; margin-top: 0;">
          <span>🏆 VIEW LEADERBOARD</span>
        </button>

        <button class="hud-btn" id="btnFinishEvent" style="padding: 1.1rem 2rem; font-family: var(--font-header); font-size: 1rem; font-weight: 700; border-radius: var(--radius-md); background: rgba(10, 20, 35, 0.8); border: 1px solid var(--color-primary); color: var(--color-primary); cursor: pointer;">
          <span>🏁 FINISH EVENT / RESTART</span>
        </button>
      </div>

    </div>
  `;

  // Attach button event listeners
  const btnLeaderboard = container.querySelector('#btnViewLeaderboard');
  if (btnLeaderboard) {
    btnLeaderboard.addEventListener('click', () => {
      audio.playClick();
      gameState.setView('LEADERBOARD');
    });
  }

  const btnFinish = container.querySelector('#btnFinishEvent');
  if (btnFinish) {
    btnFinish.addEventListener('click', () => {
      audio.playClick();
      gameState.resetAll();
      gameState.setView('DASHBOARD');
    });
  }

  // 3-Stage Reveal Animation Sequence
  const stepRec = container.querySelector('#stepRecovering');
  const stepStab = container.querySelector('#stepStable');
  const stepOnl = container.querySelector('#stepOnline');

  if (stepRec && stepStab && stepOnl) {
    setTimeout(() => {
      stepRec.style.transform = 'scale(1.1)';
      setTimeout(() => { stepRec.style.transform = 'scale(1)'; }, 300);
    }, 400);

    setTimeout(() => {
      stepStab.style.transform = 'scale(1.1)';
      setTimeout(() => { stepStab.style.transform = 'scale(1)'; }, 300);
    }, 900);

    setTimeout(() => {
      stepOnl.style.transform = 'scale(1.15)';
      setTimeout(() => { stepOnl.style.transform = 'scale(1)'; }, 300);
    }, 1400);
  }

  function showLeaderboardNotice() {
    const modal = document.getElementById('notificationModal');
    const content = document.getElementById('modalContent');
    if (!modal || !content) return;

    content.className = 'modal-card granted';
    content.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.75rem; color: #ffd700; letter-spacing: 2px; margin-bottom: 0.3rem">
        [LEADERBOARD READY]
      </div>
      <h3 class="modal-title" style="color: #ffd700; margin-bottom: 0.4rem">
        🏆 DRU LEADERBOARD
      </h3>
      <div style="background: rgba(5, 10, 20, 0.85); border: 1px solid #ffd700; border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.2rem; font-family: var(--font-mono); font-size: 0.9rem; text-align: left; line-height: 1.8;">
        <div>🥇 Rank #1: Team ${state.teamName} — ${totalMins}m ${totalSecs}s (${grade})</div>
        <div style="color: var(--color-muted);">🥈 Rank #2: DRU-CYBER-88 — 18m 42s (A)</div>
        <div style="color: var(--color-muted);">🥉 Rank #3: DRU-ALPHA-01 — 21m 15s (B)</div>
      </div>
      <button class="btn-verify" id="btnCloseLeaderboard" style="width: 100%; padding: 0.8rem 1.4rem">
        RETURN TO VICTORY SCREEN
      </button>
    `;

    modal.classList.remove('hidden');

    content.querySelector('#btnCloseLeaderboard').addEventListener('click', () => {
      audio.playClick();
      modal.classList.add('hidden');
    });
  }
}

