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
  message: any;
  updateForm: FormGroup;
  inputsAreVisible: boolean;
  router: any;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.inputsAreVisible = false;
    this.updateForm = this.formBuilder.group({
      name: [null],
      newPassword: [null],
      confirmedPassword: [null],
      password: [null],
    });

    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
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

  checkFields(): boolean {
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
}
