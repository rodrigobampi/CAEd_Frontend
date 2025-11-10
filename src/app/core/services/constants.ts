import { HttpHeaders } from '@angular/common/http';

export const Constants = {
  API: {
    BASE_URL: 'http://localhost:8080/api/boletim',
    ENDPOINTS: {
      TURMAS: 'turmas',
      DISCIPLINAS: 'disciplinas', 
      GRID: 'grid',
      LANCAMENTOS: 'lancar-notas'
    }
  },
  VALIDATION: {
    NOTA_MIN: 0,
    NOTA_MAX: 10
  }
};
