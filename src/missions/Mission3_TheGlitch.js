/* ==========================================================================
   CTRL + ALT + ESCAPE | Mission 03: The Glitch Module
   Sprint 4.3: Glitch Website Integration & Verification Flow
   ========================================================================== */

import { renderMissionConsoleLayout } from '../screens/MissionConsoleLayout.js';
import { audio } from '../audio.js';
import { gameState } from '../state.js';

export function renderMission3(container) {
  // Required State
  let websiteOpened = false;
  let accessKeyInput = '';
  let verificationReady = false;

  const targetUrl = '/glitch-website/index.html';

  renderMissionConsoleLayout(container, {
    missionNumberLabel: 'MISSION 03',
    title: 'THE GLITCH',
    subtitle: 'INSPECT • PURGE • RECONSTRUCT',
    keyId: 'key3',
    objectiveText: '• Launch the recovered website.<br>• Investigate the corrupted pages.<br>• Recover every hidden fragment.<br>• Reconstruct Access Key #3.<br>• Return to Mission Console.',
    clueText: 'A corrupted web server has been recovered. Launch the website to begin digital forensics investigation.',
    renderModule: (slotContainer) => {
      const renderContent = () => {
        slotContainer.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem">
            <!-- Mission Briefing & System Status Card -->
            <div class="glass-card" style="padding: 1.2rem">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; border-bottom: 1px solid rgba(0, 229, 255, 0.15); padding-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem">
                <div style="font-family: var(--font-header); font-size: 0.9rem; font-weight: 700; color: var(--color-danger); letter-spacing: 1px; display: flex; align-items: center; gap: 0.5rem">
                  <span>⚠️</span>
                  <span>SYSTEM CORRUPTION DETECTED</span>
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-danger); background: rgba(255, 0, 85, 0.1); border: 1px solid var(--color-danger); padding: 0.25rem 0.6rem; border-radius: var(--radius-sm)">
                  STATUS: CORRUPTED
                </div>
              </div>
              <p style="font-size: 0.9rem; color: var(--color-text); line-height: 1.6; margin: 0">
                A corrupted web server has been recovered from the Game Elysium network.<br><br>
                Security analysis indicates that Access Key #3 has been hidden somewhere inside the infected website.<br><br>
                Your objective is to investigate the recovered website, locate every hidden clue, reconstruct the final Access Key, and return to Mission Console before system corruption spreads further.
              </p>
            </div>

            <!-- Investigation Status Panel & Recovered Server Access Panel Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem">
              
              <!-- INVESTIGATION STATUS PANEL -->
              <div class="glass-card" style="padding: 1.2rem; display: flex; flex-direction: column; justify-content: space-between">
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.8rem; border-bottom: 1px solid rgba(0, 229, 255, 0.15); padding-bottom: 0.5rem">
                    <span>🔍</span>
                    <span style="font-family: var(--font-header); font-size: 0.85rem; font-weight: 700; color: var(--color-primary); letter-spacing: 1px">
                      INVESTIGATION STATUS
                    </span>
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 0.6rem; font-family: var(--font-mono); font-size: 0.8rem">
                    <div style="display: flex; justify-content: space-between">
                      <span style="color: var(--color-muted)">STATUS:</span>
                      <span id="investigationStatusText" style="color: ${websiteOpened ? 'var(--color-success)' : 'var(--color-warning)'}; font-weight: 700">
                        ${websiteOpened ? '🟢 Investigation In Progress' : 'Website Not Opened'}
                      </span>
                    </div>

                    <div style="display: flex; justify-content: space-between">
                      <span style="color: var(--color-muted)">EVIDENCE STATUS:</span>
                      <span style="color: ${websiteOpened ? 'var(--color-primary)' : 'var(--color-muted)'}; font-weight: 700">
                        ${websiteOpened ? 'Waiting For Access Key...' : '0 / 8'}
                      </span>
                    </div>

                    <div style="display: flex; justify-content: space-between">
                      <span style="color: var(--color-muted)">ACCESS KEY:</span>
                      <span style="color: ${websiteOpened ? 'var(--color-warning)' : 'var(--color-danger)'}; font-weight: 700">
                        ${websiteOpened ? 'AWAITING VERIFICATION' : 'NOT RECOVERED'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- RECOVERED SERVER ACCESS PANEL -->
              <div class="glass-card" style="padding: 1.2rem; display: flex; flex-direction: column; justify-content: space-between">
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.8rem; border-bottom: 1px solid rgba(0, 229, 255, 0.15); padding-bottom: 0.5rem">
                    <span>🌐</span>
                    <span style="font-family: var(--font-header); font-size: 0.85rem; font-weight: 700; color: var(--color-primary); letter-spacing: 1px">
                      RECOVERED SERVER
                    </span>
                  </div>

                  <div style="margin-bottom: 0.8rem">
                    <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-muted); margin-bottom: 0.3rem">
                      RECOVERED URL:
                    </div>
                    <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-primary); background: rgba(5, 7, 13, 0.8); border: 1px solid rgba(0, 229, 255, 0.3); padding: 0.5rem 0.8rem; border-radius: var(--radius-sm); word-break: break-all">
                      ${targetUrl}
                    </div>
                  </div>
                </div>

                <div>
                  <button class="hud-btn" id="btnLaunchWebsite" style="width: 100%; justify-content: center; padding: 0.65rem 1rem; font-family: var(--font-mono); font-size: 0.8rem">
                    <span>🚀 LAUNCH INVESTIGATION</span>
                  </button>

                  <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-muted); text-align: center; margin-top: 0.6rem; line-height: 1.4">
                    After recovering Access Key #3, return to this Mission Console and verify the recovered key.
                  </div>
                </div>
              </div>

            </div>

            <!-- INVESTIGATION LOG PANEL -->
            <div class="glass-card" style="padding: 1.2rem">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.6rem; border-bottom: 1px solid rgba(0, 229, 255, 0.15); padding-bottom: 0.5rem">
                <span>🖥️</span>
                <span style="font-family: var(--font-header); font-size: 0.85rem; font-weight: 700; color: var(--color-primary); letter-spacing: 1px">
                  INVESTIGATION LOG
                </span>
              </div>

              <div id="investigationLogBox" style="background: rgba(5, 7, 13, 0.9); border: 1px solid rgba(0, 229, 255, 0.2); padding: 0.8rem 1rem; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-text); line-height: 1.6; max-height: 140px; overflow-y: auto">
                <div style="color: var(--color-primary); font-weight: 700; margin-bottom: 0.2rem">[SYSTEM]</div>
                <div>Recovered server is ready for investigation.</div>
                <div>No evidence has been recovered.</div>
                <div>Launch the recovered website to begin digital forensics.</div>
                ${websiteOpened ? `
                  <div style="margin-top: 0.6rem; color: var(--color-success); font-weight: 700">[SYSTEM]</div>
                  <div>External investigation connection opened: ${targetUrl}</div>
                  <div>Awaiting Access Key #3 verification in Mission Console...</div>
                ` : ''}
              </div>
            </div>
          </div>
        `;

        // Attach Launch Website Button Handler
        const launchBtn = slotContainer.querySelector('#btnLaunchWebsite');
        if (launchBtn) {
          launchBtn.addEventListener('click', () => {
            audio.playClick();
            websiteOpened = true;
            window.open(targetUrl, '_blank');
            renderContent();
            updateAccessKeyControls();
          });
        }
      };

      const showMissionSuccessPopup = () => {
        audio.playSuccess();

        const popupOverlay = document.createElement('div');
        popupOverlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(4, 7, 17, 0.88);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease-out;
        `;

        popupOverlay.innerHTML = `
          <div class="glass-card" style="padding: 2rem; max-width: 460px; width: 90%; text-align: center; border: 1px solid var(--color-success); box-shadow: 0 0 40px rgba(0, 255, 170, 0.3)">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem">🎉</div>
            <h2 style="font-family: var(--font-header); font-size: 1.4rem; color: var(--color-success); letter-spacing: 2px; margin-bottom: 1rem">
              MISSION 03 COMPLETE
            </h2>
            <div style="font-family: var(--font-mono); font-size: 0.88rem; color: var(--color-text); line-height: 1.6; margin-bottom: 1.5rem">
              Digital investigation completed successfully.<br><br>
              Access Key #3 verified.<br><br>
              <span style="color: var(--color-primary); font-weight: 700">Omega Protocol is now available.</span>
            </div>
            <button class="cyber-btn primary-btn full-width" id="btnReturnDashboard" style="justify-content: center; padding: 0.75rem 1.2rem; font-family: var(--font-mono); font-size: 0.85rem">
              <span>RETURN TO DASHBOARD</span>
            </button>
          </div>
        `;

        document.body.appendChild(popupOverlay);

        const returnBtn = popupOverlay.querySelector('#btnReturnDashboard');
        if (returnBtn) {
          returnBtn.addEventListener('click', () => {
            audio.playClick();
            document.body.removeChild(popupOverlay);
            gameState.setView('DASHBOARD');
          });
        }
      };

      const updateAccessKeyControls = () => {
        const keyTitle = container.querySelector('.access-key-title');
        if (keyTitle) {
          keyTitle.innerText = 'ACCESS KEY #3';
        }

        const inputEl = container.querySelector('#keyInput');
        const submitBtn = container.querySelector('#keyVerifyForm button[type="submit"]');

        if (inputEl && submitBtn) {
          inputEl.disabled = !websiteOpened;
          if (!websiteOpened) {
            inputEl.placeholder = 'Launch website to begin investigation...';
          } else {
            inputEl.placeholder = 'Enter Access Key #3';
          }

          verificationReady = inputEl.value.trim().length > 0;
          submitBtn.disabled = !verificationReady;

          if (!inputEl.dataset.listenerAttached) {
            inputEl.dataset.listenerAttached = 'true';
            inputEl.addEventListener('input', (e) => {
              accessKeyInput = e.target.value;
              verificationReady = accessKeyInput.trim().length > 0;
              submitBtn.disabled = !verificationReady;
            });
          }
        }

        // Attach Key Verification Submit Handler
        const verifyForm = container.querySelector('#keyVerifyForm');
        if (verifyForm && !verifyForm.dataset.listenerAttached) {
          verifyForm.dataset.listenerAttached = 'true';
          verifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!verificationReady) return;

            const res = gameState.verifyAccessKey('key3', accessKeyInput);
            if (res.success) {
              showMissionSuccessPopup();
            }
          });
        }
      };

      renderContent();
      updateAccessKeyControls();
    }
  });
}
