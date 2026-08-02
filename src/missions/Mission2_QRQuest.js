/* ==========================================================================
   CTRL + ALT + ESCAPE | Mission 02: Signal Breach Module
   Sprint 3: Progressive Clue Engine & Mission Brief
   ========================================================================== */

import { renderMissionConsoleLayout } from '../screens/MissionConsoleLayout.js';
import { audio } from '../audio.js';

// Structured Intelligence Clue Data
export const MISSION_2_CLUES = [
  {
    id: 'intel_01',
    order: 1,
    title: 'INTELLIGENCE REPORT #1',
    description: 'Signal detected within approximately 8 metres of the Mission Console.'
  },
  {
    id: 'intel_02',
    order: 2,
    title: 'INTELLIGENCE REPORT #2',
    description: 'The beacon is positioned above desk height and is attached near an object frequently used for presentations.'
  },
  {
    id: 'intel_03',
    order: 3,
    title: 'INTELLIGENCE REPORT #3',
    description: 'The beacon carries the label SIGNAL BEACON. Only this beacon contains the active encrypted transmission.'
  }
];

export function renderMission2(container) {
  // Required State
  let revealedClues = [];
  let currentClueIndex = 0;
  let intelCompleted = false;

  renderMissionConsoleLayout(container, {
    missionNumberLabel: 'MISSION 02',
    title: 'SIGNAL BREACH',
    subtitle: 'LOCATE • SCAN • RECOVER',
    keyId: 'key2',
    objectiveText: 'Locate the hidden Signal Beacon.<br>Scan the physical QR.<br>Recover Access Key #2.<br>Return to Mission Console.',
    clueText: 'Request intelligence downlinks from HQ below to locate the physical beacon in the room.',
    renderModule: (slotContainer) => {
      const getButtonLabel = () => {
        if (currentClueIndex === 0) return 'Request Intel';
        if (currentClueIndex === 1) return 'Request More Intel';
        if (currentClueIndex === 2) return 'Final Intel';
        return 'All Intel Received';
      };

      const renderContent = () => {
        const clueCardsHtml = revealedClues.map(clue => `
          <div class="glass-card" style="border-left: 3px solid var(--color-primary); padding: 1rem 1.2rem; animation: fade-up 0.3s ease-out">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem">
              <div style="font-family: var(--font-header); font-size: 0.85rem; font-weight: 700; color: var(--color-primary); letter-spacing: 1px">
                ${clue.title}
              </div>
              <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-muted)">
                INTEL #${clue.order}
              </span>
            </div>
            <p style="font-size: 0.9rem; color: var(--color-text); line-height: 1.5; margin: 0">
              ${clue.description}
            </p>
          </div>
        `).join('');

        slotContainer.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem">
            <!-- Mission Briefing & Status Card -->
            <div class="glass-card" style="padding: 1.2rem">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; border-bottom: 1px solid rgba(0, 229, 255, 0.15); padding-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem">
                <div style="font-family: var(--font-header); font-size: 0.9rem; font-weight: 700; color: var(--color-danger); letter-spacing: 1px; display: flex; align-items: center; gap: 0.5rem">
                  <span>🚨</span>
                  <span>SIGNAL BREACH DETECTED</span>
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-warning); background: rgba(255, 170, 0, 0.1); border: 1px solid var(--color-warning); padding: 0.25rem 0.6rem; border-radius: var(--radius-sm)">
                  STATUS: SEARCHING FOR SIGNAL
                </div>
              </div>
              <p style="font-size: 0.9rem; color: var(--color-text); line-height: 1.6; margin: 0">
                An encrypted communication beacon has been activated somewhere inside the Mission Zone.<br><br>
                The beacon contains Access Key #2.<br><br>
                Your objective is to locate the beacon, scan it using your mobile device, recover the encrypted access key, and return to the Mission Console.
              </p>
            </div>

            <!-- Intel Downlink Control Card -->
            <div class="glass-card" style="padding: 1rem 1.2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.8rem">
              <div style="display: flex; align-items: center; gap: 0.6rem">
                <span>📡</span>
                <span style="font-family: var(--font-header); font-size: 0.9rem; font-weight: 700; color: var(--color-primary)">HQ INTELLIGENCE DOWNLINK</span>
              </div>
              <button class="hud-btn" id="btnRequestIntel" ${intelCompleted ? 'disabled' : ''} style="gap: 0.5rem; padding: 0.6rem 1.2rem; font-family: var(--font-mono); font-size: 0.8rem">
                <span>${getButtonLabel()}</span>
                <span>➔</span>
              </button>
            </div>

            <!-- Intel Completed Message -->
            ${intelCompleted ? `
              <div class="glass-card" style="border-color: var(--color-success); padding: 0.8rem 1.2rem; background: rgba(0, 255, 138, 0.05); text-align: center; animation: fade-up 0.3s ease-out">
                <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-success); font-weight: 700; letter-spacing: 1px">
                  ✓ ALL AVAILABLE INTELLIGENCE HAS BEEN RECEIVED.
                </span>
              </div>
            ` : ''}

            <!-- Progressive Revealed Clues Container -->
            <div id="cluesContainer" style="display: flex; flex-direction: column; gap: 1rem">
              ${clueCardsHtml}
            </div>
          </div>
        `;

        // Attach Button Handler
        const intelBtn = slotContainer.querySelector('#btnRequestIntel');
        if (intelBtn && !intelCompleted) {
          intelBtn.addEventListener('click', () => {
            audio.playClick();

            if (currentClueIndex < MISSION_2_CLUES.length) {
              revealedClues.push(MISSION_2_CLUES[currentClueIndex]);
              currentClueIndex++;

              if (currentClueIndex >= MISSION_2_CLUES.length) {
                intelCompleted = true;
              }

              renderContent();
            }
          });
        }
      };

      renderContent();
    }
  });
}

