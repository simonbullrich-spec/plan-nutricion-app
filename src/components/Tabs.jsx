import { useState } from "react";
import { SNACKS, it } from "../data.js";
import { macros, qty } from "../plan.js";
import { Chips, ItemList } from "./Bits.jsx";

const TABS = [["snacks", "Snacks"], ["equiv", "Reemplazos"], ["obj", "Tu objetivo"]];

export default function Tabs() {
  const [tab, setTab] = useState("snacks");
  const cls = (p) => "panel" + (tab === p ? " on" : "");
  return (
    <>
      <div className="tabs" role="tablist">
        {TABS.map(([p, label]) => (
          <button key={p} className="tab" role="tab" aria-selected={tab === p} data-p={p} onClick={() => setTab(p)}>{label}</button>
        ))}
      </div>
      <section className={cls("snacks")} id="p-snacks"><Snacks /></section>
      <section className={cls("equiv")} id="p-equiv"><Equiv /></section>
      <section className={cls("obj")} id="p-obj"><Objetivo /></section>
    </>
  );
}

function Snacks() {
  return (
    <>
      <h2>Snacks proteicos</h2>
      <div className="cards" id="snacks">
        {SNACKS.map((s) => (
          <div key={s.n} className="mini">
            <h3>{s.n}</h3>
            <ItemList items={s.items} />
            <Chips m={macros(s.items)} />
          </div>
        ))}
      </div>
      <div className="callout"><strong>Barrita casera (rinde 8).</strong> 200 g de granola, 50 g de frutos secos picados, 2 bananas pisadas y 1 huevo. En placa con papel manteca, 2 cm de alto, 180 °C 20–25 min. Dura 5 días en la heladera.</div>
    </>
  );
}

function Equiv() {
  const Pq = [["Milanesa de pollo al horno","milapollo",160],["Milanesa de carne al horno","milacarne",165],["Bife magro","bife",135],["Huevos","huevo",6],["Yogur colado","yogcol",400]];
  const C = [["Arroz cocido","arroz",250],["Fideos cocidos","fideos",225],["Choclo en granos","choclo",330],["Tostadas de pan","tostada",5],["Bananas","banana",3]];
  return (
    <>
      <h2>Reemplazos equivalentes</h2>
      <h3 style={{ margin: "14px 0 6px" }}>Proteína (≈ 35–40 g)</h3>
      <div className="scroll"><table><thead><tr><th>Opción</th><th>Cantidad</th><th>Proteína</th><th>kcal</th></tr></thead><tbody id="eqp">
        {Pq.map(([n, k, q]) => { const m = macros([it(k, q)]); return <tr key={k}><td>{n}</td><td className="n">{qty(it(k, q))}</td><td className="n">{m.p} g</td><td className="n">{m.k}</td></tr>; })}
      </tbody></table></div>
      <h3 style={{ margin: "20px 0 6px" }}>Carbohidratos (≈ 70 g)</h3>
      <div className="scroll"><table><thead><tr><th>Opción</th><th>Cantidad</th><th>Carbos</th><th>kcal</th></tr></thead><tbody id="eqc">
        {C.map(([n, k, q]) => { const m = macros([it(k, q)]); return <tr key={k}><td>{n}</td><td className="n">{qty(it(k, q))}</td><td className="n">{m.c} g</td><td className="n">{m.k}</td></tr>; })}
      </tbody></table></div>
      <div className="callout"><strong>Yogur colado.</strong> Yogur casero en un colador con lienzo o filtro de café, en la heladera 4 a 8 horas.</div>
    </>
  );
}

function Objetivo() {
  return (
    <>
      <h2>Tus números</h2>
      <div className="stat">
        <div><b>75,6</b><span>kg peso</span></div>
        <div><b>37,4</b><span>kg masa muscular</span></div>
        <div><b>16,8</b><span>kg masa adiposa (22%)</span></div>
      </div>
      <p>Objetivo: <strong>masa muscular 42,7 kg</strong> (+5,3) y <strong>masa adiposa 15,3 kg</strong> (−1,5). Peso final ≈ <strong>79 kg</strong>.</p>

      <h3 style={{ margin: "18px 0 6px" }}>Números del plan</h3>
      <div className="scroll"><table>
        <tbody>
          <tr><td>Masa magra (peso − grasa)</td><td className="n">58,8 kg</td></tr>
          <tr><td>Metabolismo basal</td><td className="n">≈ 1.640 kcal</td></tr>
          <tr><td>Gasto promedio semanal</td><td className="n">≈ 2.750–2.800 kcal</td></tr>
          <tr><td>Promedio del plan</td><td className="n">≈ 2.900 kcal</td></tr>
          <tr><td>Días de descanso y domingo</td><td className="n">≈ 2.550–2.600 kcal</td></tr>
          <tr><td>Días doble turno (mar, jue)</td><td className="n">≈ 3.200 kcal</td></tr>
          <tr><td>Proteína</td><td className="n">155–170 g (2,0–2,2 g/kg)</td></tr>
          <tr><td>Grasas</td><td className="n">70–95 g (0,9–1,2 g/kg)</td></tr>
          <tr><td>Carbohidratos</td><td className="n">3,7 g/kg descanso, 4,5 gym, 5,5–5,8 doble turno y partido</td></tr>
        </tbody>
      </table></div>

      <h3 style={{ margin: "18px 0 6px" }}>Progreso esperado</h3>
      <div className="scroll"><table>
        <thead><tr><th>Control</th><th>Masa muscular</th><th>Masa adiposa</th></tr></thead>
        <tbody>
          <tr><td>3 meses</td><td className="n">38,2–38,5 kg</td><td className="n">≈ 16,0 kg</td></tr>
          <tr><td>6 meses</td><td className="n">38,9–39,5 kg</td><td className="n">≈ 15,5 kg</td></tr>
          <tr><td>12 meses</td><td className="n">40,4–41,6 kg</td><td className="n">≈ 15,3 kg</td></tr>
          <tr><td>15–20 meses</td><td className="n">42,7 kg (objetivo)</td><td className="n">15,3 kg (objetivo)</td></tr>
        </tbody>
      </table></div>

      <h3 style={{ margin: "18px 0 6px" }}>Ajuste cada 2 semanas</h3>
      <p>Promedio de 3 pesadas por semana, en ayunas.</p>
      <div className="scroll"><table>
        <thead><tr><th>Si el promedio…</th><th>Hacé esto</th></tr></thead>
        <tbody>
          <tr><td>Sube 0,1–0,2 kg por semana</td><td>Nada.</td></tr>
          <tr><td>No se mueve y no subís cargas</td><td>+150 kcal en días de entreno: +60 g de arroz/fideos cocidos o +1 banana.</td></tr>
          <tr><td>Sube más de 0,3 kg por semana</td><td>−150 kcal: menos granola y 10 g menos de frutos secos.</td></tr>
          <tr><td>Baja</td><td>+200 kcal en carbohidratos.</td></tr>
        </tbody>
      </table></div>
    </>
  );
}
