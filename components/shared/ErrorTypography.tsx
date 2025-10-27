"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ErrorTypographyProps {
  children?: React.ReactNode;
  message?: React.ReactNode;
  className?: string;
}

export default function ErrorTypography({
  children,
  className,
  message,
}: ErrorTypographyProps) {
  const error = message || children;

  return (
    <AnimatePresence mode="wait">
      {error ? (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: 1,
            height: "auto",
            transition: { duration: 0.3, ease: "easeOut" },
          }}
          exit={{
            opacity: 0,
            height: 0,
            transition: { duration: 0.2, ease: "easeIn" },
          }}
          className={cn(
            "text-sm text-destructive mt-1 flex items-center gap-1",
            className
          )}
        >
          {error}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}
