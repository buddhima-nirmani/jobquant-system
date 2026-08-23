# JOBQUANT
## Master Project Development Context

Last updated: 23 August 2026


# 1. PROJECT IDENTITY

Project Name:
JobQuant

Project Type:
Individual final-year Computer Science project.

Domain:
Printing and advertising job management.

Business Context:
JobQuant is being developed for a small-scale printing and advertising business.

The system is intended to replace fragmented/manual processes involving:
- Phone calls
- WhatsApp
- Emails
- Manual job records
- Manual pricing
- Design approval communication
- Production progress communication
- Payment confirmation
- Invoice/document handling

The system combines:
- Job management
- Client management
- Staff management
- Machine-learning-based cost prediction
- Design management
- Design approval
- Job progress tracking
- Payment management
- Manual invoice upload
- Client communication
- Role-based access


# 2. MAIN USER ROLES

There are three roles:

1. Admin
2. Staff
3. Client


# 3. IMPORTANT ROLE RULE

Admin, Staff and Client use the same underlying authentication system.

The backend identifies the user's role.

After successful login:

Admin
→ /admin/dashboard

Staff
→ /staff/dashboard

Client
→ /client/portal/dashboard

The login page must NOT imply that only Clients can log in.

The same authentication system must support all roles.

Role authorization must be enforced by the backend.

Frontend route hiding is NOT sufficient.


# 4. TECHNOLOGY STACK

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

## Backend

- Python 3.11
- FastAPI
- SQLAlchemy
- Pydantic
- JWT authentication
- Password hashing

## Database

- SQLite

## Machine Learning

- Python
- pandas
- NumPy
- scikit-learn
- joblib
- Random Forest Regression
- Linear Regression comparison

## Development

- VS Code
- Git
- GitHub
- GitHub Desktop


# 5. ARCHITECTURE

General architecture:

Frontend
    ↓
FastAPI Backend
    ↓
SQLite Database

Frontend
    ↓
FastAPI Prediction API
    ↓
Trained ML Model

Files:
    ↓
Backend-controlled storage/access


# 6. PROJECT GOAL

The system must allow the business to manage the complete lifecycle of a printing/advertising job.

Main workflow:

Client / Admin / Staff
        ↓
Job created
        ↓
Order details entered
        ↓
ML cost prediction
        ↓
Cost reviewed
        ↓
Re-prediction if required
        ↓
Final approved cost
        ↓
Job assigned
        ↓
Design created/uploaded
        ↓
Client reviews design
        ↓
Client comments or requests revision
        ↓
Design revised
        ↓
Client approves design
        ↓
Production
        ↓
Progress updates
        ↓
Client tracks progress
        ↓
Payment
        ↓
Payment verification
        ↓
Invoice manually uploaded
        ↓
Final design released
        ↓
Job completed


# 7. ADMIN ROLE

Admin has full system management access.

Admin can:

- Login
- Logout
- View dashboard
- Manage clients
- Manage staff
- Create jobs
- View jobs
- Search jobs
- Filter jobs
- Edit jobs
- View Job Details
- Assign staff
- Predict job cost
- Re-predict job cost
- Set final approved cost
- Save final approved cost
- View job progress
- Update job progress
- View progress history
- Manage design versions
- View design comments
- View design approvals
- View payments
- Verify payments
- Reject payments
- Upload invoices manually
- View/download invoices
- View final designs
- Manage profile


# 8. STAFF ROLE

Staff has operational access.

Staff can:

- Login
- Logout
- View Staff Dashboard
- View assigned jobs
- View Job Details
- Create/manage jobs according to permitted workflow
- Enter order details
- Predict cost
- Re-predict cost
- Enter final approved cost
- Save final approved cost
- View assigned clients
- Update job progress
- View progress history
- Upload design versions
- View design comments
- Respond to revision requests
- Upload revised designs
- View payment information where permitted
- Verify/review payments where permitted
- Upload invoices manually where permitted
- View/download permitted documents
- Manage profile


# 9. VERY IMPORTANT: COST PREDICTION ACCESS

Cost prediction is available to:

- Admin
- Staff

Cost prediction is NOT available to:

- Client

Both Admin and Staff must be able to use the same ML prediction functionality.

