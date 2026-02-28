// uiController.js - Renders everything to the DOM

export default class UIController {
  constructor(projectList) {
    this.projectList = projectList;
    this.sidebarElement = document.querySelector('.sidebar');
    this.mainElement = document.querySelector('.main');
    this.projectsListElement = document.getElementById('projects-list');
    this.todosListElement = document.getElementById('todos-list');
    this.activeTitleElement = document.getElementById('active-project-title');
    this.overallProgressElement = document.getElementById('overall-progress');
    this.overallProgressBar = document.getElementById('overall-progress-bar');
  }

  // Initialize the UI
  init() {
    this.renderSidebar();
    this.renderMain();
    this.attachEventListeners();
  }

  // Render the projects in sidebar
  renderSidebar() {
    const projects = this.projectList.getAllProjects();
    this.projectsListElement.innerHTML = '';
    
    projects.forEach(project => {
      const stats = project.getStats();
      const isActive = project.id === this.projectList.activeProjectId;
      const projectItem = this.createProjectElement(project, stats, isActive);
      this.projectsListElement.appendChild(projectItem);
    });

    // Update overall progress
    const overall = this.projectList.getOverallStats();
    this.overallProgressElement.textContent = `${overall.progress}%`;
    this.overallProgressBar.style.width = `${overall.progress}%`;
  }

  // Create a single project element
  createProjectElement(project, stats, isActive) {
    const div = document.createElement('div');
    div.className = `project-item ${isActive ? 'active' : ''}`;
    div.dataset.projectId = project.id;
    
    div.innerHTML = `
      <span class="project-name" style="border-left-color: ${project.color}">${project.name}</span>
      <span class="project-count">${stats.remaining}</span>
    `;
    
    return div;
  }

  // Render the main area (active project's todos)
  renderMain() {
    const activeProject = this.projectList.getActiveProject();
    
    if (!activeProject) {
      this.renderEmptyState();
      return;
    }

    // Update title
    this.activeTitleElement.textContent = activeProject.name.toUpperCase();

    // Render todos
    this.todosListElement.innerHTML = '';
    const todos = activeProject.getTodos();
    
    if (todos.length === 0) {
      this.renderEmptyTodos();
      return;
    }

    todos.forEach(todo => {
      const todoItem = this.createTodoElement(todo);
      this.todosListElement.appendChild(todoItem);
    });
  }

    // Create a single todo element
    createTodoElement(todo) {
        const div = document.createElement('div');
        div.className = 'todo-item';
        div.dataset.todoId = todo.id;
        
        const dueDate = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No date';
        const progress = todo.getProgress();
        const hasChecklist = todo.checklist && todo.checklist.length > 0;
        
        // Generate checklist HTML if there are items
        let checklistHTML = '';
        if (hasChecklist) {
            checklistHTML = '<div class="todo-checklist hidden">';
            todo.checklist.forEach(item => {
                checklistHTML += `
                <div class="todo-checklist-item">
                    <input type="checkbox" ${item.completed ? 'checked' : ''} data-item-id="${item.id}">
                    <span>${item.text}</span>
                </div>
                `;
            });
            checklistHTML += '</div>';
}

        div.innerHTML = `
        <div class="todo-check ${todo.completed ? 'completed' : ''}"></div>
        <div class="todo-content">
            <div class="todo-title-row">
            <span class="todo-title">${todo.title}</span>
            <span class="todo-priority priority-${todo.priority}"></span>
            </div>
            <div class="todo-meta">
            <span class="todo-date">${dueDate}</span>
            <span class="todo-progress-bar" data-debug-progress="${progress}">
                <span class="todo-progress-fill" style="width: ${progress}%"></span>
            </span>
            </div>
            ${hasChecklist ? '<span class="todo-indicator todo-glow">▶</span>' : ''}
            ${checklistHTML}
        </div>
    `;

        // Add click handler for expand/collapse
        if (hasChecklist) {
            const indicator = div.querySelector('.todo-indicator');
            const checklist = div.querySelector('.todo-checklist');
      
            indicator.addEventListener('click', (e) => {
                e.stopPropagation();
                checklist.classList.toggle('hidden');
                indicator.classList.toggle('expanded');
            });
        }
        
        return div;
    }

  // Render empty state (no projects)
  renderEmptyState() {
    this.activeTitleElement.textContent = 'NO FOCUS AREAS';
    this.todosListElement.innerHTML = `
      <div class="empty-state">
        <p>No focus areas yet.</p>
        <p class="empty-sub">Create one to begin.</p>
      </div>
    `;
  }

  // Render empty todos (project exists but no todos)
  renderEmptyTodos() {
    this.todosListElement.innerHTML = `
      <div class="empty-state">
        <p>No commitments in this focus area.</p>
        <p class="empty-sub">Create one to begin tracking.</p>
      </div>
    `;
  }

