import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  signUpForm: FormGroup;
  errorMessage: string | null = null;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router)
  {
    this.signUpForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      },
      {
        validator: this.passwordMatchValidator
      }
    )
  }
  hasError(controlName: string, errorName: string): boolean
  {
    const control = this.signUpForm.get(controlName);
    return (control?.touched || control?.dirty) && control.hasError(errorName) || false;
  }
  passwordMatchValidator(formGroup: FormGroup)
  {
    return formGroup.get('password')?.value === formGroup.get('confirmPassword')?.value
    ? null
    : {passwordMismatch: true}
  }
  onSubmit(): void
  {
    this.errorMessage = null;
    if(this.signUpForm.valid)
    {
      const signUp = this.signUpForm.value;
      this.authService.register(signUp).subscribe(
        {
          next: () => {
            this.router.navigate(['/transactions'])
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'An error occurred during signup. Please, try again.'
            console.log('Error - ', error);
          }
        }
      )
    }
  }
}
