'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = async (mode: 'environment' | 'user') => {
    setCameraError(null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1080 }, height: { ideal: 1080 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access device camera. Please grant camera permissions or use manual file upload.');
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCapturedImage(null);
  };

  const handleTakeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 640;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/webp', 0.85);
        setCapturedImage(dataUrl);
      }
    }
  };

  const handleConfirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-espresso/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-sans animate-fadeIn">
      <div className="bg-cream border border-cream-border rounded-3xl w-full max-w-[calc(100vw-1.5rem)] sm:max-w-lg p-4 sm:p-6 space-y-4 shadow-2xl animate-scaleUp max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-border pb-3">
          <h3 className="font-serif font-bold text-lg text-espresso flex items-center gap-2">
            <Camera className="w-5 h-5 text-terracotta" />
            Live Device Camera Snap
          </h3>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1 text-espresso/60 hover:text-espresso"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport or Snapshot Preview */}
        <div className="relative aspect-square w-full bg-espresso rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
          {capturedImage ? (
            <img src={capturedImage} alt="Snapshot Preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {cameraError && (
                <div className="absolute inset-0 bg-espresso/90 text-cream p-6 flex flex-col items-center justify-center text-center text-xs space-y-2">
                  <Camera className="w-8 h-8 text-crimson animate-bounce" />
                  <p>{cameraError}</p>
                </div>
              )}
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between pt-2">
          {!capturedImage ? (
            <>
              <button
                type="button"
                onClick={() => setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-cream-muted border border-cream-border rounded-xl text-xs font-bold text-espresso hover:bg-cream-border transition"
              >
                <RefreshCw className="w-4 h-4 text-terracotta" /> Switch Camera
              </button>

              <button
                type="button"
                onClick={handleTakeSnapshot}
                disabled={!!cameraError}
                className="flex items-center gap-2 px-6 py-2.5 bg-crimson text-cream font-bold text-xs rounded-xl shadow hover:bg-crimson-dark transition"
              >
                <Camera className="w-4 h-4 text-gold" /> Snap Photo
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setCapturedImage(null)}
                className="px-4 py-2 border border-cream-border rounded-xl text-xs font-bold text-espresso hover:bg-cream-muted"
              >
                Retake Photo
              </button>

              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 text-cream font-bold text-xs rounded-xl shadow hover:bg-emerald-800 transition"
              >
                <Check className="w-4 h-4 text-gold" /> Use Photo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
