
import html2canvas from "html2canvas";

export const exportImage = async (
  canvasRef: React.RefObject<HTMLDivElement>,
  format: "png" | "jpg" = "png"
): Promise<void> => {
  if (!canvasRef.current) {
    throw new Error("Canvas reference is not available");
  }

  try {
    // Create a canvas from the DOM element
    const canvas = await html2canvas(canvasRef.current, {
      backgroundColor: null,
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS if images are from external domains
      logging: false,
    });

    // Convert canvas to a data URL
    const mimeType = format === "png" ? "image/png" : "image/jpeg";
    const dataUrl = canvas.toDataURL(mimeType, 1.0);

    // Create a download link and trigger the download
    const link = document.createElement("a");
    link.download = `labeled-image-${Date.now()}.${format}`;
    link.href = dataUrl;
    link.click();

    return Promise.resolve();
  } catch (error) {
    console.error("Error exporting image:", error);
    throw error;
  }
};
