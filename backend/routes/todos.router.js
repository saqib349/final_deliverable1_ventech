
import express from 'express'
import { addTodo, deleteTodo, getTodos, searchTodo, updateTodo } from '../controller/todos.controller.js'
const todoRouter = express.Router()

todoRouter.route('/').post(addTodo).get(getTodos)
todoRouter.route('/:id').delete(deleteTodo).patch(updateTodo)
todoRouter.get('/search',searchTodo)


export default todoRouter