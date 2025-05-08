import { Button } from "@/components/ui/button";
import {
  ArrowDownWideNarrow,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";

export const SearchBarActions = [
  {
    triggerButton: (
      <Button variant={"outline"}>
        <ArrowDownWideNarrow />
        <span>ترتيب</span>
        <ChevronDown />
      </Button>
    ),
    actions: [
      { text: "تصاعدي", onclick: () => {} },
      { text: "تنازلي", onclick: () => {} },
    ],
  },

  {
    triggerButton: (
      <Button variant={"outline"}>
        <LayoutDashboard />
        <span>عرض</span>
        <ChevronDown />
      </Button>
    ),
    actions: [
      { text: "قائمة", onclick: () => {} },
      { text: "ايقونات", onclick: () => {} },
    ],
  },
];
