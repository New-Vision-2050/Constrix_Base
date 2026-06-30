"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Clock,
  Database,
  Mail,
  Plug,
  RefreshCw,
  Settings2,
  Share2,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CONTACT_EMAIL = "info@vision-d2030.com";

type SectionConfig = {
  id: string;
  titleKey: string;
  icon: LucideIcon;
  type:
    | "information"
    | "howWeUse"
    | "dataSharing"
    | "dataSecurity"
    | "dataRetention"
    | "yourRights"
    | "childrensPrivacy"
    | "thirdPartyServices"
    | "policyChanges";
};

const sectionConfigs: SectionConfig[] = [
  {
    id: "information-we-collect",
    titleKey: "sections.informationWeCollect.title",
    icon: Database,
    type: "information",
  },
  {
    id: "how-we-use",
    titleKey: "sections.howWeUse.title",
    icon: Settings2,
    type: "howWeUse",
  },
  {
    id: "data-sharing",
    titleKey: "sections.dataSharing.title",
    icon: Share2,
    type: "dataSharing",
  },
  {
    id: "data-security",
    titleKey: "sections.dataSecurity.title",
    icon: Shield,
    type: "dataSecurity",
  },
  {
    id: "data-retention",
    titleKey: "sections.dataRetention.title",
    icon: Clock,
    type: "dataRetention",
  },
  {
    id: "your-rights",
    titleKey: "sections.yourRights.title",
    icon: UserCheck,
    type: "yourRights",
  },
  {
    id: "childrens-privacy",
    titleKey: "sections.childrensPrivacy.title",
    icon: Users,
    type: "childrensPrivacy",
  },
  {
    id: "third-party-services",
    titleKey: "sections.thirdPartyServices.title",
    icon: Plug,
    type: "thirdPartyServices",
  },
  {
    id: "policy-changes",
    titleKey: "sections.policyChanges.title",
    icon: RefreshCw,
    type: "policyChanges",
  },
];

export default function PrivacyPolicyView() {
  const t = useTranslations("PrivacyPolicy");

  const howWeUseItems = [
    "sections.howWeUse.provideServices",
    "sections.howWeUse.verifyAttendance",
    "sections.howWeUse.improvePerformance",
    "sections.howWeUse.customerSupport",
    "sections.howWeUse.security",
    "sections.howWeUse.legalObligations",
  ] as const;

  const renderSectionContent = (type: SectionConfig["type"]) => {
    switch (type) {
      case "information":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {t("sections.informationWeCollect.accountInformation")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("sections.informationWeCollect.accountBody")}
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {t("sections.informationWeCollect.locationInformation")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("sections.informationWeCollect.locationBody")}
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                {t("sections.informationWeCollect.locationNote")}
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {t("sections.informationWeCollect.deviceInformation")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("sections.informationWeCollect.deviceBody")}
              </p>
            </div>
          </div>
        );
      case "howWeUse":
        return (
          <ul className="grid gap-2 sm:grid-cols-2">
            {howWeUseItems.map((itemKey) => (
              <li
                key={itemKey}
                className="flex items-start gap-2.5 rounded-lg border border-lines/15 bg-background/50 px-3 py-2.5 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {t(itemKey)}
              </li>
            ))}
          </ul>
        );
      case "dataSharing":
        return (
          <p className="text-muted-foreground leading-relaxed">
            {t("sections.dataSharing.body")}
          </p>
        );
      case "dataSecurity":
        return (
          <p className="text-muted-foreground leading-relaxed">
            {t("sections.dataSecurity.body")}
          </p>
        );
      case "dataRetention":
        return (
          <p className="text-muted-foreground leading-relaxed">
            {t("sections.dataRetention.body")}
          </p>
        );
      case "yourRights":
        return (
          <p className="text-muted-foreground leading-relaxed">
            {t("sections.yourRights.body")}
          </p>
        );
      case "childrensPrivacy":
        return (
          <p className="text-muted-foreground leading-relaxed">
            {t("sections.childrensPrivacy.body")}
          </p>
        );
      case "thirdPartyServices":
        return (
          <p className="text-muted-foreground leading-relaxed">
            {t("sections.thirdPartyServices.body")}
          </p>
        );
      case "policyChanges":
        return (
          <p className="text-muted-foreground leading-relaxed">
            {t("sections.policyChanges.body")}
          </p>
        );
    }
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-lines/20 bg-card/80 backdrop-blur-sm p-6 sm:p-8 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple/5 pointer-events-none" />
        <div className="relative space-y-4">
          <Badge variant="secondary" className="text-xs">
            {t("lastUpdated")}: {t("updatedDate")}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t("title")}
          </h2>
          <p className="max-w-3xl text-muted-foreground leading-relaxed">
            {t("intro")}
          </p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        <nav
          aria-label={t("sectionsNavAriaLabel")}
          className="hidden lg:block sticky top-6 rounded-xl border border-lines/20 bg-card/60 backdrop-blur-sm p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {t("onThisPage")}
          </p>
          <ul className="space-y-1">
            {sectionConfigs.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {t(section.titleKey)}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact-us"
                className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {t("contactUs")}
              </a>
            </li>
          </ul>
        </nav>

        <div className="space-y-5">
          {sectionConfigs.map((section) => {
            const Icon = section.icon;
            const title = t(section.titleKey);

            return (
              <Card
                key={section.id}
                id={section.id}
                className="scroll-mt-24 border-lines/20 bg-card/70 backdrop-blur-sm shadow-sm"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{title}</CardTitle>
                      <CardDescription className="sr-only">
                        {title} {t("sectionSuffix")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>{renderSectionContent(section.type)}</CardContent>
              </Card>
            );
          })}

          <Card
            id="contact-us"
            className={cn(
              "scroll-mt-24 border-primary/30 bg-gradient-to-br from-primary/5 to-card/80 backdrop-blur-sm shadow-md"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Mail className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <CardTitle className="text-lg">{t("contactUs")}</CardTitle>
                  <CardDescription>{t("contactDescription")}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                {t("contactBody")}
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-lg border border-lines/20 bg-background/60 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <Mail className="h-4 w-4" aria-hidden />
                {CONTACT_EMAIL}
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
