import { Routes } from '@angular/router';
import{ LoginComponent } from './pages/login/login'
import{ MascotasComponent } from './pages/mascotas/mascotas'
import{ RegistroMascotaComponent } from './pages/registro-mascota/registro-mascota'

export const routes: Routes = [

{ path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'mascotas', component: MascotasComponent },
  { path: 'registro', component: RegistroMascotaComponent },
  { path: '**', redirectTo: 'login' }
];
