# Documentación del Backend

## Descripción general
El backend de este proyecto se encarga de gestionar la lógica de negocio relacionada con los usuarios (profesores y alumnos), los cursos, los materiales, los certificados, los parciales, las inscripciones, los trabajos practicos, las rtas a los parciales y las rtas a los trabajos practicos. Los usuarios interactúan con este backend a través de una API.

## Instalación
Para ejecutar el servidor de backend en modo desarrollo:
1. Clona el repositorio:
   git clone https://github.com/franmaurutto/backend_dsw.git
2. Instala las dependencias:
   cd backend_dsw
   pnpm install
3. Inicia el servidor en desarrollo:
   pnpm start:dev
4. Inicia el servidor en produccion:
   pnpm start:prod   

## Rutas del API
A continuación se detallan las rutas disponibles en el sistema. Estas rutas están agrupadas por los recursos que gestionan, tales como materiales, certificados, cursos, inscripciones, parciales, respuestas de parciales, trabajos prácticos, y usuarios. El acceso a algunas rutas está restringido por roles de usuario (profesor o alumno).

Materiales
GET /material/sin-curso: Obtiene los materiales que no están asignados a ningún curso. Solo profesores.
GET /material: Obtiene todos los materiales. Solo profesores.
GET /material/:id: Obtiene un material específico por su ID. Solo profesores.
POST /material: Crea un nuevo material. Solo profesores.
PUT /material/:id: Actualiza un material existente por su ID. Solo profesores.
PATCH /material/:id: Actualiza parcialmente un material existente. 
DELETE /material/:id: Elimina un material por su ID. Solo profesores.
POST /material/:materialId/add-to-curso/:cursoId: Asocia un material a un curso específico. Solo profesores.

Certificados
GET /certificado: Obtiene todos los certificados. Solo profesores.
GET /certificado/:id: Obtiene un certificado específico por su ID. Solo alumno.
POST /certificado: Crea un nuevo certificado. Solo profesores.
PUT /certificado/:id: Actualiza un certificado existente.
PATCH /certificado/:id: Actualiza parcialmente un certificado.
DELETE /certificado/:id: Elimina un certificado por su ID. Solo profesores.

Cursos
GET /curso: Obtiene todos los cursos. Solo alumno.
GET /curso/:id: Obtiene un curso específico por su ID. Accesible para profesor y alumno.
POST /curso: Crea un nuevo curso. Solo profesores.
PUT /curso/:id: Actualiza un curso existente por su ID. Solo profesores.
PATCH /curso/:id: Actualiza parcialmente un curso.
DELETE /curso/:id: Elimina un curso por su ID. Solo profesores.
GET /curso/:id/materiales: Obtiene todos los materiales de un curso. Solo profesores.
GET /curso/:id/inscripciones: Obtiene todas las inscripciones a un curso. Solo profesores.

Inscripciones
GET /inscripcion: Obtiene todas las inscripciones.
GET /inscripcion/:id: Obtiene una inscripción específica por su ID. Solo alumnos.
POST /inscripcion: Crea una nueva inscripción. Solo alumnos.
PUT /inscripcion/:id: Actualiza una inscripción existente.
PATCH /inscripcion/:id: Actualiza parcialmente una inscripción.
DELETE /inscripcion/:id: Elimina una inscripción por su ID. Solo alumnos.
GET /inscripcion/:id/curso/:cursoId: Obtiene el curso asociado a una inscripción específica. Solo alumnos.
GET /inscripcion/:id/alumno/:alumnoId: Obtiene el alumno asociado a una inscripción específica. Solo profesores.

Parciales
GET /parcial: Obtiene todos los parciales.
GET /parcial/:id: Obtiene un parcial específico por su ID. Accesible para profesores y alumnos.
POST /parcial: Crea un nuevo parcial. Solo profesores.
PUT /parcial/:id: Actualiza un parcial existente por su ID. Solo profesores.
PATCH /parcial/:id: Actualiza parcialmente un parcial.
DELETE /parcial/:id: Elimina un parcial por su ID. Solo profesores.
GET /parcial/:id/rtasParcial: Obtiene todas las respuestas de un parcial específico. Solo profesores.

Respuestas de Parciales (RtaParcial)
GET /rtaParcial: Obtiene todas las respuestas de parciales.
GET /rtaParcial/:id: Obtiene una respuesta de parcial específica por su ID.
POST /rtaParcial: Crea una nueva respuesta de parcial. Solo alumnos.
PUT /rtaParcial/:id: Actualiza una respuesta de parcial existente.
PATCH /rtaParcial/:id: Actualiza parcialmente una respuesta de parcial.
DELETE /rtaParcial/:id: Elimina una respuesta de parcial. Solo profesor.
GET /rtaParcial/:id/inscripcion/:inscripcionId: Obtiene la inscripción asociada a una respuesta de parcial. Solo profesores.

Trabajos Prácticos (TP)
GET /tp: Obtiene todos los trabajos prácticos.
GET /tp/:id: Obtiene un trabajo práctico específico por su ID. Accesible para profesores y alumnos.
POST /tp: Crea un nuevo trabajo práctico. Solo profesores.
PUT /tp/:id: Actualiza un trabajo práctico existente por su ID. Solo profesores.
PATCH /tp/:id: Actualiza parcialmente un trabajo práctico.
DELETE /tp/:id: Elimina un trabajo práctico por su ID. Solo profesores.
GET /tp/:tpId/rtaTps: Obtiene todas las respuestas de un trabajo práctico específico. Accesible para profesores y alumnos.

Respuestas de Trabajos Prácticos (RtaTp)
GET /rtaTp: Obtiene todas las respuestas de trabajos prácticos. Solo profesor.
GET /rtaTp/:id: Obtiene una respuesta de trabajo práctico específica por su ID.
POST /rtaTp: Crea una nueva respuesta de trabajo práctico. Solo alumnos.
PUT /rtaTp/:id: Actualiza una respuesta de trabajo práctico existente.
PATCH /rtaTp/:id: Actualiza parcialmente una respuesta de trabajo práctico.
DELETE /rtaTp/:id: Elimina una respuesta de trabajo práctico. Solo profesor.
GET /rtaTp/:id/inscripcion/:inscripcionId: Obtiene la inscripción asociada a una respuesta de trabajo práctico. Solo profesor.

Usuarios
GET /usuario: Obtiene todos los usuarios.
GET /usuario/:id: Obtiene un usuario específico por su ID. Solo profesor. OBSEEEEEE
POST /usuario: Crea un nuevo usuario. 
PUT /usuario/:id: Actualiza un usuario existente por su ID. Accesible para profesores y alumnos.
PATCH /usuario/:id: Actualiza parcialmente un usuario.
DELETE /usuario/:id: Elimina un usuario por su ID. Accesible para profesores y alumnos.
POST /usuario/login: Realiza el login de un usuario.
GET /usuario/:id/inscripciones: Obtiene todas las inscripciones de un usuario. Solo alumnos.
GET /usuario/:id/cursos: Obtiene todos los cursos de un profesor. Solo profesor.
PATCH /usuario/:id/cambiar-contrasenia: Cambia la contraseña de un usuario. Accesible para profesores y alumnos.
POST /usuario/validar: Valida un usuario por su correo electrónico.

## Notas
Se trabaja con tokens mediante JWT.

## Tests automaticos
Los tests automáticos están configurados con Jest. Para ejecutar los tests:
pnpm test