import SocialMediaEditView from "@/modules/stores/social-media/edit/view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Social Media",
  description: "Edit social media link",
};

interface PageProps {
  params: {
    id: string;
  };
}

function SocialMediaEditPage({ params }: PageProps) {
  return <SocialMediaEditView id={params.id} />;
}

export default SocialMediaEditPage;
