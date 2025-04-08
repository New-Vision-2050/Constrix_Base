import { useLocale } from "next-intl";

type PropsT = {
  title: string;
  secondTitle?: React.ReactNode;
  children: React.ReactNode;
};

export default function FormFieldSet(props: PropsT) {
  const locale = useLocale();
  const { title, secondTitle, children } = props;
  const isRtl = locale === "ar";
  const dirClass = isRtl ? "left-6" : "right-6";
  
  return (
    <div className="relative">
      <fieldset className="border border-gray-300 rounded-2xl p-6 shadow-sm">
        <legend className="text-lg font-semibold px-2">{title}</legend>
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
