/* ==========================================================================
   CTRL + ALT + ESCAPE | Mission 03: The Glitch Module
   ========================================================================== */

import { renderMissionConsoleLayout } from '../screens/MissionConsoleLayout.js';
import { audio } from '../audio.js';

export function renderMission3(container) {
  let blocks = {
    b1: { label: 'BLOCK 0x7F01', status: 'CORRUPTED', fragment: 'CYBER-' },
    b2: { label: 'BLOCK 0x8A90', status: 'CORRUPTED', fragment: 'GAMMA-' },
    b3: { label: 'BLOCK 0x9123', status: 'CORRUPTED', fragment: '9123' }
  };

  renderMissionConsoleLayout(container, {
    missionNumberLabel: 'MISSION 03',
    title: 'THE GLITCH',
    subtitle: 'INSPECT • PURGE • RECONSTRUCT',
    keyId: 'key3',
    objectiveText: 'Sector 3 core memory blocks are infected by unknown data anomalies. Purge infected memory blocks to reconstruct Access Key #3.',
    clueText: 'Inspect memory blocks 0x7F01, 0x8A90, and 0x9123 to collect key fragments.',
    renderModule: (slotContainer) => {
      slotContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem">
            <div class="glass-card" id="cardB1" style="border-color: var(--color-danger); text-align: center; padding: 1.2rem">
              <h4 style="font-family: var(--font-mono); color: var(--color-danger); font-size: 0.9rem">BLOCK 0x7F01</h4>
              <p class="status-text" style="font-size: 0.75rem; color: var(--color-danger); margin: 0.4rem 0">STATUS: CORRUPTED</p>
              <button class="hud-btn btn-purge" data-block="b1" style="margin: 0 auto">⚡ PURGE ANOMALY</button>
              <div class="fragment-text" style="margin-top: 0.6rem; font-family: var(--font-mono); font-weight: 700; color: var(--color-success); font-size: 0.85rem"></div>
            </div>

            <div class="glass-card" id="cardB2" style="border-color: var(--color-danger); text-align: center; padding: 1.2rem">
              <h4 style="font-family: var(--font-mono); color: var(--color-danger); font-size: 0.9rem">BLOCK 0x8A90</h4>
              <p class="status-text" style="font-size: 0.75rem; color: var(--color-danger); margin: 0.4rem 0">STATUS: MEMORY LEAK</p>
              <button class="hud-btn btn-purge" data-block="b2" style="margin: 0 auto">⚡ PURGE ANOMALY</button>
              <div class="fragment-text" style="margin-top: 0.6rem; font-family: var(--font-mono); font-weight: 700; color: var(--color-success); font-size: 0.85rem"></div>
            </div>

            <div class="glass-card" id="cardB3" style="border-color: var(--color-danger); text-align: center; padding: 1.2rem">
              <h4 style="font-family: var(--font-mono); color: var(--color-danger); font-size: 0.9rem">BLOCK 0x9123</h4>
              <p class="status-text" style="font-size: 0.75rem; color: var(--color-danger); margin: 0.4rem 0">STATUS: OVERFLOW</p>
              <button class="hud-btn btn-purge" data-block="b3" style="margin: 0 auto">⚡ PURGE ANOMALY</button>
              <div class="fragment-text" style="margin-top: 0.6rem; font-family: var(--font-mono); font-weight: 700; color: var(--color-success); font-size: 0.85rem"></div>
            </div>
          </div>

          <div style="background: rgba(5, 7, 13, 0.8); border: 1px solid var(--color-primary); padding: 0.8rem; border-radius: var(--radius-sm); text-align: center">
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-muted)">RECONSTRUCTED KEY FRAGMENTS:</span>
            <div id="reconstructedKey" style="font-family: var(--font-mono); font-size: 1.2rem; font-weight: 700; color: var(--color-primary); letter-spacing: 2px; margin-top: 0.3rem">
              ------------------
            </div>
          </div>
        </div>
      `;

      // Purge Handlers
      const purgeButtons = slotContainer.querySelectorAll('.btn-purge');
      const reconstructedDisplay = slotContainer.querySelector('#reconstructedKey');

      const updateReconstruction = () => {
        const f1 = blocks.b1.status === 'PATCHED' ? blocks.b1.fragment : '______-';
        const f2 = blocks.b2.status === 'PATCHED' ? blocks.b2.fragment : '______-';
        const f3 = blocks.b3.status === 'PATCHED' ? blocks.b3.fragment : '____';
        reconstructedDisplay.innerText = f1 + f2 + f3;
      };

      purgeButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          audio.playGlitch();
          const bKey = e.target.dataset.block;
          blocks[bKey].status = 'PATCHED';

          const card = slotContainer.querySelector(`#cardB${bKey.slice(1)}`);
          card.style.borderColor = 'var(--color-success)';
          card.querySelector('.status-text').style.color = 'var(--color-success)';
          card.querySelector('.status-text').innerText = 'STATUS: PATCHED ✓';
          card.querySelector('.fragment-text').innerText = `FRAGMENT: ${blocks[bKey].fragment}`;
          e.target.disabled = true;
          e.target.style.opacity = '0.5';

          updateReconstruction();
        });
      });
    }
  });
}
