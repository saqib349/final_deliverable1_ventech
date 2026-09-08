import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  router = inject(Router)
  errorMessage = ""
  authService=inject(AuthService)
 
  signupForm = new FormGroup({
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(10)
      ]
    }
    ),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8)
      ]
    })
  })

  handleSignup() {
      const user:Omit<User, "role">={
        username:this.signupForm.controls.username.value,
        email:this.signupForm.controls.email.value,
        password:this.signupForm.controls.password.value
      }
      this.authService.signupUser(user).subscribe({
        next:(result)=>{
          console.log(result)
          this.router.navigate(['/login'])
        } 
        ,
        error:(err)=>{
          this.errorMessage=err.error.message
        }
      })

  }

}