The Create Job workflow for both Admin and Staff must support:

Enter order details
→ Predict Cost
→ Review prediction
→ Change inputs
→ Re-Predict
→ Enter Final Approved Cost
→ Save Final Cost


# 10. CLIENT ROLE

Client can:

- Register
- Login
- Logout
- View dashboard
- View own orders
- View order details
- Track job progress
- View design versions
- View watermarked designs
- Comment on designs
- Request revisions
- Approve designs
- Upload payment slips
- View payment status
- View invoices
- Download invoices
- Access final design after payment requirements are satisfied
- Manage profile
- Change password


# 11. CLIENT ACCESS RESTRICTION

Clients can ONLY access their own:

- Jobs
- Orders
- Designs
- Comments
- Payments
- Invoices
- Files

A client must never be able to access another client's data by changing a URL/job ID.

This must be enforced by the backend.


# 12. AUTHENTICATION

Required endpoints/functionality:

POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/me
POST /api/auth/change-password

Login:

Email
Password

Backend:
- Find user
- Validate password
- Check active status
- Determine role
- Generate authentication token/session
- Store authentication securely

Frontend:
- Login
- Loading state
- Error state
- Redirect based on role

Role routing:

admin → /admin/dashboard
staff → /staff/dashboard
client → /client/portal/dashboard


# 13. ADMIN DASHBOARD

Route:

/admin/dashboard

Dashboard must use REAL database data.

No dummy statistics.

Display:

- Total Jobs
- Pending Jobs
- Jobs In Progress
- Completed Jobs
- Total Clients
- Active Staff
- Pending Payments
- Revenue / verified payments

Also display:

Recent Jobs:
- Job ID
- Job Name
- Client
- Staff
- Due Date
- Status
- Final Cost

Recent Activity:
- Job created
- Staff assigned
- Design uploaded
- Revision requested
- Design approved
- Progress updated
- Payment uploaded
- Payment verified
- Invoice uploaded
- Job completed


# 14. STAFF DASHBOARD

Route:

/staff/dashboard

Display real data for the authenticated staff member.

Examples:

- Assigned Jobs
- Active Jobs
- Pending Design Reviews
- Jobs Due Soon
- Completed Jobs

Recent assigned jobs:
- Job ID
- Job Name
- Client
- Due Date
- Status


# 15. CLIENT DASHBOARD

Route:

/client/portal/dashboard

Display:

- Active Orders
- Completed Orders
- Pending Design Approvals
- Outstanding Payments

All information must belong to the authenticated client.


# 16. ADMIN JOB MANAGEMENT

Route:

/admin/jobs

IMPORTANT:

Job Management must NOT redirect directly to Create Job.

It must display the existing jobs.

Page contains:

- Page header
- Search
- Filters
- Statistics
- Jobs table
- Create Job button

Create Job button:

/admin/jobs/create


# 17. JOB MANAGEMENT TABLE

Columns:

- Job ID
- Job Name
- Client
- Assigned Staff
- Order Date
- Due Date
- Final Cost
- Status
- Actions

Actions:

- View
- Edit

Potentially:
- Cancel

Do not use hard-coded jobs.


# 18. JOB SEARCH

Search:

- Job ID
- Job Name
- Client Name

Filters:

- Status
- Staff
- Priority
- Date


# 19. CREATE JOB

Admin route:

/admin/jobs/create

Staff route should provide an equivalent job creation workflow if Staff is permitted to create jobs.

The Create Job form contains:

1. Job Information
2. Client Information
3. Assignment
4. Order Details
5. Pricing Information
6. Notes


# 20. JOB INFORMATION

Fields:

- Job Name
- Job Description
- Job Type
- Order Date
- Due Date
- Priority

Job ID should be generated by the backend.

Example:

JQ-0001
JQ-0002
JQ-0003


# 21. CLIENT INFORMATION

Select existing client.

Display:

- Client Name
- Company
- Email
- Phone

Do not make users repeatedly enter stored client information.


# 22. ASSIGNMENT

Fields:

- Assigned Staff
- Created By

Assigned Staff should come from active staff accounts.

Created By should come from the authenticated user.


# 23. ORDER DETAILS

