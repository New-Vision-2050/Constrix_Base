import PreviewTextField from "../../../../../../../components/PreviewTextField";

export default function UserProfileConnectionDataReview() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="رقم الجوال"
          value="+966 055456200"
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="البريد الالكتروني"
          value="Mohamed@gmail.com"
        />
      </div>
    </div>
  );
}
