"""Generates the three JobQuant user manuals (Admin / Staff / Client) as PDFs.

Run with the backend venv:
    venv\\Scripts\\python.exe scripts\\generate_user_manuals.py

Output goes to docs/user-manuals/ at the repo root.
"""

import os

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.platypus.flowables import HRFlowable, KeepTogether

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO_ROOT = os.path.dirname(BACKEND_DIR)
LOGO_PATH = os.path.join(REPO_ROOT, "frontend", "public", "logo-1.png")
OUT_DIR = os.path.join(REPO_ROOT, "docs", "user-manuals")

ORANGE = colors.HexColor("#FF6B00")
INK = colors.HexColor("#0F172A")
SLATE = colors.HexColor("#475569")
LIGHT_RULE = colors.HexColor("#E2E8F0")

styles = {
    "H1": ParagraphStyle(
        "H1", fontName="Helvetica-Bold", fontSize=16, textColor=INK,
        spaceBefore=18, spaceAfter=8, leading=20,
    ),
    "H2": ParagraphStyle(
        "H2", fontName="Helvetica-Bold", fontSize=12.5, textColor=ORANGE,
        spaceBefore=12, spaceAfter=5, leading=16,
    ),
    "Body": ParagraphStyle(
        "Body", fontName="Helvetica", fontSize=10.3, textColor=INK,
        leading=15, spaceAfter=7, alignment=TA_LEFT,
    ),
    "Bullet": ParagraphStyle(
        "Bullet", fontName="Helvetica", fontSize=10.3, textColor=INK,
        leading=15, spaceAfter=4, leftIndent=14, bulletIndent=2,
    ),
    "Tip": ParagraphStyle(
        "Tip", fontName="Helvetica-Oblique", fontSize=9.7, textColor=SLATE,
        leading=14, spaceAfter=9, leftIndent=10, borderColor=LIGHT_RULE,
    ),
    "CoverTitle": ParagraphStyle(
        "CoverTitle", fontName="Helvetica-Bold", fontSize=26, textColor=INK,
        leading=32, spaceBefore=26,
    ),
    "CoverRole": ParagraphStyle(
        "CoverRole", fontName="Helvetica-Bold", fontSize=15, textColor=ORANGE,
        leading=20, spaceBefore=6,
    ),
    "CoverMeta": ParagraphStyle(
        "CoverMeta", fontName="Helvetica", fontSize=10, textColor=SLATE,
        leading=14, spaceBefore=40,
    ),
}


def build(role_title, filename, cover_role, blocks):
    path = os.path.join(OUT_DIR, filename)
    doc = BaseDocTemplate(
        path,
        pagesize=A4,
        leftMargin=22 * mm,
        rightMargin=22 * mm,
        topMargin=20 * mm,
        bottomMargin=18 * mm,
        title=f"JobQuant User Manual — {cover_role}",
        author="Hansi Graphics & Advertising (Pvt) Ltd.",
    )

    frame = Frame(
        doc.leftMargin, doc.bottomMargin,
        doc.width, doc.height,
        id="normal",
    )

    def footer(canvas, doc_):
        canvas.saveState()
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(SLATE)
        canvas.drawString(22 * mm, 10 * mm, "JobQuant User Manual")
        canvas.drawRightString(
            A4[0] - 22 * mm, 10 * mm, f"{cover_role}  ·  Page {doc_.page}"
        )
        canvas.setStrokeColor(LIGHT_RULE)
        canvas.line(22 * mm, 14 * mm, A4[0] - 22 * mm, 14 * mm)
        canvas.restoreState()

    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=footer)])

    story = []

    # Cover page
    story.append(Spacer(1, 30 * mm))
    if os.path.exists(LOGO_PATH):
        story.append(Image(LOGO_PATH, width=70 * mm, height=70 * mm * (566 / 2202)))
    story.append(Paragraph("JobQuant User Manual", styles["CoverTitle"]))
    story.append(Paragraph(cover_role, styles["CoverRole"]))
    story.append(
        Paragraph(
            "Hansi Graphics &amp; Advertising (Pvt) Ltd.<br/>"
            "The Digital Printing Solution",
            styles["CoverMeta"],
        )
    )
    story.append(PageBreak())

    for block in blocks:
        kind = block[0]
        if kind == "h1":
            story.append(Paragraph(block[1], styles["H1"]))
            story.append(HRFlowable(width="100%", thickness=0.6, color=LIGHT_RULE, spaceAfter=6))
        elif kind == "h2":
            story.append(Paragraph(block[1], styles["H2"]))
        elif kind == "p":
            story.append(Paragraph(block[1], styles["Body"]))
        elif kind == "bullets":
            for item in block[1]:
                story.append(Paragraph(f"&#8226;&nbsp;&nbsp;{item}", styles["Bullet"]))
            story.append(Spacer(1, 4))
        elif kind == "tip":
            story.append(
                KeepTogether(
                    Table(
                        [[Paragraph(block[1], styles["Tip"])]],
                        colWidths=[doc.width - 12],
                        style=TableStyle(
                            [
                                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                                ("TOPPADDING", (0, 0), (-1, -1), 7),
                                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFF8F3")),
                                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#FFE0C2")),
                            ]
                        ),
                    )
                )
            )
            story.append(Spacer(1, 4))
        elif kind == "space":
            story.append(Spacer(1, block[1]))

    doc.build(story)
    print(f"Wrote {path}")


