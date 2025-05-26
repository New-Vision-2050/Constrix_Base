import { useQuery } from "@tanstack/react-query";
import GetUsersHierarchiesData from "../api/users-tree-data";

export default function useUsersHierarchiesData() {
  return useQuery({
    queryKey: [`users-hierarchies-data`],
    queryFn: GetUsersHierarchiesData,
  });
}
