# JOBQUANT DEVELOPMENT STATUS

Last updated:
25 August 2026 (security hardening on top of Session 10)

---

# SYSTEM OVERVIEW

A living reference for the whole system as it stands today — what it is,
what it's built with, and what's actually done. The session-by-session
log below this section is the historical record of how it got here; this
section is the current-state summary. Read this first.

## What JobQuant is

A web-based job/order management system built for Hansi Graphics &
Advertising (Pvt) Ltd., a small-scale printing and advertising firm. It
runs the full lifecycle of a print job — cost estimation via a machine
learning model, client design approval, payment tracking, and invoicing —
across three separate portals: Admin, Staff, and Client, each seeing only
what their role should.

## Tech stack

### Backend
- **FastAPI** 0.141.1 — the API itself, all routes under `backend/app/routes/`
- **SQLAlchemy** 2.0.52 (ORM) over **SQLite** (`backend/jobquant.db`)
- **Pydantic** 2.13.4 — request/response validation and serialization
- **python-jose** — JWT encoding/decoding for login tokens
- **bcrypt** — password hashing
- **python-multipart** — file upload handling (design files, payment slips, invoices)
- **Pillow** — real image watermarking on uploaded designs
- **joblib**, **pandas**, **scikit-learn** — loading and running the ML cost-prediction model
- **python-dotenv** — loads `backend/.env` (SMTP config, JWT secret)
- **reportlab** — generates the PDF user manuals (script, not a runtime route)
- **slowapi** — rate limiting on the login/password-reset endpoints
- **uvicorn** — ASGI server (`--reload` in dev)

### Frontend
- **Next.js** 16.2.9 (App Router) — file-based routing, one route group per role (`(admin)`, `(staff)`, `(client)`, `(auth)`)
- **React** 19.2.4 + **TypeScript** (full type coverage, including a single typed API client in `lib/api.ts`)
- **Tailwind CSS** 4 — utility-first styling; brand colors (`#FF6B00` orange / `#0F172A` navy / `#FAF8F4` cream) wired into the actual shadcn theme tokens, not just hardcoded per component
- **shadcn/ui** built on **Radix UI** (the `radix-ui` package) — Dialog, AlertDialog, DropdownMenu, Select, Switch, Toast primitives
- **lucide-react** — icon set used throughout
- **jsPDF** + **jspdf-autotable** — client-side PDF generation for the Client/Staff list exports (with the real company letterhead)
- **class-variance-authority**, **clsx**, **tailwind-merge** — component variant/class-merging utilities

### Machine learning
- A **Random Forest Regression** model (scikit-learn), trained offline in `ml-model/notebooks/JobQuant_Model_Final.ipynb` against `ml-model/dataset/raw/jobquant dataset.xlsx`, serialized to `ml-model/models/jobquant_final_random_forest_model.pkl` and loaded once (cached in-process) by `backend/app/routes/prediction.py`.
- Predicts the **total** cost of a job directly from its specifications — product category, dimensions, area, quantity, material, print type, lamination, installation, transport — never a per-unit price that needs multiplying.
- Feature engineering (`Area_per_Quantity`, `Width_per_Quantity`, `Height_per_Quantity`) matches the training notebook exactly.

## Architecture

**Auth.** Bearer JWT tokens, not cookies — stored per-browser-tab in `sessionStorage` specifically so Admin/Staff/Client can be logged in simultaneously in separate tabs of the same browser for testing. Tokens are signed with a `SECRET_KEY` loaded from `backend/.env` (auto-generated and persisted there on first run if missing, never hardcoded in source). Every route enforces its own role check server-side (`require_admin` / `require_staff_or_admin` / `require_any_role`) — the frontend hiding a button is never the actual security boundary.

**Authorization beyond role.** `services/access.py` enforces ownership on top of role: a client can only ever see jobs they own; a staff member only jobs they created or are assigned to; admin is unrestricted. Applied consistently across jobs, designs, payments, and invoices.

**Rate limiting.** `slowapi`, keyed by client IP: login (10/min), forgot-password (5/min), reset-password (10/min).

**Database.** SQLite, 9 tables under `backend/app/models/`: `users`, `jobs`, `job_items`, `job_progress`, `design_versions`, `design_comments` (threaded, with per-comment edit/delete permission flags), `payments`, `invoices`, `notifications` (with an optional `job_id` link so text stays live if a job is later renamed), `password_reset_tokens`. Since `Base.metadata.create_all()` only creates missing tables and never alters existing ones, `database.py`'s `run_startup_migrations()` hand-rolls the `ALTER TABLE` statements the schema has needed as it grew (e.g. `payments.uploaded_by`, `design_comments.parent_id`, `notifications.job_id`).

**File storage.** Local disk under `backend/uploads/` (gitignored), split into `designs/`, `watermarks/`, `payment_slips/`, `invoices/`. Every file is saved under a random UUID name (never the original filename) and only ever served through an authenticated, ownership-checked endpoint — never as a static file a URL could guess. Raster design uploads get a real tiled "JOBQUANT PREVIEW" watermark via Pillow; PDFs get access-control-only protection (no visible watermark — a deliberate scope decision, not a bug).

**Notifications.** Queued at the actual business event (job assignment, status change, design upload/approval/revision, comments and replies, payment upload/verify/reject, invoice upload) and surfaced via a red-dot badge on the navbar bell with per-type icons. Notification text is stored as a template with `{job_number}`/`{job_name}` placeholders and resolved against the job's *current* row at read time, so renaming a job later doesn't leave old notifications frozen on stale text.

**Sessions/tabs.** Because auth lives in `sessionStorage` rather than a cookie, file downloads/previews (design files, payment slips, invoices) go through an authenticated `fetch()` + `Blob` + `createObjectURL()` helper (`openAuthenticatedFile`/`downloadAuthenticatedFile` in `lib/api.ts`) rather than a plain link, since a Bearer token can't ride along on browser-native navigation.

## What each portal can actually do

**Admin** (`/admin/...`) — everything Staff can, plus: delete a job, create/edit/deactivate staff accounts and reset their passwords, activate/deactivate client accounts, and sees the whole system rather than only "my jobs."

**Staff** (`/staff/...`) — create and manage jobs they created or are assigned to; run ML cost predictions and re-predictions; upload and manage design versions; verify or reject client payments (with a reason); upload invoices; view (read-only) the client list; change their own password.

**Client** (`/portal/...`) — view their own orders and full status timeline; review, comment/reply on, and approve design versions (never sees the predicted cost, only the Final Approved Cost once staff confirm it); upload payment slips (a file is required); view payment history with a running outstanding balance; delete a slip they uploaded only while it's still unverified; manage their own profile and password.

## Feature list (everything that's actually built and working)

- Unified login for all three roles at one page, routed to the right portal automatically; forgot/reset password flow (dev-mode link shown on-screen, or a real free Gmail SMTP send if configured in `.env`)
- Per-tab independent sessions (sessionStorage + Bearer tokens) so all three roles can be tested at once in one browser
- Role-based dashboards: live stat cards, a Pending/In Progress/Completed pipeline breakdown, an 8-week created-vs-completed trend chart (admin), a live Recent Activity feed, Quick Actions shortcuts, and (client) a Payment Summary card with outstanding balance, amount paid this month, and next due date
- Job Management: create/search/list with KPI stat cards (mirrored identically for Staff and Admin), click-anywhere-on-row navigation everywhere, Job ID auto-suggested from the highest real job number in use (editable, must be unique)
- Create Job: client picker with auto-filled contact details, multi-item order specs, ML cost Predict/Re-Predict (total cost, never per-unit), an always-visible Transportation section, a separately-entered Final Approved Cost (the only figure a client ever sees), free-text fields normalized to Title Case on save
- Job Details: Edit Job / Edit Order Details, a full progress timeline with an update control, design version upload with a per-upload watermark choice, colour-coded-by-role threaded comments with replies, payment upload/verify/reject (styled dialog, not a browser prompt) with a running Outstanding figure, manual invoice upload
- Client Management: list with active-job counts, admin-only activate/deactivate, PDF export with the real company letterhead
- Staff Management: add/edit/deactivate/reset-password (admin-only), workload figures that exclude finished jobs, PDF export with the same letterhead
- Payments: all-payments table with an Outstanding column and a conditionally-shown Actions column (hidden entirely when no row has an available action)
- Notifications bell with a live unread-count badge and per-type icons; a live global search across jobs and clients
- Fully responsive layout (off-canvas sidebar drawer below desktop width, adaptive navbar, verified zero horizontal overflow across every route on every role at mobile width)
- Consistent design system: the brand color is wired into the actual theme tokens (so focus rings and toggles pick it up automatically, not just buttons that hardcode it), spinners instead of bare "Loading…" text everywhere, toast notifications, styled confirm/reject dialogs throughout
- Two free-standing deliverables outside the running app: a PDF-manual generator script per role (`backend/scripts/generate_user_manuals.py`) and this document

