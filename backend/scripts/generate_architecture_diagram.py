"""Generates the JobQuant High-Level Architecture Diagram as a PDF.

A single landscape page: three layers (Frontend / Backend / Data & External
Services) connected top-to-bottom by labelled arrows, drawn directly with
reportlab's low-level canvas so box positions and wrapping are exact.

Run with the backend venv:
    venv\\Scripts\\python.exe scripts\\generate_architecture_diagram.py

Output goes to docs/architecture/JobQuant-Architecture-Diagram.pdf.
"""

import os

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO_ROOT = os.path.dirname(BACKEND_DIR)
OUT_DIR = os.path.join(REPO_ROOT, "docs", "architecture")

INK = colors.HexColor("#0F172A")
SLATE = colors.HexColor("#475569")
ORANGE = colors.HexColor("#FF6B00")
WHITE = colors.white

LAYER_FRONTEND = colors.HexColor("#EFF6FF")
LAYER_BACKEND = colors.HexColor("#FFF7ED")
LAYER_DATA = colors.HexColor("#F0FDF4")
BORDER_FRONTEND = colors.HexColor("#93C5FD")
BORDER_BACKEND = colors.HexColor("#FDBA74")
BORDER_DATA = colors.HexColor("#86EFAC")

SUBBOX_FILL = WHITE

PAGE_W, PAGE_H = landscape(A4)
MARGIN = 26


def draw_layer_container(c, x, y, w, h, label, fill, border):
    c.setFillColor(fill)
    c.setStrokeColor(border)
    c.setLineWidth(1.2)
    c.roundRect(x, y, w, h, 10, fill=1, stroke=1)
    c.setFillColor(SLATE)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(x + 10, y + h - 13, label.upper())


def draw_subbox(c, x, y, w, h, title, lines, title_color=INK, border=None):
    c.setFillColor(SUBBOX_FILL)
    c.setStrokeColor(border or colors.HexColor("#CBD5E1"))
    c.setLineWidth(1)
    c.roundRect(x, y, w, h, 6, fill=1, stroke=1)

    c.setFillColor(title_color)
    c.setFont("Helvetica-Bold", 9.3)
    c.drawCentredString(x + w / 2, y + h - 15, title)

    c.setFont("Helvetica", 7.3)
    c.setFillColor(SLATE)
    line_y = y + h - 28
    for line in lines:
        c.drawCentredString(x + w / 2, line_y, line)
        line_y -= 9.5


def draw_arrow(c, x1, y1, x2, y2, color=INK, dashed=False, width=1.3):
    c.setStrokeColor(color)
    c.setLineWidth(width)
    if dashed:
        c.setDash(3, 2)
    else:
        c.setDash()
    c.line(x1, y1, x2, y2)
    c.setDash()

    # arrowhead pointing from (x1,y1) toward (x2,y2)
    import math
    angle = math.atan2(y2 - y1, x2 - x1)
    ah = 6
    a1 = angle + math.radians(150)
    a2 = angle - math.radians(150)
    p1 = (x2 + ah * math.cos(a1), y2 + ah * math.sin(a1))
    p2 = (x2 + ah * math.cos(a2), y2 + ah * math.sin(a2))
    c.setFillColor(color)
    path = c.beginPath()
    path.moveTo(x2, y2)
    path.lineTo(*p1)
    path.lineTo(*p2)
    path.close()
    c.drawPath(path, fill=1, stroke=0)


def centered_label(c, x, y, text, size=7.6, color=SLATE, bold=False):
    c.setFont("Helvetica-Bold" if bold else "Helvetica-Oblique", size)
    c.setFillColor(color)
    c.drawCentredString(x, y, text)


