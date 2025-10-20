"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";
import useDocsData from "../hooks/useDocsData";
import { DocsResPaginatedT, GetDocsResT } from "../apis/get-docs";
import { DocumentT } from "../types/Directory";
import useFoldersList from "../hooks/useFoldersList";
import { SelectOption } from "@/types/select-option";
import { SearchFormData } from "../components/search-fields";
import useUsersData from "../hooks/useUsersData";

// Define context type
interface CxtType {
  // show item details
  showItemDetials: boolean;
  toggleShowItemDetials: () => void;
  // docs
  docs: GetDocsResT | undefined;
  docsPagination: DocsResPaginatedT | undefined;
  isLoadingDocs: boolean;
  refetchDocs: () => void;

  // selectedDocument
  selectedDocument: DocumentT | undefined;
  storeSelectedDocument: (document: DocumentT | undefined) => void;

  // branchId
  branchId: string;
  handleSetBranchId: (branchId: string) => void;
  // dialogs control
  openDirDialog: boolean;
  setOpenDirDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openFileDialog: boolean;
  setOpenFileDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openDirWithPassword: boolean;
  setOpenDirWithPassword: React.Dispatch<React.SetStateAction<boolean>>;

  // edited doc
  editedDoc: DocumentT | undefined;
  setEditedDoc: React.Dispatch<React.SetStateAction<DocumentT | undefined>>;

  // folder parent id
  parentId: string | undefined;
  setParentId: React.Dispatch<React.SetStateAction<string | undefined>>;

  // deleted doc id
  deletedDocId: string | undefined;
  setDeletedDocId: React.Dispatch<React.SetStateAction<string | undefined>>;

  // dir password
  dirPassword: string | undefined;
  setDirPassword: React.Dispatch<React.SetStateAction<string | undefined>>;
  // tempParentId
  tempParentId: string;
  setTempParentId: React.Dispatch<React.SetStateAction<string>>;
  // selected docs
  selectedDocs: DocumentT[];
  toggleDocInSelectedDocs: (doc: DocumentT) => void;
  clearSelectedDocs: () => void;

  // pagination variables
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;

  // folders list
  foldersList: SelectOption[] | undefined;
  isLoadingFoldersList: boolean;
  isErrorFoldersList: boolean;

  // search params
  searchData: SearchFormData;
  setSearchData: React.Dispatch<React.SetStateAction<SearchFormData>>;

  // visited dir
  visitedDirs: DocumentT[];
  setVisitedDirs: React.Dispatch<React.SetStateAction<DocumentT[]>>;

  // sort
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;

  // users list
  usersList: SelectOption[] | undefined;

  // docToView
  docToView: DocumentT | undefined;
  setDocToView: React.Dispatch<React.SetStateAction<DocumentT | undefined>>;
}

// Create the context
const Cxt = createContext<CxtType | undefined>(undefined);

// Provider component
interface PropsT {
  children: ReactNode;
}

export const PublicDocsCxtProvider: React.FC<PropsT> = ({ children }) => {
  // ** declare and define helper variables
  const [selectedDocument, setSelectedDocument] = useState<DocumentT>();
  const [showItemDetials, setShowItemDetials] = useState(false);
  const [branchId, setBranchId] = useState("all");
  // dialogs control
  const [openDirDialog, setOpenDirDialog] = useState(false);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [openDirWithPassword, setOpenDirWithPassword] = useState(false);
  // deleted doc id
  const [deletedDocId, setDeletedDocId] = useState<string>();
  // edited doc
  const [editedDoc, setEditedDoc] = useState<DocumentT | undefined>(undefined);
  // parent id
  const [parentId, setParentId] = useState<string>();
  const [dirPassword, setDirPassword] = useState<string>();
  const [tempParentId, setTempParentId] = useState("");
  // selected docs
  const [selectedDocs, setSelectedDocs] = useState<DocumentT[]>([]);

  // visited dirs
  const [visitedDirs, setVisitedDirs] = useState<DocumentT[]>([]);

  // users list
  const { data: usersList } = useUsersData();

  // docToView
  const [docToView, setDocToView] = useState<DocumentT | undefined>(undefined);

  // sort
  const [sort, setSort] = useState("desc");

  // search params
  const [searchData, setSearchData] = useState<SearchFormData>({
    endDate: "",
    type: "",
    documentType: "",
  });
  // pagination variables
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const {
    data: docsResponse,
    isLoading: isLoadingDocs,
    refetch: refetchDocs,
  } = useDocsData(
    branchId,
    parentId,
    dirPassword,
    limit,
    page,
    searchData,
    sort
  );

  // folders list
  const {
    data: foldersList,
    isLoading: isLoadingFoldersList,
    isError: isErrorFoldersList,
  } = useFoldersList();

  //  toggle show item details
  const toggleShowItemDetials = () => setShowItemDetials(!showItemDetials);

  const storeSelectedDocument = (document: DocumentT | undefined) => {
    setSelectedDocument(document);
  };

  const handleSetBranchId = (branchId: string) => setBranchId(branchId);

  const toggleDocInSelectedDocs = (doc: DocumentT) => {
    const _doc = selectedDocs.find((d) => d.id === doc.id);

    if (_doc) {
      setSelectedDocs(selectedDocs.filter((d) => d.id !== _doc.id));
    } else {
      setSelectedDocs([...selectedDocs, doc]);
    }
  };

  const clearSelectedDocs = () => setSelectedDocs([]);

  // ** return provider
  return (
    <Cxt.Provider
      value={{
        // show item details
        showItemDetials,
        // toggle show item details
        toggleShowItemDetials,
        // docs
        docs: docsResponse?.payload,
        docsPagination: docsResponse?.pagination,
        isLoadingDocs,
        refetchDocs,
        // selectedDocument
        selectedDocument,
        storeSelectedDocument,
        // branchId
        branchId,
        handleSetBranchId,
        // dialogs control
        openDirDialog,
        setOpenDirDialog,
        openFileDialog,
        setOpenFileDialog,
        openDirWithPassword,
        setOpenDirWithPassword,
        // edited doc
        editedDoc,
        setEditedDoc,
        // folder parent id
        parentId,
        setParentId,
        // deleted doc id
        deletedDocId,
        setDeletedDocId,
        // dir password
        dirPassword,
        setDirPassword,
        // temp parent id
        tempParentId,
        setTempParentId,
        // selected docs
        selectedDocs,
        toggleDocInSelectedDocs,
        clearSelectedDocs,
        // pagination variables
        limit,
        setLimit,
        page,
        setPage,
        // folders list
        foldersList,
        isLoadingFoldersList,
        isErrorFoldersList,
        // search params
        searchData,
        setSearchData,
        // visited dirs
        visitedDirs,
        setVisitedDirs,
        // sort
        sort,
        setSort,
        // docToView
        docToView,
        setDocToView,
        // users list
        usersList,
      }}
    >
      {children}
    </Cxt.Provider>
  );
};

// Custom hook to use the context
export const usePublicDocsCxt = () => {
  const context = useContext(Cxt);
  if (context === undefined) {
    throw new Error(
      "usePublicDocsCxt must be used within a PublicDocsCxtProvider"
    );
  }
  return context;
};