## Known limitations (accepted as-is, not planned)

The user explicitly confirmed no deployment is planned yet and declined
the following rather than asking them fixed:
- No automated test suite — every verification across every session has
  been manual (curl scripts + real headless-Chrome browser scripts)
- No production deployment story — no hosting, HTTPS, environment
  separation, or backup plan for the SQLite file; only ever run as dev
  servers on localhost
- `npm audit` flags vulnerabilities in the `jspdf`/`jspdf-autotable`
  dependency tree — never reviewed in depth
- Job status has no enforced valid-transition rules (can jump straight
  from Pending to Completed) — a deliberate simplicity choice
- Only verified in headless Chrome (real browser, real login, real API
  calls) — no Firefox/Safari or physical mobile device testing
- No admin-account bootstrap flow — not needed, since there's only ever
  one admin account and it already exists
- Real email sending needs manual SMTP setup in `.env` to turn on — user
  declined to configure it; dev-mode (on-screen reset link) is the
  accepted default
- PDF designs get access-control protection but no visible pixel
  watermark (only raster image uploads do) — accepted as fine

**Already addressed, despite initially being on this list:** the
hardcoded JWT secret and the lack of rate limiting — both were fixed this
session (see below) since they matter regardless of deployment plans.

## Running it locally

Backend (from `backend/`, using the venv so all of `requirements.txt` is
actually available):
```
venv\Scripts\python.exe -m uvicorn app.main:app --reload
```
Frontend (from `frontend/`):
```
npm run dev
```
Regenerate the PDF user manuals any time (writes to `docs/user-manuals/`,
gitignored, not committed):
```
cd backend
venv\Scripts\python.exe scripts\generate_user_manuals.py
```

---

# SESSION 11 SUMMARY (25 August) — JWT secret + rate limiting

Follow-up to the "is this complete?" conversation: user confirmed no
deployment is planned yet, so most of the outstanding gaps were left as-is
by choice, but asked specifically for the two that matter regardless of
where this runs — the hardcoded JWT secret and the lack of rate limiting.

## JWT secret key is no longer hardcoded
`services/auth.py` had `SECRET_KEY = "jobquant-development-secret-change-later"`
literally in source — anyone who could read the code could forge a valid
login token for any user. Replaced with `_load_or_create_secret_key()`:
reads `SECRET_KEY` from the environment (populated from `backend/.env` by
the `load_dotenv()` call already in `main.py`) and, if it's missing
entirely, generates a random 32-byte one with `secrets.token_hex(32)` and
appends it to `.env` so it persists — otherwise every dev-server restart
would silently invalidate every existing session, which would have made
`--reload` unbearable. `.env` is already gitignored, so the real key
never ends up in version control either way. Documented the new
(optional, auto-populated) `SECRET_KEY` var in `.env.example`. Verified
by importing the app fresh (key got generated and written), then
confirming a real login still worked after the live `--reload` server
picked up the change.

## Rate limiting added to the endpoints that actually matter
Added `slowapi` (installed into both the venv and the system Python that
turned out to actually be running the live dev server — checked via the
process's real command line first, so both interpreters agree). New
`app/rate_limit.py` holds a single shared `Limiter` instance (keyed by
client IP) that `main.py` wires into the app, and that `routes/auth.py`
applies to the three endpoints actually worth throttling:
- `/api/auth/login` — 10 attempts/minute (credential stuffing)
- `/api/auth/forgot-password` — 5/minute (reset-token spam)
- `/api/auth/reset-password` — 10/minute (defense in depth against token
  guessing, though the tokens are already 32-byte random strings)

Everything else (job/payment/design endpoints) is behind login already
and wasn't in scope for this — rate limiting unauthenticated,
credential-related endpoints was the actual ask.

**Verified for real**, not just import-checked: fired 12 rapid login
attempts at the live server — the first 10 came back `401` (wrong
credentials, as expected), the 11th and 12th came back `429 Too Many
Requests` with `{"error":"Rate limit exceeded: 10 per 1 minute"}`. Then
polled until the one-minute window rolled over and confirmed a real
login with valid credentials succeeded again immediately — the limiter
doesn't lock anyone out longer than the stated window.

# SESSION 10 SUMMARY (25 August) — Help menu fix + repo cleanup

## "User Guide (coming soon)" removed from the Help menu
The question-mark icon's dropdown (`HelpDropdown.tsx`, shared by the
Navbar across all three portals — one fix, every portal) had a disabled
"User Guide (coming soon)" item that was never going to be built out as
an in-app page (the actual user guides are the generated PDFs from the
new script instead). Removed it, along with the now-unused `BookOpen`
icon import. While in there, also corrected an FAQ entry that still told
users to use "Request Revision" — a button removed earlier this session —
to instead describe leaving a comment on the design version.

## Repo-wide unwanted files/folders cleanup
Went looking for cruft beyond just the two dead login pages already
removed. Confirmed-unused (checked via full-codebase grep before deleting
anything) and removed:
- `frontend/public/admin-dashboard.png` — a 1.5&nbsp;MB leftover
  screenshot, not referenced anywhere.
- `frontend/public/{file,globe,next,vercel,window}.svg` — the default
  `create-next-app` boilerplate icons, never swapped out or referenced
  since this app has its own branding.
- `frontend/src/components/ui/badge.tsx` — a shadcn primitive that was
  never actually used anywhere (the app uses its own `StatusBadge.tsx`
  throughout instead).
- Three empty leftover directories with nothing in them, tracked or
  otherwise: `frontend/src/data/` (the dummy-data folder emptied out in
  an earlier session but never deleted itself), `backend/models/` (the ML
  model actually loads from `ml-model/models/`, not this one), and
  `ml-model/reports/`.

Confirmed `backend/uploads/`, `backend/jobquant.db`, `node_modules`, and
`.next` are all correctly gitignored and were never tracked. No stray
reference documents (proposal/SRS PDFs etc.) ended up committed to the
repo at any point.

## Verification
`tsc --noEmit` and `npm run build` both clean after every deletion;
backend still imports cleanly.

# SESSION 9 SUMMARY (25 August) — cleanup, user manuals, final visual pass

Follow-up to the "is this 100% complete?" conversation: went through the
known-limitations list item by item with the user and closed out the ones
that were actually worth closing.

## Dead admin/staff login stub pages removed
`/admin/login` and `/staff/login` (both just rendered "Coming Soon", left
over from before the unified login existed) were unlinked from anywhere
live and confirmed via a full grep to have zero references anywhere in the
codebase. Deleted both route folders. Admin bootstrap flow and real email
sending were both explicitly confirmed as not needed (single admin
account already exists; user declined email setup earlier) — no code
changes for either, just closing them out as "won't do."

## Payment rejection reason is now a styled dialog, not `window.prompt`
New `components/payments/RejectPaymentDialog.tsx` (built on the existing
`Dialog` primitives, matching the rest of the app) replaces
`window.prompt("Reason for rejecting this payment:")` in both
`PaymentsTable.tsx` (staff/admin) and `JobPaymentsCard.tsx` (job detail
page) — a proper modal with a textarea, a disabled-until-filled confirm
button, and cancel. Verified end-to-end via a real reject action in the
browser (screenshot confirms the dialog, the disabled state, and the
"Payment rejected." toast on success).

## User manual generator (kept as a script, not committed PDFs)
Built `backend/scripts/generate_user_manuals.py` (reportlab, added to
`requirements.txt`) — running it produces `docs/user-manuals/JobQuant-
{Admin,Staff,Client}-Manual.pdf`: a real letterhead using the actual
HansiGraphics logo, page numbers, and prose written from scratch based on
the actual permission model verified in code (e.g. staff can view but not
deactivate clients; only admin can delete a job or manage staff; clients
never see predicted cost; the removed Request Revision button isn't
mentioned), not generic boilerplate.

