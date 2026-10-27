# 🎓 Inscripción a Talleres

Aplicación web desarrollada con **Angular** para gestionar la inscripción de participantes a diferentes talleres técnicos. El sistema permite registrar información, consultar participantes, buscar inscripciones y actualizar o eliminar registros de manera sencilla y organizada.

## 📌 Descripción del proyecto

Este proyecto tiene como objetivo facilitar el proceso de inscripción a talleres mediante un formulario reactivo que permite ingresar y validar los datos de los participantes.

La aplicación utiliza **Reactive Forms** para controlar los campos del formulario y aplicar validaciones, además de organizar el código mediante componentes, modelos y servicios de Angular.

Los datos se gestionan en memoria, por lo que el proyecto puede ejecutarse sin necesidad de configurar una base de datos.

## ✨ Funcionalidades principales

- 📝 **Registrar participantes:** ingresar los datos personales y la información del taller.
- 📋 **Listar inscritos:** visualizar los participantes registrados.
- 🔎 **Buscar registros:** localizar participantes mediante los criterios de búsqueda disponibles.
- ✏️ **Editar información:** modificar los datos de una inscripción existente.
- 🗑️ **Eliminar registros:** retirar inscripciones de la lista.
- ✅ **Validar formularios:** comprobar los datos ingresados y mostrar errores cuando corresponda.
- 🔄 **Formularios dinámicos:** utilizar `FormArray` para administrar grupos de campos cuando sea necesario.

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| Angular | Desarrollo de la aplicación web |
| TypeScript | Lógica y programación del sistema |
| Reactive Forms | Gestión y validación de formularios |
| HTML | Estructura de la interfaz |
| CSS | Diseño y presentación visual |
| Node.js y npm | Entorno y gestión de dependencias |

## 📂 Estructura del proyecto

```text
src/
├── app/
│   ├── components/
│   │   └── inscripcion-taller/
│   │       ├── inscripcion-taller.component.ts
│   │       ├── inscripcion-taller.component.html
│   │       └── inscripcion-taller.component.css
│   ├── models/
│   │   └── inscripcion.model.ts
│   ├── services/
│   │   └── inscripcion.service.ts
│   ├── app.component.ts
│   ├── app.component.html
│   └── app.routes.ts
├── index.html
├── main.ts
└── styles.css
```

## ⚙️ Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/)
- npm, incluido con Node.js
- Angular CLI

Para comprobar las instalaciones, ejecuta:

```bash
node -v
npm -v
ng version
```

Si necesitas instalar Angular CLI:

```bash
npm install -g @angular/cli
```

## 🚀 Instalación y ejecución

**1. Clonar el repositorio**

```bash
git clone https://github.com/oscarsanchez0712/Inscripcion-talleres-angular.git
```

**2. Entrar en la carpeta del proyecto**

```bash
cd Inscripcion-talleres-angular
```

**3. Instalar las dependencias**

```bash
npm install
```

**4. Iniciar la aplicación**

```bash
ng serve
```

**5. Abrir en el navegador**

Visita [http://localhost:4200](http://localhost:4200).

La aplicación se actualizará automáticamente al guardar los cambios en los archivos del proyecto.

## 🧪 Pruebas

Para ejecutar las pruebas configuradas en el proyecto, utiliza:

```bash
ng test
```

## 💾 Almacenamiento de datos

La aplicación utiliza datos en memoria para gestionar las inscripciones durante su ejecución. Por ello, los registros no necesariamente se conservan al recargar la página o reiniciar la aplicación.

## 🎯 Objetivo académico

Este proyecto permite poner en práctica los conocimientos de desarrollo web con Angular, especialmente el uso de formularios reactivos, validaciones, componentes, modelos, servicios y operaciones CRUD.

## 👨‍💻 Autor

**oscarsanchez0712**

GitHub: [@oscarsanchez0712](https://github.com/oscarsanchez0712)

---

Desarrollado como proyecto académico para practicar el desarrollo de aplicaciones web con Angular.