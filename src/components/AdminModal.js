/* ==========================================================================
   CTRL + ALT + ESCAPE | Organizer Event Control Center (Sprint 7 Admin Panel)
   ========================================================================== */

import { gameState } from '../state.js';
import { audio } from '../audio.js';
import { api } from '../api.js';

// Module State for Admin Modal
let isAuthenticated = false;
let activeTab = 'OVERVIEW'; // OVERVIEW, TEAMS, ANALYTICS, EMERGENCY, SETTINGS
let masterCodeRevealed = false;

let mockTeams = [
  { id: 't1', name: 'Cyber Knights', mission: 'Mission 02', timer: '18:42', status: 'ACTIVE', m1: true, m2: true, m3: false, omega: false },
  { id: 't2', name: 'DRU-QUANTUM-99', mission: 'Mission 03', timer: '20:11', status: 'ACTIVE', m1: true, m2: true, m3: true, omega: false },
  { id: 't3', name: 'Binary Breakers', mission: 'Omega Protocol', timer: '21:38', status: 'ACTIVE', m1: true, m2: true, m3: true, omega: true },
  { id: 't4', name: 'ZeroDay Protocol', mission: 'Mission 01', timer: '05:12', status: 'ACTIVE', m1: true, m2: false, m3: false, omega: false },
  { id: 't5', name: 'Glitch Hunters', mission: 'Completed', timer: '24:10', status: 'COMPLETED', m1: true, m2: true, m3: true, omega: true },
  { id: 't6', name: 'Neural Vanguard', mission: 'Pending', timer: '00:00', status: 'PENDING', m1: false, m2: false, m3: false, omega: false }
];

let liveLogs = [
  { time: '14:31', text: 'Team Beta verified Access Key #3' },
  { time: '14:24', text: 'Team Beta started Mission 02' },
  { time: '14:21', text: 'Team Alpha completed Mission 01' },
  { time: '14:15', text: 'Event System initialized successfully' }
];

let globalEventState = 'LIVE'; // LIVE, PAUSED, ENDED

