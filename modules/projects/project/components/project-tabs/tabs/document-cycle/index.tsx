"use client";

import { useState } from "react";
import { Box, Badge } from "@mui/material";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OutgoingAttachments from "./components/OutgoingAttachments";
import IncomingAttachments from "./components/IncomingAttachments";

const badgeSx = {
  "& .MuiBadge-badge": {
    position: "relative",
    transform: "none",
  },
} as const;

export default function DocumentCycleTab() {
  const t = useTranslations("project.documentCycle");
  const [outgoingCount, setOutgoingCount] = useState(0);
  const [incomingCount, setIncomingCount] = useState(0);

  return (
    <Box sx={{ p: 3 }}>
      <Tabs defaultValue="outgoing" dir="rtl" className="w-full">
        <TabsList className="bg-transparent h-12 p-0 gap-6 justify-start border-b border-border rounded-none w-full">
          <TabsTrigger
            value="outgoing"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-2 gap-2"
          >
            {t("outgoingAttachments")}
            <Badge
              badgeContent={outgoingCount ?? "0"}
              color="primary"
              sx={badgeSx}
            />
          </TabsTrigger>
          <TabsTrigger
            value="incoming"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-2 gap-2"
          >
            {t("incomingAttachments")}
            <Badge
              badgeContent={incomingCount ?? "0"}
              color="primary"
              sx={badgeSx}
            />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="outgoing" className="mt-4">
          <OutgoingAttachments onTotalItemsChange={setOutgoingCount} />
        </TabsContent>

        <TabsContent value="incoming" className="mt-4">
          <IncomingAttachments onTotalItemsChange={setIncomingCount} />
        </TabsContent>
      </Tabs>
    </Box>
  );
}
