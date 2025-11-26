import { SetStateAction } from "react";
import UserProfileHeaderImageSection from "./components/ImageSection";
import UserProfileHeaderUserInformationSection from "./components/UserInformationSection";


export type ProfileSubItem = {
  icon: React.ReactNode;
  value: string;
  label?: string;
};

type PropsT = {
  loading: boolean;
  name?: string;
  branch?: string;
  imgSrc?: string;
  address?: string;
  job_title?: string;
  date_appointment?: string;
  children?: React.ReactNode;
  setOpenUploadImgDialog?: React.Dispatch<SetStateAction<boolean>>;
  subItems?: ProfileSubItem[];
  actionSlot?: React.ReactNode;
};

/**
 * UserProfileHeader Component
 *
 * - **Responsible for** displaying the user profile header section.
 * - **Divided into**:
 *   1. **Image Section**: Displays user profile image or upload field.
 *   2. **User Information Section**: Displays user details such as name, role, location, etc.
 */
export default function UserProfileHeader(props: PropsT) {
  const {
    imgSrc,
    loading,
    name,
    branch,
    job_title,
    address,
    date_appointment,
    children,
    setOpenUploadImgDialog,
    subItems,
    actionSlot,
  } = props;
  

  return (
    <div className="bg-sidebar shadow-md rounded-xl p-6 flex flex-col md:flex-row gap-6">
      {/* image or upload image field */}
      <UserProfileHeaderImageSection
        loading={loading}
        imgSrc={imgSrc ?? ""}
        uploadImageChildren={children}
        setOpenUploadImgDialog={setOpenUploadImgDialog}
      />
      {/* user information */}
      <UserProfileHeaderUserInformationSection
        name={name}
        branch={branch}
        loading={loading}
        address={address}
        job_title={job_title}
        date_appointment={date_appointment}
        subItems={subItems}
        actionSlot={actionSlot}
      />
    </div>
  );
}
