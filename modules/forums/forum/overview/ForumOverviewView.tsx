"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronLeft,
  Flag,
  LayoutGrid,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@i18n/navigation";
import { ROUTER } from "@/router";
import ForumShell from "../components/ForumShell";
import StatCard from "../../components/ui/StatCard";
import SectionCard from "../../components/ui/SectionCard";
import MobileForumPreview from "./MobileForumPreview";
import { useForum } from "../../hooks/use-forums";
import { useCurrentCompany } from "../../hooks/use-company";

export default function ForumOverviewView({ forumId }: { forumId: string }) {
  const t = useTranslations("Forums");
  const company = useCurrentCompany();
  const { data: forum } = useForum(forumId);

  return (
    <ForumShell
      forumId={forumId}
      active="overview"
      breadcrumbRoot={company.name}
      breadcrumb={t("forum.breadcrumbDetails")}
      showStatus
    >
      <div className="flex flex-col gap-5">
        {forum?.description ? (
          <p className="text-sm text-muted-foreground">{forum.description}</p>
        ) : null}

        <div className="flex flex-wrap gap-4">
          <StatCard
            label={t("forum.overview.stats.groups")}
            value={forum?.groups_count ?? 0}
            hint={t("forum.overview.stats.groupsHint")}
            icon={<LayoutGrid />}
          />
          <StatCard
            label={t("forum.overview.stats.members")}
            value={forum?.members_count ?? 0}
            hint={t("forum.overview.stats.membersHint")}
            icon={<Users />}
            tone="success"
          />
          <StatCard
            label={t("forum.overview.stats.admins")}
            value={forum?.admins_count ?? 0}
            hint={t("forum.overview.stats.adminsHint")}
            icon={<ShieldCheck />}
          />
          <StatCard
            label={t("forum.overview.stats.reports")}
            value={forum?.open_reports_count ?? 0}
            hint={t("forum.overview.stats.reportsHint")}
            icon={<Flag />}
            tone="warning"
          />
        </div>

        <SectionCard title={t("forum.overview.sectionTitle")}>
          <div className="flex flex-col gap-3">
            <ManageRow
              icon={<LayoutGrid />}
              title={t("forum.tabs.groups")}
              hint={t("forum.overview.groupsRow")}
              href={ROUTER.FORUM_GROUPS(forumId)}
              actionLabel={t("common.manage")}
            />
            <ManageRow
              icon={<Users />}
              title={t("forum.tabs.members")}
              hint={t("forum.overview.membersRow")}
              href={ROUTER.FORUM_MEMBERS(forumId)}
              actionLabel={t("common.manage")}
            />
            <ManageRow
              icon={<ShieldCheck />}
              title={t("forum.tabs.admins")}
              hint={t("forum.overview.adminsRow")}
              href={ROUTER.FORUM_ADMINS(forumId)}
              actionLabel={t("common.manage")}
            />
          </div>
        </SectionCard>

        <div className="flex flex-wrap items-center gap-3">
          <MobileForumPreview
            forumName={forum?.name ?? ""}
            companyName={company.name}
            trigger={
              <Button variant="outline">
                <Smartphone />
                {t("forum.overview.mobilePreview")}
              </Button>
            }
          />
          <Button variant="outline" asChild>
            <Link href={ROUTER.FORUMS}>{t("forum.allForums")}</Link>
          </Button>
        </div>
      </div>
    </ForumShell>
  );
}

function ManageRow({
  icon,
  title,
  hint,
  href,
  actionLabel,
}: {
  icon: ReactNode;
  title: string;
  hint: string;
  href: string;
  actionLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/40 p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary [&_svg]:size-5">
          {icon}
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground">{hint}</span>
        </div>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href={href}>
          <ChevronLeft className="rtl:rotate-180" />
          {actionLabel}
        </Link>
      </Button>
    </div>
  );
}