"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, RefreshCw, ScanFace, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type LivenessPhase =
  | "loading"
  | "camera-error"
  | "need-face"
  | "center-face"
  | "blink"
  | "verified"
  | "capturing";

export interface FaceLivenessCameraProps {
  active: boolean;
  onVerified: (file: File) => void;
  onCancel: () => void;
  /** Called when camera is missing/denied — attendance must not continue. */
  onCameraUnavailable?: () => void;
}

type Landmark = { x: number; y: number; z?: number };
type BlendshapeCategory = { categoryName: string; score: number };

type FaceLandmarkerInstance = {
  detectForVideo: (
    video: HTMLVideoElement,
    timestamp: number,
  ) => {
    faceLandmarks: Landmark[][];
    faceBlendshapes?: { categories: BlendshapeCategory[] }[];
  };
  close: () => void;
};

type VisionModule = {
  FaceLandmarker: {
    createFromOptions: (
      fileset: unknown,
      options: Record<string, unknown>,
    ) => Promise<FaceLandmarkerInstance>;
  };
  FilesetResolver: {
    forVisionTasks: (path: string) => Promise<unknown>;
  };
};

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm";
const VISION_ESM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/+esm";

const OVAL = { cx: 0.5, cy: 0.5, rx: 0.33, ry: 0.33 };

function isPointInsideCircle(x: number, y: number) {
  const nx = (x - OVAL.cx) / OVAL.rx;
  const ny = (y - OVAL.cy) / OVAL.ry;
  return nx * nx + ny * ny <= 1;
}

function getFaceBounds(landmarks: Landmark[]) {
  let minX = 1;
  let maxX = 0;
  let minY = 1;
  let maxY = 0;
  for (const point of landmarks) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }
  return {
    minX,
    maxX,
    minY,
    maxY,
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/** Entire face bbox must fit inside the guide circle — any overflow fails. */
function isFaceFullyInsideCircle(bounds: ReturnType<typeof getFaceBounds>) {
  if (bounds.width <= 0.12 || bounds.height <= 0.12) return false;
  if (bounds.width > OVAL.rx * 1.85 || bounds.height > OVAL.ry * 1.85) {
    return false;
  }

  const points = [
    { x: bounds.minX, y: bounds.minY },
    { x: bounds.maxX, y: bounds.minY },
    { x: bounds.minX, y: bounds.maxY },
    { x: bounds.maxX, y: bounds.maxY },
    { x: bounds.cx, y: bounds.minY },
    { x: bounds.cx, y: bounds.maxY },
    { x: bounds.minX, y: bounds.cy },
    { x: bounds.maxX, y: bounds.cy },
    { x: bounds.cx, y: bounds.cy },
  ];

  return points.every((point) => isPointInsideCircle(point.x, point.y));
}

declare global {
  interface Window {
    __faceLivenessVisionPromise?: Promise<VisionModule>;
  }
}

function loadVisionModule(): Promise<VisionModule> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("window-unavailable"));
  }
  if (!window.__faceLivenessVisionPromise) {
    window.__faceLivenessVisionPromise = import(
      /* webpackIgnore: true */
      /* @vite-ignore */
      VISION_ESM_URL
    ) as Promise<VisionModule>;
  }
  return window.__faceLivenessVisionPromise;
}

async function createFaceLandmarker() {
  const vision = await loadVisionModule();
  const fileset = await vision.FilesetResolver.forVisionTasks(WASM_URL);
  try {
    return await vision.FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
      runningMode: "VIDEO",
      numFaces: 1,
      outputFaceBlendshapes: true,
    });
  } catch {
    return vision.FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: "CPU" },
      runningMode: "VIDEO",
      numFaces: 1,
      outputFaceBlendshapes: true,
    });
  }
}

async function requestCameraStream() {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("getUserMedia-unavailable");
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideoInput = devices.some((device) => device.kind === "videoinput");
    // If the browser already exposed device kinds and none are cameras, fail fast.
    if (devices.length > 0 && !hasVideoInput) {
      throw new Error("no-camera-device");
    }
  } catch (error) {
    if (error instanceof Error && error.message === "no-camera-device") {
      throw error;
    }
  }

  const attempts: MediaStreamConstraints[] = [
    { audio: false, video: true },
    { audio: false, video: { facingMode: { ideal: "user" } } },
  ];
  let lastError: unknown;
  for (const constraints of attempts) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("camera-request-failed");
}

function getBlinkScore(categories: BlendshapeCategory[] | undefined) {
  if (!categories?.length) return 0;
  let left = 0;
  let right = 0;
  for (const category of categories) {
    if (category.categoryName === "eyeBlinkLeft") left = category.score;
    if (category.categoryName === "eyeBlinkRight") right = category.score;
  }
  return (left + right) / 2;
}

