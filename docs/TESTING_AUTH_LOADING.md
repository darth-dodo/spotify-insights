# Authentication & Loading Flow – Testing Brainstorm

_Last updated: 2025-06_

## Scope
Validate the end-to-end experience for:
* Authentication success / failure paths
* 30-second loading watchdog
* Sandbox behaviour
* Landing-page error messaging

## Key Components
| Component | Concerns |
|-----------|----------|
| `GlobalLoader` | Overlay visibility, timeout, redirect, localStorage side-effects |
| `AuthGuard` | Route protection, error dialog gating |
| `DashboardBootstrap` | Loader vs dashboard switch |
| `Index` | Toast display on `load_error` flag |

## Test Matrix (Playwright)

| ID | Scenario | Route | Expected outcome |
|----|----------|-------|------------------|
| PW-01 | Happy-path login | `/` → click *Connect* | Loader shows, resolves <30 s, lands `/dashboard` |
| PW-02 | Loading timeout | Intercept API, delay 35 s | After 30 s redirected to `/`, red toast appears |
| PW-03 | Sandbox instant load | `/sandbox` | No loader, demo dashboard visible <1 s |
| PW-04 | Protected route w/o token | `/dashboard` direct visit | Redirect to `/`, no auth error dialog |

## Tooling Decisions
* **Playwright** (headless Chromium) for all user-journey tests
* **MSW** (Mock Service Worker) within Playwright to stub Spotify endpoints & introduce artificial latency
* **Test IDs** via `data-testid` where role/label not sufficient

## Best-practice Notes
1. **Deterministic timers** – use `page.addInitScript` to stub `window.setTimeout` where needed or advance FakeTimers via `page.evaluate`.
2. **Network control** – leverage `route.fulfill` with `delay` for timeout scenario.
3. **Assertions** – prefer `expect(await page.locator('role=heading[name="Spotify Insights Dashboard"]')).toBeVisible()` over CSS classes.
4. **Parallel suites** – isolate long-running timeout test into its own file to keep CI fast.
5. **CI Integration** – add `npm run test:e2e` to pipeline; output HTML report. 