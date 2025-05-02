import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// Interface para a resposta do login (esperamos um access_token)
interface LoginResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL base da sua API backend (ajuste se necessário)
  private apiUrl = 'http://localhost:3000'; // Ou a URL onde seu backend está rodando
  private tokenKey = 'guardpro_auth_token'; // Chave para guardar o token no localStorage

  constructor(private http: HttpClient) { }

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          // Armazena o token no localStorage após o login bem-sucedido
          this.setToken(response.access_token);
          console.log('Login successful, token stored.');
        })
      );
  }

  // Método para guardar o token no localStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Método para obter o token do localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Método para remover o token (logout)
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    console.log('Logged out, token removed.');
    // Aqui você pode adicionar lógica para redirecionar para a tela de login, etc.
  }

  // Método para verificar se o usuário está logado (baseado na existência do token)
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Você pode adicionar outros métodos aqui, como para obter informações do usuário logado
  // usando o token, ou para lidar com refresh tokens, etc.
}

