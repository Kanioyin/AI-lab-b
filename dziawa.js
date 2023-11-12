document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

function addTask() {
    const newTaskInput = document.getElementById('newTask');
    const dueDateInput = document.getElementById('dueDate');

    const newTask = newTaskInput.value.trim();
    const dueDate = new Date(dueDateInput.value);

    if (newTask.length < 3 || newTask.length > 255) {
        alert('Nowe zadanie musi mieć co najmniej 3 znaki i nie więcej niż 255 znaków.');
        return;
    }

    if (dueDate <= new Date()) {
        alert('Data wykonania zadania musi być w przyszłości.');
        return;
    }

    if (!dueDateInput.value) {
        alert('Pole daty nie może być puste.');
        return;
    }

    const taskList = document.getElementById('taskList');
    const taskItem = document.createElement('li');
    taskItem.className = 'taskItem';
    taskItem.innerHTML = `
    <span onclick="editTask(this)">${newTask} - Termin wykonania: ${dueDate.toLocaleString()}</span>
    <span class="deleteButton" onclick="deleteTask(this)">Usuń</span>
  `;
    taskList.appendChild(taskItem);

    saveTasksToLocalStorage();

    newTaskInput.value = '';
    dueDateInput.value = '';
}

function searchTasks() {
    const searchInput = document.getElementById('search');
    const searchTerm = searchInput.value.toLowerCase();
    const taskItems = document.querySelectorAll('.taskItem');

    taskItems.forEach(item => {
        const taskText = item.textContent.toLowerCase();
        const highlightedText = highlightSearchResult(taskText, searchTerm);
        item.innerHTML = highlightedText;
        item.style.display = taskText.includes(searchTerm) ? 'block' : 'none';
    });
}

function highlightSearchResult(text, searchTerm) {
    if (!searchTerm) {
        return text;
    }

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function editTask(spanElement) {
    const taskText = spanElement.textContent;
    const inputElement = document.createElement('input');
    inputElement.value = taskText;

    spanElement.replaceWith(inputElement);

    inputElement.focus();

    inputElement.addEventListener('blur', function() {
        saveChanges(inputElement);
    });

    inputElement.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            saveChanges(inputElement);
        }
    });
}

function saveChanges(inputElement) {
    const taskText = inputElement.value;
    const spanElement = document.createElement('span');
    spanElement.innerHTML = taskText;

    inputElement.replaceWith(spanElement);
}

function deleteTask(deleteButton) {
    const taskItem = deleteButton.parentNode;
    taskItem.remove();
    
    saveTasksToLocalStorage();
}

function saveTasksToLocalStorage() {
    const taskList = document.getElementById('taskList');
    const tasks = [];

    taskList.querySelectorAll('.taskItem span:first-child').forEach(span => {
        tasks.push(span.textContent);
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const taskList = document.getElementById('taskList');
    const savedTasks = localStorage.getItem('tasks');

    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);

        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'taskItem';
            taskItem.innerHTML = `
        <span onclick="editTask(this)">${task}</span>
        <span class="deleteButton" onclick="deleteTask(this)">Usuń</span>
      `;
            taskList.appendChild(taskItem);
        });
    }
}