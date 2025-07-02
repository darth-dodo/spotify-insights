# Recommended Improvements

## Strengthen Architecture & Folder Structure

Below is a practical, step-by-step plan to streamline the code-base structure and make future development more predictable and maintainable.

1. **Inventory & Categorise**
   - Audit `src/lib` and note the primary concern for every file (auth, playback, data, utils, etc.).
   - Identify duplicated or obsolete files to be deleted or merged.

2. **Create Clear Sub-Domains**
   - Introduce the following first-class folders inside `src/lib`:
     ```text
     src/lib/
       auth/
       playback/
       data/
       utils/
     ```
   - Move existing files into the appropriate sub-domain.

3. **Add Barrel Exports**
   - In each sub-domain, add an `index.ts` that re-exports the public surface area.
   - Example for `src/lib/auth/index.ts`:
     ```ts
     export * from "./spotify-auth-core";
     export * from "./spotify-auth-tokens";
     ```

4. **Configure Path Aliases**
   - Update `tsconfig.json`:
     ```jsonc
     {
       "compilerOptions": {
         // ... existing options ...
         "baseUrl": ".",
         "paths": {
           "@lib/*": ["src/lib/*"],
           "@lib/auth/*": ["src/lib/auth/*"],
           "@lib/data/*": ["src/lib/data/*"],
           "@components/*": ["src/components/*"],
           "@hooks/*": ["src/hooks/*"]
         }
       }
     }
     ```

5. **Vertical-Slice Features**
   - Restructure feature folders so that UI, hooks, and tests live together:
     ```text
     src/features/artist-explorer/
       components/
       hooks/
       tests/
       index.ts
     ```
   - Gradually migrate `src/components/dashboard/**` to the new `src/features/**` schema.

6. **Introduce Storybook**
   - Install and configure Storybook; colocate stories next to components.
   - Use it as source of truth for design system and to catch visual regressions.

7. **Automate Import Updates**
   - Run codemods (e.g., `ts-morph` or jscodeshift) to update import statements after file moves.
   - Guard with CI checks that prevent deep relative imports (‵../../../../../`‐style).

8. **Document Contribution Guidelines**
   - Update `CONTRIBUTING.md` to explain the new architecture, naming conventions, and barrel-file usage.

9. **Enforce via Tooling**
   - Add ESLint rule sets (e.g., `import/order`, `no-restricted-imports`) to forbid cross-domain leakages.
   - Integrate a structural test (like `madge` or `dep-cruise`) in CI to ensure the modular boundaries remain intact.

> Rolling out these steps incrementally—module-by-module—keeps pull-requests reviewable and lowers merge-conflict risk while steadily converging on a cleaner architecture. 

## Data-Visualisation Strategy & Chart Recommendations

This section maps **each functional area** of the application to modern, insight-rich chart types and suggests best-in-class React-friendly libraries to implement them.

| Functional Area | Insight Goal | Recommended Chart(s) | Why It Works | Suggested Library |
|-----------------|-------------|----------------------|--------------|-------------------|
| **Genre Distribution & Trends** (`GenreAnalysis`, `ListeningTrends`) | 1) Show overall genre make-up<br/>2) Surface how tastes shift over time | • **Sunburst / Treemap** for hierarchical genre share<br/>• **Stacked Area** or **Stream Graph** for temporal trends<br/>• **Radar Chart** to compare top genres across energy/danceability/etc. | • Sunburst conveys nested categories intuitively<br/>• Stream Graph focuses on change & proportionality<br/>• Radar quickly highlights multi-metric outliers | `@nivo/sunburst`, `@nivo/stream`, `recharts` (Radar) |
| **Listening Activity & Patterns** (`ListeningHeatmap`, `ListeningPatterns`) | 1) Capture when users listen most<br/>2) Show session length & distribution | • **Calendar Heatmap** (already present, use full-year view)<br/>• **Violin/Box Plot** for session duration distribution<br/>• **Circular Dendrogram** for play-sequence clustering | • Heatmap offers glanceable peaks<br/>• Violin reveals variance, medians<br/>• Dendrogram uncovers listening "journeys" | `react-calendar-heatmap`, `visx/boxplot`, `d3-hierarchy` |
| **Artist & Track Exploration** (`ArtistExplorer`, `TrackExplorer`) | 1) Correlate audio features vs popularity<br/>2) Expose related-artist networks | • **Scatter Plot** (popularity vs energy/valence)<br/>• **Parallel Coordinates** for multi-feature comparison<br/>• **Force-Directed Graph** for related-artist links | • Scatter communicates 2-D correlations clearly<br/>• Parallel coords handle high-dimensional track data<br/>• Force graphs reveal community clusters | `@visx/xychart`, `@nivo/parallel-coordinates`, `react-force-graph` |
| **Achievements & Gamification** (`AchievementProgressCard`, `Leaderboards`) | 1) Track progress toward goals<br/>2) Compare users on leaderboards | • **Bullet / Goal Charts** displaying target vs current<br/>• **Radial Progress / Donut** for percent-to-goal<br/>• **Bump Chart** for rank over time | • Bullet charts excel at goal context<br/>• Bump charts spotlight rank volatility | `echarts-for-react` (Gauge/Bullet), `@nivo/bump` |
| **Library Health** (`EnhancedLibraryHealth`) | 1) Visualise healthy vs missing metadata<br/>2) Overall integrity score | • **Stacked Bar** (complete vs missing tags)<br/>• **Waterfall** for additions/deletions over months<br/>• **Gauge** for single composite health score | • Waterfall shows net change contributors clearly | `@nivo/bar`, `recharts` (Waterfall/Gauge) |
| **Privacy & Data Quality** (`PrivacySummary`, `DataQualityPage`) | 1) Illustrate data-sharing risk<br/>2) Show test coverage of data-quality rules | • **Horizontal Stacked Bar** for risk tiers<br/>• **Radar / Spider** for coverage metrics<br/>• **Tree Map** for data category sizes | • Stacked bars compare categories immediately<br/>• Radar highlights weak spots quickly | `echarts-for-react`, `@nivo/radar` |
| **Challenges / Seasonal Events** (`SeasonalEvents`) | Showcase challenge timeline & milestones | • **Annotated Timeline / Gantt** | Easy to align events with dates & annotate top listeners | `vis-timeline` or `echarts` Timeline |

### Cross-Cutting Implementation Tips
1. **Theming:** Choose libraries that expose CSS variables or consume Tailwind classes to stay consistent with the design-system. `nivo` supports custom themes that can be driven from Tailwind config.
2. **Accessibility:** Prefer semantic SVG charts and integrate `d3-graph-controller` for keyboard navigation when possible.
3. **Responsiveness:** Wrap charts in `ResizeObserver` hooks and apply debounce to expensive re-renders.
4. **Data Virtualisation:** For large datasets (e.g., daily streams), render only the visible window using libraries like `react-window` combined with canvas-based charts (e.g., `echarts`, `visx` canvas back-ends).
5. **Animation & Interactivity:** Leverage `react-spring` or the built-in motion of `framer-motion` for smooth transitions between filters/time-ranges.
6. **Performance Monitoring:** Toggle React DevTools' Flamegraph when embedding complex graphs; memoise heavy calculations (`useMemo`, `web-worker` offloading for D3 data prep).

> **Roll-out order:** start with high-impact, low-risk charts (Stacked Area for genre trends, Gauge for health score), validate UX feedback, then graduate to more complex network/parallel-coordinates visualisations. 