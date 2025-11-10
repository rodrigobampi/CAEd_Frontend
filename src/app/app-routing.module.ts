import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'boletim',
    loadChildren: () => import('./modules/boletim/boletim.module').then(m => m.BoletimModule)
  },
  { path: '', redirectTo: '/boletim', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }