"use client";

import ChevronDownIcon from "@/public/icons/chevron-down-icon";
import CalendarRangeIcon from "@/public/icons/calendar-range";
import ArrowDownToLineIcon from "@/public/icons/arrow-down-to-line-download";
import { PreviewTextFieldType } from ".";
import { Trash2, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { apiClient } from "@/config/axios-config";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";

type PropsT = {
  isRTL: boolean;
  type?: PreviewTextFieldType;
  fileUrl?: string;
  mediaId?: string | number;
  fireAfterDeleteMedia?: () => void;
  enableCopy?: boolean;
  value?: string;
};

export default function PreviewTextFieldSuffixIcon(props: PropsT) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isRTL, type, fileUrl, mediaId, fireAfterDeleteMedia, enableCopy, value } = props;
  
  // Reset copied state after 2 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (copied) {
      timer = setTimeout(() => setCopied(false), 2000);
    }
    return () => clearTimeout(timer);
  }, [copied]);

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

  const handleCancel = () => setOpen(false);

  const handleDeleteMedia = async () => {
    try {
      if (loading || !mediaId) return;
      setLoading(true);
      await apiClient.delete(`/media/${mediaId}`);
      fireAfterDeleteMedia?.();
    } catch (err) {
      console.log("error in delete media ::", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles copying the field value to clipboard
   */
  const handleCopy = async () => {
    if (!value) return;
    
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
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
    <>
      <div className="flex items-center">
        {Boolean(fileUrl) && (
          <span
            className={`absolute top-[8px] text-slate-400 ${
              isRTL ? "left-[50px]" : "right-[50px]"
            }`}
            onClick={handleDownload}
            style={{
              cursor:
                type === "pdf" || type === "image" ? "pointer" : "default",
            }}
          >
            {renderSuffixIcon()}
          </span>
        )}

        {/* Copy Icon */}
        {enableCopy && value && (
          <span
            className={`absolute top-[8px] text-slate-400 ${
              isRTL ? (Boolean(mediaId) ? "left-[120px]" : "left-[50px]") : (Boolean(mediaId) ? "right-[120px]" : "right-[50px]")
            }`}
            title={copied ? "تم النسخ!" : "نسخ القيمة"}
            onClick={handleCopy}
            style={{
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {copied ? <Check size={18} color="#22c55e" /> : <Copy size={18} />}
          </span>
        )}

        {/* Delete Icon */}
        {(type === "image" || type == "pdf") && Boolean(mediaId) && (
          <span
            className={`absolute top-[8px] text-slate-400 ${
              isRTL ? "left-[85px]" : "right-[85px]"
            }`}
            title={loading ? "جاري التنفيذ" : "حذف"}
            onClick={() => {
              if (!mediaId) return;
              setOpen(true);
            }}
            style={{
              cursor:
                (type === "pdf" || type === "image") && mediaId
                  ? "pointer"
                  : "default",
            }}
          >
            <Trash2 color={loading || !mediaId ? "lightgray" : "red"} />
          </span>
        )}
      </div>
      <ConfirmationDialog
        open={open}
        onClose={handleCancel}
        onConfirm={handleDeleteMedia}
        description={`هل أنت متاكد من حذف الملف؟`}
        showDatePicker={false}
      />
    </>
  );
}
