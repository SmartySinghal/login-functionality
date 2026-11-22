import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = () =>
  inject(Auth).isLoggedIn() ? true : inject(Router).createUrlTree(['/login']);