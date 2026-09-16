import { Routes } from '@angular/router';
import { Main } from './main/main';
import { ListTodo } from './pages/list-todo/list-todo';
import { ApiTodo } from './pages/api-todo/api-todo';
import { Login } from './pages/login/login';
import { authGuardGuard } from './guards/auth-guard-guard';
import { Signup } from './pages/signup/signup';
import { UserDetailComponent } from './components/user-detail-component/user-detail-component';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
    {
        path: "",
        component: Main,
    },
    {
        path: "listTodo",
        component: ListTodo,
        canActivate: [authGuardGuard]
    },
    {
        path: "apiTodo",
        component: ApiTodo,
        canActivate: [authGuardGuard]
    },
    {
        path: "login",
        component: Login
    },
    {
        path: "signup",
        component: Signup
    },
    {
        path: 'admin/user/:id',
        component: UserDetailComponent,
        canActivate: [adminGuard]
    }
];
