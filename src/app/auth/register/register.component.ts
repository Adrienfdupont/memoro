import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/admin/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  message: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: [null, Validators.required],
      password: [null, Validators.required],
      confirmedPassword: [null, Validators.required],
    });
  }

  register(): void {
    if (!this.checkFields()) {
      return;
    }

    this.userService.createUser(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.message = {
          isError: false,
          content: 'You were sucessfully registered.',
        };
      },
      error: (response: any) => {
        let errorMessage: string;
        switch (response.status) {
          case 409:
            errorMessage = 'This username is already used.';
            break;
          default:
            errorMessage = 'An error has occurred.';
        };
        this.message = { isError: true, content: errorMessage };
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
