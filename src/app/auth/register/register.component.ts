import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/admin/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  message: string;
  messageIsError: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.registerForm = this.formBuilder.group({
      name: [null, Validators.required],
      password: [null, Validators.required],
      confirmedPassword: [null, Validators.required],
    });
    this.message = '';
    this.messageIsError = false;
  }

  submit(): void {
    if (!this.checkFields()) {
      return;
    }

    this.userService.createUser(this.registerForm.getRawValue()).subscribe({
      next: (response) => {
        this.messageIsError = false;
        this.message = response.message;
      },
      error: (response) => {
        this.messageIsError = true;
        this.message = response.error.message;
      },
    });
  }

  checkFields(): boolean {
    if (
      this.registerForm.get('password')?.value ===
      this.registerForm.get('confirmedPassword')?.value
    ) {
      this.messageIsError = false;
      this.message = '';
      return true;
    }

    this.messageIsError = true;
    this.message = 'Passwords must match.';
    return false;
  }
}
