// PDF Generation for Lead Magnets
// Simple approach: Download HTML files, users print to PDF using browser
// Alternative: Install jspdf + html2canvas for client-side generation

export function downloadHTML(magnetId: string, filename: string): void {
  const url = `/downloads/${filename}.html`;

  // Create download link
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Track download event
  if (window.gtag) {
    window.gtag('event', 'download', {
      event_category: 'lead_magnet',
      event_label: magnetId,
      file_type: 'html',
    });
  }
}

export function printToPDF(elementId: string, filename: string): void {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element ${elementId} not found`);
    return;
  }

  // Browser print dialog (Ctrl+P / Cmd+P)
  // User selects "Save as PDF"
  const printWindow = window.open(
    `/downloads/${filename}.html`,
    `_blank`
  );

  if (printWindow) {
    printWindow.focus();
    // Auto-trigger print dialog after page loads
    printWindow.addEventListener('load', () => {
      printWindow.print();
    });
  }

  // Track print request
  if (window.gtag) {
    window.gtag('event', 'print', {
      event_category: 'lead_magnet',
      event_label: filename,
    });
  }
}

// Helper to get download URL
export function getLeadMagnetDownloadUrl(filename: string): string {
  return `/downloads/${filename}.html`;
}
