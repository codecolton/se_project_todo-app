import { v4 as uuidv4 } from "https://jspm.dev/uuid";

import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";

const addTodoButton = document.querySelector(".button_action_add");
const addTodoPopupEl = document.querySelector("#add-todo-popup");
const addTodoForm = addTodoPopupEl.querySelector(".popup__form");
const addTodoCloseBtn = addTodoPopupEl.querySelector(".popup__close");

const newTodoValidator = new FormValidator(validationConfig, addTodoForm);
newTodoValidator.enableValidation();

const todoCounter = new TodoCounter(initialTodos, ".counter__text");

function handleCheck(completed) {
  todoCounter.updateCompleted(completed);
}

function handleDelete(completed) {
  if (completed) {
    todoCounter.updateCompleted(false);
  }
}

const generateTodo = (data) => {
  const todo = new Todo(data, "#todo-template", handleCheck, handleDelete);
  const todoElement = todo.getView();

  return todoElement;
};

const addTodoPopup = new PopupWithForm({
  popupSelector: "#add-todo-popup",
  handleFormSubmit: (inputValues) => {
    const id = uuidv4();
    const date = new Date(inputValues.date);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

    const newTodo = {
      name: inputValues.name,
      date,
      id,
    };

    const todoEl = generateTodo(newTodo);
    section.addItem(todoEl);

    newTodoValidator.resetValidation();
    addTodoPopup.close();
  },
});

addTodoPopup.setEventListeners();

const section = new Section({
  items: initialTodos,
  renderer: (todoData) => {
    const todoElement = generateTodo(todoData);
    section.addItem(todoElement);
  },
  containerSelector: ".todos__list",
});
section.renderItems();

addTodoButton.addEventListener("click", () => {
  newTodoValidator.resetValidation();
  addTodoPopup.open();
});

addTodoCloseBtn.addEventListener("click", () => {
  addTodoPopup.close();
});
