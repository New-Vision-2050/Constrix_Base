"use client";

import AllProjectDetails from "@/modules/projects/project";
import { useParams } from "@i18n/navigation";

export default function projectDetails() {
  const params = useParams();
  const projectId = params?.id as string;

  return <AllProjectDetails projectId={projectId} />;
}
