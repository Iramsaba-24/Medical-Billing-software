// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// export const downloadAsPDF = async (elementId: string, fileName: string) => {
//   const input = document.getElementById(elementId);
//   if (!input) return;

//   const canvas = await html2canvas(input);
//   const imgData = canvas.toDataURL('image/png');

//   const pdf = new jsPDF('p', 'mm', 'a4');
//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//   pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//   pdf.save(`${fileName}.pdf`);
// };


// import jsPDF from 'jspdf'; // Use this if required by your setup
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'; 

export const downloadAsPDF = async (elementId: string, fileName: string) => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  // Calculate the total height of the content
  const originalHeight = input.style.height;
  const originalOverflow = document.body.style.overflow;
  
  // Temporarily expand the element's height to capture everything
  input.style.height = `${input.scrollHeight}px`;
  document.body.style.overflow = 'hidden'; // Hide scrollbar during capture

  try {
    const canvas = await html2canvas(input, {
      scale: 2, // Higher scale for better quality
      useCORS: true // Handle images better
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}.pdf`);

  } catch (error) {
    console.error("Error during PDF generation:", error);
  } finally {
    // Restore original styles
    input.style.height = originalHeight;
    document.body.style.overflow = originalOverflow;
  }
};
