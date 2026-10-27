import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InscripcionTallerComponent, coincidenCampos, edadMinima } from './inscripcion-taller.component';
import { FormControl, FormGroup } from '@angular/forms';

describe('InscripcionTallerComponent', () => {
  let fixture: ComponentFixture<InscripcionTallerComponent>;
  let component: InscripcionTallerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [InscripcionTallerComponent] }).compileComponents();
    fixture = TestBed.createComponent(InscripcionTallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario vacío debe ser inválido', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('debe rechazar un DNI con formato incorrecto', () => {
    const dni = component.form.get('dni')!;
    dni.setValue('123');
    expect(dni.hasError('pattern')).toBeTrue();
  });

  it('debe permitir agregar y quitar acompañantes hasta el máximo', () => {
    for (let i = 0; i < 5; i++) component.agregarAcompanante();
    expect(component.acompanantes.length).toBe(component.maxAcompanantes);
    component.quitarAcompanante(0);
    expect(component.acompanantes.length).toBe(component.maxAcompanantes - 1);
  });

  it('edadMinima rechaza fechas futuras y menores de edad', () => {
    const futura = new Date();
    futura.setFullYear(futura.getFullYear() + 1);
    expect(edadMinima(16)(new FormControl(futura.toISOString().split('T')[0]))).toEqual({ fechaFutura: true });
    const reciente = new Date();
    reciente.setFullYear(reciente.getFullYear() - 10);
    expect(edadMinima(16)(new FormControl(reciente.toISOString().split('T')[0]))).toEqual({ edadMinima: { min: 16 } });
  });

  it('coincidenCampos detecta correos distintos', () => {
    const g = new FormGroup({ a: new FormControl('x@x.com'), b: new FormControl('y@y.com') });
    expect(coincidenCampos('a', 'b')(g)).toEqual({ camposNoCoinciden: true });
  });
});
