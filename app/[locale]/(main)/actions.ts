"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleInvalidToken(locale: string) {
  const cookieStore = await cookies();
  cookieStore.delete("new-vision-token");
  redirect(`/${locale}/login`);
}
