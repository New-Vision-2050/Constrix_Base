import { Button } from "@/components/ui/button";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { useState } from "react";

export default function ProfileBriefSummaryEdit() {
  const [summary, setSummary] = useState("");
  return (
    <div className="flex p-4 flex-col gap-4">
      <p className="text-sm text-gray-500">نبذة عني</p>
      <Textarea
        name={"profile-summary"}
        value={summary}
        className={" w-full"}
        onChange={(e) => setSummary(e.target.value)}
      />
      <Button className="w-full">حفظ</Button>
    </div>
  );
}