Order Details are directly connected to the ML model.

Relevant fields include:

- Product Category
- Product Name
- Width
- Height
- Area
- Unit
- Quantity
- Material
- Specification
- Print Type
- Lamination
- Installation
- Transport
- Transport Distance
- Design Charge where required

The exact model input features MUST be verified against the final ML notebook/model.

Do not guess model features.


# 24. AREA

Where applicable:

Area = Width × Height

Area should be calculated automatically when possible.

The unit system must be consistent.


# 25. TRANSPORT

If:

Transport = Yes

show:

Transport Distance

in kilometres.

If:

Transport = No

hide/disable the distance field.

The backend must validate this relationship.


# 26. PRICING INFORMATION

Pricing section must clearly separate:

Predicted Cost

and:

Final Approved Cost


# 27. ML COST PREDICTION

The ML system uses historical pricing data.

Selected model:

Random Forest Regression

Comparison model:

Linear Regression

The final application uses the Random Forest model.


# 28. MODEL OUTPUT

IMPORTANT:

The current final model predicts:

TOTAL COST

It does NOT directly predict Unit Price.

Therefore:

model output = predicted total job cost

Do NOT multiply predicted total cost by quantity again.

If unit price is needed:

predicted unit price =
predicted total cost / quantity


# 29. ML INPUT CONSISTENCY

The backend must reproduce the exact preprocessing and feature engineering used during model training.

Before changing prediction.py:

Inspect:

- Final notebook
- Dataset
- Feature engineering
- Pipeline
- Saved model

Training-time and prediction-time feature preparation must be identical.


# 30. PREDICT COST BUTTON

Available to:

- Admin
- Staff

Workflow:

Complete required Order Details
        ↓
Predict Cost
        ↓
Frontend sends request
        ↓
Backend validates
        ↓
Model predicts Total Cost
        ↓
Prediction returned
        ↓
Display predicted cost


# 31. RE-PREDICT

After a prediction:

Button:

Re-Predict Cost

User can change model inputs.

Clicking Re-Predict must call the model again.

The new prediction replaces the previous displayed prediction.

Do not create unnecessary duplicate jobs.


# 32. FINAL APPROVED COST

The ML prediction is NOT automatically the final job price.

The user manually enters:

Final Approved Cost

Example:

Predicted Cost:
LKR 42,500

Final Approved Cost:
LKR 45,000


# 33. SAVE FINAL COST

Store both:

predicted_cost
final_cost

Example:

predicted_cost = 42500
final_cost = 45000

Do not overwrite the prediction with the approved price.


# 34. CREATE JOB

When Create Job is clicked:

Validate:
- Required fields
- Client
- Staff
- Order details
- Cost information
- Dates

Save:

- Job
- Job number
- Client
- Staff
- Order details
- Predicted cost
- Final cost
- Status
- Notes
- Created by
- Dates

After successful creation:

Redirect to:

/admin/jobs/{id}

or:

/admin/jobs

with a success message.


# 35. JOB STATUS

Suggested workflow:

Pending
↓
Design
↓
Awaiting Client Approval
↓
Approved
↓
Production
↓
Ready for Delivery
↓
Completed

Possible additional status:

Cancelled

Status names must remain consistent throughout all portals.


# 36. PROGRESS TRACKING

Progress is stored in the database.

Every update records:

- Job ID
- Status
- Note
- Updated By
- Timestamp


# 37. ADMIN JOB DETAILS

Route:

/admin/jobs/[id]

This is currently incomplete and is a HIGH PRIORITY feature.

Must contain:

## Header
- Job ID
- Job Name
- Status
- Priority
- Edit

## Job Summary
- Client
- Staff
- Created By
- Order Date
- Due Date

## Order Details
- Product
- Dimensions
- Quantity
- Material
- Specification
- Print
- Lamination
- Installation
- Transport

## Pricing
- Predicted Cost
- Final Approved Cost
- Paid
- Outstanding

## Progress
- Current Status
- Timeline
- Update Progress

## Designs
- Versions
- Comments
- Approval status

## Payments
- Payment history
- Verification status

## Invoice
- Upload
- View
- Download

## Notes


# 38. STAFF JOB DETAILS

