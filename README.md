# Plan Nutrición

PWA instalable del plan de comidas semanal para recomposición corporal: comidas con opciones, ítems comidos, comidas salteadas con compensación, termos de agua, entrenamientos, resumen y cierre del día. Todo se guarda en `localStorage` y funciona offline.

Hecha con Vite + React + `vite-plugin-pwa`. El HTML original está en [`referencia/`](referencia/plan-comidas-recomposicion.html).

```bash
npm install
npm run dev       # desarrollo
npm run build     # build de producción en dist/
npm run preview   # sirve dist/ (con service worker) en http://localhost:4173
npm run icons     # regenera los íconos de public/
```
