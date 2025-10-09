import { useState } from "react";
import { DocumentsHeader, ViewMode } from "../../components/documents-header";
import { SearchFields } from "../../components/search-fields";
import ModeViewsManager from "./ModeViewsManager";
import AllBranchesBtnList from "./AllBranchesList";
import { usePublicDocsCxt } from "../../contexts/public-docs-cxt";

export default function PublicDocsTabEntryPoint() {
  const {
    clearSelectedDocs,
    storeSelectedDocument,
    searchData,
    setSearchData,
  } = usePublicDocsCxt();
  const [viewMode, setViewMode] = useState<ViewMode>("list");

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

  return (
    <div className="space-y-4">
      <SearchFields
        data={searchData}
        onChange={setSearchData}
        isLoading={false}
      />
      <DocumentsHeader
        searchValue={searchData?.search ?? ""}
        onSearchChange={(str)=>{
          setSearchData(prev=>({...prev,search:str}))
        }}
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
