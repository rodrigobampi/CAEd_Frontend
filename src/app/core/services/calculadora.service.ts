import { Injectable } from '@angular/core';

interface Avaliacao {
  id: number;
  nome: string;
  peso: number;
  disciplinaId: number;
}

@Injectable({ providedIn: 'root' })
export class CalculadoraService {
  
  calcularMediaPonderada(notas: { [avaliacaoId: number]: number | null }, avaliacoes: Avaliacao[]): number | null {
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

    return temNota && somaPesos > 0 ? Number((somaNotasPesos / somaPesos).toFixed(2)) : null;
  }
}