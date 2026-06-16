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

export type ApryseWebViewerHandle = {
  exportDocumentWithAnnotations: () => Promise<Blob>;
};

type ApryseWebViewerProps = {
  documentBuffer: ArrayBuffer;
  /** Lowercase extension from {@link resolveWebViewerExtension} — drives Office vs PDF pipeline. */
  extension: string;
  fileName?: string;
  onViewerReady?: () => void;
};

export const ApryseWebViewer = forwardRef<
  ApryseWebViewerHandle,
  ApryseWebViewerProps
>(function ApryseWebViewer(
  { documentBuffer, extension: extRaw, fileName, onViewerReady },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<WebViewerInstance | null>(null);
  const onViewerReadyRef = useRef(onViewerReady);
  onViewerReadyRef.current = onViewerReady;

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

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !documentBuffer.byteLength) return;

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

    const licenseKey = getLicenseKey();
    const isOffice = OFFICE_EXTENSIONS.has(ext);

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
        const { default: WebViewer } = await import("@pdftron/webviewer");

        if (cancelled || !containerRef.current) return;

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
          ? await WebViewer(baseOptions, el)
          : await WebViewer.Iframe(baseOptions, el);
        if (cancelled) {
          void instance.UI.dispose();
          return;
        }

        instanceRef.current = instance;

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
        setStatus("ready");
        onViewerReadyRef.current?.();
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
      const inst = instanceRef.current;
      instanceRef.current = null;
      if (inst) {
        void inst.UI.dispose();
      }
      el.replaceChildren();
    };
  }, [documentBuffer, fileName, ext]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 400,
        bgcolor: "background.default",
      }}
    >
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height: "100%",
          minHeight: 400,
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
