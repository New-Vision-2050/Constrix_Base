"use client";

import { SetStateAction } from "react";

type PropsT = {
  loading: boolean;
  imgSrc?: string; // Optional image source URL for the profile picture
  uploadImageChildren?: React.ReactNode;
  setOpenUploadImgDialog?: React.Dispatch<SetStateAction<boolean>>;
};

/**
 * UserProfileHeaderImageSection Component
 *
 * This component displays a user's profile image if provided;
 * otherwise, it shows a placeholder with an upload hidden input.
 */
export default function UserProfileHeaderImageSection({
  loading,
  imgSrc,
  uploadImageChildren,
  setOpenUploadImgDialog,
}: PropsT) {
  // handle loading state
  if (loading)
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
          onClick={() => setOpenUploadImgDialog?.(true)}
        />
      ) : (
        <label
          onClick={() => setOpenUploadImgDialog?.(true)}
          className="w-32 h-32 flex flex-col items-center justify-center text-black cursor-pointer"
        >
          <i className="ri-camera-2-line text-2xl" />
          <p className="text-center text-sm mt-2">
            يلزم اضافة صورة خلفية بيضاء 6*4
          </p>
        </label>
      )}
      {Boolean(uploadImageChildren) && <>{uploadImageChildren}</>}
    </div>
  );
}
