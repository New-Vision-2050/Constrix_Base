import { useState } from "react";
import { SearchFields, SearchFormData } from "../../components/search-fields";

export default function PublicDocsTabEntryPoint() {
  const [searchData, setSearchData] = useState<SearchFormData>({
    endDate: "",
    type: "",
    documentType: "",
  });

  console.log('searchData',searchData)

  return (
    <>
      <SearchFields
        data={searchData}
        onChange={setSearchData}
        isLoading={false}
      />
    </>
  );
}
