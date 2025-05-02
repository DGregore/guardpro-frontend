import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

// Importando o módulo de animações necessário para o Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Importando os módulos do Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

// Importando o HttpClientModule para fazer requisições HTTP
import { HttpClientModule } from '@angular/common/http';

// Importando o módulo de formulários reativos
import { ReactiveFormsModule } from '@angular/forms';

// Para usar o bootstrapApplication (standalone components)
import { bootstrapApplication } from '@angular/platform-browser';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,  // Necessário para o Angular Material
    MatButtonModule,          // Módulo de Botões
    MatInputModule,           // Módulo de Inputs
    MatIconModule,            // Módulo de Ícones
    MatToolbarModule,         // Módulo de Toolbar
    MatFormFieldModule,       // Módulo de Campos de Formulário
    MatCardModule,            // Módulo de Cartões
    HttpClientModule,         // Para realizar requisições HTTP
    ReactiveFormsModule       // Para usar formulários reativos no Angular
  ],
  providers: [],
})
export class AppModule { }

// Substituindo o bootstrap tradicional pela função bootstrapApplication
bootstrapApplication(AppComponent);
