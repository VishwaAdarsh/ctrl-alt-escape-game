/* ==========================================================================
   CTRL + ALT + ESCAPE | Layout A: Mission Dashboard (Preparation & Hub)
   ========================================================================== */

import { gameState } from '../state.js';
import { audio } from '../audio.js';

export function renderMissionDashboard(container) {
  const state = gameState.get();
  const m = state.missions;
  const keys = state.accessKeys;

  const m1Completed = keys.key1.recovered;
  const m2Completed = keys.key2.recovered;
  const m3Completed = keys.key3.recovered;
  const omegaCompleted = m.finalMission.status === 'COMPLETED';

  const m1Ready = true;
  const m2Ready = m1Completed;
  const m3Ready = m1Completed && m2Completed;
  const omegaReady = m1Completed && m2Completed && m3Completed;

  // Determine active stage
  const isM1Active = state.timerStarted && !m1Completed;
  const isM2Active = state.timerStarted && m1Completed && !m2Completed;
  const isM3Active = state.timerStarted && m1Completed && m2Completed && !m3Completed;
  const isOmegaActive = state.timerStarted && omegaReady && !omegaCompleted;

  container.innerHTML = `
    <div class="dashboard-container">
      <!-- Emergency Alert Card -->
      <div class="glass-card emergency-alert-card">
        <div class="alert-header">
          <span style="font-size: 1.3rem">🚨</span>
          <span>EMERGENCY ALERT // ELYSIUM CORE BREACH</span>
        </div>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--color-text)">
          The central operating system powering Game Elysium has suffered a catastrophic security failure. 
          Multiple security sectors have been locked. Emergency Recovery Protocols require a certified 
          Digital Recovery Unit (DRU) to initialize mission sequence and recover core access credentials.
        </p>
      </div>

      <!-- Two Column Grid -->
      <div class="dash-grid-two">
        <!-- Story Briefing Card -->
        <div class="glass-card">
          <div class="card-title-bar">
            <span>📜</span>
            <span>STORY BRIEFING</span>
          </div>
          <p style="font-size: 0.9rem; color: var(--color-muted); line-height: 1.6; margin-bottom: 1rem">
            As members of the Digital Recovery Unit, your objective is to navigate 3 sequential mission sectors, 
            solve encrypted technology challenges, recover 3 hidden Access Keys, and execute the Final Core Recovery 
            before complete system blackout.
          </p>

          <div style="background: rgba(5, 7, 13, 0.6); padding: 0.8rem; border-radius: var(--radius-sm); border: 1px solid rgba(0, 229, 255, 0.15)">
            <label style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-primary); display: block; margin-bottom: 0.4rem">
              REGISTER DRU TEAM CALLSIGN:
            </label>
            <input 
              type="text" 
              id="dashTeamInput" 
              class="cyber-input" 
              style="font-size: 1rem; padding: 0.6rem 1rem; margin-bottom: 0; text-align: left"
              value="${state.teamName}" 
              placeholder="e.g. DRU-ALPHA-07"
            />
          </div>
        </div>

        <!-- Mission Overview Card -->
        <div class="glass-card">
          <div class="card-title-bar">
            <span>📊</span>
            <span>EVENT INFORMATION</span>
          </div>
          <div class="dash-info-list">
            <div class="dash-info-item">
              <span class="dash-info-label">EVENT TITLE</span>
              <span class="dash-info-val" style="color: var(--color-primary)">TECHBIT 7.0 - GAME ELYSIUM</span>
            </div>
            <div class="dash-info-item">
              <span class="dash-info-label">ESTIMATED DURATION</span>
              <span class="dash-info-val">25 MINUTES</span>
            </div>
            <div class="dash-info-item">
              <span class="dash-info-label">TEAM CAPACITY</span>
              <span class="dash-info-val">2 - 4 MEMBERS</span>
            </div>
            <div class="dash-info-item">
              <span class="dash-info-label">AVAILABLE HINTS</span>
              <span class="dash-info-val" style="color: var(--color-warning)">2 HINTS MAX (+2m PENALTY EACH)</span>
            </div>
            <div class="dash-info-item">
              <span class="dash-info-label">WRONG KEY PENALTY</span>
              <span class="dash-info-val" style="color: var(--color-danger)">+30 SECONDS PENALTY</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mission Progress Status Card -->
      <div class="glass-card">
        <div class="card-title-bar">
          <span>🎯</span>
          <span>MISSION SEQUENCING MATRIX</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem">
          <!-- Mission 01 -->
          <div style="background: rgba(5, 7, 13, 0.6); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid ${m1Completed ? 'var(--color-success)' : 'var(--color-primary)'}; display: flex; flex-direction: column; justify-content: space-between">
            <div>
              <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-muted)">MISSION 01</div>
              <div style="font-family: var(--font-header); font-size: 0.95rem; font-weight: 700; color: var(--color-text)">BINARY BREAKER</div>
              <div style="font-family: var(--font-mono); font-size: 0.75rem; color: ${m1Completed ? 'var(--color-success)' : 'var(--color-primary)'}; margin-top: 0.4rem">
                ${m1Completed ? '✅ COMPLETED' : isM1Active ? '⚡ ACTIVE' : '▶ READY'}
              </div>
            </div>
            ${state.timerStarted ? `
              <button class="hud-btn" id="btnLaunchM1" style="width: 100%; justify-content: center; margin-top: 0.8rem">
                ${m1Completed ? 'REVIEW MISSION ✓' : isM1Active ? 'CONTINUE MISSION 01 ➔' : 'LAUNCH MISSION 01 ➔'}
              </button>
            ` : ''}
          </div>

          <!-- Mission 02 -->
          <div style="background: rgba(5, 7, 13, ${m2Ready ? '0.6' : '0.4'}); padding: 1rem; border-radius: var(--radius-sm); border: 1px ${m2Ready ? 'solid' : 'dashed'} ${m2Completed ? 'var(--color-success)' : m2Ready ? 'var(--color-primary)' : 'rgba(167, 180, 194, 0.3)'}; display: flex; flex-direction: column; justify-content: space-between">
            <div>
              <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-muted)">MISSION 02</div>
              <div style="font-family: var(--font-header); font-size: 0.95rem; font-weight: 700; color: ${m2Ready ? 'var(--color-text)' : 'var(--color-muted)'}">QR QUEST</div>
              <div style="font-family: var(--font-mono); font-size: 0.75rem; color: ${m2Completed ? 'var(--color-success)' : m2Ready ? 'var(--color-primary)' : 'var(--color-muted)'}; margin-top: 0.4rem">
                ${m2Completed ? '✅ COMPLETED' : isM2Active ? '⚡ ACTIVE' : m2Ready ? '▶ READY' : '🔒 LOCKED'}
              </div>
            </div>
            ${state.timerStarted ? `
              <button class="hud-btn" id="btnLaunchM2" style="width: 100%; justify-content: center; margin-top: 0.8rem" ${!m2Ready ? 'disabled' : ''}>
                ${m2Completed ? 'REVIEW MISSION ✓' : isM2Active ? 'CONTINUE MISSION 02 ➔' : m2Ready ? 'LAUNCH MISSION 02 ➔' : '🔒 REQUIRES MISSION 01'}
              </button>
            ` : ''}
          </div>

          <!-- Mission 03 -->
          <div style="background: rgba(5, 7, 13, ${m3Ready ? '0.6' : '0.4'}); padding: 1rem; border-radius: var(--radius-sm); border: 1px ${m3Ready ? 'solid' : 'dashed'} ${m3Completed ? 'var(--color-success)' : m3Ready ? 'var(--color-primary)' : 'rgba(167, 180, 194, 0.3)'}; display: flex; flex-direction: column; justify-content: space-between">
            <div>
              <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-muted)">MISSION 03</div>
              <div style="font-family: var(--font-header); font-size: 0.95rem; font-weight: 700; color: ${m3Ready ? 'var(--color-text)' : 'var(--color-muted)'}">THE GLITCH</div>
              <div style="font-family: var(--font-mono); font-size: 0.75rem; color: ${m3Completed ? 'var(--color-success)' : m3Ready ? 'var(--color-primary)' : 'var(--color-muted)'}; margin-top: 0.4rem">
                ${m3Completed ? '✅ COMPLETED' : isM3Active ? '⚡ ACTIVE' : m3Ready ? '▶ READY' : '🔒 LOCKED'}
              </div>
            </div>
            ${state.timerStarted ? `
              <button class="hud-btn" id="btnLaunchM3" style="width: 100%; justify-content: center; margin-top: 0.8rem" ${!m3Ready ? 'disabled' : ''}>
                ${m3Completed ? 'REVIEW MISSION ✓' : isM3Active ? 'CONTINUE MISSION 03 ➔' : m3Ready ? 'LAUNCH MISSION 03 ➔' : '🔒 REQUIRES MISSION 02'}
              </button>
            ` : ''}
          </div>

          <!-- Omega Protocol -->
          <div style="background: rgba(5, 7, 13, ${omegaReady ? '0.6' : '0.4'}); padding: 1rem; border-radius: var(--radius-sm); border: 1px ${omegaReady ? 'solid' : 'dashed'} ${omegaCompleted ? 'var(--color-success)' : omegaReady ? 'var(--color-danger)' : 'rgba(167, 180, 194, 0.3)'}; display: flex; flex-direction: column; justify-content: space-between">
            <div>
              <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-muted)">FINAL STAGE</div>
              <div style="font-family: var(--font-header); font-size: 0.95rem; font-weight: 700; color: ${omegaReady ? 'var(--color-danger)' : 'var(--color-muted)'}">OMEGA PROTOCOL</div>
              <div style="font-family: var(--font-mono); font-size: 0.75rem; color: ${omegaCompleted ? 'var(--color-success)' : omegaReady ? 'var(--color-danger)' : 'var(--color-muted)'}; margin-top: 0.4rem">
                ${omegaCompleted ? '✅ COMPLETED' : isOmegaActive ? '⚡ ACTIVE' : omegaReady ? '▶ READY' : '🔒 LOCKED'}
              </div>
            </div>
            ${state.timerStarted ? `
              <button class="btn-cyber-primary" id="btnLaunchFM" style="width: 100%; justify-content: center; font-size: 0.85rem; padding: 0.6rem; margin-top: 0.8rem; ${omegaReady ? 'background: linear-gradient(135deg, var(--color-danger), #ff1744); border-color: var(--color-danger); box-shadow: 0 0 15px var(--color-danger-glow);' : ''}" ${!omegaReady ? 'disabled' : ''}>
                ${omegaCompleted ? 'REVIEW OMEGA ✓' : isOmegaActive ? 'CONTINUE OMEGA PROTOCOL ⚡' : omegaReady ? 'INITIATE OMEGA PROTOCOL ⚡' : '🔒 REQUIRES ALL 3 KEYS'}
              </button>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Bottom Action Area -->
      <div style="margin-top: 1rem">
        ${!state.timerStarted ? `
          <button class="btn-initialize-mission" id="btnInitializeMission">
            <span>⚡ INITIALIZE MISSION PROTOCOL ⚡</span>
          </button>
        ` : `
          <div style="text-align: center; font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-primary); background: rgba(0, 229, 255, 0.05); padding: 0.8rem; border-radius: var(--radius-sm); border: 1px solid rgba(0, 229, 255, 0.2)">
            ⚡ RECOVERY PROTOCOL ACTIVE // SELECT AN UNLOCKED MISSION CARD ABOVE TO PROCEED ⚡
          </div>
        `}
      </div>
    </div>
  `;

  // Team Name Input Sync
  const teamInput = container.querySelector('#dashTeamInput');
  if (teamInput) {
    teamInput.addEventListener('change', (e) => {
      gameState.setTeamName(e.target.value);
    });
  }

  // Action: INITIALIZE MISSION (Before timer starts)
  const initBtn = container.querySelector('#btnInitializeMission');
  if (initBtn) {
    initBtn.addEventListener('click', () => {
      audio.playAccessGranted();

      showBootAnimation(() => {
        if (teamInput) gameState.setTeamName(teamInput.value);
        gameState.initializeMission(); // Starts timer & launches MISSION_1!
      });
    });
  }

  // Manual Mission Launch Listeners (After timer starts)
  container.querySelector('#btnLaunchM1')?.addEventListener('click', () => {
    audio.playClick();
    gameState.setView('MISSION_1');
  });

  container.querySelector('#btnLaunchM2')?.addEventListener('click', () => {
    if (m2Ready) {
      audio.playClick();
      gameState.setView('MISSION_2');
    }
  });

  container.querySelector('#btnLaunchM3')?.addEventListener('click', () => {
    if (m3Ready) {
      audio.playClick();
      gameState.setView('MISSION_3');
    }
  });

  container.querySelector('#btnLaunchFM')?.addEventListener('click', () => {
    if (omegaReady) {
      audio.playClick();
      gameState.setView('FINAL_MISSION');
    }
  });
}

function showBootAnimation(onComplete) {
  const bootOverlay = document.createElement('div');
  bootOverlay.className = 'boot-overlay';
  bootOverlay.innerHTML = `
    <div class="boot-spinner"></div>
    <div>INITIALIZING ELYSIUM CORE RECOVERY...</div>
    <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-muted)">STARTING MISSION TIMER (20:00)</div>
  `;
  document.body.appendChild(bootOverlay);

  setTimeout(() => {
    bootOverlay.remove();
    if (onComplete) onComplete();
  }, 1200);
}
