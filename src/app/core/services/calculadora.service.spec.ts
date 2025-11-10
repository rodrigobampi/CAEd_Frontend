import { TestBed } from '@angular/core/testing';
import { CalculadoraService } from './calculadora.service';

interface AvaliacaoTest {
  id: number;
  nome: string;
  peso: number;
  disciplinaId: number;
}

describe('CalculadoraService', () => {
  let service: CalculadoraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculadoraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate weighted average correctly', () => {
    const avaliacoes: AvaliacaoTest[] = [
      { id: 1, nome: 'Prova', peso: 5, disciplinaId: 1 },
      { id: 2, nome: 'Trabalho', peso: 3, disciplinaId: 1 }
    ];
    
    const notas = { 1: 8.0, 2: 6.0 };
    
    const media = service.calcularMediaPonderada(notas, avaliacoes);
    
    expect(media).toBe(7.25); // (8*5 + 6*3) / 8 = 7.25
  });

  it('should return null when no grades', () => {
    const avaliacoes: AvaliacaoTest[] = [
      { id: 1, nome: 'Prova', peso: 5, disciplinaId: 1 }
    ];
    
    const notas = {};
    
    const media = service.calcularMediaPonderada(notas, avaliacoes);
    
    expect(media).toBeNull();
  });
});