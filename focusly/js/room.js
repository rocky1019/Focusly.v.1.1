// ------------------------
// ✅ Firebase Setup (Modular)
// ------------------------

const firebaseConfig = {
  apiKey: "AIzaSyCrqad_1R9l322_Rg0K-UtKImEMn2nqWcE",
  authDomain: "atharva19focusly.firebaseapp.com",
  databaseURL: "https://atharva19focusly-default-rtdb.firebaseio.com",
  projectId: "atharva19focusly",
  storageBucket: "atharva19focusly.appspot.com",
  messagingSenderId: "277269253347",
  appId: "1:277269253347:web:20b6f3cc29473f3093c9d6",
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ------------------------
// ✅ Room Setup
// ------------------------

let roomId = localStorage.getItem("roomId");

if (!roomId) {
  roomId = "room-" + Math.random().toString(36).substring(2, 8);
  localStorage.setItem("roomId", roomId);
}

document.getElementById("roomIdDisplay").textContent = roomId;

// Firebase references
const chatRef = db.ref(`rooms/${roomId}/chat`);
const membersRef = db.ref(`rooms/${roomId}/members`);
const tasksRef = db.ref(`rooms/${roomId}/tasks`);
const timerRef = db.ref(`rooms/${roomId}/timer`);

// ------------------------
// ✅ Member Join & Count
// ------------------------

const userId = crypto.randomUUID();
membersRef.child(userId).set(true);
membersRef.child(userId).onDisconnect().remove();

membersRef.on("value", (snapshot) => {
  const count = snapshot.numChildren();
  document.getElementById("memberCount").textContent = `👥 ${count}`;
  
});


// ------------------------
// ✅ Chat Send & Listen
// ------------------------

window.sendMessage = () => {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  if (message !== "") {
    chatRef.push({
      user: `User[${userId.slice(0, 5)}]`, // 👈 add short ID
      text: message,
      timestamp: Date.now(),
    });
    input.value = "";
  }
};

const chatBox = document.getElementById("chatBox");
chatRef.on("child_added", (snapshot) => {
  const msg = snapshot.val();
  const msgDiv = document.createElement("div");
  msgDiv.textContent = `${msg.user}: ${msg.text}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
});


// ------------------------
// ✅ Leave Room
// ------------------------

window.leaveRoom = () => {
  localStorage.removeItem("roomId");
  membersRef.child(userId).remove();
  window.location.href = "home.html";
};

// ------------------------
// ✅ Synced Task List
// ------------------------

window.addTask = function () {
  const taskInput = document.getElementById("newTask");
  const taskText = taskInput.value.trim();

  if (taskText !== "") {
    const newTask = {
      text: taskText,
      done: false,
    };
    tasksRef.push(newTask);
    taskInput.value = "";
  }
};

tasksRef.on("child_added", (snapshot) => {
  const task = snapshot.val();
  const taskId = snapshot.key;

  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;

  checkbox.addEventListener("change", () => {
    tasksRef.child(taskId).update({ done: checkbox.checked });
  });

  li.appendChild(checkbox);
  li.appendChild(document.createTextNode(" " + task.text));
  document.getElementById("taskList").appendChild(li);
});

// ------------------------
// ✅ Synced Timer (Pomodoro)
// ------------------------

const timerDisplay = document.getElementById("timer");
if (localTimeLeft > 0) {
  localTimeLeft--;
} else if (localRunning) {
  localRunning = false;
  logSession(25); // Or calculate dynamically if using custom durations
}

document.getElementById("startTimer").onclick = () => {
  timerRef.set({
    startTime: Date.now(),
    duration: 25 * 60, // 25 minutes
    running: true,
  });
};

timerRef.on("value", (snapshot) => {
  const data = snapshot.val();
  if (!data || !data.running) return;

  const elapsed = Math.floor((Date.now() - data.startTime) / 1000);
  const timeLeft = Math.max(0, data.duration - elapsed);

  localTimeLeft = timeLeft;
  localRunning = true;
  
});

// Update Timer UI Every Second
setInterval(() => {
  if (!localRunning) return;
  const mins = Math.floor(localTimeLeft / 60);
  const secs = localTimeLeft % 60;
  timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
  if (localTimeLeft > 0) localTimeLeft--;
}, 1000);
function logSession(durationInMinutes) {
  const analyticsRef = db.ref("analytics/sessions");
  const userId = localStorage.getItem("userId") || "guest";

  const sessionData = {
    userId,
    duration: durationInMinutes,
    timestamp: Date.now(),
    room: roomId,
  };

  analyticsRef.push(sessionData)
    .then(() => console.log("Session logged successfully"))
    .catch((err) => console.error("Error logging session:", err));
}
const themeStyles = {
  "": { 
    textColor: "#333", 
    buttonBg: "#9370DB", 
    buttonText: "#fff" 
  },
  "linear-gradient(135deg, #667eea, #764ba2)": { 
    textColor: "#4a2c77", 
    buttonBg: "#667eea", 
    buttonText: "#fff" 
  },
  "linear-gradient(135deg, #f7971e, #ffd200)": { 
    textColor: "#8b5e00", 
    buttonBg: "#f7971e", 
    buttonText: "#fff" 
  },
  "linear-gradient(135deg, #11998e, #38ef7d)": { 
    textColor: "#0f665f", 
    buttonBg: "#11998e", 
    buttonText: "#fff" 
  },
  "linear-gradient(135deg, #ff416c, #ff4b2b)": { 
    textColor: "#8b1b2c", 
    buttonBg: "#ff416c", 
    buttonText: "#fff" 
  }
};
async function updateStudyStreak(userUid) {
  const userRef = db.ref('users/' + userUid);
  try {
    const snapshot = await userRef.once('value');
    if (!snapshot.exists()) {
      console.log("User data not found.");
      return;
    }
    const data = snapshot.val();

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const lastDateStr = data.lastStudyDate || null;
    let newStreak = 1;

    if (lastDateStr) {
      const lastDate = new Date(lastDateStr);
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak = (data.studyStreak || 0) + 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      } else if (diffDays === 0) {
        newStreak = data.studyStreak || 0;
      }
    }

    await userRef.update({
      studyStreak: newStreak,
      lastStudyDate: todayStr
    });

    console.log("Study streak updated:", newStreak);
    return newStreak;

  } catch (error) {
    console.error("Error updating study streak:", error);
  }
}
