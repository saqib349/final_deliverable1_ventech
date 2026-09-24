import express from 'express';
import { generateTodo } from '../controller/ai.controller.js';

const aiRouter = express.Router();

aiRouter.post('/generate-todo', generateTodo);

export default aiRouter;
