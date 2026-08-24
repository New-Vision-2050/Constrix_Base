"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { ApryseWebViewerHandle } from "./ApryseWebViewer";

export const EDIT_SETTLE_MS = 3000;

export type AnnotatedConfirmAction = "save" | "approve";

export type AnnotatedConfirmState = {
  action: AnnotatedConfirmAction;
  blob: Blob;
  buffer: ArrayBuffer;
};

type UseAnnotatedDocumentWorkflowOptions = {
  open: boolean;
  /** Viewer finished loading and can export. */
  viewerCanExport: boolean;
  /** Changes when the underlying file / viewer instance changes. */
  viewerInstanceKey: string;
  apryseRef: RefObject<ApryseWebViewerHandle | null>;
  onExportError: (message: string) => void;
};

/**
 * Workflow: load file → edit → export changes → confirmation preview → apply.
 * Confirm dialog cannot open until the user has edited the document.
 */
export function useAnnotatedDocumentWorkflow({
  open,
  viewerCanExport,
  viewerInstanceKey,
  apryseRef,
  onExportError,
}: UseAnnotatedDocumentWorkflowOptions) {
  const [hasEdits, setHasEdits] = useState(false);
  const [editsSettling, setEditsSettling] = useState(false);
  const [confirmExporting, setConfirmExporting] = useState(false);
  const [confirmPreviewReady, setConfirmPreviewReady] = useState(false);
  const [confirmState, setConfirmState] = useState<AnnotatedConfirmState | null>(
    null,
  );
  const [applyPending, setApplyPending] = useState(false);
  const editSettleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearEditSettleTimer = useCallback(() => {
    if (editSettleTimerRef.current) {
      clearTimeout(editSettleTimerRef.current);
      editSettleTimerRef.current = null;
    }
  }, []);

  const resetWorkflow = useCallback(() => {
    setHasEdits(false);
    setEditsSettling(false);
    setConfirmState(null);
    setConfirmPreviewReady(false);
    setConfirmExporting(false);
    setApplyPending(false);
    clearEditSettleTimer();
  }, [clearEditSettleTimer]);

  useEffect(() => {
    if (!open) resetWorkflow();
  }, [open, resetWorkflow]);

  useEffect(() => {
    setHasEdits(false);
    setEditsSettling(false);
    clearEditSettleTimer();
  }, [viewerInstanceKey, clearEditSettleTimer]);

  useEffect(
    () => () => {
      clearEditSettleTimer();
    },
    [clearEditSettleTimer],
  );

  const onAnnotationEdited = useCallback(() => {
    setHasEdits(true);
    setEditsSettling(true);
    clearEditSettleTimer();
    editSettleTimerRef.current = setTimeout(() => {
      setEditsSettling(false);
      editSettleTimerRef.current = null;
    }, EDIT_SETTLE_MS);
  }, [clearEditSettleTimer]);

  /** Step 3–4: export annotated file and open confirmation preview. */
  const requestConfirm = useCallback(
    async (action: AnnotatedConfirmAction) => {
      if (!viewerCanExport || !hasEdits || editsSettling || !apryseRef.current) {
        return;
      }

      setConfirmExporting(true);
      try {
        const blob = await apryseRef.current.exportDocumentWithAnnotations();
        setConfirmPreviewReady(false);
        setConfirmState({
          action,
          blob,
          buffer: await blob.arrayBuffer(),
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : String(err);
        onExportError(message);
      } finally {
        setConfirmExporting(false);
      }
    },
    [
      apryseRef,
      editsSettling,
      hasEdits,
      onExportError,
      viewerCanExport,
    ],
  );

  const closeConfirm = useCallback(() => {
    if (applyPending) return;
    setConfirmState(null);
    setConfirmPreviewReady(false);
  }, [applyPending]);

  const onPreviewPreparing = useCallback(() => {
    setConfirmPreviewReady(false);
  }, []);

  const onPreviewReady = useCallback(() => {
    setConfirmPreviewReady(true);
  }, []);

  const markApplied = useCallback(() => {
    setHasEdits(false);
    setConfirmState(null);
    setConfirmPreviewReady(false);
  }, []);

  const canOpenConfirm =
    viewerCanExport && hasEdits && !editsSettling && !confirmExporting;

  const isBusy = applyPending || confirmExporting;

  return {
    hasEdits,
    editsSettling,
    confirmExporting,
    confirmPreviewReady,
    confirmState,
    applyPending,
    setApplyPending,
    canOpenConfirm,
    isBusy,
    onAnnotationEdited,
    requestConfirm,
    closeConfirm,
    markApplied,
    onPreviewPreparing,
    onPreviewReady,
  };
}
