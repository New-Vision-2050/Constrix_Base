import { Relative } from "@/modules/user-profile/types/relative";
import PreviewTextField from "../../../../../../../../components/previewTextField";

type PropsT = {
  relative: Relative;
};

export default function MaritalStatusRelativesSectionPreviewMode({
  relative,
}: PropsT) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row one columns*/}
      <div className="p-2 col-span-2">
        <PreviewTextField
          label="الحالة الاجتماعية"
          value={relative?.marital_status}
          valid={Boolean(relative?.marital_status)}
          type="select"
        />
      </div>
      {/* two row 2 columns*/}
      <div className="p-2">
        <PreviewTextField
          label="اسم شخص في حالة الطواري"
          value={relative?.name}
          valid={Boolean(relative?.name)}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label="علاقة الشخص بحاله الطواري"
          value={relative?.relationship}
          valid={Boolean(relative?.relationship)}
        />
      </div>
      {/* third row one columns*/}
      <div className="p-2 col-span-2">
        <PreviewTextField
          label=" رقم الهاتف الخاص بجهة اتصال في حالة الطوارئ"
          value={relative?.phone}
          valid={Boolean(relative?.phone)}
        />
      </div>
    </div>
  );
}
