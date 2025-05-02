// guardpro-frontend/src/app/rh/servidor.model.ts

// Enums (copiados/adaptados do schema.prisma para uso no frontend)
export enum Sexo {
    MASCULINO = "MASCULINO",
    FEMININO = "FEMININO",
    OUTRO = "OUTRO",
  }
  
  export enum EstadoCivil {
    SOLTEIRO = "SOLTEIRO",
    CASADO = "CASADO",
    DIVORCIADO = "DIVORCIADO",
    VIUVO = "VIUVO",
    UNIAO_ESTAVEL = "UNIAO_ESTAVEL",
  }
  
  export enum TipoServidor {
    EFETIVO = "EFETIVO",
    COMISSIONADO = "COMISSIONADO",
    CONTRATADO = "CONTRATADO",
    ESTAGIARIO = "ESTAGIARIO",
  }
  
  export enum RegimeTrabalho {
    CLT = "CLT",
    ESTATUTARIO = "ESTATUTARIO",
  }
  
  export enum StatusServidor {
    ATIVO = "ATIVO",
    INATIVO = "INATIVO",
    AFASTADO = "AFASTADO",
    FERIAS = "FERIAS",
    LICENCA = "LICENCA",
  }
  
  export enum TipoSanguineo {
    A = "A",
    B = "B",
    AB = "AB",
    O = "O",
  }
  
  export enum FatorRh {
    POSITIVO = "POSITIVO",
    NEGATIVO = "NEGATIVO",
  }
  
  // Interface Servidor (espelhando o modelo Prisma)
  export interface Servidor {
    id: number;
    // Dados Pessoais
    nomeCompleto: string;
    nomeSocial?: string | null;
    dataNascimento: string; // Usar string para data no DTO/interface, converter no backend/componente
    sexo: Sexo;
    estadoCivil: EstadoCivil;
    nacionalidade: string;
    ufNascimento?: string | null;
    cidadeNascimento?: string | null;
    nomeMae: string;
    nomePai?: string | null;
    // Documentos
    cpf: string;
    rgNumero: string;
    rgOrgaoEmissor: string;
    rgDataEmissao: string;
    tituloEleitorNumero?: string | null;
    tituloEleitorZona?: string | null;
    tituloEleitorSecao?: string | null;
    pisPasep?: string | null;
    cnhNumero?: string | null;
    cnhCategoria?: string | null;
    cnhValidade?: string | null;
    // Dados Funcionais
    tipoServidor: TipoServidor;
    matricula: string;
    cargo: string;
    dataAdmissao: string;
    regimeTrabalho: RegimeTrabalho;
    cargaHorariaSemanal: number;
    lotacao: string;
    status: StatusServidor;
    // Contato
    emailPessoal?: string | null;
    emailInstitucional: string;
    telefoneCelular: string;
    telefoneResidencial?: string | null;
    telefoneRecado?: string | null;
    // Endereço
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string | null;
    bairro: string;
    cidade: string;
    uf: string;
    // Saúde
    tipoSanguineo?: TipoSanguineo | null;
    fatorRh?: FatorRh | null;
    possuiDeficiencia?: boolean | null;
    tipoDeficiencia?: string | null;
    observacoesDeficiencia?: string | null;
  
    // Timestamps (geralmente não enviados do frontend, mas podem vir do backend)
    createdAt?: string;
    updatedAt?: string;
  }
  
  