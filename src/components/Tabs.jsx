import { useState } from "react";
import { F, SNACKS, it } from "../data.js";
import { dayPlan, fmt, macros, qty } from "../plan.js";
import { Chips, ItemList } from "./Bits.jsx";

const TABS = [["snacks", "Snacks"], ["equiv", "Reemplazos"], ["compras", "Lista de compras"], ["obj", "Tu objetivo"], ["evid", "Evidencia"]];

export default function Tabs({ S }) {
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
      <section className={cls("compras")} id="p-compras"><Shop S={S} /></section>
      <section className={cls("obj")} id="p-obj"><Objetivo /></section>
      <section className={cls("evid")} id="p-evid"><Evidencia /></section>
    </>
  );
}

function Snacks() {
  return (
    <>
      <h2>Snacks proteicos y saludables</h2>
      <p className="lede">Para cuando tengas hambre fuera de horario, o para reemplazar la merienda o el post-entreno. Cualquiera suma entre 10 y 25 g de proteína.</p>
      <div className="cards" id="snacks">
        {SNACKS.map((s) => (
          <div key={s.n} className="mini">
            <h3>{s.n}</h3>
            {s.note ? <p>{s.note}</p> : null}
            <ItemList items={s.items} />
            <Chips m={macros(s.items)} />
          </div>
        ))}
      </div>
      <div className="callout"><strong>Barrita casera (rinde 8).</strong> Mezclá 200 g de granola, 50 g de frutos secos picados, 2 bananas bien pisadas y 1 huevo. Estirá en una placa con papel manteca (2 cm de alto), horno a 180 °C 20–25 min, dejá enfriar y cortá. Aguanta 5 días en la heladera en un táper. Cada una: ~185 kcal, 24 g de carbos, 5 g de proteína.</div>
    </>
  );
}

function Equiv() {
  const Pq = [["Milanesa de pollo al horno","milapollo",160],["Milanesa de carne al horno","milacarne",165],["Bife magro","bife",135],["Huevos","huevo",6],["Yogur colado","yogcol",400]];
  const C = [["Arroz cocido","arroz",250],["Fideos cocidos","fideos",225],["Choclo en granos","choclo",330],["Tostadas de pan","tostada",5],["Bananas","banana",3]];
  return (
    <>
      <h2>Reemplazos equivalentes</h2>
      <p className="lede">Cambiá un alimento por otro de la misma fila sin romper los números del día. Todo pesado cocido.</p>
      <h3 style={{ margin: "14px 0 6px" }}>Proteína (≈ 35–40 g)</h3>
      <div className="scroll"><table><thead><tr><th>Opción</th><th>Cantidad</th><th>Proteína</th><th>kcal</th></tr></thead><tbody id="eqp">
        {Pq.map(([n, k, q]) => { const m = macros([it(k, q)]); return <tr key={k}><td>{n}</td><td className="n">{qty(it(k, q))}</td><td className="n">{m.p} g</td><td className="n">{m.k}</td></tr>; })}
        <tr><td colSpan={4} className="note">Seis huevos es mucho de una vez: mejor 3 huevos + 150 g de yogur colado.</td></tr>
      </tbody></table></div>
      <h3 style={{ margin: "20px 0 6px" }}>Carbohidratos (≈ 70 g)</h3>
      <div className="scroll"><table><thead><tr><th>Opción</th><th>Cantidad</th><th>Carbos</th><th>kcal</th></tr></thead><tbody id="eqc">
        {C.map(([n, k, q]) => { const m = macros([it(k, q)]); return <tr key={k}><td>{n}</td><td className="n">{qty(it(k, q))}</td><td className="n">{m.c} g</td><td className="n">{m.k}</td></tr>; })}
      </tbody></table></div>
      <div className="callout"><strong>Truco del yogur colado.</strong> Poné tu yogur casero en un colador con un lienzo o filtro de café, dentro de la heladera, 4 a 8 horas. Queda tipo griego y casi duplica la proteína por porción (de ~3,5 g a ~9 g cada 100 g). Es lo que hace que la merienda llegue a 20+ g de proteína.</div>
    </>
  );
}

