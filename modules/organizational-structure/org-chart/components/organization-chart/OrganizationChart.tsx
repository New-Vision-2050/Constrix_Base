import { useState, useRef, useEffect } from 'react'
import { OrgChartNode } from '@/types/organization'
import { useToast } from '@/modules/table/hooks/use-toast'
import { Tree } from 'react-organizational-chart'
import TreeNodes from './TreeNodes'
import ChartControls from './ChartControls'
import ChartNode from './ChartNode'
import { useZoom } from './hooks/useZoom'
import ListView from './list-view/ListView'
import { exportChartAsPDF } from './utils/pdfExportUtils'
import './style.css'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react' // or use custom styles

interface OrganizationChartProps {
  data: OrgChartNode;
  listView?: boolean;
}

const OrganizationChart = ({ data, listView=true }: OrganizationChartProps) => {
  const { toast } = useToast()
  const {
    zoomLevel,
    zoomIn,
    zoomOut,
    setZoom,
    zoomStyle
  } = useZoom()
  const [selectedNode, setSelectedNode] = useState<OrgChartNode | null>(null)
  const [displayNode, setDisplayNode] = useState<OrgChartNode>(data)
  const [originalData, setOriginalData] = useState<OrgChartNode>(data)
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree')
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartTreeRef = useRef<HTMLDivElement>(null);
  const chartWrapperRef = useRef<HTMLDivElement>(null);

  // Set original data on component mount
  useEffect(() => {
    setOriginalData(data)
    setDisplayNode(data)
  }, [data])

  // Handle full screen mode
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Enter full screen mode
      if (chartWrapperRef.current?.requestFullscreen) {
        chartWrapperRef.current.requestFullscreen().then(() => {
          setIsFullScreen(true);
        }).catch((err) => {
          toast({
            title: "Full Screen Error",
            description: `Error attempting to enable full-screen mode: ${err.message}`,
            duration: 3000,
          });
        });
      }
    } else {
      // Exit full screen mode
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullScreen(false);
        }).catch((err) => {
          console.error(`Error attempting to exit full-screen mode: ${err.message}`);
        });
      }
    }
  };

  // Listen for full screen change events
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const handleNodeClick = (node: OrgChartNode) => {
    setSelectedNode(node)

    toast({
      title: node.name,
      description: `${node.type}`,
      duration: 3000
    })

    // Scroll to focus on selected node with delay to allow render
    if (viewMode === 'tree') {
      setTimeout(() => {
        if (chartContainerRef.current) {
          // Find the selected node element
          const selectedElement = chartContainerRef.current.querySelector(`.orgchart [data-node-id="${node.id}"]`) ||
            chartContainerRef.current.querySelector(`.orgchart .oc-node`)

          if (selectedElement) {
            selectedElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            })
          }
        }
      }, 100)
    }
  }

  // Make selected node the parent node and hide other parents
  const handleMakeParent = () => {
    if (selectedNode) {
      // Create a deep clone of the selected node to use as the new display node
      // This prevents modifying the original data structure
      const newRoot = JSON.parse(JSON.stringify(selectedNode))

      // Set this node as the new display node
      setDisplayNode(newRoot)

      // Add a visual indicator that we're in a focused view
      toast({
        title: 'View changed',
        description: `Now viewing ${selectedNode.name}'s organizational structure`,
        duration: 2000
      })
    }
  }

  const handleResetView = () => {
    setDisplayNode(originalData)
    setSelectedNode(null)
  }

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]) // Pass the first value from the array
  }

  const handleViewModeChange = (mode: 'tree' | 'list') => {
    setViewMode(mode)
  }

  const handleExportPDF = () => {
    // Get the chart tree content element
    const chartElement = chartTreeRef.current

    // Export the chart as PDF
    exportChartAsPDF(chartElement, `organization-chart-${displayNode.name}.pdf`)
  }

  return (
      <div
        ref={chartWrapperRef}
        className={`flex flex-col h-full ${isFullScreen ? 'bg-[#18003a] fixed inset-0 z-50' : ''}`}
      >
      <ChartControls
        zoomLevel={[zoomLevel]} // Convert single number to array
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomChange={handleZoomChange}
        onResetView={handleResetView}
        onMakeParent={handleMakeParent}
        selectedNode={selectedNode}
        isRootView={displayNode.id === originalData.id}
        viewMode={viewMode}
        listView={listView}
        onViewModeChange={handleViewModeChange}
        onExportPDF={viewMode === 'tree' ? handleExportPDF : undefined}
        isFullScreen={isFullScreen}
        onToggleFullScreen={toggleFullScreen}
      />

      {((viewMode === 'tree') || !listView) ? (
        <div
          ref={chartContainerRef}
          className="w-full h-full min-h-[700px] overflow-auto px-4 py-8"
        >
          <div
            ref={chartTreeRef}
            className="org-chart-container"
            style={zoomStyle}
          >
            <Tree
              lineWidth="2px"
              lineColor="#d1d5db"
              lineBorderRadius="5px"
              lineHeight="30px"
              nodePadding="20px"
              label={
                <div className={`flex flex-col items-center item-${displayNode.children?.length === 1 ? displayNode.children[0]?.type:displayNode?.type}`}>
                  <ChartNode
                    node={displayNode}
                    onNodeClick={handleNodeClick}
                    isSelected={selectedNode?.id === displayNode.id}
                    isFirst={true}
                  />
                  {displayNode.children?.length > 0 && (
                    <div className="relative w-full h-8">
                      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 rounded-full bg-white hover:bg-blue-50"
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log('Add new node under:', displayNode.id)
                          }}
                        >
                          <Plus className="h-4 w-4 text-primary"/>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>}
            >
              {displayNode.children?.map((childNode) => (
                <TreeNodes
                  key={childNode.id}
                  node={childNode}
                  onNodeClick={handleNodeClick}
                  selectedNodeId={selectedNode?.id || null}
                />
              ))}
            </Tree>
          </div>
        </div>
      ) : (listView && (
        <div className="w-full h-full overflow-auto">
          <ListView
            data={displayNode}
            onSelectNode={handleNodeClick}
            selectedNodeId={selectedNode?.id || null}
          />
        </div>
      ))}
    </div>
  )
}

export default OrganizationChart
