import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service';

@Component({
    selector: 'app-ai-todo-assistant',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './ai-todo-assistant.html',
    styleUrl: './ai-todo-assistant.css'
})
export class AiTodoAssistant {
    private apiService = inject(ApiService);

    prompt = signal<string>('');
    aiLoading = signal<boolean>(false);
    aiError = signal<string>('');
    aiGenerated = signal<boolean>(false);

    todoGenerated = output<createTodo>();

    generateTodo() {
        const currentPrompt = this.prompt().trim();
        if (!currentPrompt) return;

        this.aiLoading.set(true);
        this.aiError.set('');

        this.apiService.generateTodo(currentPrompt).subscribe({
            next: (res) => {
                this.aiLoading.set(false);
                if (res && res.data) {
                    this.aiGenerated.set(true);
                    const generated: createTodo = {
                        title: res.data.title,
                        description: res.data.description,
                        priority: res.data.priority,
                        dueDate: res.data.dueDate,
                        completed: res.data.completed
                    };
                    this.todoGenerated.emit(generated);
                }
            },
            error: (err) => {
                this.aiLoading.set(false);
                this.aiError.set(err.error?.message || 'Failed to generate Todo from AI. Please try again.');
            }
        });
    }

    regenerateTodo() {
        this.generateTodo();
    }
}
