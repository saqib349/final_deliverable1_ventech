import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    http = inject(HttpClient)

    getTodos() {
        return this.http.get<{data: todo[]}>("https://final-deliverable1-ventech-o7q6.vercel.app/todo")
    }

    addTodo(todo:createTodo) {
        return this.http.post<{data:todo}>("https://final-deliverable1-ventech-o7q6.vercel.app/todo",todo)
    }

    deleteTodo(id:string){
        return this.http.delete<{data:todo}>(`https://final-deliverable1-ventech-o7q6.vercel.app/todo/${id}`)
    }
    updateTodo(id:string,todo:todo){
        return this.http.patch<{data:todo}>(`https://final-deliverable1-ventech-o7q6.vercel.app/todo/${id}`,todo)
    }
    
}
