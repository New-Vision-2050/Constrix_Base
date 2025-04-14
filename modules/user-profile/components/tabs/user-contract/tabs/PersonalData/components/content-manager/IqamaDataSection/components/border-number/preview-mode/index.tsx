import PreviewTextField from "../../../../../../../components/PreviewTextField";

export default function UserIqamaBorderNumberPreviewMode() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField valid={true} label="رقم الحدود" value="2145632456" />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="تاريخ الدخول"
          value="05/08/2021"
          isDate
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="تاريخ الانتهاء"
          value="05/08/2021"
          isDate
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="ارفاق رقم الحدود"
          value="رقم الحدود"
          isPdf
        />
      </div>
    </div>
  );
}
