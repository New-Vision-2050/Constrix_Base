import UserProfileHeaderImageSection from "./components/ImageSection";
import UserProfileHeaderUserInformationSection from "./components/UserInformationSection";
/**
 * UserProfileHeader Component
 *
 * - **Responsible for** displaying the user profile header section.
 * - **Divided into**:
 *   1. **Image Section**: Displays user profile image or upload field.
 *   2. **User Information Section**: Displays user details such as name, role, location, etc.
 */
export default function UserProfileHeader() {
  return (
    <div className="bg-sidebar shadow-md rounded-xl p-6 flex flex-col md:flex-row gap-6">
      {/* image or upload image field */}
      <UserProfileHeaderImageSection />
      {/* user information */}
      <UserProfileHeaderUserInformationSection />
    </div>
  );
}
