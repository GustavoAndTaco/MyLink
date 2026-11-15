import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Next.js SSR 및 HMR 환경에서 중복 초기화를 방지하며 Firebase App 인스턴스를 반환합니다.
 */
export const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(app);

/**
 * 브라우저 환경에서 지원 여부를 확인한 뒤 Firebase Analytics 인스턴스를 초기화합니다.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const supported = await isSupported();
  if (!supported) {
    return null;
  }

  return getAnalytics(app);
}
