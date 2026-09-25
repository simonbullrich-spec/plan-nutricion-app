import { useState } from "react";
import "./sleep.css";

// Basado en referencia/reprograma-tu-sueno.html

const TICKS = ["18", "22", "02", "06", "10", "14"];
// [día, nota, [izq %, ancho %, duración] hoy, plan (null = ya está bien)]
const DAYS = [
  ["Lunes", "Sin entreno · facultad a las 7:15", [32.5, 33.75, "6h45"], [25, 41.25, "8h15"]],
  ["Martes", "Entrenás hasta 22:30 · facultad 7:15", [32.5, 33.75, "6h45"], [27.5, 38.75, "7h45"]],
  ["Miércoles", "Sin entreno · facultad 7:15", [30, 36.25, "7h15"], [25, 41.25, "8h15"]],
  ["Jueves", "Entrenás hasta 22:30 · facultad 7:15", [32.5, 33.75, "6h45"], [27.5, 38.75, "7h45"]],
  ["Viernes", "Salís o no · igual te levantás ~10:00 (rugby)", [35, 45, "9h00"], [32.5, 47.5, "9h30"]],
  ["Sábado", "Siempre salís · te acostás ~6:00", [60, 30, "6h00"], [55, 35, "7h00"]],
  ["Domingo", "Sin facultad al otro día · ya dormís bien", [35, 46.25, "9h15"], null],
];

const TIERS = [
  { min: 480, title: "Óptimo", color: "var(--ok)", bg: "var(--ok-bg)",
    desc: "Dormís 8 horas o más. Es el rango donde memoria, recuperación muscular y tiempo de reacción funcionan a pleno." },
  { min: 420, title: "Bueno", color: "var(--good)", bg: "var(--good-bg)",
    desc: "Entre 7 y 8 horas. Rendís cerca de tu máximo, con margen chico de mejora." },
  { min: 360, title: "Regular", color: "var(--warn)", bg: "var(--warn-bg)",
    desc: "Entre 6 y 7 horas. Empiezan a notarse atención más lenta e irritabilidad. Es tu zona actual entre semana." },
  { min: 300, title: "Bajo", color: "var(--low)", bg: "var(--low-bg)",
    desc: "Entre 5 y 6 horas. Estudios ubican este nivel cerca del deterioro de reacción comparable a un nivel bajo de alcohol en sangre." },
  { min: 0, title: "Crítico", color: "var(--crit)", bg: "var(--crit-bg)",
    desc: "Menos de 5 horas. Tiempo de reacción, memoria y ánimo se ven afectados de forma marcada." },
];

const pad = (n) => n.toString().padStart(2, "0");
// opciones cada 15 min desde startH hasta endH (del día siguiente si hace falta), en minutos
function timeOptions(startH, endH) {
  const steps = ((endH - startH + 24) % 24) * 4 + 4;
  const out = [];
  let h = startH, m = 0;
  for (let i = 0; i <= steps; i++) {
    out.push([h * 60 + m, pad(h) + ":" + pad(m)]);
    m += 15; if (m >= 60) { m = 0; h = (h + 1) % 24; }
  }
  return out;
}
const BED = timeOptions(21, 3), WAKE = timeOptions(5, 13);

function Row({ kind, tag, b }) {
  return (
    <div className={"sl-row " + kind}>
      <span className="sl-tag">{tag}</span>
      <div className="sl-track"><div className="sl-block" style={{ left: b[0] + "%", width: b[1] + "%" }} data-dur={b[2]}></div></div>
    </div>
  );
}

