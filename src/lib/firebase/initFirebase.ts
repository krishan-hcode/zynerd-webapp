import {
  FIREBASE_API,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from '@/utils/config';
import {Analytics, getAnalytics, isSupported} from 'firebase/analytics';
import {FirebaseApp, getApp, getApps, initializeApp} from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};
// Validate configuration
const hasRequiredConfig =
  FIREBASE_API &&
  FIREBASE_AUTH_DOMAIN &&
  FIREBASE_PROJECT_ID &&
  FIREBASE_APP_ID;

// Initialize Firebase App (only on client side)
let app: FirebaseApp | undefined;
let analytics: Analytics | null = null;

// Only initialize on client side
if (typeof window !== 'undefined' && hasRequiredConfig) {
  try {
    // Prevent multiple initializations
    const existingApps = getApps();
    app = existingApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

    // Initialize Analytics asynchronously
    isSupported()
      .then(supported => {
        if (!supported) {
          if (process.env.NODE_ENV === 'development') {
            console.log(
              '⚠️ Firebase Analytics is not supported in this environment',
            );
          }
          return;
        }
        try {
          analytics = getAnalytics(app!);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.log('❌ Error initializing Firebase Analytics:', error);
          }
        }
      })
      .catch(error => {
        if (process.env.NODE_ENV === 'development') {
          console.log('❌ Error checking Firebase Analytics support:', error);
        }
      });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('❌ Error initializing Firebase:', error);
    }
  }
} else if (typeof window === 'undefined') {
  // Server-side: do nothing
} else if (!hasRequiredConfig) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '⚠️ Firebase configuration is incomplete. Please check your environment variables.',
    );
  }
}

// Export for use in other files
export {analytics, app};

export default app;
