import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Add this line

const firebaseConfig = {
  apiKey: "AIzaSyAdeo8hQ-BvUj54lHtE_RCxBkHqtqHQVQE",
  authDomain: "my-tracker-1a32a.firebaseapp.com",
  databaseURL: "https://my-tracker-1a32a-default-rtdb.firebaseio.com",
  projectId: "my-tracker-1a32a",
  storageBucket: "my-tracker-1a32a.firebasestorage.app",
  messagingSenderId: "513841141082",
  appId: "1:513841141082:web:d30f92e4c1b256be03cf63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the database so we can use it in other files
export const db = getDatabase(app);