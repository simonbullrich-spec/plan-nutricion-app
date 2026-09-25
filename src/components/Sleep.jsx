import { useEffect, useState } from "react";
import "./sleep.css";

// Cada día es la mañana en que te despertás; la hora de dormir es la de la noche anterior.
const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const WEEKDAY_WAKE = 7 * 60 + 25; // lunes a viernes: 7:25
const isWeekend = (d) => d >= 5;

// valores iniciales (en minutos desde las 00:00), tomados del plan original
const DEFAULT = {
  bed:  [60, 30, 30, 0, 30, 60, 360],   // noche anterior
  wake: [null, null, null, null, null, 600, 720], // solo sábado y domingo
};

const KEY = "plan-sueno-v1";
function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.bed && s.wake) return s; } catch (e) {}
  return structuredClone(DEFAULT);
}

const TIERS = [
  { min: 480, title: "Óptimo", color: "var(--ok)", bg: "var(--ok-bg)" },
  { min: 420, title: "Bueno", color: "var(--good)", bg: "var(--good-bg)" },
  { min: 360, title: "Regular", color: "var(--warn)", bg: "var(--warn-bg)" },
  { min: 300, title: "Bajo", color: "var(--low)", bg: "var(--low-bg)" },
  { min: 0, title: "Crítico", color: "var(--crit)", bg: "var(--crit-bg)" },
];
const tierOf = (mins) => TIERS.find((t) => mins >= t.min);

const pad = (n) => n.toString().padStart(2, "0");
const hhmm = (m) => pad(Math.floor(m / 60) % 24) + ":" + pad(m % 60);
const dur = (m) => Math.floor(m / 60) + "h" + pad(m % 60);
// opciones cada 5 min desde startH hasta endH (cruzando la medianoche si hace falta)
function timeOptions(startH, endH) {
  const out = [], total = ((endH - startH + 24) % 24) * 60;
  for (let i = 0; i <= total; i += 5) out.push((startH * 60 + i) % 1440);
  return out;
}
const BED_WEEKDAY = timeOptions(20, 4), BED_WEEKEND = timeOptions(20, 9), WAKE_WEEKEND = timeOptions(6, 15);

function sleepOf(S, d) {
  const bed = S.bed[d], wake = isWeekend(d) ? S.wake[d] : WEEKDAY_WAKE;
  let mins = wake - bed; if (mins <= 0) mins += 1440;
  return { bed, wake, mins };
}

// barra sobre un eje de 18:00 a 14:00 del día siguiente (20 h)
const TICKS = ["18", "22", "02", "06", "10", "14"];
function Bar({ s }) {
  const left = ((s.bed - 18 * 60 + 1440) % 1440) / 1200 * 100;
  const width = Math.min(s.mins / 1200 * 100, 100 - left);
  return (
    <>
      <div className="sl-track">
        <div className="sl-block" style={{ left: left + "%", width: width + "%", background: tierOf(s.mins).color }} data-dur={dur(s.mins)}></div>
      </div>
      <div className="sl-ticks">{TICKS.map((t) => <span key={t}>{t}</span>)}</div>
    </>
  );
}

function TimeSelect({ id, label, value, options, onChange }) {
  return (
    <div className="sl-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(+e.target.value)}>
        {options.map((v) => <option key={v} value={v}>{hhmm(v)}</option>)}
      </select>
    </div>
  );
}

function Week({ S, openDay }) {
  const avg = Math.round(DAYS.reduce((a, _, d) => a + sleepOf(S, d).mins, 0) / 7);
  return (
    <>
      <div className="sl-avg"><span>Promedio semanal</span><b>{dur(avg)}</b></div>
      {DAYS.map((name, d) => {
        const s = sleepOf(S, d), t = tierOf(s.mins);
        return (
          <button key={d} type="button" className="sl-day-card" style={{ borderLeftColor: t.color }} onClick={() => openDay(d)}>
            <div className="sl-day-top">
              <h3>{name}</h3>
              <span className="sl-pill">{hhmm(s.bed)} → {hhmm(s.wake)}</span>
            </div>
            <Bar s={s} />
          </button>
        );
      })}
    </>
  );
}

