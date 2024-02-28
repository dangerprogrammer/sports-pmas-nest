export type Aluno = {
    nome_comp: string;
    email: string;
    tel: string;
    endereco: string;
    bairro: string;
    data_nasc: Date;
    sexo: 'FEMININO' | 'MASCULINO' | 'OUTRO';
    inscricao: 'NATACAO' | 'HIDRO';
    periodo: 'MANHA' | 'TARDE' | 'NOITE';
}

export type Professor = {
    nome_comp: string;
}