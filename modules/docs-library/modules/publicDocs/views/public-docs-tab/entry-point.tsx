import { useState } from "react";
import { DocumentsHeader, ViewMode } from "../../components/documents-header";
import { SearchFields, SearchFormData } from "../../components/search-fields";
import ModeViewsManager from "./ModeViewsManager";
import AllBranchesBtnList from "./AllBranchesList";
import { usePublicDocsCxt } from "../../contexts/public-docs-cxt";

export default function PublicDocsTabEntryPoint() {
  const { clearSelectedDocs, storeSelectedDocument } = usePublicDocsCxt();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
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
    storeSelectedDocument(undefined);
    clearSelectedDocs();
    setViewMode(mode);
  };

  const branchId = "all";

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
      <AllBranchesBtnList />
      <ModeViewsManager viewMode={viewMode} />
    </div>
  );
}
