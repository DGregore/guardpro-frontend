// guardpro-frontend/src/app/rh/rh-list.component.ts
import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { RhService } from "./rh.service";
import { Servidor } from "./servidor.model";
import { ReplaceUnderscorePipe } from "../pipes/replace-underscore.pipe";
// import { ConfirmationDialogComponent } from "../shared/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "app-rh-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    ReplaceUnderscorePipe
  ],
  templateUrl: "./rh-list.component.html", // <<< Garantindo que aponta para o HTML correto
  styleUrls: ["./rh-list.component.css"],
})
export class RhListComponent implements OnInit {
  displayedColumns: string[] = ["matricula", "nomeCompleto", "cargo", "status", "acoes"];
  dataSource: MatTableDataSource<Partial<Servidor>> = new MatTableDataSource();
  isLoading = false;
  errorMessage = "";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private rhService: RhService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadServidores();
  }

  loadServidores(): void {
    this.isLoading = true;
    this.errorMessage = "";
    this.rhService.getServidores().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        // Usar setTimeout para garantir que Paginator e Sort estejam disponíveis após o carregamento dos dados
        setTimeout(() => {
           if (this.paginator) {
             this.dataSource.paginator = this.paginator;
           }
           if (this.sort) {
             this.dataSource.sort = this.sort;
           }
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = `Erro ao carregar servidores: ${err.message}`;
        this.snackBar.open(this.errorMessage, "Fechar", { duration: 5000 });
        this.isLoading = false;
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  navigateToNovo(): void {
    this.router.navigate(["/rh/novo"]);
  }

  editServidor(id: number): void {
    this.router.navigate(["/rh/editar", id]);
  }

  deleteServidor(id: number): void {
    // Implementar diálogo de confirmação aqui (recomendado)
    /*
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: "Tem certeza que deseja excluir este servidor?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
         // Lógica de exclusão
      }
    });
    */

    // Exclusão direta (sem confirmação)
     this.isLoading = true;
     this.rhService.deleteServidor(id).subscribe({
       next: () => {
         this.snackBar.open("Servidor excluído com sucesso!", "OK", { duration: 3000 });
         this.loadServidores(); // Recarrega a lista após exclusão
         this.isLoading = false;
       },
       error: (err) => {
         this.errorMessage = `Erro ao excluir servidor: ${err.message}`;
         this.snackBar.open(this.errorMessage, "Fechar", { duration: 5000 });
         this.isLoading = false;
       }
     });
  }
}

