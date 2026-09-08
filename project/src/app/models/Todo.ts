type todo = {
    _id:string ,
    userId: number ,
    title: string ,
    completed: boolean 
}

type createTodo= {
    title:string,
    completed:boolean
}

type createTodoRes={
    data:todo
}