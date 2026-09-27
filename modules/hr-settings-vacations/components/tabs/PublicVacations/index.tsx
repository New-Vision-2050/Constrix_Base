"use client";



import { useState } from "react";

import Can from "@/lib/permissions/client/Can";

import { PERMISSIONS } from "@/lib/permissions/permission-names";

import { useTableStore } from "@/modules/table/store/useTableStore";

import { usePublicHolidayBranchCards } from "@/modules/hr-settings-vacations/hooks/usePublicHolidayBranchCards";

import BranchYearCards from "./BranchYearCards";

import PublicVacationsTableView from "./PublicVacationsTableView";



type View = "branches" | "table";



export default function PublicVacations() {

  const { cards, currentYear, isLoading, invalidate } =

    usePublicHolidayBranchCards();

  const [view, setView] = useState<View>("branches");

  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);



  const selectedCard = cards.find((card) => card.id === selectedBranchId);



  const handleOnSuccessFn = () => {

    useTableStore.getState().reloadTable("public-vacations-table");

    invalidate();

  };



  const openTable = (branchId: string, year: number) => {

    setSelectedBranchId(branchId);

    setSelectedYear(year);

    setView("table");

  };



  const handleYearSelect = (branchId: string, year: number) => {

    openTable(branchId, year);

  };



  const handleBranchSelect = (branchId: string) => {

    openTable(branchId, currentYear);

  };



  const handleBackToBranches = () => {

    setView("branches");

  };



  return (

    <Can check={[PERMISSIONS.vacations.settings.publicHoliday.view]}>

      {view === "branches" ? (

        <BranchYearCards

          cards={cards}

          onSelectYear={handleYearSelect}

          onSelectBranch={handleBranchSelect}

          isLoading={isLoading}

        />

      ) : selectedBranchId ? (

        <PublicVacationsTableView

          branchId={selectedBranchId}

          year={selectedYear}

          branchName={selectedCard?.name ?? ""}

          currentYear={currentYear}

          cards={cards}

          onBack={handleBackToBranches}

          onMutateSuccess={handleOnSuccessFn}

        />

      ) : null}

    </Can>

  );

}

