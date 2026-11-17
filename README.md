# FlorSync Demo 🌸

Demo simplificada de un **sistema de gestión de florería** creada para portafolio:
inventario, ventas, clientes, categorías y un dashboard con gráficas.

> **Sin autenticación.** No hay login ni roles: cualquier visitante puede entrar,
> probar todo el flujo y restablecer los datos de ejemplo cuando quiera.
> Una demo pública con login obliga a crear cuentas y nadie llega a probarla.

---

## Stack

| Capa | Tecnología |
|------|------------|
| Backend | Python · Django 5.1 · Django REST Framework |
| Base de datos | SQLite en local · **Supabase (PostgreSQL)** en producción |
| Frontend | React 19 · Vite · Tailwind CSS 4 · Recharts · Framer Motion |
| Comunicación | Axios con proxy de Vite (`/api` → `localhost:8000`) |
| Despliegue | **Vercel** (frontend) · **Render** (backend) |

## Funcionalidades

- **Pantalla de inicio** — misma estética que la versión completa (carrusel de flores
  y card con el nombre de la app), pero con un botón **"PROBAR DEMO"** en lugar de
  login: un clic y entras al sistema.
- **Dashboard** — resumen de ventas, gráfica diaria/semanal/mensual, productos más
  vendidos, ventas por vendedor y alerta de stock bajo.
- **Inventario** — CRUD de productos con búsqueda, filtro por categoría y ajuste de stock.
- **Ventas** — registro de ventas con carrito, método de pago y descuento automático de stock;
  historial consultable por fecha.
- **Clientes** — CRUD de clientes con búsqueda y baja lógica.
- **Categorías** — alta/baja de categorías de productos.
- **Botón "Restablecer datos"** — recarga los datos de ejemplo en cualquier momento.

## Cómo correrlo en local

Necesitas [Python 3.10+](https://python.org) y [Node.js 18+](https://nodejs.org).

### 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # en macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo    # carga ~30 productos, 15 clientes y ~300 ventas
python manage.py runserver
```

El API queda en `http://127.0.0.1:8000/api/`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre **http://localhost:5173** — aparece la pantalla de inicio con el botón
**"PROBAR DEMO"**; un clic te lleva al dashboard. El proxy de Vite envía
`/api` al backend, así que no hace falta configurar nada más.

Para volver a la pantalla de inicio desde dentro de la app, abre el menú `?`
de la barra superior y elige **"Volver al inicio"**.

> **Atajo:** `start-dev.ps1` en la raíz del proyecto levanta backend y frontend
> a la vez en dos ventanas (doble clic).

## Despliegue en producción

Arquitectura: **Vercel** (frontend) + **Render** (backend) + **Supabase** (PostgreSQL).

### 1. Supabase — base de datos

1. Crea un proyecto en [supabase.com](https://supabase.com) (tier gratis).
2. En **Project Settings → Database**, copia el *Connection string* (URI) del
   **pooler** (puerto `6543`, no el directo).

### 2. Render — backend

El repo trae un **Blueprint** (`render.yaml`) que define todo el servicio:

1. En [render.com](https://render.com) → **New → Blueprint** → conecta tu repo de GitHub.
2. Render lee `render.yaml` y crea el servicio `florsync-demo-api`.
3. En **Environment → DATABASE_URL**, pega el connection string de Supabase.
   > El build ejecuta `migrate` + `seed_demo`, así que cada deploy deja la demo
   > con sus datos de ejemplo (idempotente, no duplica).

Variables ya definidas en el blueprint: `DJANGO_DEBUG=false`,
`DJANGO_SECRET_KEY` (generado), `ALLOWED_HOSTS`, `PYTHON_VERSION`.

### 3. Vercel — frontend

1. Crea un proyecto en [vercel.com](https://vercel.com) importando el repo.
2. **Root Directory:** `frontend` · Framework: **Vite** (detectado solo).
3. Env var: `VITE_API_URL=https://florsync-demo-api.onrender.com/api/`
4. Deploy. El `frontend/vercel.json` incluye el rewrite SPA para que las rutas
   (`/dashboard`, `/inventario`…) no den 404 al recargar.

### Variables de entorno del backend

| Variable | Local (default) | Producción |
|----------|-----------------|------------|
| `DJANGO_SECRET_KEY` | insegura (dev) | generada por Render |
| `DJANGO_DEBUG` | `true` | `false` |
| `ALLOWED_HOSTS` | `*` | dominio `.onrender.com` |
| `DATABASE_URL` | ausente → SQLite | connection string de Supabase |

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/ventas/dashboard/?view=day\|week\|month&offset=0` | Datos del dashboard |
| GET/POST | `/api/productos/` | Listar / crear productos |
| GET/POST | `/api/clientes/` | Listar / crear clientes |
| GET/POST | `/api/categorias/` | Listar / crear categorías |
| POST | `/api/ventas/realizar-ventas/` | Registrar una venta |
| GET | `/api/ventas/obtener_ventas/?fecha=YYYY-MM-DD` | Historial de ventas |
| POST | `/api/demo/reset/` | Restablecer los datos de ejemplo |

## Estructura

```
florsync-demo/
├── backend/
│   ├── florsync/              # configuración Django (env vars, SQLite/Supabase)
│   ├── api/                   # categorías + reset de la demo
│   ├── productos/             # modelos y API de productos
│   ├── clientes/              # modelos y API de clientes
│   ├── ventas/                # modelos, API de ventas y dashboard
│   └── manage.py
├── frontend/
│   ├── vercel.json            # rewrite SPA para Vercel
│   └── src/
│       ├── pages/             # Landing, Dashboard, Inventario, Ventas, Clientes, Categorías
│       ├── components/iu/     # tablas, modales, gráficas, carrusel, sidebar, topbar
│       ├── api/               # cliente Axios
│       └── data/              # menú y títulos de ruta
├── render.yaml                # Blueprint de Render (backend)
├── start-dev.ps1              # levanta backend + frontend en local
└── README.md
```

## Datos de ejemplo

`python manage.py seed_demo` crea de forma determinista:

- 8 categorías de flores
- 30 productos con precios en COP
- 15 clientes
- ~300 ventas distribuidas en los últimos 90 días (con más actividad los fines de semana)
- 4 productos con stock bajo para mostrar la alerta

El comando es **idempotente**: se puede ejecutar cuantas veces se quiera sin duplicar datos.

## Decisiones de diseño

- **SQLite en vez de Postgres/Docker** — la demo arranca con un solo comando.
- **Sin JWT ni sesiones** — todo el API es público (`AllowAny`); el botón de reset
  permite dejar la demo limpia si alguien la ensucia.
- **`vendedor` como texto** en lugar de usuario relacionado — se conserva la gráfica
  de "ventas por vendedor" sin necesidad de tablas de usuarios ni autenticación.
- **Soft-delete** — productos, clientes y categorías se desactivan (`activo=False`)
  para no romper el historial de ventas.
