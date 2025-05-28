"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiClient } from "@/config/axios-config";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useState } from "react";
import EnterPassword from "./EnterPassword";
import { ActivationUserDialog } from "../ActivationUserDialog";

const changePasswordsWays = [
  { type: "automatic", label: "انشاء كلمة مرور تلقائيا" },
  { type: "manual", label: "انشاء كلمة مرور جديدة" },
];

export default function ChangeUserPassword() {
  // declare and define component state and variables
  const { user } = useUserProfileCxt();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [changeType, setChangeType] = useState<string>();
  const [openValidDialog, setOpenValidDialog] = useState(false);

  // declare and define helper methods
  const handleClick = (type: string) => setChangeType(type);

  const handleChangeUserPassword = async () => {
    try {
      if (!changeType) {
        setError("برجاء أختيار طريقة تفعيل الباسورد");
        return;
      }
      if (changeType === "manual" && !password) {
        setError("برجاء أدخال كلمة المرور");
        return;
      }
      setError(undefined);

      // helper vars
      const url = `/user_statuses/password/${user?.user_id}`;
      let body: Record<string, string> = {
        type: changeType,
      };

      if (changeType === "manual")
        body = {
          ...body,
          password: password ?? "",
        };

      // start send request
      setLoading(true);
      await apiClient.post(url, body);

      setOpenValidDialog(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("handle change password error ::", error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <RadioGroup className="justify-end" defaultValue="comfortable">
        {changePasswordsWays?.map((item) => (
          <div
            key={item.type}
            className="flex items-center justify-end space-x-2"
          >
            <Label>{item?.label}</Label>
            <RadioGroupItem
              onClick={() => handleClick(item.type)}
              value={item.type}
              disabled={loading}
            />
          </div>
        ))}
      </RadioGroup>

      {changeType === "manual" && (
        <EnterPassword loading={loading} password={password} setPassword={setPassword} />
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-end">
        <Button
          onClick={handleChangeUserPassword}
          disabled={!changeType || password.length == 0 || loading}
        >
          تحديث
        </Button>
      </div>

      <ActivationUserDialog
        description={<>تم تغير كلمة المرور بنجاح</>}
        open={openValidDialog}
        setOpen={setOpenValidDialog}
      />
    </div>
  );
}
