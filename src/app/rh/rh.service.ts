// guardpro-frontend/src/app/rh/rh.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Servidor } from "./servidor.model"; // <<< Importar a interface Servidor

@Injectable({
  providedIn: "root",
})
export class RhService {
  private apiUrl = "http://localhost:3000/rh/servidores"; // Ajuste a URL base da sua API

  constructor(private http: HttpClient) {}

  // Usar Partial<Servidor> para a lista, pois selecionamos campos específicos
  getServidores(): Observable<Partial<Servidor>[]> {
    return this.http.get<Partial<Servidor>[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Usar a interface Servidor completa para buscar um único servidor
  getServidor(id: number): Observable<Servidor> {
    return this.http.get<Servidor>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Usar a interface Servidor para criar
  addServidor(servidor: Servidor): Observable<Servidor> {
    // Omitir 'id' e campos de timestamp que são gerados pelo backend
    const { id, createdAt, updatedAt, ...servidorData } = servidor;
    return this.http.post<Servidor>(this.apiUrl, servidorData)
      .pipe(catchError(this.handleError));
  }

  // Usar Partial<Servidor> para atualizar, pois nem todos os campos são obrigatórios
  updateServidor(id: number, servidor: Partial<Servidor>): Observable<Servidor> {
     // Omitir 'id' e campos de timestamp que são gerados pelo backend
    const { id: servidorId, createdAt, updatedAt, ...servidorData } = servidor;
    return this.http.patch<Servidor>(`${this.apiUrl}/${id}`, servidorData)
      .pipe(catchError(this.handleError));
  }

  deleteServidor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "Ocorreu um erro desconhecido!";
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro retornado pelo backend
      errorMessage = `Código do erro: ${error.status}\nMensagem: ${error.message}`;
      if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage += `\nDetalhes: ${Array.isArray(error.error.message) ? error.error.message.join(', ') : error.error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

