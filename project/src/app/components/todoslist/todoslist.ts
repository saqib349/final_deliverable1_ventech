import { Component, input, output,ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-todoslist',
  imports: [DatePipe],
  templateUrl: './todoslist.html',
  styleUrl: './todoslist.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Todoslist {
  todo = input<todo>()
  updateTodo = output<todo | undefined>()
  deleteTodo = output<todo | undefined>()

  updateStatus() {
    this.updateTodo.emit(this.todo())
  }
  deletetodo() {
    this.deleteTodo.emit(this.todo())
  }

}
