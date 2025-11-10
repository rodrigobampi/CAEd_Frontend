export interface Turma {
  id: number;
  nome: string;
}

export interface Disciplina {
  id: number;
  nome: string;
}

export interface Avaliacao {
  id: number;
  nome: string;
  peso: number;
  disciplinaId: number;
}

export interface Aluno {
  id: number;
  nome: string;
  matricula: string;
}

export interface NotaLancamento {
  id?: number;
  alunoId: number;
  avaliacaoId: number;
  nota: number | null;
}

export interface LancamentoNotasRequest {
  turmaId: number;
  disciplinaId: number;
  lancamentos: NotaLancamento[];
}

export interface BoletimAluno {
  aluno: Aluno;
  notas: { [avaliacaoId: number]: number | null };
  media: number | null;
}

export interface DadosBoletim {
  turma: Turma;
  disciplina: Disciplina;
  alunos: Aluno[];
  avaliacoes: Avaliacao[];
  lancamentos: BoletimAluno[];
}
