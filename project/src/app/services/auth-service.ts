import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    http = inject(HttpClient)
    isAuthenticated = signal(false)
    username=signal("saqib")
    role=signal("user")

    checkAuth() {
        return this.http.get<{data:User}>(
            'http://localhost:8000/auth/me'
        ).pipe(
            tap((result) => {
                this.isAuthenticated.set(true);
                this.username.set(result.data.username)
                this.role.set(result.data.role)
            }),
            catchError(() => {
                this.isAuthenticated.set(false);
                return of(null);
            })
        )
    }

    logoutUser() {
        console.log("hello in the logoutUser")
        return this.http.post("http://localhost:8000/user/logout", {}).pipe(
            tap(() => {
                this.isAuthenticated.set(false);
            })
        )
    }
    signupUser(user: Omit<User, "role">) {
        return this.http.post<{ data: User }>("http://localhost:8000/user/signup", user)
    }
    loginUser(user: Omit<User, "username" | "role">) {
        return this.http.post<{ data: User }>("http://localhost:8000/user/login", user)
    }
} 
