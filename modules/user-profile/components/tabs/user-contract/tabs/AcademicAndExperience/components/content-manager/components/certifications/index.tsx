import { useState } from "react";
import AddNewCertification from "./AddNewCertification";
import UserCertificationsList from "./certifications-list";
import { useTranslations } from "next-intl";

export default function UserCertifications() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("AcademicExperience");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-gray-700">{t("ProfessionalCertificates")}</p>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => setOpen(true)}
        >
          {t("AddNewCertification")} {/* Assuming this button adds a new certification */}
        </button>
      </div>
      <AddNewCertification open={open} setOpen={setOpen} />
      {/* courses list */}
      <UserCertificationsList />
    </div>
  );
}
