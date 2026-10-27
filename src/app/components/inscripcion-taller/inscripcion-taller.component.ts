import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable, combineLatest, of, timer } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Inscripcion, TALLERES, Taller } from '../../models/inscripcion.model';
import { InscripcionService } from '../../services/inscripcion.service';

/* ---------- Validadores personalizados ---------- */

/** El usuario debe tener al menos `min` años y no puede ingresar una fecha futura. */
export function edadMinima(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const nacimiento = new Date(control.value);
    if (isNaN(nacimiento.getTime())) return { fechaInvalida: true };
    const hoy = new Date();
    if (nacimiento > hoy) return { fechaFutura: true };
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad < min ? { edadMinima: { min } } : null;
  };
}

/** Validador de grupo: dos campos deben tener el mismo valor. */
export function coincidenCampos(campo: string, confirmacion: string): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const a = grupo.get(campo)?.value;
    const b = grupo.get(confirmacion)?.value;
    return a && b && a !== b ? { camposNoCoinciden: true } : null;
  };
}

@Component({
  selector: 'app-inscripcion-taller',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inscripcion-taller.component.html',
  styleUrl: './inscripcion-taller.component.css',
})
export class InscripcionTallerComponent {
  private fb = inject(FormBuilder);
  private servicio = inject(InscripcionService);

  readonly talleres: Taller[] = TALLERES;
  readonly hoy = new Date().toISOString().split('T')[0];
  readonly maxAcompanantes = 3;

  editandoId: number | null = null;
  mensaje = '';
  tipoMensaje: 'ok' | 'info' = 'ok';

  private readonly valoresIniciales = {
    nombres: '',
    apellidos: '',
    dni: '',
    email: '',
    confirmarEmail: '',
    telefono: '',
    fechaNacimiento: '',
    taller: '',
    modalidad: 'presencial',
    nivel: 'basico',
    comentarios: '',
    aceptaTerminos: false,
  };

