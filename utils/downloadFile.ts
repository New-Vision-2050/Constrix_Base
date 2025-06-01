import { Attachment } from "@/types/admin-request";

export const downloadFile = async (attachment: Attachment) => {
  try {
    // Create the download URL using our API endpoint
    const downloadUrl = `/api/download?url=${encodeURIComponent(attachment.url)}`;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    // Set the download filename
    const fileName = attachment.name || attachment.url.split('/').pop() || 'download';
    link.download = fileName;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading file:', error);
    // You might want to show an error message to the user here
  }
};
