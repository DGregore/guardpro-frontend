// guardpro-frontend/src/app/app.routes.ts
import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RhListComponent } from "./rh/rh-list.component"; // Import List Component
import { RhFormComponent } from "./rh/rh-form.component"; // Import Form Component
import { authGuard } from "./auth.guard"; // Import Auth Guard

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: "rh", // Rota principal para RH
    canActivate: [authGuard], // Protege a rota principal e filhas
    children: [
      {
        path: "", // Caminho vazio para /rh -> Lista
        component: RhListComponent,
        pathMatch: "full", // Garante que só /rh vá para a lista
      },
      {
        path: "novo", // Rota para /rh/novo -> Formulário de criação
        component: RhFormComponent,
      },
      {
        path: "editar/:id", // Rota para /rh/editar/123 -> Formulário de edição
        component: RhFormComponent,
      },
      // Adicione outras rotas filhas do RH aqui se necessário
    ],
  },
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "**", redirectTo: "/login" }, // Rota curinga para páginas não encontradas
];