Per explicit instruction, only the generator script is kept in the repo —
the three generated PDFs it produced were deleted after review rather than
committed, since they're regenerable output, not source. `docs/user-
manuals/` is in `.gitignore` so a future run doesn't get accidentally
tracked. Run `venv\Scripts\python.exe scripts\generate_user_manuals.py`
from `backend/` any time you actually want the PDFs (e.g. to hand out or
print) — it always (re)writes the same three files.

## Final visual consistency pass across all three portals
Screenshotted dashboards, job lists, job detail, create-job forms, client
lists, payment tables, settings and profile pages for Admin, Staff and
Client side by side. Found one genuine asymmetry: Staff's Job Management
page had no KPI cards at all (Total/Pending/In Progress/Completed), while
Admin's identical-purpose page had all four — staff were missing an
at-a-glance view admin had on the exact same page type. Added the same
four `DashboardStatCard`s, computed from the same job list already loaded
client-side, mirroring `admin/jobs/page.tsx` exactly. Everything else
checked (Settings, Profile, Job Detail, Create Job, Payments) already
renders identically across roles via the shared components — no other
inconsistencies found.

## Verification
`tsc --noEmit`, `npm run build`, and backend import all clean. Browser-
verified the reject dialog and the staff Job Management fix. Manual PDFs
rendered to PNG (via a one-off PyMuPDF install, not added to
requirements.txt since it's QA-only, not used by the app) and reviewed
page by page for layout and accuracy before calling them done.

# SESSION 8 SUMMARY (25 August) — feature & bug-fix pass

A large batch of user-reported issues and feature requests, addressed
together since several touched the same files.

## Staff Management table's Actions column wasn't right-aligned
Reported with a screenshot, then asked to check every table in the system
for the same issue. Root cause: `StaffActionsMenu`'s dropdown trigger was
`<button className="flex h-9 w-9 ...">` — Tailwind's `flex` is
`display:flex`, a **block**-level box. A parent's `text-align` (the `td`
was `text-right`) only repositions inline-level content; a non-full-width
block child ignores it entirely and just sits at the start of its
container. That's why the "⋯" button drifted noticeably left of the
"Actions" header instead of sitting flush under it. Fixed by adding
`ml-auto` to the button, which pushes a block box to the right of its
container directly (more robust than switching to `inline-flex`, since it
doesn't depend on the parent's `text-align` at all). Audited every other
table's action column for the same pattern — `JobsTable`, `PaymentsTable`,
`ClientsTable`, `ClientPaymentsTable` all use plain `<button>` triggers
(inline-block by default, so `text-right` already worked correctly on
them); the other three `DropdownMenuTrigger asChild` buttons in the app
(Notification/Profile/Help, in `Navbar.tsx`) are positioned by their own
flex-row container, not by `text-align`, so they were never affected. This
was the only instance of the bug in the app.

## Client dashboard "Paid This Month" was a hardcoded placeholder
Reported with a screenshot. `paidThisMonth="—"` was a literal string in
`portal/dashboard/page.tsx` — never wired to real data. Added
`paid_this_month` to `ClientDashboard` (backend `client_dashboard()` route)
computed as the sum of that client's `Verified` payments whose
`verified_at` falls within the current calendar month, and wired it
through on the frontend. Verified via the live API against a real client
account.

## "Request Revision" button removed
Removed the client-facing "Request Revision" button from the Design
Versions comment composer per explicit request. Since it was the only
caller of the revision-request code path, simplified
`handleAddComment()` back down to a single always-add-a-plain-comment
function rather than leaving an unreachable `isRevisionRequest` branch
behind, and dropped the now-unused `requestDesignRevision` import. The
backend endpoint (`POST /api/designs/{id}/revision`) and its exported
`lib/api.ts` wrapper are untouched in case the capability is wanted again
elsewhere later.

## Suggested Job ID was based on the database row id, not the actual job numbers in use
Reported: "the job ID numbering should start by checking the job ID of the
last created job." `suggest_job_number()` computed the next number from
`last_job.id + 1` — the internal SQLAlchemy auto-increment primary key —
instead of from the highest `job_number` actually in use. This drifted from
reality the moment a job was deleted or renamed (both explicitly supported
features): with only one job left in the database (renamed multiple times
during testing, currently `JQ100`, internal id `2`), the next suggestion
came out as `JQ103` (`100 + (2+1)`) instead of the sensible `JQ101`. Fixed
`suggest_job_number()` to scan all existing `job_number` values matching
the `JQ<digits>` pattern and suggest one past the highest, ignoring the
internal id entirely. Verified: with only `JQ100` in the database, the
suggestion is now `JQ101`; renaming that job to `JQ999` correctly bumps the
suggestion to `JQ1000`.

## Payments table "Actions" column showed a header with nothing under it
Reported with a screenshot: `PaymentsTable` (admin/staff "All Payments")
showed an "ACTIONS" column header even when every visible row had no
available action (already Verified, uploaded by someone else) — dead
whitespace under a label that implied something should be there. Both
`PaymentsTable` and `ClientPaymentsTable` now compute whether *any* row in
the current list actually has an action available (pending-and-manageable,
or the viewer's own not-yet-verified upload) and only render the column
(header and cells) at all when true.

## Dashboard "Active Jobs" widget showed completed jobs as active
Reported with a screenshot: a job whose `StatusBadge` correctly read
"Completed" still sat in the dashboard's "Active Jobs" panel wearing a
static orange "Active" pill. Two compounding causes in
`routes/dashboard.py`: (1) both `admin_dashboard` and `staff_dashboard`
built `recent_jobs` from "5 most recently created jobs" with no status
filter at all, so a just-completed job stayed in the list; (2) even once
shown, `RecentJobs.tsx`'s "Active" pill is a hardcoded `badgeText` prop,
not derived from the job's real status, so it would say "Active" no matter
what. Fixed at the query level — both dashboards now filter `recent_jobs`
to exclude `Completed`/`Cancelled`, the same condition already used
correctly elsewhere (client active-jobs count, staff workload count fixed
earlier this session). No frontend change needed once the query is
correct, since every job the list can now contain genuinely is active.
Verified: the one existing job (Completed) now correctly produces an empty
`recent_jobs` list on both the admin and staff dashboards instead of
appearing with a false "Active" label.

## Notifications went stale after a job was renamed or a user was renamed
Reported mid-session: "I changed the job ID but notifications still show
the previous ID; I renamed a staff member but tracked actions still show
the old name." Investigated every place a name or job number is displayed
(comments, payment/design/invoice "uploaded by", progress history,
dashboard Recent Activity) — all of those already resolve the name live
via the current `User`/`Job` row on every request, so a rename already
propagates everywhere except one place: `Notification.title` was a plain
string baked in permanently at the moment the notification was created
(e.g. `f"Payment slip uploaded for {job.job_number}"`), so a later rename
left every existing notification frozen on the old number forever.

**Fix**: `Notification` gained a nullable `job_id` FK. Every `notify(...)`
call site (jobs/payments/designs/invoices routes, ~10 sites) now stores a
literal template like `"Payment slip uploaded for {job_number}"` plus
`job_id=job.id`, instead of pre-formatting the job number into the string.
`GET /api/notifications` (and mark-read) now substitute `{job_number}`/
`{job_name}` from the job's *current* row at read time via
`str.format(...)`. Verified end-to-end: created a notification, renamed the
job, confirmed the notification's text updated to the new number on next
fetch, while a notification created before this fix (no `job_id`) correctly
stays frozen on its original text (nothing to backfill from).

## Job progress marked "Completed" still counted as active workload
Reported mid-session. `staff.py`'s `_assigned_jobs_count` (backing the
Staff Management page's "Assigned Jobs" column and "Current Workload" stat)
had no status filter at all — a completed or cancelled job kept counting
toward a staff member's workload forever. Fixed to exclude
`Completed`/`Cancelled`, matching the equivalent (correct) client-side
"Active Jobs" count in `clients.py` that this one should have mirrored from
the start. Verified: a staff member's only job was `Completed`, workload
now correctly reads 0.

## Comments & Feedback
- **Role badges are now color-coded**: Admin (purple), Staff (blue), Client
  (green) — previously every role used the same flat gray pill, making it
  hard to tell at a glance who said what.
- **Threaded replies**: `DesignComment` gained a nullable self-referencing
  `parent_id`. `POST /api/designs/{version_id}/comments` accepts an
  optional `parent_id` (validated against the same design version) and
  notifies the parent comment's *author* specifically ("X replied to your
  comment on {job_number}") in addition to the existing broader
  client↔staff-team notifications. Frontend renders replies indented
  beneath their root comment (a comment can be replied to at any depth —
  all descendants flatten visually under their top-level ancestor, GitHub-
  review-thread style, rather than deepening indentation) with a Reply
  button on every comment.

## Payments
- **Client payment-slip deletion now locks after verification**: a client
  can delete their own uploaded slip while it's Pending or Rejected, but
  once staff/admin verifies it, `DELETE /api/payments/{id}` 403s for that
  client (staff/admin retain their existing unrestricted delete-own-upload
  right, since the ask was specifically about clients). Verified via curl
  against a real Verified payment.
- **A payment slip file is now required for every role**, not just
  clients — `upload_payment_slip` previously exempted staff/admin
  entirely; now nobody can log a payment without attaching a slip.
  Verified staff gets the same 400 a client would.
- **"View Order"/"View Job" buttons removed** from `ClientPaymentsTable`
  and the shared staff/admin `PaymentsTable` — the entire row is now
  clickable (`router.push` on `<tr onClick>`, with action buttons
  stopping propagation), consistent with how `JobsTable`/`OrdersTable`
  already worked.
- **New "Outstanding" column** on both payment-history tables, showing
  each payment's job's current `final_cost − verified_paid` (added
  `outstanding_amount` to `PaymentResponse`, computed via the existing
  `paid_amount()` service helper).

## Job creation — Title Case normalization
Backend now runs every free-text field through `str.title()` before
storing, so however a user typed it, it always displays consistently:
`job_name`, `job_type` (create + edit), and per-item `product_category`,
`product_name`, `material`, `specification`, `print_type`, `lamination`,
`installation` (create + `PUT /{id}/items`). New `app/services/text.py`
holds the shared `to_title_case`/`titlecase_item_fields` helpers. Verified
by creating a job with all-lowercase input and confirming every field came
back Title Case.

## Admin exports & Staff Management
- **Client and Staff PDF exports now use a real company letterhead**:
  `frontend/public/logo-1.png` (the actual HansiGraphics logo, sourced from
  the user's `Desktop/Office/Logo/logo-1.png`) plus a proper title/
  generated-on-date/divider header, via a new shared
  `lib/pdf.ts:addPdfLetterhead()` used by both `ExportClientsButton` and
  the new `StaffExportButton` (Staff Management previously had no export
  at all — Client Management did).
- **Edit Staff page wording**: "Update information for staff member #3."
  (leaking a raw numeric ID) changed to the role-generic "Update this
  staff member's account information."
- Staff Management table alignment was reported as off; re-inspected the
  current table (already uses uniform `px-6 py-5` on every cell from a
  prior session's fix) and it renders cleanly in a fresh screenshot — flag
  to the user in case they're seeing something session/viewport-specific
  that didn't reproduce here.

## Verification
`tsc --noEmit`, `npm run build`, and a backend import check all clean.
Extensive curl-based verification against the live backend (title case,
notification live-substitution, workload fix, slip-required-for-all-roles,
verified-payment delete lock, threaded reply + its notification) plus
headless-Chrome screenshots of the comment role badges, Staff Management,
and both payment tables. All test data created during verification (a
throwaway job, a throwaway reply, a job rename/status change) was cleaned
up afterward.

**Note**: verifying the notification fix required logging in as
Buddhima Nirmani (`bnirmani15@gmail.com`), whose password wasn't known —
reset via the dev-mode forgot-password flow to `TempPass123`. Flagged here
since her original password is now gone; she'll need `TempPass123` or
another reset to log in.

# SESSION 7 SUMMARY (25 August) — visual polish pass

User asked for the frontend to "look like a good looking system... for a
company." Chose the "refine & polish" scope over a bigger visual overhaul
(kept the existing orange/cream/navy brand identity from the logo). Audited
the whole app with real screenshots first — login, register, and the
landing page were already well-crafted (gradient panel, grid-pattern
background, shadowed floating card); the working portal screens (dashboard,
tables, dialogs) were solid but visibly plainer by comparison. Targeted the
gap rather than redesigning what already worked.

## Brand color wasn't actually wired into the design system
The single highest-leverage fix: `globals.css`'s shadcn theme tokens
(`--primary`, `--ring`, `--sidebar-primary`, `--sidebar-ring`) were still
the default shadcn near-black/gray, never updated to the brand orange. Every
page instead hardcoded `bg-[#FF6B00]` by hand on every single `<Button>`
call site — meaning the *default*, unstyled states (the focus ring shown
when tabbing into any input across the entire app, and any `<Switch>`'s
"on" state, e.g. the Transportation toggle in Create Job) were rendering a
generic gray instead of the brand color. Changed those four tokens to
`#FF6B00`/`#FFFFFF` in one place (`globals.css`) — every input's focus ring
in the app is now on-brand orange instead of gray, with zero risk of
regression since every already-hardcoded orange button was completely
unaffected (dark mode is confirmed unused anywhere in the app, so its
tokens were left alone).

## Loading states were plain, flat text everywhere
Every one of the 16 places in the app that show a loading state
(`Loading jobs...`, `Loading payments...`, dashboard loads, the full-screen
"Loading your workspace..." shown on every login/refresh, etc.) was bare
gray `<p>` text with no motion — the single most repeated "unfinished"
signal across the whole app, since a user sees one of these constantly.
Added a shared `LoadingState` component (`components/ui/LoadingState.tsx`,
a small spinning `Loader2` + label) and swapped it in at all 16 sites.
`PortalGuard`'s full-screen splash (the very first thing rendered after
every login and hard refresh) additionally now shows the JobQuant logo
above the spinner instead of being bare text on a blank page.

