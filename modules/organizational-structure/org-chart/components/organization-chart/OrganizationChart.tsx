import { useState, useRef, useEffect, MouseEvent } from "react";
import { OrgChartNode } from "@/types/organization";
import { useToast } from "@/modules/table/hooks/use-toast";
import { Tree } from "react-organizational-chart";
import TreeNodes from "./TreeNodes";
import ChartControls from "./ChartControls";
import ChartNode from "./ChartNode";
import { useZoom } from "./hooks/useZoom";
import ListView from "./list-view/ListView";
import { exportChartAsPDF } from "./utils/pdfExportUtils";
import "./style.css";
import OrgChartAddButton from "./chart-add-button";
import { DropdownItemT } from "@/components/shared/dropdown-button";

interface OrganizationChartProps {
  data: OrgChartNode;
  listView?: boolean;
  onAddBtnClick?: (node: OrgChartNode) => void;
  onEditBtnClick?: (node: OrgChartNode) => void;
  listViewAdditionalActions?: React.ReactNode;
  DropDownMenu?: (node: OrgChartNode) => DropdownItemT[];
  handleDeleteManagement?: (id: string | number) => void;
}

const OrganizationChart = ({
  data,
  listView = true,
  onAddBtnClick,
  DropDownMenu,
  listViewAdditionalActions,
}: OrganizationChartProps) => {
  const { toast } = useToast();
  const { zoomLevel, zoomIn, zoomOut, setZoom, handleWheelZoom, zoomStyle } =
    useZoom();
  const [selectedNode, setSelectedNode] = useState<OrgChartNode | null>(null);
  const [displayNode, setDisplayNode] = useState<OrgChartNode>(data);
  const [originalData, setOriginalData] = useState<OrgChartNode>(data);
  const [viewMode, setViewMode] = useState<"tree" | "list">("tree");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartTreeRef = useRef<HTMLDivElement>(null);
  const chartWrapperRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  // Set original data on component mount
  useEffect(() => {
    setOriginalData(data);
    setDisplayNode(data);
  }, [data]);

  // Handle full screen mode
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Enter full screen mode
      if (chartWrapperRef.current?.requestFullscreen) {
        chartWrapperRef.current
          .requestFullscreen()
          .then(() => {
            setIsFullScreen(true);
          })
          .catch((err) => {
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
        document
          .exitFullscreen()
          .then(() => {
            setIsFullScreen(false);
          })
          .catch((err) => {
            console.error(
              `Error attempting to exit full-screen mode: ${err.message}`
            );
          });
      }
    }
  };

  // Listen for full screen change events
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const handleNodeClick = (node: OrgChartNode) => {
    setSelectedNode(node);

    // toast({
    //   title: node.name,
    //   description: `${node.type}`,
    //   duration: 3000,
    // });

    // Scroll to focus on selected node with delay to allow render
    if (viewMode === "tree") {
      setTimeout(() => {
        if (chartContainerRef.current) {
          // Find the selected node element
          const selectedElement =
            chartContainerRef.current.querySelector(
              `.orgchart [data-node-id="${node.id}"]`
            ) || chartContainerRef.current.querySelector(`.orgchart .oc-node`);

          if (selectedElement) {
            selectedElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "center",
            });
          }
        }
      }, 100);
    }
  };

  // Make selected node the parent node and hide other parents
  const handleMakeParent = () => {
    if (selectedNode) {
      // Create a deep clone of the selected node to use as the new display node
      // This prevents modifying the original data structure
      const newRoot = JSON.parse(JSON.stringify(selectedNode));

      // Set this node as the new display node
      setDisplayNode(newRoot);

      // Add a visual indicator that we're in a focused view
      toast({
        title: "View changed",
        description: `Now viewing ${selectedNode.name}'s organizational structure`,
        duration: 2000,
      });
    }
  };

  const handleResetView = () => {
    setDisplayNode(originalData);
    setSelectedNode(null);
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]); // Pass the first value from the array
  };

  const handleViewModeChange = (mode: "tree" | "list") => {
    setViewMode(mode);
  };

  const handleExportPDF = () => {
    // Get the chart tree content element
    const chartElement = chartTreeRef.current;

    // Export the chart as PDF
    exportChartAsPDF(
      chartElement,
      `organization-chart-${displayNode.name}.pdf`
    );
  };

  // const locale = useLocale();
  // const pos = useRef({ x: 0, y: 0, startX: 0, startY: 0 });
  // const [isPanning, setIsPanning] = useState(false);
  //
  // const handleMouseDown = (e) => {
  //   if (e.target.closest('.node-content')) return;
  //   setIsPanning(true);
  //   pos.current.startX = e.clientX;
  //   pos.current.startY = e.clientY;
  //   console.log(pos)
  //   document.body.style.cursor = 'grabbing';
  // };
  //
  // const handleMouseMove = (e) => {
  //   if (!isPanning) return;
  //   const dx = e.clientX - pos.current.startX;
  //   const dy = e.clientY - pos.current.startY;
  //   chartTreeRef.current.style[locale === 'ar' ?'right': 'left'] = `${pos.current.x + (locale === 'ar' ?-dx: dx)}px`;
  //   chartTreeRef.current.style.top = `${pos.current.y + dy}px`;
  // };
  //
  // const handleMouseUp = () => {
  //   if (!isPanning) return;
  //   setIsPanning(false);
  //   pos.current.x = parseInt(chartTreeRef.current.style[locale === 'ar' ?'right': 'left'] || 0);
  //   pos.current.y = parseInt(chartTreeRef.current.style.top || 0);
  //   document.body.style.cursor = 'default';
  // };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest(".node-content")) return;
    if (!chartContainerRef.current) return;
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: chartContainerRef.current.scrollLeft,
      scrollTop: chartContainerRef.current.scrollTop,
    };
    document.body.classList.add("no-select");
    document.body.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !chartContainerRef.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    chartContainerRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
    chartContainerRef.current.scrollTop = dragStart.current.scrollTop - dy;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.classList.remove("no-select");
    document.body.style.cursor = "default";
  };

  useEffect(() => {
    const preventDrag = (e: DragEvent) => e.preventDefault();
    document.addEventListener("dragstart", preventDrag);
    return () => document.removeEventListener("dragstart", preventDrag);
  }, []);

  useEffect(() => {
    const wrapper = chartContainerRef.current;
    if (!wrapper) return;

    const handleWheel = (e: WheelEvent) => {
      handleWheelZoom(e, chartContainerRef);
    };
    wrapper.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      wrapper.removeEventListener("wheel", handleWheel);
    };
  }, [chartContainerRef, handleWheelZoom]);

  return (
    <div
      ref={chartWrapperRef}
      className={`flex flex-col h-full ${
        isFullScreen ? "bg-[#18003a] fixed inset-0 z-50" : ""
      }`}
    >
      <ChartControls
        zoomLevel={[zoomLevel]} // Convert single number to array
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomChange={handleZoomChange}
        onResetView={handleResetView}
        onMakeParent={handleMakeParent}
        selectedNode={selectedNode}
        isRootView={displayNode?.id === originalData?.id}
        viewMode={viewMode}
        listView={listView}
        onViewModeChange={handleViewModeChange}
        onExportPDF={viewMode === "tree" ? handleExportPDF : undefined}
        isFullScreen={isFullScreen}
        onToggleFullScreen={toggleFullScreen}
      />

      {viewMode === "tree" || !listView ? (
        <div
          ref={chartContainerRef}
          /*relative overflow-hidden*/
          className="w-full h-full min-h-[700px] overflow-auto px-4 py-8 cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            ref={chartTreeRef}
            /*absolute*/
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
                <div
                  className={`flex flex-col items-center item-${
                    displayNode?.children?.length === 1
                      ? displayNode.children[0]?.type
                      : displayNode?.type
                  }`}
                >
                  <ChartNode
                    node={displayNode}
                    onNodeClick={handleNodeClick}
                    isSelected={selectedNode?.id === displayNode.id}
                    isFirst={true}
                    // !Dropdown is temporarily disabled until a field is returned from the pack indicating that this command is controlled dynamically.
                    // DropDownMenu={DropDownMenu}
                  />
                  <OrgChartAddButton
                    node={displayNode}
                    onAddBtnClick={onAddBtnClick}
                  />
                </div>
              }
            >
              {displayNode.children?.map((childNode) => (
                <TreeNodes
                  key={childNode.id}
                  node={childNode}
                  onNodeClick={handleNodeClick}
                  DropDownMenu={DropDownMenu}
                  onAddBtnClick={onAddBtnClick}
                  selectedNodeId={selectedNode?.id || null}
                />
              ))}
            </Tree>
          </div>
        </div>
      ) : (
        listView && (
          <div className="w-full h-full overflow-auto">
            <ListView
              data={displayNode}
              onSelectNode={handleNodeClick}
              DropDownMenu={DropDownMenu}
              selectedNodeId={selectedNode?.id || null}
              additionalActions={listViewAdditionalActions}
            />
          </div>
        )
      )}
    </div>
  );
};

export default OrganizationChart;
