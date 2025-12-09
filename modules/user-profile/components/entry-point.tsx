import UserProfileTabs from "../components/tabs";
import StatisticsCardsSection from "../components/statistics-cards";
import { useUserProfileCxt } from "../context/user-profile-cxt";
import UserProfileHeader, { ProfileSubItem } from "@/components/shared/profile-header";
import UploadProfileImageDialog from "@/components/shared/upload-profile-image";
import { useState } from "react";
import uploadProfileImage from "@/modules/dashboard/api/upload-profile-image";
import validateProfileImage from "@/modules/dashboard/api/validate-image";
import { useTranslations } from "next-intl";
import { MapPinIcon } from "lucide-react";
import BackpackIcon from "@/public/icons/backpack";
import CalendarRangeIcon from "@/public/icons/calendar-range";
import ProfileRoleSelector from "@/modules/client-profile/components/ProfileRoleSelector";



export default function UserProfileEntryPoint({ userId, companyId }: { userId: string, companyId: string }) {
  // declare and define component state
  const t = useTranslations("UserProfile.header.uploadPhoto");
  const [openDialog, setOpenDialog] = useState(false);
  const { user, isLoading, userPersonalData, handleUpdateImage } =
    useUserProfileCxt();
  // sub items - branch-jobtitle-address
  const subItems: ProfileSubItem[] = [
    {
      label: t("branch"),
      icon: <MapPinIcon />,
      value: user?.branch ?? "",
    },
    {
      label: t("jobTitle"),
      icon: <BackpackIcon />,
      value: user?.job_title ?? "",
    },
    {
      label: t("address"),
      icon: <MapPinIcon />,
      value: user?.address ?? "",
    },
    {
      label: t("appointmentDate"),
      icon: <CalendarRangeIcon />,
      value: user?.date_appointment ?? "",
    },
  ];

  return (
    <div className="flex flex-col gap-12  p-12">
      {/* header */}
      <UserProfileHeader
        imgSrc={user?.image_url}
        loading={isLoading}
        name={
          userPersonalData?.is_default == 1
            ? userPersonalData?.nickname
            : userPersonalData?.name
        }
        subItems={subItems}
        job_title={user?.job_title}
        address={user?.address}
        date_appointment={user?.date_appointment}
        setOpenUploadImgDialog={setOpenDialog}
        actionSlot={<ProfileRoleSelector id={userPersonalData?.id ?? ''} userTypes={userPersonalData?.user_types ?? []} readonly={false} />}
      >
        <UploadProfileImageDialog
          title={t("title")}
          open={openDialog}
          setOpen={setOpenDialog}
          validateImageFn={validateProfileImage}
          uploadImageFn={uploadProfileImage}
          onSuccess={(url: string) => {
            handleUpdateImage(url);
          }}
        />
      </UserProfileHeader>

      {/* Statistics cards */}
      <StatisticsCardsSection />
      {/* tabs */}
      <UserProfileTabs userId={userId} companyId={companyId} />
    </div>
  );
}
