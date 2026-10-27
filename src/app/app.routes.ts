import { Routes } from '@angular/router';
import { InscripcionTallerComponent } from './components/inscripcion-taller/inscripcion-taller.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inscripciones', pathMatch: 'full' },
  { path: 'inscripciones', component: InscripcionTallerComponent, title: 'Inscripción a Talleres' },
  // Si tenías rutas de libros/tareas, súmalas aquí arriba de la ruta comodín.
  { path: '**', redirectTo: 'inscripciones' },
];
