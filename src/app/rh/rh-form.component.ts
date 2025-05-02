// guardpro-frontend/src/app/rh/rh-form.component.ts
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatStepperModule } from "@angular/material/stepper";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox"; // <<< Importar MatCheckboxModule
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { RhService } from "./rh.service";
import { Servidor, Sexo, EstadoCivil, TipoServidor, RegimeTrabalho, StatusServidor, TipoSanguineo, FatorRh } from "./servidor.model";
import { ReplaceUnderscorePipe } from "../pipes/replace-underscore.pipe";

@Component({
  selector: "app-rh-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule, // <<< Adicionar MatCheckboxModule
    MatProgressBarModule,
    MatSnackBarModule,
    ReplaceUnderscorePipe
  ],
  templateUrl: "./rh-form.component.html", // <<< CORRIGIDO: Apontar para o template correto
  styleUrls: ["./rh-form.component.css"],
})
export class RhFormComponent implements OnInit {
  servidorForm: FormGroup;
  isEditMode = false;
  servidorId: number | null = null;
  isLoading = false;
  errorMessage = "";

  // Expor Enums para o template
  sexoOptions = Object.values(Sexo);
  estadoCivilOptions = Object.values(EstadoCivil);
  tipoServidorOptions = Object.values(TipoServidor);
  regimeTrabalhoOptions = Object.values(RegimeTrabalho);
  statusServidorOptions = Object.values(StatusServidor);
  tipoSanguineoOptions = Object.values(TipoSanguineo);
  fatorRhOptions = Object.values(FatorRh);
  ufOptions = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
  cnhCategorias = ["A", "B", "AB", "C", "D", "E", "AC", "AD", "AE"];

