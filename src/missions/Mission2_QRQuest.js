/* ==========================================================================
   CTRL + ALT + ESCAPE | Mission 02: QR Quest Module
   ========================================================================== */

import { renderMissionConsoleLayout } from '../screens/MissionConsoleLayout.js';
import { audio } from '../audio.js';

export function renderMission2(container) {
  renderMissionConsoleLayout(container, {
    missionNumberLabel: 'MISSION 02',
    title: 'QR QUEST',
    subtitle: 'SCAN • DOWNLINK • DECODE',
    keyId: 'key2',
    objectiveText: 'Downlink node transmissions contain an encrypted mobile QR payload. Scan using a smartphone camera or calibrate frequency sliders below to recover Access Key #2.',
    clueText: 'Align Carrier Frequency to 4096 Hz on Signal Node 2 to demodulate raw key string.',
    renderModule: (slotContainer) => {
      slotContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.2rem; margin-bottom: 1rem">
          <!-- QR Matrix Display -->
          <div class="glass-card" style="text-align: center; padding: 1.2rem">
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-muted); display: block; margin-bottom: 0.8rem">
              MOBILE SCANNER PAYLOAD
            </span>
            <div style="display: flex; justify-content: center; margin-bottom: 0.8rem">
              <div style="background: white; padding: 0.8rem; border-radius: 8px; box-shadow: 0 0 20px var(--color-primary-glow)">
                <svg width="150" height="150" viewBox="0 0 29 29" shape-rendering="crispEdges">
                  <path fill="#000" d="M0,0h7v7h-7z M22,0h7v7h-7z M0,22h7v7h-7z M2,2h3v3h-3z M24,2h3v3h-3z M2,24h3v3h-3z M9,0h2v1h-2z M13,0h1v3h-1z M15,0h2v1h-2z M18,0h1v2h-1z M9,2h1v1h-1z M11,2h2v1h-2z M15,2h1v2h-1z M18,2h2v1h-2z M9,4h3v1h-3z M14,4h1v1h-1z M16,4h2v1h-2z M19,4h2v1h-2z M8,6h1v3h-1z M10,6h2v1h-2z M13,6h3v1h-3z M17,6h1v2h-1z M19,6h1v1h-1z M21,6h1v3h-1z M9,8h3v1h-3z M13,8h2v1h-2z M16,8h2v1h-2z M20,8h1v1h-1z M0,9h1v3h-1z M2,9h2v1h-2z M5,9h1v1h-1z M7,9h2v1h-2z M10,9h1v2h-1z M12,9h3v1h-3z M16,9h2v1h-2z M19,9h1v2h-1z M22,9h1v2h-1z M25,9h3v1h-3z M1,11h3v1h-3z M5,11h1v2h-1z M7,11h2v1h-2z M12,11h2v1h-2z M15,11h1v1h-1z M17,11h4v1h-4z M23,11h2v1h-2z M26,11h2v1h-2z M0,13h4v1h-4z M5,13h2v1h-2z M8,13h2v1h-2z M11,13h2v1h-2z M14,13h3v1h-3z M18,13h2v1h-2z M21,13h3v1h-3z M25,13h3v1h-3z M1,15h2v1h-2z M4,15h2v1h-2z M7,15h3v1h-3z M11,15h1v2h-1z M13,15h2v1h-2z M16,15h2v1h-2z M19,15h2v1h-2z M22,15h2v1h-2z M25,15h2v1h-2z M0,17h2v1h-2z M3,17h2v1h-2z M6,17h1v2h-1z M8,17h2v1h-2z M12,17h3v1h-3z M16,17h1v1h-1z M18,17h3v1h-3z M22,17h1v2h-1z M24,17h3v1h-3z M2,19h2v1h-2z M5,19h2v1h-2z M9,19h2v1h-2z M12,19h1v1h-1z M14,19h4v1h-4z M19,19h2v1h-2z M23,19h2v1h-2z M26,19h2v1h-2z M8,21h2v1h-2z M11,21h1v2h-1z M13,21h3v1h-3z M17,21h3v1h-3z M21,21h2v1h-2z M24,21h3v1h-3z M9,23h2v1h-2z M12,23h3v1h-3z M16,23h2v1h-2z M19,23h2v1h-2z M22,23h1v1h-1z M24,23h2v1h-2z M8,25h3v1h-3z M12,25h2v1h-2z M15,25h2v1h-2z M18,25h1v2h-1z M20,25h3v1h-3z M24,25h2v1h-2z M9,27h2v1h-2z M12,27h1v1h-1z M14,27h3v1h-3z M18,27h2v1h-2z M21,27h3v1h-3z M25,27h2v1h-2z"/>
                </svg>
              </div>
            </div>
            <p style="font-size: 0.8rem; color: var(--color-muted)">Scan with smartphone camera to reveal raw key.</p>
          </div>

          <!-- Signal Demodulator -->
          <div class="glass-card" style="padding: 1.2rem">
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-muted); display: block; margin-bottom: 0.8rem">
              SIGNAL FREQUENCY DEMODULATOR
            </span>
            <div style="display: flex; flex-direction: column; gap: 0.8rem">
              <div>
                <label style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-primary)">
                  CARRIER FREQUENCY: <span id="freqVal">2048 Hz</span>
                </label>
                <input type="range" id="sliderFreq" min="1024" max="8192" step="512" value="2048" style="width: 100%; accent-color: var(--color-primary)" />
              </div>

              <div>
                <label style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-primary)">
                  SIGNAL NODE: <span id="nodeVal">Node 1</span>
                </label>
                <input type="range" id="sliderNode" min="1" max="5" step="1" value="1" style="width: 100%; accent-color: var(--color-primary)" />
              </div>

              <div style="background: rgba(5, 7, 13, 0.8); border: 1px solid var(--color-primary); padding: 0.8rem; border-radius: var(--radius-sm); text-align: center; min-height: 50px; display: flex; align-items: center; justify-content: center">
                <span id="demodOutput" style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-warning)">
                  [ALIGN TO 4096 Hz @ NODE 2]
                </span>
              </div>
            </div>
          </div>
        </div>
      `;

      // Slider Logic
      const sliderFreq = slotContainer.querySelector('#sliderFreq');
      const sliderNode = slotContainer.querySelector('#sliderNode');
      const freqVal = slotContainer.querySelector('#freqVal');
      const nodeVal = slotContainer.querySelector('#nodeVal');
      const demodOutput = slotContainer.querySelector('#demodOutput');

      const updateSignal = () => {
        const freq = parseInt(sliderFreq.value, 10);
        const node = parseInt(sliderNode.value, 10);

        freqVal.innerText = `${freq} Hz`;
        nodeVal.innerText = `Node ${node}`;

        if (freq === 4096 && node === 2) {
          audio.playAccessGranted();
          demodOutput.style.color = 'var(--color-success)';
          demodOutput.innerHTML = 'DEMODULATED KEY: <strong>RECOVERY-BETA-4096</strong>';
        } else {
          demodOutput.style.color = 'var(--color-warning)';
          demodOutput.innerText = '[ALIGN TO 4096 Hz @ NODE 2]';
        }
      };

      sliderFreq.addEventListener('input', updateSignal);
      sliderNode.addEventListener('input', updateSignal);
    }
  });
}
