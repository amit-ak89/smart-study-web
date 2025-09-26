// Select elements
const form = document.getElementById("addTaskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDate = document.getElementById("taskDate");
const taskDescription = document.getElementById("taskDescription");
const tasksList = document.getElementById("tasks");

const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const pendingTasksEl = document.getElementById("pendingTasks");

// Load tasks from localStorage
window.onload = function () {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => addTaskToList(task.title, task.date, task.description, task.completed));
  updateStats();
};

// Add task event
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = taskTitle.value.trim();
  const date = taskDate.value;
  const desc = taskDescription.value.trim();
  if (title === "") return;

  addTaskToList(title, date, desc, false);
  saveTasks();
  updateStats();

  taskTitle.value = "";
  taskDate.value = "";
  taskDescription.value = "";
});

// Add task to UI
function addTaskToList(title, date, desc, completed) {
  const li = document.createElement("li");
  li.setAttribute("data-completed", completed);

  li.innerHTML = `
    <h3 style="text-decoration:${completed ? 'line-through' : 'none'}">${title}</h3>
    <p>${date ? "📅 " + date : ""}</p>
    <p>${desc}</p>
    <button class="complete">${completed ? "Undo" : "Complete"}</button>
    <button class="delete">Delete</button>
  `;

  // Complete button
  li.querySelector(".complete").addEventListener("click", () => {
    const h3 = li.querySelector("h3");
    const isCompleted = h3.style.textDecoration === "line-through";
    h3.style.textDecoration = isCompleted ? "none" : "line-through";
    li.setAttribute("data-completed", !isCompleted);
    li.querySelector(".complete").textContent = isCompleted ? "Complete" : "Undo";
    saveTasks();
    updateStats();
  });

  // Delete button
  li.querySelector(".delete").addEventListener("click", () => {
    li.remove();
    saveTasks();
    updateStats();
  });

  tasksList.appendChild(li);
}

// Save tasks in localStorage
function saveTasks() {
  const allTasks = [];
  document.querySelectorAll("#tasks li").forEach(li => {
    const title = li.querySelector("h3").innerText;
    const date = li.querySelector("p").innerText.replace("📅 ", "");
    const desc = li.querySelectorAll("p")[1].innerText;
    const completed = li.getAttribute("data-completed") === "true";
    allTasks.push({ title, date, description: desc, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(allTasks));
}

// Update Stats
function updateStats() {
  const allTasks = document.querySelectorAll("#tasks li");
  const total = allTasks.length;
  const completed = Array.from(allTasks).filter(li => li.getAttribute("data-completed") === "true").length;
  const pending = total - completed;

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  pendingTasksEl.textContent = pending;
}

// Filter tasks
function filterTasks(status) {
  document.querySelectorAll("#tasks li").forEach(li => {
    const completed = li.getAttribute("data-completed") === "true";
    if (status === "all") {
      li.style.display = "block";
    } else if (status === "completed" && completed) {
      li.style.display = "block";
    } else if (status === "pending" && !completed) {
      li.style.display = "block";
    } else {
      li.style.display = "none";
    }
  });
}
