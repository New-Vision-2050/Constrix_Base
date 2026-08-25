"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import type {
  WebViewerInstance,
  WebViewerOptions,
} from "@pdftron/webviewer";
import { fetchStampAsDataUrl } from "../attachmentActions";
import {
  bindApryseViewerPersistence,
  restoreApryseViewerPersistence,
} from "./apryseViewerPersistence";

const WEBVIEWER_PATH = "/webviewer";

/** Extensions that use the Office editing pipeline (Word/Excel/PowerPoint, OpenDocument, RTF). */
const OFFICE_EXTENSIONS = new Set([
  "doc",
  "docx",
  "docm",
  "dotx",
  "xls",
  "xlsx",
  "xlsm",
  "xlsb",
  "xltx",
  "ppt",
  "pptx",
  "pptm",
  "potx",
  "odt",
  "ods",
  "odp",
  "rtf",
]);

/** Not supported in client-only WebViewer — requires WebViewer Server to preview in-browser. */
const CAD_EXTENSIONS = new Set(["dwg", "dxf", "dwf", "dwt"]);

function getLicenseKey(): string {
  return process.env.NEXT_PUBLIC_PDFTRON_LICENSE_KEY?.trim() ?? "";
}

function getExtensionFromFileName(name: string | undefined): string | undefined {
  if (!name?.includes(".")) return undefined;
  return name.split(".").pop()?.toLowerCase();
}

function safeViewerFileName(original: string | undefined, ext: string): string {
  const e = ext.replace(/^\./, "");
  const withExt = (base: string) =>
    base.toLowerCase().endsWith(`.${e}`) ? base : `${base}.${e}`;
  if (!original?.trim()) return withExt("document");
  const ascii = original
    .replace(/[^\x20-\x7E]/g, "_")
    .replace(/_+/g, "_")
    .trim();
  const base = (ascii || "document").replace(/[^a-zA-Z0-9._-]/g, "_");
  return withExt(base.slice(0, 180));
}

function getOfficeMime(ext: string): string {
  switch (ext) {
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "docm":
      return "application/vnd.ms-word.document.macroenabled.12";
    case "dotx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.template";
    case "doc":
      return "application/msword";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "xlsm":
      return "application/vnd.ms-excel.sheet.macroenabled.12";
    case "xlsb":
      return "application/vnd.ms-excel.sheet.binary.macroenabled.12";
    case "xltx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.template";
    case "xls":
      return "application/vnd.ms-excel";
    case "pptx":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case "pptm":
      return "application/vnd.ms-powerpoint.presentation.macroenabled.12";
    case "potx":
      return "application/vnd.openxmlformats-officedocument.presentationml.template";
    case "ppt":
      return "application/vnd.ms-powerpoint";
    case "odt":
      return "application/vnd.oasis.opendocument.text";
    case "ods":
      return "application/vnd.oasis.opendocument.spreadsheet";
    case "odp":
      return "application/vnd.oasis.opendocument.presentation";
    case "rtf":
      return "application/rtf";
    default:
      return "application/octet-stream";
  }
}

/** MIME for non-Office blobs passed to `loadDocument` (PDF, images, text, etc.). */
function mimeForExtension(ext: string): string {
  if (OFFICE_EXTENSIONS.has(ext)) return getOfficeMime(ext);
  if (ext === "pdf") return "application/pdf";

  const image: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    svg: "image/svg+xml",
    tif: "image/tiff",
    tiff: "image/tiff",
    ico: "image/x-icon",
    avif: "image/avif",
    heic: "image/heic",
    heif: "image/heif",
    jxl: "image/jxl",
    jp2: "image/jp2",
    ppm: "image/x-portable-pixmap",
    pgm: "image/x-portable-graymap",
    pbm: "image/x-portable-bitmap",
    xbm: "image/x-xbitmap",
    xpm: "image/x-xpixmap",
  };
  if (image[ext]) return image[ext];

  switch (ext) {
    case "txt":
      return "text/plain";
    case "csv":
      return "text/csv";
    case "html":
    case "htm":
      return "text/html";
    default:
      return "application/octet-stream";
  }
}

function isLegacyOfficeExtension(ext: string): boolean {
  return ext === "doc" || ext === "xls" || ext === "ppt";
}

/** `initialMode` on load is only documented for Word/Excel editors (not PowerPoint). */
function officeLoadInitialMode(ext: string): string | undefined {
  const wordLike = new Set([
    "doc",
    "docx",
    "docm",
    "dotx",
    "odt",
    "rtf",
  ]);
  const sheetLike = new Set([
    "xls",
    "xlsx",
    "xlsm",
    "xlsb",
    "xltx",
    "ods",
  ]);
  if (wordLike.has(ext)) return "docxEditor";
  if (sheetLike.has(ext)) return "spreadsheetEditor";
  return undefined;
}

