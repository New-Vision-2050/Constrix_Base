import PreviewTextField from "@/modules/user-profile/components/tabs/user-contract/tabs/components/PreviewTextField";

const LegalDataPreview = () => {
  const previewData = [
    {
      valid: true,
      label: "نوع التسجل",
      value: "سجل تجاري",
      needRequest: true,
      containerClassName: "col-span-4",
    },
    {
      valid: true,
      label: "ادخل رقم السجل التجاري / رقم الـ 700",
      needRequest: true,
      value: "70025865836",
      containerClassName: "col-span-2",
    },
    {
      valid: true,
      label: "تاريخ الإصدار",
      isDate: true,
      value: "2024/2/19",
    },
    {
      valid: true,
      label: "تاريخ الانتهاء",
      isDate: true,
      value: "2024/2/19",
    },

    {
      valid: true,
      label: "نوع التسجل.",
      value: "ترخيص",
      needRequest: true,
      containerClassName: "col-span-4",
    },
    {
      valid: true,
      label: "ادخل رقم الترخيص",
      needRequest: true,
      value: "70025865836",
      containerClassName: "col-span-2",
    },
    {
      valid: true,
      label: ".تاريخ الإصدار",
      isDate: true,
      value: "2024/2/19",
    },
    {
      valid: true,
      label: ".تاريخ الانتهاء",
      isDate: true,
      value: "2024/2/19",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-x-3 gap-y-5">
      {previewData.map((preview) => (
        <div
          key={preview.label}
          className={preview?.containerClassName && preview?.containerClassName}
        >
          <PreviewTextField {...preview} />
        </div>
      ))}
    </div>
  );
};

export default LegalDataPreview;