function Calculator() {
  const [bed, setBed] = useState(30);
  const [wake, setWake] = useState(7 * 60 + 15);
  let mins = wake - bed; if (mins <= 0) mins += 24 * 60;
  const tier = TIERS.find((t) => mins >= t.min);
  const pct = Math.max(6, Math.min(100, (mins / 480) * 100));
  return (
    <div className="sl-calc-card">
      <div className="sl-calc-controls">
        <div className="sl-field">
          <label htmlFor="bedtime">Te acostás a las</label>
          <select id="bedtime" value={bed} onChange={(e) => setBed(+e.target.value)}>
            {BED.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="sl-field">
          <label htmlFor="waketime">Te levantás a las</label>
          <select id="waketime" value={wake} onChange={(e) => setWake(+e.target.value)}>
            {WAKE.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>
      <div className="sl-result" style={{ background: tier.bg }}>
        <div className="sl-r-top">
          <div className="sl-r-title" style={{ color: tier.color }}>{tier.title}</div>
          <div className="sl-r-hours">{Math.floor(mins / 60) + "h" + pad(mins % 60) + " de sueño"}</div>
        </div>
        <p className="sl-r-desc">{tier.desc}</p>
        <div className="sl-meter"><div className="sl-meter-fill" style={{ width: pct + "%", background: tier.color }}></div></div>
        <p className="sl-meter-note">Barra ilustrativa (horas de sueño respecto de 8h), no una medición médica.</p>
      </div>
    </div>
  );
}

const Icon = ({ d }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={d} /></svg>;

export default function Sleep({ onHome }) {
  return (
    <div className="sleep">
      <div className="sl-wrap">
        <button className="home-btn" type="button" onClick={onHome}>‹ Inicio</button>

        <section className="sl-hero">
          <div className="sl-kicker">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
            Plan de sueño personalizado
          </div>
          <h1>Tu semana no tiene un problema de voluntad. Tiene un problema de horarios.</h1>
          <p className="sl-lead">
            De domingo a lunes ya dormís bien: te acostás cerca de la 1am y te levantás entre las 10 y las 10:30,
            unas 9 horas. El problema son las cuatro noches de lunes a jueves, justo antes de entrar a la facultad
            a las 7:15, donde caés a 6h50 en promedio. Con ajustes chicos en el horario de acostarte —no en tu
            rutina— podés sumar hasta una hora extra en esas noches.
          </p>
          <div className="sl-arc-card">
            <svg viewBox="0 0 130 90">
              <path d="M10 80 A55 55 0 0 1 120 80" fill="none" stroke="var(--track)" strokeWidth="8" strokeLinecap="round" />
              <path d="M10 80 A55 55 0 0 1 78 26" fill="none" stroke="var(--accent2)" strokeWidth="8" strokeLinecap="round" />
              <circle cx="10" cy="80" r="4.5" fill="var(--accent2)" />
              <circle cx="78" cy="26" r="4.5" fill="var(--accent2)" />
              <text x="65" y="88" textAnchor="middle" fontSize="8" fill="var(--muted)" fontFamily="Inter Variable, Inter">horas ganadas por noche</text>
            </svg>
            <div className="sl-arc-stats">
              <div className="sl-stat"><div className="sl-num">6h50</div><div className="sl-label">Promedio actual<br />(lun–jue)</div></div>
              <div className="sl-arrow-sep">→</div>
              <div className="sl-stat"><div className="sl-num accent">8h00</div><div className="sl-label">Con el plan<br />mismas noches</div></div>
            </div>
          </div>
        </section>

        <section id="semana">
          <div className="sl-section-head">
            <h2>Tu semana, hora por hora</h2>
            <p>Cada línea muestra la ventana de sueño real (gris) contra la sugerida (violeta), sobre un eje de 18:00 a 14:00 del día siguiente.</p>
          </div>
          {DAYS.map(([day, note, now, plan]) => (
            <div key={day} className={"sl-day-card" + (plan ? "" : " optimal")}>
              <div className="sl-day-top">
                <h3>{day}{plan ? null : <> <span className="sl-check">✓</span></>}</h3>
                <span className="sl-pill">{note}</span>
              </div>
              {plan ? <><Row kind="now" tag="Hoy" b={now} /><Row kind="plan" tag="Plan" b={plan} /></> : <Row kind="opt" tag="Hoy" b={now} />}
              <div className="sl-ticks">{TICKS.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
          ))}
        </section>

        <section id="calculadora">
          <div className="sl-section-head">
            <h2>¿Cuánto te afecta según la hora a la que te acuestes?</h2>
            <p>Elegí una hora de acostarte y una de despertarte para ver el impacto estimado, según evidencia general sobre sueño y desempeño cognitivo.</p>
          </div>
          <Calculator />
        </section>

        <section id="beneficios">
          <div className="sl-section-head">
            <h2>Por qué te conviene, más allá de "estar cansado"</h2>
            <p>El sueño no es tiempo perdido: es cuando pasan cosas concretas que te sirven todos los días.</p>
          </div>
          <div className="sl-benefit-grid">
            <div className="sl-benefit">
              <div className="sl-b-head"><Icon d="M9.5 3a5.5 5.5 0 0 0-5.4 6.5A4.5 4.5 0 0 0 5 18h1M14.5 3a5.5 5.5 0 0 1 5.4 6.5A4.5 4.5 0 0 1 19 18h-1M9.5 3v15a2.5 2.5 0 0 0 5 0V3" /><div className="sl-b-title">Memoria y facultad</div></div>
              <p>Mientras dormís, el cerebro consolida lo que estudiaste ese día. Cortar el sueño la noche antes de una clase o un parcial es cortar ese proceso a la mitad.</p>
            </div>
            <div className="sl-benefit">
              <div className="sl-b-head"><Icon d="M6.5 6.5 4 9l3 3-3 3 2.5 2.5L9 15l3 3 3-3 2.5 2.5L20 15l-3-3 3-3-2.5-2.5L15 9l-3-3-3 3z" /><div className="sl-b-title">Recuperación del entreno</div></div>
              <p>La mayor liberación de hormona de crecimiento y la reparación muscular ocurren en el sueño profundo. Entrenar fuerte y dormir poco esa noche deja la recuperación a medio hacer.</p>
            </div>
            <div className="sl-benefit">
              <div className="sl-b-head"><Icon d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" /><div className="sl-b-title">Ánimo y sistema inmune</div></div>
              <p>Dormir poco seguido se asocia a más irritabilidad y menor defensa inmunológica. Se nota primero en el humor, después en que te enfermás más seguido.</p>
            </div>
            <div className="sl-benefit">
              <div className="sl-b-head"><Icon d="M13 2 4 14h6l-1 8 9-12h-6z" /><div className="sl-b-title">Tiempo de reacción</div></div>
              <p>El tiempo de reacción y el criterio se degradan de forma medible con poco sueño, algo clave si después manejás, entrenás o rendís un examen a primera hora.</p>
            </div>
          </div>
        </section>

        <section id="mejora">
          <div className="sl-section-head">
            <h2>Cuánto mejorarías durmiendo más</h2>
            <p>Comparando tu semana actual contra el plan sugerido, y lo que dice la evidencia sobre esa diferencia.</p>
          </div>
          <div className="sl-compare">
            <div className="sl-c-box"><div className="sl-c-label">Promedio actual</div><div className="sl-c-num">~7h25</div></div>
            <div className="sl-c-box plan"><div className="sl-c-label">Promedio con el plan</div><div className="sl-c-num">~8h15</div></div>
          </div>
          <div className="sl-fact">
            <p>Estudios sobre privación de sueño muestran que estar despierto entre 17 y 19 horas seguidas —lo que te pasa cuando te acostás pasada la 1am habiéndote levantado a las 7:15— deteriora el tiempo de reacción y el criterio a un nivel comparable al de un nivel de alcohol en sangre de alrededor de 0.05%.</p>
            <span className="sl-src">Fuente: investigación citada por la National Sleep Foundation y publicada en Occupational and Environmental Medicine.</span>
          </div>
          <div className="sl-fact">
            <p>En estudios donde se restringió el sueño a alrededor de 5 horas por noche durante varios días, los participantes mostraron hasta cinco veces más lapsos de atención y el doble de tiempo de reacción frente a un grupo que durmió 8 horas, incluso sin sentirse subjetivamente "más cansados".</p>
            <span className="sl-src">Fuente: estudio de restricción crónica de sueño publicado en PNAS.</span>
          </div>
          <div className="sl-fact">
            <p>Pasar de 6h50 a 8h00 esas cuatro noches clave no te lleva a un sueño "perfecto", pero te saca de la zona donde ese tipo de estudios empieza a mostrar caídas grandes en atención y reacción, justo antes de entrar a clase.</p>
          </div>
        </section>

        <section id="tips">
          <div className="sl-section-head">
            <h2>Cómo lo llevás a la práctica</h2>
            <p>Nada de esto te pide dejar de entrenar ni de salir. Son ajustes puntuales en el horario.</p>
          </div>
          <ul className="sl-tip-list">
            <li><span className="sl-t-when">Lunes</span><p>Es la continuación de tu domingo relajado: no hay entreno ni salida que lo compliquen. Acostarte a las 23:00 arranca la semana sumando casi 1h30 respecto a como venís haciéndolo.</p></li>
            <li><span className="sl-t-when">Mar / Jue</span><p>Dejá la cena semi-lista antes de entrenar (algo que solo tengas que calentar) y bañate con ducha corta. Esos 20-30 minutos ganados son la diferencia entre acostarte a las 00:30 y a las 23:30.</p></li>
            <li><span className="sl-t-when">Miércoles</span><p>Tu única noche sin entreno antes de un día de facultad: la más fácil de adelantar a las 23:00. Usala para reponer lo que perdés martes y jueves.</p></li>
            <li><span className="sl-t-when">Viernes</span><p>Si salís, poné una alarma mental de vuelta a la 1am: igual te despertás a las 10 para el rugby, así que cada hora antes que te acuestes es sueño directo.</p></li>
            <li><span className="sl-t-when">Sábado</span><p>No hace falta cambiar la noche de salida. Una siesta corta (20-30 min) el sábado a la tarde antes de salir reduce el golpe de dormir solo 6 horas esa noche.</p></li>
            <li><span className="sl-t-when">Domingo</span><p>Esta ya es tu mejor noche: 1am a 10-10:30, unas 9 horas. No la toques, es la base que te permite bancarte el resto de la semana.</p></li>
          </ul>
        </section>

        <footer className="sl-footer">Herramienta orientativa basada en hábitos y evidencia general sobre sueño. No reemplaza consejo médico; si la falta de sueño persiste o te genera malestar importante, vale la pena consultar a un profesional.</footer>
      </div>
    </div>
  );
}
