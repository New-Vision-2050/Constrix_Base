
import html2canvas from 'html2canvas';
import { toast } from '@/components/ui/sonner';

export const printChart = async (
  element: HTMLElement | null
): Promise<void> => {
  if (!element) {
    toast("Print Failed", {
      description: "Could not find the chart element to print",
      style: {
        backgroundColor: "hsl(var(--destructive))",
        color: "hsl(var(--destructive-foreground))",
      },
    });
    return;
  }

  try {
    toast("Preparing Chart", {
      description: "Generating print preview...",
    });

    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.overflow = "visible";
    clonedElement.style.padding = "16px";
    clonedElement.style.width = `${element.scrollWidth + 32}px`;
    clonedElement.style.height = `${element.scrollHeight + 32}px`;
    clonedElement.style.position = "absolute";
    clonedElement.style.top = "-9999px";
    clonedElement.style.left = "-9999px";
    document.body.appendChild(clonedElement);

    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: clonedElement.scrollWidth,
      windowHeight: clonedElement.scrollHeight,
    });

    document.body.removeChild(clonedElement);

    const dataUrl = canvas.toDataURL("image/png");

    // Create a printable HTML document
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      throw new Error("Failed to open print window");
    }

    printWindow.document.write(`
        <html>
          <head>
            <title>Print Chart</title>
            <style>
              body, html {
                margin: 0;
                padding: 0;
                text-align: center;
              }
              img {
                max-width: 100%;
                height: auto;
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <img src="${dataUrl}" alt="Chart" />
          </body>
        </html>
      `);
    printWindow.document.close();
  } catch (error) {
    console.error("Error printing chart:", error);
    toast("Print Failed", {
      description: "An error occurred while trying to print the chart",
      style: {
        backgroundColor: "hsl(var(--destructive))",
        color: "hsl(var(--destructive-foreground))",
      },
    });
  }
};
