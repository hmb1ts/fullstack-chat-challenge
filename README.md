# Eco-Sistema de Chat Real-time (Fullstack)

Este proyecto es una demostración técnica de un ecosistema de chat en tiempo real que utiliza un único backend para sincronizar dos aplicaciones frontend construidas con tecnologías distintas (**React** y **Vue 3**).

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** con **TypeScript**.
- **Express** para la API y servidor base.
- **Socket.io** para la comunicación bidireccional en tiempo real.
- **TSX** para la ejecución eficiente en entornos de desarrollo y contenedores.

### Frontend React
- **React 18** + **Vite**.
- **Zustand** para la gestión de estado global de forma ligera y eficiente.
- **Socket.io-client** para la integración de WebSockets vía Hooks personalizados.
- **CSS Moderno** con variables, animaciones e interfaz premium.

### Frontend Vue
- **Vue 3** (Composition API) + **Vite**.
- **Pinia** para la gestión de estado (el estándar actual en Vue 3).
- **Socket.io-client** integrado mediante Composables reactivos.
- Consistencia visual total con la versión de React.

### Infraestructura
- **Docker** y **Docker Compose** para la orquestación de los tres servicios de forma aislada y reproducible.

## ✨ Características Destacadas

1.  **Sincronización Multi-Cliente**: Los mensajes enviados desde React aparecen instantáneamente en Vue y viceversa.
2.  **Indicador de Escritura ("Is Typing")**: Visualización animada de cuando otros usuarios están escribiendo en tiempo real.
3.  **Historial de Sesión**: El backend mantiene un historial reciente para que los nuevos usuarios se pongan al día al conectar.
4.  **Estado de Conexión**: Indicadores visuales de conexión activa o perdida con el servidor.
5.  **Diseño Premium**: Interfaz moderna con modo oscuro, efectos de transparencia (*glassmorphism*) y animaciones fluidas.
6.  **Arquitectura Limpia**: Separación total entre la lógica de comunicación (sockets), lógica de estado y componentes de interfaz.

## 🛠️ Instalación y Ejecución

La forma más rápida de levantar toda la infraestructura es utilizando Docker Compose.

### Requisitos
- Docker y Docker Compose instalados.

### Pasos
1. Clona el repositorio.
2. Abre una terminal en la raíz del proyecto.
3. Ejecuta el comando:
   ```bash
   docker-compose up --build
   ```

### Accesos Locales
- **React Application**: [http://localhost:5173](http://localhost:5173)
- **Vue Application**: [http://localhost:5174](http://localhost:5174)
- **Backend API**: [http://localhost:4000](http://localhost:4000)

## 📁 Estructura del Proyecto

```bash
├── backend/              # Lógica del servidor y WebSockets
├── react-frontend/       # Aplicación construida con React
├── vue-frontend/         # Aplicación construida con Vue 3
└── docker-compose.yml    # Configuración de orquestación
```

