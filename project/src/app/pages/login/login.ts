import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  router=inject(Router)
  errorMessage=""
  authService=inject(AuthService)

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

  
  const user:Omit<User,"username" | "role">={
      email : this.loginForm.controls.email.value,
      password : this.loginForm.controls.password.value
  }
  this.authService.loginUser(user).subscribe({
    next:(result)=>{
      this.authService.isAuthenticated.set(true)
      this.authService.username.set(result.data.username)
      this.authService.role.set(result.data.role)
      console.log(this.authService.isAuthenticated(),this.authService.username(),this.authService.role())
      this.router.navigate(['/'])
    },
    error:(err)=>{
      this.errorMessage=err.error.message
      console.log(this.errorMessage)
    }
  })
  // const exists = this.users().some(
  //   user => username === user.username &&  password===user.password
  // );

  // if (exists) {
  //   this.authService.loggedIn.set(true)
  //   this.router.navigate(['/']);
  // }
  // else {
  //   this.errorMessage="username or password not correct"
  // }
}

}
