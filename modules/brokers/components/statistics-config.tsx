import { baseURL } from "@/config/axios-config";
import ArrowStaticIcon from "@/public/icons/arrow-static";
import ChartStaticIcon from "@/public/icons/chart-static";
import CheckStatic from "@/public/icons/check-static";
import PersonStaticIcon from "@/public/icons/person-static";

export const statisticsConfig = {
  url: `${baseURL}/dhd/widget`,
  icons: [
    <PersonStaticIcon key={1} />,
    <ArrowStaticIcon key={2} />,
    <CheckStatic key={4} />,
    <ChartStaticIcon key={3} />,
  ],
};
