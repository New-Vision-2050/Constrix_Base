
import React, { useState } from 'react';
import { Copy, Check, FileJson } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/modules/table/components/ui/button';
import { Card, CardHeader, CardContent } from '@/modules/table/components/ui/card';
import { useToast } from '@/modules/table/hooks//use-toast';

interface FormResultsDisplayProps {
  formValues: Record<string, any>;
}

const FormResultsDisplay: React.FC<FormResultsDisplayProps> = ({ formValues }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Function to prettify JSON
  const prettifyJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  const isEmpty = Object.keys(formValues).length === 0;

  if (isEmpty) {
    return null;
  }

  const handleCopy = () => {
    const jsonString = prettifyJson(formValues);
    navigator.clipboard.writeText(jsonString)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "The form data has been copied to your clipboard.",
          duration: 3000,
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        toast({
          title: "Failed to copy",
          description: "There was an error copying the data. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <Card className="mt-8 mx-auto max-w-4xl border border-border/60 shadow-md bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Submitted Form Data</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "transition-all duration-200",
              copied ? "bg-green-50 text-green-600 border-green-200" : "hover:bg-accent"
            )}
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" /> Copy JSON
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="bg-muted/50 rounded-md border border-border/30 p-4 relative overflow-hidden">
          <pre className="text-xs sm:text-sm font-mono overflow-auto max-h-[400px] text-left">
            {prettifyJson(formValues)}
          </pre>
          
          {/* Subtle gradient overlay to indicate scrollable content */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/70 to-transparent pointer-events-none"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormResultsDisplay;
