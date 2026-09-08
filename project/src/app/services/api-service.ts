import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    http = inject(HttpClient)

    getTodos() {
        return this.http.get<{data: todo[]}>("http://localhost:8000/todo")
    }

    addTodo(todo:createTodo) {
        return this.http.post<{data:todo}>("http://localhost:8000/todo",todo)
    }

    deleteTodo(id:string){
        return this.http.delete<{data:todo}>(`http://localhost:8000/todo/${id}`)
    }
    updateTodo(id:string,todo:todo){
        return this.http.patch<{data:todo}>(`http://localhost:8000/todo/${id}`,todo)
    }
    
}