# ---------------------------------------------------------------------------
# ADMIN MANUAL
# ---------------------------------------------------------------------------

ADMIN_BLOCKS = [
    ("h1", "1. Signing In"),
    ("p",
     "There's one login page for the whole system — Admin, Staff and Client all sign in "
     "at the same place, and JobQuant sends you to the right portal automatically based "
     "on your account. There's no separate admin login screen to remember."),
    ("p",
     "Forgotten your password? Click \"Forgot Password?\" on the login screen and enter "
     "your email. A reset link will either be emailed to you or shown directly on the "
     "page, depending on how the system has been configured — either way, follow it "
     "within 30 minutes before it expires."),
    ("tip",
     "First time logging in? Head to your profile (click your name, top right) and make "
     "sure your phone number is correct — staff and clients may need to reach you through it."),

    ("h1", "2. Your Dashboard"),
    ("p",
     "The dashboard gives you a snapshot of the whole business: total jobs, active "
     "clients, active staff, and pending payments across the board. \"Active\" always "
     "means a job that hasn't been marked Completed or Cancelled yet — a finished job "
     "drops out of these counts automatically."),
    ("p",
     "Below that, the Jobs Overview breaks the pipeline into Pending / In Progress / "
     "Completed, and the chart shows jobs created versus jobs completed over the last "
     "eight weeks — useful for spotting whether the backlog is growing or shrinking. "
     "Recent Activity on the right is a live feed of everything happening across the "
     "system: comments, payments, design uploads. Quick Actions gives you one-click "
     "shortcuts to creating a job or adding a staff member."),

    ("h1", "3. Creating and Managing Jobs"),
    ("h2", "Creating a job"),
    ("p",
     "From Job Management, click Create Job. The Job ID field is filled in for you "
     "(it follows on from whatever the highest job number in the system currently is), "
     "but you can type your own if you need to — it just has to be unique."),
    ("p",
     "Pick the client from the dropdown; their contact details fill in automatically. "
     "Then add the order items — product, dimensions, material, print type and so on — "
     "and save each one. Once you've saved at least one item, click Predict Cost. This "
     "runs the machine learning model and gives you a total cost for the job, not a "
     "per-unit price — don't multiply it by anything. If you change an item afterwards, "
     "hit Re-Predict Cost to refresh the number."),
    ("p",
     "The predicted cost is a guide for you and your staff — it is never shown to the "
     "client. What the client actually sees and gets billed is the Final Approved Cost, "
     "which you set yourself (there's a \"Use Predicted Cost\" shortcut if you're happy "
     "with the model's number as-is)."),
    ("p",
     "If the job needs transport, switch on Transportation — the distance field becomes "
     "required at that point, since it feeds into the cost."),
    ("h2", "Editing and deleting"),
    ("p",
     "Once a job exists, use the Edit Job and Edit Order Details buttons on its details "
     "page to change anything later — job name, priority, assigned staff, due date, "
     "final cost, or the item list itself."),
    ("p",
     "Deleting a job is admin-only — staff can't do it. It's permanent and takes the "
     "job's designs, payments and invoice with it, so double-check before confirming."),
    ("tip",
     "Anywhere you see a list of jobs or payments in the system, you can click anywhere "
     "on the row to open it — there's no separate \"View\" button to hunt for."),

    ("h1", "4. Designs and Client Feedback"),
    ("p",
     "On a job's details page, Upload New Version lets you attach a design file. You'll "
     "be asked whether to add a watermark to the preview the client sees first — this "
     "only applies to image files (PNG/JPG/WEBP); PDFs don't get a visible watermark "
     "stamped on them, but either way the client can't download the original, "
     "unwatermarked file until the job is fully paid."),
    ("p",
     "Comments underneath each design version are colour-coded by role so you can tell "
     "at a glance who said what — purple for Admin, blue for Staff, green for Client. "
     "Anyone can reply directly to a specific comment using the reply icon, and you'll "
     "get notified when someone approves a design or leaves feedback."),
    ("p",
     "You can edit your own comments any time, and as an admin you can delete any "
     "admin or staff comment if something needs to come down — client comments can "
     "only be removed by the client themselves."),

    ("h1", "5. Payments and Invoices"),
    ("p",
     "Anyone — client, staff or admin — can record a payment against a job, but a slip "
     "(image or PDF) has to be attached every time; there's no way to log a payment "
     "without proof anymore."),
    ("p",
     "Verify or Reject a pending payment from the Payments page or the job's own page. "
     "Rejecting opens a small dialog asking for a reason, which gets passed on to "
     "whoever uploaded it so they know what to fix."),
    ("p",
     "One rule worth knowing: once you verify a client's payment slip, the client can "
     "no longer delete it — it's locked in as part of the record from that point on. "
     "They can still remove a slip that's Pending or was Rejected."),
    ("p",
     "Every payment table shows an Outstanding column now, so you can see at a glance "
     "what's still owed on that job without opening it."),
    ("p",
     "Invoices are uploaded manually — there's no automatic invoice generation. Once a "
     "job is billed, upload the invoice file (PDF or image) from the job's Invoice "
     "section so the client can download it."),

    ("h1", "6. Managing Clients"),
    ("p",
     "Client Management lists every client with their active job count and status. "
     "Staff can see this list too, but only an admin can Deactivate or reactivate a "
     "client account."),
    ("p",
     "Export Client List (PDF) generates a proper letterhead document with the Hansi "
     "Graphics logo — handy for sharing outside the system."),

    ("h1", "7. Managing Staff"),
    ("p",
     "Staff Management is where you add new staff accounts, edit an existing one, reset "
     "a forgotten password on someone's behalf, or deactivate someone who's left — all "
     "of this is admin-only. \"Current Workload\" only counts a staff member's jobs that "
     "aren't finished yet, so it reflects what they're actually carrying right now."),
    ("p",
     "Export Staff List (PDF) works the same way as the client export, with the same "
     "letterhead."),

    ("h1", "8. Notifications and Search"),
    ("p",
     "The bell icon top-right keeps you posted on everything relevant to you — new "
     "comments, payments, design approvals — and marks itself read as you open each "
     "one. The search bar next to it searches jobs and clients live as you type, from "
     "anywhere in the admin portal."),

    ("h1", "9. Your Account"),
    ("p",
     "Change your password any time from Settings. Your profile page lets you update "
     "your name and phone number — your email address is fixed, since it's how you log "
     "in."),
]


