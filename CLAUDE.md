# CLAUDE.md — landing_page_2dato

Guía mínima para Claude Code. **El conocimiento profundo vive en el baúl de Obsidian**; este archivo solo da lo esencial. No saturarlo (máx. 200 líneas).

---

## Base de conocimiento (Obsidian — leer primero)

Ruta: `C:\Worst_playground_eva\2DATO\zObsidian 2DATO\Proyectos\landing_page_2dato\`

- `memoria/contexto.md` — decisiones técnicas, arquitectura, estado actual y gotchas.
- `landing_page_2dato.md` — descripción general, stack, progreso y enlace a sesiones.
- `sesiones/AAAA-MM-DD.md` — bitácora diaria de cada sesión.

**Al iniciar:** leer `memoria/contexto.md` antes de tocar código.
**Al terminar:** crear o actualizar la nota de sesión del día en `sesiones/`.

---

## Qué es

Landing page oficial de **2Dato** (empresa de datos / analytics). Sitio estático bilingüe (ES/EN), desplegado en GitHub Pages bajo el dominio `2dato.co` (apex; `www` redirige con 301).

Repositorio: `https://github.com/2DATO/landing-page-2-dato`
Colaborador activo: `danielpesa7` (PRs de UI).

---

## Stack

| Capa      | Tecnología                                                                                     |
| --------- | ---------------------------------------------------------------------------------------------- |
| Markup    | HTML5 semántico                                                                                |
| Estilos   | CSS vanilla (`styles.css`)                                                                     |
| Lógica    | JavaScript vanilla (`main.js`)                                                                 |
| i18n      | `i18n.js` — catálogo EN/ES, `data-i18n` attrs, localStorage, detección de idioma del navegador |
| Tests E2E | Playwright (`tests/e2e/`, config en `playwright.config.ts`)                                    |
| Linting   | ESLint + Stylelint + html-validate + Prettier                                                  |
| Deploy    | GitHub Pages; rama `main` → producción automática                                              |

---

## Estructura

```
landing_page_2dato/
├── index.html          # Página única
├── main.js             # Lógica de UI (scroll, nav, interacciones)
├── i18n.js             # Internacionalización EN/ES
├── styles.css          # Estilos globales
├── 404.html / legal.html  # 404 propia; privacidad + términos (borrador)
├── CNAME               # 2dato.co
├── robots.txt / sitemap.xml
├── playwright.config.ts
├── package.json
└── tests/e2e/          # Tests Playwright
```

---

## Comandos

```bash
npm install             # Instalar dependencias de desarrollo

# Calidad de código
npm run format          # Formatear con Prettier
npm run format:check    # Verificar formato sin escribir
npm run lint:js         # ESLint
npm run lint:css        # Stylelint
npm run lint:html       # html-validate
npm run lint            # Los tres linters juntos
npm run check           # format:check + lint

# Tests E2E (Playwright)
# Requiere servidor local; playwright.config.ts usa `npx serve` en puerto 5173
npx playwright test             # Ejecutar todos los tests
npx playwright test --ui        # Modo interactivo
LAUNCH_URL=https://2dato.co npx playwright test launch  # Checklist contra producción

# Imágenes
npm run images:optimize  # Optimizar fotos del equipo (sharp)
```

---

## Convenciones clave

- **i18n:** todo texto de UI tiene atributo `data-i18n` (texto plano) o `data-i18n-html` (HTML con markup interno). Las claves del catálogo están en `i18n.js`. No añadir texto hardcodeado sin su entrada en ambas lenguas.
- **Deploy:** push a `main` → GitHub Pages publica de forma automática. Sin build step. No hay rama `gh-pages` separada.
- **CNAME:** `2dato.co` — no eliminar ni modificar este archivo. URLs absolutas (canonical, OG, sitemap) siempre con el apex.
- **Correo:** `hello@2dato.co` (Zoho). `2dato.com` no es nuestro y no tiene MX.
- **SEO:** `robots.txt` y `sitemap.xml` presentes; mantenerlos coherentes si se añaden páginas o se cambia la URL.
- **Email de commits:** usar el noreply de GitHub (`136174959+TomCardeLo@users.noreply.github.com`), no el email personal.
- **Tarjeta Daniel Perico:** está comentada en `index.html` con `<!-- -->`. El grid en `styles.css` usa `:has()` para ajustarse automáticamente. Verificar antes de tocar la sección `#team`.

---

## Estado

En producción. Sitio estable con 2 tarjetas de equipo visibles (Tomás Cárdenas y David Ardila). Último commit relevante: `ab38daa` (checklist de lanzamiento + objetivos táctiles). La fuente de verdad es `origin/main`.

## Skills recomendadas

Activar al trabajar en este proyecto (invocarlas o nombrarlas):

- frontend-patterns — patrones de UI y rendimiento.
- e2e-testing — Playwright.
- coding-standards — estandares JS y TS.