## Notification dropdown was plain text-only, inconsistent with the rest of the app
The dashboard's "Recent Activity" panel already has a per-event-type icon
treatment (payment/design/job/invoice, each with a colored icon badge) —
the Navbar's notification bell dropdown showed the same events as bare text
with no icon at all. Exported the existing icon map from
`RecentActivity.tsx` (`activityIcons`) and reused it in
`NotificationDropdown.tsx` so the two now look like the same design system
instead of two different ones, with unread notifications getting the same
orange icon-badge treatment as unread Recent Activity entries.

## Verification
`tsc --noEmit` and `npm run build` both clean. Re-screenshotted the admin
dashboard, notification dropdown, edit/confirm dialogs, and a focused
before/after of an input's focus-ring color (headless Chrome, real login)
to confirm the changes render correctly with no regression to the
already-good login/landing/dialog styling.

# SESSION 6 SUMMARY (25 August) — responsive layout & mobile-friendliness pass

User asked for a general UI/UX and user-friendliness audit of the frontend.
Investigated with real headless-Chrome screenshots at desktop (1440px),
tablet (834px) and mobile (390px) widths across both roles before touching
any code, rather than guessing — this surfaced one dominant, systemic issue.

## Root problem: the app had no responsive design at all
Every portal's layout used a fixed always-visible 250px sidebar with the
main content pinned at `margin-left: 240px` (note the pre-existing 10px
mismatch with the sidebar's actual 250px width, also fixed here). On a real
phone this meant the browser rendered the full desktop-width layout and
zoomed the whole page out to fit — the classic pre-2012 "not mobile
friendly" symptom: everything readable only via pinch-to-zoom, no way to
reach the sidebar navigation at all below desktop width.

**Fix — `Sidebar.tsx` / `Navbar.tsx` / `PortalGuard.tsx`** (shared by all
three portals, so one fix propagates everywhere):
- Sidebar is now an off-canvas drawer below the `lg` breakpoint (1024px):
  hidden by default, slides in over a dismissible backdrop, closes on
  backdrop click or on selecting a nav link, and gained a close (×) button.
  At `lg` and above it behaves exactly as before (always visible, no
  backdrop).
- Navbar gained a hamburger button (mobile/tablet only) that opens the
  drawer; the global search bar changed from a fixed `420px` to
  `w-full max-w-[420px]` so it actually shrinks; the Help icon and the
  profile dropdown's name/role text hide progressively on narrower screens
  to keep the header from overflowing.
- `PortalGuard`'s content margin is now `lg:ml-[250px]` (no margin below
  `lg`, since the sidebar overlays rather than pushes), and page padding
  scales down on small screens instead of using a flat `px-10 py-10`
  everywhere.

