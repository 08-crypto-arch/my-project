// Palettes for the calculator. Each palette defines:
// face: case background
// face2: secondary case background (bezels, casing)
// display: display panel background
// displayInk: display text
// num: number button bg
// numInk: number button text
// fn: function (C, ±, %) bg
// fnInk: function ink
// op: operator (+ - × ÷) bg
// opInk: operator ink
// eq: equals bg
// eqInk: equals ink
// shadow: shadow color (rgba)
// glow: accent glow color

const PALETTES = {
  graphite: {
    name: "Graphite",
    face: "#1a1a1a", face2: "#0e0e0e",
    display: "#0a0a0a", displayInk: "#f4f3ee",
    num: "#2b2b2b", numInk: "#f4f3ee",
    fn: "#3a3a3a", fnInk: "#f4f3ee",
    op: "#ff8a3d", opInk: "#0e0e0e",
    eq: "#ff8a3d", eqInk: "#0e0e0e",
    shadow: "rgba(0,0,0,0.55)",
    glow: "#ff8a3d",
  },
  paper: {
    name: "Paper",
    face: "#f5f2ea", face2: "#ece8dc",
    display: "#ffffff", displayInk: "#1a1a1a",
    num: "#ffffff", numInk: "#1a1a1a",
    fn: "#e8e3d5", fnInk: "#1a1a1a",
    op: "#1a1a1a", opInk: "#f5f2ea",
    eq: "#1a1a1a", eqInk: "#f5f2ea",
    shadow: "rgba(40,30,10,0.18)",
    glow: "#1a1a1a",
  },
  citrus: {
    name: "Citrus",
    face: "#fef5d2", face2: "#fde88c",
    display: "#1a1a1a", displayInk: "#fef5d2",
    num: "#ffffff", numInk: "#1a1a1a",
    fn: "#fde88c", fnInk: "#1a1a1a",
    op: "#ff5d2e", opInk: "#fef5d2",
    eq: "#ff5d2e", eqInk: "#fef5d2",
    shadow: "rgba(120,80,0,0.22)",
    glow: "#ff5d2e",
  },
  ocean: {
    name: "Ocean",
    face: "#0c2030", face2: "#081827",
    display: "#031020", displayInk: "#7be0d0",
    num: "#143247", numInk: "#e7f3f9",
    fn: "#1d4258", fnInk: "#e7f3f9",
    op: "#2bc4b0", opInk: "#031020",
    eq: "#2bc4b0", eqInk: "#031020",
    shadow: "rgba(0,15,30,0.65)",
    glow: "#2bc4b0",
  },
  bubblegum: {
    name: "Bubblegum",
    face: "#ffd3e2", face2: "#ffb8d0",
    display: "#fff1f6", displayInk: "#7a1b4a",
    num: "#ffffff", numInk: "#7a1b4a",
    fn: "#ffa3c3", fnInk: "#7a1b4a",
    op: "#7a1b4a", opInk: "#ffd3e2",
    eq: "#ff3d8a", eqInk: "#ffffff",
    shadow: "rgba(180,40,90,0.28)",
    glow: "#ff3d8a",
  },
  forest: {
    name: "Forest",
    face: "#1f2d22", face2: "#16201a",
    display: "#0a120d", displayInk: "#c4e5a4",
    num: "#2c3f30", numInk: "#e8efd9",
    fn: "#3a5340", fnInk: "#e8efd9",
    op: "#9bc46e", opInk: "#0a120d",
    eq: "#9bc46e", eqInk: "#0a120d",
    shadow: "rgba(0,15,5,0.55)",
    glow: "#9bc46e",
  },
  blueprint: {
    name: "Blueprint",
    face: "#1a3a7a", face2: "#13306a",
    display: "#0e2050", displayInk: "#ffffff",
    num: "#2a4d96", numInk: "#ffffff",
    fn: "#1f3e80", fnInk: "#ffffff",
    op: "#ffd83d", opInk: "#0e2050",
    eq: "#ffd83d", eqInk: "#0e2050",
    shadow: "rgba(10,20,60,0.55)",
    glow: "#ffd83d",
  },
  candy: {
    name: "Candy",
    face: "#f0eaff", face2: "#e2d8ff",
    display: "#1a0033", displayInk: "#d8c4ff",
    num: "#ffffff", numInk: "#3a1a7a",
    fn: "#cab0ff", fnInk: "#3a1a7a",
    op: "#7c3aed", opInk: "#ffffff",
    eq: "#ec4899", eqInk: "#ffffff",
    shadow: "rgba(100,40,200,0.22)",
    glow: "#ec4899",
  },
  rust: {
    name: "Rust",
    face: "#2a1810", face2: "#1d100a",
    display: "#140905", displayInk: "#ffb56b",
    num: "#3a241a", numInk: "#f4ddc4",
    fn: "#4a3024", fnInk: "#f4ddc4",
    op: "#d96820", opInk: "#140905",
    eq: "#d96820", eqInk: "#140905",
    shadow: "rgba(20,5,0,0.6)",
    glow: "#d96820",
  },
  arctic: {
    name: "Arctic",
    face: "#eaf2f5", face2: "#d8e6eb",
    display: "#eaf2f5", displayInk: "#2c4a52",
    num: "#ffffff", numInk: "#2c4a52",
    fn: "#cee0e5", fnInk: "#2c4a52",
    op: "#3aa5b5", opInk: "#ffffff",
    eq: "#2c4a52", eqInk: "#ffffff",
    shadow: "rgba(30,60,70,0.16)",
    glow: "#3aa5b5",
  },
  monolith: {
    name: "Monolith",
    face: "#0a0a0a", face2: "#000000",
    display: "#000000", displayInk: "#ffffff",
    num: "#0a0a0a", numInk: "#ffffff",
    fn: "#181818", fnInk: "#ffffff",
    op: "#ffffff", opInk: "#000000",
    eq: "#ffffff", eqInk: "#000000",
    shadow: "rgba(0,0,0,0.7)",
    glow: "#ffffff",
  },
  ferrari: {
    name: "Ferrari",
    face: "#d12020", face2: "#a31818",
    display: "#1a0808", displayInk: "#ffe4b8",
    num: "#1a0808", numInk: "#ffe4b8",
    fn: "#2a1212", fnInk: "#ffe4b8",
    op: "#ffd23d", opInk: "#1a0808",
    eq: "#ffd23d", eqInk: "#1a0808",
    shadow: "rgba(80,0,0,0.5)",
    glow: "#ffd23d",
  },
};

