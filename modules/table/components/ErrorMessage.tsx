
import React from 'react';
import { motion } from "framer-motion";
import { AlertCircle } from 'lucide-react';
import { Button } from "@/modules/table/components/ui/button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <motion.div 
      className="w-full mt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 flex flex-col items-center text-center">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-medium mb-2">Unable to load data</h3>
        <p className="text-muted-foreground mb-4 max-w-md">{message}</p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline" 
            className="border-destructive/20 hover:bg-destructive/10 text-foreground"
          >
            Try Again
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorMessage;
