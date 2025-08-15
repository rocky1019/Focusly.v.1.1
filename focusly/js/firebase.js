// /js/firebase.js
// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCrqad_1R9l322_Rg0K-UtKImEMn2nqWcE",
  authDomain: "atharva19focusly.firebaseapp.com",
  databaseURL: "https://atharva19focusly-default-rtdb.firebaseio.com",
  projectId: "atharva19focusly",
  storageBucket: "atharva19focusly.firebasestorage.app",
  messagingSenderId: "277269253347",
  appId: "1:277269253347:web:20b6f3cc29473f3093c9d6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };

