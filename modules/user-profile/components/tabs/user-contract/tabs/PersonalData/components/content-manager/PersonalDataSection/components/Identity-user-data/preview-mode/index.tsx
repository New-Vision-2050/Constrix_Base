import PreviewTextField from "../../../../../../../components/PreviewTextField";

export default function UserProfileIdentityDataReview() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="رقم الهوية"
          value="2145632456"
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="تاريخ الدخول"
          value="055456200"
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
          value="الهوية-2024"
          isPdf
        />
      </div>
    </div>
  );
}
