import { useQuery } from "@tanstack/react-query";
import GetBranchHierarchiesData from "../api/branch-tree-data";

export default function useBranchHierarchiesData(type?: string) {
  return useQuery({
    queryKey: [`branch-hierarchies-data`, type],
    queryFn: () => GetBranchHierarchiesData(type),
  });
}
