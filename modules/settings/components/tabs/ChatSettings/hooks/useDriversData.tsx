import { useQuery } from "@tanstack/react-query";
import { getDrivers } from "../api/get-drivers";

interface PropsT {
  driverType?: string;
}

export default function useDriversData({ driverType }: PropsT) {
  return useQuery({
    queryKey: [`drivers-data`, driverType],
    queryFn: () => getDrivers(driverType),
  });
}
