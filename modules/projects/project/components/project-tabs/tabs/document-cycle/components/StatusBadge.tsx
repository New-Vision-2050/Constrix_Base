"use client";

import { Chip } from "@mui/material";
import { useTranslations } from "next-intl";
import { DocumentStatus } from "../types";

const STATUS_CONFIG: Record<
  DocumentStatus,
  { labelKey: string; color: "default" | "success" | "warning" | "error" }
> = {
  draft:              { labelKey: "draft",             color: "default"  },
  pending:            { labelKey: "pending",            color: "default"  },
  approved:           { labelKey: "approved",           color: "success"  },
  semi_approved:      { labelKey: "partiallyApproved",  color: "warning"  },
  partially_approved: { labelKey: "partiallyApproved",  color: "warning"  },
  rejected:           { labelKey: "rejected",           color: "error"    },
};

interface StatusBadgeProps {
  status: DocumentStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations("project.documentCycle");
  const config = STATUS_CONFIG[status];

  return (
    <Chip
      label={t(config.labelKey)}
      size="small"
      color={config.color}
      variant="outlined"
      sx={{ minWidth: 80, py: 2 }}
    />
  );
}
