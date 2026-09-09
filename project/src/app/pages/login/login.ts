import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { catchError, EMPTY, exhaustMap, Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  router = inject(Router)
  errorMessage = signal("")
  authService = inject(AuthService)
  private clickLogin$ = new Subject<void>()

  constructor() {
  this.clickLogin$
    .pipe(
      exhaustMap(() => {

        const user: Omit<User, "username" | "role"> = {
          email: this.loginForm.controls.email.value,
          password: this.loginForm.controls.password.value
        };

        return this.authService.loginUser(user).pipe(
          catchError((err) => {
            this.errorMessage.set(err.error.message);
            return EMPTY;
          })
        );

      })
    )
    .subscribe({
      next: (result) => {
        this.authService.isAuthenticated.set(true);
        this.authService.username.set(result.data.username);
        this.authService.role.set(result.data.role);
        this.router.navigate(['/']);
      }
    });
}

  loginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }
    ),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8)
      ]
    })
  })

  handleLogin() {
    this.clickLogin$.next()
  }

}