const Arrow = ({ dir }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path d={dir < 0 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Day({ S, d, setTime, goDay }) {
  const s = sleepOf(S, d), t = tierOf(s.mins), weekend = isWeekend(d);
  const pct = Math.max(6, Math.min(100, (s.mins / 480) * 100));
  const prev = (d + 6) % 7, next = (d + 1) % 7;
  return (
    <div className="sl-calc-card">
      <div className="sl-day-nav">
        <button type="button" className="sl-arrow" aria-label={"Día anterior: " + DAYS[prev]} onClick={() => goDay(prev)}><Arrow dir={-1} /></button>
        <h2 className="sl-day-title">{DAYS[d]}</h2>
        <button type="button" className="sl-arrow" aria-label={"Día siguiente: " + DAYS[next]} onClick={() => goDay(next)}><Arrow dir={1} /></button>
      </div>
      <div className="sl-calc-controls">
        {weekend ? (
          <>
            <TimeSelect id="bed" label="Te vas a dormir a las" value={s.bed} options={BED_WEEKEND} onChange={(v) => setTime("bed", d, v)} />
            <TimeSelect id="wake" label="Te levantás a las" value={s.wake} options={WAKE_WEEKEND} onChange={(v) => setTime("wake", d, v)} />
          </>
        ) : (
          <>
            <TimeSelect id="bed" label="Apagás el teléfono a las" value={s.bed} options={BED_WEEKDAY} onChange={(v) => setTime("bed", d, v)} />
            <div className="sl-field">
              <span className="sl-field-label">Te levantás a las</span>
              <div className="sl-fixed">{hhmm(WEEKDAY_WAKE)}</div>
            </div>
          </>
        )}
      </div>
      <div className="sl-result" style={{ background: t.bg }}>
        <div className="sl-r-top">
          <div className="sl-r-title" style={{ color: t.color }}>{t.title}</div>
          <div className="sl-r-hours">{dur(s.mins)} de sueño</div>
        </div>
        <div className="sl-meter"><div className="sl-meter-fill" style={{ width: pct + "%", background: t.color }}></div></div>
      </div>
      <div className="sl-day-bar"><Bar s={s} /></div>
    </div>
  );
}

// día abierto según la dirección: #sueno/0 … #sueno/6
const dayFromHash = () => { const m = location.hash.match(/^#sueno\/([0-6])$/); return m ? +m[1] : null; };

export default function Sleep({ onHome }) {
  const [S, setS] = useState(load);
  const [day, setDay] = useState(dayFromHash);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }, [S]);
  useEffect(() => {
    const onPop = () => { setDay(dayFromHash()); window.scrollTo(0, 0); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const openDay = (d) => { history.pushState({ fromHome: true, fromWeek: true }, "", "#sueno/" + d); setDay(d); window.scrollTo(0, 0); };
  const back = () => {
    if (history.state?.fromWeek) history.back();
    else { history.replaceState({ fromHome: true }, "", "#sueno"); setDay(null); }
  };
  // cambiar de día con las flechas sin sumar pasos al "atrás": este sigue volviendo a la semana
  const goDay = (d) => { history.replaceState(history.state, "", "#sueno/" + d); setDay(d); };
  const setTime =(k, d, v) => setS((p) => { const n = structuredClone(p); n[k][d] = v; return n; });

  return (
    <div className="sleep">
      <div className="sl-wrap">
        {day === null
          ? <button className="home-btn" type="button" onClick={onHome}>‹ Inicio</button>
          : <button className="home-btn" type="button" onClick={back}>‹ Semana</button>}
        {day === null ? (
          <>
            <h1 className="sl-title">Sueño</h1>
            <Week S={S} openDay={openDay} />
          </>
        ) : <Day S={S} d={day} setTime={setTime} goDay={goDay} />}
      </div>
    </div>
  );
}
