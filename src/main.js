/* ==========================================================================
   CTRL + ALT + ESCAPE | Main Application Controller
   Optimized DOM Router: Prevents screen flickering & input resetting on timer ticks
   ========================================================================== */

import { gameState } from './state.js';
import { renderHeader } from './components/Header.js';
import { renderAdminModal } from './components/AdminModal.js';
import { renderMissionDashboard } from './screens/MissionDashboard.js';
import { renderMission1 } from './missions/Mission1_BinaryBreaker.js';
import { renderMission2 } from './missions/Mission2_QRQuest.js';
import { renderMission3 } from './missions/Mission3_TheGlitch.js';
import { renderFinalMission } from './missions/FinalMission_SystemRecovery.js';
import { renderVictoryScreen } from './screens/VictoryScreen.js';
import { renderFailureScreen } from './screens/FailureScreen.js';

class App {
  constructor() {
    this.hudHeader = document.getElementById('hudHeader');
    this.mainView = document.getElementById('mainView');
    this.adminModal = document.getElementById('adminModal');
    this.currentView = null;
    
    this.initParticles();
    this.setupAdminHotkeys();
    
    // Subscribe to state changes
    gameState.subscribe((state) => {
      this.update(state);
    });

    // Initial render
    this.update(gameState.get());
  }

  setupAdminHotkeys() {
    window.addEventListener('keydown', (e) => {
      // Admin Hotkey: Ctrl + Alt + Shift + E
      if (e.ctrlKey && e.altKey && e.shiftKey && e.key.toUpperCase() === 'E') {
        e.preventDefault();
        if (this.adminModal) {
          this.adminModal.classList.toggle('hidden');
          renderAdminModal(this.adminModal);
        }
      }
    });
  }

  initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.4 + 0.2
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  update(state) {
    // 1. Update HUD Header (Targeted text update; no flickering)
    if (this.hudHeader) {
      renderHeader(this.hudHeader);
    }

    // 2. Only re-render Main View if the view route has changed!
    if (this.currentView !== state.view) {
      this.currentView = state.view;
      this.renderMainView(state);
    }
  }

  renderMainView(state) {
    if (!this.mainView) return;
    this.mainView.innerHTML = '';

    switch (state.view) {
      case 'DASHBOARD':
        renderMissionDashboard(this.mainView);
        break;
      case 'MISSION_1':
        renderMission1(this.mainView);
        break;
      case 'MISSION_2':
        renderMission2(this.mainView);
        break;
      case 'MISSION_3':
        renderMission3(this.mainView);
        break;
      case 'FINAL_MISSION':
        renderFinalMission(this.mainView);
        break;
      case 'VICTORY':
        renderVictoryScreen(this.mainView);
        break;
      case 'FAILURE':
        renderFailureScreen(this.mainView);
        break;
      default:
        renderMissionDashboard(this.mainView);
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
