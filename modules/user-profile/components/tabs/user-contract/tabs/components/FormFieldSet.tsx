import { cn } from "@/lib/utils";
import InfoIcon from "@/public/icons/InfoIcon";
import { useLocale } from "next-intl";

type PropsT = {
  title: string;
  secondTitle?: React.ReactNode;
  valid?: boolean;
  children: React.ReactNode;
};

export default function FormFieldSet(props: PropsT) {
  const locale = useLocale();
  const { title, secondTitle, children, valid } = props;
  const isRtl = locale === "ar";
  const dirClass = isRtl ? "left-6" : "right-6";

  return (
    <div className="relative">
      <fieldset className="border border-gray-500 rounded-2xl p-6 shadow-sm">
        <legend className="text-lg font-semibold px-2 flex items-center gap-2">
          {title}{" "}
          {typeof valid === "boolean" && (
            <InfoIcon
              additionClass={cn(
                " w-4",
                valid ? "text-green-500" : "text-orange-500"
              )}
            />
          )}
        </legend>
        {children}
      </fieldset>
      {/* second title */}
      {secondTitle && (
        <div
          className={`absolute top-3 ${dirClass} -translate-y-1/2 bg-sidebar px-2 text-lg font-semibold`}
        >
          {secondTitle}
        </div>
      )}
    </div>
  );
}
