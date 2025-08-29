// -------------------- State --------------------
let tasks = [];

// -------------------- DOM refs --------------------
const list       = document.querySelector('.todo-list');
const emptyState = document.querySelector('.empty-state');
const bar        = document.querySelector('.progress__bar');
const label      = document.querySelector('.progress__label');
const new_task   = document.querySelector('.input');
const add_button = document.querySelector('.add-btn');

// -------------------- Date (your existing style OK) --------------------
const today = new Date();
const weekday = today.toLocaleDateString(undefined, { weekday: 'long' });
const day     = today.getDate();
const month   = today.toLocaleDateString(undefined, { month: 'long' });
const year    = today.getFullYear();
document.querySelector('.date').innerHTML = `
  <div class="date-weekday">${weekday}</div>
  <div class="date-day">${day}</div>
  <div class="date-monthyear">${month} ${year}</div>
`;

// -------------------- Persistence --------------------
const STORAGE_KEY = 'todo.tasks.v1';

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// -------------------- Helpers --------------------
function updateEmptyState() {
  emptyState.style.display = tasks.length === 0 ? 'block' : 'none';
}

function getCurrentTask() {
  return new_task.value;
}

function updateProgress() {
  const total = tasks.length;
  const done  = tasks.filter(t => t.done).length;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);
  bar.style.width = pct + '%';
  label.textContent = `${pct}% complete`;
}

function renderTask(task) {
  const li = document.createElement('li');
  li.classList.add('todo-item');

  const textSpan = document.createElement('span');
  textSpan.textContent = task.text;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;

  checkbox.addEventListener('change', () => {
    task.done = checkbox.checked;
    updateProgress();
    saveTasks();
  });

  li.appendChild(textSpan);
  li.appendChild(checkbox);
  list.appendChild(li);
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const task = { id: Date.now(), text: trimmed, done: false };
  tasks.push(task);
  renderTask(task);
  updateEmptyState();
  updateProgress();
  saveTasks();

  new_task.value = "";
  new_task.focus();
}

// -------------------- Events --------------------
add_button.addEventListener('click', () => addTask(getCurrentTask()));
new_task.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask(getCurrentTask());
});

// -------------------- Init --------------------
tasks = loadTasks();
tasks.forEach(renderTask);
updateEmptyState();
updateProgress();
