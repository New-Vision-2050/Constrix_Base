import PreviewTextField from "../../../../../../components/PreviewTextField";

export default function UserProfileBankingDataReview() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="دولة البنك"
          value="السعودية"
          isSelect
        />
      </div>
      <div className="p-2">
        <PreviewTextField valid={true} label="اسم البنك" value="بنك الانماء" />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="الاسم الكامل لصاحب الحساب البنكي"
          value="محمد خالد"
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="عملة الحساب"
          value="ريال سعودي SAR"
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="رقم الحساب البنكي"
          value="54862862145"
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="IBAN"
          value="325201458562014788"
        />
      </div>
      <div className="p-2">
        <PreviewTextField valid={false} label="رمز الـ SWIFT/BIC" value="" />
      </div>
    </div>
  );
}
