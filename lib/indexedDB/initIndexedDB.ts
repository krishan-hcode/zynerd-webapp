import {openDB} from 'idb';
import {DB_NAME, DB_VERSION, STORE_NAMES} from './constants';

/**
 * Check if we're running in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Initializes IndexedDB with the specified stores.
 * Creates object stores if they do not exist.
 * @returns {Promise<IDBPDatabase | null>} The initialized database instance, or null if not in browser.
 */
export const initIndexedDB = async () => {
  // SSR guard: IndexedDB is only available in browser
  if (!isBrowser) {
    return null;
  }

  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      STORE_NAMES?.forEach(store => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store);
        }
      });
    },
  });
};

/**
 * Emits a custom event with the latest data from IndexedDB.
 * @param {string} storeName - The IndexedDB store name.
 * @param {string} key - The key to fetch data from.
 * @param {string} eventName - The name of the event to dispatch.
 */
export const emitIndexedDBEvent = async (
  storeName: string,
  storeKey: string,
  eventName: string,
) => {
  // SSR guard
  if (!isBrowser) {
    return;
  }

  const db = await initIndexedDB();
  if (!db) return;
  const latestData = (await db.get(storeName, storeKey)) || {};
  window.dispatchEvent(new CustomEvent(eventName, {detail: latestData}));
};

/**
 * Clears all IndexedDB stores to reset stored data during logout.
 */
export const clearIndexedDB = async () => {
  // SSR guard
  if (!isBrowser) {
    return;
  }

  try {
    const db = await initIndexedDB();
    if (!db) return;
    await Promise.all(STORE_NAMES?.map(storeName => db.clear(storeName)));
  } catch (error) {
    console.log('Failed to clear IndexedDB:', error);
  }
};
