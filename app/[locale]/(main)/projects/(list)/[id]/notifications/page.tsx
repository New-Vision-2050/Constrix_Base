import { redirect } from "@i18n/navigation";

export default async function ProjectNotificationsRedirectPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  redirect({ href: `/projects/${id}?tab=project-tab-maintenance`, locale });
}
