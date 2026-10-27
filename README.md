# Inscripción a Talleres (Angular + Reactive Forms)

Formulario reactivo con datos en memoria: validadores integrados, personalizados y asíncrono,
`FormArray` dinámico, CRUD completo (crear, listar, editar, eliminar) y buscador.

## Ejecutar como proyecto independiente
```bash
npm install
ng serve
```
Abrir http://localhost:4200

## Pruebas
```bash
ng test
```

## Integrar en tu repo SO3_RP_Crud
Copia solo estas carpetas/archivos dentro de tu `src/app` (no reemplaces `app.routes.ts` ni
`app.component.*` si ya tienes rutas de libros/tareas; en ese caso solo suma la ruta):
- `components/inscripcion-taller/`
- `models/inscripcion.model.ts`
- `services/inscripcion.service.ts`

Ruta a sumar en `app.routes.ts`:
```ts
{ path: 'inscripciones', component: InscripcionTallerComponent },
```
