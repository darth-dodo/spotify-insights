# 🧭 Test Plan – Phases 1, 2 & 4 Enhancements

## ➤ Pre-Requisites  
• **Spotify test account**  
• **Developer app & redirect URI** configured  
• Seed listening-history data  
• `spotify_access_token` already stored in **localStorage**

## ➤ Environment Setup  
1. `git pull` – fetch latest branch  
2. `npm install` – install dependencies  
3. `npm run dev` – open <http://localhost:5173>  
4. Verify env vars:  
   • `VITE_SPOTIFY_CLIENT_ID`  
   • `VITE_SPOTIFY_REDIRECT_URI`

## ➤ Phase 1 — Real-Time Capture  
*Start playback*  
- Console logs **"Starting enhanced monitoring"**  
- DevTools › Network shows repeating **/player** calls every ≈5 s  

*User interactions*  
- Pause · Skip · Complete a track  
- Inspect **localStorage › enhanced_spotify_sessions** – `sessionTracks` & `listeningEvents` grow  

*Persistence*  
- Reload the page – data reloads from storage  
- Badges show confidence **Medium** or **High**

## ➤ Phase 2 — Intelligent Extrapolation  
1. Open **Track Explorer** – verify realistic *Plays* & *Listening Time* (no negatives)  
2. Toggle **Time Range** & **Sort** – metrics update instantly  
3. Browser console (filter `Enhanced`) – watch algorithm logs

## ➤ Phase 4 — Data-Quality UI  
*Artist Detail Modal*  
- Badge shows ⚡ **Live** when real data available  
- Tooltip lists *Source · Confidence · Sample Size*  

*Track Explorer Stats*  
- "Plays" badge flips 📈 Estimated → ⚡ Live after real plays accumulate  

*Progressive Cards*  
- Green pulse animation when improvement > 10 %

## ➤ Automated Tests  
- **Unit** – `IntelligentDataExtrapolation.*` (Jest/Vitest)  
- **Integration** – mock Playback SDK, feed play/pause events, assert stored data

## ➤ Debugging Aids  
- **React DevTools** – inspect `DataQualityBadge` props  
- Browser **Local-Storage** viewer – check `enhanced_spotify_sessions`  
- **Network** monitor – confirm 5 s polling interval  
- Console filter **"Enhanced"** – isolate SDK/extrapolation logs 