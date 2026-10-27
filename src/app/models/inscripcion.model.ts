export interface Acompanante {
  nombre: string;
  dni: string;
}

export interface Inscripcion {
  id: number;
  nombres: string;
  apellidos: string;
  dni: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  taller: string;
  modalidad: 'presencial' | 'virtual';
  nivel: 'basico' | 'intermedio' | 'avanzado';
  acompanantes: Acompanante[];
  comentarios: string;
  fechaRegistro: string;
}

export type NuevaInscripcion = Omit<Inscripcion, 'id' | 'fechaRegistro'>;

export interface Taller {
  id: string;
  nombre: string;
}

export const TALLERES: Taller[] = [
  { id: 'angular', nombre: 'Angular desde cero' },
  { id: 'spring', nombre: 'API REST con Spring Boot' },
  { id: 'sql', nombre: 'SQL Server para desarrolladores' },
  { id: 'docker', nombre: 'Docker para proyectos web' },
  { id: 'git', nombre: 'Git y GitHub en equipo' },
];
