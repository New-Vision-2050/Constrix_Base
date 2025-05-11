import { ZoomIn, ZoomOut, RefreshCw, UserPlus, List, Trees, Download, FileType, Maximize, Minimize } from "lucide-react";
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { OrgChartNode } from '@/types/organization'
import { useLocale } from 'next-intl'

interface ChartControlsProps {
  zoomLevel: number[];
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomChange: (value: number[]) => void;
  onResetView: () => void;
  onMakeParent: () => void;
  selectedNode: any;
  isRootView: boolean;
  listView: boolean;
  viewMode: 'tree' | 'list';
  onViewModeChange: (mode: 'tree' | 'list') => void;
  onExportPDF?: () => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({
                                                       zoomLevel,
                                                       onZoomIn,
                                                       onZoomOut,
                                                       onZoomChange,
                                                       onResetView,
                                                       onMakeParent,
                                                       selectedNode,
                                                       isRootView,
                                                       viewMode,
                                                       onViewModeChange,
                                                       onExportPDF,
                                                       listView,
                                                       isFullScreen = false,
                                                       onToggleFullScreen,
                                                     }) => {
  const locale = useLocale()
  return (
    <div className="flex items-center justify-between bg-sidebar/50 p-2 mb-2 rounded-md shadow-sm">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Button variant="outline" size="icon" onClick={onZoomOut}>
          <ZoomOut size={18}/>
        </Button>
        <div className="w-40">
          <Slider
            value={zoomLevel}
            min={0.5}
            max={1.5}
            step={0.01}
            onValueChange={onZoomChange}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>
        <Button variant="outline" size="icon" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4"/>
        </Button>
        <Button variant="outline" size="icon" onClick={onResetView} disabled={isRootView}>
          <RefreshCw className="h-4 w-4"/>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        {selectedNode && (
          <Button variant="secondary" size="sm" onClick={onMakeParent}>
            <UserPlus className="h-4 w-4"/>
            Make Parent
          </Button>
        )}

        {viewMode === 'tree' && onExportPDF && (
          <Button variant="outline" size="sm" onClick={onExportPDF}>
            <FileType className="h-4 w-4"/>
            Export PDF
          </Button>
        )}

        {viewMode === 'tree' && onToggleFullScreen && (
          <Button variant="outline" size="sm" onClick={onToggleFullScreen}
                  title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}>
            {isFullScreen ? <Minimize className="h-4 w-4"/> : <Maximize className="h-4 w-4"/>}
          </Button>
        )}

        {listView && !isFullScreen &&(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              View Mode
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewModeChange('tree')}>
              <Trees className="h-4 w-4 mr-2"/>
              Tree View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewModeChange('list')}>
              <List className="h-4 w-4 mr-2"/>
              List View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        )}
      </div>
    </div>
  )
}

export default ChartControls
