import UserProfileTabs from "../components/tabs";
import StatisticsCardsSection from "../components/statistics-cards";
import { useUserProfileCxt } from "../context/user-profile-cxt";
import UserProfileHeader from "@/components/shared/profile-header";
import UploadProfileImageDialog from "@/components/shared/upload-profile-image";
import { useState } from "react";
import uploadProfileImage from "@/modules/dashboard/api/upload-profile-image";
import validateProfileImage from "@/modules/dashboard/api/validate-image";
import { useTranslations } from "next-intl";

export default function UserProfileEntryPoint() {
  // declare and define component state
  const t = useTranslations("UserProfile.header.uploadPhoto");
  const [openDialog, setOpenDialog] = useState(false);
  const { user, isLoading, userPersonalData, handleUpdateImage } =
    useUserProfileCxt();

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
        job_title={user?.job_title}
        address={user?.address}
        date_appointment={user?.date_appointment}
        setOpenUploadImgDialog={setOpenDialog}
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
      <UserProfileTabs />
    </div>
  );
}
