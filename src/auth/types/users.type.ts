export type User = {
    cpf: string;
    roles: Roles[];

    aluno?: Aluno;
    professor?: Professor;
    admin?: Admin;
}

export type User_Prisma = User & {
    id: number;
    createdAt: Date;
    updatedAt: Date;

    aluno?: Aluno_Prisma;
    professor?: Professor_Prisma;
    admin?: Admin_Prisma;
}

export type Aluno = {
    nome_comp: string;
    email: string;
    tel: string;
    endereco: string;
    bairro: string;
    data_nasc: Date;
    sexo: Gender;
    inscricoes: Inscricao[];
    periodos: Periodo[];
    atestados: Atestado[];
    menor?: AlunoMenor;
}

export type Aluno_Prisma = Aluno & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    user: User_Prisma;

    menor?: AlunoMenor_Prisma;
}

export type Atestado = {
    anexo: string;
    msg?: string;
}

export type Atestado_Prisma = Atestado & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    aluno: Aluno_Prisma;
}

export type AlunoMenor = {
    nomeResp1: string;
    cpfResp1: string;
    emailResp1: string;
    telResp1: string;

    nomeResp2?: string;
    cpfResp2?: string;
    emailResp2?: string;
    telResp2?: string;
}

export type AlunoMenor_Prisma = AlunoMenor & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    aluno: Aluno_Prisma;
}

export type Professor = {}

export type Professor_Prisma = Professor & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    user: User_Prisma;
}

export type Admin = {}

export type Admin_Prisma = Admin & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    user: User_Prisma;
}

export type Modalidade = {
    name: string;
    periodo: Periodo;
    alunos: Aluno[];
    vagas: number;
}

export type Modalidade_Prisma = Modalidade & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

export type Localidade = {
    endereco: string;
    bairro: string;
}

export type Localidade_Prisma = Localidade & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

export enum Periodo {
  MANHA = 'MANHA',
  TARDE = 'TARDE',
  NOITE = 'NOITE'
}

export enum Inscricao {
  NATACAO = 'NATACAO',
  HIDRO = 'HIDRO'
}

export enum Gender {
  FEMININO = 'FEMININO',
  MASCULINO = 'MASCULINO',
  OUTRO = 'OUTRO'
}

export enum Roles {
  ALUNO = 'ALUNO',
  PROFESSOR = 'PROFESSOR',
  ADMIN = 'ADMIN'
}