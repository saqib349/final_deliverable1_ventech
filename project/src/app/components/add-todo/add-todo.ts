import { Component, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-todo',
  imports: [ReactiveFormsModule],
  templateUrl: './add-todo.html',
  styleUrl: './add-todo.css',
})
export class AddTodo {
  addTodo = output<createTodo>()

  addForm = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [

        Validators.required,
        Validators.minLength(6)
      ]
    }),

    status: new FormControl<boolean | null>(null, [
      Validators.required,
    ])
  });
  
  add() {
    const newTodo: createTodo = {
      title: this.addForm.controls.title.value,
      completed: this.addForm.controls.status.value ?? false
    };
    

    this.addTodo.emit(newTodo);
    this.addForm.reset({
      title: '',
      status: null
    });
  }


}
