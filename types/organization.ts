// Type definitions for organization chart

// Original types (kept for compatibility)
export interface PersonData {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar?: string;
  email?: string;
  phone?: string;
  location?: string;
  totalReports?: number;
}

type OrgChartManager = {
  id?: string | number;
  name?: string | number;
  email?: string | number;
  phone?: string | number;
  photo?: string | number;
};
export interface OrgChartNode {
  id: string;
  name: string;
  branch_id: string;
  description?: string;
  branch_count?: string | number;
  department_count?: string | number;
  management_count?: string | number;
  user_count?: string | number;
  manager_id?: string | number;
  parent_id?: string | number;
  type?: string;
  status?: number;
  reference_user_id: string;
  manager?: OrgChartManager;
  deputy_manager?: OrgChartManager;
  deputy_managers?: OrgChartManager[];
  person?: PersonData;
  children: OrgChartNode[];
  list?: OrgChartNode[];
  [key: string]: any;
}

export interface OrgChartConfig {
  nodeWidth: number;
  nodeHeight: number;
  nodePaddingX: number;
  nodePaddingY: number;
  nodeBorderRadius: number;
  nodeClickBehaviour: "EXPAND_COLLAPSE" | "SELECT" | null;
  siblingsGap?: number;
  levelsGap?: number;
}

// New API response types
export interface Manager {
  id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
}

export interface OrgNode {
  id: number;
  parent_id: number | null;
  name: string;
  type: "branch" | "management" | "department";
  manager_id: string | null;
  manager: Manager;
  department_count: number;
  management_count: number;
  branch_count: number;
  user_count: number;
  children: OrgNode[];
}

// export interface ApiResponse {
//   code: string;
//   message: string | null;
//   payload: OrgNode[];
// }

// Mapper function to convert API response to OrgChartNode format
// export const mapOrgNodeToChartNode = (orgNode: OrgNode): OrgChartNode => {
//   return {
//     id: String(orgNode.id),
//     person: {
//       id: orgNode.manager_id || String(orgNode.id),
//       name: orgNode.manager.name || orgNode.name,
//       title: orgNode.type.charAt(0).toUpperCase() + orgNode.type.slice(1),
//       department: orgNode.name,
//       avatar: undefined, // No avatar in the API response
//       email: orgNode.manager.email || undefined,
//       phone: orgNode.manager.phone || undefined,
//     },
//     hasChild: orgNode.children.length > 0,
//     hasParent: orgNode.parent_id !== null,
//     children: orgNode.children.map(mapOrgNodeToChartNode),
//   };
// };
