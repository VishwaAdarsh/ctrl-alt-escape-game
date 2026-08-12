/* ==========================================================================
   CTRL + ALT + ESCAPE | Global State Manager
   ========================================================================== */

import { api } from './api.js';

const STORAGE_KEY = 'GAME_ELYSIUM_STATE_V2';

const INITIAL_STATE = {
  view: 'DASHBOARD', // DASHBOARD (Layout A), MISSION_1, MISSION_2, MISSION_3, FINAL_MISSION (Layout B), VICTORY, FAILURE
  teamName: 'DRU-UNITY-01',
  timerSeconds: 1200, // 20 Minutes
  initialDuration: 1200,
  timerRunning: false,
  timerStarted: false, // CRITICAL: Timer starts ONLY after pressing INITIALIZE MISSION
  elapsedSeconds: 0,
  hintsUsed: 0,
  maxHints: 2,
  penaltySeconds: 0,
  failedVerificationAttempts: 0,
  accessKeys: {
    key1: { code: 'ELYSIUM-ALPHA-7701', recovered: false },
    key2: { code: 'ASTRA-3194', recovered: false },
    key3: { code: 'CYBER-GAMMA-9123', recovered: false }
  },
  missions: {
    mission1: { id: 1, title: 'Binary Breaker', status: 'READY', key: 'key1' },
    mission2: { id: 2, title: 'QR Quest', status: 'LOCKED', key: 'key2' },
    mission3: { id: 3, title: 'The Glitch', status: 'LOCKED', key: 'key3' },
    finalMission: { id: 4, title: 'System Recovery', status: 'LOCKED', key: 'master' }
  }
};

class GameState {
  constructor() {
    this.state = this.loadState() || { ...INITIAL_STATE };
    this.listeners = [];
    this.timerInterval = null;

    // ALWAYS ensure the landing page on application launch is DASHBOARD
    this.state.view = 'DASHBOARD';

    // Resume timer if it was running before page refresh
    if (this.state.timerRunning && this.state.timerStarted) {
      this.startTimerInterval();
    }

    // Sprint 7.0 Requirement: 10-Second Silent Auto-Save to Backend
    setInterval(() => {
      if (this.state.timerStarted) {
        api.autoSaveState(this.state);
      }
    }, 10000);
  }

