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

      <Days S={S} onSelect={(i) => upd((n) => { n.sel = i; })} />
      <DayBox d={S.sel} />
      <Summary S={S} d={S.sel} />

      <Meals act={act} />

      <Tabs />

      <button className="btn reset" id="reset" type="button" onClick={reset}>Desmarcar toda la semana</button>
    </div>
  );
}
