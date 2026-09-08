import { Routes } from '@angular/router';
import { Main } from './main/main';
import { ListTodo } from './pages/list-todo/list-todo';
import { ApiTodo } from './pages/api-todo/api-todo';
import { Login } from './pages/login/login';
import { authGuardGuard } from './guards/auth-guard-guard';
import { Signup } from './pages/signup/signup';

export const routes: Routes = [
    {
        path:"",
        component: Main,
        canActivate:[authGuardGuard]
    },
    {
        path:"listTodo",
        component:ListTodo,
        canActivate:[authGuardGuard]
    },
    {
        path:"apiTodo",
        component:ApiTodo,
        canActivate:[authGuardGuard]
    },
    {
        path:"login",
        component:Login
    },
    {
        path:"signup",
        component:Signup
    }
];
