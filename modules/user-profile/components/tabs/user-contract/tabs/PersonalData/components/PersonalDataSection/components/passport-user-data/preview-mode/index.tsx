import PreviewTextField from "../../PreviewTextField";

export default function UserProfilePassportDataReview() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="رقم جواز السفر"
          value="A27678211"
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="تاريخ الانشاء"
          value="05/08/2021"
          required
          isDate
        />
      </div>

      {/* second row */}
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="تاريخ الانتهاء"
          value="05/08/2024"
          isDate
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="ارفاق الهوية"
          value="الجواز-2024"
          isPdf
        />
      </div>
    </div>
  );
}
