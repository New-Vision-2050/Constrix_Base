import { BankAccount } from "@/modules/user-profile/types/bank-account";
import PreviewTextField from "../../../../../../components/previewTextField";

type PropsT = { bank: BankAccount };
export default function UserProfileBankingDataReview({ bank }: PropsT) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          label="دولة البنك"
          value={bank?.country_name ?? ""}
          valid={Boolean(bank?.country_name)}
          type="select"
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label="اسم البنك"
          value={bank?.bank_name ?? ""}
          valid={Boolean(bank?.bank_name)}
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label="الاسم الكامل لصاحب الحساب البنكي"
          value={bank?.user_name ?? ""}
          valid={Boolean(bank?.user_name)}
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label="نوع الحساب البنكي"
          value={bank?.bank_type_account?.name ?? ""}
          valid={Boolean(bank?.bank_type_account?.name)}
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label="عملة الحساب"
          value={bank?.currency_name ?? ""}
          valid={Boolean(bank?.currency_name)}
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label="رقم الحساب البنكي"
          value={bank?.account_number ?? ""}
          valid={Boolean(bank?.account_number)}
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label="IBAN"
          value={bank?.iban ?? ""}
          valid={Boolean(bank?.iban)}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label="رمز الـ SWIFT/BIC"
          value={bank?.swift_bic ?? ""}
          valid={Boolean(bank?.swift_bic)}
        />
      </div>
    </div>
  );
}
