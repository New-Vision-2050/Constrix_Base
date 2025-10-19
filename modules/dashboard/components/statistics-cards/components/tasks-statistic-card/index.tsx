import React from "react";
import workerImg from "@/assets/images/worker-beard-short.png";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

export default function TasksStatisticCard() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("UserProfile.header.statisticsCards");
  
  return (
    <div className="relative min-h-[177px] min-w-[250px] bg-sidebar shadow-md rounded-lg p-4 flex justify-between">
      <div className="flex flex-col justify-between gap-5 w-full">
        <div className="flex flex-col items-start gap-2">
          <h3 className="text-lg font-bold">{t("tasks")}</h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full bg-pink-300`}
          >
            أبريل
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            12
          </h2>
          <span className={`text-sm font-medium "text-green-600"`}>+15.6%</span>
        </div>
      </div>
      <img
        src={workerImg.src}
        alt="card image"
        className={`absolute bottom-0 ${
          isRtl ? "left-5" : "right-5"
        } h-[130px] w-auto`}
      />
    </div>
  );
}
