import { LETTER, W } from "../data.js";
import { dayPlan, fmt, missing, timeline, total } from "../plan.js";

export function Days({ S, onSelect }) {
  let sum = 0;
  for (let i = 0; i < 7; i++) sum += total(S, dayPlan(S, i)).k;
  return (
    <>
      <div className="days" id="days" role="group" aria-label="Día de la semana">
        {W.map((w, i) => {
          const T = total(S, dayPlan(S, i));
          return (
            <button key={i} type="button" className="day" aria-pressed={i === S.sel} aria-label={w.title} onClick={() => onSelect(i)}>
              <b>{LETTER[i]}</b><span>{fmt(Math.round(T.k / 10) * 10)}</span>
            </button>
          );
        })}
      </div>
      <p className="weekavg" id="weekavg" style={{ margin: "0 0 14px" }}>
        {"Promedio semanal: " + fmt(Math.round(sum / 7)) + " kcal por día. Debajo de cada letra, las kcal de ese día."}
      </p>
    </>
  );
}

export function DayBox({ d }) {
  const w = W[d];
  return (
    <section className="daybox" id="daybox">
      <h2>{w.title}</h2>
      <div className="acts">{w.acts.map((a, i) => <span key={i} className={"act " + a[1]}>{a[0]}</span>)}</div>
      <ul className="tips">{w.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
    </section>
  );
}

// Resumen verde fijo: comidas, termos y entrenamientos del día
export function Summary({ S, d }) {
  const tl = timeline(S, d), c = (t) => tl.filter((i) => i.type === t), ok = (a) => a.filter((i) => S.done[i.key]).length;
  const cell = (label, a, extra) => {
    const n = ok(a), t = a.length, full = n === t;
    return (
      <div className={"sum-cell" + (full ? " full" : "")}>
        <span className="sum-label">{label}</span>
        <b>{n}<small>/{t}</small></b>
        <div className="sum-track"><div style={{ width: (t ? n / t * 100 : 0) + "%" }}></div></div>
        {extra ? <span className="sum-extra">{extra}</span> : null}
      </div>
    );
  };
  const m = c("meal"), w = c("water"), g = c("gym");
  const litros = (ok(w) * 0.94).toFixed(1).replace(".", ",") + " de " + (w.length * 0.94).toFixed(1).replace(".", ",") + " L";
  const sk = m.filter((i) => S.skip[i.key]).length, pa = m.filter((i) => missing(S, i.x).length).length;
  const mealExtra = [sk ? sk + (sk > 1 ? " salteadas" : " salteada") : "", pa ? pa + (pa > 1 ? " parciales" : " parcial") : ""].filter(Boolean).join(", ");
  return (
    <div className="summary" id="summary" aria-live="polite">
      <div className={"sum-grid" + (g.length ? "" : " two")}>
        {cell("Comidas", m, mealExtra)}
        {cell("Termos", w, litros)}
        {g.length ? cell("Entrenamientos", g) : null}
      </div>
    </div>
  );
}