  loadState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Could not read saved state', e);
      return null;
    }
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save state', e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveState();
    this.listeners.forEach(listener => listener(this.state));
  }

  get() {
    return this.state;
  }

  setTeamName(name) {
    this.state.teamName = name.trim() || 'DRU-AGENT-01';
    this.notify();
  }

  setView(viewName) {
    const keys = this.state.accessKeys;

    // Route Protection: Enforce strict sequential progression
    if (viewName === 'MISSION_2' && !keys.key1.recovered) {
      console.warn('Navigation blocked: Mission 01 must be completed first.');
      this.state.view = 'DASHBOARD';
      this.notify();
      return;
    }

    if (viewName === 'MISSION_3' && (!keys.key1.recovered || !keys.key2.recovered)) {
      console.warn('Navigation blocked: Missions 01 & 02 must be completed first.');
      this.state.view = 'DASHBOARD';
      this.notify();
      return;
    }

    if (viewName === 'FINAL_MISSION') {
      const allKeysVerified = keys.key1.recovered && keys.key2.recovered && keys.key3.recovered;
      if (!allKeysVerified) {
        console.warn('Navigation blocked: Final Mission requires all 3 Access Keys to be verified.');
        this.state.view = 'DASHBOARD';
        this.notify();
        return;
      }
    }

    if (viewName === 'VICTORY' && this.state.missions.finalMission.status !== 'COMPLETED') {
      console.warn('Navigation blocked: Victory screen requires Final Mission completion.');
      this.state.view = 'DASHBOARD';
      this.notify();
      return;
    }

    this.state.view = viewName;
    this.notify();
  }

  // Action: Called when clicking "INITIALIZE MISSION" on Layout A
  initializeMission() {
    this.state.timerStarted = true;
    this.state.timerRunning = true;
    this.state.missions.mission1.status = 'ACTIVE';
    this.state.view = 'MISSION_1';
    this.startTimerInterval();
    this.notify();
  }

  startTimerInterval() {
    if (this.timerInterval) return;
    this.state.timerRunning = true;

    this.timerInterval = setInterval(() => {
      if (!this.state.timerRunning) return;

      if (this.state.timerSeconds > 0) {
        this.state.timerSeconds -= 1;
        this.state.elapsedSeconds += 1;

        if (this.state.timerSeconds <= 0) {
          this.state.timerSeconds = 0;
          this.state.timerRunning = false;
          this.state.view = 'FAILURE';
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }
        this.notify();
      }
    }, 1000);
  }

  pauseTimer() {
    this.state.timerRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.notify();
  }

  addTime(seconds) {
    this.state.timerSeconds = Math.max(0, this.state.timerSeconds + seconds);
    this.notify();
  }

  requestHint() {
    if (this.state.hintsUsed >= this.state.maxHints) {
      return { success: false, reason: 'MAX_HINTS_REACHED' };
    }
    this.state.hintsUsed += 1;
    this.state.penaltySeconds += 120; // 2 Minutes
    this.state.timerSeconds = Math.max(0, this.state.timerSeconds - 120);
    this.notify();
    return { 
      success: true, 
      hintsLeft: this.state.maxHints - this.state.hintsUsed,
      penaltyAdded: 120
    };
  }

  verifyAccessKey(keyId, submittedCode) {
    const keyObj = this.state.accessKeys[keyId];
    if (!keyObj) return { success: false, reason: 'INVALID_KEY_ID' };

    const cleanInput = submittedCode.trim().toUpperCase();
    const validKey3Codes = new Set([
      'GE-42LK-91', 'ELY-S1U-M42', 'GAM-E09-X17', 'SYS-K21-P8A',
      'NEO-F88-Q30', 'CYB-R40-V12', 'PRT-77X-W09', 'HEX-B19-Z04',
      'DRK-L55-T99', 'CYBER-GAMMA-9123'
    ]);

    const isMatch = keyId === 'key3' ? validKey3Codes.has(cleanInput) : cleanInput === keyObj.code;

    if (isMatch) {
      keyObj.recovered = true;
      keyObj.code = cleanInput; // Store the exact verified code
      this.state.failedVerificationAttempts = 0;

      // Update Mission Progression
      if (keyId === 'key1') {
        this.state.missions.mission1.status = 'COMPLETED';
        this.state.missions.mission2.status = 'ACTIVE';
      } else if (keyId === 'key2') {
        this.state.missions.mission2.status = 'COMPLETED';
        this.state.missions.mission3.status = 'ACTIVE';
      } else if (keyId === 'key3') {
        this.state.missions.mission3.status = 'COMPLETED';
        this.state.missions.finalMission.status = 'ACTIVE';
      }

      // Sync key verification with backend
      api.verifyAccessKey(keyId, cleanInput);
      api.autoSaveState(this.state);

      this.notify();
      return { success: true, key: keyObj.code };
    } else {
      this.state.failedVerificationAttempts += 1;
      this.state.penaltySeconds += 30;
      this.state.timerSeconds = Math.max(0, this.state.timerSeconds - 30);
      this.notify();
      return { 
        success: false, 
        reason: 'ACCESS_DENIED', 
        attempts: this.state.failedVerificationAttempts 
      };
    }
  }

  completeFinalMission() {
    this.pauseTimer();
    this.state.missions.finalMission.status = 'COMPLETED';
    this.state.view = 'VICTORY';
    this.notify();
  }

  getProgressPercentage() {
    let completed = 0;
    if (this.state.accessKeys.key1.recovered) completed++;
    if (this.state.accessKeys.key2.recovered) completed++;
    if (this.state.accessKeys.key3.recovered) completed++;
    if (this.state.missions.finalMission.status === 'COMPLETED') return 100;
    return Math.round((completed / 3) * 100);
  }

  resetAll() {
    this.pauseTimer();
    this.state = {
      ...INITIAL_STATE,
      accessKeys: {
        key1: { code: 'ELYSIUM-ALPHA-7701', recovered: false },
        key2: { code: 'ASTRA-3194', recovered: false },
        key3: { code: 'CYBER-GAMMA-9123', recovered: false }
      },
      missions: {
        mission1: { id: 1, title: 'Binary Breaker', status: 'READY', key: 'key1' },
        mission2: { id: 2, title: 'QR Quest', status: 'LOCKED', key: 'key2' },
        mission3: { id: 3, title: 'The Glitch', status: 'LOCKED', key: 'key3' },
        finalMission: { id: 4, title: 'System Recovery', status: 'LOCKED', key: 'master' }
      }
    };
    this.saveState();
    this.notify();
  }
}

export const gameState = new GameState();
