import { baseURL } from "@/config/axios-config";
import ArrowStaticIcon from "@/public/icons/arrow-static";
import ChartStaticIcon from "@/public/icons/chart-static";
import CheckStatic from "@/public/icons/check-static";
import PersonStaticIcon from "@/public/icons/person-static";

export const statisticsConfig = {
  url: `${baseURL}/projects/widgets`,
  icons: [
    <ArrowStaticIcon key={1} />,
    <PersonStaticIcon key={2} />,
    <ChartStaticIcon key={3} />,
    <CheckStatic key={4} />,
  ],
};