def build():
    if not os.path.exists(OUT_DIR):
        os.makedirs(OUT_DIR)

    path = os.path.join(OUT_DIR, "JobQuant-Architecture-Diagram.pdf")
    c = canvas.Canvas(path, pagesize=landscape(A4))

    # ---------------- Title ----------------
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 17)
    c.drawString(MARGIN, PAGE_H - 34, "JobQuant — High-Level Architecture")
    c.setFont("Helvetica", 9.5)
    c.setFillColor(SLATE)
    c.drawString(MARGIN, PAGE_H - 49, "Hansi Graphics & Advertising (Pvt) Ltd.  ·  ML-assisted print-job management system")

    content_w = PAGE_W - 2 * MARGIN

    # ================= Layer 1: Frontend =================
    l1_h = 92
    l1_y = PAGE_H - 49 - 14 - l1_h
    draw_layer_container(
        c, MARGIN, l1_y, content_w, l1_h,
        "Presentation Layer  —  Next.js 16 / React 19 / TypeScript / Tailwind CSS (frontend/)",
        LAYER_FRONTEND, BORDER_FRONTEND,
    )
    gap = 14
    n = 3
    sb_w = (content_w - 2 * 16 - (n - 1) * gap) / n
    sb_h = l1_h - 26
    sb_y = l1_y + 8
    portals = [
        ("Admin Portal", ["Staff & client mgmt,", "job oversight, analytics"]),
        ("Staff Portal", ["Job execution, design", "upload, payment review"]),
        ("Client Portal", ["Order tracking, design", "approval, payments"]),
    ]
    portal_x = []
    x = MARGIN + 16
    for title, lines in portals:
        draw_subbox(c, x, sb_y, sb_w, sb_h, title, lines, border=BORDER_FRONTEND)
        portal_x.append(x + sb_w / 2)
        x += sb_w + gap

    # ================= Arrow 1 =================
    a1_y_top = l1_y
    a1_y_bot = a1_y_top - 34
    mid_x = MARGIN + content_w / 2
    draw_arrow(c, mid_x, a1_y_top, mid_x, a1_y_bot + 6)
    centered_label(c, mid_x + 150, (a1_y_top + a1_y_bot) / 2 + 4,
                    "HTTPS / REST (JSON) — Authorization: Bearer <JWT>", bold=True, color=INK)
    centered_label(c, mid_x + 150, (a1_y_top + a1_y_bot) / 2 - 7,
                    "axios client · sessionStorage token (per browser tab)")

    # ================= Layer 2: Backend =================
    l2_h = 110
    l2_y = a1_y_bot - l2_h
    draw_layer_container(
        c, MARGIN, l2_y, content_w, l2_h,
        "Application Layer  —  FastAPI Backend, Python (backend/app/)",
        LAYER_BACKEND, BORDER_BACKEND,
    )
    widths_ratio = [0.26, 0.48, 0.26]
    labels2 = [
        ("Auth & Security", [
            "JWT issuance (python-jose),",
            "bcrypt password hashing,",
            "slowapi rate limiting",
        ]),
        ("Route Handlers / Business Logic", [
            "Jobs · Designs · Payments · Invoices",
            "Staff · Clients · Notifications · Dashboard",
            "Role-based access control (RBAC)",
        ]),
        ("ML Prediction Service", [
            "Loads trained model via joblib,",
            "builds feature frame with pandas,",
            "returns predicted cost",
        ]),
    ]
    sb_h2 = l2_h - 26
    sb_y2 = l2_y + 8
    x = MARGIN + 16
    avail = content_w - 32 - (len(labels2) - 1) * gap
    box2_x = []
    for (title, lines), ratio in zip(labels2, widths_ratio):
        w = avail * ratio
        draw_subbox(c, x, sb_y2, w, sb_h2, title, lines, border=BORDER_BACKEND)
        box2_x.append((x, w))
        x += w + gap

    # ================= Arrows 2 (backend -> data/services) =================
    a2_y_top = l2_y
    a2_y_bot = a2_y_top - 30

    # ================= Layer 3: Data & external services (4 boxes) =================
    l3_h = 118
    l3_y = a2_y_bot - l3_h
    n3 = 4
    gap3 = 14
    sb_w3 = (content_w - (n3 - 1) * gap3) / n3
    boxes3 = [
        ("SQLite Database", [
            "backend/jobquant.db",
            "Users, Jobs, Job Items,",
            "Job Progress, Designs,",
            "Comments, Payments,",
            "Invoices, Notifications,",
            "Password Reset Tokens",
        ], LAYER_DATA, BORDER_DATA),
        ("File Storage", [
            "backend/uploads/",
            "designs/ · watermarks/",
            "payment_slips/",
            "invoices/",
            "(watermarking via Pillow)",
        ], LAYER_DATA, BORDER_DATA),
        ("ML Model Artifact", [
            "ml-model/models/",
            "jobquant_final_random_",
            "forest_model.pkl",
            "(scikit-learn Random",
            "Forest, loaded once)",
        ], LAYER_DATA, BORDER_DATA),
        ("SMTP Email Service", [
            "Password-reset emails",
            "(external mail server)",
            "Optional: falls back to",
            "an in-app reset link",
            "if not configured",
        ], colors.HexColor("#FEF2F2"), colors.HexColor("#FCA5A5")),
    ]
    x = MARGIN
    box3_x = []
    for title, lines, fill, border in boxes3:
        draw_layer_container(c, x, l3_y, sb_w3, l3_h, "", fill, border)
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 9.6)
        c.drawCentredString(x + sb_w3 / 2, l3_y + l3_h - 20, title)
        c.setFont("Helvetica", 7.4)
        c.setFillColor(SLATE)
        ly = l3_y + l3_h - 34
        for line in lines:
            c.drawCentredString(x + sb_w3 / 2, ly, line)
            ly -= 10
        box3_x.append(x + sb_w3 / 2)
        x += sb_w3 + gap3

    # Fan a single trunk line out from the middle of the Application layer's
    # bottom edge down to each of the four data/service boxes below — a
    # high-level diagram shouldn't claim a specific backend sub-component
    # talks to a specific store, since several of them (e.g. route handlers)
    # touch all of these.
    trunk_x = mid_x
    trunk_y_top = a2_y_top
    trunk_y_mid = a2_y_top - 14
    c.setStrokeColor(INK)
    c.setLineWidth(1.3)
    c.setDash()
    c.line(trunk_x, trunk_y_top, trunk_x, trunk_y_mid)

    draw_arrow(c, trunk_x, trunk_y_mid, box3_x[0], l3_y + l3_h)
    draw_arrow(c, trunk_x, trunk_y_mid, box3_x[1], l3_y + l3_h)
    draw_arrow(c, trunk_x, trunk_y_mid, box3_x[2], l3_y + l3_h)
    draw_arrow(c, trunk_x, trunk_y_mid, box3_x[3], l3_y + l3_h, dashed=True, color=SLATE)

    centered_label(c, box3_x[0] + 6, trunk_y_mid - 12, "SQLAlchemy ORM", size=7)
    centered_label(c, box3_x[3] - 20, trunk_y_mid - 12, "SMTP (optional)", size=7)

    # ---------------- Footer / legend ----------------
    c.setFont("Helvetica", 7.6)
    c.setFillColor(SLATE)
    c.drawString(MARGIN, 16, "Solid arrow = data/API flow used on every request      "
                              "Dashed arrow = optional/conditional flow      "
                              "Each portal is served by the same Next.js app; role is enforced by the JWT and re-checked on every backend route.")

    c.showPage()
    c.save()
    print(f"Wrote {path}")


if __name__ == "__main__":
    build()
