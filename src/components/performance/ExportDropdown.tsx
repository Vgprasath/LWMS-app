
import React from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';
import { toast } from '@/hooks/use-toast';

interface ExportDropdownProps {
  data: any[];
  fileName: string;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ data, fileName }) => {
  // Define columns to include in exports
  const columns = ['id', 'title', 'type', 'department', 'startDate', 'endDate', 'createdAt', 'status'];
  
  const handleExportToExcel = () => {
    try {
      if (!data || data.length === 0) {
        toast({
          variant: "destructive",
          title: "Export Failed",
          description: "No data available to export.",
        });
        return;
      }
      
      exportToExcel(data, fileName);
      toast({
        title: "Export Successful",
        description: `${fileName} has been exported to Excel.`,
      });
    } catch (error) {
      console.error('Export to Excel failed:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting to Excel.",
      });
    }
  };
  
  const handleExportToPDF = () => {
    try {
      if (!data || data.length === 0) {
        toast({
          variant: "destructive",
          title: "Export Failed",
          description: "No data available to export.",
        });
        return;
      }
      
      exportToPDF(data, fileName, columns);
      toast({
        title: "Export Successful",
        description: `${fileName} has been exported to PDF.`,
      });
    } catch (error) {
      console.error('Export to PDF failed:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting to PDF.",
      });
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="flex items-center gap-2">
          <Download size={16} />
          <span>Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportToExcel} className="cursor-pointer">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Excel (.xlsx)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportToPDF} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4" />
          <span>PDF (.pdf)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDropdown;
