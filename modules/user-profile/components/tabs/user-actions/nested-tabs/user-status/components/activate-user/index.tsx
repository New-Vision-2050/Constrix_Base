"use client";
import CustomDateField from "@/components/shared/CustomDateField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiClient } from "@/config/axios-config";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { useState } from "react";
import { ActivationUserDialog } from "./ActivationUserDialog";
import { useUserActionsCxt } from "../../../../context";

const activationTypes = [
  { type: "permanente_active", label: "تفعيل دائم" },
  { type: "temporary_active", label: "تفعيل مؤقت" },
];

export default function ActivateUser() {
  // declare and define component state and variables
  const { user } = useUserProfileCxt();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { userStatusData, userStatusLoading } = useUserActionsCxt();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [openValidDialog, setOpenValidDialog] = useState(false);
  const [activationType, setActivationType] = useState<string>();

  console.log("selectedDate", selectedDate, activationType, userStatusData);
  // declare and define helper methods
  const handleClick = (type: string) => setActivationType(type);

  const handleUserActivation = async () => {
    try {
      if (!activationType) {
        setError("برجاء أختيار طريقة التفعيل أولأ");
        return;
      }
      if (activationType === "temporary_active" && !selectedDate) {
        setError("برجاء أختيار التاريخ أولأ");
        return;
      }
      setError(undefined);

      // helper vars
      const url = `/user_statuses/activation/${user?.user_id}`;
      let body: Record<string, string> = {
        active_type: activationType,
      };

      if (activationType === "temporary_active")
        body = {
          ...body,
          active_date_to: formatDateYYYYMMDD(selectedDate as Date),
        };

      // start send request
      setLoading(true);
      await apiClient.post(url, body);

      setOpenValidDialog(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("handle user activation error ::", error);
    }
  };

  if (userStatusLoading) return <>Loading...</>;
  return (
    <div className="flex flex-col gap-6">
      <RadioGroup className="justify-end">
        {activationTypes?.map((item) => (
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

      {activationType === "temporary_active" && (
        <CustomDateField
          name="date-to"
          disabled={loading}
          placeholder="حتى تاريخ"
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-end">
        <Button
          onClick={handleUserActivation}
          disabled={!activationType || loading}
        >
          تحديث
        </Button>
      </div>
      <ActivationUserDialog
        email={user?.email ?? ""}
        open={openValidDialog}
        setOpen={setOpenValidDialog}
      />
    </div>
  );
}