  // ===== NEW METHODS FOR PROJECT MODAL =====
  // Show new project modal
  showNewProjectModal() {
    const modal = document.getElementById('project-modal');
    const input = document.getElementById('project-name-input');
    input.value = '';
    modal.classList.add('active');
    input.focus();
    
    // Handle Enter key
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        this.createNewProject();
      }
    };
    input.addEventListener('keypress', handleKeyPress, { once: true });
  }

    // Hide modal
    hideModal() {
        const projectModal = document.getElementById('project-modal');
        const todoModal = document.getElementById('todo-modal');
        projectModal.classList.remove('active');
        todoModal.classList.remove('active');
    }

  // Create new project
  createNewProject() {
    const input = document.getElementById('project-name-input');
    const projectName = input.value.trim();
    
    if (!projectName) return;
    
    // Import Project class dynamically
    import('./project.js').then(module => {
      const Project = module.default;
      const newProject = new Project(projectName);
      this.projectList.addProject(newProject);
      
      // Set as active project
      this.projectList.setActiveProject(newProject.id);
      
      // Re-render
      this.renderSidebar();
      this.renderMain();
      
      this.hideModal();
    });
  }
  // ===== END NEW METHODS =====

    // ===== TODO MODAL METHODS =====
  showNewTodoModal() {
    const modal = document.getElementById('todo-modal');
    const titleInput = document.getElementById('todo-title-input');
    titleInput.value = '';
    document.getElementById('todo-description-input').value = '';
    document.getElementById('todo-date-input').value = '';
    document.getElementById('todo-notes-input').value = '';
    
    // Clear checklist
    const checklistContainer = document.getElementById('checklist-container');
    checklistContainer.innerHTML = '';
    this.checklistItems = [];
    
    modal.classList.add('active');
    titleInput.focus();
  }

  addChecklistItem() {
    const container = document.getElementById('checklist-container');
    const itemId = Date.now();
    const itemDiv = document.createElement('div');
    itemDiv.className = 'checklist-item';
    itemDiv.dataset.id = itemId;
    
    itemDiv.innerHTML = `
      <input type="text" placeholder="Checklist item..." class="checklist-input">
      <button class="remove-checklist" data-id="${itemId}">×</button>
    `;
    
    container.appendChild(itemDiv);
    
    // Focus the new input
    itemDiv.querySelector('input').focus();
    
    // Add remove handler
    itemDiv.querySelector('.remove-checklist').addEventListener('click', () => {
      itemDiv.remove();
    });
  }

  collectChecklistItems() {
    const items = [];
    document.querySelectorAll('.checklist-item').forEach(item => {
      const input = item.querySelector('input');
      if (input.value.trim()) {
        items.push({
          text: input.value.trim(),
          completed: false
        });
      }
    });
    return items;
  }

  createNewTodo() {
    const title = document.getElementById('todo-title-input').value.trim();
    if (!title) return;
    
    const description = document.getElementById('todo-description-input').value.trim();
    const dateInput = document.getElementById('todo-date-input').value;
    const dueDate = dateInput ? new Date(dateInput) : null;
    const priority = document.getElementById('todo-priority-input').value;
    const notes = document.getElementById('todo-notes-input').value.trim();
    const checklist = this.collectChecklistItems();
    
    const activeProject = this.projectList.getActiveProject();
    if (!activeProject) return;
    
    import('./todo.js').then(module => {
      const Todo = module.default;
      const newTodo = new Todo(title, description, dueDate, priority, notes, checklist);
      activeProject.addTodo(newTodo);
      
      this.renderMain();
      this.renderSidebar(); // Update counts
      
      this.hideModal();
    });
  }
  // ===== END TODO MODAL METHODS =====

  // Attach event listeners
  attachEventListeners() {
    // Project click handlers
    this.projectsListElement.addEventListener('click', (e) => {
      const projectItem = e.target.closest('.project-item');
      if (projectItem) {
        const projectId = projectItem.dataset.projectId;
        this.projectList.setActiveProject(projectId);
        this.renderSidebar();
        this.renderMain();
      }
    });

    // New project button - UPDATED
    document.getElementById('new-project-btn').addEventListener('click', () => {
      this.showNewProjectModal();
    });

    // New todo button
    document.getElementById('new-todo-btn').addEventListener('click', () => {
      this.showNewTodoModal();
    });

    // Modal buttons - ADD THESE
    document.getElementById('cancel-project-btn').addEventListener('click', () => {
      this.hideModal();
    });

    document.getElementById('save-project-btn').addEventListener('click', () => {
      this.createNewProject();
    });

    // Todo modal buttons - ADD THESE
    document.getElementById('cancel-todo-btn').addEventListener('click', () => {
      this.hideModal();
    });

    document.getElementById('save-todo-btn').addEventListener('click', () => {
      this.createNewTodo();
    });

    document.getElementById('add-checklist-item').addEventListener('click', () => {
      this.addChecklistItem();
    });

    // Close modal on Escape key - ADD THIS
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideModal();
      }
    });
  }
}