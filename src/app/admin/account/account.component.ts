import { Component, OnInit } from '@angular/core';
import { User } from '../types/user.types';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  user: User | undefined;
  message: any;
  popupMessage: any;
  updateForm!: FormGroup;
  deleteForm!: FormGroup;
  inputsAreVisible = false;
  popupIsVisible = false;
  inputWasChanged = false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateForm = this.formBuilder.group({
      name: [null],
      newPassword: [null],
      confirmedPassword: [null],
      password: [null],
    });

    this.deleteForm = this.formBuilder.group({
      password: [null, Validators.required],
    });

    const userId = this.authService.getUserId();
    if (userId) {
      this.userService.getUser(userId).subscribe((user) => {
        this.user = user;
        this.updateForm.get('name')?.setValue(this.user.name);
      });
    }
  }

  showInputs(): void {
    if (this.updateForm.get('newPassword')?.value !== '') {
      this.inputsAreVisible = true;
    } else {
      this.inputsAreVisible = false;
      this.updateForm.get('newPassword')?.setValue(null);
      this.updateForm.get('confirmedPassword')?.setValue(null);
      this.updateForm.get('password')?.setValue(null);
    }
  }

  updateAccount(): void {
    if (!this.checkUpdateFields()) {
      return;
    }

    if (this.updateForm.get('name')?.value === '') {
      this.updateForm.get('name')?.setValue(this.user?.name);
    }

    if (this.user) {
      this.userService
        .updateUser(this.user?.id, this.updateForm.getRawValue())
        .subscribe({
          next: (response: any) => {
            this.message = { isError: false, content: response.message };
            if (response.token) {
              localStorage.setItem('token', response.token);
            }
          },
          error: (response: any) => {
            this.message = { isError: true, content: response.error.message };
          },
        });
    }
  }

  deleteAccount(): void {
    if (!this.checkDeleteFields()) {
      return;
    }

    if (this.user) {
      this.userService
        .deleteUser(this.user?.id, this.deleteForm.getRawValue())
        .subscribe({
          next: () => {
            this.authService.logout();
          },
          error: (response) => {
            this.popupMessage = {
              isError: true,
              content: response.error.message,
            };
          },
        });
    }
  }

  checkUpdateFields(): boolean {
    if (
      this.updateForm.get('name')?.value === this.user?.name &&
      this.updateForm.get('newPassword')?.value === null
    ) {
      return false;
    }

    if (
      (this.updateForm.get('newPassword')?.value === null &&
        this.updateForm.get('confirmedPassword')?.value === null) ||
      (this.updateForm.get('newPassword')?.value ===
        this.updateForm.get('confirmedPassword')?.value &&
        this.updateForm.get('password')?.value)
    ) {
      return true;
    }

    this.message = {
      isError: true,
      content:
        'New password must be confirmed and current password must be set.',
    };
    return false;
  }

  checkDeleteFields(): boolean {
    if (!this.deleteForm.get('password')?.value) {
      this.popupMessage = {
        isError: true,
        content: 'Password must be set.',
      };
      return false;
    }
    return true;
  }

  togglePopup(): void {
    this.popupIsVisible = !this.popupIsVisible;
    this.deleteForm.get('password')?.setValue(null);
    if (!this.popupIsVisible) {
      this.popupMessage = {};
    }
  }
}
