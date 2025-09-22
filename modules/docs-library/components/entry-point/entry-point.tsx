import DocsStatisticsCardsList from "../statistics-cards/docs-statistics-cards-list";

export default function DocsLibraryEntryPoint() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <DocsStatisticsCardsList />
    </div>
  );
}
