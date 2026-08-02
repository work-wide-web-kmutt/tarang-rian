import { toJpeg, toPng } from "html-to-image";
import { jsPDF } from "jspdf";

export type ExportFormat = "png" | "jpg" | "pdf" | "json";

export async function exportAsImage(
  elementId: string,
  format: "png" | "jpg",
  scale = 2
): Promise<string> {
  const element = document.querySelector<HTMLElement>(`#${elementId}`);
  if (!element) {
    throw new Error("Element not found");
  }

  // Force capture of full scroll dimensions to handle parent scaling/overflow
  const width = element.scrollWidth;
  const height = element.scrollHeight;

  const options = {
    height,
    pixelRatio: scale,
    quality: 0.95,
    style: {
      margin: "0",
      // Prevent any potential transform inheritance issues.
      transform: "none",
    },
    width,
  };

  if (format === "png") {
    return await toPng(element, { ...options, backgroundColor: "transparent" });
  }
  // JPG doesn't support transparency, so force white background.
  // This will appear behind the element if the element is transparent.
  return await toJpeg(element, { ...options, backgroundColor: "#ffffff" });
}

export async function exportAsPdf(elementId: string): Promise<jsPDF> {
  const element = document.querySelector<HTMLElement>(`#${elementId}`);
  if (!element) {
    throw new Error("Element not found");
  }

  // Generate high-quality image first
  const imgData = await toPng(element, { pixelRatio: 2 });

  // A4 size in mm
  // Landscape A4.
  const pdfWidth = 297;
  const pdfHeight = 210;

  const pdf = new jsPDF({
    format: "a4",
    orientation: "landscape",
    unit: "mm",
  });

  const imgProps = pdf.getImageProperties(imgData);
  const ratio = imgProps.width / imgProps.height;

  let imgWidth = pdfWidth;
  let imgHeight = pdfWidth / ratio;

  // Scale down if height exceeds PDF height
  if (imgHeight > pdfHeight) {
    imgHeight = pdfHeight;
    imgWidth = pdfHeight * ratio;
  }

  const x = (pdfWidth - imgWidth) / 2;
  const y = (pdfHeight - imgHeight) / 2;

  pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
  return pdf;
}

export function downloadFile(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
