import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  Turma,
  Disciplina,
  DadosBoletim,
  LancamentoNotasRequest,
  Aluno,
  Avaliacao,
  NotaLancamento
} from '../models/boletim.models';

interface AvaliacaoLocal {
  id: number;
  nome: string;
  peso: number;
  disciplinaId: number;
}

@Injectable({
  providedIn: 'root'
})
export class BoletimService {
  private apiUrl = 'http://localhost:8080/api/boletim';

  private dadosBoletimSubject = new BehaviorSubject<DadosBoletim | null>(null);
  public dadosBoletim$ = this.dadosBoletimSubject.asObservable();

  constructor(private http: HttpClient) {}

  getTurmas(): Observable<Turma[]> {
    console.log('Fazendo requisição para:', `${this.apiUrl}/turmas`);
    
    return this.http.get<any[]>(`${this.apiUrl}/turmas`).pipe(
      tap(response => {
        console.log('Resposta do backend (turmas):', response);
      }),
      map(turmas => {
        const turmasMapeadas = turmas.map(t => ({
          id: t.id,
          nome: t.nome
        }));
        console.log('Turmas mapeadas:', turmasMapeadas);
        return turmasMapeadas;
      }),
      tap({
        error: (error) => {
          console.error('Erro ao carregar turmas:', error);
          console.error('Detalhes do erro:', error.status, error.statusText, error.message);
        }
      })
    );
  }

  getDisciplinas(): Observable<Disciplina[]> {
    return this.http.get<any[]>(`${this.apiUrl}/disciplinas`).pipe(
      map(disciplinas => disciplinas.map(d => ({
        id: d.id,
        nome: d.nome
      })))
    );
  }

  getDadosBoletim(turmaId: number, disciplinaId: number): Observable<DadosBoletim> {
    console.log('Buscando grid para turma:', turmaId, 'disciplina:', disciplinaId);
    
    const url = `${this.apiUrl}/grid?turmaId=${turmaId}&disciplinaId=${disciplinaId}`;
    console.log('URL completa:', url);
    
    return this.http.get<any>(url).pipe(
      tap(response => {
        console.log('Resposta RAW do backend (grid):', response);
        console.log('Avaliações na resposta:', response?.avaliacoes);
        console.log('Alunos na resposta:', response?.alunos);
      }),
      map(response => {
        const dadosMapeados = this.mapearResponseParaDadosBoletim(response);
        console.log('Dados mapeados para frontend:', dadosMapeados);
        return dadosMapeados;
      }),
      tap({
        error: (error) => {
          console.error('Erro ao carregar grid:', error);
          console.error('Status:', error.status, error.message);
        }
      })
    );
  }

  salvarLancamentos(request: LancamentoNotasRequest): Observable<any> {
    const lancamentosFormatados = this.converterParaLancamentoRequest(request);
    return this.http.post(`${this.apiUrl}/lancar-notas`, lancamentosFormatados);
  }

  atualizarDadosLocais(dados: DadosBoletim): void {
    this.dadosBoletimSubject.next(dados);
  }

  calcularMediaPonderada(notas: { [avaliacaoId: number]: number | null }, avaliacoes: AvaliacaoLocal[]): number | null {
    let somaNotasPesos = 0;
    let somaPesos = 0;
    let temNota = false;

    avaliacoes.forEach(avaliacao => {
      const nota = notas[avaliacao.id];
      if (nota !== null && nota !== undefined && !isNaN(nota)) {
        somaNotasPesos += nota * avaliacao.peso;
        somaPesos += avaliacao.peso;
        temNota = true;
      }
    });

    if (!temNota || somaPesos === 0) {
      return null;
    }

    const media = somaNotasPesos / somaPesos;
    return Math.round(media * 100) / 100;
  }

  private mapearResponseParaDadosBoletim(response: any): DadosBoletim {
    console.log('Iniciando mapeamento do response...');
    
    if (!response) {
      console.error('Response é null ou undefined!');
      throw new Error('Resposta do servidor vazia');
    }

    // Mapear turma
    const turma: Turma = {
      id: response.turmaId,
      nome: response.turmaNome
    };
    console.log('Turma mapeada:', turma);

    // Mapear disciplina
    const disciplina: Disciplina = {
      id: response.disciplinaId,
      nome: response.disciplinaNome
    };
    console.log('📚 Disciplina mapeada:', disciplina);

    // Mapear avaliações
    const avaliacoes: Avaliacao[] = (response.avaliacoes || []).map((av: any) => ({
      id: av.id,
      nome: av.nome,
      peso: av.peso,
      disciplinaId: response.disciplinaId
    }));
    console.log('📝 Avaliações mapeadas:', avaliacoes);

    // Mapear alunos e lançamentos
    const lancamentos = (response.alunos || []).map((alunoResp: any, index: number) => {
      console.log(`Processando aluno ${index + 1}:`, alunoResp);
      
      const aluno: Aluno = {
        id: alunoResp.alunoId,
        nome: alunoResp.alunoNome,
        matricula: `MAT${alunoResp.alunoId}` // Placeholder
      };

      // Mapear notas
      const notas: { [avaliacaoId: number]: number | null } = {};
      avaliacoes.forEach(avaliacao => {
        const nota = alunoResp.notasPorAvaliacao?.[avaliacao.id];
        notas[avaliacao.id] = nota !== undefined && nota !== null ? Number(nota) : null;
      });
      
      console.log(`   Notas do aluno ${aluno.nome}:`, notas);

      const media = this.calcularMediaPonderada(notas, avaliacoes);
      console.log(`   Média calculada:`, media);

      return {
        aluno,
        notas,
        media
      };
    });

    const resultado = {
      turma,
      disciplina,
      alunos: lancamentos.map((l: any) => l.aluno),
      avaliacoes,
      lancamentos
    };

    console.log('Mapeamento finalizado:', resultado);
    return resultado;
  }

  private converterParaLancamentoRequest(request: LancamentoNotasRequest): any[] {
    const lancamentos: any[] = [];

    request.lancamentos.forEach(lancamento => {
      if (lancamento.nota !== null && lancamento.nota !== undefined) {
        lancamentos.push({
          alunoId: lancamento.alunoId,
          avaliacaoId: lancamento.avaliacaoId,
          nota: lancamento.nota
        });
      }
    });

    return lancamentos;
  }
  
}