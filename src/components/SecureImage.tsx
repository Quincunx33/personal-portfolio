import React, { useState, useEffect, forwardRef } from "react";
import { HTMLMotionProps, motion } from "motion/react";

interface SecureImageProps extends HTMLMotionProps<"img"> {
  srcUri: string;
}

const SecureImage = forwardRef<HTMLImageElement, SecureImageProps>(
  ({ srcUri, className, alt, ...props }, ref) => {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    useEffect(() => {
      let objectUrl: string | null = null;
      let isMounted = true;

      const fetchImage = async () => {
        try {
          const response = await fetch(srcUri);
          if (!response.ok) throw new Error("Failed to fetch image");
          const blob = await response.blob();
          if (isMounted) {
            objectUrl = URL.createObjectURL(blob);
            setBlobUrl(objectUrl);
          }
        } catch (error) {
          console.error("Error loading secure image:", error);
        }
      };

      fetchImage();

      return () => {
        isMounted = false;
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }, [srcUri]);

    if (!blobUrl) {
      // Return a placeholder or skeleton while loading
      return <div className={`animate-pulse bg-slate-200/20 ${className}`} />;
    }

    return (
      <motion.img
        ref={ref}
        src={blobUrl}
        className={className}
        alt={alt}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        {...props}
      />
    );
  }
);

SecureImage.displayName = "SecureImage";
export default SecureImage;
