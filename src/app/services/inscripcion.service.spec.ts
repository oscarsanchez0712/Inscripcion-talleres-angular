import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { InscripcionService } from './inscripcion.service';

describe('InscripcionService', () => {
  let service: InscripcionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InscripcionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('agrega, actualiza y elimina inscripciones', async () => {
    const base = {
      nombres: 'Ana', apellidos: 'Pérez', dni: '12345678', email: 'ana@correo.com', telefono: '999888777',
      fechaNacimiento: '2000-01-01', taller: 'git', modalidad: 'virtual' as const, nivel: 'basico' as const,
      acompanantes: [], comentarios: '',
    };
    const creada = service.agregar(base);
    let lista = await firstValueFrom(service.inscripciones$);
    expect(lista.some((i) => i.id === creada.id)).toBeTrue();

    service.actualizar(creada.id, { ...base, nombres: 'Ana María' });
    lista = await firstValueFrom(service.inscripciones$);
    expect(lista.find((i) => i.id === creada.id)?.nombres).toBe('Ana María');

    service.eliminar(creada.id);
    lista = await firstValueFrom(service.inscripciones$);
    expect(lista.some((i) => i.id === creada.id)).toBeFalse();
  });

  it('detecta DNI duplicado', async () => {
    expect(await firstValueFrom(service.dniExiste('71234567'))).toBeTrue();
    expect(await firstValueFrom(service.dniExiste('00000000'))).toBeFalse();
  });
});
