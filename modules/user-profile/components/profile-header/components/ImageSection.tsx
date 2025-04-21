"use client";

import { useState } from "react";
import UploadProfileImageDialog from "@/components/shared/upload-profile-image";
import uploadProfileImage from "@/modules/dashboard/api/upload-profile-image";
import validateProfileImage from "@/modules/dashboard/api/validate-image";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

type PropsT = {
  imgSrc?: string; // Optional image source URL for the profile picture
};

/**
 * UserProfileHeaderImageSection Component
 *
 * This component displays a user's profile image if provided;
 * otherwise, it shows a placeholder with an upload hidden input.
 */
export default function UserProfileHeaderImageSection({ imgSrc }: PropsT) {
  const [openDialog, setOpenDialog] = useState(false);
  const { isLoading, handleUpdateImage } = useUserProfileCxt();

  // handle loading state
  if (isLoading)
    return (
      <div className="w-44 h-44 bg-gray-200 animate-pulse rounded-lg"></div>
    );

  return (
    <div className="bg-gray-50 border rounded-xl p-4 flex items-center justify-center">
      {imgSrc ? (
        <img
          src={imgSrc}
          alt="Profile Background"
          className="w-32 h-32 rounded cursor-pointer"
          onClick={() => setOpenDialog(true)}
        />
      ) : (
        <label
          onClick={() => setOpenDialog(true)}
          className="w-32 h-32 flex flex-col items-center justify-center text-black cursor-pointer"
        >
          <i className="ri-camera-2-line text-2xl" />
          <p className="text-center text-sm mt-2">
            يلزم اضافة صورة خلفية بيضاء 6*4
          </p>
        </label>
      )}
      <UploadProfileImageDialog
        title="أضافة صورة"
        open={openDialog}
        setOpen={setOpenDialog}
        validateImageFn={validateProfileImage}
        uploadImageFn={uploadProfileImage}
        onSuccess={(url: string) => {
          handleUpdateImage(url);
        }}
      />
    </div>
  );
}