Route:

/staff/jobs/[id]

Currently incomplete.

Must contain:

- Job information
- Client information
- Order details
- Pricing where permitted
- Progress
- Progress history
- Designs
- Comments
- Payment information where permitted
- Invoice

Staff actions:

- Update progress
- Upload design
- Upload revised design
- View/respond to revision requests
- Upload invoice where permitted


# 39. STAFF JOB LIST

Route:

/staff/jobs

Display assigned/relevant jobs.

Search:
- Job ID
- Job name
- Client

Filters:
- Status
- Due date


# 40. PROGRESS UPDATE

Admin and Staff can update progress according to their permissions.

Example:

Design
→ Awaiting Client Approval

Approved
→ Production

Every update must be saved.

Client sees the update automatically when retrieving the job.


# 41. CLIENT PROGRESS

Client is read-only.

Client sees a progress timeline such as:

Order Received
✓

Design
✓

Awaiting Approval
✓

Production
●

Ready for Delivery
○

Completed
○

The values must come from the real database.


# 42. CLIENT MY ORDERS

Route:

/client/portal/orders

Display only the client's jobs.

Fields:

- Job ID
- Job Name
- Order Date
- Due Date
- Status
- Payment Status

No dummy orders.


# 43. CLIENT ORDER DETAILS

The Client Order Details UI is already visually developed.

IMPORTANT:

Do NOT unnecessarily redesign this page.

Current state:
UI exists but uses dummy data.

It must be connected to the real backend/database.

It must show:

- Job information
- Progress
- Design versions
- Design status
- Comments
- Revision requests
- Approval
- Payment status
- Invoice
- Final design access


# 44. DESIGN VERSIONS

Designs must be versioned.

Example:

Version 1
Version 2
Version 3

Each version contains:

- ID
- Job ID
- Version number
- File
- Watermarked file
- Uploaded by
- Uploaded date
- Status


# 45. DESIGN VERSION STATUS

Possible statuses:

- Pending Review
- Revision Requested
- Approved
- Superseded


# 46. WATERMARK

Client initially receives a watermarked/protected design.

Original design must remain protected.

Do not expose original files through public static paths.


# 47. DESIGN COMMENTS

Each comment stores:

- Comment ID
- Job ID
- Design Version
- User
- Comment
- Timestamp

Client can comment.

Admin/Staff can view comments.


# 48. REQUEST REVISION

Client clicks:

Request Revision

Client provides a comment.

Example:

"Please move the logo to the right side."

Version status becomes:

Revision Requested


# 49. DESIGN APPROVAL

Client clicks:

Approve Design

After confirmation:

Design Version = Approved

Job may proceed to the next permitted stage.


# 50. STAFF DESIGN UPLOAD

Staff uploads a new design.

The system creates:

Version 2

rather than replacing Version 1.


# 51. FINAL DESIGN

Before payment requirements are satisfied:

Watermarked/protected design.

After required payment is verified:

Original/final design can be accessed.


# 52. CLIENT PAYMENTS

Client can:

- View total cost
- View paid amount
- View outstanding amount
- View payment history
- Upload payment slip


# 53. PAYMENT WORKFLOW

Client:

Upload payment slip
        ↓
Payment = Pending Verification

Admin/authorized Staff:

Review
        ↓
Verify OR Reject

If rejected:

Store rejection reason.

Client can see the rejection and upload again where appropriate.


# 54. ADMIN PAYMENTS

Route:

/admin/payments

Display:

- Total verified
- Pending
- Outstanding

Payment table:

- Payment ID
- Job
- Client
- Amount
- Date
- Status
- Actions


# 55. STAFF PAYMENTS

Staff can access payment information according to their permissions.

Do not give Staff unrestricted Admin capabilities.


# 56. INVOICES

IMPORTANT CURRENT DECISION:

Invoices are uploaded manually.

DO NOT build AI invoice generation.

ML is for cost prediction only.


# 57. MANUAL INVOICE WORKFLOW

Admin/Staff:

Job Details
        ↓
Upload Invoice
        ↓
Invoice attached to Job
        ↓
Client can view/download


# 58. INVOICE DATA

Store:

- Invoice ID
- Job ID
- File path/reference
- Uploaded by
- Uploaded date


