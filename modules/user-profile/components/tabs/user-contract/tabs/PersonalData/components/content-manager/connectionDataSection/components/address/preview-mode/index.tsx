import PreviewTextField from "../../../../../../../components/PreviewTextField";

export default function UserAddressSectionPreviewMode() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={false}
          label="العنوان السكني بمقر العمل / وصف دقيق عنوان وطنى) "
          value=""
        />
      </div>
      <div className="p-2">
        <PreviewTextField valid={true} label="العنوان البريدي" value="" />
      </div>
    </div>
  );
}
