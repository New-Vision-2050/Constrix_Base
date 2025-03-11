
import React from 'react';
import { motion } from 'framer-motion';

const FormBuilderHeader: React.FC = () => {
  return (
    <header className="w-full py-12 px-6">
      <motion.div 
        className="max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div 
          className="inline-block mb-3"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="bg-primary/5 text-primary px-3 py-1 rounded-full text-sm font-medium inline-block">
            Dynamic Form Generation
          </div>
        </motion.div>
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight mb-4 text-foreground">
          Form Builder
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
          Create dynamic forms with validation using configuration files.
        </p>
      </motion.div>
    </header>
  );
};

export default FormBuilderHeader;
