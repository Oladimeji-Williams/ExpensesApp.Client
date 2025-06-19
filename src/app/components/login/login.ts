import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router)
  {
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
      }
    )
  }
  hasError(controlName: string, errorName: string): boolean
  {
    const control = this.loginForm.get(controlName);
    return (control?.touched || control?.dirty) && control.hasError(errorName) || false;
  }
  onSubmit(): void
  {
    this.errorMessage = null;
    if(this.loginForm.valid)
    {
      const login = this.loginForm.value;
      this.authService.login(login).subscribe(
        {
          next: () => {
            this.router.navigate(['/transactions'])
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'An error occurred during login. Please, try again.'
            console.log('Error - ', error);
          }
        }
      )
    }
  }
}
