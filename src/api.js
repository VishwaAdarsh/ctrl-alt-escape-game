/* ==========================================================================
   CTRL + ALT + ESCAPE | Backend Integration API Service Layer (Sprint 7.0)
   Render Backend Connection + Resilient Offline Fallback Layer
   ========================================================================== */

const API_BASE_URL = 'https://ctrl-alt-escape-backend.onrender.com/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.online = true;
    this.lastPing = Date.now();
  }

  // Generic fetch wrapper with offline fallback
  async request(endpoint, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.online = true;
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      this.online = false;
      console.warn(`[API Service] Connection issue at ${endpoint}:`, error.message);
      return { success: false, reason: 'OFFLINE_FALLBACK', error: error.message };
    }
  }

  // 1. Create or Hydrate Team Session
  async createSession(teamName) {
    const res = await this.request('/session/start', {
      method: 'POST',
      body: JSON.stringify({
        teamName,
        startTime: new Date().toISOString(),
        status: 'ACTIVE'
      })
    });
    return res;
  }

  // 2. Restore Session on Page Refresh
  async restoreSession(sessionId) {
    const res = await this.request(`/session/restore/${sessionId || 'current'}`);
    return res;
  }

  // 3. Auto-Save State Every 10 Seconds
  async autoSaveState(state) {
    const res = await this.request('/session/autosave', {
      method: 'POST',
      body: JSON.stringify({
        teamName: state.teamName,
        currentMission: state.view,
        timerSeconds: state.timerSeconds,
        elapsedSeconds: state.elapsedSeconds,
        penaltySeconds: state.penaltySeconds,
        accessKeys: state.accessKeys,
        missions: state.missions,
        updatedAt: new Date().toISOString()
      })
    });
    return res;
  }

  // 4. Access Key Verification Sync
  async verifyAccessKey(keyId, code) {
    const res = await this.request('/key/verify', {
      method: 'POST',
      body: JSON.stringify({
        keyId,
        code,
        timestamp: new Date().toISOString()
      })
    });
    return res;
  }

  // 5. Master Code Backend Verification
  async verifyMasterCode(submittedCode) {
    const res = await this.request('/master-code/verify', {
      method: 'POST',
      body: JSON.stringify({
        masterCode: submittedCode,
        timestamp: new Date().toISOString()
      })
    });
    return res;
  }

  // 6. Fetch Live Leaderboard (Auto-refreshed every 15s)
  async fetchLeaderboard() {
    const res = await this.request('/leaderboard');
    return res;
  }

  // 7. Admin Login Validation
  async adminLogin(username, password) {
    const res = await this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    return res;
  }

  // 8. Admin Overview & Dashboard Stats
  async fetchAdminDashboard() {
    const res = await this.request('/admin/dashboard');
    return res;
  }

  // 9. Admin Live Activity Logs
  async fetchAdminLogs() {
    const res = await this.request('/admin/logs');
    return res;
  }

  // 10. Execute Admin Action
  async executeAdminAction(teamId, action, payload = {}) {
    const res = await this.request('/admin/team-action', {
      method: 'POST',
      body: JSON.stringify({ teamId, action, ...payload })
    });
    return res;
  }

  // Check connection state
  isConnected() {
    return this.online;
  }
}

export const api = new ApiService();
