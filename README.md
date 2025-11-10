# CAEd Backend - Sistema de Boletim Escolar

Backend desenvolvido em Java 17 com Spring Boot 3.2.0 seguindo Clean Architecture.

## Características

* Clean Architecture com camadas bem definidas
* Domain-Driven Design (DDD)
* Banco H2 em memória com dados de seed
* API REST documentada com Swagger
* CORS configurado para Angular
* Validações robustas
* Testes unitários abrangentes

## Estrutura do Projeto

```
CAEd_Backend/
├── src/main/java/com/caed/boletim/
│   ├── application/
│   │   ├── dto/
│   │   └── usecase/
│   ├── domain/
│   │   ├── exception/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── service/
│   │   └── valueobject/
│   ├── infrastructure/
│   │   ├── config/
│   │   └── persistence/
│   │       ├── adapter/
│   │       ├── entity/
│   │       └── repository/
│   └── presentation/
│       └── rest/
│           └── controller/
├── src/test/java/com/caed/boletim/
│   ├── application/dto/
│   ├── domain/service/
│   └── domain/valueobject/
├── src/main/resources/
└── pom.xml
```

## Tecnologias

* Java 17
* Spring Boot 3.2.0
* Spring Data JPA
* H2 Database
* SpringDoc OpenAPI 3
* Maven
* JUnit 5
* Hibernate Validator

## Execução

### Opção 1: Eclipse
1. Importe o projeto no Eclipse como Maven Project
2. Execute a classe BoletimApplication em "..\src\main\java\com\caed\boletim"

### Opção 2: CMD
```cmd
cd CAEd_Backend
mvn spring-boot:run
```

### Opção 3: JAR
```cmd
cd CAEd_Backend
mvn clean package
java -jar target\caed-backend-1.0.0.jar
```

## Testes

### Executar todos os testes
```cmd
mvn test
```

### Executar testes específicos
```cmd
mvn test -Dtest=CalculadoraMediaServiceTest
mvn test -Dtest=LancamentoNotaRequestTest
mvn test -Dtest=NotaTest
```

### Cobertura de Testes
O projeto inclui testes unitários abrangentes:

* **CalculadoraMediaServiceTest** (10 testes) - Valida cálculos de média ponderada
* **LancamentoNotaRequestTest** (4 testes) - Testa validações de DTO
* **NotaTest** (7 testes) - Garante comportamento do Value Object Nota

**Total: 21 testes automatizados**

## Acesso

* **API**: http://localhost:8080/api/boletim
* **Swagger**: http://localhost:8080/swagger-ui.html
* **H2 Console**: http://localhost:8080/h2-console

## Acesso Segurança - Autenticacao e Controle de Acesso

Em um cenario real, implementaria autenticacao JWT com Spring Security, criando endpoints dedicados para login (/api/auth/login) e protegendo as rotas com autorizacao baseada em roles (PROFESSOR, COORDENADOR, ALUNO). O controle de acesso validaria se o usuario possui permissao para a turma/disciplina antes de permitir operacoes, garantindo que professores so acessem suas turmas e coordenadores tenham visao completa do sistema.


## Endpoints

* **GET /api/boletim/turmas** - Lista turmas
* **GET /api/boletim/disciplinas** - Lista disciplinas
* **GET /api/boletim/grid?turmaId=X&disciplinaId=Y** - Grid de notas
* **POST /api/boletim/lancar-notas** - Salva notas em lote

## Dados de Exemplo

O sistema inclui dados pré-carregados:
* 2 Turmas, 3 Disciplinas, 4 Alunos
* 5 Avaliações com pesos diferentes (1-5)
* Notas de exemplo para testes

## Regras de Negócio Implementadas

* Notas válidas entre 0.0 e 10.0
* Cálculo de média ponderada considerando pesos
* Lançamento em lote com validações
* Unique constraint por aluno e avaliação

## Desenvolvido por

Rodrigo Bampi - https://github.com/rodrigobampi

