import { useState } from "react";
import { DocumentsHeader, ViewMode } from "../../components/documents-header";
import { SearchFields, SearchFormData } from "../../components/search-fields";

export default function PublicDocsTabEntryPoint() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchData, setSearchData] = useState<SearchFormData>({
    endDate: "",
    type: "",
    documentType: "",
  });

  // Handle add button click
  const handleAddClick = () => {
    console.log("Add new document clicked");
  };

  // Handle view mode change
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    console.log("View mode changed to:", mode);
  };

  return (
    <div className="space-y-4">
      <SearchFields
        data={searchData}
        onChange={setSearchData}
        isLoading={false}
      />
      <DocumentsHeader
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={handleAddClick}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        isLoading={false}
      />
    </div>
  );
}
