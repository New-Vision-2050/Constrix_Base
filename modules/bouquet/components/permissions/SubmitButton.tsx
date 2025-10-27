import React from "react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  onSubmit: () => void;
  submitting: boolean;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onSubmit,
  submitting,
  disabled = false
}) => {
  return (
      <div className="flex justify-end">
      <Button
        onClick={onSubmit}
        disabled={submitting || disabled}
        size="lg"
        className="m-4"
      >
        {submitting ? 'جاري الحفظ...' : 'حفظ الصلاحيات'}
      </Button>
    </div>
  );
};

export default SubmitButton;
