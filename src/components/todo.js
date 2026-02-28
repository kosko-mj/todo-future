// Todo.js - The core data model for the future

export default class Todo {
  constructor(title, description, dueDate, priority, notes = "", checklist = []) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate; // Will be a Date object
    this.priority = priority; // 'low', 'medium', 'high'
    this.notes = notes;
    this.checklist = checklist; // array of { text, completed }
    this.completed = false;
    this.createdAt = new Date();
    this.estimatedTime = 0; // in minutes, will be used for progress calculation
  }

  // Toggle completion status
  toggleComplete() {
    this.completed = !this.completed;
    return this.completed;
  }

  // Update priority
  setPriority(newPriority) {
    if (['low', 'medium', 'high'].includes(newPriority)) {
      this.priority = newPriority;
    }
    return this.priority;
  }

  // Add checklist item
  addChecklistItem(text) {
    this.checklist.push({
      id: crypto.randomUUID(),
      text: text,
      completed: false
    });
  }

  // Toggle checklist item
  toggleChecklistItem(itemId) {
    const item = this.checklist.find(i => i.id === itemId);
    if (item) {
      item.completed = !item.completed;
    }
  }

  // Calculate progress based on checklist and completed status
  getProgress() {
    if (this.checklist.length > 0) {
      const completedItems = this.checklist.filter(i => i.completed).length;
      return Math.round((completedItems / this.checklist.length) * 100);
    }
    return this.completed ? 100 : 0;
  }

  // For localStorage - convert to plain object
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      notes: this.notes,
      checklist: this.checklist,
      completed: this.completed,
      createdAt: this.createdAt,
      estimatedTime: this.estimatedTime
    };
  }
}