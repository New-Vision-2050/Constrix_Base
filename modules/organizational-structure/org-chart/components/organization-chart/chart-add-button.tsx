import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrgChartNode } from "@/types/organization";

type PropsT = {
  node: OrgChartNode;
  onAddBtnClick?: (node: OrgChartNode) => void;
  ignoreAddAtFirstNode?: boolean;
};

export default function OrgChartAddButton({ node, onAddBtnClick, ignoreAddAtFirstNode }: PropsT) {
  // Check if the button should be hidden
  if (!onAddBtnClick || (ignoreAddAtFirstNode && node.is_main === 1)) return <></>;
  return (
    <div className="relative w-full h-8">
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full bg-white hover:bg-blue-50"
          onClick={(e) => {
            e.stopPropagation();
            onAddBtnClick?.(node);
          }}
        >
          <Plus className="h-4 w-4 text-primary" />
        </Button>
      </div>
    </div>
  );
}
