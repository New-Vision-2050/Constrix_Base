import PreviewTextField from "../../../../../components/PreviewTextField";

export default function PrivilegeItemPreviewMode() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label="نوع السكن"
          value={"salary?.basic"}
          valid={Boolean("salary?.basic")}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="نوع البدل"
          value={"salary?.basic"}
          valid={Boolean("salary?.basic")}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="معدل حساب النسبة من اصل الراتب"
          value={"salary?.basic"}
          valid={Boolean("salary?.basic")}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="وصف حساب النسبة"
          value={"salary?.basic"}
          valid={Boolean("salary?.basic")}
          required
        />
      </div>
    </div>
  );
}
