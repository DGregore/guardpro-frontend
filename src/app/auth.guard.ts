import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Importe o AuthService

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Se o usuário está logado (tem token), permite o acesso à rota
    return true;
  } else {
    // Se não está logado, redireciona para a página de login
    console.log('AuthGuard: User not logged in, redirecting to /login');
    router.navigate(['/login']);
    return false;
  }
};