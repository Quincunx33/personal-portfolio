import React, { useState, useEffect, useRef, forwardRef } from "react";
import { HTMLMotionProps, motion } from "motion/react";

interface SecureImageProps extends Omit<HTMLMotionProps<"div">, "children"> {
  srcUri: string;
  alt?: string;
}

const SecureImage = forwardRef<HTMLDivElement, SecureImageProps>(
  ({ srcUri, className = "", alt = "", ...props }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    // Load the image in memory securely
    useEffect(() => {
      let isMounted = true;
      setIsLoaded(false);
      setHasError(false);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = srcUri;

      img.onload = () => {
        if (!isMounted) return;
        imageRef.current = img;
        setIsLoaded(true);
      };

      img.onerror = () => {
        if (!isMounted) return;
        setHasError(true);
      };

      return () => {
        isMounted = false;
      };
    }, [srcUri]);

    // Canvas drawing algorithms for Object-Fit behaviors
    const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) => {
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      const r = Math.min(w / iw, h / ih);
      let nw = iw * r;
      let nh = ih * r;
      let ar = 1;

      if (nw < w) ar = w / nw;
      if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
      nw *= ar;
      nh *= ar;

      const cw = iw / (nw / w);
      const ch = ih / (nh / h);

      const cx = (iw - cw) * 0.5;
      const cy = (ih - ch) * 0.5;

      ctx.drawImage(img, cx, cy, cw, ch, 0, 0, w, h);
    };

    const drawImageContain = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) => {
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      const r = Math.min(w / iw, h / ih);
      const nw = iw * r;
      const nh = ih * r;
      const cx = (w - nw) / 2;
      const cy = (h - nh) / 2;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, cx, cy, nw, nh);
    };

    // Keep canvas resolution synced to container metrics
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !isLoaded || !imageRef.current) return;

      const handleResize = () => {
        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, rect.width, rect.height);

        const fitMode = className?.includes("contain") ? "contain" : "cover";
        if (fitMode === "cover") {
          drawImageCover(ctx, imageRef.current!, rect.width, rect.height);
        } else {
          drawImageContain(ctx, imageRef.current!, rect.width, rect.height);
        }
      };

      handleResize();

      const observer = new ResizeObserver(() => {
        handleResize();
      });
      observer.observe(canvas);

      return () => {
        observer.disconnect();
      };
    }, [isLoaded, className]);

    return (
      <motion.div
        ref={ref}
        className={`relative overflow-hidden select-none ${className}`}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        {...props}
      >
        {/* The Secure Canvas - No Image src link, completely invisible to inspector scraping! */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block pointer-events-none"
          aria-label={alt}
          role="img"
        />

        {/* Dynamic Skeleton Loader */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 animate-pulse bg-slate-800/80 flex items-center justify-center">
            <span className="text-[10px] font-mono text-slate-500 tracking-wider">SECURE_LOAD</span>
          </div>
        )}

        {/* Fallback Display */}
        {hasError && (
          <div className="absolute inset-0 bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-2 text-center">
            <span className="text-[10px] font-mono text-red-400">SECURE_IMAGE_BLOCKED</span>
          </div>
        )}

        {/* Interaction blocker overlay guard */}
        <div 
          className="absolute inset-0 z-30 bg-transparent select-none p-0 m-0 cursor-default"
          onContextMenu={(e) => e.preventDefault()}
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    );
  }
);

SecureImage.displayName = "SecureImage";
export default SecureImage;
