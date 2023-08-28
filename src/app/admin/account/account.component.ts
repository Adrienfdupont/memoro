import { Component } from '@angular/core';
import { User } from '../types/user.types';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent {
  user: User | undefined;
  message: string;
  messageIsError: boolean;
  updateForm: FormGroup;
  inputsAreVisible: boolean;
  router: any;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.message = '';
    this.messageIsError = false;
    this.inputsAreVisible = false;
    this.updateForm = this.formBuilder.group({
      name: [null],
      newPassword: [null],
      confirmedPassword: [null],
      password: [null],
    });
    const userId = this.userService.getUserId();

    if (userId) {
      this.userService.getUser().subscribe((user) => {
        this.user = user;
      });
    }
  }

  showInputs(): void {
    if (this.updateForm.get('newPassword')?.value !== '') {
      this.inputsAreVisible = true;
    } else {
      this.inputsAreVisible = false;
    }
  }

  save(): void {
    if (!this.checkFields()) {
      return;
    }

    const userData = {
      name: this.updateForm.get('name')?.value,
      newPassword: this.updateForm.get('newPassword')?.value,
      password: this.updateForm.get('password')?.value,
    };

    if (!userData.name) {
      userData.name = this.user?.name;
    }

    if (this.user?.id) {
      this.userService.updateUser(userData).subscribe({
        next: (response: any) => {
          this.messageIsError = false;
          this.message = response.message;
          this.setNewToken(userData);
        },
        error: (response: any) => {
          this.messageIsError = true;
          this.message = response.error.message;
        },
      });
    }
  }

  checkFields(): boolean {
    if (
      this.updateForm.get('newPassword')?.value ===
        this.updateForm.get('confirmedPassword')?.value &&
      this.updateForm.get('password')?.value
    ) {
      return true;
    }

    this.messageIsError = true;
    this.message =
      'New password must be confirmed and current password must be set.';
    return false;
  }

  setNewToken(userData: any) {
    this.authService
      .login({ name: userData.name, password: userData.newPassword })
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
        },
      });
  }
}
