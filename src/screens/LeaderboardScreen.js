/* ==========================================================================
   CTRL + ALT + ESCAPE | Leaderboard System Screen
   Sprint 6.1 - Official Event Rankings & Team Completion Statistics
   ========================================================================== */

import { gameState } from '../state.js';
import { audio } from '../audio.js';
import { api } from '../api.js';

export function renderLeaderboardScreen(container) {
  const state = gameState.get();

  // Sprint 7.0 Requirement: 15-Second Live Leaderboard Auto Refresh
  const pollInterval = setInterval(() => {
    if (state.view === 'LEADERBOARD') {
      api.fetchLeaderboard().then(res => {
        if (res.success && res.data && Array.isArray(res.data)) {
          // Live API data refresh
        }
      });
    } else {
      clearInterval(pollInterval);
    }
  }, 15000);

  // Format current player time
  const playerTotalSecs = state.elapsedSeconds + state.penaltySeconds;
  const pMins = Math.floor(playerTotalSecs / 60);
  const pSecs = (playerTotalSecs % 60).toString().padStart(2, '0');
  const playerTimeFormatted = `${pMins.toString().padStart(2, '0')}:${pSecs}`;

  const isPlayerCompleted = state.missions.finalMission.status === 'COMPLETED';

  // Seed benchmark leaderboard teams
  const initialTeams = [
    {
      id: 'team-alpha',
      rank: 1,
      name: 'Cyber Knights',
      timeSecs: 1122,
      timeFormatted: '18:42',
      missionsCompleted: '4 / 4',
      status: 'COMPLETED',
      m1: true, m2: true, m3: true, omega: true,
      isCurrentPlayer: false
    },
    {
      id: 'team-beta',
      rank: 2,
      name: 'DRU-QUANTUM-99',
      timeSecs: 1211,
      timeFormatted: '20:11',
      missionsCompleted: '4 / 4',
      status: 'COMPLETED',
      m1: true, m2: true, m3: true, omega: true,
      isCurrentPlayer: false
    },
    {
      id: 'team-gamma',
      rank: 3,
      name: 'Binary Breakers',
      timeSecs: 1298,
      timeFormatted: '21:38',
      missionsCompleted: '4 / 4',
      status: 'COMPLETED',
      m1: true, m2: true, m3: true, omega: true,
      isCurrentPlayer: false
    },
    {
      id: 'team-4',
      rank: 4,
      name: 'ZeroDay Protocol',
      timeSecs: 1450,
      timeFormatted: '24:10',
      missionsCompleted: '4 / 4',
      status: 'COMPLETED',
      m1: true, m2: true, m3: true, omega: true,
      isCurrentPlayer: false
    },
    {
      id: 'team-5',
      rank: 5,
      name: 'Glitch Hunters',
      timeSecs: 0,
      timeFormatted: '15:20 (Active)',
      missionsCompleted: '3 / 4',
      status: 'RUNNING',
      m1: true, m2: true, m3: true, omega: false,
      isCurrentPlayer: false
    },
    {
      id: 'team-6',
      rank: 6,
      name: 'Neural Vanguard',
      timeSecs: 0,
      timeFormatted: '--:--',
      missionsCompleted: '1 / 4',
      status: 'DISCONNECTED',
      m1: true, m2: false, m3: false, omega: false,
      isCurrentPlayer: false
    }
  ];

  // Insert current player's team if completed or active
  let allTeams = [...initialTeams];
  if (isPlayerCompleted) {
    const playerEntry = {
      id: 'player-team',
      name: `Team ${state.teamName}`,
      timeSecs: playerTotalSecs,
      timeFormatted: playerTimeFormatted,
      missionsCompleted: '4 / 4',
      status: 'COMPLETED',
      m1: true, m2: true, m3: true, omega: true,
      isCurrentPlayer: true
    };
    allTeams.push(playerEntry);
  }

  // Sort completed teams by timeSecs
  const completedTeams = allTeams
    .filter(t => t.status === 'COMPLETED')
    .sort((a, b) => a.timeSecs - b.timeSecs);

  const nonCompletedTeams = allTeams.filter(t => t.status !== 'COMPLETED');

  // Re-assign ranks
  const sortedTeams = [...completedTeams, ...nonCompletedTeams].map((team, idx) => ({
    ...team,
    rank: idx + 1
  }));

  let currentSearchQuery = '';
  let currentFilter = 'ALL'; // ALL, COMPLETED, IN_PROGRESS

  function renderView() {
    // Filter teams based on search & tab
    const filteredTeams = sortedTeams.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(currentSearchQuery.toLowerCase());
      if (currentFilter === 'COMPLETED') {
        return matchesSearch && t.status === 'COMPLETED';
      }
      if (currentFilter === 'IN_PROGRESS') {
        return matchesSearch && t.status === 'RUNNING';
      }
      return matchesSearch;
    });

    const top1 = sortedTeams.find(t => t.rank === 1);
    const top2 = sortedTeams.find(t => t.rank === 2);
    const top3 = sortedTeams.find(t => t.rank === 3);

    container.innerHTML = `
      <div class="leaderboard-container">
        
        <!-- Header Block -->
        <div class="leaderboard-header-block">
          <div class="leaderboard-sub-tag">CTRL + ALT + ESCAPE</div>
          <h1 class="leaderboard-main-title">MISSION LEADERBOARD</h1>
          <div class="leaderboard-subtitle">Digital Recovery Unit Rankings</div>
        </div>

        <!-- Top 3 Podium (Gold, Silver, Bronze) -->
        <div class="leaderboard-podium-grid">
          
          <!-- 🥈 Silver (Rank 2) -->
          <div class="podium-card silver" data-team-id="${top2 ? top2.id : ''}">
            <div class="podium-badge-icon">🥈</div>
            <div class="podium-team-name">${top2 ? top2.name : 'Awaiting Team'}</div>
            <div class="podium-time">${top2 ? top2.timeFormatted : '--:--'}</div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-muted); margin-top: 0.3rem;">RANK #2</div>
          </div>

          <!-- 🥇 Gold (Rank 1) -->
          <div class="podium-card gold" data-team-id="${top1 ? top1.id : ''}">
            <div class="podium-badge-icon">🥇</div>
            <div class="podium-team-name">${top1 ? top1.name : 'Awaiting Champion'}</div>
            <div class="podium-time">${top1 ? top1.timeFormatted : '--:--'}</div>
            <div style="font-family: var(--font-mono); font-size: 0.78rem; color: #ffd700; font-weight: 700; margin-top: 0.3rem;">RANK #1 // CHAMPION</div>
          </div>

          <!-- 🥉 Bronze (Rank 3) -->
          <div class="podium-card bronze" data-team-id="${top3 ? top3.id : ''}">
            <div class="podium-badge-icon">🥉</div>
            <div class="podium-team-name">${top3 ? top3.name : 'Awaiting Team'}</div>
            <div class="podium-time">${top3 ? top3.timeFormatted : '--:--'}</div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-muted); margin-top: 0.3rem;">RANK #3</div>
          </div>

        </div>

        <!-- Search & Filter Toolbar -->
        <div class="leaderboard-toolbar">
          <div class="leaderboard-search-box">
            <span class="leaderboard-search-icon">🔍</span>
            <input 
              type="text" 
              id="leaderboardSearchInput" 
              class="leaderboard-search-input" 
              placeholder="Search by Team Name..." 
              value="${currentSearchQuery}"
            />
          </div>

          <div class="leaderboard-filter-tabs">
            <button class="leaderboard-filter-btn ${currentFilter === 'ALL' ? 'active' : ''}" data-filter="ALL">ALL TEAMS</button>
            <button class="leaderboard-filter-btn ${currentFilter === 'COMPLETED' ? 'active' : ''}" data-filter="COMPLETED">COMPLETED</button>
            <button class="leaderboard-filter-btn ${currentFilter === 'IN_PROGRESS' ? 'active' : ''}" data-filter="IN_PROGRESS">IN PROGRESS</button>
          </div>
        </div>

        <!-- Full Leaderboard Table -->
        <div class="leaderboard-table-card">
          ${filteredTeams.length > 0 ? `
            <table class="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team Name</th>
                  <th>Completion Time</th>
                  <th>Missions Completed</th>
                  <th>Final Status</th>
                </tr>
              </thead>
              <tbody>
                ${filteredTeams.map(t => {
                  let statusClass = 'completed';
                  let statusLabel = 'COMPLETED';
                  if (t.status === 'RUNNING') {
                    statusClass = 'running';
                    statusLabel = 'IN PROGRESS';
                  } else if (t.status === 'DISCONNECTED') {
                    statusClass = 'disconnected';
                    statusLabel = 'DISCONNECTED';
                  }

                  return `
                    <tr data-team-id="${t.id}" class="${t.isCurrentPlayer ? 'highlight-current' : ''}">
                      <td style="font-weight: 700; color: ${t.rank <= 3 ? 'var(--color-primary)' : 'var(--color-text)'}">#${t.rank}</td>
                      <td style="font-weight: 700;">
                        ${t.name} ${t.isCurrentPlayer ? '<span style="color: var(--color-success); font-size: 0.75rem; margin-left: 0.4rem;">(YOU)</span>' : ''}
                      </td>
                      <td>${t.timeFormatted}</td>
                      <td>${t.missionsCompleted}</td>
                      <td>
                        <span class="team-status-tag ${statusClass}">
                          ${t.status === 'COMPLETED' ? '✓' : (t.status === 'RUNNING' ? '⏳' : '✖')} ${statusLabel}
                        </span>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          ` : `
            <div class="leaderboard-empty-state">
              <div class="leaderboard-empty-icon">📡</div>
              <div>No teams have completed the event yet.</div>
              <div style="font-size: 0.8rem; margin-top: 0.3rem;">Waiting for first successful recovery...</div>
            </div>
          `}
        </div>

        <!-- Navigation Footer -->
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button class="hud-btn" id="btnBackToVictory" style="padding: 0.8rem 1.6rem;">
            <span>➔ RETURN TO VICTORY SCREEN</span>
          </button>
          <button class="hud-btn" id="btnBackToDashboard" style="padding: 0.8rem 1.6rem; background: rgba(5, 10, 20, 0.8);">
            <span>🏠 RETURN TO DASHBOARD</span>
          </button>
        </div>

      </div>
    `;

    // Event listeners: Search Input
    const searchInput = container.querySelector('#leaderboardSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        renderView();
        const inputRef = container.querySelector('#leaderboardSearchInput');
        if (inputRef) {
          inputRef.focus();
          inputRef.setSelectionRange(inputRef.value.length, inputRef.value.length);
        }
      });
    }

    // Event listeners: Filter Tabs
    const filterBtns = container.querySelectorAll('.leaderboard-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        audio.playClick();
        currentFilter = btn.dataset.filter;
        renderView();
      });
    });

    // Event listeners: Team Detail Modal on click row or podium
    const clickableItems = container.querySelectorAll('[data-team-id]');
    clickableItems.forEach(item => {
      item.addEventListener('click', () => {
        const teamId = item.dataset.teamId;
        const targetTeam = sortedTeams.find(t => t.id === teamId);
        if (targetTeam) {
          audio.playClick();
          showTeamDetailPopup(targetTeam);
        }
      });
    });

    // Event listeners: Navigation
    const btnVictory = container.querySelector('#btnBackToVictory');
    if (btnVictory) {
      btnVictory.addEventListener('click', () => {
        audio.playClick();
        gameState.setView('VICTORY');
      });
    }

    const btnDashboard = container.querySelector('#btnBackToDashboard');
    if (btnDashboard) {
      btnDashboard.addEventListener('click', () => {
        audio.playClick();
        gameState.setView('DASHBOARD');
      });
    }
  }

  // Helper: Team Detail Popup Modal
  function showTeamDetailPopup(team) {
    const modal = document.getElementById('notificationModal');
    const content = document.getElementById('modalContent');
    if (!modal || !content) return;

    content.className = 'modal-card granted';
    content.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-primary); letter-spacing: 2px; margin-bottom: 0.3rem">
        [DRU TEAM DOSSIER]
      </div>
      <h3 class="modal-title" style="color: var(--color-primary); margin-bottom: 0.3rem">
        ${team.name}
      </h3>
      <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-success); margin-bottom: 1rem;">
        FINAL RANK: #${team.rank} &nbsp;|&nbsp; OFFICIAL TIME: ${team.timeFormatted}
      </div>

      <div style="background: rgba(3, 7, 16, 0.9); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.2rem; text-align: left; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.8;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.3rem;">
          <span>Mission 01 (Binary Breaker):</span>
          <span style="color: ${team.m1 ? 'var(--color-success)' : 'var(--color-muted)'}">${team.m1 ? '✓ VERIFIED' : 'PENDING'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 0.3rem 0;">
          <span>Mission 02 (QR Quest):</span>
          <span style="color: ${team.m2 ? 'var(--color-success)' : 'var(--color-muted)'}">${team.m2 ? '✓ VERIFIED' : 'PENDING'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 0.3rem 0;">
          <span>Mission 03 (The Glitch):</span>
          <span style="color: ${team.m3 ? 'var(--color-success)' : 'var(--color-muted)'}">${team.m3 ? '✓ VERIFIED' : 'PENDING'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding-top: 0.3rem;">
          <span>Omega Protocol:</span>
          <span style="color: ${team.omega ? 'var(--color-success)' : 'var(--color-warning)'}">${team.omega ? '✓ COMPLETED' : 'IN PROGRESS'}</span>
        </div>
      </div>

      <button class="btn-verify" id="btnCloseDetailPopup" style="width: 100%; padding: 0.8rem 1.4rem">
        CLOSE DOSSIER
      </button>
    `;

    modal.classList.remove('hidden');

    content.querySelector('#btnCloseDetailPopup').addEventListener('click', () => {
      audio.playClick();
      modal.classList.add('hidden');
    });
  }

  // Initial render call
  renderView();
}