function Shop({ S }) {
  const acc = {};
  for (let d = 0; d < 7; d++) dayPlan(S, d).forEach((x) => x.opt.items.forEach(({ k, q }) => { acc[k] = (acc[k] || 0) + q; }));
  const rows = Object.keys(acc).map((k) => {
    const q = acc[k]; let txt;
    if (k === "arroz") txt = Math.round(q / 2.8 / 50) * 50 + " g secos (≈ " + fmt(q) + " g cocido)";
    else if (k === "fideos") txt = Math.round(q / 2.3 / 50) * 50 + " g secos (≈ " + fmt(q) + " g cocido)";
    else if (k === "huevo") txt = q + " huevos (≈ " + Math.ceil(q / 12) + " docenas)";
    else if (k === "yogcol") txt = "≈ " + (Math.ceil(q * 2 / 1000 * 2) / 2).toLocaleString("es-AR") + " L de yogur casero para colar (" + fmt(q) + " g colado)";
    else if (k === "barrita") txt = q + " barritas (1 tanda de la receta rinde 8)";
    else if (k === "ensalada") txt = q + " porciones";
    else if (k === "aceite") txt = q + " cditas";
    else if (F[k][1] === "u") txt = q + " unidades";
    else if (F[k][1] === "ml") txt = (q / 1000).toLocaleString("es-AR") + " L";
    else if (k === "milapollo" || k === "milacarne" || k === "bife") txt = fmt(q) + " g cocido (≈ " + fmt(Math.round(q / 0.75 / 50) * 50) + " g crudo)";
    else txt = fmt(q) + " g";
    return [k, F[k][0], txt];
  });
  return (
    <>
      <h2>Lista de compras de la semana</h2>
      <p className="lede">Calculada con los días y opciones que tenés elegidos arriba. Arroz y fideos van en peso seco.</p>
      <div className="scroll"><table><thead><tr><th>Alimento</th><th>Cantidad</th></tr></thead><tbody id="shop">
        {rows.map((r) => <tr key={r[0]}><td>{r[1]}</td><td>{r[2]}</td></tr>)}
      </tbody></table></div>
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
      <p>Objetivo: <strong>masa muscular 42,7 kg</strong> (+5,3) y <strong>masa adiposa 15,3 kg</strong> (−1,5). Si el resto se mantiene, el peso termina cerca de <strong>79 kg</strong>. O sea: no es una dieta para bajar de peso, es para subir despacio y que casi todo sea músculo.</p>

      <h3 style={{ margin: "18px 0 6px" }}>Cómo se armaron los números</h3>
      <div className="scroll"><table>
        <tbody>
          <tr><td>Masa magra (peso − grasa)</td><td className="n">58,8 kg</td></tr>
          <tr><td>Metabolismo basal (Katch-McArdle, usa masa magra)</td><td className="n">≈ 1.640 kcal</td></tr>
          <tr><td>Gasto promedio con tu semana (3 gym, 2 rugby, partido)</td><td className="n">≈ 2.750–2.800 kcal</td></tr>
          <tr><td>Promedio del plan (leve superávit, ~5%)</td><td className="n">≈ 2.900 kcal</td></tr>
          <tr><td>Días de descanso y domingo</td><td className="n">≈ 2.550–2.600 kcal</td></tr>
          <tr><td>Días doble turno (mar, jue)</td><td className="n">≈ 3.200 kcal</td></tr>
          <tr><td>Proteína</td><td className="n">155–170 g (2,0–2,2 g/kg)</td></tr>
          <tr><td>Grasas</td><td className="n">70–95 g (0,9–1,2 g/kg)</td></tr>
          <tr><td>Carbohidratos</td><td className="n">3,7 g/kg descanso, 4,5 gym, 5,5–5,8 doble turno y partido</td></tr>
        </tbody>
      </table></div>

      <div className="callout"><strong>Expectativa realista.</strong> Con 5–6 años de gimnasio ya sos un levantador avanzado: el músculo sube lento. Un ritmo bien hecho ronda 0,25–0,35 kg de músculo por mes, así que los +5,3 kg son un objetivo de 15 a 20 meses, no de un trimestre. Bajar 1,5 kg de grasa en paralelo sí es alcanzable en los primeros meses.</div>

      <div className="scroll"><table>
        <thead><tr><th>Control</th><th>Masa muscular esperada</th><th>Masa adiposa esperada</th></tr></thead>
        <tbody>
          <tr><td>3 meses</td><td className="n">38,2–38,5 kg</td><td className="n">≈ 16,0 kg</td></tr>
          <tr><td>6 meses</td><td className="n">38,9–39,5 kg</td><td className="n">≈ 15,5 kg</td></tr>
          <tr><td>12 meses</td><td className="n">40,4–41,6 kg</td><td className="n">≈ 15,3 kg</td></tr>
          <tr><td>15–20 meses</td><td className="n">42,7 kg (objetivo)</td><td className="n">15,3 kg (objetivo)</td></tr>
        </tbody>
      </table></div>

      <h3 style={{ margin: "18px 0 6px" }}>Cómo ajustar cada 2 semanas</h3>
      <p>Pesate 3 mañanas por semana (en ayunas, después del baño) y mirá el promedio, no el dato suelto.</p>
      <div className="scroll"><table>
        <thead><tr><th>Si el promedio…</th><th>Hacé esto</th></tr></thead>
        <tbody>
          <tr><td>Sube 0,1–0,2 kg por semana</td><td>Vas bien. No toques nada.</td></tr>
          <tr><td>No se mueve y no subís cargas</td><td>Sumá ~150 kcal en días de entreno: +60 g de arroz/fideos cocidos o +1 banana.</td></tr>
          <tr><td>Sube más de 0,3 kg por semana</td><td>Sacá ~150 kcal: menos granola y 10 g menos de frutos secos.</td></tr>
          <tr><td>Baja</td><td>Estás en déficit: +200 kcal en carbohidratos hasta que se estabilice.</td></tr>
        </tbody>
      </table></div>
      <p className="note" style={{ marginTop: "10px" }}>No tengo tu altura ni tu edad, por eso usé una fórmula basada en masa magra. Es una estimación: el ajuste por tendencia de peso es lo que la corrige. Llevalo a tu nutricionista en el próximo control.</p>
    </>
  );
}

