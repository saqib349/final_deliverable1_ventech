import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    http = inject(HttpClient)

     getTodos(page: number, limit: number) {
        return this.http.get<{
            data: todo[];
            pagination: {
                currentPage: number;
                pageSize: number;
                totalTodos: number;
                totalPages: number;
            };
        }>(
            `https://final-deliverable1-ventech-o7q6.vercel.app/todos?page=${page}&limit=${limit}`
        );
    }

    addTodo(todo:createTodo) {
        return this.http.post<{data:todo}>("https://final-deliverable1-ventech-o7q6.vercel.app/todos",todo)
    }

    deleteTodo(id:string){
        return this.http.delete<{data:todo}>(`https://final-deliverable1-ventech-o7q6.vercel.app/todos/${id}`)
    }
    updateTodo(id:string,todo:todo){
        return this.http.patch<{data:todo}>(`https://final-deliverable1-ventech-o7q6.vercel.app/todos/${id}`,todo)
    }
    searchTodo(searchTerm:string){
        return this.http.get<{
            data: todo[];
            pagination: {
                currentPage: number;
                pageSize: number;
                totalTodos: number;
                totalPages: number;
            };
        }>(`https://final-deliverable1-ventech-o7q6.vercel.app/todos/search?searchTerm=${searchTerm}`)
    }
    generateTodo(prompt: string) {
        return this.http.post<aiGenerateRes>("https://final-deliverable1-ventech-o7q6.vercel.app/ai/generate-todo", { prompt });
    }
    
}
