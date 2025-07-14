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
    <div className="mt-6 flex justify-center">
      <Button
        onClick={onSubmit}
        disabled={submitting || disabled}
        className="px-6 py-2"
      >
        {submitting ? 'جاري الحفظ...' : 'حفظ الصلاحيات'}
      </Button>
    </div>
  );
};

export default SubmitButton;