function Evidencia() {
  return (
    <>
      <h2>En qué se basa</h2>
      <ol className="src">
        <li><strong>Proteína diaria y por comida.</strong> La International Society of Sports Nutrition recomienda 1,4–2,0 g/kg/día para ganar músculo, 20–40 g por comida y repartirla cada 3–4 h. <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5477153/" target="_blank" rel="noopener">Jäger et al., JISSN 2017</a></li>
        <li><strong>Techo de beneficio.</strong> Meta-análisis de 49 estudios: por encima de ~1,6 g/kg el aumento de masa magra se aplana, con un margen de confianza que llega a ~2,2 g/kg. Por eso el plan apunta a 2,0–2,2: cubre el techo sin exagerar. <a href="https://bjsm.bmj.com/keyword/whey" target="_blank" rel="noopener">Morton et al., BJSM 2018</a></li>
        <li><strong>Superávit, grasas y carbohidratos.</strong> Para ganar músculo sin sumar grasa: superávit de 10–20% (los avanzados, más conservador), subir 0,25–0,5% del peso por semana, grasas 0,5–1,5 g/kg, carbohidratos de al menos 3–5 g/kg y proteína 0,40–0,55 g/kg por comida en 3–6 comidas, incluyendo antes y después de entrenar. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6680710/" target="_blank" rel="noopener">Iraki et al., Sports 2019</a></li>
        <li><strong>Recomposición en gente entrenada.</strong> Revisión que muestra que personas ya entrenadas sí pueden ganar músculo y perder grasa a la vez, siempre que combinen entrenamiento de fuerza progresivo con proteína alta; también remarca el peso del sueño y los límites de los métodos de medición. <a href="https://doi.org/10.1519/SSC.0000000000000584" target="_blank" rel="noopener">Barakat et al., Strength &amp; Conditioning Journal 2020</a></li>
        <li><strong>Previa y día de partido.</strong> Subir carbohidratos 36–48 h antes, comida alta en carbohidratos y fácil de digerir unas 3 h antes del partido (1–4 g/kg), snack chico cerca del inicio y recuperación con proteína y carbohidratos apenas termina. Los profesionales llegan a 10–12 g/kg en la previa; acá se sube a ~5,5–6 g/kg porque tu objetivo también incluye bajar grasa. <a href="https://www.optimumnutrition.com/en-gb/blogs/advice-uk/fuelling-victory-uk" target="_blank" rel="noopener">Guía de nutrición para rugby (Evans)</a> y <a href="https://www.gssiweb.org/sports-science-exchange/article/sse-127-carbohydrate-the-football-fuel" target="_blank" rel="noopener">GSSI SSE 127</a></li>
        <li><strong>Dormir poco.</strong> Una sola noche sin dormir bajó 18% la síntesis de proteína muscular, subió el cortisol y bajó la testosterona al día siguiente. Por eso el domingo mantiene la proteína alta y repartida. <a href="https://pubmed.ncbi.nlm.nih.gov/33400856/" target="_blank" rel="noopener">Lamon et al., Physiological Reports 2021</a></li>
        <li><strong>Alcohol post-partido.</strong> Tomar alcohol después de un esfuerzo intenso reduce la síntesis de proteína muscular aun comiendo proteína (Parr et al., PLoS One 2014).</li>
        <li><strong>Agua.</strong> La base para un hombre adulto ronda 2,5 L por día entre bebidas y comida (EFSA), y el entrenamiento suma lo que se pierde en sudor, que en rugby puede ser 0,5–1,5 L por hora. Por eso: 3 termos en días libres, 4 con gimnasio o previa, 5 con doble turno o partido. Guiate también por el color: orina amarillo clarito es la señal de que vas bien. El mate suma, pero no reemplaza a los termos.</li>
        <li><strong>Agua.</strong> El American College of Sports Medicine plantea llegar al entrenamiento bien hidratado tomando líquido varias horas antes, y durante el esfuerzo evitar perder más de 2% del peso por sudor. Como la sudoración cambia mucho entre personas, recomienda estimarla pesándose antes y después de entrenar. Por eso los termos se concentran antes y durante gym, rugby y partido. <a href="https://pubmed.ncbi.nlm.nih.gov/17277604/" target="_blank" rel="noopener">ACSM, Med Sci Sports Exerc 2007</a></li>
        <li><strong>Creatina (opcional).</strong> Es el suplemento con más respaldo para fuerza y masa muscular: 3–5 g por día, todos los días, con cualquier comida. Iraki 2019 y la posición de la ISSN coinciden en la dosis.</li>
      </ol>
      <div className="callout">Lo que más mueve la aguja, en orden: entrenar con progresión de cargas, llegar a la proteína diaria, dormir 7–9 horas y sostener el plan varias semanas. El horario exacto de cada comida importa mucho menos.</div>
    </>
  );
}
