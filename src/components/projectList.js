// projectList.js - Manages all projects (Focus Areas)

export default class ProjectList {
  constructor() {
    this.projects = [];
    this.activeProjectId = null;
  }

  // Add a new project
  addProject(project) {
    this.projects.push(project);
    // If this is the first project, make it active
    if (this.projects.length === 1) {
      this.activeProjectId = project.id;
    }
    return project;
  }

  // Remove a project by ID
  removeProject(projectId) {
    this.projects = this.projects.filter(p => p.id !== projectId);
    // If we removed the active project, set active to first available or null
    if (this.activeProjectId === projectId) {
      this.activeProjectId = this.projects.length > 0 ? this.projects[0].id : null;
    }
  }

  // Get a project by ID
  getProject(projectId) {
    return this.projects.find(p => p.id === projectId);
  }

  // Get the currently active project
  getActiveProject() {
    return this.projects.find(p => p.id === this.activeProjectId);
  }

  // Set the active project
  setActiveProject(projectId) {
    if (this.projects.find(p => p.id === projectId)) {
      this.activeProjectId = projectId;
      return true;
    }
    return false;
  }

  // Get all projects
  getAllProjects() {
    return this.projects;
  }

  // Get overall statistics across all projects
  getOverallStats() {
    const allTodos = this.projects.flatMap(p => p.todos);
    const total = allTodos.length;
    const completed = allTodos.filter(t => t.completed).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    return {
      total,
      completed,
      remaining: total - completed,
      progress
    };
  }

  // For localStorage - convert to plain object
  toJSON() {
    return {
      projects: this.projects.map(p => p.toJSON()),
      activeProjectId: this.activeProjectId
    };
  }

  // Reconstruct from saved data (static method)
  static fromJSON(data) {
    const projectList = new ProjectList();
    
    // We'll implement this fully when we do localStorage
    // For now, just return empty list
    return projectList;
  }
}