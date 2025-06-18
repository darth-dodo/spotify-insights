## OAuth Callback Bug Report: Duplicate Token Exchange Prevented Redirect to /dashboard

### Executive Summary
For several days, the login flow in *Spotify-Insights Dashboard* failed to forward users from the OAuth callback page to the authenticated dashboard.  Users would grant access, see the "Connecting your account…" loader, and then be dropped back on the public landing page.  Manual navigation to `/dashboard` revealed that tokens *were* stored—strongly indicating a logic error, not an OAuth configuration issue.

Root cause analysis showed a **duplicate invocation** of `spotifyAuth.handleCallback(code, state)` inside `src/components/auth/CallbackPage.tsx`.  The first invocation correctly exchanged the authorization code for tokens and persisted them.  The second invocation—executed milliseconds later with the same `state`—produced Spotify's `invalid_grant` error.  Our error handler interpreted this as an authentication failure and redirected the browser to `/`, masking the otherwise successful login.

Removing the redundant call fully restored the intended behaviour: after token exchange the app now waits 200 ms and redirects to `/dashboard`, where `AuthGuard` detects the valid session and renders the dashboard.

---

### Background & Context
* Timeline: Bug first noted **YYYY-MM-DD** (see commit `abc1234`).  Multiple routing and auth-guard refactors attempted over the following days.
* Environment: React 18 + React-Router 6, Spotify OAuth PKCE, local dev served via Vite.
* Feature flags: Dummy-data sandbox available at `/sandbox`; real auth should land on `/dashboard`.

### Symptoms
1. "Connect Spotify Account" opens Spotify consent screen normally.
2. After approval, user lands on `/callback` (loader).
3. Instead of reaching `/dashboard`, the browser is redirected back to `/`.
4. Console shows Spotify Web-Playback 403 "Invalid token scopes" *and* network 400 `invalid_grant` response on the second call.
5. Manually visiting `/dashboard` shows authenticated dashboard—token clearly valid.

### Root Cause Analysis
| Step | Observation | Inference |
|------|-------------|-----------|
| Review of `CallbackPage.tsx` | Function `handleCallback` called **twice** back-to-back | Second call replays the `state`; Spotify rejects with `invalid_grant` |
| Network tab | Two `POST https://accounts.spotify.com/api/token` calls | Confirms double exchange |
| Auth storage | `spotify_access_token` persisted before redirect to `/` | Token exchange succeeded on first call |
| Redirect logic | Error branch triggered on second failure ⇒ `navigate('/')` | Explains landing page bounce |

### Resolution
Deleted the second call:
```diff
- await spotifyAuth.handleCallback(code, state);
- // Exchange code for tokens (duplicate)
- await spotifyAuth.handleCallback(code, state);
+ await spotifyAuth.handleCallback(code, state); // once is enough
```
Commit: `fix: remove duplicate token exchange in CallbackPage (#XYZ)`.

### Commit History Highlights
* `feat/routing-split` – Introduced distinct routes `/`, `/dashboard`, `/sandbox`.
* `fix/login-redirect-logic` – Added forward to `/dashboard` after callback.
* `fix: remove duplicate token exchange` – **Final fix** (see above).

### Problem-Solving Approach & Skills Demonstrated
1. **Hypothesis-Driven Debugging** – Started with the most likely culprits (route guards, token storage) and validated/invalidated via quick experiments.
2. **Instrumentation & Logging** – Inserted temporary `console.log` markers to trace execution flow and confirm that tokens existed in `localStorage`.
3. **Isolation of Variables** – Verified that manual navigation works, proving routing logic independent of token validity.
4. **Binary-Search on Call Stack** – Commented out sections in `CallbackPage` to see which lines triggered the unwanted redirect – quickly pinpointed the duplicate call.
5. **Source-Control Archaeology** – Reviewed recent commits to understand *when* the second call was introduced (regression after merge `commit abc9876`).
6. **Root-Cause Fix over Patch-Fix** – Removed the actual defect instead of adding retries or broader error suppression.

### Preventive Measures & Next Steps
1. **Unit Test**: Add Jest test ensuring `handleCallback` is invoked exactly once during OAuth exchange.
2. **Type-safe Guards**: Refactor `CallbackPage` into smaller functions; enforce single-execution with a `hasExchanged` ref.
3. **Error Telemetry**: Send `invalid_grant` occurrences to an error-tracking service (Sentry) for faster detection.
4. **Code-Review Checklist**: Include "duplicate external API calls" guard for callback handlers.

### Subsequent UX Improvements (Post-Fix)
After the underlying auth-logic bug was resolved, we noticed a jarring UI transition: the browser briefly rendered the public landing page before the dashboard had a chance to mount.  Two small patches smoothed the experience:

1. **Hard Reload Redirect**  
   In `CallbackPage.tsx` we replaced the React-Router `navigate('/dashboard')` call with
   `window.location.replace('/dashboard')`.  A full reload remounts `AuthProvider` so it can detect freshly stored tokens.

2. **AuthGuard Loading State**  
   `AuthGuard.tsx` now detects unauthenticated access to `/dashboard` *while* authentication is still in-flight and shows the branded `LoadingScreen` instead of the public `LandingPage`.  This prevents the misleading flash and keeps visual continuity:  
   `Callback Loading Screen → Profile Loading Screen → Library Loading Screen → Dashboard`.

Together these changes deliver a seamless hand-off from OAuth to the comprehensive library fetch without exposing unauthenticated UI components.

### Auth Lifecycle Enhancement (2025-MM-DD)
To remove a perceptible "flash" and eliminate the need for a full-page reload after OAuth, we refactored authentication state management:

1. **Soft Redirect**  
   CallbackPage now uses React-Router's `navigate('/dashboard')` instead of `window.location.replace`, so the React tree is preserved.
2. **Late-Token Detection in AuthProvider**  
   `useAuthProvider` now contains an effect that watches for the appearance of a real `spotify_access_token` when no `user` is loaded.  When detected it automatically calls `fetchAndSetUser()` and flips auth state to authenticated.

This guarantees a single, continuous instance of `DataLoadingScreen` from the moment OAuth begins until the comprehensive library fetch completes—no duplicate mounts, no visual glitches.

### Planned Unified Progress Bar Loader
While the late-token fix removes duplicate loaders, the team identified a UX improvement: present \*one\* continuous progress bar for the entire startup journey — OAuth handshake, profile fetch, and large-library ingest.

Proposed implementation (tracked in separate task):
1. **LoadingContext** – global context exposing `{stage, pct}`; stages map to automatic percentage ranges (e.g. oauth 10 %, profile 30 %, library 30-100 %).
2. **Single DataLoadingScreen instance** – mounted once above `<Routes>`; subscribes to the context and updates its `Progress` value and label.
3. **Touch-points**  
   • `CallbackPage` → setStage('oauth') ➜ 10 %  
   • Profile fetch success → setStage('profile') ➜ 30 %  
   • React-Query hooks for tracks/artists/recent → increment `pct` toward 100 %.
4. Loader auto-hides when `pct === 100`.

This will eliminate all residual timing windows and deliver a seamless, single loader from sign-in to dashboard render.

---

*Report prepared by*  
Engineering Team – *Spotify-Insights Dashboard*  
Date: YYYY-MM-DD 