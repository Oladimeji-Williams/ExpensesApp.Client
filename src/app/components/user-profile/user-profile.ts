import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { environment } from '../../../environments/environment';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './user-profile.html',
    styleUrls: ['./user-profile.css']
})

export class UserProfile implements OnInit {
    profileForm!: FormGroup;
    loading = false;
    errorMessage: string | null = null;
    successMessage: string | null = null;

    profileImageUrl: string = 'assets/default-profile.png';
    selectedImageFile: File | null = null;

    passwordForm!: FormGroup;
    passwordLoading = false;
    passwordErrorMessage: string | null = null;
    passwordSuccessMessage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        public authService: AuthService
    ) {}

    ngOnInit(): void {
        this.profileForm = this.fb.group({
            email: [{ value: '', disabled: true }],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            address: ['']
        });

        this.loadUserProfile();

        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        });

    }

    loadUserProfile(): void {
        const token = this.authService.getToken();
        if (!token) return;

        this.loading = true;

        this.http.get<any>(`${environment.apiBaseUrl}/User/GetProfile`, {
            headers: { Authorization: `Bearer ${token}` }
        }).subscribe({
            next: (user) => {
                this.profileForm.patchValue({
                    email: user.email || '',
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    phoneNumber: user.phoneNumber || '',
                    address: user.address || ''
                });

                if (user.profileImagePath) {
                    this.profileImageUrl = `${environment.apiBaseUrl}/uploads/${user.profileImagePath}`;
                }

                this.loading = false;
            },
            error: (err) => {
                this.errorMessage = 'Failed to load profile';
                console.error('Profile load error:', err);
                this.loading = false;
            }
        });
    }

    onProfileImageSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.selectedImageFile = file;

            const reader = new FileReader();
            reader.onload = () => {
                this.profileImageUrl = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    updateProfile(): void {
        this.errorMessage = null;
        this.successMessage = null;

        if (this.profileForm.valid) {
            this.loading = true;

            const formData = new FormData();
            const formValue = this.profileForm.getRawValue();

            formData.append('firstName', formValue.firstName);
            formData.append('lastName', formValue.lastName);
            formData.append('phoneNumber', formValue.phoneNumber);
            formData.append('address', formValue.address);

            if (this.selectedImageFile) {
                formData.append('profileImage', this.selectedImageFile);
            }

            this.http.put(`${environment.apiBaseUrl}/User/UpdateProfileWithImage`, formData, {
                headers: {
                    Authorization: `Bearer ${this.authService.getToken()}`
                }
            }).subscribe({
                next: () => {
                    this.successMessage = 'Profile updated successfully!';
                    this.loading = false;
                    this.loadUserProfile();
                },
                error: () => {
                    this.errorMessage = 'Failed to update profile';
                    this.loading = false;
                }
            });
        } else {
            this.errorMessage = 'Please fill all required fields correctly.';
        }
    }

    changePassword(): void {
        this.passwordErrorMessage = null;
        this.passwordSuccessMessage = null;

        if (this.passwordForm.invalid) {
            this.passwordErrorMessage = 'All fields are required.';
            return;
        }

        const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

        if (newPassword !== confirmPassword) {
            this.passwordErrorMessage = 'New passwords do not match.';
            return;
        }

        this.passwordLoading = true;

        this.http.post(`${environment.apiBaseUrl}/User/ChangePassword`, {
            currentPassword,
            newPassword
        }, {
            headers: { Authorization: `Bearer ${this.authService.getToken()}` }
        }).subscribe({
            next: () => {
                this.passwordSuccessMessage = 'Password changed successfully.';
                this.passwordForm.reset();
                this.passwordLoading = false;
            },
            error: () => {
                this.passwordErrorMessage = 'Failed to change password.';
                this.passwordLoading = false;
            }
        });
    }

}
