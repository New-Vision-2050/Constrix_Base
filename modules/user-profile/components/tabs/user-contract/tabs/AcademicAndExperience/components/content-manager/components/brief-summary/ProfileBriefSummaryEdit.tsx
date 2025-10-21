import { Button } from "@/components/ui/button";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { useState } from "react";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import { apiClient } from "@/config/axios-config";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useTranslations } from "next-intl";

export default function ProfileBriefSummaryEdit() {
  // ** declare and define component state and vars
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const { userBrief } = useUserAcademicTabsCxt();
  const { user, handleRefetchDataStatus } = useUserProfileCxt();
  const t = useTranslations("UserProfile.nestedTabs.briefSummary");

  const handleUpdateUserBrief = async () => {
    try {
      setLoading(true);
      await apiClient.post(`/user_abouts`, {
        user_id: user?.user_id ?? "",
        about_me: summary,
      });
      setLoading(false);
      handleRefetchDataStatus();
    } catch (err) {
      setLoading(false);
      console.log("Error updating user brief:", err);
    }
  };

  return (
    <div className="flex p-4 flex-col gap-4">
      <p className="text-sm text-gray-500">{t("aboutMe")}</p>
      <Textarea
        name={"profile-summary"}
        defaultValue={userBrief?.about_me ?? ""}
        placeholder={t("aboutMePlaceholder")}
        rows={4}
        disabled={loading}
        maxLength={500}
        minLength={10}
        className={" w-full"}
        onChange={(e) => setSummary(e.target.value)}
      />
      <Button
        className="w-full"
        disabled={loading}
        onClick={handleUpdateUserBrief}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 mr-2 inline-block text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        )}
        {t("save")}
      </Button>
    </div>
  );
}
