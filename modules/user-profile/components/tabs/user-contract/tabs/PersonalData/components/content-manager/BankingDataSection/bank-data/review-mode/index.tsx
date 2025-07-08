import { BankAccount } from "@/modules/user-profile/types/bank-account";
import PreviewTextField from "../../../../../../components/previewTextField";
import { useTranslations } from "next-intl";

type PropsT = { bank: BankAccount };
export default function UserProfileBankingDataReview({ bank }: PropsT) {
  const t = useTranslations("UserProfile.tabs.FormLabels");
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          label={t("bankCountry")}
          value={bank?.country_name ?? ""}
          valid={Boolean(bank?.country_name)}
          type="select"
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label={t("bankName")}
          value={bank?.bank_name ?? ""}
          valid={Boolean(bank?.bank_name)}
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label={t("accountHolderName")}
          value={bank?.user_name ?? ""}
          valid={Boolean(bank?.user_name)}
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label={t("accountType")}
          value={bank?.bank_type_account?.name ?? ""}
          valid={Boolean(bank?.bank_type_account?.name)}
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label={t("accountCurrency")}
          value={bank?.currency_name ?? ""}
          valid={Boolean(bank?.currency_name)}
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label={t("accountNumber")}
          value={bank?.account_number ?? ""}
          valid={Boolean(bank?.account_number)}
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label={t("iban")}
          value={bank?.iban ?? ""}
          valid={Boolean(bank?.iban)}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label={t("swiftBic")}
          value={bank?.swift_bic ?? ""}
          valid={Boolean(bank?.swift_bic)}
        />
      </div>
    </div>
  );
}
