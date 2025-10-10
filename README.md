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