const PALETTE_KEYS = Object.keys(PALETTES);

const MATERIALS = {
  flat:        { name: "Flat" },
  neumorphic:  { name: "Neumorphic" },
  glass:       { name: "Glass" },
  brutalist:   { name: "Brutalist" },
  embossed:    { name: "Embossed" },
  outline:     { name: "Outline" },
  ghost:       { name: "Ghost" },
  block:       { name: "Block" },
};

const SHAPES = {
  square: { name: "Square", r: 0 },
  soft:   { name: "Soft",   r: 6 },
  round:  { name: "Round",  r: 14 },
  pill:   { name: "Pill",   r: 32 },
  circle: { name: "Circle", r: 999 },
};

const DISPLAY_STYLES = {
  modern:   { name: "Modern",  font: '"Space Grotesk", sans-serif', weight: 500, letter: '-0.02em' },
  lcd:      { name: "LCD",     font: '"Major Mono Display", monospace', weight: 400, letter: '0.04em' },
  terminal: { name: "Term",    font: '"VT323", monospace', weight: 400, letter: '0' },
  serif:    { name: "Serif",   font: '"DM Serif Display", serif', weight: 400, letter: '-0.01em' },
  mono:     { name: "Mono",    font: '"JetBrains Mono", monospace', weight: 500, letter: '-0.02em' },
  display:  { name: "Bebas",   font: '"Bebas Neue", sans-serif', weight: 400, letter: '0.02em' },
};

const BUTTON_FONTS = {
  sans:    { name: "Sans",   font: '"Helvetica Neue", sans-serif', weight: 500 },
  grotesk: { name: "Grotesk", font: '"Space Grotesk", sans-serif', weight: 500 },
  mono:    { name: "Mono",   font: '"JetBrains Mono", monospace', weight: 500 },
  serif:   { name: "Serif",  font: '"DM Serif Display", serif', weight: 400 },
  display: { name: "Display", font: '"Bebas Neue", sans-serif', weight: 400 },
};

const LAYOUTS = {
  classic: { name: "Classic" },     // 4 cols × 5 rows, 0 spans
  grid:    { name: "Grid" },        // 4 × 5 strict
  scientific: { name: "Sci" },      // 5 cols × 6 rows
  compact: { name: "Compact" },     // 4 × 4 (no fn row, top operations)
  split:   { name: "Split" },       // operators on left
};

const BG_PATTERNS = {
  none:   { name: "Solid" },
  dots:   { name: "Dots" },
  grid:   { name: "Grid" },
  stripes:{ name: "Stripes" },
  noise:  { name: "Noise" },
  blob:   { name: "Blob" },
};

const EQUALS_STYLES = {
  same:     { name: "Default" },
  glow:     { name: "Glow" },
  big:      { name: "Big" },
  outlined: { name: "Outlined" },
};

const OP_TREATMENTS = {
  accent: { name: "Accent" },
  inverted: { name: "Inverse" },
  outlined: { name: "Outlined" },
  match: { name: "Match" },
};

const PRESS_ANIMS = {
  none:  { name: "None" },
  press: { name: "Press" },
  bounce:{ name: "Bounce" },
  flash: { name: "Flash" },
};

const CASING = {
  floating:{ name: "Floating" },
  inset:   { name: "Inset" },
  bordered:{ name: "Bordered" },
  none:    { name: "None" },
};

Object.assign(window, {
  PALETTES, PALETTE_KEYS, MATERIALS, SHAPES, DISPLAY_STYLES, BUTTON_FONTS,
  LAYOUTS, BG_PATTERNS, EQUALS_STYLES, OP_TREATMENTS, PRESS_ANIMS, CASING,
});
