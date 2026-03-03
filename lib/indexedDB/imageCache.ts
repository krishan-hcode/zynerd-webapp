import {IMAGE_CACHE_STORE} from './constants';
import {initIndexedDB} from './initIndexedDB';

/**
 * Interface for cached image entry
 */
interface IImageCacheEntry {
  blob: Blob;
  timestamp: number;
  ttl: number;
  url: string;
}

// Default TTL: 7 days in milliseconds
const DEFAULT_IMAGE_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

// Check if we're running in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Generates a cache key from URL
 * Uses a simple hash to create a valid IndexedDB key
 */
const generateCacheKey = (url: string): string => {
  // Simple hash function for URL
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `img_${Math.abs(hash)}`;
};

/**
 * Retrieves an image from the IndexedDB cache
 * @param url - The original image URL
 * @returns Object URL for the cached blob or null if not found/expired
 */
export const getImageFromCache = async (
  url: string,
): Promise<string | null> => {
  // SSR guard
  if (!isBrowser) {
    return null;
  }

  try {
    const db = await initIndexedDB();
    if (!db) return null;

    const cacheKey = generateCacheKey(url);
    const entry: IImageCacheEntry | undefined = await db.get(
      IMAGE_CACHE_STORE,
      cacheKey,
    );

    if (!entry) {
      return null;
    }

    // Check if cache entry has expired
    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.ttl;

    if (isExpired) {
      // Remove expired entry
      await db.delete(IMAGE_CACHE_STORE, cacheKey);
      return null;
    }

    // Create object URL from cached blob
    return URL.createObjectURL(entry.blob);
  } catch (error) {
    console.warn('Failed to get image from cache:', error);
    return null;
  }
};

/**
 * Stores an image in the IndexedDB cache
 * @param url - The original image URL
 * @param blob - The image blob data
 * @param ttl - Time-to-live in milliseconds (default: 7 days)
 */
export const storeImageInCache = async (
  url: string,
  blob: Blob,
  ttl: number = DEFAULT_IMAGE_CACHE_TTL,
): Promise<void> => {
  // SSR guard
  if (!isBrowser) {
    return;
  }

  try {
    const db = await initIndexedDB();
    if (!db) return;

    const cacheKey = generateCacheKey(url);

    const entry: IImageCacheEntry = {
      blob,
      timestamp: Date.now(),
      ttl,
      url,
    };

    await db.put(IMAGE_CACHE_STORE, entry, cacheKey);
  } catch (error) {
    console.warn('Failed to store image in cache:', error);
  }
};

/**
 * Fetches an image from URL and caches it
 * Uses a proxy API to bypass CORS restrictions for CDN images
 * @param url - The image URL to fetch and cache
 * @param ttl - Time-to-live in milliseconds
 * @returns Object URL for the fetched and cached image, or null if fetch fails
 */
export const fetchAndCacheImage = async (
  url: string,
  ttl: number = DEFAULT_IMAGE_CACHE_TTL,
): Promise<string | null> => {
  // SSR guard
  if (!isBrowser) {
    return null;
  }

  try {
    // First, try to fetch through our proxy API (bypasses CORS)
    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
    let response = await fetch(proxyUrl);

    // If proxy fails (e.g., domain not whitelisted), try direct fetch
    if (!response.ok) {
      console.warn('Proxy fetch failed, trying direct fetch:', response.status);
      response = await fetch(url, {
        mode: 'cors',
        credentials: 'omit',
      });
    }

    if (!response.ok) {
      console.warn('Image fetch failed with status:', response.status);
      return null;
    }

    const blob = await response.blob();

    // Store in cache
    await storeImageInCache(url, blob, ttl);

    // Return object URL
    return URL.createObjectURL(blob);
  } catch (error) {
    // Network error - log and return null
    console.warn('Image fetch failed:', error);
    return null;
  }
};

/**
 * Clears all expired images from the cache
 * Can be called periodically to clean up storage
 */
export const clearExpiredImages = async (): Promise<void> => {
  // SSR guard
  if (!isBrowser) {
    return;
  }

  try {
    const db = await initIndexedDB();
    if (!db) return;

    const tx = db.transaction(IMAGE_CACHE_STORE, 'readwrite');
    const store = tx.objectStore(IMAGE_CACHE_STORE);
    const keys = await store.getAllKeys();
    const now = Date.now();

    for (const key of keys) {
      const entry: IImageCacheEntry | undefined = await store.get(key);
      if (entry && now - entry.timestamp > entry.ttl) {
        await store.delete(key);
      }
    }

    await tx.done;
  } catch (error) {
    console.warn('Failed to clear expired images:', error);
  }
};

/**
 * Gets the cached image or fetches and caches it if not available
 * This is the main function to use for image caching
 * @param url - The image URL
 * @param ttl - Time-to-live in milliseconds
 * @returns Object URL for the image
 */
export const getCachedImageUrl = async (
  url: string,
  ttl: number = DEFAULT_IMAGE_CACHE_TTL,
): Promise<string | null> => {
  // SSR guard
  if (!isBrowser || !url) {
    return null;
  }

  // Try to get from cache first
  const cachedUrl = await getImageFromCache(url);
  if (cachedUrl) {
    return cachedUrl;
  }

  // Cache miss - fetch and store
  return fetchAndCacheImage(url, ttl);
};
