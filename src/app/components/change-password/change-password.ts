import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class ChangePassword {
  changePasswordForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });

  }

  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('newPassword')?.value === formGroup.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.changePasswordForm.get(controlName);
    return (control?.touched || control?.dirty) && control.hasError(errorName) || false;
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.changePasswordForm.valid) {
      const { currentPassword, newPassword } = this.changePasswordForm.value;

      this.authService.changePassword({ currentPassword, newPassword }).subscribe({
        next: (res) => {
          this.successMessage = res.message;
          this.changePasswordForm.reset();

          // ✅ Redirect to homepage after short delay (optional)
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500); // 1.5 seconds delay (adjust or remove as needed)
        },

        error: (error) => {
          this.errorMessage = error.error?.message || 'Something went wrong. Please try again.';
        }
      });
    }
  }
}