async function toBlob(data: ArrayBuffer | Blob): Promise<Blob> {
  if (data instanceof Blob) return data;
  return new Blob([data], { type: "application/pdf" });
}

/** Registers the project stamp in Apryse Standard Stamps (first in the list). */
async function registerProjectStampInApryse(
  instance: WebViewerInstance,
  stampUrl: string,
): Promise<void> {
  const { documentViewer, Tools } = instance.Core;
  const stampTool = documentViewer.getTool(Tools.ToolNames.RUBBER_STAMP) as {
    setStandardStamps?: (stamps: string[]) => void;
    getDefaultStamps?: () => string[];
  } | null;

  if (!stampTool?.setStandardStamps) return;

  const dataUrl = await fetchStampAsDataUrl(stampUrl);
  const defaultStamps = stampTool.getDefaultStamps?.() ?? [];

  stampTool.setStandardStamps([dataUrl, ...defaultStamps]);
}

/** Commit in-progress ink/freehand strokes before exporting annotations. */
async function finalizeAnnotationsForExport(
  instance: WebViewerInstance,
): Promise<void> {
  const { documentViewer, Tools } = instance.Core;
  const activeTool = documentViewer.getToolMode() as {
    end?: () => void;
    complete?: () => void;
  } | null;

  activeTool?.end?.();
  activeTool?.complete?.();
  documentViewer.setToolMode(documentViewer.getTool(Tools.ToolNames.PAN));

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

/** Re-measure the host and fit the current page to the visible area. */
function syncViewerLayout(instance: WebViewerInstance): void {
  try {
    const ui = instance.UI as typeof instance.UI & { resize?: () => void };
    ui.resize?.();
    instance.Core.documentViewer.updateView();
    const fitPage = instance.UI.FitMode?.FitPage ?? "FitPage";
    instance.UI.setFitMode(fitPage);
  } catch {
    /* UI may not be ready during teardown */
  }
}

export type ApryseWebViewerHandle = {
  exportDocumentWithAnnotations: () => Promise<Blob>;
};

type ApryseWebViewerProps = {
  documentBuffer: ArrayBuffer;
  /** Lowercase extension from {@link resolveWebViewerExtension} — drives Office vs PDF pipeline. */
  extension: string;
  fileName?: string;
  /** Fired when a new document load starts — use to disable save/export. */
  onViewerPreparing?: () => void;
  /** Fired when the viewer can reliably export annotations (after stamp setup). */
  onViewerReady?: () => void;
  /** Fired when the user adds, modifies, or deletes a document annotation. */
  onAnnotationEdited?: () => void;
  /** Project stamp URL to register in Apryse Stamps panel */
  stampUrl?: string | null;
  /** When true, fills a flex/absolute parent (no minHeight fallback). */
  fillParent?: boolean;
};

export const ApryseWebViewer = forwardRef<
  ApryseWebViewerHandle,
  ApryseWebViewerProps
>(function ApryseWebViewer(
  {
    documentBuffer,
    extension: extRaw,
    fileName,
    onViewerPreparing,
    onViewerReady,
    onAnnotationEdited,
    stampUrl,
    fillParent = false,
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<WebViewerInstance | null>(null);
  const onViewerPreparingRef = useRef(onViewerPreparing);
  const onViewerReadyRef = useRef(onViewerReady);
  const onAnnotationEditedRef = useRef(onAnnotationEdited);
  const stampResizeCleanupRef = useRef<(() => void) | null>(null);
  const editListenerCleanupRef = useRef<(() => void) | null>(null);
  const persistenceCleanupRef = useRef<(() => void) | null>(null);
  onViewerPreparingRef.current = onViewerPreparing;
  onViewerReadyRef.current = onViewerReady;
  onAnnotationEditedRef.current = onAnnotationEdited;

  const ext = (extRaw || "pdf").toLowerCase();
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    exportDocumentWithAnnotations: async () => {
      const inst = instanceRef.current;
      if (!inst) {
        throw new Error("Viewer is not ready yet.");
      }
      const { documentViewer, annotationManager } = inst.Core;
      const doc = documentViewer.getDocument();
      if (!doc) {
        throw new Error("No document is loaded in the viewer.");
      }

      await finalizeAnnotationsForExport(inst);

      const xfdfString = await annotationManager.exportAnnotations();
      const exportExt = getExtensionFromFileName(fileName) || ext;
      const downloadType = OFFICE_EXTENSIONS.has(exportExt)
        ? "office"
        : "pdf";

      const data = await doc.getFileData({
        xfdfString,
        downloadType,
      });

      const blob = await toBlob(data as ArrayBuffer | Blob);
      if (downloadType === "pdf") {
        return blob.type === "application/pdf"
          ? blob
          : new Blob([await blob.arrayBuffer()], { type: "application/pdf" });
      }
      return blob;
    },
  }));

  const isOffice = OFFICE_EXTENSIONS.has(ext);
  const initPromiseRef = useRef<Promise<WebViewerInstance> | null>(null);
  const disposeChainRef = useRef<Promise<void>>(Promise.resolve());

  // Creates the WebViewer instance once per mount (or when switching between
  // the Office and non-Office rendering pipelines, which require different
  // initialization). Loading a *different document* into an already-created
  // instance is handled by the effect below via `instance.UI.loadDocument`,
  // instead of disposing and recreating the whole viewer — disposing while
  // Apryse still has in-flight draw calls from the previous load causes a
  // "Cannot read properties of null (reading 'drawImage')" crash, and a full
  // re-init is also a slow, jarring reload for what is otherwise just a
  // document swap (e.g. after saving annotations).
  //
  // Apryse requires a unique DOM node per instance. React Strict Mode (and
  // rapid remounts) re-run this effect on the same host element, so we mount
  // into a fresh child div and serialize dispose → init across effect cycles.
  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    let cancelled = false;
    let viewerElement: HTMLDivElement | null = null;

    const licenseKey = getLicenseKey();

    const initPromise = disposeChainRef.current.then(async () => {
      if (cancelled) throw new Error("cancelled");

      viewerElement = document.createElement("div");
      viewerElement.style.width = "100%";
      viewerElement.style.height = "100%";
      host.replaceChildren(viewerElement);

      const { default: WebViewer } = await import("@pdftron/webviewer");

      const officePreload = isLegacyOfficeExtension(ext)
        ? `${WebViewer.WorkerTypes.OFFICE},${WebViewer.WorkerTypes.LEGACY_OFFICE}`
        : WebViewer.WorkerTypes.OFFICE;

      const baseOptions: WebViewerOptions = {
        path: WEBVIEWER_PATH,
        licenseKey,
        ...(isOffice
          ? {
              enableOfficeEditing: true,
              fullAPI: true,
              preloadWorker: officePreload,
            }
          : {}),
      };

      const instance = isOffice
        ? await WebViewer(baseOptions, viewerElement)
        : await WebViewer.Iframe(baseOptions, viewerElement);

      if (cancelled) {
        await instance.UI.dispose();
        throw new Error("cancelled");
      }

      instanceRef.current = instance;
      return instance;
    });

    initPromiseRef.current = initPromise;
    initPromise.catch(() => {
      /* handled by the load effect below */
    });

    return () => {
      cancelled = true;
      initPromiseRef.current = null;
      stampResizeCleanupRef.current?.();
      stampResizeCleanupRef.current = null;
      persistenceCleanupRef.current?.();
      persistenceCleanupRef.current = null;

      disposeChainRef.current = initPromise
        .then(async (instance) => {
          if (instanceRef.current === instance) {
            instanceRef.current = null;
          }
          await instance.UI.dispose();
        })
        .catch(() => {
          instanceRef.current = null;
        })
        .finally(() => {
          viewerElement?.remove();
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOffice]);

  useEffect(() => {
    if (!documentBuffer.byteLength) return;

    if (CAD_EXTENSIONS.has(ext)) {
      setStatus("error");
      setErrorMessage(
        "DWG/DXF/DWF cannot be opened in client-only WebViewer. Use Apryse WebViewer Server or download the file.",
      );
      return;
    }

    let cancelled = false;
    setStatus("loading");
    setErrorMessage(null);
    onViewerPreparingRef.current?.();

    const initTimeoutMs = isOffice ? 180000 : 90000;
    const initTimeout = window.setTimeout(() => {
      if (!cancelled) {
        setErrorMessage(
          isOffice
            ? "Office document is taking too long to open. Ensure Office editing is enabled in your Apryse license."
            : "Document viewer is taking too long. Check the browser console.",
        );
        setStatus("error");
      }
    }, initTimeoutMs);

    (async () => {
      try {
        const instance = await initPromiseRef.current;
        if (cancelled || !instance) return;

        const loadName = safeViewerFileName(fileName, ext);

        const docSource = new Blob([documentBuffer], {
          type: isOffice ? getOfficeMime(ext) : mimeForExtension(ext),
        });

        const loadOpts: Record<string, unknown> = {
          extension: ext,
          filename: loadName,
        };

        const initialMode = officeLoadInitialMode(ext);
        if (initialMode) {
          loadOpts.initialMode = initialMode;
        }

        await instance.UI.loadDocument(docSource, loadOpts as never);

        if (cancelled) return;
        syncViewerLayout(instance);
        setStatus("ready");
      } catch (err: unknown) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMessage(msg);
        setStatus("error");
      } finally {
        clearTimeout(initTimeout);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(initTimeout);
    };
  }, [documentBuffer, fileName, ext, isOffice]);

  // Restore saved stamps/signatures and register the project stamp once ready.
  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance || status !== "ready") return;

    let cancelled = false;

    const setupStampResize = () => {
      stampResizeCleanupRef.current?.();

      const { annotationManager, Annotations } = instance.Core;
      const stampTool = instance.Core.documentViewer.getTool(
        instance.Core.Tools.ToolNames.RUBBER_STAMP,
      ) as { getDefaultStamps?: () => string[] } | null;
      const builtInNames = new Set(stampTool?.getDefaultStamps?.() ?? []);

      const onAnnotationChanged = (
        annots: unknown[],
        action: string,
        info?: { imported?: boolean },
      ) => {
        if (info?.imported || action !== "add") return;

        for (const annot of annots) {
          if (!(annot instanceof Annotations.StampAnnotation)) continue;

          const icon = annot.Icon;
          const isBuiltIn =
            typeof icon === "string" && builtInNames.has(icon);
          if (isBuiltIn) continue;

          const aspect = annot.Width / annot.Height || 1;
          annot.Height = 120;
          annot.Width = Math.round(120 * aspect);
          annotationManager.redrawAnnotation(annot);
        }
      };

      annotationManager.addEventListener(
        "annotationChanged",
        onAnnotationChanged,
      );
      stampResizeCleanupRef.current = () => {
        annotationManager.removeEventListener(
          "annotationChanged",
          onAnnotationChanged,
        );
      };
    };

    (async () => {
      try {
        let projectStampDataUrl: string | null = null;
        if (stampUrl) {
          projectStampDataUrl = await fetchStampAsDataUrl(stampUrl);
        }
        if (cancelled) return;

        await restoreApryseViewerPersistence(instance, projectStampDataUrl);
        if (cancelled) return;

        persistenceCleanupRef.current?.();
        persistenceCleanupRef.current = bindApryseViewerPersistence(instance);
        setupStampResize();

        editListenerCleanupRef.current?.();
        const { annotationManager } = instance.Core;
        const onUserAnnotationChanged = (
          _annots: unknown[],
          action: string,
          info?: { imported?: boolean },
        ) => {
          if (info?.imported) return;
          if (action !== "add" && action !== "modify" && action !== "delete") {
            return;
          }
          onAnnotationEditedRef.current?.();
        };
        annotationManager.addEventListener(
          "annotationChanged",
          onUserAnnotationChanged,
        );
        editListenerCleanupRef.current = () => {
          annotationManager.removeEventListener(
            "annotationChanged",
            onUserAnnotationChanged,
          );
        };
      } catch (stampError) {
        console.warn("Failed to set up Apryse stamp persistence:", stampError);
      } finally {
        if (!cancelled) {
          onViewerReadyRef.current?.();
        }
      }
    })();

    return () => {
      cancelled = true;
      editListenerCleanupRef.current?.();
      editListenerCleanupRef.current = null;
      persistenceCleanupRef.current?.();
      persistenceCleanupRef.current = null;
    };
  }, [stampUrl, status]);

  // Re-fit when the host resizes (e.g. confirm dialog flex layout settling).
  useEffect(() => {
    if (status !== "ready") return;

    const instance = instanceRef.current;
    const el = containerRef.current;
    if (!instance || !el) return;

    const sync = () => syncViewerLayout(instance);

    sync();
    const delayedSync = window.setTimeout(sync, 150);

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(sync);
    });
    observer.observe(el);

    return () => {
      clearTimeout(delayedSync);
      observer.disconnect();
    };
  }, [status, documentBuffer]);

  const viewerMinHeight = fillParent ? 0 : 400;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: viewerMinHeight,
        bgcolor: "background.default",
      }}
    >
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height: "100%",
          minHeight: viewerMinHeight,
          "& iframe": { border: 0 },
        }}
      />
      {status === "loading" && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "action.hover",
            pointerEvents: "none",
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}
      {status === "error" && errorMessage && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Typography variant="body2" color="error">
            {errorMessage}
          </Typography>
        </Box>
      )}
    </Box>
  );
});
