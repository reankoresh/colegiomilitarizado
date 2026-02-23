# Estructura de Componentes

Esta carpeta contiene todos los componentes reutilizables del proyecto, organizados por su función:

## 📁 Estructura

```
components/
├── menus/          # Componentes de submenús del navbar
│   └── Admissions.astro
│
├── sections/       # Componentes de secciones de página
│   ├── Benefits.astro
│   ├── Carousel.astro
│   ├── Mision.astro
│   └── Notes.astro
│
├── ui/             # Componentes UI reutilizables
│   └── Title.astro
│
├── Footer.astro    # Footer global
├── Links.astro     # Enlaces del navbar
├── Login.astro     # Componente de login
└── Navbar.astro    # Barra de navegación principal
```

## 📝 Guía de uso

### Componentes de Menús (`menus/`)
Componentes que representan el contenido de los submenús desplegables del navbar.

**Ejemplo:**
```astro
import Admissions from "./menus/Admissions.astro";
```

### Componentes de Secciones (`sections/`)
Componentes que representan secciones completas de la página (hero, features, etc.).

**Ejemplo:**
```astro
import Carousel from "./sections/Carousel.astro";
import Benefits from "./sections/Benefits.astro";
```

### Componentes UI (`ui/`)
Componentes pequeños y reutilizables (botones, títulos, inputs, etc.).

**Ejemplo:**
```astro
import Title from "./ui/Title.astro";
```

## 🔄 Agregar nuevos componentes

### Para agregar un nuevo submenú:
1. Crear archivo en `menus/NuevoMenu.astro`
2. Importar en `Navbar.astro`
3. Seguir el patrón de `Admissions.astro`

### Para agregar una nueva sección:
1. Crear archivo en `sections/NuevaSeccion.astro`
2. Importar en la página correspondiente
3. Usar componentes de `ui/` para consistencia

### Para agregar un nuevo componente UI:
1. Crear archivo en `ui/NuevoComponente.astro`
2. Asegurar que sea genérico y reutilizable
3. Documentar sus props

## 🎨 Convenciones

- **Nombres de archivos:** PascalCase (ej: `MiComponente.astro`)
- **Imports relativos:** Usar rutas relativas desde el archivo actual
- **Props:** Documentar en comentarios JSDoc cuando sea necesario
- **Estilos:** Preferir Tailwind CSS
