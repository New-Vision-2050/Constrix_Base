import CopyIcon from "@/public/icons/copy";
import React from "react";

type CopyButtonProps = {
  text: string;
};

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("تم النسخ!");
    } catch (err) {
      alert("Failed to copy!");
      console.error("فشل النسخ");
    }
  };

  return (
    <button onClick={handleCopy}>
      <CopyIcon />
    </button>
  );
};

export default CopyButton;
