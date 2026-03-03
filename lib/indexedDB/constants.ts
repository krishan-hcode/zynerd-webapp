export const DB_NAME = 'cerebellumDB'; // Defines the name of IndexedDB
export const DB_VERSION = 3; // Defines the version of IndexedDB (incremented for image cache store)
export const TEST_SERIES = 'testSeries'; // Defines the name of the store for test series data
export const TEST_SERIES_UPDATED = 'testSeriesUpdated'; // Event name triggered when test series data is updated
export const QBANK_SESSIONS_KEY = 'qbankSessions'; // Defines the name of the store for qbank session data
export const PYQ_QBANK_SESSIONS_KEY = 'pyqQbankSessions'; // Defines the name of the store for pyq qbank session data
export const QBANK_SESSIONS_DB_NAME = 'qbankSessionsDB';
export const PYQ_QBANK_SESSIONS_DB_NAME = 'pyqQbankSessionsDB';
export const QBANK_RESULT_DB = 'qbankResultDB';
export const QBANK_RESULT_KEY = 'qbankResutlKey';
export const IMAGE_CACHE_STORE = 'imageCache'; // Defines the store for cached image blobs

export const STORE_NAMES = [
  TEST_SERIES,
  QBANK_RESULT_DB,
  PYQ_QBANK_SESSIONS_DB_NAME,
  QBANK_SESSIONS_DB_NAME,
  IMAGE_CACHE_STORE,
]; // List of store names, can be expanded as needed
