const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const dueTimeInput = document.getElementById("dueTime"); // New time input
const categoryInput = document.getElementById("category");
const addBtn = document.getElementById("addBtn");
const taskTableBody = document.getElementById("taskTableBody");
const searchInput = document.getElementById("search");
const toggleThemeBtn = document.getElementById("toggleTheme");
const themeToggleButton = document.getElementById("toggleTheme");
const themeIcon = document.getElementById("themeIcon");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentTheme = localStorage.getItem("theme") || "light";
document.body.setAttribute("data-theme", currentTheme);

// Function to update the theme icon
function updateThemeIcon() {
  themeIcon.textContent = currentTheme === "light" ? "☀️" : "🌙";
}

// Event listener for theme toggle
themeToggleButton.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  document.body.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);
  updateThemeIcon();
});

// Initialize the correct icon on page load
updateThemeIcon();

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Check for tasks to mark as completed
function checkTaskCompletion() {
  setInterval(() => {
    const now = new Date();
    tasks.forEach((task, index) => {
      // Check if the task's due date and time is in the past and not completed
      if (task.dueDateTime && new Date(task.dueDateTime) <= now && !task.completed) {
        task.completed = true; // Mark the task as completed
        console.log(`Task "${task.text}" marked as completed.`); // Debugging log
        saveTasks();
        renderTasks(searchInput.value);
      }
    });
  }, 1000); // Check every second
}

function renderTasks(filter = "") {
  taskTableBody.innerHTML = "";
  tasks
    .filter(task => task.text.toLowerCase().includes(filter.toLowerCase()))
    .forEach((task, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>
          ${task.text}
          <div class="tag ${task.category}">${task.category}</div>
          ${task.dueDate ? `<div class="reminder">Due: ${task.dueDate} ${task.dueTime || ""}</div>` : ""}
        </td>
        <td>${task.completed ? "Completed" : "In progress"}</td>
        <td>
          <button class="btn delete-btn" onclick="deleteTask(${index})">DELETE</button>
          <button class="btn finish-btn" onclick="finishTask(${index})" ${task.completed ? "disabled" : ""}>FINISHED</button>
        </td>
      `;
      taskTableBody.appendChild(row);
    });
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks(searchInput.value);
}

function finishTask(index) {
  tasks[index].completed = true;
  saveTasks();
  renderTasks(searchInput.value);
}

// Add a task with time
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const dueTime = dueTimeInput.value || "23:59"; // Default to end of the day if no time is provided
  const category = categoryInput.value;

  if (text && dueDate) {
    const dueDateTime = new Date(`${dueDate}T${dueTime}`);
    console.log(`Task dueDateTime: ${dueDateTime}`); // Debugging log
    tasks.push({ text, completed: false, dueDate, dueTime, category, dueDateTime });
    saveTasks();
    taskInput.value = "";
    dueDateInput.value = "";
    dueTimeInput.value = "";
    renderTasks(searchInput.value);
    checkTaskCompletion(); // Start checking for task completion
  } else {
    alert("Please enter a task and a due date.");
  }
});

searchInput.addEventListener("input", () => {
  renderTasks(searchInput.value);
});

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
});

renderTasks();
checkTaskCompletion(); // Start checking for task completion on page load
