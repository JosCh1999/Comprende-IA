# 📚 Tutor Virtual de Lectura Crítica con IA (MERN)

**AppComprende** es una aplicación web de tutoría que utiliza **Inteligencia Artificial (IA)** para mejorar la comprensión lectora y el pensamiento crítico en estudiantes universitarios. La plataforma genera preguntas, detecta falacias y ofrece retroalimentación personalizada, apoyándose en automatización para crear rutas de aprendizaje adaptativas.

---

## 🚀 Funcionalidades Principales

### 🤖 **Asistente de IA**
- **Generación de Preguntas:** Crea preguntas de comprensión lectora a nivel literal, inferencial y crítico a partir de los textos cargados por el usuario.
- **Detección de Sesgos y Falacias:** Analiza los textos para identificar y señalar posibles sesgos o falacias, proporcionando retroalimentación automática para fomentar el pensamiento crítico.

### 📈 **Seguimiento y Personalización**
- **Dashboard de Progreso:** Permite a estudiantes y docentes visualizar el avance, las calificaciones y el rendimiento en las actividades.
- **Rutas de Estudio Personalizadas:** Ofrece un camino de aprendizaje adaptado a las necesidades de cada estudiante para reforzar sus habilidades.

### ⚙️ **Automatización**
- **Notificaciones y Recordatorios:** Utiliza flujos de automatización con **n8n** para enviar recordatorios sobre actividades pendientes y notificar sobre el progreso.

### 👤 **Gestión de Usuarios**
- **Autenticación Segura:** Sistema de registro e inicio de sesión con roles diferenciados para estudiantes y docentes.
- **Carga de Textos:** Los estudiantes pueden subir documentos en formato PDF, DOCX o TXT para que la plataforma los procese.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React.js (con Context API o Redux para la gestión de estado).
- **Backend:** Node.js, Express.js (exponiendo una API REST).
- **Base de Datos:** MongoDB (desplegado en MongoDB Atlas).
- **Inteligencia Artificial:** Modelos de NLP a través de APIs de Hugging Face / OpenAI.
- **Automatización:** n8n para la orquestación de flujos de trabajo y notificaciones.
- **Pruebas:** Jest (unitarias) y Cypress (E2E), con una cobertura objetivo del 70%.
- **Contenerización:** Docker para el despliegue de la aplicación.

---

## 📂 Estructura del Proyecto (Ejemplo)

```bash
Comprende-IA/
│
├── backend/
│   ├── controllers/       # Lógica para usuarios, textos y análisis de IA
│   ├── models/            # Esquemas de Mongoose para la base de datos
│   ├── routes/            # Definición de las rutas de la API
│   └── server.js          # Punto de entrada del servidor Express
│
└── frontend/
    ├── src/
    │   ├── components/    # Componentes reutilizables de React
    │   ├── pages/         # Vistas principales de la aplicación
    │   ├── context/       # Estado global (Autenticación, etc.)
    │   └── services/      # Llamadas a la API del backend
    └── ...
```

---

## 🚀 Instalación y Ejecución

### Prerrequisitos

- **Node.js** v18 o superior
- **MongoDB** (local o MongoDB Atlas)
- **Docker** y **Docker Compose** (opcional, para despliegue con contenedores)
- **n8n** (para automatización de workflows)

---

### 📦 Opción 1: Instalación Local (Desarrollo)

#### 1. Clonar el Repositorio

```bash
git clone https://github.com/JosCh1999/Comprende-IA.git
cd Comprende-IA
```

#### 2. Configurar el Backend

```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
```

Editar `backend/.env` con tus credenciales:

```env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/comprende
JWT_SECRET=tu_secreto_jwt_super_seguro
GEMINI_API_KEY=tu_api_key_de_gemini
N8N_WEBHOOK_URL=http://localhost:5678/webhook/
```

#### 3. Configurar el Frontend

```bash
cd ../frontend
npm install

# Configurar variables de entorno
cp .env.example .env
```

Editar `frontend/.env`:

```env
VITE_API_URL=http://localhost:4000
```

#### 4. Ejecutar MongoDB

**Opción A - MongoDB Local:**
```bash
mongod --dbpath /ruta/a/tu/data
```

**Opción B - MongoDB Atlas:**
- Usar la URI de conexión en `backend/.env`

#### 5. Ejecutar n8n

```bash
# Con Docker
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n

# O con npx
npx n8n
```

#### 6. Iniciar la Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### 7. Acceder a la Aplicación

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:4000
- **n8n:** http://localhost:5678

---

### 🐳 Opción 2: Despliegue con Docker (Producción)

#### 1. Configurar Variables de Entorno

```bash
# Backend
cd backend
cp .env.example .env
# Editar .env con tus credenciales

# Frontend
cd ../frontend
cp .env.example .env
# Editar .env con la URL del backend
```

#### 2. Construir y Ejecutar con Docker Compose

Desde la raíz del proyecto:

```bash
# Construir las imágenes
docker-compose -f docker-compose.prod.yml build

# Iniciar todos los servicios (backend, frontend, MongoDB, n8n)
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### 3. Verificar Servicios

```bash
docker-compose -f docker-compose.prod.yml ps
```

#### 4. Acceder a la Aplicación

- **Frontend:** http://localhost
- **Backend API:** http://localhost:4000
- **n8n:** http://localhost:5678
  - Usuario: `admin`
  - Contraseña: `admin123` (cambiar en producción)
- **MongoDB:** `mongodb://admin:admin123@localhost:27017`

#### 5. Detener Servicios

```bash
docker-compose -f docker-compose.prod.yml down
```

---

### 🧪 Ejecutar Pruebas

#### Pruebas Unitarias (Backend)

```bash
cd backend
npm test
```

#### Pruebas E2E (Frontend)

```bash
cd frontend
npx cypress open
```

#### Pruebas con Docker

```bash
# Desde la raíz del proyecto
docker-compose up --build
```

---

## 📚 Documentación Adicional

- **Arquitectura del Sistema:** Ver `ARTEFACTOS Y DOCUMENTACION/1.INICIO/Arquitectura de Software.pdf`
- **Modelo de Base de Datos:** Ver `ARTEFACTOS Y DOCUMENTACION/1.INICIO/Modelo Logico y Fisico de la BD.pdf`
- **Informe de Pruebas:** Ver `ARTEFACTOS Y DOCUMENTACION/3.IMPLEMENTACIÓN/Casos de Prueba/`
- **Guía de Despliegue Docker:** Consultar documentación detallada en el repositorio

---

## 🔧 Configuración de n8n

1. Acceder a http://localhost:5678
2. Crear una cuenta o iniciar sesión
3. Importar los workflows desde `ARTEFACTOS Y DOCUMENTACION/`
4. Configurar las credenciales:
   - **Hugging Face API** para análisis de texto
   - **Gmail** para envío de notificaciones
5. Activar los workflows

---

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

## 📄 Licencia

Este proyecto es parte de un trabajo académico universitario.

---

## 👥 Autores

- **Equipo Comprende-IA**
- Universidad: [Nombre de la Universidad]
- Curso: Desarrollo de Software

---

## 📞 Soporte

Para preguntas o problemas, por favor abrir un issue en el repositorio de GitHub.