# ---------------------------------------------------------------------------
# STAFF MANUAL
# ---------------------------------------------------------------------------

STAFF_BLOCKS = [
    ("h1", "1. Signing In"),
    ("p",
     "Everyone signs in at the same login page — you'll land in the Staff Portal "
     "automatically once you log in with your staff account."),
    ("p",
     "If you forget your password, use \"Forgot Password?\" on the login screen. Unlike "
     "before, you can also change your own password any time once you're logged in — "
     "just go to Settings in the sidebar."),

    ("h1", "2. Your Dashboard"),
    ("p",
     "Your dashboard is scoped to you: jobs assigned to you or created by you. It shows "
     "your active jobs, anything due soon, pending design reviews, and completed jobs. "
     "\"Active\" excludes anything already Completed or Cancelled, so a finished job "
     "won't linger in your active count."),

    ("h1", "3. Creating and Managing Jobs"),
    ("h2", "Creating a job"),
    ("p",
     "From Job Management, click Create Job. The Job ID is suggested for you but "
     "editable — it just needs to be unique. Pick the client, add order items with "
     "their specs (product, size, material, print type, and so on), save each item, "
     "then click Predict Cost."),
    ("p",
     "The number Predict Cost gives you is the total cost for the job — not a per-unit "
     "price, so don't multiply it by the quantity. If you adjust an item after "
     "predicting, use Re-Predict Cost to get an updated number."),
    ("p",
     "You can see the predicted cost, but the client never does — they only ever see "
     "the Final Approved Cost, which you (or an admin) set explicitly. There's a "
     "\"Use Predicted Cost\" button if the model's number is what you want to charge."),
    ("p",
     "If the job needs transport, turn on Transportation and fill in the distance — "
     "it's required once that switch is on."),
    ("h2", "Editing a job"),
    ("p",
     "Use Edit Job and Edit Order Details on the job's page to update anything after "
     "creation. You can update progress, upload designs, and manage payments on any job "
     "assigned to you or that you created — but deleting a job is admin-only, so if a "
     "job genuinely needs to be removed, ask an admin."),
    ("tip",
     "Job and payment lists are click-anywhere-on-the-row now — you don't need to look "
     "for a separate \"View\" link."),

    ("h1", "4. Designs and Client Feedback"),
    ("p",
     "Upload New Version on a job's page attaches a design file and asks whether to "
     "watermark the preview. Watermarking only applies to image files — PDFs are "
     "protected by access control instead (the client can't download the original "
     "either way until the job's fully paid)."),
    ("p",
     "Comments are colour-coded by role — blue for staff, purple for admin, green for "
     "client — so it's easy to follow a conversation. You can reply directly to any "
     "comment with the reply icon. You can edit your own comments, but only an admin "
     "can delete a staff comment if it needs to come down — you can't delete your own "
     "once posted."),

    ("h1", "5. Payments and Invoices"),
    ("p",
     "You can log a payment on behalf of a client (for a cash payment, for example), "
     "but you'll always need to attach a slip — image or PDF — there's no way around "
     "that anymore, for any role."),
    ("p",
     "Verify or Reject a pending payment from the job page or the Payments section. "
     "Rejecting opens a small dialog where you write the reason, which the uploader "
     "sees so they know what to correct."),
    ("p",
     "Every payment table shows an Outstanding column so you can tell what's still "
     "owed on a job at a glance."),
    ("p",
     "Invoices aren't generated automatically — once a job is billed, upload the "
     "invoice file yourself from the job's Invoice section."),

    ("h1", "6. Clients"),
    ("p",
     "You can view the client list and each client's active job count, but activating "
     "or deactivating a client account is an admin-only action."),

    ("h1", "7. Notifications and Search"),
    ("p",
     "The bell icon shows you anything relevant — new comments, payment activity, "
     "design approvals on your jobs. The search bar finds jobs and clients as you "
     "type, from anywhere in the portal."),

    ("h1", "8. Your Account"),
    ("p",
     "Settings lets you change your own password whenever you need to. Your profile "
     "page lets you update your name and phone number — your email is fixed, since "
     "it's what you log in with."),
]