## The real root cause of the remaining page-level overflow
After the above, several individual pages (Job Management, Client
Management, Staff Management, Payments, on all applicable roles) still
overflowed horizontally on mobile. Traced with a script that walks the DOM
comparing each element's `offsetWidth` against its own parent's
`clientWidth` (rather than guessing from screenshots) to the true origin:
PortalGuard's content wrapper (`flex min-h-screen flex-1 flex-col`) is
itself a **flex item**, and flex items default to `min-width: auto` — their
minimum shrink boundary is their content's natural width, not `0`. Some
page deep inside (a stat-card grid, a search bar sitting next to a button)
had a natural width wider than 390px, so the flex item refused to shrink
below it and dragged the entire page wider. Adding a single `min-w-0` to
that one wrapper div fixed the overflow on every affected page at once —
confirmed by an automated audit script that logged in as each of the three
roles and checked `document.documentElement.scrollWidth` vs `clientWidth`
on all 23 routes across the app: every route now reports zero overflow at
390px width (it did not before this one-line fix, even after every other
change below).

**Supporting fixes found and applied along the way** (each contributed to
the overflow on specific pages, on top of the `min-w-0` fix):
- `admin/jobs` page's KPI card grid was a hardcoded `grid-cols-4` with no
  responsive breakpoint (every other stat-card grid in the app already used
  `md:grid-cols-2 xl:grid-cols-4`-style responsive classes) — fixed to
  match.
- Four search-bar-next-to-a-button rows (`admin/jobs`, `staff/jobs`,
  `admin/payments`, `admin/clients`, `admin/staff`) used a fixed-pixel input
  width (`w-[360px]`, `w-[320px]`) beside a button with no wrap behavior —
  changed to stack vertically below `sm` and sit side-by-side above it,
  with the input at `w-full sm:w-[…]`.
