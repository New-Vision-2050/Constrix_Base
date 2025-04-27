import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { HierarchyNode, HierarchyViewMode, HierarchyConfig } from '../types/hierarchyTypes';

/**
 * Export the hierarchy data to PDF format
 * 
 * @param data The hierarchy data to export
 * @param view The current view mode (tree or list)
 * @param config The hierarchy configuration
 * @returns Promise that resolves when the PDF is generated and downloaded
 */
export const exportToPdf = async (
  data: HierarchyNode,
  view: HierarchyViewMode,
  config: HierarchyConfig
): Promise<boolean> => {
  try {
    // Get the element to capture based on the view
    const elementId = view === 'tree' ? 'hierarchy-tree-view' : 'hierarchy-list-view';
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.error(`Element with ID "${elementId}" not found`);
      return false;
    }

    // Create a filename based on the data and current date
    const filename = `hierarchy-${view}-${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Use html2canvas to capture the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    // Add title
    pdf.setFontSize(16);
    pdf.text(`Hierarchy ${view === 'tree' ? 'Tree' : 'List'} View`, 105, 15, { align: 'center' });
    
    // Add date
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 22, { align: 'center' });
    
    // Add image
    pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight);
    heightLeft -= pageHeight - 30;
    
    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Save the PDF
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return false;
  }
};

/**
 * Export the hierarchy data to JSON format
 * 
 * @param data The hierarchy data to export
 * @returns The JSON string representation of the data
 */
export const exportToJson = (data: HierarchyNode): string => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    return '';
  }
};

/**
 * Download data as a file
 * 
 * @param data The data to download
 * @param filename The name of the file
 * @param type The MIME type of the file
 */
export const downloadFile = (data: string, filename: string, type: string): void => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.click();
  
  // Clean up
  URL.revokeObjectURL(url);
};

/**
 * Export the hierarchy data to a specific format and download it
 * 
 * @param data The hierarchy data to export
 * @param format The format to export to ('pdf' or 'json')
 * @param view The current view mode (for PDF export)
 * @param config The hierarchy configuration (for PDF export)
 */
export const exportAndDownload = async (
  data: HierarchyNode,
  format: 'pdf' | 'json',
  view?: HierarchyViewMode,
  config?: HierarchyConfig
): Promise<boolean> => {
  if (format === 'pdf' && view && config) {
    return exportToPdf(data, view, config);
  }
  
  if (format === 'json') {
    const jsonData = exportToJson(data);
    const filename = `hierarchy-data-${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(jsonData, filename, 'application/json');
    return true;
  }
  
  return false;
};