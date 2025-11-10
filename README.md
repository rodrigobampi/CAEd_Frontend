# CAEd Frontend - Sistema de Boletim Escolar

Frontend desenvolvido em Angular 17 com Angular Material para o sistema de lancamento de notas.

## || Sobre o Projeto

Sistema web para lancamento de notas escolares com calculo automatico de media ponderada. Desenvolvido como parte do desafio tecnico para desenvolvedor Full Stack.

## ||| Tecnologias Utilizadas

- **Angular 17.3.0** - Framework principal
- **Angular Material 17.3.10** - Componentes de UI
- **TypeScript 5.4.2** - Tipagem estatica
- **RxJS 7.8.0** - Programacao reativa
- **Reactive Forms** - Formularios reativos

## ||| Arquitetura do Projeto

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       ├── api.service.ts          # Comunicacao HTTP
│   │       ├── calculadora.service.ts  # Calculo de medias
│   │       ├── constants.ts            # Constantes da aplicacao
│   │       └── mapper.service.ts       # Mapeamento de DTOs
│   ├── modules/
│   │   └── boletim/
│   │       ├── components/
│   │       │   └── boletim-lancamento/ # Componente principal
│   │       ├── models/
│   │       │   └── boletim.models.ts   # Interfaces TypeScript
│   │       └── services/
│   │           └── boletim.service.ts  # Logica de negocio
│   └── shared/                         # Componentes compartilhados
└── assets/                             # Recursos estaticos
```

## ||| Funcionalidades

### |||| Principais Features
- **Selecao de Turma e Disciplina** - Filtros dinamicos com dados do backend
- **Grid de Notas Editavel** - Tabela responsiva para lancamento de notas
- **Calculo em Tempo Real** - Media ponderada calculada instantaneamente
- **Validacao de Notas** - Restricao de 0 a 10 com feedback visual
- **Salvamento em Lote** - Todas as notas salvas com um unico clique
- **Feedback de Operacoes** - Loading, mensagens de sucesso e erro

### |||| Calculo de Media Ponderada
```
Media = (Σ nota × peso) ÷ (Σ pesos)
```

**Exemplo:**
- Prova: Peso 5 | Nota: 8.0 → 8.0 × 5 = 40
- Trabalho: Peso 3 | Nota: 7.0 → 7.0 × 3 = 21
- Atividade: Peso 1 | Nota: 10.0 → 10.0 × 1 = 10
- **Media:** (40 + 21 + 10) ÷ (5 + 3 + 1) = 71 ÷ 9 = 7.89

## ||| Instalacao e Execucao

### Pre-requisitos
- Node.js 18+ 
- npm ou yarn
- Angular CLI 17+

### Instalacao
```bash
# Clonar o repositorio
git clone <repositorio>
cd CAEd_Frontend

# Instalar dependencias
npm install

# Executar em modo desenvolvimento
ng serve

# Acessar a aplicacao
http://localhost:4200
```

### Comandos Uteis
```bash
# Desenvolvimento
ng serve

# Build de producao
ng build

# Executar testes
ng test

# Lint do codigo
ng lint
```

## ||| Integracao com Backend

## Acesso Segurança - Autenticacao e Controle de Acesso

Em um cenario real, a autenticacao seria delegada, seguindo o padrao OAuth 2.0 com OpenID Connect (OIDC). O Angular utilizaria uma biblioteca compativel (como angular-oauth2-oidc) para iniciar o fluxo de login no Servidor de Autorizacao.
Gerenciamento de Token: Um AuthService dedicado gerenciaria o ciclo de vida do Access Token (JWT), incluindo o armazenamento seguro e a verificacao de expiracao.
Controle de Rotas: Seriam implementados Angular Guards (CanActivate) para proteger as rotas, garantindo que o usuario esteja autenticado e possua as roles adequadas (PROFESSOR, COORDENADOR, ALUNO) para acessar modulos especificos.
Comunicacao Segura: Um HTTP Interceptor seria configurado para anexar automaticamente o JWT no cabecalho Authorization: Bearer de todas as requisicoes enviadas ao backend (Resource Server).
Controle de UI: A interface utilizaria as claims de role do JWT para renderizar elementos condicionalmente, exibindo apenas as funcionalidades permitidas para o perfil logado.


### Endpoints Consumidos
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | /api/boletim/turmas | Lista todas as turmas |
| GET | /api/boletim/disciplinas | Lista todas as disciplinas |
| GET | /api/boletim/grid | Busca dados do boletim |
| POST | /api/boletim/lancar-notas | Salva lancamentos em lote |

### Configuracao da API
```typescript
// constants.ts
export const Constants = {
  API: {
    BASE_URL: 'http://localhost:8080/api/boletim',
    ENDPOINTS: {
      TURMAS: 'turmas',
      DISCIPLINAS: 'disciplinas', 
      GRID: 'grid',
      LANCAMENTOS: 'lancar-notas'
    }
  }
};
```

## ||| Interface do Usuario

### Componentes Material Utilizados
- `MatTable` - Tabela de notas
- `MatFormField` + `MatInput` - Campos de entrada
- `MatSelect` - Selecao de turma/disciplina
- `MatButton` - Botoes de acao
- `MatProgressSpinner` - Indicador de loading
- `MatCard` - Cards informativos

### Fluxo de Uso
1. **Selecionar** turma e disciplina nos filtros
2. **Clicar em "Buscar"** para carregar os dados
3. **Preencher notas** nas celulas editaveis (0-10)
4. **Ver medias** calculadas automaticamente
5. **Clicar em "Salvar Lancamentos"** para persistir

## ||| Responsividade

A aplicacao e totalmente responsiva:
- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Layout adaptado com scroll horizontal
- **Mobile**: Interface otimizada para touch

## ||| Desenvolvimento

### Estrutura de Desenvolvimento
- **Modularidade**: Features organizadas em modulos
- **Lazy Loading**: Carregamento sob demanda de modulos
- **Services**: Logica de negocio centralizada
- **Models**: Tipagem TypeScript para dados

### Convencoes de Codigo
- **TypeScript**: Tipagem forte e interfaces
- **Reactive Programming**: Uso de Observables e Subjects
- **Component Composition**: Reutilizacao de componentes
- **Error Handling**: Tratamento consistente de erros

## ||| Deploy

### Build de Producao
```bash
ng build --configuration production
```

## ||| Contribuicao

### Padroes de Commit
```
feat: Nova funcionalidade
fix: Correcao de bug
docs: Documentacao
style: Formatacao de codigo
refactor: Refatoracao de codigo
test: Adicao de testes
```

## ||| Licenca

Distribuido sob a licenca MIT. Veja `LICENSE` para mais informacoes.

## ||| Desenvolvido por

**Rodrigo Bampi**  
- GitHub: [@rodrigobampi](https://github.com/rodrigobampi)

---

**Versao**: 1.0.0  
**Ultima atualizacao**: Novembro 2025