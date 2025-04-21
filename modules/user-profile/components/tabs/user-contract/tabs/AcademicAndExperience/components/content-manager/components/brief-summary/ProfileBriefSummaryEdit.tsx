import { Button } from "@/components/ui/button";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { useState } from "react";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import { apiClient } from "@/config/axios-config";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

export default function ProfileBriefSummaryEdit() {
  // ** declare and define component state and vars
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const { userBrief } = useUserAcademicTabsCxt();
  const { user, handleRefetchDataStatus } = useUserProfileCxt();

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
      <p className="text-sm text-gray-500">نبذة عني</p>
      <Textarea
        name={"profile-summary"}
        defaultValue={userBrief?.about_me ?? ""}
        placeholder={"اكتب نبذة عنك"}
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
        حفظ
      </Button>
    </div>
  );
}