# 59. CLIENT FINAL DESIGN ACCESS

Only release original/final design after required payment verification.

Backend must enforce this.

Do not rely on frontend buttons or URL hiding.


# 60. CLIENT MANAGEMENT

Route:

/admin/clients

Functions:

- List
- Search
- Add
- View
- Edit
- Activate/deactivate
- View jobs
- View payment history


# 61. STAFF MANAGEMENT

Route:

/admin/staff

Functions:

- List
- Search
- Add
- Edit
- Reset password
- Activate/deactivate
- View assigned jobs
- View workload


# 62. PROFILE

All roles:

- My Profile
- Settings if implemented
- Help if implemented
- Logout

Profile:

- Name
- Email
- Phone
- Company where applicable

Password changes must be secure.


# 63. DATABASE

Minimum entities:

users
clients
jobs
job_items
job_progress
design_versions
design_comments
payments
invoices


# 64. USERS

Fields:

- id
- name
- email
- phone
- company
- password_hash
- role
- is_active
- created_at
- updated_at


# 65. JOBS

Recommended:

- id
- job_number
- job_name
- description
- client_id
- assigned_staff_id
- created_by
- job_type
- order_date
- due_date
- priority
- status
- predicted_cost
- final_cost
- notes
- created_at
- updated_at


# 66. JOB ITEMS

Store ML/order inputs:

- job_id
- product_category
- product_name
- width
- height
- area
- unit
- quantity
- material
- specification
- print_type
- lamination
- installation
- transport
- transport_distance
- design_charge


# 67. JOB PROGRESS

Fields:

- id
- job_id
- status
- note
- updated_by
- created_at


# 68. DESIGN VERSIONS

Fields:

- id
- job_id
- version_number
- original_file
- watermarked_file
- status
- uploaded_by
- uploaded_at
- approved_at


# 69. DESIGN COMMENTS

Fields:

- id
- job_id
- design_version_id
- user_id
- comment
- created_at


# 70. PAYMENTS

Fields:

- id
- job_id
- client_id
- amount
- payment_method
- payment_slip
- status
- rejection_reason
- verified_by
- verified_at
- created_at


# 71. INVOICES

Fields:

- id
- job_id
- file_path
- uploaded_by
- uploaded_at


# 72. API

Authentication:

POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/me
POST /api/auth/change-password

Jobs:

GET /api/jobs
POST /api/jobs
GET /api/jobs/{id}
PUT /api/jobs/{id}
DELETE /api/jobs/{id}

Progress:

GET /api/jobs/{id}/progress
POST /api/jobs/{id}/progress
PUT /api/jobs/{id}/status

Prediction:

POST /api/prediction/predict

Clients:

GET /api/clients
POST /api/clients
GET /api/clients/{id}
PUT /api/clients/{id}

Staff:

GET /api/staff
POST /api/staff
GET /api/staff/{id}
PUT /api/staff/{id}

Designs:

GET /api/jobs/{id}/designs
POST /api/jobs/{id}/designs
GET /api/designs/{id}
POST /api/designs/{id}/approve
POST /api/designs/{id}/revision

Comments:

GET /api/designs/{id}/comments
POST /api/designs/{id}/comments

Payments:

GET /api/payments
POST /api/payments
GET /api/payments/{id}
POST /api/payments/{id}/verify
POST /api/payments/{id}/reject

Invoices:

POST /api/jobs/{id}/invoice
GET /api/jobs/{id}/invoice


# 73. API SECURITY

Use:

- Authentication
- Role checks
- Ownership checks
- Pydantic validation
- Correct HTTP status codes
- Safe error messages

Never trust frontend authorization.


# 74. FILE UPLOADS

Files include:

- Design files
- Watermarked designs
- Payment slips
- Invoices

Validate:

- File type
- File size
- User permission

Private files must not be publicly exposed.


# 75. LOADING STATES

All API-driven pages require loading states.

Examples:

- Skeleton
- Spinner
- Loading text


# 76. EMPTY STATES

Examples:

No jobs found.

No payments found.

No design versions yet.

No comments yet.

No assigned jobs.


# 77. ERROR STATES

Examples:

