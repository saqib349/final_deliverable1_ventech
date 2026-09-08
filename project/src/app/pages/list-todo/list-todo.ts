import { AfterViewInit, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ListService } from '../../services/list-service';
import { Todoslist } from '../../components/todoslist/todoslist';
import { NgTemplateOutlet } from '@angular/common';
import { AddTodo } from "../../components/add-todo/add-todo";
import { SearchService } from '../../services/search-service';

@Component({
  selector: 'app-list-todo',
  imports: [Todoslist, NgTemplateOutlet, AddTodo],
  templateUrl: './list-todo.html',
  styleUrl: './list-todo.css',
})
export class ListTodo implements OnInit {
  
  searchService=inject(SearchService)
  listService= inject(ListService)
  todos= signal<Array<todo>>([])
  loading=false;

  constructor(){
    console.log(this.todos());
  }
  ngOnInit(): void {
    this.loading=true
    console.log(this.todos());
    this.todos.set(this.listService.todos)  
    this.loading=false
  }
  
  updateStatus(todo: todo | undefined) {
    console.log(todo)
  if (!todo) return;

  this.todos.update(todos =>
    todos.map(t =>
      t._id === todo._id
        ? { ...t, completed: !t.completed }
        : t
    )
  );
  
}

deletetodo(todo: todo | undefined){
    if (!todo) return;

  this.todos.update(todos =>
    todos.filter(t =>
      t._id !== todo._id
    )
  );
}

addtodo(todo: createTodo | undefined) {
  // if (!todo) return;
  // console.log(todo.completed)
  // this.todos.set([
  //   ...this.todos(),
  //   todo
  // ]);
}

filteredTodos = computed(() => {
  const search = this.searchService.searchTerm().toLocaleLowerCase()

  return this.todos().filter(todo =>
    todo.title.toLowerCase().includes(search)
  );
});
  
}