  private readonly soloLetras = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ ]+$/;

  form = this.fb.group(
    {
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.pattern(this.soloLetras)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.pattern(this.soloLetras)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)], [this.dniUnico()]],
      email: ['', [Validators.required, Validators.email]],
      confirmarEmail: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
      fechaNacimiento: ['', [Validators.required, edadMinima(16)]],
      taller: ['', [Validators.required]],
      modalidad: ['presencial', [Validators.required]],
      nivel: ['basico', [Validators.required]],
      acompanantes: new FormArray<FormGroup>([]),
      comentarios: ['', [Validators.maxLength(200)]],
      aceptaTerminos: [false, [Validators.requiredTrue]],
    },
    { validators: [coincidenCampos('email', 'confirmarEmail')] }
  );

  filtro = new FormControl('', { nonNullable: true });

  /** Lista filtrada por nombre, DNI o taller */
  inscripciones$: Observable<Inscripcion[]> = combineLatest([
    this.servicio.inscripciones$,
    this.filtro.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([lista, texto]) => {
      const t = (texto ?? '').trim().toLowerCase();
      if (!t) return lista;
      return lista.filter(
        (i) =>
          `${i.nombres} ${i.apellidos}`.toLowerCase().includes(t) ||
          i.dni.includes(t) ||
          this.nombreTaller(i.taller).toLowerCase().includes(t)
      );
    })
  );

  /* ---------- Helpers del formulario ---------- */

  get acompanantes(): FormArray {
    return this.form.get('acompanantes') as FormArray;
  }

  get comentariosLongitud(): number {
    return (this.form.get('comentarios')?.value as string)?.length ?? 0;
  }

  private nuevoAcompanante() {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.soloLetras)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    });
  }

  agregarAcompanante(): void {
    if (this.acompanantes.length >= this.maxAcompanantes) return;
    this.acompanantes.push(this.nuevoAcompanante());
  }

  quitarAcompanante(indice: number): void {
    this.acompanantes.removeAt(indice);
  }

  /** Validador asíncrono: consulta al servicio si el DNI ya está inscrito. */
  private dniUnico(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return timer(300).pipe(
        switchMap(() => this.servicio.dniExiste(control.value, this.editandoId)),
        map((existe) => (existe ? { dniDuplicado: true } : null))
      );
    };
  }

  esInvalido(ruta: string): boolean {
    const c = this.form.get(ruta);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  esValido(ruta: string): boolean {
    const c = this.form.get(ruta);
    return !!c && c.valid && (c.touched || c.dirty);
  }

  mensajeError(ruta: string): string {
    const c = this.form.get(ruta);
    if (!c) return '';

    if (ruta === 'confirmarEmail' && c.touched && this.form.hasError('camposNoCoinciden')) {
      return 'Los correos no coinciden.';
    }
    if (!(c.touched || c.dirty) || !c.errors) return '';

    const e = c.errors;
    const campo = ruta.split('.').pop() ?? ruta;
    const patrones: Record<string, string> = {
      nombres: 'Solo se permiten letras y espacios.',
      apellidos: 'Solo se permiten letras y espacios.',
      nombre: 'Solo se permiten letras y espacios.',
      dni: 'El DNI debe tener exactamente 8 dígitos.',
      telefono: 'Debe tener 9 dígitos y empezar con 9.',
    };

    if (e['required']) return 'Este campo es obligatorio.';
    if (e['requiredTrue']) return 'Debes aceptar los términos para continuar.';
    if (e['minlength']) return `Mínimo ${e['minlength'].requiredLength} caracteres.`;
    if (e['maxlength']) return `Máximo ${e['maxlength'].requiredLength} caracteres.`;
    if (e['email']) return 'Ingresa un correo válido (ej. nombre@dominio.com).';
    if (e['pattern']) return patrones[campo] ?? 'Formato no válido.';
    if (e['fechaFutura']) return 'La fecha no puede ser futura.';
    if (e['fechaInvalida']) return 'Fecha no válida.';
    if (e['edadMinima']) return `Debes tener al menos ${e['edadMinima'].min} años.`;
    if (e['dniDuplicado']) return 'Este DNI ya está inscrito.';
    return 'Valor no válido.';
  }

  nombreTaller(id: string): string {
    return this.talleres.find((t) => t.id === id)?.nombre ?? id;
  }

  /* ---------- Acciones CRUD ---------- */

  guardar(): void {
    if (this.form.pending) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const datos = {
      nombres: (v.nombres ?? '').trim(),
      apellidos: (v.apellidos ?? '').trim(),
      dni: v.dni ?? '',
      email: (v.email ?? '').trim().toLowerCase(),
      telefono: v.telefono ?? '',
      fechaNacimiento: v.fechaNacimiento ?? '',
      taller: v.taller ?? '',
      modalidad: (v.modalidad ?? 'presencial') as 'presencial' | 'virtual',
      nivel: (v.nivel ?? 'basico') as 'basico' | 'intermedio' | 'avanzado',
      acompanantes: (v.acompanantes as { nombre: string; dni: string }[]).map((a) => ({
        nombre: a.nombre.trim(),
        dni: a.dni,
      })),
      comentarios: (v.comentarios ?? '').trim(),
    };

    if (this.editandoId !== null) {
      this.servicio.actualizar(this.editandoId, datos);
      this.avisar('Inscripción actualizada correctamente.', 'info');
    } else {
      this.servicio.agregar(datos);
      this.avisar('¡Inscripción registrada con éxito!', 'ok');
    }
    this.limpiar();
  }

  editar(i: Inscripcion): void {
    this.editandoId = i.id;
    this.acompanantes.clear();
    i.acompanantes.forEach(() => this.acompanantes.push(this.nuevoAcompanante()));

    this.form.patchValue({
      nombres: i.nombres,
      apellidos: i.apellidos,
      dni: i.dni,
      email: i.email,
      confirmarEmail: i.email,
      telefono: i.telefono,
      fechaNacimiento: i.fechaNacimiento,
      taller: i.taller,
      modalidad: i.modalidad,
      nivel: i.nivel,
      acompanantes: i.acompanantes,
      comentarios: i.comentarios,
      aceptaTerminos: true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(i: Inscripcion): void {
    if (!confirm(`¿Eliminar la inscripción de ${i.nombres} ${i.apellidos}?`)) return;
    this.servicio.eliminar(i.id);
    if (this.editandoId === i.id) this.limpiar();
    this.avisar('Inscripción eliminada.', 'info');
  }

  limpiar(): void {
    this.editandoId = null;
    this.acompanantes.clear();
    this.form.reset(this.valoresIniciales);
  }

  trackPorId(_: number, i: Inscripcion): number {
    return i.id;
  }

  private avisar(texto: string, tipo: 'ok' | 'info'): void {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
    setTimeout(() => (this.mensaje = ''), 3000);
  }
}