Unable to load jobs.

Prediction failed.

Unable to upload file.

Payment verification failed.

Use useful messages.


# 78. VALIDATION

Validate:

- Required fields
- Email
- Dimensions
- Quantity > 0
- Dates
- Cost >= 0
- File size
- File type
- Valid status transitions


# 79. DUMMY DATA

Dummy data currently exists throughout the portals.

It must eventually be completely removed.

Examples:

- Fake jobs
- Fake clients
- Fake staff
- Fake payments
- Fake dashboard statistics
- Fake designs
- Fake comments
- Fake activity
- Fake orders

Do not simply remove dummy data before implementing its replacement.

Correct process:

Dummy data
→ API
→ Database
→ Frontend integration
→ Loading/empty/error states
→ Remove dummy data


# 80. UI CONSISTENCY

Admin, Staff and Client portals currently have some inconsistencies.

Standardize:

- Fonts
- Headings
- Buttons
- Inputs
- Selects
- Tables
- Cards
- Status badges
- Modals
- Spacing
- Border radius
- Sidebar
- Navbar
- Profile dropdown
- Empty states
- Loading states


# 81. UI REFERENCE

The uploaded Admin Portal UI is the reference for Admin visual design.

The uploaded Client Portal UI is the reference for Client visual design.

The Admin UI includes screens such as:
- Dashboard
- Job Management
- Create Job
- Job Details
- Staff Management
- Add Staff
- Login

The Client UI includes:
- Landing
- Login
- Register
- Dashboard
- My Orders
- Order Details
- Payments

The Create Job design specifically indicates that when Transportation is enabled, a distance-in-km field should appear.

Do not redesign existing completed UI unnecessarily.


# 82. ML MODEL

The final trained model is:

jobquant_final_random_forest_model.pkl

Expected model-related files:

ml-model/
    notebooks/
        JobQuant_Model_Final.ipynb

    models/
        jobquant_final_random_forest_model.pkl

The final training notebook is the authority for:
- Features
- Preprocessing
- Feature engineering
- Model
- Target
- Prediction format


# 83. ML DEPENDENCY VERSION

The trained model was created using scikit-learn 1.6.1.

Backend environment should use compatible versions.

Current verified environment:

scikit-learn 1.6.1
pandas 2.2.3
numpy 2.1.3
joblib 1.5.3

Do not unnecessarily upgrade scikit-learn because saved model compatibility matters.


# 84. ML ERROR HANDLING

If prediction fails:

- Do not generate fake output
- Do not create the job
- Show error
- Allow retry
- Log useful backend information


# 85. DASHBOARD RULE

All dashboard statistics must come from the database.

No hard-coded business values.


# 86. JOB NUMBER

Generate unique job numbers.

Example:

JQ-0001

Never create duplicate job numbers.


# 87. FINAL COST RULE

Predicted cost and Final Approved Cost are separate.

The final cost is the amount saved as the business cost of the job.

Example:

Prediction:
LKR 40,000

Approved:
LKR 42,500

Database:

predicted_cost = 40000
final_cost = 42500


# 88. DESIGN WORKFLOW

Staff uploads:
Version 1

Client:
Review

Client:
Comment / Request Revision

Staff:
Upload Version 2

Client:
Review

Client:
Approve

Job:
Continue to production


# 89. PAYMENT WORKFLOW

Client uploads payment slip.

Admin/Staff verifies.

Only verified payments count toward paid amount.

Outstanding:

final_cost - verified payments


# 90. JOB COMPLETION

A job should only be marked Completed according to the permitted workflow.

Before completion:
- Required production stage completed
- Payment requirements satisfied where applicable
- Final design released where applicable
- Invoice uploaded where required


# 91. TESTING

Testing must cover:

## Unit
- Validation
- Calculations
- ML input preparation
- Status transitions

## Integration
- Frontend → API
- API → Database
- API → ML
- API → File storage

## System
Complete end-to-end workflow.

## UAT
Actual/suitable user testing.

## ML
- MAE
- RMSE/MSE
- R²
- Model comparison


# 92. COMPLETE END-TO-END TEST

Test:

