
function guestContinue() {
  const guestID = Math.floor(Math.random() * 99999);
  localStorage.setItem("roomID", guestID);
  window.location.href = "home.html";
}

function goToSignup() {
  window.location.href = "signup.html";
}

function goToLogin() {
  window.location.href = "login.html";
}

function learnMore() {
  document.getElementById("features").scrollIntoView({ behavior: "smooth" });
}
document.getElementById("createBtn").addEventListener("click", createRoom);
document.getElementById("joinBtn").addEventListener("click", joinRoom); // points to SweetAlert version
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("createBtn").addEventListener("click", createRoom);
  document.getElementById("joinBtn").addEventListener("click", joinRoom);
});


