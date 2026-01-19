import { toJpeg, toPng } from "html-to-image";
import { jsPDF } from "jspdf";

export type ExportFormat = "png" | "jpg" | "pdf" | "json";

export const exportAsImage = (
  elementId: string,
  format: "png" | "jpg",
  scale = 2
) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Element not found");
  }

  // Force capture of full scroll dimensions to handle parent scaling/overflow
  const width = element.scrollWidth;
  const height = element.scrollHeight;

  const options = {
    quality: 0.95,
    pixelRatio: scale,
    width,
    height,
    style: {
      transform: "none", // Prevent any potential transform inheritance issues
      margin: "0",
    },
  };

  if (format === "png") {
    return toPng(element, { ...options, backgroundColor: "transparent" });
  }
  // JPG doesn't support transparency, so force white background.
  // This will appear behind the element if the element is transparent.
  return toJpeg(element, { ...options, backgroundColor: "#ffffff" });
};

export const exportAsPdf = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Element not found");
  }

  // Generate high-quality image first
  const imgData = await toPng(element, { pixelRatio: 2 });

  // A4 size in mm
  const pdfWidth = 297; // Landscape A4
  const pdfHeight = 210;

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
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
};

export const downloadFile = (dataUrl: string, filename: string) => {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
};
