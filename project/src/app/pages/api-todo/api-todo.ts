
import { Component, DestroyRef, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { Todoslist } from '../../components/todoslist/todoslist';
import { SearchService } from '../../services/search-service';
import { AddTodo } from "../../components/add-todo/add-todo";
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  skip,
  switchMap
} from 'rxjs';

@Component({
  selector: 'app-api-todo',
  imports: [Todoslist, AddTodo],
  templateUrl: './api-todo.html',
  styleUrl: './api-todo.css',
})
export class ApiTodo implements OnDestroy {

  destroyRef=inject(DestroyRef)
  apiService = inject(ApiService);
  searchService = inject(SearchService);

  route = inject(ActivatedRoute);
  router = inject(Router);

  todos = signal<Array<todo>>([]);

  loading = signal(false);
  errorMessage = signal("");
  successfullMessage = signal("");

  canRetry = false;

  // Pagination state
  currentPage = signal(1);
  limit = signal(5);
  totalPages = signal(1);
  totalTodos = signal(0);


  constructor() {

    // Read page and limit from URL query parameters
    this.route.queryParamMap
      .pipe(
        takeUntilDestroyed()
      )
      .subscribe(params => {

        const page = Number(params.get('page')) || 1;
        const limit = Number(params.get('limit')) || 5;

        this.currentPage.set(page);
        this.limit.set(limit);

        this.loadTodos(page, limit);

      });


    // Search
    toObservable(this.searchService.searchTerm)
      .pipe(
        skip(1),

        debounceTime(3000),

        distinctUntilChanged(),

        switchMap(search => {

          this.todos.set([]);
          this.loading.set(true);
          this.errorMessage.set("");
          this.successfullMessage.set("");
          this.canRetry = false;

          const request$ = search
            ? this.apiService.searchTodo(search)
            : this.apiService.getTodos(
                this.currentPage(),
                this.limit()
              );

          return request$.pipe(

            catchError(err => {

              this.loading.set(false);

              if (err.status >= 500 && err.status <= 599) {
                this.canRetry = true;
              }

              this.errorMessage.set(
                err.error?.message || "Something went wrong"
              );

              return EMPTY;
            })

          );

        }),

        takeUntilDestroyed()

      )

      .subscribe({

        next: (result) => {

          this.todos.set(result.data);

          // Pagination information exists for normal todo request
          if (result.pagination) {
            this.currentPage.set(result.pagination.currentPage);
            this.limit.set(result.pagination.pageSize);
            this.totalTodos.set(result.pagination.totalTodos);
            this.totalPages.set(result.pagination.totalPages);
          }

          this.loading.set(false);
          this.errorMessage.set("");
          this.canRetry = false;

        }

      });

  }


  // Load todos for a specific page
  loadTodos(page: number, limit: number): void {

    this.todos.set([]);
    this.loading.set(true);
    this.errorMessage.set("");
    this.successfullMessage.set("");
    this.canRetry = false;

    this.apiService.getTodos(page, limit).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({

      next: (result) => {

        this.todos.set(result.data);

        this.currentPage.set(result.pagination.currentPage);
        this.limit.set(result.pagination.pageSize);
        this.totalTodos.set(result.pagination.totalTodos);
        this.totalPages.set(result.pagination.totalPages);

        this.loading.set(false);
        this.errorMessage.set("");
        this.canRetry = false;

      },

      error: (err) => {

        this.loading.set(false);

        if (err.status >= 500 && err.status <= 599) {
          this.canRetry = true;
        }

        this.errorMessage.set(
          err.error?.message || "Something went wrong"
        );

      }

    });

  }


  // Go to next page
  nextPage(): void {

    if (this.currentPage() >= this.totalPages()) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage() + 1,
        limit: this.limit()
      }
    });

  }


  // Go to previous page
  previousPage(): void {

    if (this.currentPage() <= 1) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage() - 1,
        limit: this.limit()
      }
    });

  }


  UpdateStatus(todo: todo | undefined) {

    if (!todo) return;

    const newtodo = {
      ...todo,
      completed: !todo.completed
    };

    this.errorMessage.set("");
    this.successfullMessage.set("");

    this.apiService.updateTodo(newtodo._id, newtodo).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({

      next: (result) => {

        this.todos.update(todos =>
          todos.map(t =>
            t._id === newtodo._id
              ? newtodo
              : t
          )
        );

        this.successfullMessage.set(
          `successful update ${result.data.title}`
        );

      },

      error: (err) => {

        this.successfullMessage.set("");
        this.errorMessage.set(
          err.error?.message || "Something went wrong"
        );

      }

    });

  }


  AddTodo(todo: createTodo) {

  this.errorMessage.set("");
  this.successfullMessage.set("");

  this.apiService.addTodo(todo).pipe(
    takeUntilDestroyed(this.destroyRef)
  ).subscribe({

    next: (result) => {

      const { data } = result;

      if (this.todos().length >= this.limit()) {
        this.totalPages.update(value=>value+1)
        this.nextPage();

      } else {

        // There is still room on current page.
        this.loadTodos(
          this.currentPage(),
          this.limit()
        );

      }

      this.successfullMessage.set(
        `successful added ${data.title}`
      );

    },

    error: (error) => {

      this.successfullMessage.set("");

      this.errorMessage.set(
        error.error?.message || "Something went wrong"
      );

    }

  });

}


  Deletetodo(todo: todo | undefined) {

    if (!todo) return;

    const id = todo._id;

    this.errorMessage.set("");
    this.successfullMessage.set("");

    this.apiService.deleteTodo(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({

      next: (result) => {

        this.todos.update(todos =>
          todos.filter(t =>
            t._id !== todo._id
          )
        );
        if (this.todos().length<1){
          this.previousPage()
        }

        this.successfullMessage.set(
          `successful deleted ${result.data.title}`
        );

      },

      error: (err) => {

        this.successfullMessage.set("");
        this.errorMessage.set(
          err.error?.message || "Something went wrong"
        );

      }

    });

  }


  ngOnDestroy(): void {

    console.log("component destroyed");

    this.searchService.searchTerm.set('');

  }

}
