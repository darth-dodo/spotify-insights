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