export function renderAdminModal(container) {
  const state = gameState.get();
  container.classList.remove('hidden');

  // 1. Render Login Screen if not authenticated
  if (!isAuthenticated) {
    container.innerHTML = `
      <div class="admin-panel-overlay">
        <div class="admin-login-card">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-primary); letter-spacing: 2px; margin-bottom: 0.3rem">
            [ORGANIZER AUTHENTICATION]
          </div>
          <h2 style="font-family: var(--font-header); font-size: 1.5rem; color: #fff; margin-bottom: 0.5rem">
            EVENT CONTROL CENTER
          </h2>
          <p style="font-size: 0.85rem; color: var(--color-muted); margin-bottom: 1.5rem">
            Restricted to event coordinators, faculty, and game masters.
          </p>

          <form id="adminLoginForm">
            <input 
              type="text" 
              id="adminUsername" 
              class="admin-login-input" 
              placeholder="Username (admin)" 
              value="admin"
              required
            />
            <input 
              type="password" 
              id="adminPassword" 
              class="admin-login-input" 
              placeholder="Password (elysium2026)" 
              value="elysium2026"
              required
            />
            
            <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.8rem">
              <button type="submit" class="btn-omega-begin-restoration" style="margin-top: 0; padding: 0.85rem">
                <span>🔑 LOGIN TO CONTROL CENTER</span>
              </button>
              <button type="button" class="btn-omega-begin-restoration" id="btnQuickAdminLogin" style="margin-top: 0; padding: 0.75rem; background: linear-gradient(135deg, var(--color-primary), #00b8d4); color: #02050c; font-size: 0.9rem;">
                <span>⚡ QUICK ORGANIZER ACCESS (1-CLICK)</span>
              </button>
              <button type="button" class="hud-btn" id="btnCancelLogin" style="padding: 0.6rem; width: 100%; justify-content: center;">
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    const form = container.querySelector('#adminLoginForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      audio.playAccessGranted();
      isAuthenticated = true;
      renderAdminModal(container);
    });

    container.querySelector('#btnQuickAdminLogin')?.addEventListener('click', () => {
      audio.playAccessGranted();
      isAuthenticated = true;
      renderAdminModal(container);
    });

    container.querySelector('#btnCancelLogin')?.addEventListener('click', () => {
      container.classList.add('hidden');
      container.innerHTML = '';
    });

    return;
  }

  // 2. Render Full Event Control Center Dashboard
  container.innerHTML = `
    <div class="admin-panel-overlay">
      <div class="admin-panel-modal">
        
        <!-- Header -->
        <div class="admin-panel-header">
          <div class="admin-panel-title-group">
            <span style="font-size: 1.4rem;">⚙️</span>
            <span class="admin-panel-title">EVENT CONTROL CENTER</span>
            <span class="admin-panel-status-badge">
              EVENT: ${globalEventState === 'LIVE' ? '🟢 LIVE' : (globalEventState === 'PAUSED' ? '⏸️ PAUSED' : '🔴 ENDED')}
            </span>
            <span class="admin-panel-status-badge" style="background: rgba(0, 229, 255, 0.1); border-color: var(--color-primary); color: var(--color-primary);">
              Backend: ${api.isConnected() ? '🟢 Connected' : '🔴 Reconnecting...'}
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 0.8rem;">
            <button class="hud-btn" id="btnAdminLogout" style="font-size: 0.75rem; padding: 0.4rem 0.8rem;">
              🔒 LOGOUT
            </button>
            <button id="btnCloseAdminModal" style="background: none; border: none; color: var(--color-muted); font-size: 1.4rem; cursor: pointer;">✕</button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="admin-tab-bar">
          <button class="admin-tab-btn ${activeTab === 'OVERVIEW' ? 'active' : ''}" data-tab="OVERVIEW">📊 OVERVIEW</button>
          <button class="admin-tab-btn ${activeTab === 'TEAMS' ? 'active' : ''}" data-tab="TEAMS">👥 TEAM MANAGEMENT</button>
          <button class="admin-tab-btn ${activeTab === 'ANALYTICS' ? 'active' : ''}" data-tab="ANALYTICS">📈 ANALYTICS & CODE</button>
          <button class="admin-tab-btn ${activeTab === 'EMERGENCY' ? 'active' : ''}" data-tab="EMERGENCY">🚨 EMERGENCY & EXPORT</button>
          <button class="admin-tab-btn ${activeTab === 'SETTINGS' ? 'active' : ''}" data-tab="SETTINGS">⚙️ SETTINGS</button>
        </div>

        <!-- Tab Body Container -->
        <div class="admin-panel-body" id="adminTabContent">
          ${renderTabContent(state)}
        </div>

      </div>
    </div>
  `;

  // Attach Event Listeners
  container.querySelector('#btnCloseAdminModal')?.addEventListener('click', () => {
    container.classList.add('hidden');
    container.innerHTML = '';
  });

  container.querySelector('#btnAdminLogout')?.addEventListener('click', () => {
    audio.playClick();
    isAuthenticated = false;
    renderAdminModal(container);
  });

  // Tab switching
  const tabs = container.querySelectorAll('.admin-tab-btn');
  tabs.forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      audio.playClick();
      activeTab = tabBtn.dataset.tab;
      renderAdminModal(container);
    });
  });

  // Attach dynamic event handlers inside active tab content
  attachTabHandlers(container, state);
}

function renderTabContent(state) {
  if (activeTab === 'OVERVIEW') {
    return `
      <!-- Stat Summary Cards -->
      <div class="admin-stat-grid">
        <div class="admin-stat-card">
          <div class="admin-stat-label">TOTAL TEAMS</div>
          <div class="admin-stat-val">24</div>
        </div>
        <div class="admin-stat-card" style="border-color: var(--color-primary);">
          <div class="admin-stat-label">ACTIVE TEAMS</div>
          <div class="admin-stat-val" style="color: var(--color-primary);">15</div>
        </div>
        <div class="admin-stat-card" style="border-color: var(--color-success);">
          <div class="admin-stat-label">COMPLETED</div>
          <div class="admin-stat-val" style="color: var(--color-success);">6</div>
        </div>
        <div class="admin-stat-card" style="border-color: var(--color-warning);">
          <div class="admin-stat-label">PENDING</div>
          <div class="admin-stat-val" style="color: var(--color-warning);">3</div>
        </div>
      </div>

      <!-- Global Event Controls -->
      <div style="background: rgba(3, 7, 16, 0.85); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: var(--radius-md); padding: 1.2rem; margin-bottom: 1.5rem;">
        <div style="font-family: var(--font-header); font-size: 0.95rem; font-weight: 700; color: var(--color-primary); letter-spacing: 1.5px; margin-bottom: 0.8rem;">
          🌐 GLOBAL EVENT CONTROLS
        </div>
        <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
          <button class="hud-btn" id="btnGlobalStart" style="border-color: var(--color-success); color: var(--color-success);">
            ▶ START EVENT
          </button>
          <button class="hud-btn warning" id="btnGlobalPause">
            ⏸ PAUSE EVENT
          </button>
          <button class="hud-btn warning" id="btnGlobalEnd" style="border-color: var(--color-danger); color: var(--color-danger);">
            ⏹ END EVENT
          </button>
        </div>
      </div>

      <!-- Live Mission Map -->
      <div class="admin-mission-map-card">
        <div style="font-family: var(--font-header); font-size: 0.95rem; font-weight: 700; color: var(--color-primary); letter-spacing: 1.5px; margin-bottom: 1rem;">
          🗺️ LIVE MISSION DISTRIBUTION MAP
        </div>

        <div class="admin-map-item">
          <div class="admin-map-label">Mission 01</div>
          <div class="admin-map-track">
            <div class="admin-map-fill" style="width: 30%;"></div>
          </div>
          <div style="width: 70px; text-align: right; color: var(--color-primary);">3 Teams</div>
        </div>

        <div class="admin-map-item">
          <div class="admin-map-label">Mission 02</div>
          <div class="admin-map-track">
            <div class="admin-map-fill" style="width: 60%;"></div>
          </div>
          <div style="width: 70px; text-align: right; color: var(--color-primary);">6 Teams</div>
        </div>

        <div class="admin-map-item">
          <div class="admin-map-label">Mission 03</div>
          <div class="admin-map-track">
            <div class="admin-map-fill" style="width: 40%;"></div>
          </div>
          <div style="width: 70px; text-align: right; color: var(--color-primary);">4 Teams</div>
        </div>

        <div class="admin-map-item">
          <div class="admin-map-label">Omega Protocol</div>
          <div class="admin-map-track">
            <div class="admin-map-fill" style="width: 20%;"></div>
          </div>
          <div style="width: 70px; text-align: right; color: var(--color-success);">2 Teams</div>
        </div>
      </div>

      <!-- Live Activity Logs Feed -->
      <div class="admin-logs-card">
        <div style="font-family: var(--font-header); font-size: 0.9rem; font-weight: 700; color: var(--color-primary); letter-spacing: 1.5px; margin-bottom: 0.6rem;">
          💻 LIVE ACTIVITY LOGS
        </div>
        <div class="admin-logs-feed">
          ${liveLogs.map(log => `
            <div class="admin-log-line">
              <span style="color: var(--color-muted);">[${log.time}]</span> &nbsp; ${log.text}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (activeTab === 'TEAMS') {
    return `
      <div style="font-family: var(--font-header); font-size: 1rem; font-weight: 700; color: var(--color-primary); letter-spacing: 1.5px; margin-bottom: 1rem;">
        👥 LIVE TEAM MONITORING & CONTROL
      </div>

      <div class="leaderboard-table-card">
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Current Mission</th>
              <th>Timer / Elapsed</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${mockTeams.map(t => `
              <tr>
                <td style="font-weight: 700;">${t.name}</td>
                <td>${t.mission}</td>
                <td>${t.timer}</td>
                <td>
                  <span class="team-status-tag ${t.status === 'COMPLETED' ? 'completed' : 'running'}">
                    ${t.status}
                  </span>
                </td>
                <td>
                  <button class="hud-btn btn-team-view" data-team-id="${t.id}" style="font-size: 0.75rem; padding: 0.3rem 0.6rem;">
                    [ View / Manage ]
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  if (activeTab === 'ANALYTICS') {
    return `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-bottom: 1.5rem;">
        
        <!-- Analytics Card -->
        <div style="background: rgba(3, 7, 16, 0.85); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: var(--radius-md); padding: 1.2rem;">
          <div style="font-family: var(--font-header); font-size: 0.95rem; color: var(--color-primary); margin-bottom: 0.8rem;">
            📈 EVENT ANALYTICS SUMMARY
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.9;">
            <div>Average Completion Time: <strong style="color: var(--color-primary);">21m 15s</strong></div>
            <div>Fastest Team: <strong style="color: var(--color-success);">Cyber Knights (18m 42s)</strong></div>
            <div>Slowest Team: <strong style="color: var(--color-warning);">Glitch Hunters (24m 10s)</strong></div>
            <div>Most Common Mission: <strong style="color: #fff;">Mission 02 (QR Quest)</strong></div>
            <div>Total Active Sessions: <strong style="color: var(--color-primary);">15 Sessions</strong></div>
          </div>
        </div>

        <!-- Master Code Management -->
        <div style="background: rgba(3, 7, 16, 0.85); border: 1px solid var(--color-primary); border-radius: var(--radius-md); padding: 1.2rem;">
          <div style="font-family: var(--font-header); font-size: 0.95rem; color: var(--color-primary); margin-bottom: 0.8rem;">
            🔑 MASTER CODE MANAGEMENT
          </div>
          
          <div style="background: rgba(2, 5, 12, 0.9); border: 1px dashed var(--color-primary); border-radius: var(--radius-sm); padding: 0.8rem; text-align: center; margin-bottom: 1rem;">
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-muted);">CURRENT MASTER CODE</div>
            <div style="font-family: var(--font-mono); font-size: 1.3rem; font-weight: 700; color: var(--color-success); letter-spacing: 2px; margin-top: 0.3rem;">
              ${masterCodeRevealed ? 'ELYSIUM-CORE-RESTORED' : '••••••••••••••••••••'}
            </div>
          </div>

          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
            <button class="hud-btn" id="btnRevealMasterCode" style="font-size: 0.78rem;">
              ${masterCodeRevealed ? '👁️ Mask Code' : '👁️ Reveal Code'}
            </button>
            <button class="hud-btn" id="btnCopyMasterCode" style="font-size: 0.78rem;">
              📋 Copy Code
            </button>
            <button class="hud-btn warning" id="btnGenMasterCode" style="font-size: 0.78rem;">
              ⚡ Generate New
            </button>
          </div>
        </div>

      </div>
    `;
  }

  if (activeTab === 'EMERGENCY') {
    return `
      <!-- Emergency Controls -->
      <div class="admin-emergency-card">
        <div class="admin-emergency-title">
          <span>🚨 EMERGENCY OVERRIDE CONTROLS</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--color-muted); margin-bottom: 1rem;">
          Use only during organizer intervention or technical emergencies.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.8rem;">
          <button class="hud-btn warning" id="btnEmergencyUnlockAll">
            🔓 Force Unlock All Missions
          </button>
          <button class="hud-btn warning" id="btnEmergencyPauseAll">
            ⏸️ Pause All Timers
          </button>
          <button class="hud-btn" id="btnEmergencyResumeAll">
            ▶️ Resume All Timers
          </button>
          <button class="hud-btn warning" id="btnEmergencyResetAll" style="border-color: var(--color-danger); color: var(--color-danger);">
            ⚠️ Reset Entire Event
          </button>
        </div>
      </div>

      <!-- Export Results -->
      <div style="background: rgba(3, 7, 16, 0.85); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: var(--radius-md); padding: 1.2rem;">
        <div style="font-family: var(--font-header); font-size: 0.95rem; color: var(--color-primary); margin-bottom: 0.8rem;">
          📄 EXPORT EVENT RESULTS
        </div>
        <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
          <button class="hud-btn" id="btnExportCSV">
            📊 Export CSV
          </button>
          <button class="hud-btn" id="btnPrintPDF">
            🖨️ Export PDF / Print Results
          </button>
        </div>
      </div>
    `;
  }

  if (activeTab === 'SETTINGS') {
    return `
      <div style="background: rgba(3, 7, 16, 0.85); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: var(--radius-md); padding: 1.5rem; max-width: 600px;">
        <div style="font-family: var(--font-header); font-size: 1rem; color: var(--color-primary); margin-bottom: 1.2rem;">
          ⚙️ ORGANIZER EVENT SETTINGS
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem; font-family: var(--font-mono); font-size: 0.85rem;">
          <div>
            <label style="display: block; color: var(--color-muted); margin-bottom: 0.3rem;">Event Title:</label>
            <input type="text" class="admin-login-input" value="CTRL + ALT + ESCAPE 2026" style="margin-bottom: 0;" />
          </div>

          <div>
            <label style="display: block; color: var(--color-muted); margin-bottom: 0.3rem;">Mission Timer Duration (Minutes):</label>
            <input type="number" class="admin-login-input" value="25" style="margin-bottom: 0;" />
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.8rem;">
            <span>Sound Effects:</span>
            <button class="hud-btn" id="btnToggleSound">🔊 ON</button>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.8rem;">
            <span>Live Auto Refresh:</span>
            <button class="hud-btn" id="btnToggleRefresh">⚡ ENABLED</button>
          </div>
        </div>
      </div>
    `;
  }
}

function attachTabHandlers(container, state) {
  // Global Event Controls
  container.querySelector('#btnGlobalStart')?.addEventListener('click', () => {
    if (confirm('Start event for all teams?')) {
      audio.playClick();
      globalEventState = 'LIVE';
      addLog('Global Event STARTED');
      renderAdminModal(container);
    }
  });

  container.querySelector('#btnGlobalPause')?.addEventListener('click', () => {
    if (confirm('Pause event for all teams?')) {
      audio.playClick();
      globalEventState = 'PAUSED';
      addLog('Global Event PAUSED');
      renderAdminModal(container);
    }
  });

  container.querySelector('#btnGlobalEnd')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to END the event?')) {
      audio.playClick();
      globalEventState = 'ENDED';
      addLog('Global Event ENDED');
      renderAdminModal(container);
    }
  });

  // Master Code Controls
  container.querySelector('#btnRevealMasterCode')?.addEventListener('click', () => {
    audio.playClick();
    masterCodeRevealed = !masterCodeRevealed;
    renderAdminModal(container);
  });

  container.querySelector('#btnCopyMasterCode')?.addEventListener('click', () => {
    audio.playClick();
    navigator.clipboard.writeText('ELYSIUM-CORE-RESTORED');
    alert('Master Code copied to clipboard: ELYSIUM-CORE-RESTORED');
  });

  container.querySelector('#btnGenMasterCode')?.addEventListener('click', () => {
    if (confirm('Generate a new Master Code?')) {
      audio.playClick();
      alert('New Master Code generated: ELYSIUM-CORE-RESTORED');
    }
  });

  // Emergency Overrides
  container.querySelector('#btnEmergencyUnlockAll')?.addEventListener('click', () => {
    if (confirm('Force unlock all missions for current player?')) {
      audio.playClick();
      const st = gameState.get();
      st.accessKeys.key1.recovered = true;
      st.accessKeys.key2.recovered = true;
      st.accessKeys.key3.recovered = true;
      st.missions.mission1.status = 'COMPLETED';
      st.missions.mission2.status = 'COMPLETED';
      st.missions.mission3.status = 'COMPLETED';
      st.missions.finalMission.status = 'UNLOCKED';
      gameState.notify();
      addLog('Emergency: Force Unlocked All Missions');
      alert('All missions force unlocked.');
    }
  });

  container.querySelector('#btnEmergencyResetAll')?.addEventListener('click', () => {
    if (confirm('CRITICAL WARNING: Are you sure you want to RESET the entire event session?')) {
      audio.playClick();
      gameState.resetAll();
      addLog('Emergency: Reset Entire Event Session');
      container.classList.add('hidden');
    }
  });

  // Export Buttons
  container.querySelector('#btnExportCSV')?.addEventListener('click', () => {
    audio.playClick();
    const csvContent = "data:text/csv;charset=utf-8,Rank,Team Name,Time,Status\n1,Cyber Knights,18:42,COMPLETED\n2,DRU-QUANTUM-99,20:11,COMPLETED\n3,Binary Breakers,21:38,COMPLETED";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ctrl_alt_escape_results.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  container.querySelector('#btnPrintPDF')?.addEventListener('click', () => {
    audio.playClick();
    window.print();
  });

  // Team View Buttons in Table
  container.querySelectorAll('.btn-team-view').forEach(btn => {
    btn.addEventListener('click', () => {
      const teamId = btn.dataset.teamId;
      const team = mockTeams.find(t => t.id === teamId);
      if (team) {
        audio.playClick();
        showTeamManageModal(container, team);
      }
    });
  });
}

function showTeamManageModal(container, team) {
  const modal = document.getElementById('notificationModal');
  const content = document.getElementById('modalContent');
  if (!modal || !content) return;

  content.className = 'modal-card granted';
  content.innerHTML = `
    <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-primary); letter-spacing: 2px; margin-bottom: 0.3rem">
      [ADMIN TEAM MANAGEMENT]
    </div>
    <h3 class="modal-title" style="color: var(--color-primary); margin-bottom: 0.3rem">
      ${team.name}
    </h3>
    <div style="font-family: var(--font-mono); font-size: 0.85rem; color: #fff; margin-bottom: 1rem;">
      CURRENT MISSION: ${team.mission} | TIMER: ${team.timer}
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 1.2rem;">
      <button class="hud-btn" id="btnActionAdd5">➕ Add +5 Mins</button>
      <button class="hud-btn warning" id="btnActionSub5">➖ Deduct -5 Mins</button>
      <button class="hud-btn" id="btnActionUnlock">🔓 Unlock Next</button>
      <button class="hud-btn warning" id="btnActionReset">⚠️ Reset Team</button>
    </div>

    <button class="btn-verify" id="btnCloseTeamModal" style="width: 100%; padding: 0.8rem 1.4rem">
      CLOSE DOSSIER
    </button>
  `;

  modal.classList.remove('hidden');

  content.querySelector('#btnActionAdd5')?.addEventListener('click', () => {
    if (confirm(`Add 5 minutes to ${team.name}?`)) {
      audio.playClick();
      gameState.addTime(300);
      alert(`5 minutes added to ${team.name}`);
      modal.classList.add('hidden');
    }
  });

  content.querySelector('#btnActionSub5')?.addEventListener('click', () => {
    if (confirm(`Deduct 5 minutes from ${team.name}?`)) {
      audio.playClick();
      gameState.addTime(-300);
      alert(`5 minutes deducted from ${team.name}`);
      modal.classList.add('hidden');
    }
  });

  content.querySelector('#btnCloseTeamModal')?.addEventListener('click', () => {
    audio.playClick();
    modal.classList.add('hidden');
  });
}

function addLog(text) {
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  liveLogs.unshift({ time: timeStr, text });
}
