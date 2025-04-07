
// Utility functions for exporting data

/**
 * Export data to CSV format
 * @param data Array of objects to export
 * @param filename Filename for the downloaded file
 */
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) {
    console.error('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvRows = [];
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values that might contain commas or quotes
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    });
    csvRows.push(values.join(','));
  }
  
  // Create CSV blob and download
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data to Excel format (actually CSV but with Excel extension)
 * @param data Array of objects to export
 * @param filename Filename for the downloaded file
 */
export const exportToExcel = (data: any[], filename: string) => {
  // Using CSV for Excel as well since browsers don't have native Excel export
  exportToCSV(data, `${filename}.xlsx`);
};

/**
 * Format performance data for export
 * @param metrics Performance metrics to format
 */
export const formatPerformanceDataForExport = (metrics: any[]) => {
  return metrics.map(metric => ({
    Name: metric.name,
    Value: metric.value,
    Target: metric.target,
    Unit: metric.unit,
    Period: metric.period,
    Trend: metric.trend,
    Date: new Date(metric.date).toLocaleDateString()
  }));
};
