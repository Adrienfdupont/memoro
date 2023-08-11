import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  message: string;
  messageError: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      confirmedPassword: [null, Validators.required],
    });
    this.registerForm
      .get('confirmedPassword')
      ?.setValidators(this.passwordMatchValidator());
    this.message = '';
    this.messageError = false;
  }

  submit(): void {
    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: (response) => {
        this.messageError = false;
        this.message = response.message;
      },
      error: (response) => {
        this.messageError = true;
        this.message = response.error.message;
      },
    });
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = this.registerForm.get('password');
      const confirmedPassword = control;

      if (
        password &&
        confirmedPassword &&
        password.value !== confirmedPassword.value
      ) {
        this.messageError = true;
        this.message = "Passwords don't match";
        return { passwordMismatch: true };
      }
      this.message = '';
      return null;
    };
  }
}
