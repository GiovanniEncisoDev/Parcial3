// Selecciones
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskDate = document.getElementById('task-date');
const taskPriority = document.getElementById('task-priority');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filters button');
const notification = document.getElementById('notification');
const searchInput = document.getElementById('task-search');

// Cargar tareas
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Guardar tareas
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Notificación
function showNotification(message, type='success') {
    notification.textContent = message;
    notification.className = `notification show`;
    notification.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    notification.style.color = type === 'success' ? '#155724' : '#721c24';
    setTimeout(()=>notification.classList.remove('show'),2000);
}

// Clase de tarea
function getTaskClass(task){
    const today = new Date().toISOString().split('T')[0];
    if(task.completed) return 'completed';
    if(task.date < today) return 'overdue';
    return 'pending';
}

function getPriorityClass(priority){
    return `prioridad-${priority}`;
}

// Renderizar tareas
function renderTasks(filter='all', search=''){
    taskList.innerHTML = '';
    const today = new Date().toISOString().split('T')[0];

    tasks.forEach((task,index)=>{
        const taskClass = getTaskClass(task);
        const priorityClass = getPriorityClass(task.priority);

        if(filter==='pending' && (task.completed || taskClass==='overdue')) return;
        if(filter==='overdue' && (task.completed || taskClass!=='overdue')) return;
        if(filter==='completed' && !task.completed) return;
        if(!task.text.toLowerCase().includes(search.toLowerCase())) return;

        const li = document.createElement('li');
        li.className = `task-item ${taskClass} ${priorityClass}`;
        li.draggable = true;
        li.dataset.index = index;
        li.innerHTML = `
            <span>${task.text} - ${task.date} (${task.priority})</span>
            <div>
                <button class="complete-btn">${task.completed ? 'Desmarcar':'Completar'}</button>
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Eliminar</button>
            </div>
        `;

        // Completar/desmarcar
        li.querySelector('.complete-btn').addEventListener('click',()=>{
            task.completed=!task.completed;
            saveTasks();
            renderTasks(filter, search);
            showNotification(task.completed?'Tarea completada':'Tarea pendiente');
        });

        // Editar
        li.querySelector('.edit-btn').addEventListener('click',()=>{
            const newText = prompt('Editar tarea:',task.text);
            const newDate = prompt('Editar fecha (YYYY-MM-DD):',task.date);
            const newPriority = prompt('Editar prioridad (alta/media/baja):',task.priority);
            if(newText && newDate && newPriority){
                task.text = newText;
                task.date = newDate;
                task.priority = newPriority;
                saveTasks();
                renderTasks(filter,search);
                showNotification('Tarea editada');
            }
        });

        // Eliminar
        li.querySelector('.delete-btn').addEventListener('click',()=>{
            if(confirm(`Eliminar tarea: "${task.text}"?`)){
                tasks.splice(index,1);
                saveTasks();
                renderTasks(filter,search);
                showNotification('Tarea eliminada','error');
            }
        });

        // Drag & Drop
        li.addEventListener('dragstart',()=>li.classList.add('dragging'));
        li.addEventListener('dragend',()=>{
            li.classList.remove('dragging');
            // Guardar el nuevo orden tras soltar
            const newOrder = [...taskList.children].map(li=>tasks[li.dataset.index]);
            tasks = newOrder;
            saveTasks();
        });

        taskList.appendChild(li);
    });

    // Drag & Drop ordenar
    taskList.addEventListener('dragover', e=>{
        e.preventDefault();
        const afterElement = getDragAfterElement(e.clientY);
        const dragging = taskList.querySelector('.dragging');
        if(!afterElement) taskList.appendChild(dragging);
        else taskList.insertBefore(dragging, afterElement);
    });
}

// Obtener elemento para drag & drop
function getDragAfterElement(y){
    const draggableElements = [...taskList.querySelectorAll('.task-item:not(.dragging)')];
    return draggableElements.reduce((closest,child)=>{
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height/2;
        if(offset<0 && offset>closest.offset){
            return {offset:offset,element:child};
        } else return closest;
    },{offset:Number.NEGATIVE_INFINITY}).element;
}

// Agregar tarea
taskForm.addEventListener('submit',e=>{
    e.preventDefault();
    const newTask={
        text:taskInput.value,
        date:taskDate.value,
        priority:taskPriority.value,
        completed:false
    };
    if(confirm(`Agregar tarea: "${newTask.text}"?`)){
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskForm.reset();
        showNotification('Tarea agregada');
    }
});

// Filtros
filterButtons.forEach(btn=>{
    btn.addEventListener('click',()=>{
        filterButtons.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        renderTasks(btn.dataset.filter,searchInput.value);
    });
});

// Buscador
searchInput.addEventListener('input',()=>{
    const filter = document.querySelector('.filters .active').dataset.filter;
    renderTasks(filter,searchInput.value);
});

// Actualizar vencidas automáticamente
setInterval(()=>renderTasks(document.querySelector('.filters .active').dataset.filter, searchInput.value),60000);

// Inicializar
renderTasks();
