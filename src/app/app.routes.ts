import { Routes } from '@angular/router';
import { MorajaiBox } from './projects/morajai-box/morajai-box';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'morajai'},
    { path: 'morajai', component: MorajaiBox }
];
