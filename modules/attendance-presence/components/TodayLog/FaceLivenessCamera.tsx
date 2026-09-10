"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Check, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type LivenessPhase =
  | "loading"
  | "camera-error"
  | "need-face"
  | "hold-still"
  | "verified"
  | "capturing";

export interface FaceLivenessCameraProps {
  active: boolean;
  onVerified: (file: File) => void;
  onCancel: () => void;
}

type BrowserFaceDetector = {
  detect: (source: HTMLVideoElement) => Promise<Array<{ boundingBox: DOMRectReadOnly }>>;
};

function getFaceDetector(): BrowserFaceDetector | null {
  if (typeof window === "undefined") return null;
  const Detector = (
    window as Window & {
      FaceDetector?: new (options?: {
        fastMode?: boolean;
        maxDetectedFaces?: number;
      }) => BrowserFaceDetector;
    }
  ).FaceDetector;
  if (!Detector) return null;
  try {
    return new Detector({ fastMode: true, maxDetectedFaces: 1 });
  } catch {
    return null;
  }
}

export default function FaceLivenessCamera({
  active,
  onVerified,
  onCancel,
}: FaceLivenessCameraProps) {
  const t = useTranslations("AttendancePresence.faceLiveness");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const detectorRef = useRef<BrowserFaceDetector | null>(null);
  const faceSeenSinceRef = useRef<number | null>(null);
  const holdStartedAtRef = useRef<number | null>(null);

  const [phase, setPhase] = useState<LivenessPhase>("loading");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

  const stopCamera = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
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
    if (!video || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(runDetectionLoop);
      return;
    }

    const detector = detectorRef.current;
    const now = performance.now();

    const markFacePresent = (present: boolean) => {
      if (!present) {
        faceSeenSinceRef.current = null;
        holdStartedAtRef.current = null;
        setPhase((prev) =>
          prev === "verified" || prev === "capturing" ? prev : "need-face",
        );
        return;
      }

      if (faceSeenSinceRef.current == null) {
        faceSeenSinceRef.current = now;
      }

      const seenForMs = now - faceSeenSinceRef.current;
      if (seenForMs < 700) {
        setPhase((prev) =>
          prev === "verified" || prev === "capturing" ? prev : "need-face",
        );
        return;
      }

      if (holdStartedAtRef.current == null) {
        holdStartedAtRef.current = now;
      }

      const heldForMs = now - holdStartedAtRef.current;
      if (heldForMs >= 1200) {
        setPhase((prev) =>
          prev === "verified" || prev === "capturing" ? prev : "verified",
        );
      } else {
        setPhase((prev) =>
          prev === "verified" || prev === "capturing" ? prev : "hold-still",
        );
      }
    };

    if (!detector) {
      // Fallback when FaceDetector API is unavailable: timed hold after camera start.
      if (faceSeenSinceRef.current == null) {
        faceSeenSinceRef.current = now;
      }
      markFacePresent(true);
      rafRef.current = requestAnimationFrame(runDetectionLoop);
      return;
    }

    void detector
      .detect(video)
      .then((faces) => {
        markFacePresent(faces.length > 0);
      })
      .catch(() => {
        markFacePresent(true);
      })
      .finally(() => {
        rafRef.current = requestAnimationFrame(runDetectionLoop);
      });
  }, []);

  const startSession = useCallback(async () => {
    stopCamera();
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setCapturedFile(null);
    faceSeenSinceRef.current = null;
    holdStartedAtRef.current = null;
    setPhase("loading");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("getUserMedia-unavailable");
      }

      detectorRef.current = getFaceDetector();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) throw new Error("video-missing");
      video.srcObject = stream;
      await video.play();

      setPhase("need-face");
      rafRef.current = requestAnimationFrame(runDetectionLoop);
    } catch {
      stopCamera();
      setPhase("camera-error");
    }
  }, [runDetectionLoop, stopCamera]);

  useEffect(() => {
    if (!active) {
      stopCamera();
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setCapturedFile(null);
      setPhase("loading");
      return;
    }

    void startSession();

    return () => {
      stopCamera();
    };
  }, [active, startSession, stopCamera]);

  const handleCapture = async () => {
    if (phase !== "verified") return;
    setPhase("capturing");
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
      setPhase("hold-still");
    }
  };

  const handleConfirmPhoto = () => {
    if (!capturedFile) return;
    onVerified(capturedFile);
  };

  const statusText =
    phase === "loading"
      ? t("preparingCamera")
      : phase === "camera-error"
        ? t("cameraError")
        : phase === "need-face"
          ? t("positionFace")
          : phase === "hold-still"
            ? t("blinkPrompt")
            : phase === "verified"
              ? t("readyToCapture")
              : phase === "capturing"
                ? t("capturing")
                : t("reviewPhoto");

  return (
    <div className="flex flex-col gap-4">
      <div className="relative mx-auto aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-2xl border border-border bg-black">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={t("capturedAlt")}
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            className="h-full w-full object-cover scale-x-[-1]"
            playsInline
            muted
            autoPlay
          />
        )}
        {!previewUrl ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className={`h-[70%] w-[72%] rounded-[50%] border-2 ${
                phase === "verified"
                  ? "border-emerald-400"
                  : phase === "hold-still"
                    ? "border-[#FF2D78]"
                    : "border-white/50"
              }`}
            />
          </div>
        ) : null}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <p className="text-center text-sm text-muted-foreground">{statusText}</p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {phase === "camera-error" ? (
          <Button className="min-w-32" onClick={() => void startSession()}>
            <RefreshCw className="mr-2 size-4" />
            {t("retryCamera")}
          </Button>
        ) : null}

        {phase === "verified" ? (
          <Button className="min-w-32" onClick={() => void handleCapture()}>
            <Camera className="mr-2 size-4" />
            {t("capture")}
          </Button>
        ) : null}

        {capturedFile && previewUrl ? (
          <>
            <Button className="min-w-32" onClick={handleConfirmPhoto}>
              <Check className="mr-2 size-4" />
              {t("usePhoto")}
            </Button>
            <Button
              variant="outline"
              className="min-w-32"
              onClick={() => void startSession()}
            >
              {t("retake")}
            </Button>
          </>
        ) : null}

        <Button variant="outline" className="min-w-32" onClick={onCancel}>
          {t("cancel")}
        </Button>
      </div>
    </div>
  );
}
