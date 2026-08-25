import type jsPDF from "jspdf";

const LOGO_PATH = "/logo-1.png";
const LOGO_ASPECT_RATIO = 566 / 2202;

export async function loadImageAsDataUrl(path: string): Promise<string> {
  const response = await fetch(path);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Draws the shared company letterhead (logo, report title, generated-on
 * date, divider) at the top of a jsPDF document and returns the y-position
 * the caller should start its table/content at.
 */
export async function addPdfLetterhead(doc: jsPDF, title: string): Promise<number> {
  const logoWidth = 55;
  const logoHeight = logoWidth * LOGO_ASPECT_RATIO;

  try {
    const logoDataUrl = await loadImageAsDataUrl(LOGO_PATH);
    doc.addImage(logoDataUrl, "PNG", 14, 10, logoWidth, logoHeight);
  } catch {
    // If the logo can't be loaded, fall back to a text-only header rather
    // than failing the export.
  }

  const titleY = 10 + logoHeight + 10;

  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(title, 14, titleY);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, titleY + 6);

  doc.setDrawColor(230, 230, 230);
  doc.line(14, titleY + 10, 196, titleY + 10);

  return titleY + 16;
}
