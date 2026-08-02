(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const p="GAME_ELYSIUM_STATE_V2",f={view:"DASHBOARD",teamName:"DRU-UNITY-01",timerSeconds:1500,initialDuration:1500,timerRunning:!1,timerStarted:!1,elapsedSeconds:0,hintsUsed:0,maxHints:2,penaltySeconds:0,failedVerificationAttempts:0,accessKeys:{key1:{code:"ELYSIUM-ALPHA-7701",recovered:!1},key2:{code:"RECOVERY-BETA-4096",recovered:!1},key3:{code:"CYBER-GAMMA-9123",recovered:!1}},missions:{mission1:{id:1,title:"Binary Breaker",status:"READY",key:"key1"},mission2:{id:2,title:"QR Quest",status:"LOCKED",key:"key2"},mission3:{id:3,title:"The Glitch",status:"LOCKED",key:"key3"},finalMission:{id:4,title:"System Recovery",status:"LOCKED",key:"master"}}};class M{constructor(){this.state=this.loadState()||{...f},this.listeners=[],this.timerInterval=null,this.state.timerRunning&&this.state.timerStarted&&this.startTimerInterval()}loadState(){try{const e=localStorage.getItem(p);return e?JSON.parse(e):null}catch(e){return console.warn("Could not read saved state",e),null}}saveState(){try{localStorage.setItem(p,JSON.stringify(this.state))}catch(e){console.warn("Could not save state",e)}}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(t=>t!==e)}}notify(){this.saveState(),this.listeners.forEach(e=>e(this.state))}get(){return this.state}setTeamName(e){this.state.teamName=e.trim()||"DRU-AGENT-01",this.notify()}setView(e){this.state.view=e,this.notify()}initializeMission(){this.state.timerStarted=!0,this.state.timerRunning=!0,this.state.missions.mission1.status="ACTIVE",this.state.view="MISSION_1",this.startTimerInterval(),this.notify()}startTimerInterval(){this.timerInterval||(this.state.timerRunning=!0,this.timerInterval=setInterval(()=>{this.state.timerRunning&&this.state.timerSeconds>0&&(this.state.timerSeconds-=1,this.state.elapsedSeconds+=1,this.state.timerSeconds<=0&&(this.state.timerSeconds=0,this.state.timerRunning=!1,this.state.view="FAILURE",clearInterval(this.timerInterval),this.timerInterval=null),this.notify())},1e3))}pauseTimer(){this.state.timerRunning=!1,this.timerInterval&&(clearInterval(this.timerInterval),this.timerInterval=null),this.notify()}addTime(e){this.state.timerSeconds=Math.max(0,this.state.timerSeconds+e),this.notify()}requestHint(){return this.state.hintsUsed>=this.state.maxHints?{success:!1,reason:"MAX_HINTS_REACHED"}:(this.state.hintsUsed+=1,this.state.penaltySeconds+=120,this.state.timerSeconds=Math.max(0,this.state.timerSeconds-120),this.notify(),{success:!0,hintsLeft:this.state.maxHints-this.state.hintsUsed,penaltyAdded:120})}verifyAccessKey(e,t){const a=this.state.accessKeys[e];return a?t.trim().toUpperCase()===a.code?(a.recovered=!0,this.state.failedVerificationAttempts=0,e==="key1"?(this.state.missions.mission1.status="COMPLETED",this.state.missions.mission2.status="ACTIVE"):e==="key2"?(this.state.missions.mission2.status="COMPLETED",this.state.missions.mission3.status="ACTIVE"):e==="key3"&&(this.state.missions.mission3.status="COMPLETED",this.state.missions.finalMission.status="ACTIVE"),this.notify(),{success:!0,key:a.code}):(this.state.failedVerificationAttempts+=1,this.state.penaltySeconds+=30,this.state.timerSeconds=Math.max(0,this.state.timerSeconds-30),this.notify(),{success:!1,reason:"ACCESS_DENIED",attempts:this.state.failedVerificationAttempts}):{success:!1,reason:"INVALID_KEY_ID"}}completeFinalMission(){this.pauseTimer(),this.state.missions.finalMission.status="COMPLETED",this.state.view="VICTORY",this.notify()}getProgressPercentage(){let e=0;return this.state.accessKeys.key1.recovered&&e++,this.state.accessKeys.key2.recovered&&e++,this.state.accessKeys.key3.recovered&&e++,this.state.missions.finalMission.status==="COMPLETED"?100:Math.round(e/3*100)}resetAll(){this.pauseTimer(),this.state={...f,accessKeys:{key1:{code:"ELYSIUM-ALPHA-7701",recovered:!1},key2:{code:"RECOVERY-BETA-4096",recovered:!1},key3:{code:"CYBER-GAMMA-9123",recovered:!1}},missions:{mission1:{id:1,title:"Binary Breaker",status:"READY",key:"key1"},mission2:{id:2,title:"QR Quest",status:"LOCKED",key:"key2"},mission3:{id:3,title:"The Glitch",status:"LOCKED",key:"key3"},finalMission:{id:4,title:"System Recovery",status:"LOCKED",key:"master"}}},this.saveState(),this.notify()}}const l=new M;class b{constructor(){this.ctx=null,this.muted=!1}init(){if(!this.ctx){const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx=new e)}this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}toggleMute(){return this.muted=!this.muted,this.muted}isMuted(){return this.muted}playClick(){if(this.muted||(this.init(),!this.ctx))return;const e=this.ctx.createOscillator(),t=this.ctx.createGain();e.type="sine",e.frequency.setValueAtTime(800,this.ctx.currentTime),e.frequency.exponentialRampToValueAtTime(400,this.ctx.currentTime+.05),t.gain.setValueAtTime(.15,this.ctx.currentTime),t.gain.exponentialRampToValueAtTime(.01,this.ctx.currentTime+.05),e.connect(t),t.connect(this.ctx.destination),e.start(),e.stop(this.ctx.currentTime+.05)}playAccessGranted(){if(this.muted||(this.init(),!this.ctx))return;[523.25,659.25,783.99,1046.5].forEach((t,a)=>{const s=this.ctx.createOscillator(),r=this.ctx.createGain();s.type="triangle",s.frequency.setValueAtTime(t,this.ctx.currentTime+a*.08),r.gain.setValueAtTime(.2,this.ctx.currentTime+a*.08),r.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+a*.08+.25),s.connect(r),r.connect(this.ctx.destination),s.start(this.ctx.currentTime+a*.08),s.stop(this.ctx.currentTime+a*.08+.25)})}playAccessDenied(){if(this.muted||(this.init(),!this.ctx))return;const e=this.ctx.createOscillator(),t=this.ctx.createOscillator(),a=this.ctx.createGain();e.type="sawtooth",t.type="sawtooth",e.frequency.setValueAtTime(150,this.ctx.currentTime),t.frequency.setValueAtTime(156,this.ctx.currentTime),a.gain.setValueAtTime(.25,this.ctx.currentTime),a.gain.exponentialRampToValueAtTime(.01,this.ctx.currentTime+.35),e.connect(a),t.connect(a),a.connect(this.ctx.destination),e.start(),t.start(),e.stop(this.ctx.currentTime+.35),t.stop(this.ctx.currentTime+.35)}playTimerTick(){if(this.muted||(this.init(),!this.ctx))return;const e=this.ctx.createOscillator(),t=this.ctx.createGain();e.type="square",e.frequency.setValueAtTime(1200,this.ctx.currentTime),t.gain.setValueAtTime(.05,this.ctx.currentTime),t.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.03),e.connect(t),t.connect(this.ctx.destination),e.start(),e.stop(this.ctx.currentTime+.03)}playGlitch(){if(this.muted||(this.init(),!this.ctx))return;const e=this.ctx.sampleRate*.1,t=this.ctx.createBuffer(1,e,this.ctx.sampleRate),a=t.getChannelData(0);for(let o=0;o<e;o++)a[o]=Math.random()*2-1;const s=this.ctx.createBufferSource();s.buffer=t;const r=this.ctx.createBiquadFilter();r.type="bandpass",r.frequency.setValueAtTime(2e3,this.ctx.currentTime),r.Q.setValueAtTime(3,this.ctx.currentTime);const n=this.ctx.createGain();n.gain.setValueAtTime(.15,this.ctx.currentTime),n.gain.exponentialRampToValueAtTime(.01,this.ctx.currentTime+.1),s.connect(r),r.connect(n),n.connect(this.ctx.destination),s.start()}playVictory(){if(this.muted||(this.init(),!this.ctx))return;[{freq:440,time:0},{freq:554.37,time:.15},{freq:659.25,time:.3},{freq:880,time:.45},{freq:1108.73,time:.65}].forEach(t=>{const a=this.ctx.createOscillator(),s=this.ctx.createGain();a.type="sine",a.frequency.setValueAtTime(t.freq,this.ctx.currentTime+t.time),s.gain.setValueAtTime(.2,this.ctx.currentTime+t.time),s.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+t.time+.4),a.connect(s),s.connect(this.ctx.destination),a.start(this.ctx.currentTime+t.time),a.stop(this.ctx.currentTime+t.time+.4)})}}const d=new b;function T(i){var m,v;const e=l.get(),t=Math.floor(e.timerSeconds/60).toString().padStart(2,"0"),a=(e.timerSeconds%60).toString().padStart(2,"0"),s=e.timerSeconds<=300&&e.timerRunning;let r="MISSION CONSOLE";e.view==="MISSION_1"?r="MISSION 01":e.view==="MISSION_2"?r="MISSION 02":e.view==="MISSION_3"?r="MISSION 03":e.view==="FINAL_MISSION"?r="FINAL STAGE":e.view==="VICTORY"?r="SYSTEM RESTORED":e.view==="FAILURE"?r="SYSTEM SHUTDOWN":e.view==="DASHBOARD"&&(r="MISSION DASHBOARD");const n=i.querySelector(".hud-timer-clock"),o=i.querySelector(".hud-mission-badge"),c=i.querySelector(".hud-chip-value");if(n&&o&&c){n.innerText=`${t}:${a}`,n.classList.toggle("critical",s),o.innerText=r,c.innerText=e.view==="VICTORY"?"RESTORED":"ONLINE";return}i.innerHTML=`
    <!-- Top Left Brand -->
    <div class="hud-brand-group">
      <div class="hud-title-brand">
        <span>GAME ELYSIUM</span>
      </div>
      <div class="hud-divider"></div>
      <span class="hud-subtitle-tag">MISSION CONSOLE</span>
    </div>

    <!-- Top Center Mission Badge -->
    <div style="display: flex; justify-content: center">
      <div class="hud-mission-badge">
        ${r}
      </div>
    </div>

    <!-- Top Right System Status & HUD Timer -->
    <div class="hud-right-group">
      <div class="hud-status-chip">
        <span class="hud-chip-label">SYSTEM STATUS</span>
        <span class="hud-chip-value">
          ${e.view==="VICTORY"?"RESTORED":"ONLINE"}
        </span>
      </div>

      <div class="hud-timer-container">
        <span class="hud-timer-title">TIME REMAINING</span>
        <span class="hud-timer-clock ${s?"critical":""}">${t}:${a}</span>
      </div>

      <button class="hud-btn" id="btnAudioMute" title="Toggle Sound Effects">
        ${d.isMuted()?"🔇":"🔊"}
      </button>

      <button class="hud-btn" id="btnAdmin" title="Organizer Admin (Ctrl+Alt+Shift+E)">
        ⚙️
      </button>
    </div>
  `,(m=i.querySelector("#btnAudioMute"))==null||m.addEventListener("click",()=>{const h=d.toggleMute(),y=i.querySelector("#btnAudioMute");y&&(y.innerHTML=h?"🔇":"🔊")}),(v=i.querySelector("#btnAdmin"))==null||v.addEventListener("click",()=>{d.playClick();const h=document.getElementById("adminModal");h&&h.classList.remove("hidden")})}function S(i){var t,a,s,r,n,o;const e=l.get();i.innerHTML=`
    <div class="admin-card">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-amber); padding-bottom: 0.5rem">
        <h3 style="font-family: var(--font-header); color: var(--color-amber)">⚙️ ORGANIZER CONTROL PANEL</h3>
        <button id="btnCloseAdmin" style="background: none; border: none; color: var(--color-text-dim); font-size: 1.2rem; cursor: pointer">✕</button>
      </div>

      <p style="font-size: 0.85rem; color: var(--color-text-dim)">
        Authorized access for Game Master / Event Controllers only.
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem">
        <button class="hud-btn" id="adminAdd5">➕ Add 5 Mins</button>
        <button class="hud-btn warning" id="adminSub5">➖ Sub 5 Mins</button>
        <button class="hud-btn" id="adminToggleTimer">
          ${e.timerRunning?"⏸️ Pause Timer":"▶️ Resume Timer"}
        </button>
        <button class="hud-btn" id="adminUnlockAll">🔓 Unlock All Missions</button>
      </div>

      <div style="margin-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 1rem">
        <button class="hud-btn warning" id="adminReset" style="width: 100%; justify-content: center">
          ⚠️ RESET ENTIRE GAME SESSION
        </button>
      </div>
    </div>
  `,(t=i.querySelector("#btnCloseAdmin"))==null||t.addEventListener("click",()=>{i.classList.add("hidden")}),(a=i.querySelector("#adminAdd5"))==null||a.addEventListener("click",()=>{d.playClick(),l.addTime(300)}),(s=i.querySelector("#adminSub5"))==null||s.addEventListener("click",()=>{d.playClick(),l.addTime(-300)}),(r=i.querySelector("#adminToggleTimer"))==null||r.addEventListener("click",()=>{d.playClick(),l.get().timerRunning?l.pauseTimer():l.startTimer(),S(i)}),(n=i.querySelector("#adminUnlockAll"))==null||n.addEventListener("click",()=>{d.playClick();const c=l.get();c.accessKeys.key1.recovered=!0,c.accessKeys.key2.recovered=!0,c.accessKeys.key3.recovered=!0,c.missions.mission1.status="COMPLETED",c.missions.mission2.status="COMPLETED",c.missions.mission3.status="COMPLETED",c.missions.finalMission.status="UNLOCKED",l.notify(),i.classList.add("hidden")}),(o=i.querySelector("#adminReset"))==null||o.addEventListener("click",()=>{confirm("Are you sure you want to reset all team progress, keys, and timer?")&&(d.playClick(),l.resetAll(),i.classList.add("hidden"))})}function g(i){const e=l.get();e.missions,i.innerHTML=`
    <div class="dashboard-container">
      <!-- Emergency Alert Card -->
      <div class="glass-card emergency-alert-card">
        <div class="alert-header">
          <span style="font-size: 1.3rem">🚨</span>
          <span>EMERGENCY ALERT // ELYSIUM CORE BREACH</span>
        </div>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--color-text)">
          The central operating system powering Game Elysium has suffered a catastrophic security failure. 
          Multiple security sectors have been locked. Emergency Recovery Protocols require a certified 
          Digital Recovery Unit (DRU) to initialize mission sequence and recover core access credentials.
        </p>
      </div>

      <!-- Two Column Grid -->
      <div class="dash-grid-two">
        <!-- Story Briefing Card -->
        <div class="glass-card">
          <div class="card-title-bar">
            <span>📜</span>
            <span>STORY BRIEFING</span>
          </div>
          <p style="font-size: 0.9rem; color: var(--color-muted); line-height: 1.6; margin-bottom: 1rem">
            As members of the Digital Recovery Unit, your objective is to navigate 3 sequential mission sectors, 
            solve encrypted technology challenges, recover 3 hidden Access Keys, and execute the Final Core Recovery 
            before complete system blackout.
          </p>

          <div style="background: rgba(5, 7, 13, 0.6); padding: 0.8rem; border-radius: var(--radius-sm); border: 1px solid rgba(0, 229, 255, 0.15)">
            <label style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-primary); display: block; margin-bottom: 0.4rem">
              REGISTER DRU TEAM CALLSIGN:
            </label>
            <input 
              type="text" 
              id="dashTeamInput" 
              class="cyber-input" 
              style="font-size: 1rem; padding: 0.6rem 1rem; margin-bottom: 0; text-align: left"
              value="${e.teamName}" 
              placeholder="e.g. DRU-ALPHA-07"
            />
          </div>
        </div>

        <!-- Mission Overview Card -->
        <div class="glass-card">
          <div class="card-title-bar">
            <span>📊</span>
            <span>EVENT INFORMATION</span>
          </div>
          <div class="dash-info-list">
            <div class="dash-info-item">
              <span class="dash-info-label">EVENT TITLE</span>
              <span class="dash-info-val" style="color: var(--color-primary)">TECHBIT 7.0 - GAME ELYSIUM</span>
            </div>
            <div class="dash-info-item">
              <span class="dash-info-label">ESTIMATED DURATION</span>
              <span class="dash-info-val">25 MINUTES</span>
            </div>
            <div class="dash-info-item">
              <span class="dash-info-label">TEAM CAPACITY</span>
              <span class="dash-info-val">2 - 4 MEMBERS</span>
            </div>
            <div class="dash-info-item">
              <span class="dash-info-label">AVAILABLE HINTS</span>
              <span class="dash-info-val" style="color: var(--color-warning)">2 HINTS MAX (+2m PENALTY EACH)</span>
            </div>
            <div class="dash-info-item">
              <span class="dash-info-label">WRONG KEY PENALTY</span>
              <span class="dash-info-val" style="color: var(--color-danger)">+30 SECONDS PENALTY</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mission Progress Status Card -->
      <div class="glass-card">
        <div class="card-title-bar">
          <span>🎯</span>
          <span>MISSION SEQUENCING MATRIX</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem">
          <div style="background: rgba(5, 7, 13, 0.6); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--color-primary)">
            <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-muted)">MISSION 01</div>
            <div style="font-family: var(--font-header); font-size: 0.95rem; font-weight: 700; color: var(--color-text)">BINARY BREAKER</div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-primary); margin-top: 0.4rem">STATUS: READY</div>
          </div>

          <div style="background: rgba(5, 7, 13, 0.4); padding: 1rem; border-radius: var(--radius-sm); border: 1px dashed rgba(167, 180, 194, 0.3)">
            <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-muted)">MISSION 02</div>
            <div style="font-family: var(--font-header); font-size: 0.95rem; font-weight: 700; color: var(--color-muted)">QR QUEST</div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-muted); margin-top: 0.4rem">STATUS: LOCKED</div>
          </div>

          <div style="background: rgba(5, 7, 13, 0.4); padding: 1rem; border-radius: var(--radius-sm); border: 1px dashed rgba(167, 180, 194, 0.3)">
            <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-muted)">MISSION 03</div>
            <div style="font-family: var(--font-header); font-size: 0.95rem; font-weight: 700; color: var(--color-muted)">THE GLITCH</div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-muted); margin-top: 0.4rem">STATUS: LOCKED</div>
          </div>

          <div style="background: rgba(5, 7, 13, 0.4); padding: 1rem; border-radius: var(--radius-sm); border: 1px dashed rgba(167, 180, 194, 0.3)">
            <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-muted)">FINAL STAGE</div>
            <div style="font-family: var(--font-header); font-size: 0.95rem; font-weight: 700; color: var(--color-muted)">SYSTEM RECOVERY</div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-muted); margin-top: 0.4rem">STATUS: LOCKED</div>
          </div>
        </div>
      </div>

      <!-- Bottom Initialize Mission Button -->
      <div style="margin-top: 1rem">
        <button class="btn-initialize-mission" id="btnInitializeMission">
          <span>⚡ INITIALIZE MISSION PROTOCOL ⚡</span>
        </button>
      </div>
    </div>
  `;const t=i.querySelector("#dashTeamInput");t.addEventListener("change",a=>{l.setTeamName(a.target.value)}),i.querySelector("#btnInitializeMission").addEventListener("click",()=>{d.playAccessGranted(),A(()=>{l.setTeamName(t.value),l.initializeMission()})})}function A(i){const e=document.createElement("div");e.className="boot-overlay",e.innerHTML=`
    <div class="boot-spinner"></div>
    <div>INITIALIZING ELYSIUM CORE RECOVERY...</div>
    <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-muted)">STARTING MISSION TIMER (25:00)</div>
  `,document.body.appendChild(e),setTimeout(()=>{e.remove(),i&&i()},1200)}function I(){const i=l.get(),e=l.getProgressPercentage(),t=i.accessKeys.key1,a=i.accessKeys.key2,s=i.accessKeys.key3;return`
    <div class="progress-hud glass-panel">
      <div class="progress-header">
        <span class="progress-title">GAME ELYSIUM SYSTEM RECOVERY PROGRESS</span>
        <span class="progress-value">${e}% COMPLETED</span>
      </div>

      <div class="progress-bar-track">
        <div class="progress-bar-fill" style="width: ${e}%"></div>
      </div>

      <div class="access-keys-vault">
        <div class="key-card ${t.recovered?"unlocked":""}">
          <div class="key-icon">${t.recovered?"✓":"🔒"}</div>
          <div class="key-details">
            <span class="key-name">ACCESS KEY #1 (BINARY)</span>
            <span class="key-code">${t.recovered?t.code:"••••••••••••"}</span>
          </div>
        </div>

        <div class="key-card ${a.recovered?"unlocked":""}">
          <div class="key-icon">${a.recovered?"✓":"🔒"}</div>
          <div class="key-details">
            <span class="key-name">ACCESS KEY #2 (QR QUEST)</span>
            <span class="key-code">${a.recovered?a.code:"••••••••••••"}</span>
          </div>
        </div>

        <div class="key-card ${s.recovered?"unlocked":""}">
          <div class="key-icon">${s.recovered?"✓":"🔒"}</div>
          <div class="key-details">
            <span class="key-name">ACCESS KEY #3 (THE GLITCH)</span>
            <span class="key-code">${s.recovered?s.code:"••••••••••••"}</span>
          </div>
        </div>
      </div>
    </div>
  `}function u(i,e){const t=l.get(),a=t.accessKeys[e.keyId],s=a?a.recovered:!1;i.innerHTML=`
    <div class="console-container">
      <!-- Mission Header Block -->
      <div class="mission-header-block">
        <div class="main-mission-number">${e.missionNumberLabel}</div>
        <h1 class="main-mission-title">${e.title}</h1>
        <p class="main-mission-subtitle">${e.subtitle}</p>
      </div>

      <!-- Objective Card -->
      <div class="glass-card">
        <div style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.6rem; color: var(--color-primary); font-family: var(--font-header); font-size: 1.05rem; font-weight: 700">
          <span>🎯</span>
          <span>OBJECTIVE</span>
        </div>
        <p style="font-size: 0.95rem; color: var(--color-text); line-height: 1.6">
          ${e.objectiveText}
        </p>
      </div>

      <!-- Mission Clue Card -->
      <div class="glass-card">
        <div style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.6rem; color: var(--color-primary); font-family: var(--font-header); font-size: 1.05rem; font-weight: 700">
          <span>ℹ️</span>
          <span>MISSION CLUE</span>
        </div>
        <p style="font-size: 0.95rem; color: var(--color-text); line-height: 1.6">
          ${e.clueText}
        </p>
      </div>

      <!-- MISSION MODULE (Only this section changes per mission!) -->
      <div id="missionModuleSlot" style="margin-top: 0.5rem; margin-bottom: 0.5rem">
        <!-- Injected dynamically by mission module render function -->
      </div>

      <!-- Access Key Card -->
      <div class="access-key-card">
        <h3 class="access-key-title">ENTER ACCESS KEY</h3>

        <form id="keyVerifyForm" style="width: 100%">
          <div style="position: relative; margin-bottom: 1.2rem">
            <input 
              type="text" 
              id="keyInput" 
              class="cyber-input" 
              placeholder="Enter the decoded Access Key..." 
              value="${s&&a?a.code:""}"
              ${s?"disabled":""}
              autocomplete="off"
              required
            />
          </div>

          <button type="submit" class="btn-verify" ${s?"disabled":""}>
            <span>${s?"ACCESS GRANTED ✓":"VERIFY KEY"}</span>
            <span>➔</span>
          </button>
        </form>
      </div>

      <!-- Footer: Mission Progress Bar -->
      <div id="progressTrackerSlot">
        ${I()}
      </div>
    </div>
  `;const r=i.querySelector("#missionModuleSlot");r&&typeof e.renderModule=="function"&&e.renderModule(r),i.querySelector("#keyVerifyForm").addEventListener("submit",o=>{o.preventDefault();const c=i.querySelector("#keyInput"),m=c?c.value:"";let v;if(e.keyId==="master")if(m.trim().toUpperCase()==="ELYSIUM-CORE-RESTORED"||t.accessKeys.key1.recovered&&t.accessKeys.key2.recovered&&t.accessKeys.key3.recovered){d.playVictory(),l.completeFinalMission();return}else v={success:!1,reason:"ACCESS_DENIED"};else v=l.verifyAccessKey(e.keyId,m);v.success?(d.playAccessGranted(),E("ACCESS GRANTED",`Access Key Verified Successfully!
Proceeding to Next Phase...`,"granted",()=>{e.keyId==="key1"?l.setView("MISSION_2"):e.keyId==="key2"?l.setView("MISSION_3"):e.keyId==="key3"&&l.setView("FINAL_MISSION")})):(d.playAccessDenied(),E("ACCESS DENIED",`Invalid Access Key Code.
Penalty incurred (+30 seconds).`,"denied"))})}function E(i,e,t,a){const s=document.getElementById("notificationModal"),r=document.getElementById("modalContent");!s||!r||(r.className=`modal-card ${t}`,r.innerHTML=`
    <h3 class="modal-title">${i}</h3>
    <p style="white-space: pre-line; font-size: 0.95rem; color: var(--color-text)">${e}</p>
    <button class="btn-verify" id="btnModalClose" style="margin-top: 0.5rem; padding: 0.7rem 1.4rem">PROCEED ➔</button>
  `,s.classList.remove("hidden"),r.querySelector("#btnModalClose").addEventListener("click",()=>{d.playClick(),s.classList.add("hidden"),a&&a()}))}function R(i){u(i,{missionNumberLabel:"MISSION 01",title:"BINARY BREAKER",subtitle:"INTERCEPT • DECODE • RECOVER",keyId:"key1",objectiveText:"Intercepted transmissions have been detected from an unknown source. Decode the binary transmissions and recover Access Key #1.",clueText:"Each intercepted transmission contains one fragment of the solution. Decode all transmissions carefully before entering the Access Key. Do not reveal the answer.",renderModule:e=>{e.innerHTML=`
        <div style="margin-bottom: 1rem">
          <div style="display: flex; align-items: center; gap: 0.6rem; font-family: var(--font-header); font-size: 1.05rem; font-weight: 700; color: var(--color-text); margin-bottom: 1rem">
            <span>📡</span>
            <span>INTERCEPTED TRANSMISSIONS</span>
          </div>

          <div class="transmission-grid">
            <div class="transmission-card">
              <div class="transmission-label">TRANSMISSION 1</div>
              <div class="transmission-code">
                01000101 01001100 01011001 01010011 01001001 01010101 01001101
              </div>
            </div>

            <div class="transmission-card">
              <div class="transmission-label">TRANSMISSION 2</div>
              <div class="transmission-code">
                00101101 01000001 01001100 01010000 01001008 01000001
              </div>
            </div>

            <div class="transmission-card">
              <div class="transmission-label">TRANSMISSION 3</div>
              <div class="transmission-code">
                00101101 00110111 00110111 00110000 00110001
              </div>
            </div>
          </div>
        </div>
      `,e.querySelectorAll(".transmission-card").forEach(t=>{t.addEventListener("mouseenter",()=>d.playClick())})}})}function x(i){u(i,{missionNumberLabel:"MISSION 02",title:"QR QUEST",subtitle:"SCAN • DOWNLINK • DECODE",keyId:"key2",objectiveText:"Downlink node transmissions contain an encrypted mobile QR payload. Scan using a smartphone camera or calibrate frequency sliders below to recover Access Key #2.",clueText:"Align Carrier Frequency to 4096 Hz on Signal Node 2 to demodulate raw key string.",renderModule:e=>{e.innerHTML=`
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
      `;const t=e.querySelector("#sliderFreq"),a=e.querySelector("#sliderNode"),s=e.querySelector("#freqVal"),r=e.querySelector("#nodeVal"),n=e.querySelector("#demodOutput"),o=()=>{const c=parseInt(t.value,10),m=parseInt(a.value,10);s.innerText=`${c} Hz`,r.innerText=`Node ${m}`,c===4096&&m===2?(d.playAccessGranted(),n.style.color="var(--color-success)",n.innerHTML="DEMODULATED KEY: <strong>RECOVERY-BETA-4096</strong>"):(n.style.color="var(--color-warning)",n.innerText="[ALIGN TO 4096 Hz @ NODE 2]")};t.addEventListener("input",o),a.addEventListener("input",o)}})}function O(i){let e={b1:{label:"BLOCK 0x7F01",status:"CORRUPTED",fragment:"CYBER-"},b2:{label:"BLOCK 0x8A90",status:"CORRUPTED",fragment:"GAMMA-"},b3:{label:"BLOCK 0x9123",status:"CORRUPTED",fragment:"9123"}};u(i,{missionNumberLabel:"MISSION 03",title:"THE GLITCH",subtitle:"INSPECT • PURGE • RECONSTRUCT",keyId:"key3",objectiveText:"Sector 3 core memory blocks are infected by unknown data anomalies. Purge infected memory blocks to reconstruct Access Key #3.",clueText:"Inspect memory blocks 0x7F01, 0x8A90, and 0x9123 to collect key fragments.",renderModule:t=>{t.innerHTML=`
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
      `;const a=t.querySelectorAll(".btn-purge"),s=t.querySelector("#reconstructedKey"),r=()=>{const n=e.b1.status==="PATCHED"?e.b1.fragment:"______-",o=e.b2.status==="PATCHED"?e.b2.fragment:"______-",c=e.b3.status==="PATCHED"?e.b3.fragment:"____";s.innerText=n+o+c};a.forEach(n=>{n.addEventListener("click",o=>{d.playGlitch();const c=o.target.dataset.block;e[c].status="PATCHED";const m=t.querySelector(`#cardB${c.slice(1)}`);m.style.borderColor="var(--color-success)",m.querySelector(".status-text").style.color="var(--color-success)",m.querySelector(".status-text").innerText="STATUS: PATCHED ✓",m.querySelector(".fragment-text").innerText=`FRAGMENT: ${e[c].fragment}`,o.target.disabled=!0,o.target.style.opacity="0.5",r()})})}})}function C(i){const t=l.get().accessKeys;i.innerHTML=`
    <div class="omega-container">
      <!-- Title Block -->
      <div class="omega-title-block">
        <h1 class="omega-main-title">⚠ OMEGA PROTOCOL</h1>
        <p class="omega-subtitle">EMERGENCY CORE RESTORATION</p>
      </div>

      <!-- Main Emergency Status Panel -->
      <div class="omega-status-panel">
        <div class="omega-panel-header">
          <span>⚠</span>
          <span>CRITICAL SYSTEM FAILURE</span>
        </div>
        <p style="font-size: 0.95rem; color: var(--color-text); line-height: 1.6">
          Game Elysium Core has entered catastrophic failure. Security layers are corrupted and immediate core ignition is required.
        </p>

        <div class="omega-status-grid">
          <div class="omega-status-box">
            <span class="omega-box-label">SECURITY LAYERS</span>
            <span class="omega-box-val" style="color: var(--color-danger)">BREACHED</span>
          </div>

          <div class="omega-status-box">
            <span class="omega-box-label">CORE STATUS</span>
            <span class="omega-box-val" id="omegaCoreStatus" style="color: var(--color-danger)">OFFLINE</span>
          </div>

          <div class="omega-status-box">
            <span class="omega-box-label">RECOVERY PROTOCOL</span>
            <span class="omega-box-val" style="color: var(--color-primary)">ACTIVE</span>
          </div>

          <div class="omega-status-box">
            <span class="omega-box-label">ACCESS KEYS</span>
            <span class="omega-box-val" style="color: var(--color-success)">VERIFIED</span>
          </div>
        </div>
      </div>

      <!-- Access Key Confirmation Cards -->
      <div class="omega-keys-container">
        <div class="omega-key-chip">
          <span class="omega-key-icon">✓</span>
          <div class="omega-key-details">
            <span class="omega-key-title">ACCESS KEY 01 VERIFIED</span>
            <span class="omega-key-code">${t.key1.code}</span>
          </div>
        </div>

        <div class="omega-key-chip">
          <span class="omega-key-icon">✓</span>
          <div class="omega-key-details">
            <span class="omega-key-title">ACCESS KEY 02 VERIFIED</span>
            <span class="omega-key-code">${t.key2.code}</span>
          </div>
        </div>

        <div class="omega-key-chip">
          <span class="omega-key-icon">✓</span>
          <div class="omega-key-details">
            <span class="omega-key-title">ACCESS KEY 03 VERIFIED</span>
            <span class="omega-key-code">${t.key3.code}</span>
          </div>
        </div>
      </div>

      <!-- Main Action Area: Master Authorization -->
      <div class="omega-action-card">
        <h2 class="omega-action-title">MASTER AUTHORIZATION</h2>
        <p class="omega-action-text">
          Final authentication required. Enter the Master Code to restore the Game Elysium Core.
        </p>

        <form id="omegaRestoreForm" style="width: 100%">
          <input 
            type="text" 
            id="masterCodeInput" 
            class="omega-input-field" 
            placeholder="Enter Master Code..." 
            autocomplete="off"
            required
          />

          <button type="submit" class="btn-omega-restore" id="btnRestoreSystem">
            <span>⚡ RESTORE SYSTEM ⚡</span>
          </button>
        </form>

        <div id="omegaErrorMsg" style="margin-top: 1rem; color: var(--color-danger); font-family: var(--font-mono); font-size: 0.9rem; display: none">
          ⚠ ACCESS DENIED: Master Authorization Failed. Core remains offline.
        </div>
      </div>
    </div>
  `;const a=i.querySelector("#omegaRestoreForm"),s=i.querySelector("#masterCodeInput"),r=i.querySelector("#omegaErrorMsg"),n=i.querySelector("#btnRestoreSystem");a.addEventListener("submit",o=>{o.preventDefault();const c=s.value.trim().toUpperCase();c==="ELYSIUM-CORE-RESTORED"||c==="CORE-RESTORED"||c==="ELYSIUM"||c===t.key1.code||c===t.key2.code||c===t.key3.code?(r.style.display="none",s.classList.remove("error"),n.innerText="AUTHENTICATING...",n.disabled=!0,d.playClick(),k(()=>{z(()=>{l.completeFinalMission()})})):(d.playAccessDenied(),s.classList.add("error"),r.style.display="block",setTimeout(()=>{s.classList.remove("error")},1e3))})}function k(i){const e=document.createElement("div");e.className="cinematic-overlay",e.innerHTML=`
    <div class="cinematic-terminal">
      <div style="font-family: var(--font-header); font-size: 1.1rem; color: var(--color-primary); margin-bottom: 0.5rem">
        ⚙️ ELYSIUM CORE RECOVERY SEQUENCER
      </div>
      <div id="line1" class="cinematic-line">⚡ AUTHENTICATING MASTER CODE...</div>
      <div id="line2" class="cinematic-line">🔒 VERIFYING SECURITY CREDENTIALS...</div>
      <div id="line3" class="cinematic-line">🛠️ RESTORING CORE MODULES...</div>
      <div id="line4" class="cinematic-line">🌐 INITIALIZING SYSTEM SERVICES...</div>
      <div id="line5" class="cinematic-line success" style="font-weight: 700; font-size: 1.1rem">✓ RECOVERY SUCCESSFUL</div>
    </div>
  `,document.body.appendChild(e);const t=e.querySelector("#line1"),a=e.querySelector("#line2"),s=e.querySelector("#line3"),r=e.querySelector("#line4"),n=e.querySelector("#line5");setTimeout(()=>{t.style.opacity="1",d.playClick()},300),setTimeout(()=>{a.style.opacity="1",d.playClick()},900),setTimeout(()=>{s.style.opacity="1",d.playGlitch()},1500),setTimeout(()=>{r.style.opacity="1",d.playClick()},2100),setTimeout(()=>{n.style.opacity="1",d.playAccessGranted()},2700),setTimeout(()=>{e.remove(),i&&i()},3400)}function z(i){const e=document.createElement("div");e.className="success-modal-overlay",e.innerHTML=`
    <div class="success-modal-card">
      <div class="success-icon">🏆</div>
      <h2 style="font-family: var(--font-header); font-size: 2rem; color: var(--color-success); letter-spacing: 3px">
        SYSTEM RESTORED
      </h2>
      <p style="font-size: 1rem; color: var(--color-text); line-height: 1.6">
        Congratulations Digital Recovery Unit.<br>
        You have successfully restored the Game Elysium Core.<br>
        All security layers have been recovered.<br>
        <strong>Mission Complete.</strong>
      </p>
      <button class="btn-omega-restore" id="btnViewResults" style="margin-top: 1rem">
        <span>VIEW RESULTS ➔</span>
      </button>
    </div>
  `,document.body.appendChild(e),e.querySelector("#btnViewResults").addEventListener("click",()=>{d.playClick(),e.remove(),i&&i()})}function L(i){const e=l.get(),t=Math.floor(e.elapsedSeconds/60),a=(e.elapsedSeconds%60).toString().padStart(2,"0"),s=e.elapsedSeconds+e.penaltySeconds,r=Math.floor(s/60),n=(s%60).toString().padStart(2,"0");let o="A";s<=900&&e.hintsUsed===0?o="S+":s<=1200?o="A":o="B",i.innerHTML=`
    <div class="glass-panel" style="max-width: 750px; margin: 2rem auto; text-align: center; border-color: var(--color-emerald); box-shadow: 0 0 50px var(--color-emerald-glow)">
      <div style="font-family: var(--font-mono); color: var(--color-emerald); font-size: 0.9rem; letter-spacing: 3px; margin-bottom: 0.5rem">
        SYSTEM RESTORATION COMPLETE
      </div>

      <h1 style="font-family: var(--font-header); font-size: 2.5rem; color: var(--color-emerald); text-shadow: 0 0 25px var(--color-emerald); margin-bottom: 1rem">
        GAME ELYSIUM RESTORED!
      </h1>

      <p style="font-size: 1rem; color: var(--color-text-main); margin-bottom: 2rem">
        Congratulations DRU Team <strong style="color: var(--color-cyan); font-family: var(--font-mono)">${e.teamName}</strong>! 
        All 3 Access Keys were successfully verified and the core ignition protocol was completed before system collapse.
      </p>

      <!-- Stats Summary Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 2rem">
        <div style="background: rgba(6, 9, 14, 0.8); border: 1px solid var(--color-emerald); padding: 1rem; border-radius: var(--radius-md)">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-dim)">RAW ELAPSED TIME</div>
          <div style="font-family: var(--font-header); font-size: 1.5rem; color: var(--color-cyan); margin-top: 0.3rem">
            ${t}:${a}
          </div>
        </div>

        <div style="background: rgba(6, 9, 14, 0.8); border: 1px solid var(--color-amber); padding: 1rem; border-radius: var(--radius-md)">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-dim)">PENALTY TIME</div>
          <div style="font-family: var(--font-header); font-size: 1.5rem; color: var(--color-amber); margin-top: 0.3rem">
            +${Math.floor(e.penaltySeconds/60)}m ${e.penaltySeconds%60}s
          </div>
        </div>

        <div style="background: rgba(6, 9, 14, 0.8); border: 1px solid var(--color-emerald); padding: 1rem; border-radius: var(--radius-md)">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-dim)">OFFICIAL MISSION TIME</div>
          <div style="font-family: var(--font-header); font-size: 1.5rem; color: var(--color-emerald); margin-top: 0.3rem">
            ${r}:${n}
          </div>
        </div>

        <div style="background: rgba(6, 9, 14, 0.8); border: 1px solid var(--color-cyan); padding: 1rem; border-radius: var(--radius-md)">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-dim)">PERFORMANCE GRADE</div>
          <div style="font-family: var(--font-header); font-size: 1.5rem; color: var(--color-cyan); margin-top: 0.3rem">
            ${o}
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center">
        <button class="btn-cyber-primary" id="btnRestartSession">
          PLAY AGAIN / RESTART SESSION
        </button>
      </div>
    </div>
  `,i.querySelector("#btnRestartSession").addEventListener("click",()=>{d.playClick(),l.resetAll(),l.setView("WELCOME")})}function N(i){i.innerHTML=`
    <div class="glass-panel" style="max-width: 700px; margin: 3rem auto; text-align: center; border-color: var(--color-magenta); box-shadow: 0 0 50px var(--color-magenta-glow); animation: shake 0.5s">
      <div style="font-family: var(--font-mono); color: var(--color-magenta); font-size: 0.9rem; letter-spacing: 3px; margin-bottom: 0.5rem">
        EMERGENCY PROTOCOL EXPIRED
      </div>

      <h1 style="font-family: var(--font-header); font-size: 2.8rem; color: var(--color-magenta); text-shadow: 0 0 25px var(--color-magenta); margin-bottom: 1rem">
        MISSION FAILED
      </h1>

      <div class="terminal-window" style="margin-bottom: 2rem">
        <div class="terminal-line error">SYSTEM SHUTDOWN COMPLETE</div>
        <div class="terminal-line error">GAME ELYSIUM LOST</div>
        <div class="terminal-line">[LOG] Countdown timer reached 00:00 before core synchronization.</div>
      </div>

      <button class="btn-cyber-primary" id="btnRetryMission" style="background: linear-gradient(135deg, var(--color-magenta), #e11d48); color: white">
        🔄 REINITIALIZE DRU RECOVERY PROTOCOL
      </button>
    </div>
  `,i.querySelector("#btnRetryMission").addEventListener("click",()=>{d.playClick(),l.resetAll(),l.setView("WELCOME")})}class w{constructor(){this.hudHeader=document.getElementById("hudHeader"),this.mainView=document.getElementById("mainView"),this.adminModal=document.getElementById("adminModal"),this.currentView=null,this.initParticles(),this.setupAdminHotkeys(),l.subscribe(e=>{this.update(e)}),this.update(l.get())}setupAdminHotkeys(){window.addEventListener("keydown",e=>{e.ctrlKey&&e.altKey&&e.shiftKey&&e.key.toUpperCase()==="E"&&(e.preventDefault(),this.adminModal&&(this.adminModal.classList.toggle("hidden"),S(this.adminModal)))})}initParticles(){const e=document.getElementById("particleCanvas");if(!e)return;const t=e.getContext("2d");let a=e.width=window.innerWidth,s=e.height=window.innerHeight;window.addEventListener("resize",()=>{a=e.width=window.innerWidth,s=e.height=window.innerHeight});const r=Array.from({length:40},()=>({x:Math.random()*a,y:Math.random()*s,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,size:Math.random()*2+1,alpha:Math.random()*.4+.2})),n=()=>{t.clearRect(0,0,a,s),r.forEach(o=>{o.x+=o.vx,o.y+=o.vy,o.x<0&&(o.x=a),o.x>a&&(o.x=0),o.y<0&&(o.y=s),o.y>s&&(o.y=0),t.fillStyle=`rgba(0, 229, 255, ${o.alpha})`,t.beginPath(),t.arc(o.x,o.y,o.size,0,Math.PI*2),t.fill()}),requestAnimationFrame(n)};n()}update(e){this.hudHeader&&T(this.hudHeader),this.currentView!==e.view&&(this.currentView=e.view,this.renderMainView(e))}renderMainView(e){if(this.mainView)switch(this.mainView.innerHTML="",e.view){case"DASHBOARD":g(this.mainView);break;case"MISSION_1":R(this.mainView);break;case"MISSION_2":x(this.mainView);break;case"MISSION_3":O(this.mainView);break;case"FINAL_MISSION":C(this.mainView);break;case"VICTORY":L(this.mainView);break;case"FAILURE":N(this.mainView);break;default:g(this.mainView)}}}document.addEventListener("DOMContentLoaded",()=>{new w});