Admin login
→ Dashboard
→ Client management
→ Staff management
→ Create Job
→ Select Client
→ Assign Staff
→ Enter Order Details
→ Predict Cost
→ Re-Predict
→ Final Approved Cost
→ Save Final Cost
→ Create Job
→ Job Management
→ Admin Job Details
→ Staff sees job
→ Staff Job Details
→ Staff updates progress
→ Staff uploads Design Version 1
→ Client sees design
→ Client comments
→ Client requests revision
→ Staff uploads Version 2
→ Client approves
→ Production
→ Client tracks progress
→ Client uploads payment slip
→ Admin/Staff verifies
→ Invoice uploaded manually
→ Client downloads invoice
→ Final design released
→ Job completed
→ Dashboard statistics updated


# 93. DEVELOPMENT PRIORITY

PHASE 1:
Stabilize authentication and routing.

PHASE 2:
Complete database.

PHASE 3:
Complete backend APIs.

PHASE 4:
Connect Create Job.

PHASE 5:
Fix and integrate ML prediction.

PHASE 6:
Implement Re-Predict and Final Approved Cost.

PHASE 7:
Admin Job Details.

PHASE 8:
Staff Job Details.

PHASE 9:
Progress tracking.

PHASE 10:
Design workflow.

PHASE 11:
Payments.

PHASE 12:
Manual invoice upload.

PHASE 13:
Client tracking.

PHASE 14:
Real dashboards.

PHASE 15:
Remove dummy data.

PHASE 16:
UI consistency.

PHASE 17:
Testing.


# 94. DEVELOPMENT RULES

Before changing code:

1. Read PROJECT_CONTEXT.md.
2. Read DEVELOPMENT_STATUS.md.
3. Inspect existing source code.
4. Inspect related frontend components.
5. Inspect backend routes/models/schemas.
6. Inspect database.
7. Inspect ML notebook before modifying ML code.

Do not rebuild the system unnecessarily.

Do not replace working UI unnecessarily.

Do not create fake API responses.

Do not leave dummy business data.

Do not make assumptions about ML features.

Do not expose private files.

Do not rely only on frontend authorization.

Do not modify unrelated files.


# 95. CODE QUALITY

Use:

- TypeScript types
- Reusable React components
- Shared API services
- Pydantic schemas
- SQLAlchemy relationships
- Proper validation
- Error handling
- Clear naming
- Separation of concerns

Avoid:

- duplicated logic
- hard-coded business data
- unnecessary dependencies
- giant components
- insecure file access
- frontend-only authorization


# 96. GIT

Make commits at logical milestones:

1. Authentication
2. Database
3. Job API
4. ML integration
5. Create Job
6. Admin Job Details
7. Staff Job Details
8. Progress
9. Designs
10. Payments
11. Invoice
12. Client tracking
13. Dummy data removal
14. Testing

Never commit:
- .env
- passwords
- secret keys
- backend/venv
- unnecessary generated files


# 97. DEFINITION OF DONE

JobQuant is functionally complete when:

[ ] Admin login works
[ ] Staff login works
[ ] Client registration/login works
[ ] Role redirects work
[ ] Backend authorization works
[ ] Admin dashboard uses real data
[ ] Staff dashboard uses real data
[ ] Client dashboard uses real data
[ ] Client management works
[ ] Staff management works
[ ] Admin Job Management works
[ ] Staff Job Management works
[ ] Create Job works
[ ] Cost prediction works for Admin
[ ] Cost prediction works for Staff
[ ] Re-Predict works
[ ] Final Approved Cost works
[ ] Jobs persist in database
[ ] Admin Job Details works
[ ] Staff Job Details works
[ ] Progress updates work
[ ] Progress history works
[ ] Client tracking works
[ ] Design upload works
[ ] Design versioning works
[ ] Comments work
[ ] Revision requests work
[ ] Design approval works
[ ] Payment slip upload works
[ ] Payment verification works
[ ] Payment rejection works
[ ] Manual invoice upload works
[ ] Client invoice download works
[ ] Final design protection works
[ ] Final design release works
[ ] Dashboard statistics are real
[ ] Dummy business data removed
[ ] UI is consistent
[ ] Loading states exist
[ ] Empty states exist
[ ] Error states exist
[ ] End-to-end testing passes