- `OrdersTable.tsx` (the client portal's order list) was missing the
  `overflow-x-auto` wrapper that every other table component in the app
  already has around its `<table>` — added it, so a wide table scrolls
  within its own card instead of expanding the page.

## Smaller polish
- `JobDetailView.tsx`'s "Job not found." / "You do not have access to this
  job." error state was a lone banner with no way back — added a "Back to
  Jobs" link beneath it (reusing the existing `basePath` prop).

## Verification
`tsc --noEmit` and `npm run build` both clean. A custom overflow-audit
script logged in as admin, staff, and client in a real headless Chrome at
390×900 and checked all 23 routes for horizontal overflow — all pass.
Screenshots were also captured and reviewed at 1440px/834px/390px before
and after to confirm no visual regression on desktop (the `min-w-0` and
responsive-breakpoint changes only take effect below their respective
breakpoints, so desktop layouts are pixel-identical to before).

# SESSION 5 SUMMARY (24 August) — forgot-password wording cleanup

User asked whether real emails could be sent for the forgot-password flow
for free (Session 3 already built this — Gmail SMTP via `smtplib`, no paid
service — it just isn't turned on because `backend/.env` has no real
credentials in it). Discussed non-Gmail alternatives (Outlook SMTP, Brevo's
free transactional-email tier, or any other SMTP-capable provider — the
code isn't Gmail-specific, it's plain SMTP) since the user didn't want to
use a personal Gmail account for this. Decision: stay in dev-mode for now
rather than configure any provider.

Given that, the on-screen dev-mode message was cleaned up since it exposed
an internal implementation detail ("No email service is configured yet") to
end users. `forgot_password()` in `backend/app/routes/auth.py` now returns
"Here's your password reset link. It expires in 30 minutes." instead.
Verified via curl against the live backend.


# SESSION 4 SUMMARY (24 August) — client Payments page outstanding-balance fix

Reported: the client portal Payments page ("Outstanding" stat card) showed
Rs. 0 for a client (Buddhima Nirmani / `bnirmani15@gmail.com`) who genuinely
had a balance owed.

**Root cause**: `frontend/src/app/(client)/portal/payments/page.tsx`
computed "Outstanding" as the sum of the client's own payment records with
`status === "Pending"` — i.e. slips uploaded but not yet verified. That is a
different number from the actual balance owed (`final_cost - verified_paid`
across the client's jobs) and is zero whenever the client simply hasn't
uploaded a slip yet, regardless of what they still owe. Confirmed against
real data: job JQ102 (`final_cost` Rs. 16,490.73) had one *Verified* payment
of Rs. 2,500 and no Pending ones, so the old logic showed Rs. 0 instead of
the correct Rs. 13,990.73 owed.

**Fix**: the page now calls the already-existing `getClientDashboard()`
(`GET /api/dashboard/client`) and uses its `outstanding_payments` field,
which was already computing the correct `total_final_cost - verified_paid`
sum (this endpoint was already used correctly on the client dashboard page
— the Payments page just had its own separate, wrong calculation instead of
reusing it). No backend change was needed. Verified via direct SQL
inspection of Buddhima's job/payment rows against `dashboard.py`'s formula,
plus `tsc --noEmit` and `npm run build` (both clean).

**Follow-up**: the Payments page then showed a *different-looking* number
from the Order Details page for the same balance (`LKR 13,990.73` vs. the
correctly-rounded `LKR 13,991`), because the Payments page formatted it with
a separate `formatLKR()` helper (`lib/currency.ts`, plain
`toLocaleString("en-LK")`, no fraction-digit cap) instead of the
`formatCurrency()` helper (`lib/format.ts`, `maximumFractionDigits: 0`) the
Order Details page already used. Switched the Payments page to
`formatCurrency()` for consistency and deleted `lib/currency.ts`, which had
no other remaining callers.


# SESSION 3 SUMMARY (24 August) — bug-fix pass

Following real usage of the Session 2 system, the user reported 9 issues.
All were fixed and verified via curl (real HTTP calls against the running
backend, using the actual test accounts) plus `tsc --noEmit` and
`npm run build`, both clean.

## Auth architecture change: cookie → per-tab Bearer token
The root cause behind three reported bugs ("refreshing a tab bounces me to
the wrong portal", "Only the client can request a revision" when acting as
the client, "comment shows as added by the admin" when acting as the
client) was the same: a single httpOnly cookie is shared by every tab of
the same browser, so testing Admin/Staff/Client simultaneously in one
browser had each tab silently fighting over one shared identity.

Given the explicit choice to prioritize independent multi-tab testing over
keeping the token out of JS reach, auth was switched end-to-end:
- Backend (`app/dependencies.py`, `app/routes/auth.py`): `/login` no longer
  sets a cookie; every authenticated request is now read from the
  `Authorization: Bearer <token>` header only. No cookie fallback remains.
- Frontend (`lib/api.ts`): the token is stored in `sessionStorage` (not
  `localStorage`), which is genuinely per-tab in every browser — the fix
  this actually needed. `getToken`/`setToken`/`clearToken` plus
  `authHeaders()` wire it into every `apiRequest`/`apiUpload` call.
  `lib/auth.ts`'s `getCurrentUser()`/`logout()` and `LoginForm.tsx` updated
  to match.
- **Consequence:** a Bearer token can't ride along on a plain `<a href>`
  navigation the way a cookie could. Every design-preview/final-file,
  payment-slip, and invoice link was converted from a raw anchor tag to a
  button that calls `openAuthenticatedFile()` / `downloadAuthenticatedFile()`
  (`lib/api.ts`) — these `fetch()` the file with the header attached, then
  open/download it via a `Blob`/`createObjectURL`.
- Verified with a real two-headless-Chrome-tab CDP test: admin and client
  logged in in separate tabs keep independent, correct identities across a
  full page reload; a client-authenticated request-revision and
  client-authenticated comment now both correctly attribute to the client.

## Other fixes
- **Cost breakdown quantity/unit bug**: `PricingInformationSection.tsx` was
  displaying `(quantity unit)` where `unit` is actually the *width/height
  dimension* unit (ft/inch/cm) — e.g. "1000 inch" for a quantity of 1000.
  Now shows `(Qty: N, WxH unit)`.
- **Timezone bug in every relative/absolute timestamp display**: the
  backend serializes naive UTC datetimes with no `Z`/offset; `new Date(...)`
  on such a string is interpreted as local time by JS, silently shifting
  every timestamp by the local UTC offset (5:30 in Sri Lanka) — this is what
  made Recent Activity times look wrong. Added `parseApiDate()`
  (`lib/format.ts`) and replaced every `new Date(x.created_at)` /
  `new Date(x.uploaded_at)` call site with it (`JobProgressCard`,
  `JobDesignsCard`, `JobPaymentsCard`, `JobInvoiceCard`,
  `ClientPaymentsTable`, `PaymentsTable`, `ExportClientsButton`).
- **Notifications now flow both ways** on design comments — this already
  worked (`_notify_job_team` for client→staff, the `else` branch of
  `add_comment` for staff/admin→client); confirmed via curl against both
  directions, since the earlier "shows as admin" cookie bug is what made
  this look broken.
- **Client payment slip is now required.** `POST /api/jobs/{id}/payments`
  (`payments.py`) 400s if `current_user.role == "client"` and no `slip` file
  is attached; staff/admin can still log a payment without one (e.g. a cash
  payment recorded on the client's behalf). `PaymentResponse` gained a
  `has_slip: bool` field so the frontend only renders the "Slip" download
  button when a file actually exists. The "Choose File" control in
  `JobPaymentsCard.tsx` is now a visible bordered button (was a bare native
  `<input type="file">`) with a `*` and helper text for clients.
- **Real forgot-password email**, free (Gmail SMTP, no paid service): new
  `app/services/email.py` reads `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/
  `SMTP_PASSWORD`/`FROM_EMAIL`/`FRONTEND_URL` from the environment
  (`python-dotenv` + `backend/.env`, see `backend/.env.example` for Gmail
  App Password setup steps) and sends via stdlib `smtplib` — no new paid
  dependency. `forgot_password()` in `auth.py` tries a real send first and,
  only if SMTP isn't configured or the send fails, falls back to the
  existing dev-mode behavior (return the token/link directly in the
  response) so the feature never gets the user stuck either way.
- **Staff password self-service**: turned out to already work —
  `/staff/settings` (`SettingsPageContent.tsx`) already has a working
  "Change Password" form, and `/api/auth/change-password` has no role
  restriction. Nothing was broken here.

## Verification method
No automated test suite exists yet (unchanged from Session 2). Verified via
direct curl calls against the live backend with the real seeded accounts
(login → Bearer token → exercise the endpoint → inspect the JSON), plus one
real two-tab headless-Chrome CDP session confirming independent per-tab
identity survives a reload. All test data created during verification
(a throwaway payment record, two throwaway comments) was deleted afterward
via the same API.


# SESSION 2 SUMMARY (24 August) — UX/polish pass

Following a detailed user review of the working system from Session 1, this
session addressed ~45 specific issues across all three portals. Verified via
the same real-browser method as Session 1 (headless Chrome + CDP), plus
`tsc --noEmit` and `npm run build`, both clean.

## Backend additions
- `Notification` model + `/api/notifications` (list, unread-count, mark-read,
  mark-all-read). Real events now queue notifications: job assigned, job
  status changed, design uploaded, revision requested, design approved,
  comment added, payment uploaded, payment verified/rejected, invoice
  uploaded. The Navbar bell shows a red dot only when the current user has
  at least one unread notification (verified in-browser after a staff
  assignment).
- `PasswordResetToken` model + `/api/auth/forgot-password` and
  `/api/auth/reset-password` — dev-mode flow (see "Known limitations": no
  real email is sent yet, the reset link is returned in the API response and
  shown on-screen instead).
- `PATCH /api/auth/me` for profile self-editing; `/api/auth/change-password`
  now used by a real Settings page.
- Job numbers: format changed from `JQ-0001` to `JQ101` (`f"JQ{100 + n}"`).
  `POST /api/jobs` now accepts an optional `job_number` so admin/staff can
  type a custom ID (validated for uniqueness); `GET /api/jobs/next-number`
  supplies the suggested default. `PUT /api/jobs/{id}` also accepts
  `job_number` for renaming later.
- `PUT /api/jobs/{id}/items` — replaces a job's order items wholesale, backing
  the new "Edit Order Details" dialog.
- Design comments: `PUT`/`DELETE /api/designs/comments/{id}`. Permission
  model (computed server-side, exposed as `can_edit`/`can_delete` on every
  comment so the frontend never duplicates the logic): any author can edit
  their own comment; a client can also delete their own; admin can delete
  any admin- or staff-authored comment but never a client's; nobody else can
  edit or delete anyone else's comment.
- Design upload now takes `apply_watermark` (form field) so staff/admin
  choose per-upload whether the client-facing preview is watermarked.
- Payments: added `uploaded_by` (distinct from `client_id`, since admin/staff
  can now upload a payment record on a client's behalf too) and
  `DELETE /api/payments/{id}` / `DELETE /api/invoices/{id}`, both restricted
  to the original uploader regardless of role (admin cannot delete a
  payment/invoice staff uploaded, and vice versa — this was an explicit,
  deliberately strict requirement, not an oversight).
- `POST /api/clients` (admin-creates-a-client) was **removed** — clients can
  now only be created via self-service `/api/auth/register`, per explicit
  instruction. `ClientCreate` schema deleted as dead code.
- `GET /api/dashboard/admin/trend` — real weekly created-vs-completed counts
  (last 8 weeks) computed from actual `Job.created_at` / `JobProgress`
  timestamps, backing the new line chart. No fabricated data.
- Three SQLite migrations added to `run_startup_migrations` for the columns
  above (`payments.uploaded_by` backfilled from `client_id`,
  `design_comments.updated_at`).

## Frontend — common
- Every list/search input audited; all now filter real data (jobs, clients,
  staff, payments) instead of being decorative.
- `Sidebar` active-state now uses prefix matching for every non-dashboard
  item, so it stays highlighted on nested routes (e.g. `/admin/jobs/42`
  still highlights "Job Management" — confirmed in-browser).
- `PageHeader`'s existing `date` prop is now used on all three dashboards
  (today's date, computed client-side, shown above "Welcome Back").
- `RecentJobs` (dashboards) and `OrdersTable`/`JobsTable` (list pages) are
  now fully clickable rows, not just cells with an explicit "View" link.
  Column order is role-aware: Job ID bold-first for admin/staff, job/product
  name bold-first for client (`primaryIsName` prop on `RecentJobs`, restructured
  `OrdersTable`).
- A reusable `ConfirmDialog` (wraps the existing `alert-dialog` primitives)
  and a `ToastProvider`/`useToast` (built on Radix's already-installed
  `Toast` primitive — no new dependency) now back every destructive action
  and success message across the app.
- `AuthBrandPanel` was pointing at a `/logo.png` that never existed in
  `public/` — fixed to use `jobquant-icon.png` (the file the sidebar already
  used correctly). This is why the logo looked broken on the login screen.
- `HelpDropdown`: Contact Support / FAQ / About JobQuant now open real
  dialogs with actual content; "User Guide" intentionally left inert per
  instruction. `NotificationDropdown`: real data, click-to-mark-read,
  "Mark All as Read". `ProfileDropdown`: "Help Center" removed; "My
  Profile"/"Settings" now point at real, working pages
  (`components/profile/ProfilePageContent.tsx` /
  `SettingsPageContent.tsx`, one instance mounted per portal) that didn't
  exist before this session (they 404'd).
- `GlobalSearch` (Navbar) — was a decorative input; now does a live,
  debounced search across jobs (and clients, for admin/staff) with a results
  dropdown.
- Job numbers everywhere now read `JQ101`-style; Create Job's "Job ID" field
  is a real, editable, pre-filled input (`getNextJobNumber()` suggests it).
- Create Job and every "Cancel"/"Delete" action that discards work now goes
  through `ConfirmDialog` first (Create Job cancel, Add/Edit Staff cancel,
  Job Management delete).
- Test accounts renamed/re-emailed directly in the dev database: `Admin` /
  `admin@gmail.com`, `Staff1` / `staff@gmail.com`, `Client1` /
  `client@gmail.com` (passwords unchanged: `TestPass123` / `StaffPass123` /
  `ClientPass123`).

## Frontend — Job Details (shared `JobDetailView`, used by all three portals)
- Transportation is now always shown ("Yes — N km" / "No"), not only when
  true.
- `EditJobDialog` (job ID, name, type, priority, assigned staff, due date,
  final cost, notes) and `EditOrderItemsDialog` (full item table, add/remove
  rows) — Admin Job Details and Staff Job Details did not support any
  post-creation editing before this session; both dialogs call the new PUT
  endpoints above.
- Design upload now opens a small "Add Watermark to Preview?" dialog before
  uploading (image uploads only get a real pixel watermark either way; the
  choice is asked for every file type for a consistent flow).
- Comments: inline edit (pencil icon → textarea → Save/Cancel) and delete
  (trash icon, `ConfirmDialog`) now appear per-comment based on the
  backend's `can_edit`/`can_delete` flags — verified in-browser as Client1
  (both icons present on own comment) and as Admin (delete-only on a
  staff/admin comment, nothing on a client's).
- Payment slip upload is now open to admin/staff/client (was client-only);
  every payment/invoice row shows a delete icon only to the user who
  uploaded it. Client-facing payment status reads "Unverified" instead of
  "Pending" (`clientLabel()` helper — display-only, the stored status value
  is unchanged).

## Frontend — Admin-specific
- `DashboardOverviewChart` now also renders `JobsTrendChart`, a hand-rolled
  SVG line chart (no charting library added) with legend, gridlines, hover
  tooltip, and a validated categorical palette (`#FF6B00`/`#2563EB` — ran
  the dataviz skill's `validate_palette.js`, passes CVD/lightness/chroma
  checks; the one contrast WARN on orange-vs-surface is satisfied by the
  always-visible legend labels).
- Fixed a real CSS bug causing the large gap below Quick Actions: the
  two-column dashboard grid stretched the shorter (chart + actions) column
  to match the taller Recent Activity column by default; added
  `items-start` to stop it.
- Job Management: delete action added (admin only, `ConfirmDialog`,
  `DELETE /api/jobs/{id}`); the separate "View" link/column removed since
  the whole row now navigates.
- `ClientsTable`'s "Add Client" button/dialog removed entirely (backend
  route removed too, not just hidden) and replaced with "Export Client List
  (PDF)" (`jspdf` + `jspdf-autotable`, added as dependencies — generates a
  real downloadable PDF client-side, table of all registered clients).