function ProgressRing({
  value,
  strokeColor,
}: {
  value: number;
  strokeColor: string;
}) {
  const radius = 47;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <svg
      className="absolute inset-0 size-full -rotate-90"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
    >
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="3"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

export default function FaceLivenessCamera({
  active,
  onVerified,
  onCancel,
  onCameraUnavailable,
}: FaceLivenessCameraProps) {
  const t = useTranslations("AttendancePresence.faceLiveness");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<FaceLandmarkerInstance | null>(null);
  const rafRef = useRef<number | null>(null);
  const sessionIdRef = useRef(0);
  const eyesWereOpenRef = useRef(true);
  const blinkClosedSeenRef = useRef(false);
  const blinkCompletedRef = useRef(false);
  const stableSinceRef = useRef<number | null>(null);

  const [phase, setPhase] = useState<LivenessPhase>("loading");
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const stopLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    stopLoop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, [stopLoop]);

  const resetChallenge = useCallback(() => {
    eyesWereOpenRef.current = true;
    blinkClosedSeenRef.current = false;
    blinkCompletedRef.current = false;
    stableSinceRef.current = null;
    setProgress(0);
  }, []);

  const captureFrame = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) {
      throw new Error("camera-not-ready");
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas-unavailable");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((result) => resolve(result), "image/jpeg", 0.92),
    );
    if (!blob) throw new Error("capture-failed");
    return new File([blob], `face-liveness-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });
  }, []);

  const runDetectionLoop = useCallback(() => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;
    if (!video || !landmarker || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(runDetectionLoop);
      return;
    }

    const result = landmarker.detectForVideo(video, performance.now());
    const landmarks = result.faceLandmarks?.[0];
    const now = performance.now();

    if (!landmarks?.length) {
      resetChallenge();
      setPhase("need-face");
      setProgress(8);
      rafRef.current = requestAnimationFrame(runDetectionLoop);
      return;
    }

    const bounds = getFaceBounds(landmarks);
    const inOval = isFaceFullyInsideCircle(bounds);
    let nextProgress = 20;
    let nextPhase: LivenessPhase = "center-face";

    if (!inOval) {
      stableSinceRef.current = null;
      blinkClosedSeenRef.current = false;
      blinkCompletedRef.current = false;
      eyesWereOpenRef.current = true;
      nextProgress = 28;
      nextPhase = "center-face";
    } else {
      if (stableSinceRef.current == null) stableSinceRef.current = now;
      const stableMs = now - stableSinceRef.current;
      const stableRatio = Math.min(1, stableMs / 2200);
      nextProgress = 45 + stableRatio * 15;

      if (stableMs < 2200) {
        nextPhase = "center-face";
      } else {
        nextPhase = "blink";
        nextProgress = 62;

        const blinkScore = getBlinkScore(
          result.faceBlendshapes?.[0]?.categories,
        );
        const eyesClosed = blinkScore > 0.42;
        const eyesOpen = blinkScore < 0.22;

        if (eyesWereOpenRef.current && eyesClosed) {
          blinkClosedSeenRef.current = true;
        }
        if (blinkClosedSeenRef.current && eyesOpen) {
          blinkCompletedRef.current = true;
        }
        eyesWereOpenRef.current = !eyesClosed;

        if (blinkClosedSeenRef.current && !blinkCompletedRef.current) {
          nextProgress = 82;
        }
        if (blinkCompletedRef.current) {
          nextProgress = 100;
          nextPhase = "verified";
        }
      }
    }

    setProgress((prev) => {
      if (nextProgress >= 100) {
        return Math.min(100, prev + 1.2);
      }
      if (nextProgress < prev) return Math.max(nextProgress, prev - 1.2);
      const step = Math.max(0.35, (nextProgress - prev) * 0.08);
      return Math.min(nextProgress, prev + step);
    });

    setPhase((prev) => {
      if (prev === "capturing") return prev;
      if (blinkCompletedRef.current) return "verified";
      return nextPhase;
    });

    rafRef.current = requestAnimationFrame(runDetectionLoop);
  }, [resetChallenge]);

  const startSession = useCallback(async () => {
    const sessionId = ++sessionIdRef.current;
    stopCamera();
    resetChallenge();
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setCapturedFile(null);
    setErrorDetail(null);
    setPhase("loading");

    try {
      if (!landmarkerRef.current) {
        landmarkerRef.current = await createFaceLandmarker();
      }
      const stream = await requestCameraStream();
      if (sessionId !== sessionIdRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) throw new Error("video-element-missing");
      video.srcObject = stream;
      video.muted = true;
      await new Promise<void>((resolve) => {
        if (video.readyState >= 1) {
          resolve();
          return;
        }
        video.onloadedmetadata = () => resolve();
      });
      try {
        await video.play();
      } catch {
        // muted autoplay fallback
      }

      if (sessionId !== sessionIdRef.current) return;
      setPhase("need-face");
      setProgress(5);
      rafRef.current = requestAnimationFrame(runDetectionLoop);
    } catch (error) {
      if (sessionId !== sessionIdRef.current) return;
      stopCamera();
      const message =
        error instanceof Error && error.message
          ? `${t("cameraError")} (${error.message})`
          : t("cameraError");
      setErrorDetail(message);
      setPhase("camera-error");
    }
  }, [resetChallenge, runDetectionLoop, stopCamera, t]);

  useEffect(() => {
    if (!active) {
      sessionIdRef.current += 1;
      stopCamera();
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setCapturedFile(null);
      setErrorDetail(null);
      setPhase("loading");
      setProgress(0);
      return;
    }

    const timer = window.setTimeout(() => {
      void startSession();
    }, 120);

    return () => {
      window.clearTimeout(timer);
      sessionIdRef.current += 1;
      stopCamera();
    };
  }, [active, startSession, stopCamera]);

  useEffect(() => {
    return () => {
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, []);

  const handleCapture = async () => {
    if (phase !== "verified" && progress < 100) return;
    setPhase("capturing");
    stopLoop();
    try {
      const file = await captureFrame();
      const url = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      setCapturedFile(file);
      stopCamera();
    } catch {
      setPhase("blink");
      rafRef.current = requestAnimationFrame(runDetectionLoop);
    }
  };

  // Auto-capture after full verification and progress reaches ~100%.
  useEffect(() => {
    if (phase !== "verified" || capturedFile || progress < 98) return;
    const timer = window.setTimeout(() => {
      void handleCapture();
    }, 700);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, capturedFile, progress]);

  const ringStrokeColor =
    progress >= 100
      ? "#34d399"
      : progress >= 60
        ? "#FF2D78"
        : progress >= 30
          ? "#fbbf24"
          : "rgba(255,255,255,0.75)";

  const statusText = useMemo(() => {
    if (phase === "loading") return t("preparingCamera");
    if (phase === "camera-error") return errorDetail || t("cameraError");
    if (phase === "need-face") return t("positionFace");
    if (phase === "center-face") return t("centerFace");
    if (phase === "blink") return t("blinkPrompt");
    if (phase === "verified" || phase === "capturing") return t("readyToCapture");
    return t("reviewPhoto");
  }, [errorDetail, phase, t]);

  const steps = [
    { key: "face", label: t("stepFace"), done: progress >= 20 },
    { key: "oval", label: t("stepOval"), done: progress >= 45 },
    { key: "blink", label: t("stepBlink"), done: progress >= 100 },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative mx-auto size-[min(52vh,420px,100%)] max-w-full">
        <div className="relative size-full overflow-hidden rounded-[24px] border border-white/10 bg-black shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          <video
            ref={videoRef}
            className={`h-full w-full object-cover scale-x-[-1] ${
              previewUrl ? "hidden" : "block"
            }`}
            playsInline
            muted
            autoPlay
          />
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={t("capturedAlt")}
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative aspect-square h-[78%] max-h-[78%] w-auto max-w-[78%]">
                  <ProgressRing value={progress} strokeColor={ringStrokeColor} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {!previewUrl ? (
        <div className="mx-auto grid w-full max-w-[420px] grid-cols-3 gap-2">
          {steps.map((step) => (
            <div
              key={step.key}
              className={`rounded-xl border px-2 py-1.5 text-center text-[11px] font-medium ${
                step.done
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                  : "border-border bg-muted/40 text-muted-foreground"
              }`}
            >
              <div className="mb-0.5 flex justify-center">
                {step.done ? (
                  <Check className="size-3.5" />
                ) : (
                  <ScanFace className="size-3.5 opacity-70" />
                )}
              </div>
              {step.label}
            </div>
          ))}
        </div>
      ) : null}

      <p className="text-center text-sm leading-snug text-muted-foreground">
        {statusText}
      </p>

      {phase === "camera-error" ? (
        <p className="text-center text-sm font-medium text-[#FF2D78]">
          {t("cannotRegisterWithoutCamera")}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {phase === "camera-error" ? (
          <>
            <Button
              className="min-w-28 rounded-full"
              onClick={() => void startSession()}
            >
              <RefreshCw className="mr-2 size-4" />
              {t("retryCamera")}
            </Button>
            <Button
              variant="outline"
              className="min-w-28 rounded-full"
              onClick={() => {
                (onCameraUnavailable ?? onCancel)();
              }}
            >
              <X className="mr-2 size-4" />
              {t("closeWithoutCamera")}
            </Button>
          </>
        ) : null}

        {capturedFile && previewUrl ? (
          <>
            <Button
              className="min-w-28 rounded-full bg-[#FF2D78] hover:bg-[#FF2D78]/90"
              onClick={() => onVerified(capturedFile)}
            >
              <Check className="mr-2 size-4" />
              {t("usePhoto")}
            </Button>
            <Button
              variant="outline"
              className="min-w-28 rounded-full"
              onClick={() => void startSession()}
            >
              {t("retake")}
            </Button>
          </>
        ) : null}

        {phase !== "camera-error" ? (
          <Button
            variant="outline"
            className="min-w-28 rounded-full"
            onClick={onCancel}
          >
            <X className="mr-2 size-4" />
            {t("cancel")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
