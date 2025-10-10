# 📚 Tutor Virtual de Lectura Crítica con IA (MERN)

[cite_start]**AppComprende** es una aplicación web de tutoría que utiliza **Inteligencia Artificial (IA)** para mejorar la comprensión lectora y el pensamiento crítico en estudiantes universitarios[cite: 345, 346]. [cite_start]La plataforma genera preguntas, detecta falacias y ofrece retroalimentación personalizada, apoyándose en automatización para crear rutas de aprendizaje adaptativas[cite: 335].

---

## 🚀 Funcionalidades Principales

### 🤖 **Asistente de IA**
- [cite_start]**Generación de Preguntas:** Crea preguntas de comprensión lectora a nivel literal, inferencial y crítico a partir de los textos cargados por el usuario[cite: 376, 486].
- [cite_start]**Detección de Sesgos y Falacias:** Analiza los textos para identificar y señalar posibles sesgos o falacias, proporcionando retroalimentación automática para fomentar el pensamiento crítico[cite: 377, 488].

### 📈 **Seguimiento y Personalización**
- [cite_start]**Dashboard de Progreso:** Permite a estudiantes y docentes visualizar el avance, las calificaciones y el rendimiento en las actividades[cite: 380, 490, 494].
- [cite_start]**Rutas de Estudio Personalizadas:** Ofrece un camino de aprendizaje adaptado a las necesidades de cada estudiante para reforzar sus habilidades[cite: 378].

### ⚙️ **Automatización**
- [cite_start]**Notificaciones y Recordatorios:** Utiliza flujos de automatización con **n8n** para enviar recordatorios sobre actividades pendientes y notificar sobre el progreso[cite: 353, 379, 492].

### 👤 **Gestión de Usuarios**
- [cite_start]**Autenticación Segura:** Sistema de registro e inicio de sesión con roles diferenciados para estudiantes y docentes[cite: 374, 496].
- [cite_start]**Carga de Textos:** Los estudiantes pueden subir documentos en formato PDF, DOCX o TXT para que la plataforma los procese[cite: 484, 485].

---

## 🛠️ Tecnologías Utilizadas

- [cite_start]**Frontend:** React.js (con Context API o Redux para la gestión de estado)[cite: 362, 385].
- [cite_start]**Backend:** Node.js, Express.js (exponiendo una API REST)[cite: 363, 386].
- [cite_start]**Base de Datos:** MongoDB (desplegado en MongoDB Atlas)[cite: 364, 387].
- [cite_start]**Inteligencia Artificial:** Modelos de NLP a través de APIs de Hugging Face / OpenAI[cite: 365, 390].
- [cite_start]**Automatización:** n8n para la orquestación de flujos de trabajo y notificaciones[cite: 366].
- [cite_start]**Pruebas:** Jest (unitarias) y Cypress (E2E), con una cobertura objetivo del 70%[cite: 358, 369].
- [cite_start]**Contenerización:** Docker para el despliegue de la aplicación[cite: 394].

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
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Arquitectura Principal

<img width="932" height="692" alt="image-Photoroom" src="https://github.com/user-attachments/assets/a9430d7d-9418-4c81-9800-1155447f672c" />

