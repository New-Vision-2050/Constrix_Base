"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import useDocsData from "../hooks/useDocsData";
import { DocsResPaginatedT, GetDocsResT } from "../apis/get-docs";
import { DocumentT } from "../types/Directory";
import useFoldersList from "../hooks/useFoldersList";
import { SelectOption } from "@/types/select-option";
import { SearchFormData } from "../components/search-fields";
import useUsersData from "../hooks/useUsersData";

interface CxtType {
  showItemDetials: boolean;
  toggleShowItemDetials: () => void;
  docs: GetDocsResT | undefined;
  docsPagination: DocsResPaginatedT | undefined;
  isLoadingDocs: boolean;
  refetchDocs: () => void;
  selectedDocument: DocumentT | undefined;
  storeSelectedDocument: (document: DocumentT | undefined) => void;
  branchId: string;
  handleSetBranchId: (branchId: string) => void;
  openDirDialog: boolean;
  setOpenDirDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openFileDialog: boolean;
  setOpenFileDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openDirWithPassword: boolean;
  setOpenDirWithPassword: React.Dispatch<React.SetStateAction<boolean>>;
  editedDoc: DocumentT | undefined;
  setEditedDoc: React.Dispatch<React.SetStateAction<DocumentT | undefined>>;
  parentId: string | undefined;
  setParentId: React.Dispatch<React.SetStateAction<string | undefined>>;
  deletedDocId: string | undefined;
  setDeletedDocId: React.Dispatch<React.SetStateAction<string | undefined>>;
  dirPassword: string | undefined;
  setDirPassword: React.Dispatch<React.SetStateAction<string | undefined>>;
  tempParentId: string;
  setTempParentId: React.Dispatch<React.SetStateAction<string>>;
  selectedDocs: DocumentT[];
  toggleDocInSelectedDocs: (doc: DocumentT) => void;
  clearSelectedDocs: () => void;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  foldersList: SelectOption[] | undefined;
  isLoadingFoldersList: boolean;
  isErrorFoldersList: boolean;
  handleRefetchFoldersList: () => void;
  searchData: SearchFormData;
  setSearchData: React.Dispatch<React.SetStateAction<SearchFormData>>;
  visitedDirs: DocumentT[];
  setVisitedDirs: React.Dispatch<React.SetStateAction<DocumentT[]>>;
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  usersList: SelectOption[] | undefined;
  handleRefetchUsersList: () => void;
  docToView: DocumentT | undefined;
  setDocToView: React.Dispatch<React.SetStateAction<DocumentT | undefined>>;
  /** Set when viewing project attachments — folder APIs are project-scoped. */
  projectId?: string;
}

const Cxt = createContext<CxtType | undefined>(undefined);

type LibraryProps = {
  children: ReactNode;
  fixedType?: string;
};

function LibraryPublicDocsProviderInner({ children, fixedType }: LibraryProps) {
  const [selectedDocument, setSelectedDocument] = useState<DocumentT>();
  const [showItemDetials, setShowItemDetials] = useState(false);
  const [branchId, setBranchId] = useState("all");
  const [openDirDialog, setOpenDirDialog] = useState(false);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [openDirWithPassword, setOpenDirWithPassword] = useState(false);
  const [deletedDocId, setDeletedDocId] = useState<string>();
  const [editedDoc, setEditedDoc] = useState<DocumentT | undefined>(undefined);
  const [parentId, setParentId] = useState<string>();
  const [dirPassword, setDirPassword] = useState<string>();
  const [tempParentId, setTempParentId] = useState("");
  const [selectedDocs, setSelectedDocs] = useState<DocumentT[]>([]);
  const [visitedDirs, setVisitedDirs] = useState<DocumentT[]>([]);
  const [docToView, setDocToView] = useState<DocumentT | undefined>(undefined);
  const [sort, setSort] = useState("desc");
  const [searchData, setSearchData] = useState<SearchFormData>({
    endDate: "",
    type: "",
    documentType: "",
  });
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const { data: usersList, refetch: refetchUsersList } = useUsersData();

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
    sort,
    fixedType,
  );

  const {
    data: foldersList,
    isLoading: isLoadingFoldersList,
    isError: isErrorFoldersList,
    refetch: refetchFoldersList,
  } = useFoldersList();

  const toggleShowItemDetials = () => setShowItemDetials(!showItemDetials);
  const storeSelectedDocument = (document: DocumentT | undefined) => {
    setSelectedDocument(document);
  };
  const handleSetBranchId = (id: string) => setBranchId(id);

  const toggleDocInSelectedDocs = (doc: DocumentT) => {
    const _doc = selectedDocs.find((d) => d.id === doc.id);
    if (_doc) {
      setSelectedDocs(selectedDocs.filter((d) => d.id !== _doc.id));
    } else {
      setSelectedDocs([...selectedDocs, doc]);
    }
  };

  const clearSelectedDocs = () => {
    setSelectedDocs([]);
  };

  return (
    <Cxt.Provider
      value={{
        showItemDetials,
        toggleShowItemDetials,
        docs: docsResponse?.payload,
        docsPagination: docsResponse?.pagination,
        isLoadingDocs,
        refetchDocs,
        selectedDocument,
        storeSelectedDocument,
        branchId,
        handleSetBranchId,
        openDirDialog,
        setOpenDirDialog,
        openFileDialog,
        setOpenFileDialog,
        openDirWithPassword,
        setOpenDirWithPassword,
        editedDoc,
        setEditedDoc,
        parentId,
        setParentId,
        deletedDocId,
        setDeletedDocId,
        dirPassword,
        setDirPassword,
        tempParentId,
        setTempParentId,
        selectedDocs,
        toggleDocInSelectedDocs,
        clearSelectedDocs,
        limit,
        setLimit,
        page,
        setPage,
        foldersList,
        isLoadingFoldersList,
        isErrorFoldersList,
        handleRefetchFoldersList: () => refetchFoldersList(),
        searchData,
        setSearchData,
        visitedDirs,
        setVisitedDirs,
        sort,
        setSort,
        docToView,
        setDocToView,
        usersList,
        handleRefetchUsersList: () => refetchUsersList(),
        projectId: undefined,
      }}
    >
      {children}
    </Cxt.Provider>
  );
}

