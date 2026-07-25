import { initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch, doc } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyAhX3NqysnKuw2BbWaDCfN30uRGeYzt9N0",
  authDomain: "project-193adbd3-2fc9-43cf-adb.firebaseapp.com",
  projectId: "project-193adbd3-2fc9-43cf-adb",
  storageBucket: "project-193adbd3-2fc9-43cf-adb.firebasestorage.app",
  messagingSenderId: "336423578319",
  appId: "1:336423578319:web:b13c81224330f311b7a5ba"
};

// Initialize the Firebase app instance
const app = initializeApp(firebaseConfig);

// Connect specifically to your new woodworking database
export const db = getFirestore(app, "woodworking-db");
