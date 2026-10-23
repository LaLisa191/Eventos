Eventos — Universidad de Cartagena

Aplicación web para centralizar la inscripción a eventos universitarios: los organizadores publican eventos con cupo limitado, y los participantes se registran y reciben confirmación visual e inmediata, además de un correo de confirmación.

-------------Funcionalidades-------------
* Autenticación con roles: cuentas de organizador y participante, con JWT.
* Organizador: crear, editar y eliminar sus propios eventos (con imagen), generar y consultar el reporte de asistencia.
* Participante: ver eventos disponibles (presenciales o virtuales), buscarlos por nombre, marcarlos como favoritos, registrarse, cancelar su registro, y ver "Mis eventos".
* Cupo disponible calculado en tiempo real; el sistema bloquea el registro cuando un evento se llena.
* Confirmación de registro por correo (Gmail vía Nodemailer, enviado de forma asíncrona para no bloquear la respuesta) y opción de descargar el evento como archivo .ics para el calendario.
* Edición de perfil (nombre, correo, contraseña).


-------------Stack técnico-------------
* Backend: Node.js, Express, Mongoose (MongoDB Atlas)
* Autenticación: JSON Web Tokens (jsonwebtoken) + contraseñas encriptadas (bcryptjs)
* Subida de imágenes: Multer, almacenamiento local en public/uploads
* Correo: Nodemailer (SMTP de Gmail)
* Frontend: React 18 + React Router + Vite (carpeta frontend/), compilado y servido por Express
* Pruebas: Jest + Supertest
* Calidad de código: SonarQube (análisis estático de seguridad, mantenibilidad y confiabilidad)


-------------Arquitectura (hexagonal)-------------

El backend sigue la arquitectura hexagonal (puertos y adaptadores): la lógica de negocio está en el centro y no depende de Express, Mongoose, bcrypt, JWT ni Nodemailer. Las dependencias siempre apuntan hacia el núcleo.

gestion-eventos/
├── app.js, server.js                  # Puntos de entrada: arman la app y levantan el servidor
├── src/
│   ├── domain/                        # NÚCLEO: reglas de negocio puras
│   │   ├── errors.js                    # Errores del dominio (sin HTTP)
│   │   └── rules/                       # eventRules, registrationRules, userRules
│   ├── application/
│   │   ├── ports/index.js               # PUERTOS: contratos que el núcleo necesita (repositorios, hasher, tokens, correo, QR)
│   │   └── use-cases/                   # Un caso de uso por acción: events/, registrations/, users/
│   ├── infrastructure/                # ADAPTADORES: implementan los puertos
│   │   ├── persistence/mongoose/        # Modelos y repositorios de MongoDB
│   │   ├── security/                    # BcryptPasswordHasher, JwtTokenService
│   │   ├── mail/                        # mailer.js y EmailRegistrationNotifier
│   │   ├── qr/                          # QRCodeGenerator
│   │   └── http/                        # Adaptador de entrada: rutas Express, middlewares, manejo de errores
│   └── container.js                   # Raíz de composición: único lugar donde se eligen los adaptadores
├── tests/
│   ├── unit/                          # Casos de uso con repositorios falsos en memoria (sin base de datos)
│   └── *.test.js                      # Pruebas de integración de la API (Jest + Supertest)
├── frontend/                          # SPA en React (Vite): pages/, components/, api/, context/
├── public/                            # uploads/, emails/ (estilos del correo) y logo
├── jest.setup.js                      # Configuración de las pruebas de integración
├── .env                               # Variables de entorno (no se sube al repo)
├── .env.test.example                  # Ejemplo de variables para las pruebas (copiar a .env.test, que no se sube)
└── sonar-project.properties           # Configuración del análisis de SonarQube

Principios SOLID aplicados:
* Responsabilidad única: cada caso de uso hace una sola acción; las rutas solo traducen HTTP.
* Abierto/cerrado: para cambiar de base de datos o de servicio de correo se agrega un adaptador nuevo, sin tocar los casos de uso.
* Sustitución de Liskov: los repositorios de Mongoose y los falsos de las pruebas son intercambiables porque cumplen el mismo puerto.
* Segregación de interfaces: hay un puerto pequeño por responsabilidad (EventRepository, UserRepository, PasswordHasher, ...).
* Inversión de dependencias: los casos de uso reciben los puertos por constructor (inyección de dependencias en src/container.js).


-------------Requisitos previos-------------

* Node.js (v18 o superior)
* Una base de datos en MongoDB Atlas (gratuita)
* Una cuenta de Gmail con verificación en 2 pasos activa, para generar una contraseña de aplicación
* (Opcional, para el análisis de calidad) SonarQube Community corriendo localmente


-------------Instalación-------------

1. Clona el repositorio y entra a la carpeta:
   git clone <url-del-repo>
   cd gestion-eventos

2. Instala las dependencias:
   npm install

3. Crea un archivo .env en la raíz del proyecto con estas variables:

   MONGODB_URI=mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/gestion-eventos
   PORT=3000
   JWT_SECRET=un-texto-largo-y-aleatorio
   EMAIL_USER=tucorreo@dominio.com
   EMAIL_PASS=contraseña-de-aplicación-de-16-caracteres

* MONGODB_URI: cadena de conexión de tu cluster de Atlas (Database → Connect → Drivers), agregando el nombre de la base al final de la URL.
* JWT_SECRET: cualquier texto largo, es la clave con la que se firman los tokens de sesión.
* EMAIL_USER / EMAIL_PASS: la cuenta de Gmail y su contraseña de aplicación (no la contraseña normal de la cuenta).

4. Crea la carpeta donde se guardan las imágenes de los eventos (si no existe):
   mkdir -p public/uploads


-------------Uso-------------

Compilar el frontend (una vez) y levantar el servidor:
npm run build
npm start

Para desarrollar la interfaz con recarga en caliente: `npm start` en una terminal y `npm run dev:front` en otra (http://localhost:5173, con proxy a la API).

Abre http://localhost:3000 en el navegador. Desde ahí puedes crear una cuenta (como organizador o como participante), publicar un evento y probar el flujo completo de registro.

-------------Pruebas-------------

El proyecto usa Jest y Supertest. Las pruebas de integración necesitan una base MongoDB de PRUEBAS cuyo nombre termine en "-test" (por ejemplo una local, o una base aparte en Atlas) definida en .env.test; copia .env.test.example como punto de partida. Las pruebas unitarias no necesitan base de datos.

Correr toda la suite:
npm test

Solo las pruebas unitarias de los casos de uso (sin base de datos):
npm run test:unit

Cubre: casos de uso del dominio, registro/login/perfil de usuarios, el CRUD de eventos (creación, edición, permisos de organizador), y el flujo de registro a un evento (incluyendo el control de cupo).

-------------Análisis de calidad (SonarQube)-------------

El proyecto se analiza periódicamente con SonarQube (configuración en sonar-project.properties) para revisar seguridad, mantenibilidad y confiabilidad del código. Los hallazgos se documentan y resuelven.


-------------NOTAS-------------
* Si MONGODB_URI usa mongodb+srv:// y la conexión falla con un error de DNS o SSL, revisa que tu IP esté permitida en Atlas (Network Access) o prueba con la cadena de conexión "estándar" (sin +srv) que ofrece Atlas como alternativa.
* Si el envío de correo falla, el registro del participante se guarda de todas formas — el correo no es un paso bloqueante.
* Las imágenes subidas se guardan en public/uploads/ y se sirven automáticamente como archivos estáticos; no requieren una ruta aparte.