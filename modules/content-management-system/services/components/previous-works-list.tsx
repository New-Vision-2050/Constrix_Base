"use client";

import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ServiceFormData } from "../schemas/service-form.schema";
import PreviousWorkSection from "./previous-work-section";

type PreviousWorkItem = NonNullable<ServiceFormData["previous_works"]>[number];

interface PreviousWorksListProps {
  control: Control<ServiceFormData>;
  previousWorks: PreviousWorkItem[];
  isSubmitting: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
  initialPreviousWorks?: Array<{
    id: string;
    description: string;
    image?: {
      url?: string;
    };
  }>;
}

export default function PreviousWorksList({
  control,
  previousWorks,
  isSubmitting,
  onAdd,
  onRemove,
  initialPreviousWorks = [],
}: PreviousWorksListProps) {
  const tForm = useTranslations("content-management-system.services.form");

  return (
    <div className="space-y-6 bg-sidebar p-6 rounded-xl">
      {previousWorks.map((work, index) => (
        <PreviousWorkSection
          key={work.id}
          control={control}
          previousWorkIndex={index}
          isSubmitting={isSubmitting}
          onRemove={() => onRemove(index)}
          initialImageUrl={initialPreviousWorks[index]?.image?.url}
        />
      ))}

      {previousWorks.length === 0 && (
        <p className="text-gray-400 text-center py-8">
          {tForm("noPreviousWorks")}
        </p>
      )}

      <div className="flex items-center justify-end ">
        <Button type="button" onClick={onAdd} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          {tForm("addPreviousWork")}
        </Button>
      </div>
    </div>
  );
}
