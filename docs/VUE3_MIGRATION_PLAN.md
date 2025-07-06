# Vue 3 Migration Plan

## 0 · Executive Summary
We will migrate the Spotify-Insights dashboard from a **React 18** front-end to **Vue 3** (Composition API) in a staged, tab-by-tab fashion while keeping production stable.  Business logic lives in framework-agnostic TypeScript modules already, enabling an incremental "strangler fig" approach.

---

## 1 · Current State Snapshot
| Layer | Tech | Notes |
|-------|------|-------|
| UI / Components | React 18, Radix-UI, Tailwind | >300 JSX files; Radix is React-only |
| State / Data | React Query, Context Providers | Cached Spotify data via custom hooks |
| Charts | Recharts, Nivo, ECharts | Some libraries React-specific |
| Routing | React Router v6 | Sidebar routes map 1-1 to dashboard tabs |
| Auth + Business Logic | `/src/lib` TS modules | Already framework-agnostic |
| Testing | Vitest + RTL, Playwright | Largely framework-agnostic e2e |

The codebase is green in CI; no active large refactors ⇒ **good freeze point**.

---

## 2 · Migration Challenges
1. **React-only dependencies** (Radix, Recharts, Nivo).
2. **Context Providers** (Auth, Theme, Loading) tightly coupled to React.
3. **Routing rewrite** (React-Router → Vue Router) must be last.
4. **Gradual coexistence**: React & Vue must share auth/session + query cache.
5. **Developer workflow**: ESLint/Prettier/Volar, Storybook, testing presets need dual-support.

---

## 3 · Guiding Principles & Best Practices
1. _Incremental_: ship vertical slices; never break production.
2. _Framework-agnostic Core_: move logic to `/src/services` (AuthService…).
3. _Composition API + `<script setup>`_: default pattern.
4. _State_: use **Pinia** for cross-component state; **@tanstack/vue-query** for server cache.
5. _UI_: adopt **Ark-UI** (accessibility-first, headless) + Tailwind.
6. _Charts_: standardise on **ECharts** (framework-agnostic) + thin Vue wrapper.
7. _Type-safety_: `vue-tsc`, strictNullChecks–ON.
8. _Auto-imports_: `unplugin-auto-import`, `unplugin-vue-components`.
9. _Testing_: Vitest + Vue Testing Library for units; keep Playwright for e2e.
10. _Linting_: `eslint-plugin-vue`, style rules aligned with existing Prettier config.

---

## 4 · Migration Strategy (Phased)
| Phase | Goal | Key Tasks | Exit Criteria |
|-------|------|----------|---------------|
| **0. Prep** (1-2 w) | Dual-framework infra |  • Extract Auth/Theme/Loading into `/src/services/*` singletons  
• Add `vue/` directory (Vite + Vue 3 + Tailwind + Pinia)  
• Configure path aliases, shared `tsconfig` base  | Services consumed via both React hooks & sample Vue component |
| **1. Interop Layer** (1 w) | React ↔ Vue boundary |  • Use `@vitejs/plugin-vue-jsx` + **Custom Elements** (`defineCustomElement`) to mount Vue inside React  
• Expose global `provideAuth()` etc.  | React tab renders a Vue custom-element successfully |
| **2. Low-risk Tabs** (2-3 w) | Library Health, Genres |  • Re-implement charts with ECharts  
• Replace Radix UI with Ark-UI equivalents  
• Wire routes via existing sidebar  | Tabs visually identical, unit & e2e tests green |
| **3. Interactive Tabs** (4-6 w) | Artists, Tracks, Listening Activity |  • Port forms/dialogs to Ark-UI  
• Move queries to Vue Query  
• Pinia stores for filters/selections  | Feature parity confirmed, performance baseline met |
| **4. Shell Flip** (2 w) | Move layout & router |  • Recreate Header, Sidebar in Vue  
• Switch to Vue Router  
• Remove React providers  | Entire UI built with Vue; only legacy React mounts remain (if any) |
| **5. Decommission** (1 w) | Purge React |  • Delete React packages & hooks  
• Replace remaining Radix/Recharts components  | `npm ls react` = empty, CI green |

Milestone deployments after each phase behind feature flag `?vue-canary`.

---

## 5 · Task Matrix (excerpt)
| ID | Component / Area | Owner | Est (d) | Blockers |
|----|------------------|-------|---------|----------|
| P0-01 | Extract AuthService | Alice | 2 | — |
| P0-02 | Create Vue workspace | Bob | 1 | — |
| P1-03 | Custom-element wrapper PoC | Carol | 2 | Browser support polyfill |
| P2-04 | `LibraryHealthGauge.vue` | Dave | 3 | ECharts theming |
| P2-05 | `GenreAnalysis.vue` | Eve | 4 | Stream graph port |
| … | … | … | … | … |

Full spreadsheet in `/docs/migration-tasks.xlsx` (to be created).

---

## 6 · Architectural Decisions
1. **Interop Method**: Custom Elements chosen over Module Federation for simpler build & SSR story.  Vue components wrapped via `vite build --customElement` and loaded as ES modules.
2. **State Strategy**: Services + Pinia stores ensure singleton instances shared across elements.
3. **Charts**: ECharts for all new visuals; React chart components gradually replaced with wrapperless ECharts options.
4. **Testing**: Maintain existing Playwright flows; introduce dual mounting helpers for React & Vue in Vitest.

---

## 7 · CI/CD Updates
- Add parallel Vue type-check job (`vue-tsc --noEmit`).
- Storybook: run both `storybook-react` and `storybook-vue` until React is removed.
- ESLint: extend config with `plugin:vue/vue3-recommended`.
- Bundle-size check moves to **vite-bundle-visualizer**.

---

## 8 · Risk & Mitigation
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Breaking auth/session between frameworks | High | Shared AuthService + integration tests |
| Design inconsistencies after Radix removal | Medium | Adopt Ark-UI + Tailwind plugin; create Figma tokens |
| Team unfamiliarity with Vue | Medium | Workshops + pair sessions; gradual rollout |
| Dual bundle size | Low | Custom-elements lazy-loaded per tab |

Rollback plan: kill-switch env var `REACT_ONLY` hides Vue custom-elements and reverts route to React tab.

---

## 9 · Acceptance Criteria
1. All unit, integration, e2e tests pass after each phase.  
2. Lighthouse scores ≥ current baseline ±5.  
3. No regression in Spotify API quota usage.  
4. Final removal of `react`, `react-dom`, `radix-ui/*`, `recharts`, `@nivo/*` from dependencies.

---

_Approved by_: **Tech Lead**, **Product Owner**, **Design**, **QA**

> Last updated: <!-- date will be auto-filled by CI release job --> 