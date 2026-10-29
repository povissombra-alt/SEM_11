# Fintra · Caso Práctico A

SPA de gestión de gastos construida con **React 18 + Vite + React Router 6**. Simula una app bancaria personal con panel, movimientos, ahorros, perfil y ajustes.

## Ejecutar

```bash
npm install
npm run dev
```

La app se abre en `http://localhost:5173`.

Para comprobar la versión de producción:

```bash
npm run build
npm run preview
```

## Qué incluye

- **Resumen**: saldo, ingresos, gastos, ahorro, gráfica de flujo de caja, donut por categorías, últimos movimientos y metas.
- **Movimientos**: búsqueda, filtros por tipo/categoría/periodo, paginación, eliminación y exportación CSV.
- **Ahorros**: progreso global, gráfica de evolución, metas, proyección y aportes que descuentan saldo real del estado.
- **Perfil**: edición de datos, resumen de cuenta, seguridad y accesos rápidos.
- **Ajustes**: moneda, vista compacta, ocultar importes, notificaciones y restablecimiento de la demo.
- **Persistencia**: movimientos, saldo, metas, perfil y ajustes se guardan en `localStorage`.
- **Responsive**: sidebar fijo en escritorio, menú lateral deslizante en móvil, tablas adaptadas y modales accesibles con `Esc`.

## Arquitectura SPA

`Layout` mantiene el sidebar y el topbar montados. Las rutas hijas se renderizan con `<Outlet />`, por lo que al navegar solo cambia el contenido central: no hay recarga completa ni parpadeo.

```
src/
  App.jsx                  Rutas de React Router
  main.jsx                 Entrypoint + BrowserRouter
  context/
    FinanceContext.jsx     Estado global, cálculos y persistencia
  components/
    Layout.jsx             Shell persistente con Outlet
    Sidebar.jsx
    Topbar.jsx
    TrendChart.jsx         Gráficas SVG sin librerías externas
    CategoryDonut.jsx
    AddTransactionModal.jsx
    ...
  pages/
    Dashboard.jsx
    Movements.jsx
    Savings.jsx
    Profile.jsx
    Settings.jsx
    NotFound.jsx
  styles/                  Sistema visual dividido por responsabilidad
```

### Rutas

| Ruta | Vista |
| --- | --- |
| `/` | Resumen |
| `/movimientos` | Movimientos |
| `/ahorros` | Ahorros y metas |
| `/perfil` | Perfil |
| `/ajustes` | Ajustes |
| `/graficas` | Redirección a `/ahorros` |

## Notas

- No hay backend ni llamadas de red. Los datos de demo se generan en `src/data.js`.
- El saldo parte de 12.480,50 € y cambia al añadir movimientos o aportar a metas.
- Para desplegar en un hosting estático, configura un fallback de todas las rutas hacia `index.html` (por ejemplo, en Netlify `_redirects`: `/* /index.html 200`).
- El proyecto incluye archivos de una variante paralela que **no se importan** desde el entrypoint actual. No se han eliminado.
