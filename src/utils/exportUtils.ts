
/**
 * Utilities for exporting data in various formats
 */ 
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// Function to generate a clean filename with current date
export const generateFilename = (baseName: string): string => {
  const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10);
  return `${baseName}-${formattedDate}`;
};

// Export data to Excel
export const exportToExcel = (data: any[], fileName: string): void => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
  // Save the file
  saveAs(fileData, `${generateFilename(fileName)}.xlsx`);
};

// Export data to CSV
export const exportToCSV = (data: any[], fileName: string): void => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const fileData = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  
  // Save the file
  saveAs(fileData, `${generateFilename(fileName)}.csv`);
};

// Export data to JSON
export const exportToJSON = (data: any[], fileName: string): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const fileData = new Blob([jsonString], { type: 'application/json' });
  
  // Save the file
  saveAs(fileData, `${generateFilename(fileName)}.json`);
};
