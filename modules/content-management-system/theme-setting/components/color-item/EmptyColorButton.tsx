import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Palette } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * EmptyColorButton component
 * Shows "Pick Color" button when no color is selected
 */
interface EmptyColorButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const EmptyColorButton = forwardRef<HTMLButtonElement, EmptyColorButtonProps>(
  (props, ref) => {
    const t = useTranslations("content-management-system.themeSetting.common");
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "bg-sidebar border border-dashed border-border",
          "hover:border-primary transition-colors",
          "cursor-pointer w-full justify-center"
        )}
        {...props}
      >
        <Palette className="w-4 h-4" />
        <span className="text-sm">{t("pickColor")}</span>
      </button>
    );
  }
);

EmptyColorButton.displayName = "EmptyColorButton";

export default EmptyColorButton;

