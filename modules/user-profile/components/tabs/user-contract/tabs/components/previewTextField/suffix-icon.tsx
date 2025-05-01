"use client";

import ChevronDownIcon from "@/public/icons/chevron-down-icon";
import CalendarRangeIcon from "@/public/icons/calendar-range";
import ArrowDownToLineIcon from "@/public/icons/arrow-down-to-line-download";
import { PreviewTextFieldType } from ".";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { apiClient } from "@/config/axios-config";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";

type PropsT = {
  isRTL: boolean;
  type?: PreviewTextFieldType;
  fileUrl?: string;
  mediaId?: string | number;
  fireAfterDeleteMedia?: () => void;
};

export default function PreviewTextFieldSuffixIcon(props: PropsT) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isRTL, type, fileUrl, mediaId, fireAfterDeleteMedia } = props;

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
        {(type === "image" || type == "pdf") && (
          <span
            className={`absolute top-[8px] text-slate-400 ${
              isRTL ? "left-[85px]" : "right-[85px]"
            }`}
            title={loading ? "جاري التنفيذ" : "حذف"}
            onClick={() => setOpen(true)}
            style={{
              cursor:
                type === "pdf" || type === "image" ? "pointer" : "default",
            }}
          >
            <Trash2 color={loading ? "lightgray" : "red"} />
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
