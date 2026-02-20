// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQoHQsjtLO3uuhcBVdA-UbA4t0qhq8mSw",
  authDomain: "nextteams-e9a45.firebaseapp.com",
  projectId: "nextteams-e9a45",
  storageBucket: "nextteams-e9a45.firebasestorage.app",
  messagingSenderId: "822130706738",
  appId: "1:822130706738:web:2e132c4c6b08d2c7f0ef2b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export { app }

export const getFirebaseMessaging = async () => {
  if (typeof window === "undefined") return null

  const supported = await isSupported()
  if (!supported) return null

  return getMessaging(app)
}