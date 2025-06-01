import { useToast } from "@/modules/table/hooks/use-toast";
import CopyIcon from "@/public/icons/copy";
import React from "react";

type CopyButtonProps = {
  text: string;
};

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const { toast } = useToast();
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "نجح",
        description: "تم النسخ بنجاح",
      });
    } catch {
      toast({
        title: "فشل",
        description: "فشل النسخ",
        variant: "destructive",
      });
    }
  };

  return (
    <button onClick={handleCopy}>
      <CopyIcon />
    </button>
  );
};

export default CopyButton;
