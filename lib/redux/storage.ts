import {WebStorage} from 'redux-persist/lib/types';

const createNoopStorage = (): WebStorage => {
  return {
    getItem(_key: string): Promise<string | null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, _value: string): Promise<void> {
      return Promise.resolve();
    },
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
};

const createBrowserStorage = (): WebStorage => {
  return {
    getItem(key: string): Promise<string | null> {
      return Promise.resolve(window.localStorage.getItem(key));
    },
    setItem(key: string, value: string): Promise<void> {
      window.localStorage.setItem(key, value);
      return Promise.resolve();
    },
    removeItem(key: string): Promise<void> {
      window.localStorage.removeItem(key);
      return Promise.resolve();
    },
  };
};

// Check if we're in the browser
const isBrowser =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const storage: WebStorage = isBrowser
  ? createBrowserStorage()
  : createNoopStorage();

export default storage;
