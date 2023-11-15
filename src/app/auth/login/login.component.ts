import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  message: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      name: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  login(): void {
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/']);
      },
      error: (response: any) => {
        let errorMessage: string;
        switch (response.status) {
          case 401:
            errorMessage = 'Username or password incorrect.';
            break;
          default:
            errorMessage = 'An error has occurred.';
        };
        this.message = { isError: true, content: errorMessage };
      },
    });
  }
}
