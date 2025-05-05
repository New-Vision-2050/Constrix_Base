
import { ZoomIn, ZoomOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { OrgChartNode } from "@/types/organization";
import { useLocale } from 'next-intl'

interface ChartControlsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomChange: (value: number[]) => void;
  onResetView: () => void;
  onMakeParent: () => void;
  selectedNode: OrgChartNode | null;
  isRootView: boolean;
}

const ChartControls = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomChange,
  onResetView,
  onMakeParent,
  selectedNode,
  isRootView
}: ChartControlsProps) => {
  const locale = useLocale()
  return (
    <div className="flex items-center justify-between bg-sidebar/50 p-2 mb-2 rounded-md shadow-sm">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Button variant="outline" size="sm" onClick={onZoomOut}>
          <ZoomOut size={18} />
        </Button>
        <div className="w-40">
          <Slider
            value={[zoomLevel]}
            min={0.5}
            max={2.0}
            step={0.1}
            onValueChange={onZoomChange}
            dir={locale === 'ar'? 'rtl' : 'ltr'}
          />
        </div>
        <Button variant="outline" size="sm" onClick={onZoomIn}>
          <ZoomIn size={18} />
        </Button>
        <span className="text-sm text-gray-500">{Math.round(zoomLevel * 100)}%</span>
      </div>
      <div className="flex space-x-2">
        {selectedNode && isRootView && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onMakeParent}
          >
            Make Selected Parent
          </Button>
        )}
        {!isRootView && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onResetView}
            className="flex items-center"
          >
            <ArrowLeft size={16} className="mr-1" /> Reset View
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChartControls;
