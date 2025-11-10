import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BoletimService } from './boletim.service';

interface AvaliacaoTest {
  id: number;
  nome: string;
  peso: number;
  disciplinaId: number;
}

describe('BoletimService', () => {
  let service: BoletimService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BoletimService]
    });
    service = TestBed.inject(BoletimService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch turmas', () => {
    const mockTurmas = [{ id: 1, nome: 'Turma A' }];

    service.getTurmas().subscribe(turmas => {
      expect(turmas.length).toBe(1);
      expect(turmas[0].nome).toBe('Turma A');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/boletim/turmas');
    expect(req.request.method).toBe('GET');
    req.flush(mockTurmas);
  });

  it('should calculate media ponderada', () => {
    const avaliacoes: AvaliacaoTest[] = [
      { id: 1, nome: 'Prova', peso: 5, disciplinaId: 1 },
      { id: 2, nome: 'Trabalho', peso: 3, disciplinaId: 1 }
    ];
    
    const notas = { 1: 10.0, 2: 8.0 };
    
    const media = service.calcularMediaPonderada(notas, avaliacoes);
    
    expect(media).toBe(9.25); // (10*5 + 8*3) / 8 = 9.25
  });
});