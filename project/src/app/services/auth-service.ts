import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    http = inject(HttpClient)
    isAuthenticated = signal(false)
    username=signal("")
    role=signal("user")

    checkAuth() {
        return this.http.get<{data:User}>(
            'https://final-deliverable1-ventech-o7q6.vercel.app/auth/me'
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
        return this.http.post("https://final-deliverable1-ventech-o7q6.vercel.app/user/logout", {}).pipe(
            tap(() => {
                this.isAuthenticated.set(false);
                this.username.set("")
                this.role.set("user")
            })
        )
    }
    signupUser(user: Omit<User, "role">) {
        return this.http.post<{ data: User }>("https://final-deliverable1-ventech-o7q6.vercel.app/user/signup", user)
    }
    loginUser(user: Omit<User, "username" | "role">) {
        return this.http.post<{ data: User }>("https://final-deliverable1-ventech-o7q6.vercel.app/user/login", user)
    }
} 
