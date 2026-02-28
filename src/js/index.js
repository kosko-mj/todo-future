import '../styles/style.css';
import Todo from '../components/todo.js';
import Project from '../components/project.js';
import ProjectList from '../components/projectList.js';

// Create a test todo
const testTodo = new Todo(
  "Finish project",
  "Complete the futuristic todo app",
  new Date('2026-03-15'),
  "high",
  "This is going to be awesome",
  [{ text: "Build Todo class", completed: true }, { text: "Build UI", completed: false }]
);

console.log('Todo created:', testTodo);
console.log('Progress:', testTodo.getProgress() + '%');

// Create a test project
const workProject = new Project("Work");
workProject.addTodo(testTodo);

const personalProject = new Project("Personal");
const personalTodo = new Todo(
  "Buy groceries",
  "Milk, eggs, bread",
  new Date('2026-03-08'),
  "low"
);
personalProject.addTodo(personalTodo);

// Create project list and add projects
const projectList = new ProjectList();
projectList.addProject(workProject);
projectList.addProject(personalProject);
projectList.setActiveProject(workProject.id);

console.log('Project List:', projectList);
console.log('Active Project:', projectList.getActiveProject());
console.log('Overall Stats:', projectList.getOverallStats());
console.log('JSON ready:', projectList.toJSON());

console.log('Hello from Webpack!');