type ProjectProps = {
  children: ReactNode;
  fixedType?: string;
  projectId: string;
  initialParentId?: string;
};

function ProjectPublicDocsProviderInner({
  children,
  fixedType,
  projectId,
  initialParentId,
}: ProjectProps) {
  const [selectedDocument, setSelectedDocument] = useState<DocumentT>();
  const [showItemDetials, setShowItemDetials] = useState(false);
  const [branchId, setBranchId] = useState("all");
  const [openDirDialog, setOpenDirDialog] = useState(false);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [openDirWithPassword, setOpenDirWithPassword] = useState(false);
  const [deletedDocId, setDeletedDocId] = useState<string>();
  const [editedDoc, setEditedDoc] = useState<DocumentT | undefined>(undefined);
  const [parentId, setParentId] = useState<string | undefined>(initialParentId);
  const [dirPassword, setDirPassword] = useState<string>();
  const [tempParentId, setTempParentId] = useState("");
  const [selectedDocs, setSelectedDocs] = useState<DocumentT[]>([]);
  const [visitedDirs, setVisitedDirs] = useState<DocumentT[]>([]);
  const [docToView, setDocToView] = useState<DocumentT | undefined>(undefined);
  const [sort, setSort] = useState("desc");
  const [searchData, setSearchData] = useState<SearchFormData>({
    endDate: "",
    type: "",
    documentType: "",
    search: "",
  });
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset list when scope changes only
  }, [branchId, parentId]);

  const { data: usersList, refetch: refetchUsersList } = useUsersData();

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
    sort,
    fixedType,
    projectId,
  );

  const {
    data: foldersList,
    isLoading: isLoadingFoldersList,
    isError: isErrorFoldersList,
    refetch: refetchFoldersList,
  } = useFoldersList(projectId);

  const toggleShowItemDetials = () => setShowItemDetials(!showItemDetials);
  const storeSelectedDocument = (document: DocumentT | undefined) => {
    setSelectedDocument(document);
  };
  const handleSetBranchId = (id: string) => setBranchId(id);

  const toggleDocInSelectedDocs = (doc: DocumentT) => {
    const existing = selectedDocs.find((d) => d.id === doc.id);
    if (existing) {
      setSelectedDocs(selectedDocs.filter((d) => d.id !== existing.id));
    } else {
      setSelectedDocs([...selectedDocs, doc]);
    }
  };

  const clearSelectedDocs = () => {
    setSelectedDocs([]);
  };

  return (
    <Cxt.Provider
      value={{
        showItemDetials,
        toggleShowItemDetials,
        docs: docsResponse?.payload,
        docsPagination: docsResponse?.pagination,
        isLoadingDocs,
        refetchDocs,
        selectedDocument,
        storeSelectedDocument,
        branchId,
        handleSetBranchId,
        openDirDialog,
        setOpenDirDialog,
        openFileDialog,
        setOpenFileDialog,
        openDirWithPassword,
        setOpenDirWithPassword,
        editedDoc,
        setEditedDoc,
        parentId,
        setParentId,
        deletedDocId,
        setDeletedDocId,
        dirPassword,
        setDirPassword,
        tempParentId,
        setTempParentId,
        selectedDocs,
        toggleDocInSelectedDocs,
        clearSelectedDocs,
        limit,
        setLimit,
        page,
        setPage,
        foldersList,
        isLoadingFoldersList,
        isErrorFoldersList,
        handleRefetchFoldersList: () => refetchFoldersList(),
        searchData,
        setSearchData,
        visitedDirs,
        setVisitedDirs,
        sort,
        setSort,
        docToView,
        setDocToView,
        usersList,
        handleRefetchUsersList: () => refetchUsersList(),
        projectId,
      }}
    >
      {children}
    </Cxt.Provider>
  );
}

interface PropsT {
  children: ReactNode;
  fixedType?: string;
  projectId?: string;
  /** Initial folder scope when `projectId` is set (defaults to project root in API). */
  initialParentId?: string;
}

export const PublicDocsCxtProvider: React.FC<PropsT> = ({
  children,
  fixedType,
  projectId,
  initialParentId,
}) => {
  if (projectId) {
    return (
      <ProjectPublicDocsProviderInner
        fixedType={fixedType}
        projectId={projectId}
        initialParentId={initialParentId}
      >
        {children}
      </ProjectPublicDocsProviderInner>
    );
  }
  return (
    <LibraryPublicDocsProviderInner fixedType={fixedType}>
      {children}
    </LibraryPublicDocsProviderInner>
  );
};

export const usePublicDocsCxt = () => {
  const context = useContext(Cxt);
  if (context === undefined) {
    throw new Error(
      "usePublicDocsCxt must be used within a PublicDocsCxtProvider",
    );
  }
  return context;
};
