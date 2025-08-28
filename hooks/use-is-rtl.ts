import { useLocale } from "next-intl";

export const useIsRtl = () => {
  const locale = useLocale();
  const isRtl = locale === "ar";
  return isRtl;
};
