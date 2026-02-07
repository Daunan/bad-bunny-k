import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy-api-key',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dummy.firebaseapp.com',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy-project',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'dummy.appspot.com',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123:web:dummy',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-DUMMY',
};

// Firebase 초기화 (이미 초기화된 경우 재사용)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firestore 초기화
const db = getFirestore(app);

// 오프라인 지속성 활성화 (브라우저 전용)
if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('Firebase persistence failed: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
            console.warn('Firebase persistence not available in this browser');
        }
    });
}

// Auth 인스턴스
export const auth = getAuth(app);
export { db };
export default app;
