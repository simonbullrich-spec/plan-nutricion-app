import { useEffect, useState } from "react";
import Home from "./components/Home.jsx";
import Nutrition from "./components/Nutrition.jsx";
import Sleep from "./components/Sleep.jsx";

// Pantalla actual según el # de la dirección (así el "atrás" del teléfono vuelve al inicio)
const VIEWS = { nutricion: "Nutrición", sueno: "Sueño" };
const current = () => { const v = location.hash.slice(1); return VIEWS[v] ? v : "home"; };

export default function App() {
  const [view, setView] = useState(current);

  useEffect(() => {
    const onHash = () => { setView(current()); window.scrollTo(0, 0); };
    window.addEventListener("popstate", onHash);
    return () => window.removeEventListener("popstate", onHash);
  }, []);

  useEffect(() => { document.title = view === "home" ? "Plan Nutrición" : VIEWS[view]; }, [view]);

  const go = (v) => { history.pushState({ fromHome: true }, "", "#" + v); setView(v); window.scrollTo(0, 0); };
  // "‹ Inicio": si entramos desde el inicio, es lo mismo que el "atrás" del teléfono
  const home = () => {
    if (history.state?.fromHome) history.back();
    else { history.replaceState(null, "", location.pathname + location.search); setView("home"); window.scrollTo(0, 0); }
  };

  if (view === "nutricion") return <Nutrition onHome={home} />;
  if (view === "sueno") return <Sleep onHome={home} />;
  return <Home go={go} />;
}
