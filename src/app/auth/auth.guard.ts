import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);

  const hasToken = (): boolean => {
    return localStorage.getItem('token') !== null;
  };

  return hasToken() ? true : router.parseUrl('login');
};
