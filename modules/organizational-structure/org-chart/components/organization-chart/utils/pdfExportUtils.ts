
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from '@/components/ui/sonner';

export const exportChartAsPDF = async (element: HTMLElement | null, filename: string = 'organization-chart.pdf'): Promise<void> => {
  if (!element) {
    toast("Export Failed", {
      description: "Could not find the chart element to export",
      // Using 'error' instead of 'variant: "destructive"'
      style: { backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" },
    });
    return;
  }

  try {
    toast("Preparing PDF", {
      description: "Please wait while we generate your PDF...",
    });

    // Create a clone of the element to modify for better PDF rendering
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Temporarily add the cloned element to the DOM with fixed width and height
    clonedElement.style.overflow = 'visible';
    clonedElement.style.width = `${element.scrollWidth}px`;
    clonedElement.style.height = `${element.scrollHeight}px`;
    clonedElement.style.position = 'absolute';
    clonedElement.style.top = '-9999px';
    clonedElement.style.left = '-9999px';
    document.body.appendChild(clonedElement);
    
    // Generate canvas from the cloned DOM element
    const canvas = await html2canvas(clonedElement, {
      scale: 1.5, // Higher quality
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: clonedElement.scrollWidth,
      windowHeight: clonedElement.scrollHeight,
    });
    
    // Remove the cloned element after canvas creation
    document.body.removeChild(clonedElement);
    
    // Calculate PDF dimensions based on content
    const contentWidth = canvas.width;
    const contentHeight = canvas.height;
    
    // A4 dimensions in points (595.28 x 841.89)
    const pdfWidth = 595.28;
    let pdfHeight = (contentHeight * pdfWidth) / contentWidth;
    
    // Create PDF with content dimensions
    const orientation = contentWidth > contentHeight ? 'landscape' : 'portrait';
    const pdf = new jsPDF(orientation as any, 'pt', [pdfWidth, pdfHeight]);
    
    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Save the PDF
    pdf.save(filename);
    
    toast("PDF Exported Successfully", {
      description: `Your organization chart has been exported to ${filename}`,
    });
  } catch (error) {
    console.error('Error exporting chart as PDF:', error);
    toast("Export Failed", {
      description: "An error occurred while exporting the chart",
      // Using 'error' instead of 'variant: "destructive"'
      style: { backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" },
    });
  }
};
