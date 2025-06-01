const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const timeInput = document.getElementById("time-input");
const taskList = document.getElementById("task-list");
const dialog = document.getElementById("confirm-dialog");

let taskToDelete = null;

document.addEventListener("DOMContentLoaded", loadTasks);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = taskInput.value.trim();
  const time = timeInput.value;

  if (!task || !time) return;

  addTask(task, time);
  saveTask({ task, time });

  taskInput.value = "";
  timeInput.value = "";
});

function addTask(task, time) {
  const li = document.createElement("li");
  li.innerHTML = `<span>${time}</span> - ${task}`;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.addEventListener("click", () => {
    taskToDelete = { element: li, task, time };
    dialog.showModal();
  });

  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

function getTasks() {
  return JSON.parse(localStorage.getItem("timetableTasks")) || [];
}

function saveTask(taskObj) {
  const tasks = getTasks();
  tasks.push(taskObj);
  localStorage.setItem("timetableTasks", JSON.stringify(tasks));
}

function removeTask(taskObj) {
  let tasks = getTasks();
  tasks = tasks.filter(
    (t) => t.task !== taskObj.task || t.time !== taskObj.time
  );
  localStorage.setItem("timetableTasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = getTasks();
  tasks.forEach((t) => addTask(t.task, t.time));
}

dialog.addEventListener("close", () => {
  if (dialog.returnValue === "confirm" && taskToDelete) {
    taskToDelete.element.remove();
    removeTask(taskToDelete);
    taskToDelete = null;
  } else {
    taskToDelete = null;
  }
});
