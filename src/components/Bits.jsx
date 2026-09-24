import { name, qty } from "../plan.js";

// Lista simple de ingredientes con cantidad
export function ItemList({ items }) {
  return (
    <ul className="items">
      {items.map((x, i) => (
        <li key={i}><span>{name(x.k)}</span><span className="q">{qty(x)}</span></li>
      ))}
    </ul>
  );
}

// Caja de proteínas y carbohidratos
export function Chips({ m }) {
  return (
    <div className="mbox">
      <div className="p"><span>Proteínas</span><b>{m.p} g</b></div>
      <div className="c"><span>Carbohidratos</span><b>{m.c} g</b></div>
    </div>
  );
}

// Igual que Chips, pero muestra "de X g" si se comió solo una parte
export function ChipsDone({ m, full }) {
  return (
    <div className="mbox">
      <div className="p"><span>Proteínas</span><b>{m.p} g</b>{m.p !== full.p && <span>de {full.p} g</span>}</div>
      <div className="c"><span>Carbohidratos</span><b>{m.c} g</b>{m.c !== full.c && <span>de {full.c} g</span>}</div>
    </div>
  );
}

// Checkbox chico de compensación ("Lo sumé" / "Lo comí")
export function CdoneBox({ S, k, label, onToggle }) {
  return (
    <label className="cdone">
      <input type="checkbox" data-ck={k} checked={!!S.cdone[k]} onChange={(e) => onToggle(k, e.target.checked)} />
      {" "}{label}
    </label>
  );
}
