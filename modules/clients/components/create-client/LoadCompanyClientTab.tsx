"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import { toast } from "sonner";
import { TextField } from "@mui/material";
import { Button } from "@/components/ui/button";
import type { CompanyData } from "@/services/api/projects/project-sharing/types/response";
import {
  COMPANY_LOOKUP_SUCCESS_CODE,
  getCompanyBySerialNumber,
} from "@/modules/clients/apis/get-company-by-serial";
import { getErrorMessage } from "@/utils/errorHandler";
import CompanyMarkClientPreviewDialog from "./CompanyMarkClientPreviewDialog";

function isNotFoundStatus(status: number | undefined) {
  return status === 404 || status === 400;
}

export default function LoadCompanyClientTab({
  handleRefreshWidgetsData,
}: {
  handleRefreshWidgetsData?: () => void;
}) {
  const t = useTranslations("ClientsModule.form");
  const [serial, setSerial] = useState("");
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewCompany, setPreviewCompany] = useState<CompanyData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = serial.trim();
    if (!value) {
      setError(t("companySerialRequired"));
      return;
    }
    setError(null);
    setLoadingLookup(true);
    try {
      const response = await getCompanyBySerialNumber(value);
      const ok =
        response.code === COMPANY_LOOKUP_SUCCESS_CODE &&
        response.payload?.id;

      if (ok && response.payload) {
        setPreviewCompany(response.payload);
        setDialogOpen(true);
      } else {
        const message = t("companyNotFound");
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (isNotFoundStatus(status)) {
          const message = t("companyNotFound");
          setError(message);
          toast.error(message);
        } else {
          const apiMsg =
            getErrorMessage(err) ||
            (typeof err.response?.data?.message === "string"
              ? err.response.data.message
              : null);
          const message = apiMsg || t("companyLookupError");
          setError(message);
          toast.error(message);
        }
      } else {
        const message = t("companyLookupError");
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoadingLookup(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleMarkedSuccess = () => {
    setSerial("");
    setPreviewCompany(null);
    setError(null);
    handleRefreshWidgetsData?.();
  };

  return (
    <>
      <form onSubmit={handleLookup} className="flex flex-col gap-4 pt-2">
        <TextField
          label={t("companySerialLabel")}
          placeholder={t("companySerialPlaceholder")}
          value={serial}
          onChange={(e) => {
            setSerial(e.target.value);
            setError(null);
          }}
          disabled={loadingLookup}
          error={!!error}
          helperText={error}
        />
        <Button type="submit" disabled={loadingLookup}>
          {loadingLookup ? t("lookupCompanyLoading") : t("lookupCompanySubmit")}
        </Button>
      </form>

      <CompanyMarkClientPreviewDialog
        open={dialogOpen}
        company={previewCompany}
        onClose={handleDialogClose}
        onMarkedSuccess={handleMarkedSuccess}
      />
    </>
  );
}
