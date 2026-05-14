// Logika untuk toggle theme
const btnTheme = document.getElementById("btn-theme");

// Cek preferensi awal
if (localStorage.getItem("theme") === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

// Event Listener Klik
btnTheme.addEventListener("click", () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
});

// ===== STATE =====
let todos = [
  { id: 1, text: "Belajar JavaScript", isDone: false },
  { id: 2, text: "Olahraga pagi", isDone: true },
];
let currentFilter = "all";
let nextId = 3;

// ===== RENDER FUNCTION =====
function render() {
  renderTodos();
  renderStats();
  updateFilterButtons();
}

function renderTodos() {
  const container = document.getElementById("todo-container");
  container.innerHTML = "";

  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === "todo") return !todo.isDone;
    if (currentFilter === "done") return todo.isDone;
    return true;
  });

  if (filteredTodos.length === 0) {
    container.innerHTML = '<p class="p-8 text-center text-gray-400">Tidak ada tugas</p>';
    return;
  }

  filteredTodos.forEach((todo) => {
    const item = document.createElement("div");
    item.className = "flex items-center justify-between p-5 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-gray-700 last:border-0";

    item.innerHTML = `
      <div class="flex items-center gap-4">
        <input type="checkbox" ${todo.isDone ? "checked" : ""} 
               class="w-5 h-5 rounded border-gray-300 text-green-500 cursor-pointer"
               onchange="toggleTodo(${todo.id})">
        <span class="${todo.isDone ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-200"}">${todo.text}</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="px-3 py-1 rounded-full text-xs font-medium ${todo.isDone ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}">
          ${todo.isDone ? "Done" : "Todo"}
        </span>
        <button onclick="deleteTodo(${todo.id})" class="text-gray-400 hover:text-red-500 transition-colors">🗑️</button>
      </div>
    `;
    container.appendChild(item);
  });
}

function renderStats() {
  const stats = document.getElementById("todo-stats");
  const completedCount = todos.filter((t) => t.isDone).length;
  stats.innerText = `${completedCount} dari ${todos.length} tugas selesai`;
}

function updateFilterButtons() {
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.classList.remove("bg-blue-600", "text-white");
    btn.classList.add("bg-white", "text-gray-600");

    if (btn.dataset.filter === currentFilter) {
      btn.classList.add("bg-blue-600", "text-white");
      btn.classList.remove("bg-white", "text-gray-600");
    }
  });
}

// ===== ACTION FUNCTIONS =====
function addTodo(text) {
  if (text.trim() === "") return;
  todos.push({ id: nextId++, text: text.trim(), isDone: false });
  render();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.isDone = !todo.isDone;
    render();
  }
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  render();
}

function setFilter(filter) {
  currentFilter = filter;
  render();
}

// ===== EVENT LISTENERS =====
document.addEventListener("DOMContentLoaded", () => {
  const inputEl = document.getElementById("todo-input");
  const btnAdd = document.getElementById("btn-add-todo");

  const handleAdd = () => {
    addTodo(inputEl.value);
    inputEl.value = "";
    inputEl.focus();
  };

  btnAdd.addEventListener("click", handleAdd);
  inputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleAdd();
  });

  // Filter buttons event delegation
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => setFilter(btn.dataset.filter));
  });

  render();
});
