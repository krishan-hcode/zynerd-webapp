'use client';

import {getCachedImageUrl} from 'lib/indexedDB/imageCache';
import Image from 'next/image';
import {useEffect, useState} from 'react';

interface CachedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /** Cache TTL in milliseconds (default: 7 days) */
  cacheTTL?: number;
  /** Fallback image source if caching fails */
  fallbackSrc?: string;
}

/**
 * CachedImage Component
 *
 * Renders an image with IndexedDB caching support.
 * - First checks IndexedDB for a cached blob
 * - If cache miss, attempts to fetch from CDN and store in IndexedDB
 * - Falls back to regular img tag if CORS prevents fetching (e.g., signed CDN URLs)
 * - Uses object URLs for efficient rendering of cached blobs
 */
const CachedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  cacheTTL,
  fallbackSrc,
}: CachedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let isMounted = true;

    const loadImage = async () => {
      if (!src) {
        setIsLoading(false);
        setUseFallback(true);
        return;
      }

      try {
        // Try to get from cache or fetch and cache
        const cachedUrl = await getCachedImageUrl(src, cacheTTL);

        if (isMounted) {
          if (cachedUrl) {
            objectUrl = cachedUrl;
            setImageSrc(cachedUrl);
            setIsLoading(false);
          } else {
            // Caching failed (likely CORS) - fall back to original URL
            // Using img tag with original src bypasses CORS restrictions
            setImageSrc(src);
            setUseFallback(true);
            setIsLoading(false);
          }
        }
      } catch (err) {
        // On any error, fall back to using original src directly
        // This handles CORS errors gracefully
        if (isMounted) {
          setImageSrc(src);
          setUseFallback(true);
          setIsLoading(false);
        }
      }
    };

    loadImage();

    // Cleanup: revoke object URL to free memory
    return () => {
      isMounted = false;
      if (objectUrl && objectUrl.startsWith('blob:')) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src, cacheTTL]);

  // Show placeholder while loading
  if (isLoading) {
    return (
      <div
        className={`animate-pulse bg-gray-200 rounded-full ${className}`}
        style={{width, height}}
      />
    );
  }

  // Show fallback image source if provided and no valid image
  if (!imageSrc && fallbackSrc) {
    return (
      <Image
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  // Show placeholder if no image at all
  if (!imageSrc) {
    return (
      <div
        className={`bg-gray-300 flex items-center justify-center rounded-full ${className}`}
        style={{width, height}}>
        <span className="text-gray-500 text-xs">No Image</span>
      </div>
    );
  }

  // Use regular img tag for:
  // 1. Blob URLs from cache
  // 2. Fallback mode (CORS blocked URLs) - img tags bypass CORS
  if (imageSrc.startsWith('blob:') || useFallback) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  // Fallback to Next.js Image for other cases
  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default CachedImage;
