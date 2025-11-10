import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoletimLancamentoComponent } from './components/boletim-lancamento/boletim-lancamento.component';

const routes: Routes = [
  { path: '', component: BoletimLancamentoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoletimRoutingModule { }
