import type { DocumentT } from "@/modules/docs-library/modules/publicDocs/types/Directory";

export type ProjectFolderContentsPayload = {
  folders: DocumentT[];
  files: DocumentT[];
};

export type ProjectFolderContentsPagination = {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
};

export type CopyMoveFileRequest = {
  folder_id: string;
  file_ids: string[];
};
