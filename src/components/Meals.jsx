import { useState } from "react";
import { addsText, compensation, consumed, dayClose, eaten, fmt, missing, name, qty, timeline } from "../plan.js";
import { CdoneBox, Chips, ChipsDone, ItemList } from "./Bits.jsx";

// act: { S, upd(fn), open:Set, setOpen(key, bool), cdone(key, checked) }
export default function Meals({ act }) {
  const { S } = act;
  const comp = compensation(S, S.sel);
  // comida cuya solapa "Ajuste del día" está abierta
  const [adj, setAdj] = useState(null);
  const gapKeys = new Set(comp ? comp.gaps.map((g) => g.x.key) : []);
  return (
    <div className="meals" id="meals">
      {timeline(S, S.sel).map((item) =>
        item.type === "meal" ? (
          <MealCard key={item.key} item={item} comp={comp} act={act}
            hasAdj={gapKeys.has(item.key)} adjOpen={adj === item.key}
            toggleAdj={() => setAdj(adj === item.key ? null : item.key)} />
        ) : <TickCard key={item.key} item={item} act={act} />
      )}
      <DayClose data={dayClose(S, S.sel, comp, act.open)} onClose={(v) => act.upd((n) => { n.closed[n.sel] = v; })} />
    </div>
  );
}

function TickBtn({ done, label, doneLabel, onClick }) {
  return <button className="btn check" type="button" aria-pressed={done} onClick={onClick}>{done ? doneLabel : label}</button>;
}

// Termos de agua y entrenamientos
function TickCard({ item, act }) {
  const done = !!act.S.done[item.key];
  const toggle = () => act.upd((n) => { n.done[item.key] = !done; });
  if (item.type === "water") {
    return (
      <article className={"meal water" + (done ? " done" : "")}>
        <div className="time">{item.t}</div>
        <div>
          <h3>Termo {item.i + 1} de {item.n}<span className="opt">940 ml</span></h3>
          <div className="actions"><TickBtn done={done} label="Termo terminado" doneLabel="Terminado ✓" onClick={toggle} /></div>
        </div>
      </article>
    );
  }
  return (
    <article className={"meal gym" + (done ? " done" : "")}>
      <div className="time">{item.t}</div>
      <div>
        <h3>{item.title}</h3>
        {item.note ? <p className="note" style={{ margin: "2px 0 0" }}>{item.note}</p> : null}
        <div className="actions"><TickBtn done={done} label="Sesión hecha" doneLabel="Sesión hecha ✓" onClick={toggle} /></div>
      </div>
    </article>
  );
}

function MealCard({ item, comp, act, hasAdj, adjOpen, toggleAdj }) {
  const { S, upd, open, setOpen } = act;
  const x = item.x, key = item.key;
  const done = !!S.done[key], sk = !!S.skip[key], cp = comp && comp.byKey[key], isOpen = done && open.has(key);
  const partial = done && missing(S, x).length > 0;
  const e = eaten(S, x);

  const markDone = () => { upd((n) => { n.done[key] = true; n.skip[key] = false; n.eat[key] = x.opt.items.map(() => true); }); setOpen(key, true); };
  const edit = () => setOpen(key, true);
  const undo = () => { upd((n) => { n.done[key] = false; delete n.eat[key]; }); setOpen(key, false); };
  const ok = () => {
    setOpen(key, false);
    if (!e.some(Boolean)) upd((n) => { n.done[key] = false; n.skip[key] = true; delete n.eat[key]; });
  };
  const toggleSkip = () => upd((n) => { n.skip[key] = !sk; });
  const swap = () => upd((n) => { n.v[x.key] = (x.idx + 1) % x.pool.length; });
  const pick = (i, checked) => { const arr = eaten(S, x); arr[i] = checked; upd((n) => { n.eat[key] = arr; }); };

  const adjBtn = hasAdj && !isOpen
    ? <button className="btn adj" type="button" aria-expanded={adjOpen} onClick={toggleAdj}>Ajuste del día {adjOpen ? "▴" : "▾"}</button>
    : null;

  let body, btns;
  if (isOpen) {
    body = (
      <>
        <p className="pick-hint">Destildá lo que no comiste</p>
        <ul className="items pick">
          {x.opt.items.map((it2, i) => (
            <li key={i}>
              <label><input type="checkbox" data-i={i} checked={!!e[i]} onChange={(ev) => pick(i, ev.target.checked)} /><span>{name(it2.k)}</span></label>
              <span className="q">{qty(it2)}</span>
            </li>
          ))}
        </ul>
        <ChipsDone m={consumed(S, x)} full={x.m} />
      </>
    );
    btns = <button className="btn check mok" type="button" onClick={ok}>Listo</button>;
  } else if (done) {
    body = (
      <>
        <ul className="items">
          {x.opt.items.map((it2, i) => (
            <li key={i} className={e[i] ? undefined : "miss"}>
              <span>{e[i] ? "✓ " : ""}{name(it2.k)}{e[i] ? null : <> <em>no comí</em></>}</span>
              <span className="q">{qty(it2)}</span>
            </li>
          ))}
        </ul>
        <ChipsDone m={consumed(S, x)} full={x.m} />
      </>
    );
    btns = (
      <>
        <button className="btn check medit" type="button" onClick={edit}>{partial ? "Hecha parcial · editar" : "Hecha ✓ · editar"}</button>
        <button className="btn skip mundo" type="button" onClick={undo}>Desmarcar</button>
        {adjBtn}
      </>
    );
  } else {
    body = <><ItemList items={x.opt.items} /><Chips m={x.m} /></>;
    btns = (
      <>
        {sk ? null : <button className="btn check mdone" type="button" onClick={markDone}>Marcar como hecha</button>}
        <button className="btn skip mskip" type="button" aria-pressed={sk} onClick={toggleSkip}>{sk ? "Deshacer salteada" : "Me la salteé"}</button>
        {x.pool.length > 1 && !sk ? <button className="btn swap" type="button" onClick={swap}>Otra opción</button> : null}
        {adjBtn}
      </>
    );
  }

  return (
    <>
      <article className={"meal" + (done ? " done" : "") + (partial ? " partial" : "") + (sk ? " skipped" : "")}>
        <div className="time">{x.t}</div>
        <div>
          <h3>
            {x.n}
            {x.pool.length > 1 ? <span className="opt">Opción {x.idx + 1} de {x.pool.length}</span> : null}
            {sk ? <span className="badge-skip">Salteada</span> : null}
          </h3>
          <p className="note" style={{ margin: "2px 0 0", fontWeight: 600, color: "var(--ink)" }}>{x.opt.n}</p>
          {body}
          {cp ? (
            <div className="comp-add">
              <b>Sumale:</b> {cp.adds.map((a) => "+" + qty(a) + " de " + name(a.k).toLowerCase()).join(", ")} <span>(+{cp.m.p} g P, +{cp.m.c} g C)</span>
              <CdoneBox S={S} k={key + "-c"} label="Lo sumé" onToggle={act.cdone} />
            </div>
          ) : null}
          <div className="actions">{btns}</div>
        </div>
      </article>
      {adjBtn && adjOpen ? <CompPanel c={comp} act={act} /> : null}
    </>
  );
}

