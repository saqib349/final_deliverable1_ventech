import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { Todoslist } from '../../components/todoslist/todoslist';
import { SearchService } from '../../services/search-service';
import { AddTodo } from "../../components/add-todo/add-todo";

@Component({
  selector: 'app-api-todo',
  imports: [Todoslist, AddTodo],
  templateUrl: './api-todo.html',
  styleUrl: './api-todo.css',
})
export class ApiTodo implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    console.log("component destroyed");

    this.searchService.searchTerm.set('')
    console.log(this.searchService.searchTerm())
  }
  ngOnInit(): void {
    this.loadTodos();
  }

  apiService = inject(ApiService);

  todos = signal<Array<todo>>([]);
  searchService = inject(SearchService)

  loading = signal(false);
  errorMessage =signal("")
  successfullMessage=signal("")
  canRetry = false;

  loadTodos(): void {

    this.todos.set([])
    this.loading.set(true)
    this.errorMessage.set("")
    this.canRetry = false;

    this.apiService.getTodos().subscribe(
      {
        next: (result) => {
          const { data } = result
          this.todos.set(data)
          this.loading.set(false)
          this.errorMessage.set("")
          this.canRetry = false;
        },

        error: (err) => {
          if (err.status>= 500 && err.status <= 600) {
            this.canRetry = true
          }
          this.loading.set(false)
          this.errorMessage.set(err.error.message)
        }
      });
  }

  UpdateStatus(todo: todo | undefined) {
    if (!todo) return;
    const newtodo = { ...todo, completed: !todo.completed }
    this.errorMessage.set('')
    this.successfullMessage.set("")
    this.apiService.updateTodo(newtodo._id, newtodo).subscribe({
      next: (result) => {
        this.todos.update(todos =>
          todos.map(t =>
            t._id === newtodo._id
              ? newtodo
              : t
          )
        );
        this.successfullMessage.set(`successfull update ${result.data.title}`)
      },
      error: (err) => {
        this.successfullMessage.set("")
        this.errorMessage.set(err.error.message)
      }
    })
   }

  AddTodo(todo: createTodo) {
    this.errorMessage.set("")
    this.successfullMessage.set("")
    this.apiService.addTodo(todo).subscribe({
      next: (result) => {
        const { data } = result
        this.todos.update(todos => [...todos, data]);
        this.successfullMessage.set(`successfull added ${result.data.title}`)
      },
      error: (error) => {
        this.successfullMessage.set("")
        this.errorMessage.set(error.error.message)
      }
    })
  }

  Deletetodo(todo: todo | undefined) {
    if (!todo) return;
    const id = todo._id
    this.errorMessage.set("")
    this.successfullMessage.set("")
    this.apiService.deleteTodo(id).subscribe({
      next: (result) => {
        this.todos.update(todos =>
          todos.filter(t =>
            t._id !== todo._id
          )
        );
        this.successfullMessage.set(`successfull deleted ${result.data.title}`)
      },
      error: (err) => {
        this.successfullMessage.set("")
        this.errorMessage.set(err.error.message)
      }
    })

  }

  filteredTodos = computed(() => {
    const search = this.searchService.searchTerm().toLocaleLowerCase()

    const new_array= this.todos().filter(todo =>
      todo.title.toLowerCase().includes(search)
    )
    return new_array.reverse()
  });



}
