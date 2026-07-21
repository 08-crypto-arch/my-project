// Tweaks panel (always on, not the hostable system).

function Segmented({ value, onChange, options, wrap }) {
  const cls = wrap === 4 ? "seg wrap" : wrap === 3 ? "seg wrap-3" : wrap === 2 ? "seg wrap-2" : "seg";
  return (
    <div className={cls}>
      {Object.entries(options).map(([k, v]) => (
        <button
          key={k}
          className={value === k ? "active" : ""}
          onClick={() => onChange(k)}
        >{v.name || k}</button>
      ))}
    </div>
  );
}

function Slider({ value, onChange, min, max, step, unit }) {
  return (
    <div className="slider-row">
      <input
        type="range"
        min={min}
        max={max}
        step={step || 1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <div className="val">{value}{unit || ""}</div>
    </div>
  );
}

function PaletteSwatch({ pk, palette, active, onClick }) {
  return (
    <div className={`swatch ${active ? "active" : ""}`} onClick={onClick} title={palette.name}>
      <div className="strip">
        <div style={{ background: palette.face }} />
        <div style={{ background: palette.num }} />
        <div style={{ background: palette.op }} />
        <div style={{ background: palette.eq }} />
      </div>
      <div className="name">{palette.name}</div>
    </div>
  );
}

function Section({ label, value, children }) {
  return (
    <div className="panel-section">
      <div className="label">
        <span>{label}</span>
        {value != null && <span className="value">{value}</span>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ value, onChange, options }) {
  return (
    <div className="seg">
      {options.map((opt) => (
        <button
          key={opt.k}
          className={value === opt.k ? "active" : ""}
          onClick={() => onChange(opt.k)}
        >{opt.name}</button>
      ))}
    </div>
  );
}

function TextInput({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={24}
      style={{
        width: "100%",
        border: "1px solid var(--line)",
        background: "var(--paper)",
        color: "var(--ink)",
        padding: "7px 9px",
        fontFamily: "var(--mono)",
        fontSize: 11,
        borderRadius: 3,
        outline: "none",
      }}
    />
  );
}

function ControlsPanel({ t, set, reset, randomize, total }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Construction Kit</h2>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="reset-btn" onClick={reset}>Reset</button>
          <button className="randomize" onClick={randomize}>Randomize</button>
        </div>
      </div>

      <Section label="Palette" value={PALETTES[t.palette].name}>
        <div className="swatches">
          {PALETTE_KEYS.map((pk) => (
            <PaletteSwatch
              key={pk}
              pk={pk}
              palette={PALETTES[pk]}
              active={t.palette === pk}
              onClick={() => set("palette", pk)}
            />
          ))}
        </div>
      </Section>

      <Section label="Material" value={MATERIALS[t.material].name}>
        <Segmented value={t.material} onChange={(v) => set("material", v)} options={MATERIALS} wrap={4} />
      </Section>

      <Section label="Layout" value={LAYOUTS[t.layout].name}>
        <Segmented value={t.layout} onChange={(v) => set("layout", v)} options={LAYOUTS} wrap={3} />
      </Section>

      <Section label="Button shape" value={SHAPES[t.shape].name}>
        <Segmented value={t.shape} onChange={(v) => set("shape", v)} options={SHAPES} wrap={3} />
      </Section>

      <Section label="Button font" value={BUTTON_FONTS[t.btnFont].name}>
        <Segmented value={t.btnFont} onChange={(v) => set("btnFont", v)} options={BUTTON_FONTS} wrap={3} />
      </Section>

      <Section label="Display font" value={DISPLAY_STYLES[t.display].name}>
        <Segmented value={t.display} onChange={(v) => set("display", v)} options={DISPLAY_STYLES} wrap={3} />
      </Section>

      <Section label="Display align" value={t.displayAlign}>
        <Toggle value={t.displayAlign} onChange={(v) => set("displayAlign", v)} options={[
          { k: "left", name: "Left" }, { k: "center", name: "Center" }, { k: "right", name: "Right" },
        ]}/>
      </Section>

      <Section label="Operator style" value={OP_TREATMENTS[t.opTreat].name}>
        <Segmented value={t.opTreat} onChange={(v) => set("opTreat", v)} options={OP_TREATMENTS} wrap={4} />
      </Section>

      <Section label="Equals style" value={EQUALS_STYLES[t.equals].name}>
        <Segmented value={t.equals} onChange={(v) => set("equals", v)} options={EQUALS_STYLES} wrap={4} />
      </Section>

      <Section label="Casing" value={CASING[t.casing].name}>
        <Segmented value={t.casing} onChange={(v) => set("casing", v)} options={CASING} wrap={4} />
      </Section>

      <Section label="Press animation" value={PRESS_ANIMS[t.press].name}>
        <Segmented value={t.press} onChange={(v) => set("press", v)} options={PRESS_ANIMS} wrap={4} />
      </Section>

      <Section label="Background" value={BG_PATTERNS[t.bg].name}>
        <Segmented value={t.bg} onChange={(v) => set("bg", v)} options={BG_PATTERNS} wrap={3} />
      </Section>

      <Section label="Gap" value={`${t.gap}px`}>
        <Slider value={t.gap} onChange={(v) => set("gap", v)} min={0} max={20} unit="px" />
      </Section>

      <Section label="Case padding" value={`${t.casePad}px`}>
        <Slider value={t.casePad} onChange={(v) => set("casePad", v)} min={0} max={36} unit="px" />
      </Section>

      <Section label="Case radius" value={`${t.caseRadius}px`}>
        <Slider value={t.caseRadius} onChange={(v) => set("caseRadius", v)} min={0} max={56} unit="px" />
      </Section>

      <Section label="Button height" value={`${t.btnHeight}px`}>
        <Slider value={t.btnHeight} onChange={(v) => set("btnHeight", v)} min={40} max={86} unit="px" />
      </Section>

      <Section label="Calc width" value={`${t.calcWidth}px`}>
        <Slider value={t.calcWidth} onChange={(v) => set("calcWidth", v)} min={280} max={520} unit="px" />
      </Section>

      <Section label="Display height" value={`${t.displayHeight}px`}>
        <Slider value={t.displayHeight} onChange={(v) => set("displayHeight", v)} min={70} max={180} unit="px" />
      </Section>

      <Section label="Font scale" value={t.fontScale.toFixed(2)}>
        <Slider value={t.fontScale} onChange={(v) => set("fontScale", v)} min={0.7} max={1.6} step={0.05} />
      </Section>

      <Section label="Shadow depth" value={t.shadow}>
        <Slider value={t.shadow} onChange={(v) => set("shadow", v)} min={0} max={60} />
      </Section>

      <Section label="Bevel intensity" value={t.bevelScale.toFixed(2)}>
        <Slider value={t.bevelScale} onChange={(v) => set("bevelScale", v)} min={0.4} max={2.4} step={0.05} />
      </Section>

      <Section label="Show brand">
        <Toggle value={t.brand ? "on" : "off"} onChange={(v) => set("brand", v === "on")} options={[
          { k: "off", name: "Off" }, { k: "on", name: "On" },
        ]}/>
      </Section>

      {t.brand && (
        <Section label="Brand text">
          <TextInput value={t.brandText} onChange={(v) => set("brandText", v)} />
        </Section>
      )}

      <div className="panel-section" style={{borderBottom: "none"}}>
        <div className="label" style={{ marginBottom: 0 }}>
          <span>Combinations</span>
          <span className="value">{total.toLocaleString()}+</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ControlsPanel });