// Solapa "Ajuste del día": qué faltó y cómo se compensa
function CompPanel({ c, act }) {
  const lines = c.gaps.map((g, i) =>
    g.full ? <li key={i}><b>{g.x.n}:</b> salteada.</li>
           : <li key={i}><b>{g.x.n}:</b> no comiste {g.items.map((it2) => name(it2.k).toLowerCase()).join(", ")}.</li>
  );
  if (c.small) {
    return <article className="comp small"><h3>Ajuste del día</h3><ul className="gaps">{lines}</ul><p>Es poco: no hace falta compensar.</p></article>;
  }
  const nk = Object.keys(c.byKey).length;
  return (
    <article className="comp">
      <h3>Ajuste del día</h3>
      <ul className="gaps">{lines}</ul>
      <p>
        Faltan <b>{c.defP} g de proteína</b> y <b>{c.defC} g de carbohidratos</b>.
        {nk ? " Se suma en amarillo a " + (nk > 1 ? "las próximas " + nk + " comidas." : "la próxima comida.") : ""}
      </p>
      {c.extra ? (
        <div className="comp-add">
          <b>{c.extra.t}:</b> {addsText(c.extra.adds)} <span>(+{c.extra.m.p} g P, +{c.extra.m.c} g C)</span>
          <CdoneBox S={act.S} k={c.extra.key} label="Lo comí" onToggle={act.cdone} />
        </div>
      ) : null}
    </article>
  );
}

// Resumen del día (en curso) / Cierre del día
function DayClose({ data, onClose }) {
  const { closed, manual, rows, pendMeals, items } = data;
  const rowEls = rows.map((r) => (
    <div key={r.label} className={"cl-row " + r.st}>
      <span>{r.label}</span>
      <b>{fmt(r.a)} <small>de {fmt(r.b)} {r.unit}</small></b>
      <em>{r.pct}%</em>
      <div className="sum-track"><div style={{ width: Math.min(100, r.pct) + "%" }}></div></div>
    </div>
  ));
  if (!closed) {
    return (
      <article className="close live">
        <h3>Resumen del día <span className="cl-state">en curso</span></h3>
        {rowEls}
        <p className="cl-sub">Faltan marcar</p>
        <ul className="gaps">{pendMeals.map((x) => <li key={x.key}>{x.t} {x.n}</li>)}</ul>
        <div className="actions"><button className="btn cl-btn" type="button" data-close="1" onClick={() => onClose(true)}>Cerrar el día</button></div>
      </article>
    );
  }
  return (
    <article className="close">
      <h3>Cierre del día</h3>
      {rowEls}
      {items.length ? (
        <>
          <p className="cl-sub">Qué faltó</p>
          <ul className="gaps">
            {items.map((i, n) => <li key={n}><b>{i.b}:</b> {i.t}{i.ok ? <> <span className="cl-ok">compensado</span></> : null}</li>)}
          </ul>
        </>
      ) : null}
      {manual ? <div className="actions"><button className="btn cl-btn" type="button" data-close="0" onClick={() => onClose(false)}>Reabrir el día</button></div> : null}
    </article>
  );
}
