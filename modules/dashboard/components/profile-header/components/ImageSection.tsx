"use client";
import { useUserDashboardCxt } from "@/modules/dashboard/context/user-dashboard-cxt";

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
  const { isLoading } = useUserDashboardCxt();

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
          className="w-32 h-32 rounded"
        />
      ) : (
        <label className="w-32 h-32 flex flex-col items-center justify-center text-black cursor-pointer">
          <i className="ri-camera-2-line text-2xl" />
          <p className="text-center text-sm mt-2">
            يلزم اضافة صورة خلفية بيضاء 6*4
          </p>
        </label>
      )}
    </div>
  );
}
