
import express from 'express'
import { addTodo, deleteTodo, getTodos, updateTodo } from '../controller/todos.controller.js'
const todoRouter = express.Router()

todoRouter.route('/').post(addTodo).get(getTodos)
todoRouter.route('/:id').delete(deleteTodo).patch(updateTodo)


export default todoRouter