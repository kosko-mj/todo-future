// project.js - Represents a Focus Area that holds todos

export default class Project {
  constructor(name) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.todos = [];
    this.createdAt = new Date();
    this.color = this.generateColor(); // For visual differentiation
  }

  // Generate a consistent color based on name
  generateColor() {
    const colors = [
      '#4ec9e0', // cyan
      '#9d7bff', // purple
      '#4caf9e', // green
      '#f28b82', // coral
      '#ffb74d', // amber
      '#ba86b0'  // mauve
    ];
    // Simple hash to pick a color
    const hash = this.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  // Add a todo to this project
  addTodo(todo) {
    this.todos.push(todo);
    return todo;
  }

  // Remove a todo by ID
  removeTodo(todoId) {
    this.todos = this.todos.filter(todo => todo.id !== todoId);
  }

  // Get a specific todo by ID
  getTodo(todoId) {
    return this.todos.find(todo => todo.id === todoId);
  }

  // Update todo within this project
  updateTodo(todoId, updates) {
    const todo = this.getTodo(todoId);
    if (todo) {
      Object.assign(todo, updates);
    }
    return todo;
  }

  // Get all todos, optionally filtered by completion
  getTodos(completed = null) {
    if (completed === null) return this.todos;
    return this.todos.filter(todo => todo.completed === completed);
  }

  // Get project statistics
  getStats() {
    const total = this.todos.length;
    const completed = this.todos.filter(t => t.completed).length;
    const remaining = total - completed;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    return {
      total,
      completed,
      remaining,
      progress
    };
  }

  // Sort todos by various criteria
  sortTodos(method = 'default') {
    switch(method) {
      case 'priority':
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        this.todos.sort((a, b) => 
          priorityWeight[b.priority] - priorityWeight[a.priority]
        );
        break;
      case 'dueDate':
        this.todos.sort((a, b) => a.dueDate - b.dueDate);
        break;
      case 'alphabetical':
        this.todos.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep as is (by creation date)
        break;
    }
  }

  // For localStorage - convert to plain object
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      todos: this.todos.map(todo => todo.toJSON()),
      createdAt: this.createdAt,
      color: this.color
    };
  }
}