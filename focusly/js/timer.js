
let timer;
let timeLeft = 1500; // 25 minutes
let isRunning = false;

const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startTimerBtn");
const resetBtn = document.getElementById("resetTimerBtn");

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(async () => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      isRunning = false;

      // Call streak update when Pomodoro completes
      const user = auth.currentUser;
      if (user) {
        const newStreak = await updateStudyStreak(user.uid);
        if (newStreak !== undefined) {
          console.log("New streak:", newStreak);
          // Optional: update streak display here
        }
      } else {
        console.log("User not logged in; cannot update streak.");
      }

      return;
    }
    timeLeft--;
    updateDisplay();
  }, 1000);
}


function resetTimer() {
  clearInterval(timer);
  timeLeft = 1500;
  isRunning = false;
  updateDisplay();
}

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);

updateDisplay(); // Initialize display on load


