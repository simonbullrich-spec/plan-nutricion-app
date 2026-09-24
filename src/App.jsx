import { useEffect, useState } from "react";
import { loadState, saveState } from "./plan.js";
import { Days, DayBox, Summary } from "./components/Week.jsx";
import Meals from "./components/Meals.jsx";
import Tabs from "./components/Tabs.jsx";

export default function App() {
  const [S, setS] = useState(loadState);
  // comidas abiertas para destildar ítems (no se guarda, igual que en el original)
  const [open, setOpenSet] = useState(() => new Set());

  useEffect(() => { saveState(S); }, [S]);

  const upd = (fn) => setS((prev) => { const n = structuredClone(prev); fn(n); return n; });
  const setOpen = (key, on) => setOpenSet((prev) => { const n = new Set(prev); on ? n.add(key) : n.delete(key); return n; });
  const act = { S, upd, open, setOpen, cdone: (k, v) => upd((n) => { n.cdone[k] = v; }) };

  const reset = () => upd((n) => { n.done = {}; n.tr = {}; n.wa = {}; n.skip = {}; n.eat = {}; n.cdone = {}; n.closed = {}; });

  return (
    <div className="wrap">
      <h1>Plan de comidas para recomposición</h1>
      <p className="lede">Más músculo, algo menos de grasa, con lo que ya comés. Armado sobre tu semana real: facultad, gimnasio, rugby y partido del sábado. Elegí el día y marcá comidas, entrenamientos y termos a medida que los completás.</p>

      <Days S={S} onSelect={(i) => upd((n) => { n.sel = i; })} />
      <DayBox d={S.sel} />
      <Summary S={S} d={S.sel} />

      <Meals act={act} />

      <Tabs S={S} />

      <button className="btn reset" id="reset" type="button" onClick={reset}>Desmarcar toda la semana (comidas, entrenamientos y agua)</button>
      <p className="foot">Valores nutricionales aproximados (tablas estándar, alimentos cocidos). Es una guía de organización, no reemplaza el control con tu nutricionista.</p>
    </div>
  );
}
