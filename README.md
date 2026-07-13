# NURSING with LOLO

NURSING with LOLO is an independent, browser-based nursing study system designed to turn dense material into short explanations, active-recall practice, and clear clinical-priority cues. It combines a structured lesson library, flashcards, original practice questions, dosage math, clinical skills, study planning, notes, progress tracking, and printable resources in one responsive React application.

The base app is free of account requirements and API keys. Learner data stays in the browser by default.

> **Educational use only:** NURSING with LOLO is not an accredited nursing program, does not provide medical advice, and does not guarantee exam results. Verify clinical information against current textbooks, instructors, the applicable nurse practice act, official references, and school or facility policy.

## Included learning system

- 30 original, full-structure nursing lessons
- 300 lesson-linked flashcards
- 250 original practice questions with rationales
- 5 mixed, 50-question practice exams
- 3 unfolding clinical-judgment case studies
- 25 dosage-calculation problems with worked steps
- 20 clinical-skills study guides
- 20 printable quick-reference sheets
- 12 PDF lesson guides and 12 PowerPoint presentations
- 5 ready-made study-plan templates
- Dashboard, progress analytics, local notes, bookmarks, search, theme settings, and study timer
- Practice modes for tutor, timed, exam, weak-topic, missed-question, random, and subject-focused study
- Multiple-choice, multiple-response, ordered-response, matching, dosage, matrix, bow-tie, highlight, and case-study question support
- Responsive layouts, keyboard access, visible focus, reduced-motion support, and print styles

All questions and public study materials were written for this project. The private uploaded archive is covered by the release `.gitignore` and is not redistributed.

## Technology

- React 19 and TypeScript 7
- Vite 8
- React Router
- Fuse.js for tolerant search
- Recharts for progress visuals
- Vitest and Testing Library
- Browser local storage for progress, notes, bookmarks, plans, and preferences
- ReportLab and pypdf for PDFs
- Codex's bundled `@oai/artifact-tool` runtime for PowerPoint regeneration and slide QA
- Netlify configuration for SPA routing, security headers, and cache policy

## Quick start

Requirements:

- Node.js 22
- npm 10 or later

From the repository root:

```bash
npm install
npm run dev
```

Vite prints the local URL, normally `http://localhost:5173`. No `.env` file, API key, database, or paid service is required.

### Production checks

```bash
npm run verify:content
npm run typecheck
npm run test:run
npm run build
npm run preview
```

The production build is written to `dist/`.

## Project structure

```text
.
|-- public/
|   |-- downloads/             Generated PDFs, PPTX files, and resource packs
|   |-- manifest.webmanifest   Installable-app metadata
|   |-- robots.txt
|   `-- sitemap.xml
|-- scripts/
|   |-- export_artifact_content.ts
|   |-- generate_pdfs.py
|   `-- generate_presentations.mjs
|-- src/
|   |-- components/            App shell, search, timer, question UI, shared UI
|   |-- content/               Typed lessons, questions, skills, sheets, plans, sources
|   |-- context/               Learner state and persistence
|   |-- lib/                   Calculation, progress, and storage logic plus tests
|   |-- pages/                 Route-level, lazy-loaded screens
|   |-- App.tsx
|   `-- styles.css
|-- CONTENT_GUIDE.md           Authoring and validation instructions
|-- PROJECT_AUDIT.md           Uploaded-archive audit and privacy decisions
|-- netlify.toml               Build, redirects, headers, and cache configuration
`-- package.json
```

The curriculum is data-first. `src/content/catalog.ts` combines the lesson collections, derives 300 flashcards and 240 standard questions from lesson content, adds 10 advanced question types, and assembles the five practice exams. This keeps the UI reusable and makes new material easier to validate.

## Content authoring

Start with [CONTENT_GUIDE.md](CONTENT_GUIDE.md). It documents every content type, required lesson sections, stable ID conventions, source-review requirements, original-question rules, and artifact mapping.

At minimum, every clinical lesson should:

1. explain the concept in plain language;
2. distinguish expected, unexpected, and urgent findings;
3. state assessment, intervention, safety, and patient-teaching priorities;
4. include original active-recall material and rationales;
5. cite an authoritative public source where appropriate;
6. carry a review date, review status, and scope note.

Run the full content tests after an edit:

```bash
npm run typecheck
npm run test:run
npm run build
```

## PDF generation

PDFs are generated from the same structured source used by the website. Install the Python dependencies once:

```bash
python -m pip install reportlab pypdf
```

Then run:

```bash
npm run generate:pdf
```

This command exports `tmp/artifact-content.json`, creates the 12 lesson guides in `public/downloads/guides/`, creates the 20 quick-reference sheets in `public/downloads/quick-sheets/`, and assembles the PDF bundles. `tmp/` is intentionally ignored because it contains regeneration and QA intermediates.

Python and its PDF packages are generation prerequisites only. The finished PDFs are already included in `public/downloads/`, so neither Python nor those packages are required to install, build, deploy, or use the website.

After generation, inspect page count, text extraction, and rendered page images before publishing. PDF output is a study aid and must retain its review date and disclaimer.

## PowerPoint generation

