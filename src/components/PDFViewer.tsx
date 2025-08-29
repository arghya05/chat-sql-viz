import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface PDFViewerProps {
  filename: string;
  onClose: () => void;
}

export const PDFViewer = ({ filename, onClose }: PDFViewerProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPDF();
  }, [filename]);

  const loadPDF = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:9090/get-pdf/${encodeURIComponent(filename)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load PDF: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      
      toast.success('PDF loaded successfully');
    } catch (error) {
      console.error('Error loading PDF:', error);
      setError('Failed to load PDF document');
      toast.error('Failed to load PDF document');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('PDF download started');
    }
  };

  const openInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  // Cleanup URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <div className="w-full h-full bg-background flex flex-col">
      <Card className="rounded-none border-0 h-full flex flex-col shadow-none bg-transparent">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm">Customer Insights</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {filename}
            </Badge>
            
            {pdfUrl && (
              <div className="flex gap-1 ml-auto">
                <Button variant="outline" size="sm" onClick={downloadPDF}>
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={openInNewTab}>
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Open
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 min-h-0">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading PDF...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-destructive">
                <FileText className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">{error}</p>
                <Button variant="outline" size="sm" onClick={loadPDF} className="mt-2">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {pdfUrl && !isLoading && !error && (
            <div className="w-full h-full">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full h-full border-0"
                title={`PDF Viewer - ${filename}`}
                style={{ minHeight: '500px' }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};