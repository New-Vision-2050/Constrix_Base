import type { WebViewerInstance } from "@pdftron/webviewer";

const STORAGE_KEYS = {
  customStamps: "constrix-apryse-custom-stamps",
  standardStamps: "constrix-apryse-user-standard-stamps",
  signatures: "constrix-apryse-signatures",
  initials: "constrix-apryse-initials",
} as const;

type SerializableCustomStamp = {
  title: string;
  subtitle?: string;
  color?: string;
  textColor?: string;
  id?: string;
  font?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikeout?: boolean;
  opacity?: number;
};

type RubberStampTool = {
  getDefaultStamps?: () => string[];
  getStandardStamps?: () => string[];
  getCustomStamps?: () => SerializableCustomStamp[];
  setStandardStamps?: (stamps: string[]) => void;
  setCustomStamps?: (stamps: SerializableCustomStamp[]) => void;
  addEventListener?: (
    type: string,
    fn: (...args: unknown[]) => void,
  ) => void;
  removeEventListener?: (
    type: string,
    fn: (...args: unknown[]) => void,
  ) => void;
};

type SignatureTool = {
  exportSignatures?: (exportFreeHandPaths?: boolean) => Promise<unknown>;
  importSignatures?: (data: unknown) => Promise<void>;
  exportInitials?: (exportFreeHandPaths?: boolean) => Promise<unknown>;
  importInitials?: (data: unknown) => Promise<void>;
  addEventListener?: (
    type: string,
    fn: (...args: unknown[]) => void,
  ) => void;
  removeEventListener?: (
    type: string,
    fn: (...args: unknown[]) => void,
  ) => void;
};

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to persist Apryse data (${key}):`, err);
  }
}

function isCustomStampArray(stamps: unknown[]): stamps is SerializableCustomStamp[] {
  const first = stamps[0];
  return (
    typeof first === "object" &&
    first !== null &&
    "title" in first &&
    typeof (first as SerializableCustomStamp).title === "string"
  );
}

function colorToHex(color: unknown): string | undefined {
  if (!color) return undefined;
  if (typeof color === "string") return color;
  if (typeof color === "object") {
    const c = color as {
      toHexString?: () => string;
      R?: number;
      G?: number;
      B?: number;
    };
    if (typeof c.toHexString === "function") return c.toHexString();
    if (
      typeof c.R === "number" &&
      typeof c.G === "number" &&
      typeof c.B === "number"
    ) {
      const hex = (n: number) => n.toString(16).padStart(2, "0");
      return `#${hex(c.R)}${hex(c.G)}${hex(c.B)}`;
    }
  }
  return undefined;
}

function serializeCustomStamps(
  stamps: SerializableCustomStamp[],
): SerializableCustomStamp[] {
  return stamps.map((stamp) => ({
    ...stamp,
    color: colorToHex(stamp.color) ?? stamp.color,
    textColor: colorToHex(stamp.textColor) ?? stamp.textColor,
  }));
}

function deserializeCustomStamps(
  stamps: SerializableCustomStamp[],
  Annotations: WebViewerInstance["Core"]["Annotations"],
): SerializableCustomStamp[] {
  return stamps.map((stamp) => {
    const next = { ...stamp };
    if (typeof next.color === "string" && next.color.startsWith("#")) {
      next.color = new Annotations.Color(next.color) as unknown as string;
    }
    if (typeof next.textColor === "string" && next.textColor.startsWith("#")) {
      next.textColor = new Annotations.Color(
        next.textColor,
      ) as unknown as string;
    }
    return next;
  });
}

function getUserStandardStamps(
  stamps: string[],
  builtInNames: Set<string>,
): string[] {
  return stamps.filter(
    (stamp) => stamp.startsWith("data:") || !builtInNames.has(stamp),
  );
}

function getStampTool(instance: WebViewerInstance): RubberStampTool | null {
  return instance.Core.documentViewer.getTool(
    instance.Core.Tools.ToolNames.RUBBER_STAMP,
  ) as RubberStampTool | null;
}

function getSignatureTool(instance: WebViewerInstance): SignatureTool | null {
  return instance.Core.documentViewer.getTool(
    instance.Core.Tools.ToolNames.SIGNATURE,
  ) as SignatureTool | null;
}

