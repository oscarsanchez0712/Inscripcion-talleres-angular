import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Inscripcion, NuevaInscripcion } from '../models/inscripcion.model';

@Injectable({ providedIn: 'root' })
export class InscripcionService {
  // Datos en memoria (se reinician al recargar la página)
  private readonly datos$ = new BehaviorSubject<Inscripcion[]>([
    {
      id: 1,
      nombres: 'Lucía',
      apellidos: 'Ramírez Torres',
      dni: '71234567',
      email: 'lucia.ramirez@correo.com',
      telefono: '987654321',
      fechaNacimiento: '2002-05-14',
      taller: 'angular',
      modalidad: 'presencial',
      nivel: 'basico',
      acompanantes: [],
      comentarios: 'Quiero reforzar formularios reactivos.',
      fechaRegistro: new Date().toISOString(),
    },
    {
      id: 2,
      nombres: 'Carlos',
      apellidos: 'Mendoza Quispe',
      dni: '45678912',
      email: 'carlos.mendoza@correo.com',
      telefono: '912345678',
      fechaNacimiento: '1999-11-02',
      taller: 'docker',
      modalidad: 'virtual',
      nivel: 'intermedio',
      acompanantes: [{ nombre: 'Rosa Mendoza', dni: '40123456' }],
      comentarios: '',
      fechaRegistro: new Date().toISOString(),
    },
  ]);

  private siguienteId = 3;

  readonly inscripciones$: Observable<Inscripcion[]> = this.datos$.asObservable();

  agregar(nueva: NuevaInscripcion): Inscripcion {
    const registro: Inscripcion = {
      ...nueva,
      id: this.siguienteId++,
      fechaRegistro: new Date().toISOString(),
    };
    this.datos$.next([registro, ...this.datos$.value]);
    return registro;
  }

  actualizar(id: number, cambios: NuevaInscripcion): void {
    this.datos$.next(
      this.datos$.value.map((i) => (i.id === id ? { ...i, ...cambios } : i))
    );
  }

  eliminar(id: number): void {
    this.datos$.next(this.datos$.value.filter((i) => i.id !== id));
  }

  /** Simula una consulta al servidor para validar que el DNI no esté repetido. */
  dniExiste(dni: string, excluirId: number | null = null): Observable<boolean> {
    return of(this.datos$.value).pipe(
      delay(400),
      map((lista) => lista.some((i) => i.dni === dni && i.id !== excluirId))
    );
  }
}
