import { cn } from "@/lib/utils";
import { AnimatePresence, motion, MotionProps } from "framer-motion";
import React from "react";
import { memo } from "react";

interface AutoHeightProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  condition: boolean;
  children: React.ReactNode;
  transition?: MotionProps["transition"];
}

const AutoHeight = memo(
  ({ condition, className, children, ...rest }: AutoHeightProps) => {
    return (
      <AnimatePresence initial={false}>
        {condition && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={cn("overflow-hidden", className)}
            {...(rest as MotionProps)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

AutoHeight.displayName = "AutoHeight";

export default AutoHeight;
