import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-todoslist',
  imports: [],
  templateUrl: './todoslist.html',
  styleUrl: './todoslist.css',
})
export class Todoslist {
  todo=input<todo>()
  updateTodo=output<todo | undefined>()
  deleteTodo=output<todo | undefined>()

  updateStatus(){
    this.updateTodo.emit(this.todo())
  }
  deletetodo(){
    this.deleteTodo.emit(this.todo())
  }

}
