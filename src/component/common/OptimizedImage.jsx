/* Developed by Grafizen International PVT. LTD. */
import React, { useMemo, useState } from "react";
import { getMediaUrl } from "@/utils/media";

const OptimizedImage = ({
  src,
  mobileSrc,
  alt = "Gawdee image",
  className = "",
  imgClassName = "",
  width,
  height,
  priority = false,
  objectFit = "cover",
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const finalSrc = useMemo(() => getMediaUrl(src, priority ? "medium" : "thumb"), [src, priority]);
  const finalMobileSrc = useMemo(() => getMediaUrl(mobileSrc, "thumb"), [mobileSrc]);

  if (!finalSrc || failed) {
    return (
      <div
        className={`bg-gray-100 animate-pulse ${className}`}
        style={{ width, height }}
        aria-label={alt}
      />
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-gray-100 ${className}`}
      style={{ width, height }}
    >
      {!loaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}

      <picture>
        {finalMobileSrc && (
          <source media="(max-width: 767px)" srcSet={finalMobileSrc} />
        )}

        <img
          src={finalSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`w-full h-full transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${imgClassName}`}
          style={{ objectFit }}
        />
      </picture>
    </div>
  );
};

export default OptimizedImage;