"use client";

import { Box, Badge } from "@mui/material";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OutgoingAttachments from "./components/OutgoingAttachments";
import IncomingAttachments from "./components/IncomingAttachments";

export default function DocumentCycleTab() {
  const t = useTranslations("project.documentCycle");

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
              badgeContent={3}
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  position: "relative",
                  transform: "none",
                },
              }}
            />
          </TabsTrigger>
          <TabsTrigger
            value="incoming"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-2 gap-2"
          >
            {t("incomingAttachments")}
            <Badge
              badgeContent={3}
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  position: "relative",
                  transform: "none",
                },
              }}
            />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="outgoing" className="mt-4">
          <OutgoingAttachments />
        </TabsContent>

        <TabsContent value="incoming" className="mt-4">
          <IncomingAttachments />
        </TabsContent>
      </Tabs>
    </Box>
  );
}
