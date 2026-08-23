# JOBQUANT DEVELOPMENT STATUS

Last updated:
24 August 2026 (UX/polish pass on top of the 23 August integration pass)


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
- **Forgot Password is dev-mode only.** No SMTP is configured; the reset
  link is returned in the API response and shown on the page instead of
  emailed. User was offered free Gmail-SMTP as the no-cost path forward and
  has not yet provided credentials — wiring real sending is a same-shape
  follow-up once they do (swap the `ForgotPasswordResponse` handling for an
  actual send, the request/response contract doesn't need to change).
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