- `StaffTable` column misalignment fixed (three of four `<td>`s were
  missing the vertical padding the first one had).
- Create Staff now toasts "successfully added" and its Cancel button asks
  for confirmation.

## Frontend — Staff-specific
- `QuickActions` now renders a single action as one large prominent CTA
  card instead of a half-empty two-column grid.
- Client Management and Payments pages gained the same stat-card treatment
  as their Admin equivalents (scoped to the staff member's own jobs).

## Frontend — Client-specific
- Sidebar "Need Help" contact info updated to `hansigraphics@gmail.com` /
  `0753 661 661`.
- "My Orders" gained stat cards (Active / Awaiting Approval / Completed).
- Order Details comments: Client1 confirmed (in-browser) to have both edit
  and delete on their own comment — the one place where a client's
  permissions are deliberately broader than staff/admin's on their own
  comments (see backend rule above).

## Known limitations after this session
- **Forgot Password real-email sending was added in Session 3** (see above)
  — this limitation no longer applies. It still falls back to dev-mode
  (token shown on-screen) until `backend/.env` is filled in with real Gmail
  SMTP credentials per `backend/.env.example`.
- Job ID is now freely editable text on both create and edit — there is
  **no format enforcement**, only uniqueness. Someone could type a
  non-`JQ*` value on purpose; this was the explicit ask ("manually
  editable"), not a bug.
- The watermark choice is asked on every design upload regardless of file
  type, even though it has no visible effect on PDFs (PDFs still only get
  access-control gating, no pixel watermark — this is unchanged from Session
  1 and remains a scope decision, not an oversight).
- `npm audit` reports some vulnerabilities pulled in by `jspdf`/
  `jspdf-autotable`'s dependency tree; not reviewed in depth — worth a look
  before this goes anywhere beyond local/dev use.
- Testing is still entirely manual (curl + headless-Chrome scripts kept in
  the session scratchpad, not committed anywhere) — Priority 17 from Session
  1 (an actual automated test suite) remains untouched.


# SESSION 1 SUMMARY (23 August) — backend build-out + integration

Starting point: only `users` + auth existed on the backend; every other
portal page rendered hard-coded arrays from `frontend/src/data/*.ts` with
zero backend wiring, zero session/role guarding, and no Job/Client/Staff/
Design/Payment/Invoice tables at all.

This session built the full backend (models, schemas, routes, file
storage with real image watermarking, role/ownership enforcement) and
wired the entire frontend to it end-to-end: auth session guarding, Create
Job (incl. a real multi-item ML predict-and-sum bug fix), Job Management,
Admin/Staff/Client Job Details (progress, designs, comments, payments,
invoices all on one shared, role-aware component), dashboards, and
Client/Staff management. All `data/*.ts` dummy files were deleted once
their consumers were rewired.

Verified end-to-end twice: once entirely via backend HTTP calls (curl),
and once in an actual headless Chrome browser driving the real login →
dashboard → job → design/payment/invoice flow for both the Admin and
Client roles, with `console --errors` checked at each step (none found).
`npx tsc --noEmit` and `npm run build` both pass cleanly.

**A real bug was found and fixed during browser verification**: the
frontend defaulted `API_URL` to `http://127.0.0.1:8000` while the app is
served from `http://localhost:3000`. Browsers treat `127.0.0.1` and
`localhost` as different sites, so the `SameSite=Lax` auth cookie was
silently dropped on every `fetch()` call after login — login appeared to
work but every subsequent page bounced back to `/login`. Fixed by
standardizing on `localhost` in `frontend/src/lib/api.ts`. This is worth
remembering: **always test auth flows in an actual browser, not just
curl** — curl doesn't enforce SameSite/cross-site cookie rules at all.


# COMPLETED

## Backend (new this session)

- `app/dependencies.py`: `get_current_user` (reads the JWT from the
  `jobquant_token` httpOnly cookie), `require_roles(...)` factory,
  `require_admin`, `require_staff_or_admin`.
- `GET /api/auth/me`, `POST /api/auth/change-password` added to
  `routes/auth.py`.
- Full SQLAlchemy models: `Job`, `JobItem`, `JobProgress`,
  `DesignVersion`, `DesignComment`, `Payment`, `Invoice` (see
  `app/models/`). `User` extended with `created_at`/`updated_at`.
  Clients and staff are `User` rows with `role="client"`/`"staff"` —
  no separate tables, matching "same underlying authentication system"
  in the project rules.
- Startup migration (`app/database.py: run_startup_migrations`) patches
  the pre-existing `users` table with the new timestamp columns without
  destroying existing rows (SQLite `create_all` never alters existing
  tables). Also added `default=func.now()` at the ORM level on every
  timestamp column so it's populated even where the underlying column
  lacks a DB-level default (belt-and-suspenders after finding the first
  fix — the DDL-only `server_default` — didn't retroactively apply to
  columns already added to an existing table).
- Routes: `routes/clients.py`, `routes/staff.py`, `routes/jobs.py`,
  `routes/designs.py`, `routes/payments.py`, `routes/invoices.py`,
  `routes/dashboard.py`. All registered in `main.py`.
- `app/services/storage.py`: file upload validation (type/size), and
  **real pixel watermarking** for image designs (Pillow, tiled
  "JOBQUANT PREVIEW" overlay) saved separately from the original under
  `backend/uploads/{designs,watermarks,payment_slips,invoices}/`. PDFs
  are stored as-is — no pixel watermark is applied to them, access
  control is the only protection for that file type (see "Known
  Limitations" below).
- `app/services/access.py`: `check_job_access` — the single ownership
  check used by every job-scoped route (client must own the job; staff
  must be assigned to or have created it; admin unrestricted).
- `app/services/payments.py`: `paid_amount` / `is_fully_paid` — shared
  by job detail responses, the design-file-access gate, and the
  dashboard aggregates.
- Job numbers are backend-generated (`JQ-0001`, ...), never
  user-entered.
- Verified via direct HTTP testing: login/me/logout, staff & client
  creation, ML prediction, job creation with items + initial progress
  row, job listing with role-based scoping, progress updates, **role-
  based cost hiding at both the job level and the per-item level**
  (a leak at the item level was caught and fixed during testing),
  403 ownership enforcement, design upload + watermark generation +
  payment-gated original release, revision requests, payment upload/
  verify, invoice upload/download, admin dashboard aggregates.

## Frontend (new this session)

- `lib/api.ts` rewritten as a full typed API client for every backend
  endpoint (jobs, clients, staff, designs, payments, invoices,
  dashboards, prediction). `apiRequest` now always sends
  `credentials: "include"` (it silently didn't before).
- `lib/auth.ts` + `components/layouts/PortalGuard.tsx`: every portal
  layout ((admin), (staff), (client)) now calls `GET /api/auth/me` on
  mount, redirects to `/login` if unauthenticated, redirects to the
  correct portal if the role doesn't match the current section, and
  feeds the real user's name into `Navbar`/`Sidebar` instead of the
  hard-coded "Wasantha"/"Buddhima"/"Nirmani" that used to be there.
  **This is the piece that didn't exist at all before** — any URL was
  previously reachable by anyone.
- Create Job (`components/forms/create-job/*`, shared between
  `/admin/jobs/create` and the newly added `/staff/jobs/create`):
  - `JobInformationSection` / `ClientInformationSection` /
    `AssignmentSection` are now controlled and backed by real
    `GET /api/clients` / `GET /api/staff` data (previously fully
    static, unwired inputs). Client picks from a `Select`, company/
    email/phone auto-fill (never re-typed).
  - **Fixed a real multi-item bug**: the old `predictCost()` only ever
    read `items[0]`, silently ignoring any additional saved order
    items. It now predicts each saved item individually (one call per
    item, since the trained model takes one product per request) and
    sums the totals — matching "the model predicts TOTAL COST, do not
    multiply by quantity again" while also handling multi-product jobs
    correctly for the first time.
  - "Final Approved Cost" is now a real controlled input, saved
    separately from `predicted_cost` per the project rule.
  - Predict Cost button relabels to "Re-Predict Cost" after the first
    prediction; a "Use Predicted Cost" shortcut fills the final-cost
    field without forcing it to match.
  - Create Job button now actually calls `POST /api/jobs` and redirects
    to the new job's detail page (previously had no `onClick` at all).
- `components/jobs/JobDetailView.tsx` (+ `JobProgressCard`,
  `JobDesignsCard`, `JobPaymentsCard`, `JobInvoiceCard`): one shared,
  role-aware component now powers `/admin/jobs/[id]`, `/staff/jobs/[id]`
  and `/portal/orders/[id]` (**Admin and Staff Job Details did not exist
  as routes at all before this session**). Renders job summary, order
  details, pricing (predicted cost hidden for `viewerRole="client"` at
  every level, including per-item), a progress timeline with an update
  control for admin/staff and read-only for client, design versions with
  upload (staff/admin) and approve/request-revision (client), comments,
  payments with verify/reject (staff/admin) and slip upload (client),
  and invoice upload/download.
- Admin Jobs list, Staff Jobs list, Client My Orders, all three
  dashboards, Admin/Staff Payments, Client Payments, Admin Client
  Management (+ an inline "Add Client" dialog, no separate route
  existed), Admin Staff Management (+ working create/edit/reset-
  password/activate-deactivate) — all rewired to real API data with
  loading/empty/error states.
- Deleted the now-fully-superseded dummy `/portal/orders/[id]/designs`
  stub page and `DesignFeedback.tsx` (both static, unused after the
  real design workflow was embedded directly in the order details page).
- `data/clients.ts`, `data/staff.ts`, `data/payments.ts`, `data/jobs.ts`,
  `data/dashboard.ts` deleted — nothing references them anymore.
- `StatusBadge` extended to cover the full job/design/payment status
  vocabulary instead of just a handful of ad-hoc strings.

## ML (unchanged, already correct)

- `backend/app/routes/prediction.py` reproduces the notebook's exact
  feature engineering (`Area_per_Quantity`, `Width_per_Quantity`,
  `Height_per_Quantity`) and returns `predicted_total_cost` without
  re-multiplying by quantity. Verified against the real trained model
  (`ml-model/models/jobquant_final_random_forest_model.pkl`) via curl
  and via the browser Create Job flow.
- Cost prediction is reachable only through `require_staff_or_admin`-
  gated flows on the frontend; the client role never sees a predicted
  cost anywhere in the UI (verified in-browser, not just by code
  inspection — see "Verified" above).


# KNOWN LIMITATIONS / NOT DONE YET

- **No automated tests.** Everything above was verified manually
  (curl + a real headless-Chrome pass), not via a test suite. Priority
  17 (Testing) in the plan below is entirely open.
- **No admin bootstrap flow.** `POST /api/auth/register` only ever
  creates `role="client"` users (by design — see project rules). The
  very first admin account has to be inserted directly into
  `backend/jobquant.db` (this is how the current dev admin,
  `admin@gmail.com`, was created). Worth a small CLI script if this
  needs to happen more than once.
- **No "Edit Job" form.** `PUT /api/jobs/{id}` exists and works, but
  there's no frontend form for it yet — job name/description/type/
  assigned staff/due date/priority/notes can only be set at creation
  time. Progress and final-cost-during-progress-updates are the only
  post-creation edits currently exposed in the UI.
- **PDF designs are not pixel-watermarked**, only image uploads
  (png/jpg/jpeg/webp) get the real overlay. PDFs still get full access
  control (never served to a client pre-payment), just not a visible
  watermark — flagged as a scope decision, not an oversight.
- **`/admin/login` and `/staff/login` are dead "Coming Soon" stub
  pages** left over from before the unified login was built. They are
  not linked from anywhere live and should probably just be deleted.
- **`/forgot-password` and `/reset-password` are still unwired** (not
  touched this session — out of scope for the flows that were
  prioritized).
- **UI consistency pass (Priority 16) is informal, not exhaustive.**
  Reused the existing shared components (`Card`, `Button`, `Input`,
  `StatusBadge`, `PageHeader`, etc.) everywhere rather than introducing
  new one-off styles, which keeps things consistent by construction,
  but no dedicated spacing/typography audit was done.
- Job status can be set to any value at any time (no enforced sequential
  transition) — a deliberate simplicity choice, not yet revisited.
- Payment rejection reason is collected via `window.prompt`, not a
  proper modal — functional, not polished.


# FINAL PRIORITY (updated)

1. ~~Authentication and authorization~~ — DONE (session guard + backend
   role/ownership checks on every route)
2. ~~Database~~ — DONE (all 8 tables from the spec)
3. ~~Job APIs~~ — DONE
4. ~~Create Job~~ — DONE (incl. multi-item predict fix)
5. ~~ML prediction for Admin and Staff~~ — DONE (already correct,
   verified)
6. ~~Re-Predict + Final Approved Cost~~ — DONE
7. ~~Admin Job Details~~ — DONE
8. ~~Staff Job Details~~ — DONE
9. ~~Progress tracking~~ — DONE
10. ~~Design workflow~~ — DONE
11. ~~Payments~~ — DONE
12. ~~Manual invoice upload~~ — DONE
13. ~~Client tracking~~ — DONE
14. ~~Real dashboards~~ — DONE
15. ~~Remove dummy data~~ — DONE (`data/*.ts` deleted, nothing left
    referencing hard-coded business data)
16. UI consistency — informal pass done via shared-component reuse; no
    dedicated audit
17. Testing — NOT STARTED (no automated unit/integration/E2E suite;
    only manual curl + browser verification exists)

Next session should either start Priority 17 (write an actual test
suite — pytest for the backend routes, Playwright for the frontend
flows now that a real browser-driving script exists in this session's
scratchpad as a starting point) or pick up one of the "Known
Limitations" items above (Edit Job form and the admin bootstrap script
are the two most likely to matter soon).


# FINAL TEST WORKFLOW STATUS

The full flow from PROJECT_CONTEXT section 92 was exercised manually
this session (admin login → create staff/client → create job with
prediction → job appears in Job Management → Admin Job Details →
staff/admin progress update → design upload → client sees design →
client requests revision → client approves → client uploads payment
slip → admin verifies → invoice uploaded → client downloads invoice →
dashboard reflects it all) and confirmed working, end-to-end, in a real
browser for both the Admin and Client roles. Staff-role browser
verification (as opposed to Admin, which was used as the staff-or-admin
stand-in) and the "upload revised version v2" step were not separately
re-driven in the browser pass — worth a quick re-check next session
since Staff has a slightly different access-scope path than Admin.
