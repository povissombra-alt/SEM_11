# Fintra · Caso Práctico A — Gestión de Gastos

SPA (Single Page Application) para consultar movimientos bancarios, ver gráficas de ahorro y
gestionar el perfil del usuario **en tiempo real**, sin recargas de página.

Construida con **React 18 + Vite 5 + React Router 6**, sin backend: los datos son simulados y se
actualizan solos cada 12 segundos.

---

## 1. Cómo ejecutarlo

Requisitos: **Node.js 18 o superior** y npm.

```powershell
cd C:\Users\Admin-ETI\Downloads\Caso_A\fintra-spa
npm install
npm run dev
```

Vite abre el navegador automáticamente en:

```
http://localhost:5173
```

Si no se abre solo, entra manualmente a esa dirección.

### Versión de producción (opcional)

```powershell
npm run build
npm run preview
```

`npm run build` genera `dist/` y `npm run preview` la sirve en `http://localhost:4173`.

---

## 2. Por qué es una SPA (la guía del caso)

En una SPA, el **enrutado se maneja internamente** con React Router: el navegador **nunca pide un
archivo HTML nuevo al servidor**, solo cambia lo que se muestra en pantalla.

Cómo se aplica aquí:

- Todas las vistas son rutas de React Router:
  - `/` → Panel general
  - `/movimientos` → Historial y filtros
  - `/graficas` → Análisis de ahorro y gastos
  - `/perfil` → Datos personales
  - `/ajustes` → Preferencias, seguridad y panel SPA
- `<NavLink>` y `<Link>` interceptan el clic, actualizan la URL con la **History API** y renderizan
  únicamente el componente de la ruta.
- El **layout** (menú lateral + cabecera) se monta una sola vez. Al pasar de `/perfil` a
  `/ajustes` no se vuelve a montar ni parpadea en blanco.
- El estado global (saldo, movimientos, perfil, privacidad) vive en un contexto de React, así que
  se comparte entre vistas sin recargar.

### Cómo comprobarlo dentro de la propia app

Entra en **Ajustes** (`/ajustes`) y mira el panel “Modo SPA activo”:

| Métrica | Qué demuestra |
| --- | --- |
| Tiempo de sesión | La sesión sigue viva sin recargas |
| Vistas visitadas | Navegación interna acumulada |
| Montajes del layout | El menú y la cabecera se montaron una sola vez |
| Recargas de página | 0 desde que abriste la app |

También puedes abrir DevTools (F12) → **Network** y filtrar por `Doc`: al navegar entre rutas no
aparece ninguna petición de documento HTML nueva.

---

## 3. Funcionalidades

- **Panel general**: saldo disponible, ingresos, gastos y ahorro del mes con comparativas; gráfica
  de evolución del ahorro; dona de gastos por categoría; últimos movimientos.
- **Movimientos**: buscador, filtros por tipo, mes y categoría, totales filtrados y formulario para
  añadir un movimiento nuevo.
- **Gráficas**: selector de periodo (3, 6 o 12 meses), área de ahorro acumulado, comparativa de
  ingresos vs. gastos, reparto por categorías y datos clave (media mensual, gasto diario, mayor
  gasto, etc.).
- **Perfil**: edición de datos personales y meta de ahorro. Los cambios se reflejan al instante en
  la cabecera, el menú y el saludo (y se guardan en `localStorage`).
- **Ajustes**: preferencias con interruptores, modo privacidad (oculta todos los importes), pausa
  de los datos en vivo, seguridad simulada y panel de verificación SPA.
- **Tiempo real simulado**: cada 12 segundos entra un movimiento nuevo; se actualizan saldo,
  gráficas y notificaciones, y aparece un aviso flotante. Se puede pausar desde la cabecera o
  desde Ajustes.
- **Responsive**: menú lateral deslizante en móvil, tablas con scroll y gráficas adaptables.
- **Gráficas sin librerías**: los componentes `AreaChart`, `BarChart` y `DonutChart` están hechos
  con SVG propio.

---

## 4. Estructura del proyecto

```
fintra-spa/
├─ index.html
├─ package.json
├─ vite.config.js
└─ src/
   ├─ main.jsx              # Punto de entrada
   ├─ App.jsx               # Layout + rutas (React Router)
   ├─ styles.css            # Tema visual completo
   ├─ context/
   │  └─ AppContext.jsx     # Estado global + simulación en tiempo real
   ├─ data/
   │  └─ seed.js            # Usuario, categorías y 13 meses de movimientos
   ├─ lib/
   │  ├─ format.js          # Formato de moneda, fechas, duraciones
   │  └─ selectors.js       # Cálculos: saldo, series, estadísticas
   ├─ components/
   │  ├─ Sidebar.jsx
   │  ├─ Topbar.jsx
   │  ├─ StatCard.jsx
   │  ├─ AreaChart.jsx
   │  ├─ BarChart.jsx
   │  ├─ DonutChart.jsx
   │  ├─ TransactionTable.jsx
   │  ├─ MovementModal.jsx
   │  ├─ Toasts.jsx
   │  └─ Icons.jsx
   └─ pages/
      ├─ Dashboard.jsx
      ├─ Movimientos.jsx
      ├─ Graficas.jsx
      ├─ Perfil.jsx
      └─ Ajustes.jsx
```

---

## 5. Notas de la demo

- No hay backend ni autenticación real: “Cerrar sesión” y “Cambiar contraseña” son avisos
  simulados.
- El perfil se guarda en `localStorage`; el resto de los datos se regenera al recargar. En
  **Ajustes → Restablecer datos de la demo** todo vuelve al estado inicial.
- Los movimientos se generan con una semilla fija, por lo que las cifras son estables entre
  recargas.
- Si despliegas `dist/` en un hosting estático, configura un *fallback* de todas las rutas a
  `index.html` para que recargar directamente en `/perfil` o `/ajustes` funcione. En desarrollo y
  con `npm run preview`, Vite ya lo hace.
