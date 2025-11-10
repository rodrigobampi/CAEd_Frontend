import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'boletim',
    loadChildren: () => import('./modules/boletim/boletim.module').then(m => m.BoletimModule)
  },
  { path: '', redirectTo: '/boletim', pathMatch: 'full' }
];