# ---------------------------------------------------------------------------
# CLIENT MANUAL
# ---------------------------------------------------------------------------

CLIENT_BLOCKS = [
    ("h1", "1. Signing In"),
    ("p",
     "Go to the JobQuant login page and sign in with the email and password Hansi "
     "Graphics set up for you. If you've forgotten your password, click "
     "\"Forgot Password?\" and follow the reset link — it's valid for 30 minutes."),

    ("h1", "2. Your Dashboard"),
    ("p",
     "As soon as you log in you'll see an overview of your orders: how many are "
     "active, how many are waiting on your approval, how many are completed, and what "
     "you currently owe. Below that is a list of your recent orders and a Payment "
     "Summary showing your outstanding balance, what you've paid so far this month, "
     "and your next due date."),

    ("h1", "3. Your Orders"),
    ("p",
     "My Orders lists every job you've placed with Hansi Graphics. Click any order to "
     "open its full details — job type, dimensions, materials, whether transport is "
     "included, any notes from staff, and a timeline showing exactly what stage it's "
     "at, from Pending through to Completed."),
    ("tip",
     "You won't see a predicted or estimated cost anywhere — only the Final Approved "
     "Cost once staff have confirmed it. That's the number you'll actually be billed."),

    ("h1", "4. Reviewing Designs"),
    ("p",
     "Once staff upload a design for your order, it appears under Design Versions on "
     "the order's page. Click View Preview to see it — you won't be able to download "
     "the original, unwatermarked file until the order is fully paid."),
    ("p",
     "If you're happy with a design, click Approve Design. If you have feedback, leave "
     "it as a comment underneath the design instead — staff will see it and can reply "
     "directly to your comment, and you can reply to theirs too, so it stays as one "
     "clear conversation rather than scattered messages."),
    ("p",
     "You can edit or delete your own comments at any time."),

    ("h1", "5. Payments"),
    ("h2", "Uploading a payment slip"),
    ("p",
     "From an order's page, scroll to Payments and fill in the amount and payment "
     "method, then attach a photo or PDF of your slip using Choose File — this is "
     "required, the system won't let you submit a payment without it."),
    ("p",
     "Staff will Verify or Reject your payment once they've checked it. If it's "
     "rejected, you'll see the reason they gave, and you can upload a corrected slip."),
    ("h2", "Your payment history"),
    ("p",
     "The Payments section in the sidebar lists every payment you've made across all "
     "your orders, along with what's still outstanding on each one. You can delete a "
     "slip you uploaded by mistake, but only while it's still Pending or if it was "
     "Rejected — once staff verify a payment, it's locked in as part of the record and "
     "can no longer be removed."),

    ("h1", "6. Notifications"),
    ("p",
     "The bell icon at the top of the page tells you when there's something new — a "
     "staff reply, a design uploaded, a payment verified or rejected, an invoice ready. "
     "Click a notification to jump straight to what it's about."),

    ("h1", "7. Your Account"),
    ("p",
     "Update your name, phone number or company from My Profile, and change your "
     "password any time from Settings."),

    ("h1", "8. Getting Help"),
    ("p",
     "If anything's unclear or something looks wrong with an order, reach out to "
     "Hansi Graphics &amp; Advertising directly — their contact details are always shown "
     "in the \"Need Help?\" box in your sidebar:"),
    ("bullets", [
        "Email: hansigraphics@gmail.com",
        "Phone: 0753 661 661",
    ]),
]


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    build("Administrator Guide", "JobQuant-Admin-Manual.pdf", "Administrator Guide", ADMIN_BLOCKS)
    build("Staff Guide", "JobQuant-Staff-Manual.pdf", "Staff Guide", STAFF_BLOCKS)
    build("Client Guide", "JobQuant-Client-Manual.pdf", "Client Guide", CLIENT_BLOCKS)


if __name__ == "__main__":
    main()