  constructor(
    private fb: FormBuilder,
    private rhService: RhService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
     this.servidorForm = this.fb.group({
      dadosPessoais: this.fb.group({
        nomeCompleto: ["", Validators.required],
        nomeSocial: [""],
        dataNascimento: ["", Validators.required],
        sexo: ["", Validators.required],
        estadoCivil: ["", Validators.required],
        nacionalidade: ["Brasileira", Validators.required],
        ufNascimento: [""],
        cidadeNascimento: [""],
        nomeMae: ["", Validators.required],
        nomePai: [""],
      }),
      documentos: this.fb.group({
        cpf: ["", [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
        rgNumero: ["", Validators.required],
        rgOrgaoEmissor: ["", Validators.required],
        rgDataEmissao: ["", Validators.required],
        tituloEleitorNumero: [""],
        tituloEleitorZona: [""],
        tituloEleitorSecao: [""],
        pisPasep: [""],
        cnhNumero: [""],
        cnhCategoria: [""],
        cnhValidade: [""],
      }),
      dadosFuncionais: this.fb.group({
        tipoServidor: ["", Validators.required],
        matricula: ["", Validators.required],
        cargo: ["", Validators.required],
        dataAdmissao: ["", Validators.required],
        regimeTrabalho: ["", Validators.required],
        cargaHorariaSemanal: ["", [Validators.required, Validators.min(1)]],
        lotacao: ["", Validators.required],
        status: [StatusServidor.ATIVO, Validators.required],
      }),
      contato: this.fb.group({
        emailPessoal: ["", [Validators.email]],
        emailInstitucional: ["", [Validators.required, Validators.email]],
        telefoneCelular: ["", Validators.required],
        telefoneResidencial: [""],
        telefoneRecado: [""],
      }),
      endereco: this.fb.group({
        cep: ["", [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
        logradouro: ["", Validators.required],
        numero: ["", Validators.required],
        complemento: [""],
        bairro: ["", Validators.required],
        cidade: ["", Validators.required],
        uf: ["", Validators.required],
      }),
      saude: this.fb.group({
        tipoSanguineo: [""],
        fatorRh: [""],
        possuiDeficiencia: [false],
        tipoDeficiencia: [""],
        observacoesDeficiencia: [""],
      }),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get("id");
      this.servidorId = idParam ? +idParam : null;
      if (this.servidorId) {
        this.isEditMode = true;
        this.loadServidorData(this.servidorId);
      } else {
        this.isEditMode = false;
      }
    });
  }

  loadServidorData(id: number): void {
    this.isLoading = true;
    this.rhService.getServidor(id).subscribe({
      next: (servidor) => {
        const formatToIsoDate = (dateString: string | undefined | null): string | null => {
          if (!dateString) return null;
          try {
            return new Date(dateString).toISOString().split("T")[0];
          } catch (e) {
            return null;
          }
        };

        this.servidorForm.patchValue({
          dadosPessoais: {
            nomeCompleto: servidor.nomeCompleto,
            nomeSocial: servidor.nomeSocial,
            dataNascimento: formatToIsoDate(servidor.dataNascimento),
            sexo: servidor.sexo,
            estadoCivil: servidor.estadoCivil,
            nacionalidade: servidor.nacionalidade,
            ufNascimento: servidor.ufNascimento,
            cidadeNascimento: servidor.cidadeNascimento,
            nomeMae: servidor.nomeMae,
            nomePai: servidor.nomePai,
          },
          documentos: {
            cpf: servidor.cpf,
            rgNumero: servidor.rgNumero,
            rgOrgaoEmissor: servidor.rgOrgaoEmissor,
            rgDataEmissao: formatToIsoDate(servidor.rgDataEmissao),
            tituloEleitorNumero: servidor.tituloEleitorNumero,
            tituloEleitorZona: servidor.tituloEleitorZona,
            tituloEleitorSecao: servidor.tituloEleitorSecao,
            pisPasep: servidor.pisPasep,
            cnhNumero: servidor.cnhNumero,
            cnhCategoria: servidor.cnhCategoria,
            cnhValidade: formatToIsoDate(servidor.cnhValidade),
          },
          dadosFuncionais: {
            tipoServidor: servidor.tipoServidor,
            matricula: servidor.matricula,
            cargo: servidor.cargo,
            dataAdmissao: formatToIsoDate(servidor.dataAdmissao),
            regimeTrabalho: servidor.regimeTrabalho,
            cargaHorariaSemanal: servidor.cargaHorariaSemanal,
            lotacao: servidor.lotacao,
            status: servidor.status,
          },
          contato: {
            emailPessoal: servidor.emailPessoal,
            emailInstitucional: servidor.emailInstitucional,
            telefoneCelular: servidor.telefoneCelular,
            telefoneResidencial: servidor.telefoneResidencial,
            telefoneRecado: servidor.telefoneRecado,
          },
          endereco: {
            cep: servidor.cep,
            logradouro: servidor.logradouro,
            numero: servidor.numero,
            complemento: servidor.complemento,
            bairro: servidor.bairro,
            cidade: servidor.cidade,
            uf: servidor.uf,
          },
          saude: {
            tipoSanguineo: servidor.tipoSanguineo,
            fatorRh: servidor.fatorRh,
            possuiDeficiencia: servidor.possuiDeficiencia,
            tipoDeficiencia: servidor.tipoDeficiencia,
            observacoesDeficiencia: servidor.observacoesDeficiencia,
          },
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = `Erro ao carregar dados do servidor: ${err.message}`;
        this.snackBar.open(this.errorMessage, "Fechar", { duration: 5000 });
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.servidorForm.invalid) {
      this.snackBar.open("Por favor, preencha todos os campos obrigatórios corretamente.", "Fechar", { duration: 3000 });
      this.servidorForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.servidorForm.getRawValue();

    const servidorData: any = {
      ...(this.isEditMode && this.servidorId ? { id: this.servidorId } : {}),
      ...formValue // <<< CORRIGIDO: Enviar a estrutura aninhada diretamente
    };

    const operation = this.isEditMode && this.servidorId
      ? this.rhService.updateServidor(this.servidorId, servidorData)
      : this.rhService.addServidor(servidorData);

    operation.subscribe({
      next: () => {
        this.snackBar.open(`Servidor ${this.isEditMode ? "atualizado" : "adicionado"} com sucesso!`, "OK", { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(["/rh"]);
      },
      error: (err) => {
        this.errorMessage = `Erro ao ${this.isEditMode ? "atualizar" : "adicionar"} servidor: ${err.message}`;
        this.snackBar.open(this.errorMessage, "Fechar", { duration: 5000 });
        this.isLoading = false;
      },
    });
  }

  getControl(groupName: string, controlName: string): AbstractControl | null {
    return this.servidorForm.get(groupName)?.get(controlName) ?? null;
  }

  getFormGroup(groupName: string): FormGroup {
    return this.servidorForm.get(groupName) as FormGroup;
  }

  cancel(): void {
    this.router.navigate(["/rh"]);
  }
}

