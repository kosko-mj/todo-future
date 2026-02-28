import '../styles/style.css';
import Todo from '../components/todo.js';
import Project from '../components/project.js';
import ProjectList from '../components/projectList.js';
import UIController from '../components/uiController.js';

// Create some sample data
const projectList = new ProjectList();

// Create Work project
const workProject = new Project("Work");
const todo1 = new Todo(
  "Finish project",
  "Complete the futuristic todo app",
  new Date('2026-03-15'),
  "high",
  "This is going to be awesome",
  [{ text: "Build Todo class", completed: true }, { text: "Build UI", completed: false }]
);
workProject.addTodo(todo1);

const todo2 = new Todo(
  "Review PR",
  "Check the pull request from team",
  new Date('2026-03-10'),
  "medium"
);
workProject.addTodo(todo2);

// Create Personal project
const personalProject = new Project("Personal");
const todo3 = new Todo(
  "Buy groceries",
  "Milk, eggs, bread, vegetables",
  new Date('2026-03-08'),
  "low"
);
personalProject.addTodo(todo3);

// Add projects to list
projectList.addProject(workProject);
projectList.addProject(personalProject);
projectList.setActiveProject(workProject.id);

// Initialize UI
const ui = new UIController(projectList);
ui.init();

console.log('Future is live!');