
import StatisticsRow from "@/components/shared/layout/statistics-row";
import React, { useState, useEffect } from "react";
import { statisticsConfig } from "./statistics-config";
import { TableBuilder } from "@/modules/table";
import {
  SheetFormBuilder,
  FormConfig
} from "@/modules/form-builder";
import { useTranslations } from "next-intl";
import { programsConfig } from "@/modules/table/utils/configs/programsTableConfig";
import { Button } from "@/components/ui/button";
import { GetProgramFormConfig } from "@/modules/form-builder/configs/programFormConfig";

function EntryPointPrograms() {
  const t = useTranslations("Companies");
  const config = programsConfig();
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFormConfig = async () => {
      try {
        setLoading(true);
        const config = await GetProgramFormConfig(t);
        setFormConfig(config);
        setError(null);
      } catch (err) {
        console.error("Failed to load program form config:", err);
        setError("Failed to load form configuration");
      } finally {
        setLoading(false);
      }
    };

    loadFormConfig();
  }, [t]);

  return (
    <div className="px-8 space-y-7">
      <StatisticsRow config={statisticsConfig} />

      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            {loading ? (
              <Button disabled>جاري التحميل...</Button>
            ) : error ? (
              <Button variant="destructive" onClick={() => window.location.reload()}>إعادة المحاولة</Button>
            ) : formConfig ? (
              <SheetFormBuilder
                config={formConfig}
                trigger={<Button>اضافة برنامج</Button>}
                onSuccess={(values) => {
                  console.log("Form submitted successfully:", values);
                }}
              />
            ) : null}
          </div>
        }
      />
    </div>
  );
}

export default EntryPointPrograms;
