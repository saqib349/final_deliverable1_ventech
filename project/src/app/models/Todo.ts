type todo = {
    _id: string,
    userId: number | string,
    title: string,
    description?: string,
    priority?: "low" | "medium" | "high",
    dueDate?: string | Date | null,
    completed: boolean
}

type createTodo = {
    title: string,
    description?: string,
    priority?: "low" | "medium" | "high",
    dueDate?: string | Date | null,
    completed: boolean
}

type createTodoRes = {
    data: todo
}

type aiGeneratedTodo = {
    title: string,
    description: string,
    priority: "low" | "medium" | "high",
    dueDate: string | null,
    completed: boolean
}

type aiGenerateRes = {
    data: aiGeneratedTodo
}