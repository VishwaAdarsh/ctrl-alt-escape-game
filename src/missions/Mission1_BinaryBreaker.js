/* ==========================================================================
   CTRL + ALT + ESCAPE | Mission 01: Binary Breaker Module
   Sprint 2: Gameplay Engine, Hints & Attempt Counter
   ========================================================================== */

import { renderMissionConsoleLayout } from '../screens/MissionConsoleLayout.js';
import { gameState } from '../state.js';
import { audio } from '../audio.js';

// TASK 1 & PART 3: Binary Challenge Engine Structured Data with Hints
export const BINARY_CHALLENGES = [
  {
    id: 'trans_alpha',
    title: 'TRANSMISSION ALPHA',
    binary: '01000101 01001100 01011001 01010011 01001001 01010101 01001101',
    correctAnswer: 'ELYSIUM',
    difficulty: 'Easy',
    hints: [
      'Convert each 8-bit binary group into one ASCII character.',
      'The decoded word is related to gaming (ELYSIUM).'
    ]
  },
  {
    id: 'trans_beta',
    title: 'TRANSMISSION BETA',
    binary: '01000001 01001100 01010000 01001008 01000001',
    correctAnswer: 'ALPHA',
    difficulty: 'Medium',
    hints: [
      'Each binary block represents a letter.',
      'Think about the event theme (ALPHA).'
    ]
  },
  {
    id: 'trans_gamma',
    title: 'TRANSMISSION GAMMA',
    binary: '00110111 00110111 00110000 00110001',
    correctAnswer: '7701',
    difficulty: 'Medium',
    hints: [
      'Read every byte from left to right.',
      'The final numerical code is used throughout this event (7701).'
    ]
  }
];

// Player Answer Validation Helper Function
export function validateBinaryAnswer(input, expectedKey = 'ELYSIUM-ALPHA-7701') {
  if (!input) return false;

  // Clean & normalize user input (ignore leading/trailing whitespace, case-insensitive)
  const normalizedInput = input.trim().toUpperCase();
  const normalizedExpected = expectedKey.trim().toUpperCase();

  // Accept standard key format or space/hyphen variations
  const cleanInput = normalizedInput.replace(/[\s-]/g, '');
  const cleanExpected = normalizedExpected.replace(/[\s-]/g, '');

  return normalizedInput === normalizedExpected || cleanInput === cleanExpected;
}

export function renderMission1(container) {
  renderMissionConsoleLayout(container, {
    missionNumberLabel: 'MISSION 01',
    title: 'BINARY BREAKER',
    subtitle: 'INTERCEPT • DECODE • RECOVER',
    keyId: 'key1',
    objectiveText: 'Intercepted transmissions have been detected from an unknown source. Decode the binary transmissions and recover Access Key #1.',
    clueText: 'Each intercepted transmission contains one fragment of the solution. Decode all transmissions carefully before entering the Access Key. Do not reveal the answer.',

    // Dynamic Module & Hint Rendering
    renderModule: (slotContainer) => {
      const state = gameState.get();
      let usedHints = state.hintsUsed || 0;

      const transmissionCardsHtml = BINARY_CHALLENGES.map(item => `
        <div class="transmission-card" id="${item.id}">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem">
            <div class="transmission-label">${item.title}</div>
            <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--color-muted); border: 1px solid rgba(0, 229, 255, 0.2); padding: 0.1rem 0.4rem; border-radius: 4px">${item.difficulty}</span>
          </div>
          <div class="transmission-code">
            ${item.binary}
          </div>
        </div>
      `).join('');

      let hintDisplayText = '';
      if (usedHints === 1) {
        hintDisplayText = `HINT 1: ${BINARY_CHALLENGES[0].hints[0]}`;
      } else if (usedHints >= 2) {
        hintDisplayText = `HINT 2: ${BINARY_CHALLENGES[0].hints[1]}`;
      }

      slotContainer.innerHTML = `
        <div style="margin-bottom: 1rem">
          <!-- Hint Control Header Bar -->
          <div class="glass-card" style="margin-bottom: 1rem; padding: 0.8rem 1.2rem; display: flex; justify-content: space-between; align-items: center">
            <div style="display: flex; align-items: center; gap: 0.6rem">
              <span>💡</span>
              <span style="font-family: var(--font-header); font-size: 0.85rem; font-weight: 700; color: var(--color-primary)">MISSION HINT SYSTEM</span>
            </div>
            <button class="hud-btn" id="btnRequestHint" ${usedHints >= 2 ? 'disabled' : ''} style="gap: 0.4rem; padding: 0.4rem 0.9rem; font-family: var(--font-mono); font-size: 0.75rem;">
              ${usedHints >= 2 ? 'NO HINTS REMAINING' : `💡 REQUEST HINT (${usedHints}/2)`}
            </button>
          </div>

          <!-- Hint Decoded Output Box -->
          <div id="hintBoxSlot" style="display: ${usedHints > 0 ? 'block' : 'none'}; margin-bottom: 1rem; animation: fade-up 0.3s ease-out">
            <div class="glass-card" style="border-color: var(--color-warning); padding: 0.9rem 1.2rem; background: rgba(255, 200, 87, 0.05)">
              <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-warning); font-weight: 700; margin-bottom: 0.3rem">
                [HINT DECRYPTED // HINT ${usedHints} OF 2]
              </div>
              <div id="hintContentText" style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-text)">
                ${hintDisplayText}
              </div>
            </div>
          </div>

          <!-- Transmissions Grid -->
          <div style="display: flex; align-items: center; gap: 0.6rem; font-family: var(--font-header); font-size: 1.05rem; font-weight: 700; color: var(--color-text); margin-bottom: 1rem">
            <span>📡</span>
            <span>INTERCEPTED TRANSMISSIONS</span>
          </div>

          <div class="transmission-grid">
            ${transmissionCardsHtml}
          </div>
        </div>
      `;

      // Attach Hint Request Handler
      const hintBtn = slotContainer.querySelector('#btnRequestHint');
      const hintBox = slotContainer.querySelector('#hintBoxSlot');
      const hintTextEl = slotContainer.querySelector('#hintContentText');

      if (hintBtn) {
        hintBtn.addEventListener('click', () => {
          audio.playClick();
          const res = gameState.requestHint();
          if (res.success) {
            const updatedState = gameState.get();
            const currentCount = updatedState.hintsUsed;

            if (currentCount === 1) {
              hintDisplayText = `HINT 1: ${BINARY_CHALLENGES[0].hints[0]}`;
              hintBtn.innerText = `💡 REQUEST HINT (1/2)`;
            } else if (currentCount >= 2) {
              hintDisplayText = `HINT 2: ${BINARY_CHALLENGES[0].hints[1]}`;
              hintBtn.innerText = `NO HINTS REMAINING`;
              hintBtn.disabled = true;
            }

            if (hintTextEl) hintTextEl.innerText = hintDisplayText;
            if (hintBox) hintBox.style.display = 'block';
          }
        });
      }

      // Hover Audio Effect on cards
      slotContainer.querySelectorAll('.transmission-card').forEach(card => {
        card.addEventListener('mouseenter', () => audio.playClick());
      });
    }
  });
}
