"use client";

import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { bouquetDetailsConfig } from "@/modules/table/utils/configs/bouquetDetailsConfig";
import TableBuilder from "@/modules/table/components/TableBuilder";
interface BouquetDetailsProps {
  params: {
    id: string;
    locale: string;
  };
}

export default function BouquetDetailsPage({ params }: BouquetDetailsProps) {
  const configDetails =  bouquetDetailsConfig();

  return (
    <>
    
    <Accordion type="multiple" className="w-full">
        <AccordionItem value="bouquets-management">
            <AccordionTrigger>الشركات</AccordionTrigger>
            <AccordionContent>
            <Accordion type="single" collapsible className="w-full mt-4">
                <AccordionItem value="bouquets-table">
                <AccordionTrigger>لوحة التحكم - الشركات</AccordionTrigger>
                <AccordionContent>
                    <TableBuilder config={configDetails}/>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="bouquets-analytics">
                <AccordionTrigger>اضافة - الشركات</AccordionTrigger>
                <AccordionContent>
                    <TableBuilder config={configDetails}/>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="bouquets-reports">
                <AccordionTrigger>تعديل - الشركات</AccordionTrigger>
                <AccordionContent>
                    <TableBuilder config={configDetails}/>
                </AccordionContent>
                </AccordionItem>
            </Accordion>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
    </>
  );
}
