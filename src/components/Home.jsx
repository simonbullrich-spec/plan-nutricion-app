// Pantalla de inicio: elegir entre Nutrición y Sueño

export function NutritionLogo() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true">
      <rect width="512" height="512" rx="120" fill="#2E6A45" />
      <circle cx="256" cy="256" r="150" fill="none" stroke="#F3F5F1" strokeWidth="26" />
      <circle cx="256" cy="256" r="104" fill="#F3F5F1" opacity=".16" />
      <path d="M196 316 C196 236 246 192 326 188 C326 268 282 316 196 316 Z" fill="#E2A72E" />
      <path d="M206 306 L300 212" stroke="#2E6A45" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}

export function SleepLogo() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true">
      <rect width="512" height="512" rx="120" fill="#3C4A8C" />
      <path d="M318 132 A140 140 0 1 0 380 330 A112 112 0 0 1 318 132 Z" fill="#EDF0F6" />
      <path d="M368 150 l9 22 22 9 -22 9 -9 22 -9 -22 -22 -9 22 -9 z" fill="#E6A75C" />
      <path d="M404 232 l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6 z" fill="#E6A75C" />
    </svg>
  );
}

export default function Home({ go }) {
  return (
    <main className="home">
      <div className="home-grid">
        <button className="home-card" type="button" onClick={() => go("nutricion")}>
          <NutritionLogo />
          <span>Nutrición</span>
        </button>
        <button className="home-card" type="button" onClick={() => go("sueno")}>
          <SleepLogo />
          <span>Sueño</span>
        </button>
      </div>
    </main>
  );
}
