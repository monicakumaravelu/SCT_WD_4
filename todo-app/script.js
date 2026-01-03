let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const category = document.getElementById("category");
const priority = document.getElementById("priority");
const deadline = document.getElementById("deadline");

const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const searchInput = document.getElementById("search");

const filterStatus = document.getElementById("filterStatus");
const filterCategory = document.getElementById("filterCategory");
const filterPriority = document.getElementById("filterPriority");

const themeToggle = document.getElementById("themeToggle");

/* ADD TASK */
function addTask() {
  if (!taskInput.value.trim()) return;

  tasks.push({
    text: taskInput.value,
    category: category.value,
    priority: priority.value,
    createdAt: new Date().toLocaleString(),
    deadline: deadline.value,
    completed: false
  });

  taskInput.value = "";
  deadline.value = "";

  save();
}

/* DISPLAY TASKS */
function displayTasks(filtered = tasks) {
  taskList.innerHTML = "";

  filtered.forEach((task, i) => {
    const li = document.createElement("li");

    li.className = `
      priority-${task.priority}
      ${task.completed ? "completed" : ""}
      ${isOverdue(task) ? "overdue" : ""}
    `;

    li.innerHTML = `
      <strong>${task.text}</strong><br>
      <small>
        ${task.category} • ${task.priority}<br>
        Created: ${task.createdAt}<br>
        Deadline: ${task.deadline || "—"}
      </small><br><br>
      <button onclick="toggleTask(${i})">✔</button>
      <button onclick="deleteTask(${i})">🗑</button>
    `;

    taskList.appendChild(li);
  });

  updateCounter();
}

/* FILTER LOGIC */
function applyFilters() {
  let filtered = [...tasks];

  if (filterStatus.value !== "all") {
    filtered = filtered.filter(t =>
      filterStatus.value === "completed" ? t.completed : !t.completed
    );
  }

  if (filterCategory.value !== "all") {
    filtered = filtered.filter(t => t.category === filterCategory.value);
  }

  if (filterPriority.value !== "all") {
    filtered = filtered.filter(t => t.priority === filterPriority.value);
  }

  const searchText = searchInput.value.toLowerCase();
  filtered = filtered.filter(t =>
    t.text.toLowerCase().includes(searchText)
  );

  displayTasks(filtered);
}

/* HELPERS */
function toggleTask(i) {
  tasks[i].completed = !tasks[i].completed;
  save();
}

function deleteTask(i) {
  tasks.splice(i, 1);
  save();
}

function isOverdue(task) {
  return task.deadline && !task.completed && new Date(task.deadline) < new Date();
}

function updateCounter() {
  const done = tasks.filter(t => t.completed).length;
  counter.textContent =
    `Total: ${tasks.length} | Completed: ${done} | Pending: ${tasks.length - done}`;
}

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  applyFilters();
}

/* EVENTS */
searchInput.addEventListener("keyup", applyFilters);
themeToggle.onclick = () => document.body.classList.toggle("dark");

/* INIT */
applyFilters();
