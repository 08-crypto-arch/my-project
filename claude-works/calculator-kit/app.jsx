const DEFAULTS = {
  palette: "graphite",
  material: "flat",
  layout: "classic",
  shape: "round",
  btnFont: "sans",
  display: "modern",
  displayAlign: "right",
  opTreat: "accent",
  equals: "same",
  casing: "floating",
  press: "press",
  bg: "none",
  gap: 8,
  casePad: 16,
  caseRadius: 24,
  btnHeight: 60,
  calcWidth: 360,
  displayHeight: 120,
  fontScale: 1.0,
  shadow: 22,
  bevelScale: 1.0,
  brand: true,
  brandText: "CALC.OS",
};

const PRESETS = [
  // a few flavorful preset combos used by Randomize seeds
  { palette: "graphite", material: "flat", shape: "circle", layout: "classic", display: "modern", opTreat: "accent" },
  { palette: "paper",    material: "outline", shape: "soft", layout: "grid", display: "serif", opTreat: "match", casing: "bordered" },
  { palette: "ocean",    material: "glass", shape: "pill", layout: "scientific", display: "terminal", bg: "blob" },
  { palette: "bubblegum",material: "neumorphic", shape: "round", layout: "classic", display: "display", opTreat: "inverted" },
  { palette: "blueprint",material: "brutalist", shape: "square", layout: "split", display: "mono", bg: "grid", opTreat: "accent" },
  { palette: "monolith", material: "outline", shape: "square", layout: "grid", display: "lcd", casing: "none", bg: "stripes" },
  { palette: "candy",    material: "embossed", shape: "pill", layout: "classic", display: "display", equals: "glow" },
  { palette: "forest",   material: "ghost", shape: "soft", layout: "compact", display: "mono", bg: "dots" },
  { palette: "citrus",   material: "block", shape: "soft", layout: "classic", display: "display", opTreat: "accent", bg: "stripes" },
  { palette: "rust",     material: "neumorphic", shape: "round", layout: "classic", display: "lcd", equals: "glow", bg: "noise" },
  { palette: "arctic",   material: "flat", shape: "pill", layout: "grid", display: "modern", bg: "dots", casing: "inset" },
  { palette: "ferrari",  material: "embossed", shape: "round", layout: "scientific", display: "display", equals: "big" },
];

function App() {
  const [t, setT] = React.useState(DEFAULTS);

  const set = (key, value) => setT((prev) => ({ ...prev, [key]: value }));
  const reset = () => setT(DEFAULTS);

  const randomize = () => {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const preset = pick(PRESETS);
    setT((prev) => ({
      ...prev,
      ...preset,
      gap: pick([4, 6, 8, 10, 12, 14]),
      casePad: pick([8, 12, 16, 20, 24, 28]),
      caseRadius: pick([0, 8, 16, 24, 32, 40]),
      btnHeight: pick([48, 56, 60, 64, 72]),
      displayHeight: pick([90, 110, 120, 140, 160]),
      fontScale: pick([0.9, 1.0, 1.1, 1.2]),
      shadow: pick([0, 12, 22, 32, 44]),
      bevelScale: pick([0.6, 0.8, 1.0, 1.4, 1.8]),
      displayAlign: pick(["left", "center", "right"]),
      brand: Math.random() < 0.5,
      brandText: pick(["CALC.OS", "MODEL 04", "TX-9", "ARITHMETIK", "EDITION-92", "PROTO/01"]),
      press: pick(Object.keys(PRESS_ANIMS)),
    }));
  };

  // count of distinct combinations (rough lower bound)
  const total = React.useMemo(() => {
    return (
      PALETTE_KEYS.length *
      Object.keys(MATERIALS).length *
      Object.keys(LAYOUTS).length *
      Object.keys(SHAPES).length *
      Object.keys(BUTTON_FONTS).length *
      Object.keys(DISPLAY_STYLES).length *
      Object.keys(OP_TREATMENTS).length *
      Object.keys(EQUALS_STYLES).length *
      Object.keys(CASING).length *
      Object.keys(BG_PATTERNS).length *
      Object.keys(PRESS_ANIMS).length
    );
  }, []);

  // metadata for topbar
  const palette = PALETTES[t.palette];

  // stage bg tint based on palette to ensure calc reads well on bg
  const stageStyle = (() => {
    const dark = isDark(palette.face);
    return {
      background: dark
        ? `linear-gradient(180deg, ${withAlphaUtil(palette.face2 || palette.face, 0.35)}, ${withAlphaUtil(palette.face, 0.15)}), var(--paper)`
        : `linear-gradient(180deg, var(--paper), ${withAlphaUtil(palette.face, 0.2)})`,
    };
  })();

  return (
    <div className="shell">
      <div className="topbar">
        <div className="brand">
          <div className="mark" />
          <div>
            <h1>電卓組み立てキット</h1>
            <div className="sub">完璧な電卓をデザインするためのツールボックス</div>
          </div>
        </div>
        <div className="meta">
          <span><b>{PALETTES[t.palette].name}</b> / palette</span>
          <span><b>{MATERIALS[t.material].name}</b> / material</span>
          <span><b>{LAYOUTS[t.layout].name}</b> / layout</span>
        </div>
      </div>

      <div className="stage" style={stageStyle}>
        <Calculator t={t} />
        <div className="stage-caption">
          <span>preview · live</span>
          <span>{t.calcWidth}px × auto</span>
        </div>
      </div>

      <ControlsPanel t={t} set={set} reset={reset} randomize={randomize} total={total} />
    </div>
  );
}

function isDark(hex) {
  if (!hex || !hex.startsWith("#")) return false;
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return (r * 0.299 + g * 0.587 + b * 0.114) < 140;
}

function withAlphaUtil(hex, a) {
  if (!hex) return `rgba(0,0,0,${a})`;
  if (hex.startsWith("rgb")) return hex;
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
