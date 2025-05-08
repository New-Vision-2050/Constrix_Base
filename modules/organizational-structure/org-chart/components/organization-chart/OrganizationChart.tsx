
import { useState, useRef, useEffect } from "react";
import { OrgChartNode } from "@/types/organization";
import { useToast } from "@/modules/table/hooks/use-toast";
import { Tree } from "react-organizational-chart";
import TreeNodes from "./TreeNodes";
import ChartControls from "./ChartControls";
import ChartNode from "./ChartNode";
import { useZoom } from "./hooks/useZoom";
import "./style.css"; // or use custom styles

interface OrganizationChartProps {
  data: OrgChartNode;
}

const OrganizationChart = ({ data }: OrganizationChartProps) => {
  const { toast } = useToast();
  const { 
    zoomLevel, 
    zoomIn, 
    zoomOut, 
    setZoom, 
    zoomStyle 
  } = useZoom();
  const [selectedNode, setSelectedNode] = useState<OrgChartNode | null>(null);
  const [displayNode, setDisplayNode] = useState<OrgChartNode>(data);
  const [originalData, setOriginalData] = useState<OrgChartNode>(data);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Set original data on component mount
  useEffect(() => {
    setOriginalData(data);
    setDisplayNode(data);
  }, [data]);

  const handleNodeClick = (node: OrgChartNode) => {
    setSelectedNode(node);
    
    toast({
      title: node.name,
      description: `${node.type}`,
      duration: 3000,
    });

    // Scroll to focus on selected node with delay to allow render
    setTimeout(() => {
      if (chartContainerRef.current) {
        // Find the selected node element
        const selectedElement = chartContainerRef.current.querySelector(`.orgchart [data-node-id="${node.id}"]`) || 
                                chartContainerRef.current.querySelector(`.orgchart .oc-node`);
        
        if (selectedElement) {
          selectedElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      }
    }, 100);
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
    setZoom(value);
  };

  return (
    <div className="flex flex-col h-full">
      <ChartControls
        zoomLevel={zoomLevel}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomChange={handleZoomChange}
        onResetView={handleResetView}
        onMakeParent={handleMakeParent}
        selectedNode={selectedNode}
        isRootView={displayNode.id === originalData.id}
      />
      <div 
        ref={chartContainerRef}
        className="w-full h-full min-h-[700px] overflow-auto px-4 py-8"
      >
        <div 
          className="org-chart-container"
          style={zoomStyle}
        >
          <Tree
            lineWidth="2px"
            lineColor="#d1d5db"
            lineBorderRadius="5px"
            lineHeight="30px"
            nodePadding="20px"
            label={<ChartNode
              node={displayNode}
              onNodeClick={handleNodeClick}
              isSelected={selectedNode?.id === displayNode.id}
              isFirst={true}
            />}
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
    </div>
  );
};

export default OrganizationChart;
