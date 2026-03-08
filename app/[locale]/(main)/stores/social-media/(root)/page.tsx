import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ListSocialMediaView from "@/modules/stores/social-media";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Media",
  description: "Manage social media links",
};

function SocialMediaPage() {
  return <ListSocialMediaView />;
}

export default withServerPermissionsPage(SocialMediaPage, [PERMISSIONS.ecommerce.socialMedia.view]);
