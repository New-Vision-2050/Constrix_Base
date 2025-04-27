"use client";

import ChevronDownIcon from "@/public/icons/chevron-down-icon";
import CalendarRangeIcon from "@/public/icons/calendar-range";
import ArrowDownToLineIcon from "@/public/icons/arrow-down-to-line-download";
import { PreviewTextFieldType } from ".";

type PropsT = {
  isRTL: boolean;
  type?: PreviewTextFieldType;
  fileUrl?: string;
};

export default function PreviewTextFieldSuffixIcon(props: PropsT) {
  const { isRTL, type, fileUrl } = props;

  /**
   * handles downloading a file when the icon is clicked.
   * only executes if the type is 'pdf' or 'image' (others are ignored).
   */
  const handleDownload = async () => {
    // only download if the type is pdf or image
    if (type !== "pdf" && type !== "image") return;

    if (!fileUrl) return; // prevent fetch if no URL

    window.open(fileUrl, "_blank");
  };

  /**
   * dynamically renders the appropriate suffix icon based on the input type.
   */
  const renderSuffixIcon = () => {
    switch (type) {
      case "select":
        return <ChevronDownIcon />;
      case "date":
        return <CalendarRangeIcon additionalClass="w-4" />;
      case "image":
      case "pdf":
        return <ArrowDownToLineIcon />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`absolute top-[8px] text-slate-400 ${
        isRTL ? "left-[50px]" : "right-[50px]"
      }`}
      onClick={handleDownload}
      style={{
        cursor: type === "pdf" || type === "image" ? "pointer" : "default",
      }}
    >
      {renderSuffixIcon()}
    </span>
  );
}
