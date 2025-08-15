const firebaseConfig = {
  apiKey: "AIzaSyCrqad_1R9l322_Rg0K-UtKImEMn2nqWcE",
  authDomain: "atharva19focusly.firebaseapp.com",
  projectId: "atharva19focusly",
  storageBucket: "atharva19focusly.appspot.com",
  messagingSenderId: "277269253347",
  appId: "1:277269253347:web:20b6f3cc29473f3093c9d6"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
auth.onAuthStateChanged((user) => {
  if (user) {
    window.location.href = "home.html";
  }
});

function showPopup(message, type = "error") {
  const popup = document.createElement("div");
  popup.className = `popup ${type === "success" ? "success" : ""}`;
  popup.innerText = message;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = form.querySelector("input[type=email]").value;
    const password = form.querySelector("input[type=password]").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    // Choose persistence based on checkbox
    const persistence = rememberMe
      ? firebase.auth.Auth.Persistence.LOCAL  // stays after closing browser
      : firebase.auth.Auth.Persistence.SESSION; // clears after tab/browser close

    auth.setPersistence(persistence)
      .then(() => {
        return auth.signInWithEmailAndPassword(email, password);
      })
      .then(() => {
        showPopup("✅ Login successful!", "success");
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1500);
      })
      .catch((error) => {
        let message = "Login failed.";
        if (error.code === "auth/user-not-found") {
          message = "❌ No account found with that email.";
        } else if (error.code === "auth/wrong-password") {
          message = "❌ Incorrect password.";
        } else if (error.code === "auth/invalid-email") {
          message = "❌ Invalid email.";
        }
        showPopup(message, "error");
      });
  });
});
