"use client";



import { ChevronLeft, ChevronRight } from "lucide-react";

import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";



type Props = {

  branchName: string;

  year: number;

  currentYear: number;

  yearsOnBranch: number;

  onBack: () => void;

  /** When false, only the back control and breadcrumb row are shown (detail header style). */

  showStats?: boolean;

};



function getInitials(name: string): string {

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";

  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();

}



function StatCard({

  title,

  children,

  className,

}: {

  title: string;

  children: React.ReactNode;

  className?: string;

}) {

  return (

    <div

      className={cn(

        "flex min-h-[7.25rem] flex-col gap-3 rounded-xl border border-border bg-muted/40 p-4",

        className

      )}

    >

      <p className="text-xs font-medium text-muted-foreground">{title}</p>

      <div className="flex flex-1 items-center">{children}</div>

    </div>

  );

}



export default function PublicVacationsTableHeader({

  branchName,

  year,

  currentYear,

  yearsOnBranch,

  onBack,

  showStats = false,

}: Props) {

  const t = useTranslations("HRSettingsVacations.publicLeaves.table");

  const tTabs = useTranslations("HRSettingsVacations.tabs");



  const isCurrentYear = year === currentYear;



  return (

    <section

      className="flex flex-col gap-4"

      aria-label={t("headerSectionLabel")}

    >

      <div className="flex min-w-0 items-center gap-3">

        <Button

          type="button"

          variant="outline"

          size="icon"

          className="h-9 w-9 shrink-0 rounded-full"

          onClick={onBack}

          aria-label={t("backToBranches")}

        >

          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />

        </Button>

        <nav

          className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground"

          aria-label={t("headerBreadcrumbLabel")}

        >

          <span className="shrink-0">{tTabs("publicLeaves")}</span>

          <span className="text-muted-foreground/60" aria-hidden>

            /

          </span>

          <span className="truncate text-foreground">{branchName}</span>

          <span className="text-muted-foreground/60" aria-hidden>

            /

          </span>

          <span className="shrink-0 font-semibold text-foreground">{year}</span>

        </nav>

      </div>



      {showStats ? (

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard title={t("headerYearStatus")}>

            <span

              className={cn(

                "inline-flex rounded-full border px-4 py-1 text-sm font-semibold",

                isCurrentYear

                  ? "border-primary/30 bg-primary/10 text-primary"

                  : "border-border bg-muted text-muted-foreground"

              )}

            >

              {isCurrentYear ? t("headerActiveYear") : t("headerHistoricalYear")}

            </span>

          </StatCard>



          <StatCard title={t("headerBranch")}>

            <div className="flex min-w-0 items-center gap-3">

              <Avatar className="h-11 w-11 border border-border">

                <AvatarFallback className="bg-primary text-sm font-bold text-primary-foreground">

                  {getInitials(branchName)}

                </AvatarFallback>

              </Avatar>

              <p

                className="truncate text-sm font-semibold text-foreground"

                title={branchName}

              >

                {branchName}

              </p>

            </div>

          </StatCard>



          <StatCard title={t("headerStatistics")}>

            <div className="flex w-full items-center justify-around gap-2">

              <div className="text-center">

                <p className="text-xl font-bold leading-tight text-foreground">

                  {yearsOnBranch}

                </p>

                <p className="text-xs text-muted-foreground">

                  {t("headerYearsCount")}

                </p>

              </div>

              <div className="h-10 w-px bg-border" aria-hidden />

              <div className="text-center">

                <p className="text-xl font-bold leading-tight text-foreground">

                  {year}

                </p>

                <p className="text-xs text-muted-foreground">{t("year")}</p>

              </div>

            </div>

          </StatCard>



          <StatCard title={t("headerSelectedPeriod")}>

            <span className="inline-flex min-w-[4.5rem] justify-center rounded-full bg-primary px-5 py-1.5 text-sm font-bold text-primary-foreground">

              {year}

            </span>

          </StatCard>

        </div>

      ) : null}

    </section>

  );

}


