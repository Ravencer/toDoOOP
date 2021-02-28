/* eslint-disable prefer-const */
"use strict";


class ToDo {
	constructor(form, input, todoList, todoCompleted) {
		this.form = document.querySelector(form);
		this.input = document.querySelector(input);
		this.todoList = document.querySelector(todoList);
		this.todoCompleted = document.querySelector(todoCompleted);
		this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
		this.todoWrapper = document.querySelector('.todo-container');
	}
	init() {
		this.form.addEventListener('submit', this.addTodo.bind(this));
		this.render();
		this.handler();
	}

	addToStorage() {
		localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
	}

	render() {
		this.todoList.textContent = '';
		this.todoCompleted.textContent = '';
		this.todoData.forEach(this.createItem, this);
		this.addToStorage();
	}

	createItem(todo) {
		const li = document.createElement('li');
		li.classList.add('todo-item');
		li.key = todo.key;
		li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${todo.value}</span>
        <div class="todo-buttons">
            <button class="todo-remove"></button>
            <button class="todo-complete"></button>
        </div>`);

		if (todo.completed) {
			this.todoCompleted.append(li);
		} else {
			this.todoList.append(li);
		}
	}
	addTodo(e) {
		e.preventDefault();
		if (this.input.value.trim() !== '') {
			const newTodo = {
				value: this.input.value,
				completed: false,
				key: this.generateKey()
			};
			this.todoData.set(newTodo.key, newTodo);
			this.render();
		} else {
			alert('Пусто дело добавлять нельзя! Одумайтесь!');
		}
	}

	generateKey() {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}

	handler() {
		this.todoWrapper.addEventListener('click', event => {
			let target = event.target;
			if (target.matches('.todo-remove')) {
				target = target.closest('.todo-item');
				let _this = this;
				this.todoData.forEach(element => {
					_this.deleteItem(element, target);
				});
			} else if (target.matches('.todo-complete')) {
				target = target.closest('.todo-item');
				let _this = this;
				this.todoData.forEach(element => {
					_this.completedItem(element, target);
				});
			}
		});
	}

	deleteItem(elem, target) {
		if (target.key === elem.key) {
			this.todoData.delete(elem.key);
			this.render();
		}
	}

	completedItem(elem, target) {
		if (target.key === elem.key) {
			elem.completed = !elem.completed;
			this.render();
		}
	}
}

const todo = new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
todo.init();

