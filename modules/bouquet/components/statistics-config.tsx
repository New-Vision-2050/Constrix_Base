import { baseURL } from "@/config/axios-config";
import ArrowStaticIcon from "@/public/icons/arrow-static";
import ChartStaticIcon from "@/public/icons/chart-static";
import CheckStatic from "@/public/icons/check-static";
import PersonStaticIcon from "@/public/icons/person-static";

export const statisticsConfig = {
  url: `${baseURL}/companies/widget`,
  icons: [
    <PersonStaticIcon key="person-icon" />,
    <CheckStatic key="check-icon" />,
    <ChartStaticIcon key="chart-icon" />,
    <ArrowStaticIcon key="arrow-icon" />,
  ],
};
