import React, { useState } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, FileText, Loader2, Check, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface PDFExportProps {
  resumeRef: React.RefObject<HTMLDivElement>;
  resumeName?: string;
  className?: string;
}

type PaperSize = 'a4' | 'letter' | 'legal';
type Quality = 'standard' | 'high' | 'ultra';

const paperSizes: Record<PaperSize, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
  legal: { width: 215.9, height: 355.6 },
};

const PDFExport: React.FC<PDFExportProps> = ({
  resumeRef,
  resumeName = 'My Resume',
  className = '',
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Export settings
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [quality, setQuality] = useState<Quality>('high');
  const [includeLinks, setIncludeLinks] = useState(true);
  const [compress, setCompress] = useState(true);

  const getScale = (quality: Quality): number => {
    switch (quality) {
      case 'standard': return 1.5;
      case 'high': return 2;
      case 'ultra': return 3;
      default: return 2;
    }
  };

  const exportToPDF = async () => {
    if (!resumeRef.current) {
      console.error('Resume ref not found');
      return;
    }

    setIsExporting(true);
    setExportSuccess(false);

    try {
      const element = resumeRef.current;
      const scale = getScale(quality);
      
      // Capture the resume as canvas
      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // Get paper dimensions
      const { width: pdfWidth, height: pdfHeight } = paperSizes[paperSize];
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: paperSize,
        compress: compress,
      });

      // Calculate dimensions to fit the page
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Handle multi-page if content is longer than one page
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // Add metadata
      pdf.setProperties({
        title: resumeName,
        subject: 'Resume',
        author: 'Resumify',
        creator: 'Resumify - Professional Resume Builder',
      });

      // Save the PDF
      const fileName = `${resumeName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        setIsDialogOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const quickExport = async () => {
    if (!resumeRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${resumeName.replace(/[^a-z0-9]/gi, '_')}.pdf`);
    } catch (error) {
      console.error('Quick export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Quick Download Button */}
      <Button
        onClick={quickExport}
        disabled={isExporting}
        className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download PDF
          </>
        )}
      </Button>

      {/* Advanced Export Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" title="Export Settings">
            <Settings2 className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Export Settings
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Paper Size */}
            <div className="space-y-2">
              <Label>Paper Size</Label>
              <Select value={paperSize} onValueChange={(v) => setPaperSize(v as PaperSize)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4 (210 × 297 mm)</SelectItem>
                  <SelectItem value="letter">US Letter (8.5 × 11 in)</SelectItem>
                  <SelectItem value="legal">US Legal (8.5 × 14 in)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quality */}
            <div className="space-y-2">
              <Label>Export Quality</Label>
              <Select value={quality} onValueChange={(v) => setQuality(v as Quality)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (Smaller file)</SelectItem>
                  <SelectItem value="high">High (Recommended)</SelectItem>
                  <SelectItem value="ultra">Ultra (Larger file)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="compress">Compress PDF</Label>
                <Switch
                  id="compress"
                  checked={compress}
                  onCheckedChange={setCompress}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="links">Include hyperlinks</Label>
                <Switch
                  id="links"
                  checked={includeLinks}
                  onCheckedChange={setIncludeLinks}
                />
              </div>
            </div>
          </div>

          {/* Export Button */}
          <Button
            onClick={exportToPDF}
            disabled={isExporting}
            className="w-full gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating PDF...
              </>
            ) : exportSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export PDF
              </>
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PDFExport;
