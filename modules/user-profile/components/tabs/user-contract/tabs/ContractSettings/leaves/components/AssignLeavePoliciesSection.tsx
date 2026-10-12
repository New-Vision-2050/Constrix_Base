"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/modules/table/hooks/use-toast";
import getVacationPolicies from "@/modules/hr-settings-vacations/api/get-vacation-policy";
import useAssignUserLeavePolicies from "../hooks/useAssignUserLeavePolicies";
import { UserLeavePolicyBalance } from "../types";

const TRANSLATION_NAMESPACE =
  "UserProfile.tabs.contractTabs.contractSettings";

/** The picker lists every company policy; one page of 100 is plenty. */
const POLICIES_PAGE_SIZE = 100;

type Props = {
  userId: string;
  year: number;
  /** The user's currently assigned policy rows (from the balances query). */
  assignedRows: UserLeavePolicyBalance[];
  assignedLoading?: boolean;
};

/**
 * Assign leave policies to the user.
 *
 * Sync semantics: the checked set REPLACES the user's assignments — on save we
 * send the full list of policy ids the user should end up with (empty = remove
 * all). Options come from GET /leave-policies and are pre-checked from the
 * user's current assignments.
 */
export default function AssignLeavePoliciesSection({
  userId,
  year,
  assignedRows,
  assignedLoading = false,
}: Props) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const dirtyRef = useRef(false);

  const assignedKey = useMemo(
    () =>
      assignedRows
        .map((row) => row.leave_policy_id)
        .sort()
        .join(","),
    [assignedRows],
  );

  // Pre-check the policies the user already has. Skipped while the user has
  // unsaved edits so a background refetch doesn't clobber their selection.
  useEffect(() => {
    if (dirtyRef.current) return;
    setSelected(
      new Set(assignedKey ? assignedKey.split(",").filter(Boolean) : []),
    );
  }, [assignedKey]);

  const { data: policiesData, isLoading: isPoliciesLoading } = useQuery({
    queryKey: ["leave-policy-picker-options"],
    queryFn: () =>
      getVacationPolicies({ limit: POLICIES_PAGE_SIZE, page: 1 }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const policies = useMemo(() => policiesData?.payload ?? [], [policiesData]);

  const filteredPolicies = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return policies;
    return policies.filter((policy) =>
      [policy.name, policy.leave_type_name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [policies, search]);

  const assignMutation = useAssignUserLeavePolicies(userId, year);

  const togglePolicy = (policyId: string, checked: boolean) => {
    dirtyRef.current = true;
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(policyId);
      } else {
        next.delete(policyId);
      }
      return next;
    });
  };

  const handleSave = () => {
    assignMutation.mutate(Array.from(selected), {
      onSuccess: () => {
        dirtyRef.current = false;
        toast({
          title: t("assignPolicies"),
          description: t("assignSuccess"),
          variant: "default",
        });
      },
      onError: (error) => {
        const apiMessage = (
          error as { response?: { data?: { message?: string } } }
        )?.response?.data?.message;
        toast({
          title: t("assignPolicies"),
          description:
            typeof apiMessage === "string" && apiMessage.trim()
              ? apiMessage
              : t("assignError"),
          variant: "destructive",
        });
      },
    });
  };

  const loading = assignedLoading || isPoliciesLoading;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-400">{t("assignPoliciesHint")}</p>

      <div className="relative max-w-sm">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPolicies")}
          className="ps-9"
        />
      </div>

      <div className="flex max-h-72 flex-col gap-1 overflow-y-auto rounded-lg border border-gray-700 p-2">
        {loading && (
          <div className="flex flex-col gap-2 p-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-9 animate-pulse rounded bg-white/5"
              />
            ))}
          </div>
        )}

        {!loading && filteredPolicies.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">
            {t("noPolicies")}
          </p>
        )}

        {!loading &&
          filteredPolicies.map((policy) => {
            const checked = selected.has(policy.id);
            return (
              <label
                key={policy.id}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 hover:bg-white/5"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(value) =>
                    togglePolicy(policy.id, value === true)
                  }
                />
                <span className="flex flex-col">
                  <span className="text-sm font-medium">{policy.name}</span>
                  {policy.leave_type_name && (
                    <span className="text-xs text-gray-400">
                      {policy.leave_type_name}
                    </span>
                  )}
                </span>
              </label>
            );
          })}
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={assignMutation.isPending || loading}
        >
          {assignMutation.isPending ? t("saving") : t("save")}
        </Button>
        <span className="text-xs text-gray-400">
          {t("selectedCount", { count: selected.size })}
        </span>
      </div>
    </div>
  );
}
