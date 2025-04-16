
/**
 * Utilities for exporting data in various formats
 */ 
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Function to generate a clean filename with current date
export const generateFilename = (baseName: string): string => {
  const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10);
  return `${baseName}-${formattedDate}`;
};

// Export data to Excel
export const exportToExcel = (data: any[], fileName: string): void => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    
    // Save the file
    saveAs(fileData, `${generateFilename(fileName)}.xlsx`);
  } catch (error) {
    console.error('Excel export error:', error);
    throw error;
  }
};

// Export data to CSV
export const exportToCSV = (data: any[], fileName: string): void => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const fileData = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    
    // Save the file
    saveAs(fileData, `${generateFilename(fileName)}.csv`);
  } catch (error) {
    console.error('CSV export error:', error);
    throw error;
  }
};

// Export data to JSON
export const exportToJSON = (data: any[], fileName: string): void => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const fileData = new Blob([jsonString], { type: 'application/json' });
    
    // Save the file
    saveAs(fileData, `${generateFilename(fileName)}.json`);
  } catch (error) {
    console.error('JSON export error:', error);
    throw error;
  }
};

// Export data to PDF
export const exportToPDF = (data: any[], fileName: string, columns: string[]): void => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(`${fileName}`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    
    // Prepare data for table
    const tableData = data.map(item => {
      return columns.map(col => {
        const value = item[col];
        return value !== undefined ? String(value) : '';
      });
    });
    
    // Column headers
    const tableHeaders = columns.map(col => {
      // Convert camelCase to Title Case
      return col.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    });
    
    // Add table to PDF
    (doc as any).autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 30,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 139, 202], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
    
    // Save the PDF
    doc.save(`${generateFilename(fileName)}.pdf`);
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
};
