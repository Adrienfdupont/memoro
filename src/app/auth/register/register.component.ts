import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/admin/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  message: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.registerForm = this.formBuilder.group({
      name: [null, Validators.required],
      password: [null, Validators.required],
      confirmedPassword: [null, Validators.required],
    });
  }

  submit(): void {
    if (!this.checkFields()) {
      return;
    }

    this.userService.createUser(this.registerForm.getRawValue()).subscribe({
      next: (response) => {
        this.message = { isError: false, content: response.message };
      },
      error: (response) => {
        this.message = { isError: true, content: response.error.message };
      },
    });
  }

  checkFields(): boolean {
    if (
      this.registerForm.get('password')?.value ===
      this.registerForm.get('confirmedPassword')?.value
    ) {
      this.message = {};
      return true;
    }

    this.message = { isError: true, content: 'Passwords must match.' };
    return false;
  }
}
