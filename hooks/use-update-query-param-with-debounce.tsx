import { useDebouncedCallback } from "use-debounce";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const useUpdateQueryParamsWithDebounce = (delay = 100) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQueryParams = useDebouncedCallback(
    (
      newParams: Record<string, string | number | (string | number)[] | null>
    ) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.delete(key);
          value.forEach((item) => {
            params.append(key, String(item));
          });
        } else {
          params.set(key, String(value));
        }
      });
      router.replace(`${pathname}?${params.toString()}`);
    },
    delay
  );

  return updateQueryParams;
};

export default useUpdateQueryParamsWithDebounce;
