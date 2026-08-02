# MISSION 03: THE GLITCH — STANDALONE INVESTIGATION WEBSITE

**CTRL + ALT + ESCAPE** | Digital Forensic Mission

## Overview
The Glitch is the 3rd mission website in the CTRL + ALT + ESCAPE series. Players must investigate a corrupted corporate landing page for **Game Elysium**, discover three hidden key fragments scattered across UI components, and reconstruct **Access Key #3** to return to the Mission Console.

---

## File Structure
```
GLITCH WEBSITE/
├── index.html       # Cyberpunk single-page markup & HUD modals
├── style.css        # Glassmorphism, neon UI tokens & glitch animations
├── script.js        # Interaction engine, dynamic fragment sets & Web Audio SFX
└── README.md        # Technical overview & documentation
```

---

## Hidden Fragment System Mechanics

1. **Fragment 1 (Signal Recovered)**
   - **Target**: Header Logo (`#navLogo`)
   - **Interaction**: Hover cursor over the logo for **2 seconds** uninterrupted.
   - **Effect**: Progress bar fills, logo flickers, and Fragment 1 is stored.

2. **Fragment 2 (Transmission Found)**
   - **Target**: Feature Card #2 (`#cardCyberSecurity` - Cyber Security)
   - **Interaction**: **Double click** the card.
   - **Effect**: Card glitches violently and Fragment 2 is stored.

3. **Fragment 3 (Data Recovered)**
   - **Target**: Footer Copyright Text (`#footerCopyright`)
   - **Interaction**: **Click 5 times** in succession.
   - **Effect**: Screen flashes red/pink overlay and Fragment 3 is stored.

---

## Access Key Reconstruction
Once all 3 fragments are stored in the floating HUD panel (bottom-right), the **RECONSTRUCT ACCESS KEY** button unlocks. Clicking it activates a 2-second cybernetic scanning assembly animation and yields the final Access Key (e.g., `GE-42LK-91`, `GAM-E09-X17`, etc.).
