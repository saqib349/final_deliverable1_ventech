import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-todo',
  imports: [ReactiveFormsModule],
  templateUrl: './add-todo.html',
  styleUrl: './add-todo.css',
})
export class AddTodo {
  addTodo = output<createTodo>();
  aiTodoData = input<createTodo | null>(null);

  addForm = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6)
      ]
    }),

    description: new FormControl<string>('', {
      nonNullable: true
    }),

    priority: new FormControl<'low' | 'medium' | 'high'>('medium', {
      nonNullable: true
    }),

    dueDate: new FormControl<string | null>(null),

    status: new FormControl<boolean | null>(null, [
      Validators.required,
    ])
  });

  constructor() {
    effect(() => {
      const data = this.aiTodoData();
      if (data) {
        let formattedDate: string | null = null;
        if (data.dueDate) {
          if (data.dueDate instanceof Date) {
            formattedDate = data.dueDate.toISOString().split('T')[0];
          } else if (typeof data.dueDate === 'string') {
            formattedDate = data.dueDate.split('T')[0];
          }
        }

        this.addForm.patchValue({
          title: data.title || '',
          description: data.description || '',
          priority: data.priority || 'medium',
          dueDate: formattedDate,
          status: data.completed ?? false
        });
        this.addForm.markAsTouched();
      }
    });
  }

  add() {
    const newTodo: createTodo = {
      title: this.addForm.controls.title.value,
      description: this.addForm.controls.description.value,
      priority: this.addForm.controls.priority.value,
      dueDate: this.addForm.controls.dueDate.value,
      completed: this.addForm.controls.status.value ?? false
    };

    this.addTodo.emit(newTodo);
    this.addForm.reset({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: null,
      status: null
    });
  }
}

