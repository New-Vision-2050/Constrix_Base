"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import useProjectAttachmentsDocsData from "../hooks/use-project-attachments-docs-data";
import useProjectFoldersList from "../hooks/use-project-folders-list";
import useProjectUsersData from "../hooks/use-project-users-data";
import type { DocumentT, ProjectAttachmentsSearchFormData } from "../types";
import type { SelectOption } from "@/types/select-option";
import type {
  ProjectFolderContentsPagination,
  ProjectFolderContentsPayload,
} from "@/services/api/projects/project-attachments";
import { ProjectAttachmentsTableLayout } from "../table/layout";
import type { TableParams } from "@/components/headless/table";

interface ProjectAttachmentsCxtType {
  projectId: string;
  showItemDetials: boolean;
  toggleShowItemDetials: () => void;
  docs: ProjectFolderContentsPayload | undefined;
  docsPagination: ProjectFolderContentsPagination | undefined;
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
  /** Headless table (nuqs `pa-*`): page, limit, search */
  tableParams: TableParams;
  foldersList: SelectOption[] | undefined;
  isLoadingFoldersList: boolean;
  isErrorFoldersList: boolean;
  handleRefetchFoldersList: () => void;
  searchData: ProjectAttachmentsSearchFormData;
  setSearchData: React.Dispatch<
    React.SetStateAction<ProjectAttachmentsSearchFormData>
  >;
  visitedDirs: DocumentT[];
  setVisitedDirs: React.Dispatch<React.SetStateAction<DocumentT[]>>;
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  usersList: SelectOption[] | undefined;
  handleRefetchUsersList: () => void;
  docToView: DocumentT | undefined;
  setDocToView: React.Dispatch<React.SetStateAction<DocumentT | undefined>>;
  /** Library widgets are not used on project pages; kept for parity with header actions. */
  handleRefetchDocsWidgets: () => void;
}

const ProjectAttachmentsCxt = createContext<
  ProjectAttachmentsCxtType | undefined
>(undefined);

interface ProjectAttachmentsCxtProviderProps {
  children: ReactNode;
  projectId: string;
  fixedType?: string;
}

export const ProjectAttachmentsCxtProvider: React.FC<
  ProjectAttachmentsCxtProviderProps
> = ({ children, projectId, fixedType }) => {
  const tableParams = ProjectAttachmentsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
    initialSearch: "",
  });

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
  const [searchData, setSearchData] = useState<ProjectAttachmentsSearchFormData>(
    {
      endDate: "",
      type: "",
      documentType: "",
    },
  );

  const mergedSearchData = useMemo(
    () => ({
      ...searchData,
      search: tableParams.search,
    }),
    [searchData, tableParams.search],
  );

  useEffect(() => {
    tableParams.setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset list when scope changes only
  }, [branchId, parentId]);

  const { data: usersList, refetch: refetchUsersList } = useProjectUsersData();

  const {
    data: docsResponse,
    isLoading: isLoadingDocs,
    refetch: refetchDocs,
  } = useProjectAttachmentsDocsData(
    projectId,
    branchId,
    parentId,
    dirPassword,
    tableParams.limit,
    tableParams.page,
    mergedSearchData,
    sort,
    fixedType,
  );

  const {
    data: foldersList,
    isLoading: isLoadingFoldersList,
    isError: isErrorFoldersList,
    refetch: refetchFoldersList,
  } = useProjectFoldersList(projectId);

  const handleRefetchUsersList = () => refetchUsersList();
  const handleRefetchFoldersList = () => refetchFoldersList();
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

  const handleRefetchDocsWidgets = useCallback(() => {
    // No docs-library widgets on project attachment view.
  }, []);

  return (
    <ProjectAttachmentsCxt.Provider
      value={{
        projectId,
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
        tableParams,
        foldersList,
        isLoadingFoldersList,
        isErrorFoldersList,
        handleRefetchFoldersList,
        searchData,
        setSearchData,
        visitedDirs,
        setVisitedDirs,
        sort,
        setSort,
        docToView,
        setDocToView,
        usersList,
        handleRefetchUsersList,
        handleRefetchDocsWidgets,
      }}
    >
      {children}
    </ProjectAttachmentsCxt.Provider>
  );
};

export const useProjectAttachmentsCxt = () => {
  const context = useContext(ProjectAttachmentsCxt);
  if (context === undefined) {
    throw new Error(
      "useProjectAttachmentsCxt must be used within ProjectAttachmentsCxtProvider",
    );
  }
  return context;
};
