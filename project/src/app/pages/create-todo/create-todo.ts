import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api-service';
import { AiTodoAssistant } from '../../components/ai-todo-assistant/ai-todo-assistant';
import { AddTodo } from '../../components/add-todo/add-todo';

@Component({
  selector: 'app-create-todo',
  imports: [AiTodoAssistant, AddTodo],
  templateUrl: './create-todo.html',
  styleUrl: './create-todo.css',
})
export class CreateTodo {
  apiService = inject(ApiService)
  errorMessage = signal('')
  successfullMessage = signal('')
  destroyRef = inject(DestroyRef)
  aiGeneratedTodo = signal<createTodo | null>(null);
  AddTodo(todo: createTodo) {

    this.errorMessage.set("");
    this.successfullMessage.set("");

    this.apiService.addTodo(todo).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({

      next: (result) => {
        const { data } = result;
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

}
