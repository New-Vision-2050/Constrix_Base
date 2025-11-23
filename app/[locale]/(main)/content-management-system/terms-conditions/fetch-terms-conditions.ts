import { TermsConditions } from "@/services/api/company-dashboard/terms-conditions/types/response";
import { cookies } from "next/headers";
import { getCurrentHost } from "@/utils/get-current-host";

const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL +
    "/" +
    process.env.NEXT_PUBLIC_API_PATH +
    "/" +
    process.env.NEXT_PUBLIC_API_VERSION;

/**
 * Server-side function to fetch current terms and conditions
 * Uses native fetch API with proper server-side headers
 * @returns The terms and conditions data or null if error
 */
export async function fetchTermsConditions(): Promise<TermsConditions | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("new-vision-token")?.value;
        const lang = cookieStore.get("NEXT_LOCALE")?.value || "ar";
        const currentHost = await getCurrentHost();

        const response = await fetch(`${baseURL}/website-term-and-conditions/current`, {
            method: "GET",
            headers: {
                "Authorization": token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
                "Lang": lang,
                "Accept-Language": lang,
                "X-Domain": currentHost,
            },
            cache: "no-store", // Always get fresh data
        });

        if (!response.ok) {
            console.error("Failed to fetch terms and conditions:", response.statusText);
            return null;
        }

        const data = await response.json();
        return data?.payload || null;
    } catch (error) {
        console.error("Error fetching terms and conditions:", error);
        return null;
    }
}

