// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfEaS9lS_tYZ-EP2g4fdvbvN7GNvw5ka8",
  authDomain: "internship-d855d.firebaseapp.com",
  projectId: "internship-d855d",
  storageBucket: "internship-d855d.appspot.com",
  messagingSenderId: "314896808131",
  appId: "1:314896808131:web:e34a02f8fa3e293b6dca76",
  measurementId: "G-WW2EJJSEB9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Messaging instance for push notifications
export const messaging = getMessaging(app);
