
import React, { useState } from 'react';
import { Button } from "@/modules/table/components/ui/button";
import { Input } from "@/modules/table/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface URLInputProps {
  onSubmit: (url: string) => void;
}

const URLInput: React.FC<URLInputProps> = ({ onSubmit }) => {
  const [url, setUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }
    
    setIsValidating(true);
    
    // Simple URL validation
    try {
      // Add protocol if not present
      let validUrl = url;
      if (!/^https?:\/\//i.test(url)) {
        validUrl = 'https://' + url;
      }
      
      new URL(validUrl);
      
      // Submit after short delay to show validation animation
      setTimeout(() => {
        onSubmit(validUrl);
        setIsValidating(false);
      }, 600);
    } catch (err) {
      setIsValidating(false);
      toast.error('Please enter a valid URL');
    }
  };

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter API or JSON URL (e.g., https://jsonplaceholder.typicode.com/users)"
            className="flex-1 h-12 px-4 text-base placeholder:text-muted-foreground/70 bg-background border-input focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
            disabled={isValidating}
          />
          <Button 
            type="submit" 
            variant="default"
            className={`h-12 px-6 text-base ${isValidating ? 'opacity-80' : ''}`}
            disabled={isValidating}
          >
            {isValidating ? (
              <span className="flex items-center gap-2">
                <span className="inline-block h-4 w-4 rounded-full border-2 border-foreground/10 border-t-primary animate-spin" />
                Validating
              </span>
            ) : (
              'Generate Table'
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Enter a URL that returns JSON data or an API endpoint
        </p>
      </form>
    </motion.div>
  );
};

export default URLInput;
