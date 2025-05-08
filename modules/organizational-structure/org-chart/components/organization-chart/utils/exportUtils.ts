
import { FlattenedNode } from "./flattenOrgNodes";
import { OrgChartNode } from "@/types/organization";
import React from 'react'

// Convert flattened org chart nodes to CSV format
export const exportToCSV = (data: FlattenedNode[]): void => {
  // Define the CSV headers
  const headers = [
    "إسم الإدارة",
    "وصف الإدارة",
    "مدير الإدارة",
    "عدد الادارات الفرعية",
    "عدد الفروع",
    "عدد الموظفين",
    "الحالة"
  ];

  // Map the data to CSV rows
  const csvRows = data.map(({ node, parentName }) => {
    return [
      node.name || 'N/A',
      node.description || 'N/A',
      node.manager?.name || 'N/A',
      node.management_count || '0',
      node.branch_count || '0',
      node.user_count || '0',
      'نشط'
    ];
  });

  // Combine headers and data
  const csvContent = [
    headers.join(","),
    ...csvRows.map(row => row.join(","))
  ].join("\n");

  // Create a Blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  // Create a link element to trigger the download
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "organization-chart.csv");
  link.style.display = "none";
  
  // Add to DOM, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};

// Format the entire org chart into rows for export
export const prepareOrgDataForExport = (orgData: OrgChartNode): FlattenedNode[] => {
  // Use this function to prepare the data in a format suitable for export
  // by flattening the hierarchy
  const flattenOrg = (
    node: OrgChartNode, 
    parentName: string = "", 
    depth: number = 0, 
    path: string = ""
  ): FlattenedNode[] => {
    const nodePath = path ? `${path}.${node.id}` : node.id;
    const result: FlattenedNode[] = [{ 
      node, 
      parentName, 
      depth, 
      path: nodePath,
      isVisible: true // All nodes should be included in the export
    }];
    
    if (node.children && node.children.length) {
      for (const child of node.children) {
        const flattenedChildren = flattenOrg(child, node.name, depth + 1, nodePath);
        result.push(...flattenedChildren);
      }
    }
    
    return result;
  };
  
  return flattenOrg(orgData);
};
