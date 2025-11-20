import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

/**
 * Submit Button Component
 * 
 * Renders the form submission button with loading state
 * Follows Single Responsibility Principle - only handles button rendering
 * 
 * @param isUpdating - Whether the form is currently submitting
 * @param label - Button text label
 */
interface SubmitButtonProps {
  isUpdating: boolean;
  label: string;
}

export default function SubmitButton({ isUpdating, label }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isUpdating}
      className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
    >
      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}