The 12 finished PowerPoint decks are already included in `public/downloads/presentations/` and work without any generation runtime. Regenerating them is a maintainer workflow that uses `@oai/artifact-tool` to export the decks and render slide previews for visual QA.

The supported regeneration path is the Codex workspace, where that runtime is bundled. It is intentionally not a project dependency, so `npm install` by itself does not provide PowerPoint regeneration in a normal standalone Node checkout. Inside Codex, run:

```bash
npm run generate:pptx
```

`generate:pptx` refreshes the structured artifact data automatically. The default deck output is `public/downloads/presentations/`; rendered QA images, layouts, montages, and the QA manifest go to the ignored `tmp/presentations-qa/` directory. The generator first checks for an explicitly available `@oai/artifact-tool` package and then for Codex's bundled runtime. If neither exists, it stops with a clear error and leaves the committed decks available for use.

The generator also accepts these optional path overrides for an isolated generation workspace:

- `NURSING_LOLO_ROOT`
- `NURSING_LOLO_DATA`
- `NURSING_LOLO_PPTX_OUT`
- `NURSING_LOLO_PPTX_QA`

These variables are only build-time conveniences for the slide generator. They are not application secrets and are not required by the website. Render every final deck and inspect its montage and layout data before release. The Codex presentation QA environment also provides an overflow checker; that checker is not installed as a project npm dependency.

## Tests and release checks

The automated suite covers:

- exact curriculum totals and unique IDs;
- dosage-calculation parsing, tolerance, and rounding behavior;
- progress calculations;
- browser-storage serialization and fallback behavior.

Recommended release sequence:

```bash
npm ci
npm run verify
```

`npm run verify` runs the content integrity check, all 16 unit tests, TypeScript compilation, and the Vite production build.

Then manually verify:

- every primary route and navigation target;
- search, flashcard ratings, practice modes, answer feedback, and exam completion;
- notes, bookmarks, plan changes, theme settings, and refresh persistence;
- dosage answers, unit conversion, and safety messaging;
- PDF/PPTX links and ZIP resource pack;
- keyboard navigation, visible focus, reduced motion, print view, and mobile layouts;
- browser console and failed network requests.

## Netlify deployment

`netlify.toml` is production-ready for this Vite SPA:

- build command: `npm run build`
- publish directory: `dist`
- Node version: `22`
- intended production branch: `main` (select it when connecting the repository)
- history fallback: all app routes rewrite to `/index.html`

The production site is live at [nursing-with-lolo.netlify.app](https://nursing-with-lolo.netlify.app/), deployed automatically from the GitHub `main` branch at [Tyrrellkdlemons/nursing-with-lolo](https://github.com/Tyrrellkdlemons/nursing-with-lolo). The checked-in canonical, Open Graph, robots, and sitemap metadata use that same production origin. If a custom domain is connected later, update the production origin in `index.html`, `src/components/AppShell.tsx`, `public/robots.txt`, and `public/sitemap.xml` before the next production build.

To deploy through the Netlify dashboard:

1. Push the repository to GitHub.
2. In Netlify, choose **Add new site > Import an existing project**.
3. Select the GitHub repository and the `main` branch.
4. Confirm `npm run build` and `dist`; Netlify normally reads both from `netlify.toml`.
5. Deploy, open the production URL, and refresh a nested route such as `/flashcards`.
6. Confirm the live hostname matches the SEO metadata, then verify HTTPS, downloads, browser persistence, and console status.
7. Push a harmless source change and confirm Netlify creates the next deployment from GitHub.

No environment variables are required for production. If a future server-side AI or account-sync feature is added, keep its secrets in Netlify environment variables and server-side functions; never place credentials in Vite client code or commit them to Git.

## GitHub workflow

The intended production branch is `main`.

```bash
git status
git add -A
git commit -m "Describe the release change"
git push origin main
```

Before every push, confirm that `original-upload/`, `.env*`, `tmp/`, `dist/`, `.netlify/`, and local logs are not staged. The `.gitignore` preserves `.env.example` while excluding real environment files.

Suggested release labels mirror the project changelog:

- `original-upload`
- `v1-foundation`
- `v2-learning-system`
- `v3-content-library`
- `v4-production`

## Learner data and privacy

Progress and personal study data are stored locally in the current browser profile. Clearing site storage, using another browser, or using private browsing can remove or isolate that data. The current static release has no cloud account and sends no learner notes to a project database.

The uploaded source archive contains private account and course context. It is preserved only as a local recovery copy under `original-upload/`, which is intentionally ignored by Git.

## Clinical safety and content limits

- Use the site for education, not patient-specific diagnosis or treatment.
- Follow the instructor, current clinical references, institutional policy, and legal scope for real care.
- Medication names, laboratory ranges, isolation practices, procedures, and exam plans change; verify current official guidance.
- Question rationales teach a reasoning pattern and do not replace clinical supervision.
- Clinical-skill pages are study checklists, not authorization to perform a procedure.
- The site is independent, is not affiliated with NCSBN, and does not reproduce a commercial test bank.
- Content review dates communicate when a page was checked, not a guarantee that every policy is universal.

## License and reuse

No open-source license is granted by this repository unless a separate `LICENSE` file is added by the owner. Source material, generated study resources, and brand assets remain all-rights-reserved by default. Third-party libraries retain their own licenses.
