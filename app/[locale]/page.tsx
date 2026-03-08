import { redirect } from "@i18n/navigation";

export default async function Home() {
  redirect({ href: "/login", locale: "ar" });
}
