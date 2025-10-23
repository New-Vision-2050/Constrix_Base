import SocialMediaEditView from "@/modules/stores/social-media/edit/view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Social Media",
  description: "Add new social media link",
};

function SocialMediaAddPage() {
  return <SocialMediaEditView />;
}

export default SocialMediaAddPage;
