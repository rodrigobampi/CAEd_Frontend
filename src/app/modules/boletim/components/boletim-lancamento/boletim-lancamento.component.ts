import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BoletimService } from '../../services/boletim.service';
import { 
  Turma, 
  Disciplina, 
  DadosBoletim, 
  BoletimAluno, 
  Avaliacao,
  LancamentoNotasRequest,
  NotaLancamento
} from '../../models/boletim.models';

@Component({
  selector: 'app-boletim-lancamento',
  templateUrl: './boletim-lancamento.component.html',
  styleUrls: ['./boletim-lancamento.component.css']
})
export class BoletimLancamentoComponent implements OnInit {
  turmas: Turma[] = [];
  disciplinas: Disciplina[] = [];
  dadosBoletim: DadosBoletim | null = null;
  carregando = false;
  salvando = false;
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;

  filtroForm: FormGroup;
  notasForm: FormGroup;

  constructor(
    private boletimService: BoletimService,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      turmaId: ['', Validators.required],
      disciplinaId: ['', Validators.required]
    });

    this.notasForm = this.fb.group({
      lancamentos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.carregarTurmasEDisciplinas();

    this.boletimService.dadosBoletim$.subscribe(dados => {
      this.dadosBoletim = dados;
      console.log('Dados recebidos no componente:', dados);
      console.log('Número de alunos:', dados?.alunos?.length);
      console.log('Número de avaliações:', dados?.avaliacoes?.length);
      console.log('Colunas da tabela:', this.getColunasTabela());
      
      this.inicializarFormularioNotas();
    });
  }

  carregarTurmasEDisciplinas(): void {
    this.carregando = true;
    
    this.boletimService.getTurmas().subscribe({
      next: (turmas) => {
        this.turmas = turmas;
        this.boletimService.getDisciplinas().subscribe({
          next: (disciplinas) => {
            this.disciplinas = disciplinas;
            this.carregando = false;
          },
          error: (error) => {
            this.mensagemErro = 'Erro ao carregar disciplinas';
            this.carregando = false;
            console.error('Erro:', error);
          }
        });
      },
      error: (error) => {
        this.mensagemErro = 'Erro ao carregar turmas';
        this.carregando = false;
        console.error('Erro:', error);
      }
    });
  }

  buscarDadosBoletim(): void {
    if (this.filtroForm.valid && !this.carregando) {
      this.carregando = true;
      this.mensagemErro = null;
      this.mensagemSucesso = null;

      const { turmaId, disciplinaId } = this.filtroForm.value;

      this.boletimService.getDadosBoletim(turmaId, disciplinaId).subscribe({
        next: (dados) => {
          this.boletimService.atualizarDadosLocais(dados);
          this.carregando = false;
        },
        error: (error) => {
          this.mensagemErro = 'Erro ao carregar dados do boletim';
          this.carregando = false;
          console.error('Erro:', error);
        }
      });
    }
  }

  inicializarFormularioNotas(): void {
    const lancamentosArray = this.notasForm.get('lancamentos') as FormArray;
    lancamentosArray.clear();

    if (!this.dadosBoletim) return;

    this.dadosBoletim.lancamentos.forEach(alunoBoletim => {
      const alunoGroup = this.fb.group({});
      
      this.dadosBoletim!.avaliacoes.forEach(avaliacao => {
        const nota = alunoBoletim.notas[avaliacao.id] || null;
        alunoGroup.addControl(
          `avaliacao_${avaliacao.id}`,
          this.fb.control(nota, [
            Validators.min(0),
            Validators.max(10),
            Validators.pattern(/^\d*\.?\d*$/)
          ])
        );
      });

      lancamentosArray.push(alunoGroup);
    });
  }

  get lancamentosArray(): FormArray {
    return this.notasForm.get('lancamentos') as FormArray;
  }

  getAlunoPorIndice(index: number): BoletimAluno | null {
    return this.dadosBoletim?.lancamentos[index] || null;
  }

  getAvaliacoes(): Avaliacao[] {
    return this.dadosBoletim?.avaliacoes || [];
  }

  getColunasTabela(): string[] {
    const colunas = ['aluno'];
    console.log('Gerando colunas da tabela...');

    if (this.dadosBoletim) {
      console.log('Avaliações disponíveis:', this.dadosBoletim.avaliacoes);
      
      this.dadosBoletim.avaliacoes.forEach(avaliacao => {
        const coluna = `avaliacao_${avaliacao.id}`;
        console.log(`Adicionando coluna: ${coluna}`);
        colunas.push(coluna);
      });
    }

    colunas.push('media');
    console.log('Colunas finais:', colunas);
    return colunas;
  }

  calcularMediaAluno(index: number): number | null {
    const alunoBoletim = this.getAlunoPorIndice(index);
    if (!alunoBoletim || !this.dadosBoletim) return null;

    const notasAtualizadas: { [avaliacaoId: number]: number | null } = { ...alunoBoletim.notas };
    
    const alunoForm = this.lancamentosArray.at(index);
    this.dadosBoletim.avaliacoes.forEach(avaliacao => {
      const controlName = `avaliacao_${avaliacao.id}`;
      const valor = alunoForm.get(controlName)?.value;
      
      if (valor !== null && valor !== undefined && valor !== '') {
        const nota = parseFloat(valor);
        notasAtualizadas[avaliacao.id] = !isNaN(nota) ? nota : null;
      } else {
        notasAtualizadas[avaliacao.id] = null;
      }
    });

    return this.boletimService.calcularMediaPonderada(notasAtualizadas, this.dadosBoletim.avaliacoes);
  }

  atualizarMediaEmTempoReal(): void {
    if (this.dadosBoletim) {
      this.dadosBoletim.lancamentos.forEach((_, index) => {
        const media = this.calcularMediaAluno(index);
        if (this.dadosBoletim && this.dadosBoletim.lancamentos[index]) {
          this.dadosBoletim.lancamentos[index].media = media;
        }
      });
    }
  }

  onNotaChange(alunoIndex: number, avaliacaoId: number, event: any): void {
    const valor = event.target.value;
    
    if (valor && (valor < 0 || valor > 10)) {
      event.target.value = '';
    }
    
    // Atualizar média em tempo real
    setTimeout(() => {
      this.atualizarMediaEmTempoReal();
    }, 100);
  }

  salvarLancamentos(): void {
    if (this.notasForm.valid && this.dadosBoletim && this.filtroForm.valid) {
      this.salvando = true;
      this.mensagemErro = null;
      this.mensagemSucesso = null;

      const { turmaId, disciplinaId } = this.filtroForm.value;
      const lancamentos: NotaLancamento[] = [];

      console.log('Coletando dados do formulário...');

      this.lancamentosArray.controls.forEach((alunoForm, alunoIndex) => {
        const aluno = this.dadosBoletim!.lancamentos[alunoIndex].aluno;
        console.log(`👤 Processando aluno: ${aluno.nome}`);

        this.dadosBoletim!.avaliacoes.forEach(avaliacao => {
          const controlName = `avaliacao_${avaliacao.id}`;
          const notaValue = alunoForm.get(controlName)?.value;

          if (notaValue !== null && notaValue !== '' && notaValue !== undefined) {
            const nota = parseFloat(notaValue);
            if (!isNaN(nota)) {
              console.log(`   ${avaliacao.nome}: ${nota}`);
              lancamentos.push({
                alunoId: aluno.id,
                avaliacaoId: avaliacao.id,
                nota: nota
              });
            }
          }
        });
      });

      console.log('Total de lançamentos a salvar:', lancamentos.length);
      console.log('Dados coletados:', lancamentos);
      
      const request: LancamentoNotasRequest = {
        turmaId,
        disciplinaId,
        lancamentos
      };

      console.log('Enviando para o backend:', request);

      this.boletimService.salvarLancamentos(request).subscribe({
        next: (response) => {
          console.log('Salvamento concluído com sucesso!', response);
          this.mensagemSucesso = 'Lançamentos salvos com sucesso!';
          this.salvando = false;
          
          // Recarregar os dados para mostrar as notas atualizadas
          setTimeout(() => {
            this.buscarDadosBoletim(); // Recarregar dados
            setTimeout(() => {
              this.mensagemSucesso = null;
            }, 2000);
          }, 2000);
        },
        error: (error) => {
          console.error('Erro no salvamento:', error);
          console.error('Status:', error.status);
          console.error('Mensagem:', error.message);
          console.error('Detalhes:', error.error);
          
          this.mensagemErro = error.error?.message || 'Erro ao salvar lançamentos. Tente novamente.';
          this.salvando = false;
        },
        complete: () => {
          console.log('Requisição de salvamento finalizada');
        }
      });
    } else {
      console.warn('Formulário inválido para salvar');
      console.warn('Estado do formulário:', {
        notasFormValido: this.notasForm.valid,
        dadosBoletim: !!this.dadosBoletim,
        filtroFormValido: this.filtroForm.valid
      });
      this.mensagemErro = 'Formulário inválido. Verifique os dados.';
    }
  }  

  limparMensagens(): void {
    this.mensagemErro = null;
    this.mensagemSucesso = null;
  }
}