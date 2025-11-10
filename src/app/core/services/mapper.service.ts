import { Injectable } from '@angular/core';
import { Turma, Disciplina, Avaliacao, Aluno, DadosBoletim, BoletimAluno } from '../../../modules/boletim/models/boletim.models';

@Injectable({ providedIn: 'root' })
export class MapperService {

  mapearParaDadosBoletim(response: any): DadosBoletim {
    const turma: Turma = { id: response.turmaId, nome: response.turmaNome };
    const disciplina: Disciplina = { id: response.disciplinaId, nome: response.disciplinaNome };
    
    const avaliacoes: Avaliacao[] = (response.avaliacoes || []).map((av: any) => ({
      id: av.id, nome: av.nome, peso: av.peso, disciplinaId: response.disciplinaId
    }));

    const alunos: Aluno[] = (response.alunos || []).map((alunoResp: any) => ({
      id: alunoResp.alunoId, nome: alunoResp.alunoNome, matricula: `MAT${alunoResp.alunoId}`
    }));

    const lancamentos: BoletimAluno[] = (response.alunos || []).map((alunoResp: any, index: number) => {
      const aluno = alunos[index];
      const notas: { [avaliacaoId: number]: number | null } = {};
      
      avaliacoes.forEach(avaliacao => {
        const nota = alunoResp.notasPorAvaliacao?.[avaliacao.id];
        notas[avaliacao.id] = nota !== undefined && nota !== null ? Number(nota) : null;
      });

      return { aluno, notas, media: alunoResp.mediaPonderada || null };
    });

    return { turma, disciplina, alunos, avaliacoes, lancamentos };
  }
}