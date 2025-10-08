"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";
import useDocsData from "../hooks/useDocsData";
import { GetDocsResT } from "../apis/get-docs";
import { DocumentT } from "../types/Directory";

// Define context type
interface CxtType {
  // show item details
  showItemDetials: boolean;
  toggleShowItemDetials: () => void;
  // docs
  docs: GetDocsResT | undefined;
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

  const {
    data: docs,
    isLoading: isLoadingDocs,
    refetch: refetchDocs,
  } = useDocsData(branchId, parentId, dirPassword);

  console.log("parentId,dirPassword", parentId, dirPassword);

  //  toggle show item details
  const toggleShowItemDetials = () => setShowItemDetials(!showItemDetials);

  const storeSelectedDocument = (document: DocumentT | undefined) => {
    setSelectedDocument(document);
  };

  const handleSetBranchId = (branchId: string) => setBranchId(branchId);

  // ** return provider
  return (
    <Cxt.Provider
      value={{
        // show item details
        showItemDetials,
        // toggle show item details
        toggleShowItemDetials,
        // docs
        docs,
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
