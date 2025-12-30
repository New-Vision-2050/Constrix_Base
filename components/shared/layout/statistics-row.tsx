"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/config/axios-config";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { setCookie } from "cookies-next";

interface Config {
  url: string;
  icons: React.ReactNode[];
}

const StatisticsRow = ({ config, toggleRefetch }: { config: Config, toggleRefetch?: number }) => {
  // Extract locale from pathname to ensure reactivity when URL changes
  const pathname = usePathname();
  const locale = useMemo(() => {
    const segments = pathname.split("/");
    const possibleLocale = segments[1];
    return ["ar", "en"].includes(possibleLocale) ? possibleLocale : "ar";
  }, [pathname]);

  // Update cookie when locale changes to ensure axios interceptor uses correct locale
  useEffect(() => {
    setCookie("NEXT_LOCALE", locale);
  }, [locale]);

  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: [`widgets-${locale}`, config.url, toggleRefetch],
    queryFn: async () => {
      // Axios interceptor will automatically add Lang headers from NEXT_LOCALE cookie
      const response = await apiClient.get(config.url);
      return response.data;
    }
  });

  useEffect(() => {
    console.log('refetch()', toggleRefetch);
    refetch()
  }, [toggleRefetch, refetch]);

  const payload = useMemo(() => data?.payload || [{}, {}, {}, {}], [data]);

  return (
    <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
      {payload.map((item: any, index: number) => (
        <div
          key={index}
          className="bg-sidebar gap-4 items-start w-full text-foreground py-6 px-5 rounded-lg flex shadow-md"
        >
          {/* icon */}
          <div>{config.icons[index]}</div>

          <div className="flex flex-col">
            {/* title */}
            <h3
              className={cn(
                "text-xs ",
                isLoading && "h-4 w-32 bg-popover rounded-md animate-pulse"
              )}
            >
              {item?.title}
            </h3>
            {/* total */}
            <div
              className={cn(
                "flex gap-3 items-center mt-1",
                isLoading && "h-6 mt-1 w-24 bg-popover rounded-md animate-pulse"
              )}
            >
              {/* total */}
              <p className="text-2xl leading-none font-bold">{item.total}</p>
              {/* percentage */}
              <span
                dir="ltr"
                className={`text-lg font-semibold ${isSuccess &&
                  (item.percentage >= 0 ? "text-green-500" : "text-red-500")
                  }`}
              >
                {isSuccess && (
                  <>
                    ({item.percentage > 0 && "+"}
                    {Math.round(item.percentage)}%)
                  </>
                )}
              </span>
            </div>{" "}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsRow;
