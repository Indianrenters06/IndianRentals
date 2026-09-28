# Careers page and CMS

## Editing

Open **Admin → CMS → Careers & Applications** (`/dashboard/cms/careers`). Existing `cms` permission is required.

- **Page content:** headings, body copy, CTA labels, uploaded hero image / URL / alt text, culture cards, hiring steps, application messages, consent copy and application visibility. Cards and steps can be added, removed and reordered.
- **Jobs:** add, edit, remove and reorder roles. Set title, team, location, employment type, experience, description, requirements and application form. Jobs start as drafts. Only published jobs appear publicly; closed/deleted jobs reject new applications.
- **Application forms:** multiple forms, per-job assignment and a default for open applications. Full name, email and consent are mandatory. Custom fields support text, email, phone, URL, textarea and dropdowns with editable labels/options and required toggles. CVs use links, not file uploads. Referenced forms cannot be removed until unassigned.
- **Applications:** paginated inbox with field-label snapshots, CV links, consent time and saved review status (new / reviewing / shortlisted / closed). Form edits or job deletion do not rewrite old applications.

Page edits save together with **Save changes**. Review statuses save immediately. Closing a tab with unsaved edits warns the editor.

## API and storage

`backend/index.js` mounts `/api/careers`:

- `GET /` — public content, published roles only.
- `GET /admin`, `PUT /admin` — authenticated CMS editor with server validation.
- `POST /applications` — public, rate-limited submission with job, consent, required-field, URL and dropdown validation.
- `GET /applications?page=1`, `PATCH /applications/:id` — protected inbox and status updates.

Content is stored in the `careers` CMS document's `careersContent`. Candidate records use `CareerApplication`. Success appears only after MongoDB confirms the save. No email notification is sent. Deploy/restart the backend together with frontend/admin. Both clients need `NEXT_PUBLIC_API_URL` pointing at that backend and it needs its normal MongoDB connection.

Defaults contain **no invented live vacancies**. Canonical initial content is `backend/config/careers-defaults.json`. Matching fallback copies live in each client's `src/lib`, since apps have separate deployment roots. Tests check these remain synchronized. Previous hardcoded vacancies and unverified perks were removed.

## Design references

Uses Mona Sans, site color/spacing tokens and `.btn-primary` / `.btn-secondary`. Mobile stacks content and role actions. Tablet/desktop use a split hero and spacious job rows. A native application dialog contains focus and supports Escape dismissal. The sales-oriented sticky quote CTA is hidden on careers.

Mobbin references reviewed:

- [OpenPhone open roles](https://mobbin.com/sites/sections/3246787a-8422-4c8d-bc06-eff87cd7cdef): clear team labels and compact job lists.
- [Runway open roles](https://mobbin.com/sites/sections/9b88baff-1fc3-4850-b9e6-6bc4c0ed630b): spacious rows with aligned metadata and application actions.
- [15Five open positions](https://mobbin.com/sites/sections/f465ec93-4ff9-4b86-b939-02b00627fe3b): department hierarchy.

## Verification

- `node --test backend/tests/careers.test.js`: six passing tests for publishing, validation and defaults.
- Frontend/admin production builds passed.
- Careers editor ESLint: no errors. Storefront raw image has a Next image optimization warning (supports administrator-supplied image hosts). The existing StickyMobileCTA effect has an unrelated baseline lint error; its only change adds careers to the exclusion list.
- Isolated MongoDB integration: save/reload content, exclude draft/closed roles, reject unauthenticated admin access, reject invalid consent/dropdown values, persist applications, read inbox, change review status and reject closed-role submissions.
- Browser at 390 / 918 / 1255px: no horizontal overflow, search/reset, native dialog and real submission. Admin add/publish reflected on storefront; custom form creation and candidate review status verified.
- Project voice guardian: PASS.

The existing local port 5001 sample API remains read-only. An isolated temporary MongoDB/API was used for write tests; no production candidates or content were modified. Test data was discarded after QA.
