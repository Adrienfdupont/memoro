import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const hasToken = (): boolean => {
    const token = localStorage.getItem('token');
    if (token) {
      const encodedPayload = token.split('.')[1];
      const payload = JSON.parse(atob(encodedPayload));
      const expirationDate = new Date(payload.expirationDate);
      const today = new Date();
      if (today < expirationDate) {
        localStorage.setItem('userId', payload.userId.toString());
        return true;
      }
    }

    return false;
  };

  return hasToken() ? true : router.parseUrl('login');
};
