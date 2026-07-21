// Calculator component. Heavy styling driven by `t` (tweaks).
const { useState, useMemo, useCallback, useEffect, useRef } = React;

// ---------- math helpers ----------
function formatNumber(n) {
  if (typeof n !== "number") return n;
  if (!isFinite(n)) return "Error";
  // Avoid trailing junk
  const s = Math.abs(n) >= 1e16 || (Math.abs(n) < 1e-6 && n !== 0)
    ? n.toExponential(6)
    : String(parseFloat(n.toPrecision(12)));
  return s;
}
function applyOp(a, b, op) {
  if (op === "add") return a + b;
  if (op === "sub") return a - b;
  if (op === "mul") return a * b;
  if (op === "div") return b === 0 ? NaN : a / b;
  return b;
}

// ---------- layouts ----------
// Each layout is array of rows. Each cell: {l: label, t: 'num'|'op'|'fn'|'eq', a: action, span?: number, key?:string}
const LAYOUT_DEFS = {
  classic: {
    cols: 4,
    rows: [
      [{l:"AC",t:"fn",a:"clear"},{l:"±",t:"fn",a:"negate"},{l:"%",t:"fn",a:"percent"},{l:"÷",t:"op",a:"div"}],
      [{l:"7",t:"num"},{l:"8",t:"num"},{l:"9",t:"num"},{l:"×",t:"op",a:"mul"}],
      [{l:"4",t:"num"},{l:"5",t:"num"},{l:"6",t:"num"},{l:"−",t:"op",a:"sub"}],
      [{l:"1",t:"num"},{l:"2",t:"num"},{l:"3",t:"num"},{l:"+",t:"op",a:"add"}],
      [{l:"0",t:"num",span:2},{l:".",t:"num",a:"dot"},{l:"=",t:"eq",a:"equals"}],
    ],
  },
  grid: {
    cols: 4,
    rows: [
      [{l:"AC",t:"fn",a:"clear"},{l:"±",t:"fn",a:"negate"},{l:"%",t:"fn",a:"percent"},{l:"÷",t:"op",a:"div"}],
      [{l:"7",t:"num"},{l:"8",t:"num"},{l:"9",t:"num"},{l:"×",t:"op",a:"mul"}],
      [{l:"4",t:"num"},{l:"5",t:"num"},{l:"6",t:"num"},{l:"−",t:"op",a:"sub"}],
      [{l:"1",t:"num"},{l:"2",t:"num"},{l:"3",t:"num"},{l:"+",t:"op",a:"add"}],
      [{l:".",t:"num",a:"dot"},{l:"0",t:"num"},{l:"⌫",t:"fn",a:"back"},{l:"=",t:"eq",a:"equals"}],
    ],
  },
  scientific: {
    cols: 5,
    rows: [
      [{l:"sin",t:"fn",a:"sin"},{l:"cos",t:"fn",a:"cos"},{l:"tan",t:"fn",a:"tan"},{l:"π",t:"fn",a:"pi"},{l:"AC",t:"fn",a:"clear"}],
      [{l:"x²",t:"fn",a:"sq"},{l:"√",t:"fn",a:"sqrt"},{l:"1/x",t:"fn",a:"recip"},{l:"±",t:"fn",a:"negate"},{l:"÷",t:"op",a:"div"}],
      [{l:"7",t:"num"},{l:"8",t:"num"},{l:"9",t:"num"},{l:"%",t:"fn",a:"percent"},{l:"×",t:"op",a:"mul"}],
      [{l:"4",t:"num"},{l:"5",t:"num"},{l:"6",t:"num"},{l:"⌫",t:"fn",a:"back"},{l:"−",t:"op",a:"sub"}],
      [{l:"1",t:"num"},{l:"2",t:"num"},{l:"3",t:"num"},{l:".",t:"num",a:"dot"},{l:"+",t:"op",a:"add"}],
      [{l:"0",t:"num",span:4},{l:"=",t:"eq",a:"equals"}],
    ],
  },
  compact: {
    cols: 4,
    rows: [
      [{l:"AC",t:"fn",a:"clear"},{l:"⌫",t:"fn",a:"back"},{l:"%",t:"fn",a:"percent"},{l:"÷",t:"op",a:"div"}],
      [{l:"7",t:"num"},{l:"8",t:"num"},{l:"9",t:"num"},{l:"×",t:"op",a:"mul"}],
      [{l:"4",t:"num"},{l:"5",t:"num"},{l:"6",t:"num"},{l:"−",t:"op",a:"sub"}],
      [{l:"1",t:"num"},{l:"2",t:"num"},{l:"3",t:"num"},{l:"+",t:"op",a:"add"}],
      [{l:"±",t:"fn",a:"negate"},{l:"0",t:"num"},{l:".",t:"num",a:"dot"},{l:"=",t:"eq",a:"equals"}],
    ],
  },
  split: {
    cols: 5,
    rows: [
      [{l:"AC",t:"fn",a:"clear"},{l:"7",t:"num"},{l:"8",t:"num"},{l:"9",t:"num"},{l:"÷",t:"op",a:"div"}],
      [{l:"⌫",t:"fn",a:"back"},{l:"4",t:"num"},{l:"5",t:"num"},{l:"6",t:"num"},{l:"×",t:"op",a:"mul"}],
      [{l:"±",t:"fn",a:"negate"},{l:"1",t:"num"},{l:"2",t:"num"},{l:"3",t:"num"},{l:"−",t:"op",a:"sub"}],
      [{l:"%",t:"fn",a:"percent"},{l:"0",t:"num"},{l:".",t:"num",a:"dot"},{l:"=",t:"eq",a:"equals"},{l:"+",t:"op",a:"add"}],
    ],
  },
};

