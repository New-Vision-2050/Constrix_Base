import { baseURL } from "@/config/axios-config";
import ArrowStaticIcon from "@/public/icons/arrow-static";
import ChartStaticIcon from "@/public/icons/chart-static";
import CheckStatic from "@/public/icons/check-static";
import PersonStaticIcon from "@/public/icons/person-static";

export const statisticsConfig = {
  url: `${baseURL}/company-users/widgets`,
  icons: [
    <PersonStaticIcon key={1} />,
    <CheckStatic key={2} />,
    <ChartStaticIcon key={3} />,
    <ArrowStaticIcon key={4} />,
  ],
};