async function restorePersistedStamps(
  instance: WebViewerInstance,
  projectStampDataUrl?: string | null,
): Promise<void> {
  const stampTool = getStampTool(instance);
  if (!stampTool) return;

  const { Annotations } = instance.Core;
  const builtInNames = new Set(stampTool.getDefaultStamps?.() ?? []);
  const savedCustom = readJson<SerializableCustomStamp[]>(
    STORAGE_KEYS.customStamps,
  );
  const savedStandard = readJson<string[]>(STORAGE_KEYS.standardStamps);

  if (savedCustom?.length && stampTool.setCustomStamps) {
    stampTool.setCustomStamps(
      deserializeCustomStamps(savedCustom, Annotations),
    );
  }

  const userStandard = (savedStandard ?? []).filter(
    (stamp) => stamp.startsWith("data:") || !builtInNames.has(stamp),
  );
  const standardStamps = [
    ...(projectStampDataUrl ? [projectStampDataUrl] : []),
    ...userStandard.filter((stamp) => stamp !== projectStampDataUrl),
    ...(stampTool.getDefaultStamps?.() ?? []),
  ];

  stampTool.setStandardStamps?.(standardStamps);
}

async function restorePersistedSignatures(
  instance: WebViewerInstance,
): Promise<void> {
  const signatureTool = getSignatureTool(instance);
  if (!signatureTool) return;

  const savedSignatures = readJson<unknown>(STORAGE_KEYS.signatures);
  if (savedSignatures && signatureTool.importSignatures) {
    await signatureTool.importSignatures(savedSignatures);
  }

  const savedInitials = readJson<unknown>(STORAGE_KEYS.initials);
  if (savedInitials && signatureTool.importInitials) {
    await signatureTool.importInitials(savedInitials);
  }
}

export async function restoreApryseViewerPersistence(
  instance: WebViewerInstance,
  projectStampDataUrl?: string | null,
): Promise<void> {
  await restorePersistedStamps(instance, projectStampDataUrl);
  await restorePersistedSignatures(instance);
}

export function bindApryseViewerPersistence(
  instance: WebViewerInstance,
): () => void {
  const stampTool = getStampTool(instance);
  const signatureTool = getSignatureTool(instance);
  const cleanups: Array<() => void> = [];

  if (stampTool?.addEventListener) {
    const builtInNames = new Set(stampTool.getDefaultStamps?.() ?? []);

    const persistCustomStamps = () => {
      const stamps = stampTool.getCustomStamps?.() ?? [];
      writeJson(STORAGE_KEYS.customStamps, serializeCustomStamps(stamps));
    };

    const persistUserStandardStamps = () => {
      const stamps = stampTool.getStandardStamps?.() ?? [];
      writeJson(
        STORAGE_KEYS.standardStamps,
        getUserStandardStamps(stamps, builtInNames),
      );
    };

    const onStampsUpdated = (stamps: unknown) => {
      if (!Array.isArray(stamps)) return;
      if (stamps.length === 0) {
        persistCustomStamps();
        persistUserStandardStamps();
        return;
      }
      if (isCustomStampArray(stamps)) {
        persistCustomStamps();
      } else {
        persistUserStandardStamps();
      }
    };

    const onCustomStampsDeleted = () => {
      persistCustomStamps();
    };

    stampTool.addEventListener("stampsUpdated", onStampsUpdated);
    stampTool.addEventListener("customStampsDeleted", onCustomStampsDeleted);
    cleanups.push(() => {
      stampTool.removeEventListener?.("stampsUpdated", onStampsUpdated);
      stampTool.removeEventListener?.(
        "customStampsDeleted",
        onCustomStampsDeleted,
      );
    });
  }

  if (signatureTool?.addEventListener) {
    const persistSignatures = async () => {
      if (!signatureTool.exportSignatures) return;
      const data = await signatureTool.exportSignatures(false);
      writeJson(STORAGE_KEYS.signatures, data);
    };

    const persistInitials = async () => {
      if (!signatureTool.exportInitials) return;
      const data = await signatureTool.exportInitials(false);
      writeJson(STORAGE_KEYS.initials, data);
    };

    const onSignatureSaved = () => {
      void persistSignatures();
    };

    const onSignatureDeleted = () => {
      void persistSignatures();
    };

    const onInitialSaved = () => {
      void persistInitials();
    };

    const onInitialDeleted = () => {
      void persistInitials();
    };

    signatureTool.addEventListener("signatureSaved", onSignatureSaved);
    signatureTool.addEventListener("signatureDeleted", onSignatureDeleted);
    signatureTool.addEventListener("initialSaved", onInitialSaved);
    signatureTool.addEventListener("initialDeleted", onInitialDeleted);
    cleanups.push(() => {
      signatureTool.removeEventListener?.("signatureSaved", onSignatureSaved);
      signatureTool.removeEventListener?.(
        "signatureDeleted",
        onSignatureDeleted,
      );
      signatureTool.removeEventListener?.("initialSaved", onInitialSaved);
      signatureTool.removeEventListener?.("initialDeleted", onInitialDeleted);
    });
  }

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}
