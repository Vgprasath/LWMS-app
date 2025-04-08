
/**
 * Utilities for exporting data in various formats
 */

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// Function to generate a clean filename with current date
export const generateFilename = (baseName: string, extension: string) => {
  const now = new Date();
  const datePart = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  const timePart = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
  return `${baseName}_${datePart}_${timePart}.${extension}`;
};

// Export to CSV
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) {
    console.warn('No data to export');
    return;
  }
  
  try {
    // Get headers
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle special characters, quotes, commas
          const cellValue = value === null || value === undefined ? '' : String(value);
          // Escape quotes and wrap in quotes if contains comma or quote
          return cellValue.includes(',') || cellValue.includes('"') 
            ? `"${cellValue.replace(/"/g, '""')}"`
            : cellValue;
        }).join(',')
      )
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, generateFilename(filename, 'csv'));
  } catch (error) {
    console.error('Error exporting to CSV:', error);
  }
};

// Export to Excel
export const exportToExcel = (data: any[], filename: string) => {
  if (!data || !data.length) {
    console.warn('No data to export');
    return;
  }
  
  try {
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Download
    saveAs(blob, generateFilename(filename, 'xlsx'));
  } catch (error) {
    console.error('Error exporting to Excel:', error);
  }
};

// Export to JSON
export const exportToJSON = (data: any[], filename: string) => {
  if (!data || !data.length) {
    console.warn('No data to export');
    return;
  }
  
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    saveAs(blob, generateFilename(filename, 'json'));
  } catch (error) {
    console.error('Error exporting to JSON:', error);
  }
};

// Function to let user choose export format
export const exportData = (data: any[], filename: string, format: 'csv' | 'excel' | 'json' = 'excel') => {
  switch (format) {
    case 'csv':
      exportToCSV(data, filename);
      break;
    case 'excel':
      exportToExcel(data, filename);
      break;
    case 'json':
      exportToJSON(data, filename);
      break;
    default:
      exportToExcel(data, filename);
  }
};
