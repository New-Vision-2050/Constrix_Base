"use client";

import Link from "next/link";
import { ShieldX, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface NotAuthorizedProps {
  title?: string;
  message?: string;
  showHomeLink?: boolean;
  showBackButton?: boolean;
  className?: string;
}

/**
 * NotAuthorized component to display when user doesn't have permission to access a page
 */
export function NotAuthorized({
  title,
  message,
  showHomeLink = true,
  showBackButton = true,
  className = "",
}: NotAuthorizedProps) {
  const t = useTranslations("Errors.Authorization");

  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <section
      className={`bg-sidebar mx-7 rounded-xl border border-border min-h-[65vh] flex items-center justify-center ${className}`}
    >
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mx-auto mb-6">
          <ShieldX
            className="w-24 h-24 mx-auto text-destructive mb-4"
            strokeWidth={1.5}
          />
          <div className="text-6xl font-semibold text-destructive md:text-7xl">
            403
          </div>
        </div>

        <h2 className="mt-6 text-xl font-black text-card-foreground lg:text-3xl">
          {title || t("Title")}
        </h2>

        <p className="my-4 text-sm text-muted-foreground lg:text-base">
          {message || t("Message")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          {showBackButton && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("GoBack")}
            </Button>
          )}

          {showHomeLink && (
            <Button asChild className="flex items-center gap-2">
              <Link href="/user-profile">
                <Home className="w-4 h-4" />
                {t("GoHome")}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export default NotAuthorized;
