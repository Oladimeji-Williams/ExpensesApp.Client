import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './user-profile.html',
    styleUrls: ['./user-profile.css']
})
export class UserProfile implements OnInit {
    profileForm!: FormGroup;
    loading = false;
    message: string | null = null;

    profileImageUrl: string = 'assets/default-profile.png'; // fallback
    selectedImageFile: File | null = null;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        public authService: AuthService
    ) {}

    ngOnInit(): void {
        this.profileForm = this.fb.group({
            email: [{ value: '', disabled: true }],
            firstName: [''],
            lastName: [''],
            phoneNumber: [''],
            address: ['']
        });

        this.loadUserProfile();
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
                this.message = 'Failed to load profile';
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

            // Preview the image
            const reader = new FileReader();
            reader.onload = () => {
                this.profileImageUrl = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    updateProfile(): void {
        this.message = null;

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
                    this.message = 'Profile updated successfully!';
                    this.loading = false;
                    this.loadUserProfile();
                },
                error: () => {
                    this.message = 'Failed to update profile';
                    this.loading = false;
                }
            });
        }
    }
}