// ---------- main component ----------
function Calculator({ t }) {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [overwrite, setOverwrite] = useState(true);
  const [pressed, setPressed] = useState(null);
  const [history, setHistory] = useState(""); // small "5 + 3 =" trail
  const pressTimer = useRef();

  const palette = PALETTES[t.palette] || PALETTES.graphite;

  // ---------- input logic ----------
  const inputDigit = useCallback((d) => {
    setDisplay((cur) => {
      if (overwrite) return d;
      if (cur === "0") return d;
      if (cur.length > 14) return cur;
      return cur + d;
    });
    setOverwrite(false);
  }, [overwrite]);

  const inputDot = useCallback(() => {
    setDisplay((cur) => {
      if (overwrite) { setOverwrite(false); return "0."; }
      if (cur.includes(".")) return cur;
      return cur + ".";
    });
    setOverwrite(false);
  }, [overwrite]);

  const setOperation = useCallback((newOp, label) => {
    const cur = parseFloat(display);
    if (prev != null && op && !overwrite) {
      const r = applyOp(prev, cur, op);
      const out = formatNumber(r);
      setDisplay(out);
      setPrev(r);
    } else {
      setPrev(cur);
    }
    setOp(newOp);
    setOverwrite(true);
    setHistory(`${formatNumber(prev ?? cur)} ${label}`);
  }, [display, prev, op, overwrite]);

  const equals = useCallback(() => {
    if (prev == null || !op) return;
    const cur = parseFloat(display);
    const r = applyOp(prev, cur, op);
    const out = formatNumber(r);
    setDisplay(out);
    setHistory(`${formatNumber(prev)} ${opLabel(op)} ${formatNumber(cur)} =`);
    setPrev(null);
    setOp(null);
    setOverwrite(true);
  }, [display, prev, op]);

  const clearAll = useCallback(() => {
    setDisplay("0"); setPrev(null); setOp(null); setOverwrite(true); setHistory("");
  }, []);

  const negate = useCallback(() => {
    setDisplay((c) => c.startsWith("-") ? c.slice(1) : (c === "0" ? c : "-" + c));
  }, []);

  const percent = useCallback(() => {
    setDisplay((c) => formatNumber(parseFloat(c) / 100));
  }, []);

  const backspace = useCallback(() => {
    setDisplay((c) => {
      if (overwrite) return c;
      if (c.length <= 1 || (c.length === 2 && c.startsWith("-"))) return "0";
      return c.slice(0, -1);
    });
  }, [overwrite]);

  const unary = useCallback((fn) => {
    const v = parseFloat(display);
    let r;
    if (fn === "sq") r = v * v;
    else if (fn === "sqrt") r = Math.sqrt(v);
    else if (fn === "recip") r = v === 0 ? NaN : 1 / v;
    else if (fn === "sin") r = Math.sin(v * Math.PI / 180);
    else if (fn === "cos") r = Math.cos(v * Math.PI / 180);
    else if (fn === "tan") r = Math.tan(v * Math.PI / 180);
    else if (fn === "pi") r = Math.PI;
    setDisplay(formatNumber(r));
    setOverwrite(true);
  }, [display]);

  const handle = useCallback((cell) => {
    setPressed(cell.l);
    clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => setPressed(null), 180);

    if (cell.t === "num") {
      if (cell.a === "dot") inputDot();
      else inputDigit(cell.l);
    } else if (cell.t === "op") {
      setOperation(cell.a, cell.l);
    } else if (cell.t === "eq") {
      equals();
    } else if (cell.t === "fn") {
      if (cell.a === "clear") clearAll();
      else if (cell.a === "negate") negate();
      else if (cell.a === "percent") percent();
      else if (cell.a === "back") backspace();
      else unary(cell.a);
    }
  }, [inputDigit, inputDot, setOperation, equals, clearAll, negate, percent, backspace, unary]);

  // ---------- styles ----------
  const layout = LAYOUT_DEFS[t.layout] || LAYOUT_DEFS.classic;
  const shape = SHAPES[t.shape] || SHAPES.round;
  const dispStyle = DISPLAY_STYLES[t.display] || DISPLAY_STYLES.modern;
  const btnFont = BUTTON_FONTS[t.btnFont] || BUTTON_FONTS.sans;
  const equalsStyle = t.equals;
  const opTreat = t.opTreat;
  const press = t.press;
  const material = t.material;
  const casing = t.casing;

  const radius = shape.r;
  const gap = t.gap;
  const padCase = t.casePad;
  const caseRadius = t.caseRadius;
  const btnHeight = t.btnHeight;
  const calcWidth = t.calcWidth;
  const displayHeight = t.displayHeight;
  const fontScale = t.fontScale;
  const shadowAmt = t.shadow;
  const bevelScale = t.bevelScale ?? 1;

  // calc-level styles
  const caseShadow = (() => {
    if (casing === "none") return "none";
    if (shadowAmt <= 0) return "none";
    const s = shadowAmt;
    return `0 ${s * 0.4}px ${s * 1.6}px ${palette.shadow}, 0 ${s * 0.1}px ${s * 0.4}px ${palette.shadow}`;
  })();
  const caseBorder = casing === "bordered" ? `2px solid ${palette.face2 || palette.face}` : "none";
  const caseBg = casing === "none" ? "transparent" : palette.face;
  const casePadding = casing === "none" ? 0 : padCase;
  const insetShadow = casing === "inset" ? `inset 0 0 0 6px ${palette.face2}` : "none";

  const buttonBg = (type) => {
    if (type === "num") return palette.num;
    if (type === "fn") return palette.fn;
    if (type === "op") {
      if (opTreat === "match") return palette.num;
      if (opTreat === "outlined") return "transparent";
      if (opTreat === "inverted") return palette.numInk;
      return palette.op;
    }
    if (type === "eq") {
      if (equalsStyle === "outlined") return "transparent";
      return palette.eq;
    }
    return palette.num;
  };
  const buttonInk = (type) => {
    if (type === "num") return palette.numInk;
    if (type === "fn") return palette.fnInk;
    if (type === "op") {
      if (opTreat === "match") return palette.numInk;
      if (opTreat === "outlined") return palette.op;
      if (opTreat === "inverted") return palette.num;
      return palette.opInk;
    }
    if (type === "eq") {
      if (equalsStyle === "outlined") return palette.eq;
      return palette.eqInk;
    }
    return palette.numInk;
  };

  const materialStyle = (type, bg) => {
    const s = bevelScale;
    if (material === "neumorphic") {
      const dark = "rgba(0,0,0,0.18)";
      const light = "rgba(255,255,255,0.12)";
      return {
        background: bg,
        boxShadow: `${4*s}px ${4*s}px ${10*s}px ${dark}, -${3*s}px -${3*s}px ${8*s}px ${light}, inset 0 0 0 0 transparent`,
        border: "none",
      };
    }
    if (material === "glass") {
      return {
        background: `linear-gradient(180deg, ${withAlpha(bg, 0.85)}, ${withAlpha(bg, 0.55)})`,
        backdropFilter: "blur(6px)",
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), 0 ${2*s}px ${6*s}px rgba(0,0,0,0.10)`,
        border: `1px solid rgba(255,255,255,0.18)`,
      };
    }
    if (material === "brutalist") {
      return {
        background: bg,
        boxShadow: `${3*s}px ${3*s}px 0 0 ${palette.face2 || "#000"}`,
        border: `2px solid ${palette.face2 || "#000"}`,
      };
    }
    if (material === "embossed") {
      return {
        background: bg,
        boxShadow: `inset 0 ${2*s}px 0 0 rgba(255,255,255,0.22), inset 0 -${2*s}px 0 0 rgba(0,0,0,0.18), 0 ${1*s}px ${2*s}px rgba(0,0,0,0.15)`,
        border: "none",
      };
    }
    if (material === "outline") {
      return {
        background: "transparent",
        border: `1.5px solid ${type === "op" ? palette.op : type === "eq" ? palette.eq : palette.numInk}`,
        boxShadow: "none",
      };
    }
    if (material === "ghost") {
      return {
        background: withAlpha(bg, 0.18),
        border: "none",
        boxShadow: "none",
      };
    }
    if (material === "block") {
      return {
        background: bg,
        border: `${2*s}px solid ${palette.face2 || palette.numInk}`,
        boxShadow: "none",
      };
    }
    // flat
    return {
      background: bg,
      border: "none",
      boxShadow: "none",
    };
  };

  const renderButton = (cell, rIdx, cIdx) => {
    const bg = buttonBg(cell.t);
    const ink = buttonInk(cell.t);
    const ms = materialStyle(cell.t, bg);
    const isEq = cell.t === "eq";
    const eqGlow = isEq && equalsStyle === "glow"
      ? `, 0 0 ${24*bevelScale}px ${withAlpha(palette.glow, 0.7)}`
      : "";
    const isPressed = pressed === cell.l;
    let animStyle = {};
    if (isPressed) {
      if (press === "bounce") animStyle.animation = "press-bounce 220ms ease";
      else if (press === "flash") animStyle.animation = "press-flash 220ms ease";
      else if (press === "press") animStyle.transform = "scale(0.94)";
    }
    const eqFontSize = isEq && equalsStyle === "big" ? `${22 * fontScale}px` : `${17 * fontScale}px`;
    const fontSize = cell.t === "num"
      ? `${20 * fontScale}px`
      : cell.t === "eq"
        ? eqFontSize
        : `${16 * fontScale}px`;

    const style = {
      gridColumn: cell.span ? `span ${cell.span}` : "auto",
      ...ms,
      boxShadow: (ms.boxShadow || "") + eqGlow,
      color: ink,
      borderRadius: radius,
      minHeight: btnHeight,
      fontFamily: btnFont.font,
      fontWeight: btnFont.weight,
      fontSize,
      letterSpacing: "0.01em",
      cursor: "pointer",
      transition: "transform 80ms ease, filter 80ms ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
      outline: "none",
      ...animStyle,
    };

    return (
      <button
        key={`${rIdx}-${cIdx}-${cell.l}`}
        style={style}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => handle(cell)}
      >
        {cell.l}
      </button>
    );
  };

  // background pattern for stage
  const bgPattern = stagePattern(t.bg, palette);

  // case style
  const caseStyle = {
    background: caseBg,
    borderRadius: caseRadius,
    padding: casePadding,
    boxShadow: caseShadow + (insetShadow !== "none" ? ", " + insetShadow : ""),
    border: caseBorder,
    width: calcWidth,
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    gap: padCase * 0.7,
    transition: "all 200ms cubic-bezier(.2,.7,.2,1)",
  };

  // display style
  const dispBoxStyle = {
    background: palette.display,
    color: palette.displayInk,
    borderRadius: Math.max(0, radius - 2),
    padding: `${displayHeight * 0.18}px ${displayHeight * 0.24}px`,
    minHeight: displayHeight,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: t.displayAlign === "left" ? "flex-start" : t.displayAlign === "center" ? "center" : "flex-end",
    overflow: "hidden",
    position: "relative",
    boxShadow: material === "neumorphic"
      ? `inset 4px 4px 10px rgba(0,0,0,0.25), inset -3px -3px 8px rgba(255,255,255,0.04)`
      : "none",
  };

  // brand line
  const brandLine = t.brand ? (
    <div style={{
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 9.5,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: withAlpha(palette.displayInk, 0.55),
      marginBottom: 6,
      alignSelf: t.displayAlign === "left" ? "flex-start" : t.displayAlign === "center" ? "center" : "flex-end",
    }}>{t.brandText}</div>
  ) : null;

  // history
  const histLine = (
    <div style={{
      fontFamily: dispStyle.font,
      fontSize: 13 * fontScale,
      letterSpacing: dispStyle.letter,
      color: withAlpha(palette.displayInk, 0.45),
      minHeight: 16,
      lineHeight: 1.2,
    }}>{history}</div>
  );

  const mainDigit = (
    <div style={{
      fontFamily: dispStyle.font,
      fontWeight: dispStyle.weight,
      letterSpacing: dispStyle.letter,
      fontSize: `${displayHeight * 0.45}px`,
      lineHeight: 1.05,
      color: palette.displayInk,
      textShadow: t.display === "lcd" || t.display === "terminal"
        ? `0 0 12px ${withAlpha(palette.displayInk, 0.35)}`
        : "none",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: "100%",
      textAlign: t.displayAlign === "left" ? "left" : t.displayAlign === "center" ? "center" : "right",
    }}>{display}</div>
  );

  // grid
  const buttons = layout.rows.map((row, ri) => row.map((cell, ci) => renderButton(cell, ri, ci)));

  return (
    <>
      {bgPattern}
      <div className="calc-wrap">
        <div style={caseStyle}>
          <div style={dispBoxStyle}>
            {brandLine}
            {histLine}
            {mainDigit}
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
            gap: gap,
          }}>
            {buttons}
          </div>
        </div>
      </div>
    </>
  );
}

function opLabel(op) {
  if (op === "add") return "+";
  if (op === "sub") return "−";
  if (op === "mul") return "×";
  if (op === "div") return "÷";
  return "";
}

function withAlpha(hex, a) {
  if (!hex) return `rgba(0,0,0,${a})`;
  if (hex.startsWith("rgb")) return hex;
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function stagePattern(kind, palette) {
  if (kind === "none") return null;
  const c1 = withAlpha(palette.face2 || palette.face, 0.6);
  const c2 = withAlpha("#000", 0.04);
  let bg, size;
  if (kind === "dots") { bg = `radial-gradient(circle, ${c2} 1.2px, transparent 1.5px)`; size = "22px 22px"; }
  else if (kind === "grid") { bg = `linear-gradient(${c2} 1px, transparent 1px), linear-gradient(90deg, ${c2} 1px, transparent 1px)`; size = "32px 32px"; }
  else if (kind === "stripes") { bg = `repeating-linear-gradient(45deg, ${c2} 0 1px, transparent 1px 14px)`; size = "auto"; }
  else if (kind === "noise") {
    const svg = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><filter id="n"><feTurbulence baseFrequency="0.9" numOctaves="2"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`);
    bg = `url("data:image/svg+xml,${svg}")`;
    size = "120px 120px";
  } else if (kind === "blob") {
    bg = `radial-gradient(60% 60% at 30% 40%, ${withAlpha(palette.glow, 0.18)} 0%, transparent 70%), radial-gradient(50% 50% at 80% 80%, ${withAlpha(palette.op, 0.14)} 0%, transparent 70%)`;
    size = "auto";
  }
  return <div className="floor" style={{ backgroundImage: bg, backgroundSize: size }} />;
}

Object.assign(window, { Calculator });
