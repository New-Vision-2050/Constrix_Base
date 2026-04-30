"use client";

import { Box, Paper, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import type { TermServiceSettingItem } from "@/services/api/crm-settings/term-service-settings/types/response";
import { inboxRequestDialogCardSx } from "@/modules/crm-settings/inbox/components/inbox-request-dialog";
import { ServiceItemAccordion } from "@/modules/crm-settings/tabs/services-settings/components/ServiceItemAccordion";

export type ClientRequestTermServicesSectionProps = {
  termServiceSettings: TermServiceSettingItem[];
  /** Typically project inbox empty dash for consistency with adjacent sections. */
  emptyLabel: string;
};

/**
 * Client-request inbox only: shows `term_service_settings` as a nested accordion tree.
 * Styled distinctly from generic inbox sections (accent border).
 */
export function ClientRequestTermServicesSection({
  termServiceSettings,
  emptyLabel,
}: ClientRequestTermServicesSectionProps) {
  const t = useTranslations("clientRequests.inbox");

  return (
    <Box
      sx={{
        borderRadius: 2,
        borderLeft: (theme) => `3px solid ${theme.palette.primary.main}`,
        pl: 1.75,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          ...inboxRequestDialogCardSx,
          p: 2,
          borderLeft: "none",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.25, fontWeight: 600 }}>
          {t("servicesSectionTitle")}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.25 }}>
          {t("servicesSectionHint")}
        </Typography>
        {termServiceSettings.length > 0 ? (
          <Stack spacing={2}>
            {termServiceSettings.map((svc) => (
              <ServiceItemAccordion
                key={svc.id}
                item={svc}
                selectable={false}
                depth={0}
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {emptyLabel}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
