# Plan Nutrición

PWA instalable con dos secciones, elegibles desde la pantalla de inicio:

- **Nutrición:** plan de comidas semanal para recomposición corporal: comidas con opciones, ítems comidos, comidas salteadas con compensación, termos de agua, entrenamientos, resumen y cierre del día.
- **Sueño:** plan de sueño semanal, calculadora de horas y recomendaciones.

Todo se guarda en `localStorage` y funciona offline. Hecha con Vite + React + `vite-plugin-pwa`. Los HTML originales están en [`referencia/`](referencia/).

```bash
npm install
npm run dev       # desarrollo
npm run build     # build de producción en dist/
npm run preview   # sirve dist/ (con service worker) en http://localhost:4173
npm run icons     # regenera los íconos de public/
```
