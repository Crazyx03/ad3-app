import { useState, useEffect, useCallback } from "react";

// ══════════════════════════════════════
//  DATA
// ══════════════════════════════════════
const DAYS = [
  {
    day: 1, title: "Biceps, Back & Shoulders", color: "#E63946",
    exercises: [
      { name: "Deadlifts", sets: 4, reps: "6–12" },
      { name: "Barbell Rows", sets: 3, reps: "10–12" },
      { name: "T-Bar Rows", sets: 3, reps: "10–12" },
      { name: "Dumbbell Rows", sets: 3, reps: "10–12" },
      { name: "Bicep Curls", sets: 4, reps: "12" },
      { name: "Alternating DB Curls", sets: 3, reps: "12" },
      { name: "EZ-Bar Bicep Curls", sets: 3, reps: "12" },
      { name: "Cable Bicep Curls", sets: 4, reps: "12" },
      { name: "Overhead Shoulder Press", sets: 4, reps: "10–12" },
      { name: "DB Shoulder Presses", sets: 4, reps: "12" },
      { name: "DB Front Raises", sets: 4, reps: "12" },
    ],
  },
  {
    day: 2, title: "Legs", color: "#2A9D8F",
    exercises: [
      { name: "Squats", sets: 5, reps: "6–12" },
      { name: "Leg Presses", sets: 4, reps: "12" },
      { name: "Lunges", sets: 2, reps: "30m ea." },
      { name: "Deadlifts", sets: 3, reps: "12" },
      { name: "Leg Curls", sets: 3, reps: "12" },
    ],
  },
  {
    day: 3, title: "Chest & Triceps", color: "#E9C46A",
    exercises: [
      { name: "Bench Presses", sets: 5, reps: "12" },
      { name: "Incline Bench Presses", sets: 3, reps: "12" },
      { name: "Dumbbell Presses", sets: 3, reps: "12" },
      { name: "Lateral Raises", sets: 4, reps: "12" },
      { name: "EZ-Bar Tricep Ext.", sets: 3, reps: "12" },
      { name: "Seated DB Tricep Ext.", sets: 4, reps: "12" },
      { name: "Close Grip Bench", sets: 4, reps: "12" },
    ],
  },
  {
    day: 4, title: "Back & Biceps + Shoulders", color: "#264653",
    exercises: [
      { name: "Barbell Rows", sets: 5, reps: "10–12" },
      { name: "Low Pulley Rows", sets: 4, reps: "10–12" },
      { name: "Close-Grip Lat PD", sets: 3, reps: "10–12" },
      { name: "Wide-Grip Lat PD", sets: 3, reps: "10–12" },
      { name: "Alternating Bicep Curls", sets: 4, reps: "12" },
      { name: "Machine Bicep Curls", sets: 3, reps: "12" },
      { name: "Barbell Bicep Curls", sets: 3, reps: "12" },
      { name: "Low Cable Bar Curls", sets: 4, reps: "12" },
      { name: "Overhead Shoulder Press", sets: 4, reps: "12" },
      { name: "Front Raises", sets: 3, reps: "8–25" },
      { name: "DB Shoulder Presses", sets: 3, reps: "8–25" },
    ],
  },
  {
    day: 5, title: "Legs", color: "#F4A261",
    exercises: [
      { name: "Leg Extensions", sets: 4, reps: "30" },
      { name: "Front Squats", sets: 4, reps: "12–15" },
      { name: "Hack Squats", sets: 3, reps: "12" },
      { name: "Standing Leg Curls", sets: 3, reps: "12–15" },
      { name: "Leg Curls", sets: 4, reps: "12–15" },
    ],
  },
  {
    day: 6, title: "Chest, Tri, Abs & Calves", color: "#9B5DE5",
    exercises: [
      { name: "DB Incline Bench", sets: 4, reps: "12" },
      { name: "Decline Bench Presses", sets: 3, reps: "12" },
      { name: "Incline DB Flys", sets: 3, reps: "12" },
      { name: "Decline DB Flys", sets: 3, reps: "12" },
      { name: "EZ-Bar French Press", sets: 4, reps: "12" },
      { name: "Parallel Dip Bars", sets: 4, reps: "12" },
      { name: "EZ-Bar Tricep Ext.", sets: 3, reps: "12" },
      { name: "Standing Calf Raises", sets: 4, reps: "12" },
      { name: "Seated Calf Raises", sets: 4, reps: "12" },
      { name: "Crunches", sets: 3, reps: "Failure" },
    ],
  },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const dk = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const fmt = (d) => `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
const same = (a,b) => a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();

// ══════════════════════════════════════
//  localStorage helpers
// ══════════════════════════════════════
const store = {
  get(key) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } },
  set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
  del(key) { try { localStorage.removeItem(key); } catch {} },
};

// ══════════════════════════════════════
//  SPLASH SCREEN
// ══════════════════════════════════════
function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0); // 0=logo fade in, 1=tagline, 2=fade out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => onDone(), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#0A0A0A",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: phase === 2 ? 0 : 1,
      transition: "opacity 0.7s ease",
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute", width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(230,57,70,0.15) 0%, transparent 70%)",
        filter: "blur(40px)",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 1s ease",
      }} />

      {/* Logo */}
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "96px",
        letterSpacing: "8px",
        color: "#E63946",
        lineHeight: 1,
        opacity: phase >= 0 ? 1 : 0,
        transform: phase >= 0 ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        textShadow: "0 0 60px rgba(230,57,70,0.3)",
        position: "relative",
        zIndex: 1,
      }}>
        AD#3
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: "6px",
        textTransform: "uppercase",
        color: "rgba(240,237,230,0.5)",
        marginTop: "16px",
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.6s ease 0.1s",
        position: "relative",
        zIndex: 1,
      }}>
        Train · Track · Grow
      </div>

      {/* Divider line */}
      <div style={{
        width: phase >= 1 ? "120px" : "0px",
        height: "2px",
        background: "linear-gradient(90deg, transparent, #E63946, transparent)",
        marginTop: "24px",
        transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        position: "relative",
        zIndex: 1,
      }} />

      {/* Version */}
      <div style={{
        position: "absolute", bottom: "40px",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase",
        color: "rgba(240,237,230,0.15)",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 0.6s ease 0.3s",
      }}>
        Version 1.0
      </div>
    </div>
  );
}

// ══════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════
export default function AD3() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeDay, setActiveDay] = useState(0);
  const [checked, setChecked] = useState({});
  const [weights, setWeights] = useState({});
  const [selDate, setSelDate] = useState(new Date());
  const [calOpen, setCalOpen] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date());
  const [histEx, setHistEx] = useState(null);
  const [histData, setHistData] = useState([]);
  const [loggedDates, setLoggedDates] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState("");

  const dateKey = dk(selDate);
  const today = new Date();

  // ── Load session ──
  useEffect(() => {
    setLoading(true);
    const data = store.get(`ad3:${dateKey}`);
    if (data) {
      setActiveDay(data.activeDay ?? 0);
      setChecked(data.checked ?? {});
      setWeights(data.weights ?? {});
    } else {
      setChecked({});
      setWeights({});
    }
    setLoading(false);
  }, [dateKey]);

  // ── Load date index ──
  useEffect(() => {
    const idx = store.get("ad3:index");
    if (idx) setLoggedDates(new Set(idx));
  }, []);

  // ── Save ──
  const save = useCallback((day, ch, wt) => {
    const hasAny = Object.values(wt).some(v => v) || Object.values(ch).some(v => v);
    if (!hasAny) return;
    store.set(`ad3:${dateKey}`, { activeDay: day, checked: ch, weights: wt, ts: new Date().toISOString() });
    const next = new Set(loggedDates);
    next.add(dateKey);
    setLoggedDates(next);
    store.set("ad3:index", [...next]);
    setSaved("Saved");
    setTimeout(() => setSaved(""), 1200);
  }, [dateKey, loggedDates]);

  const toggle = (di, ei) => {
    const k = `${di}-${ei}`;
    const n = { ...checked, [k]: !checked[k] };
    setChecked(n); save(activeDay, n, weights);
  };
  const setWt = (di, ei, v) => {
    const k = `${di}-${ei}`;
    const n = { ...weights, [k]: v };
    setWeights(n); save(activeDay, checked, n);
  };
  const pickDay = (i) => { setActiveDay(i); save(i, checked, weights); };

  // ── History ──
  const loadHist = (name, di, ei) => {
    if (histEx && histEx.name === name && histEx.dayIdx === di) { setHistEx(null); return; }
    setHistEx({ name, dayIdx: di, exIdx: ei });
    const entries = [];
    const idx = store.get("ad3:index");
    if (idx) {
      const dates = [...idx].sort().reverse();
      for (const d of dates.slice(0, 90)) {
        const sess = store.get(`ad3:${d}`);
        if (sess?.weights?.[`${di}-${ei}`]) {
          entries.push({ date: d, weight: sess.weights[`${di}-${ei}`] });
        }
      }
    }
    setHistData(entries);
  };

  // ── Reset ──
  const resetDay = () => {
    setChecked({}); setWeights({});
    store.del(`ad3:${dateKey}`);
    const next = new Set(loggedDates);
    next.delete(dateKey);
    setLoggedDates(next);
    store.set("ad3:index", [...next]);
  };

  const cur = DAYS[activeDay];
  const doneCount = cur.exercises.filter((_, i) => checked[`${activeDay}-${i}`]).length;
  const pct = (doneCount / cur.exercises.length) * 100;
  const totalSets = cur.exercises.reduce((s, e) => s + e.sets, 0);

  // Calendar
  const cy = calMonth.getFullYear(), cm = calMonth.getMonth();
  const fd = new Date(cy, cm, 1).getDay();
  const dim = new Date(cy, cm + 1, 0).getDate();
  const grid = [...Array(fd).fill(null), ...Array.from({ length: dim }, (_, i) => i + 1)];

  const C = cur.color;

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "#F0EDE6", fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Bebas+Neue&display=swap" rel="stylesheet" />
      <style>{`input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}input[type=number]{-moz-appearance:textfield}*{box-sizing:border-box}::-webkit-scrollbar{display:none}`}</style>

      {/* ═══ SPLASH ═══ */}
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      {/* ═══ HEADER ═══ */}
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "linear-gradient(180deg,rgba(255,255,255,0.03),transparent)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: "40px", letterSpacing: "3px", margin: 0, color: C, lineHeight: 1, transition: "color 0.3s" }}>AD#3</h1>
            <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(240,237,230,0.3)" }}>Training</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {saved && <span style={{ fontSize: "10px", fontWeight: 700, color: "#2A9D8F", letterSpacing: "1px", textTransform: "uppercase" }}>{saved}</span>}
            <span style={{ fontSize: "10px", color: "rgba(240,237,230,0.25)", letterSpacing: "1px" }}>{loggedDates.size} logs</span>
          </div>
        </div>

        {/* Date bar */}
        <div onClick={() => { setCalOpen(!calOpen); setCalMonth(new Date(selDate)); }} style={{
          marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "7px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
        }}>
          <span style={{ fontSize: "15px" }}>📅</span>
          <span style={{ fontSize: "13px", fontWeight: 600 }}>{same(selDate, today) ? "Today" : fmt(selDate)}</span>
          {same(selDate, today) && <span style={{ fontSize: "11px", color: "rgba(240,237,230,0.35)" }}>{fmt(today)}</span>}
          <span style={{ fontSize: "9px", color: "rgba(240,237,230,0.25)", marginLeft: "2px" }}>{calOpen ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* ═══ CALENDAR ═══ */}
      {calOpen && (
        <div style={{ margin: "0 20px", padding: "14px", background: "#131313", borderRadius: "0 0 12px 12px", border: "1px solid rgba(255,255,255,0.08)", borderTop: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <button onClick={e => { e.stopPropagation(); setCalMonth(new Date(cy, cm - 1, 1)); }} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#F0EDE6", borderRadius: "6px", padding: "5px 10px", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: "12px", fontWeight: 600 }}>◀</button>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: "18px", letterSpacing: "2px", color: C }}>{MONTHS[cm]} {cy}</span>
            <button onClick={e => { e.stopPropagation(); setCalMonth(new Date(cy, cm + 1, 1)); }} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#F0EDE6", borderRadius: "6px", padding: "5px 10px", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: "12px", fontWeight: 600 }}>▶</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "1px", marginBottom: "2px" }}>
            {WDAYS.map(w => <div key={w} style={{ textAlign: "center", fontSize: "9px", fontWeight: 700, color: "rgba(240,237,230,0.25)", letterSpacing: "1px", padding: "3px 0" }}>{w}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px" }}>
            {grid.map((day, idx) => {
              if (!day) return <div key={`e${idx}`} />;
              const td = new Date(cy, cm, day);
              const tk = dk(td);
              const isSel = same(td, selDate);
              const isT = same(td, today);
              const has = loggedDates.has(tk);
              return (
                <button key={idx} onClick={e => { e.stopPropagation(); setSelDate(td); setCalOpen(false); setHistEx(null); }} style={{
                  padding: "7px 2px", borderRadius: "5px", border: isSel ? `2px solid ${C}` : isT ? "2px solid rgba(255,255,255,0.15)" : "2px solid transparent",
                  background: isSel ? `${C}20` : "transparent", color: isSel ? C : "#F0EDE6", cursor: "pointer",
                  fontFamily: "'DM Sans'", fontSize: "12px", fontWeight: isSel || isT ? 700 : 400, textAlign: "center", position: "relative",
                }}>
                  {day}
                  {has && <div style={{ position: "absolute", bottom: "2px", left: "50%", transform: "translateX(-50%)", width: "4px", height: "4px", borderRadius: "50%", background: C }} />}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "10px", justifyContent: "center" }}>
            <button onClick={e => { e.stopPropagation(); setSelDate(new Date()); setCalOpen(false); setHistEx(null); }} style={{
              padding: "5px 14px", borderRadius: "6px", background: `${C}20`, border: `1px solid ${C}40`,
              color: C, cursor: "pointer", fontFamily: "'DM Sans'", fontSize: "11px", fontWeight: 600,
            }}>Today</button>
          </div>
        </div>
      )}

      {/* ═══ DAY TABS ═══ */}
      <div style={{ display: "flex", gap: "5px", padding: "14px 20px", overflowX: "auto" }}>
        {DAYS.map((d, i) => {
          const act = i === activeDay;
          const allDone = d.exercises.every((_, j) => checked[`${i}-${j}`]);
          return (
            <button key={i} onClick={() => pickDay(i)} style={{
              flex: "0 0 auto", padding: "8px 14px", borderRadius: "9px",
              border: act ? `2px solid ${d.color}` : "2px solid rgba(255,255,255,0.07)",
              background: act ? `${d.color}15` : "rgba(255,255,255,0.02)",
              color: act ? d.color : "rgba(240,237,230,0.45)", cursor: "pointer",
              fontFamily: "'DM Sans'", fontSize: "12px", fontWeight: 700, letterSpacing: "0.3px",
              position: "relative", whiteSpace: "nowrap",
            }}>
              <div style={{ fontSize: "10px", opacity: 0.5, marginBottom: "1px" }}>Day {d.day}</div>
              <div style={{ fontSize: "10px" }}>{d.title.length > 14 ? d.title.slice(0, 14) + "…" : d.title}</div>
              {allDone && <div style={{ position: "absolute", top: "-3px", right: "-3px", width: "12px", height: "12px", borderRadius: "50%", background: "#2A9D8F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", color: "#fff", fontWeight: 700 }}>✓</div>}
            </button>
          );
        })}
      </div>

      {/* ═══ DAY HEADER ═══ */}
      <div style={{ padding: "6px 20px 10px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: "26px", letterSpacing: "2px", margin: "0 0 10px" }}>
            Day {cur.day} <span style={{ color: C }}>— {cur.title}</span>
          </h2>
          <button onClick={resetDay} style={{
            background: "none", border: "none", color: "rgba(240,237,230,0.2)", cursor: "pointer",
            fontFamily: "'DM Sans'", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase",
          }}>Reset</button>
        </div>

        <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
          {[{ l: "Exercises", v: cur.exercises.length }, { l: "Sets", v: totalSets }, { l: "Done", v: `${doneCount}/${cur.exercises.length}` }].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.035)", borderRadius: "7px", padding: "7px 12px", flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: C }}>{s.v}</div>
              <div style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(240,237,230,0.3)", marginTop: "1px" }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${C},${C}CC)`, borderRadius: "2px", transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>
      </div>

      {/* ═══ EXERCISES ═══ */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "rgba(240,237,230,0.25)", fontSize: "13px" }}>Loading…</div>
      ) : (
        <div style={{ padding: "2px 20px 30px", display: "flex", flexDirection: "column", gap: "5px" }}>
          {cur.exercises.map((ex, i) => {
            const k = `${activeDay}-${i}`;
            const isDone = checked[k];
            const wt = weights[k] || "";
            const isHistOpen = histEx && histEx.name === ex.name && histEx.dayIdx === activeDay;
            return (
              <div key={k}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", borderRadius: "9px",
                  background: isDone ? `${C}10` : "rgba(255,255,255,0.025)",
                  border: isDone ? `1px solid ${C}35` : "1px solid rgba(255,255,255,0.045)",
                  transition: "all 0.2s",
                }}>
                  <div onClick={() => toggle(activeDay, i)} style={{
                    width: "20px", height: "20px", borderRadius: "5px",
                    border: isDone ? `2px solid ${C}` : "2px solid rgba(255,255,255,0.18)",
                    background: isDone ? C : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, cursor: "pointer", fontSize: "12px", color: isDone ? "#0A0A0A" : "transparent", fontWeight: 700,
                  }}>✓</div>

                  <div onClick={() => toggle(activeDay, i)} style={{
                    flex: 1, fontSize: "13px", fontWeight: 500, color: isDone ? "rgba(240,237,230,0.35)" : "#F0EDE6",
                    textDecoration: isDone ? "line-through" : "none", cursor: "pointer", userSelect: "none",
                  }}>{ex.name}</div>

                  <div style={{ display: "flex", alignItems: "center", gap: "3px", flexShrink: 0 }}>
                    <input type="number" inputMode="numeric" placeholder="—" value={wt}
                      onChange={e => setWt(activeDay, i, e.target.value)} onClick={e => e.stopPropagation()}
                      style={{
                        width: "44px", padding: "4px 5px", borderRadius: "5px",
                        border: wt ? `1.5px solid ${C}70` : "1.5px solid rgba(255,255,255,0.1)",
                        background: wt ? `${C}0D` : "rgba(255,255,255,0.04)",
                        color: wt ? "#F0EDE6" : "rgba(240,237,230,0.25)",
                        fontSize: "12px", fontWeight: 600, fontFamily: "'DM Sans'",
                        textAlign: "center", outline: "none",
                      }} />
                    <span style={{ fontSize: "9px", fontWeight: 600, color: "rgba(240,237,230,0.25)" }}>lb</span>
                  </div>

                  <span style={{
                    background: `${C}22`, color: C, padding: "3px 8px", borderRadius: "5px",
                    fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0,
                  }}>{ex.sets}×{ex.reps}</span>

                  <div onClick={() => loadHist(ex.name, activeDay, i)} style={{
                    width: "26px", height: "26px", borderRadius: "5px",
                    background: isHistOpen ? `${C}18` : "rgba(255,255,255,0.04)",
                    border: isHistOpen ? `1px solid ${C}50` : "1px solid rgba(255,255,255,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0, fontSize: "12px",
                  }}>📊</div>
                </div>

                {/* History Panel */}
                {isHistOpen && (
                  <div style={{
                    margin: "3px 0 3px 30px", padding: "12px 14px",
                    background: "#121212", borderRadius: "8px", border: `1px solid ${C}25`,
                  }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: C, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                      {ex.name} — History
                    </div>
                    {histData.length === 0 ? (
                      <div style={{ fontSize: "11px", color: "rgba(240,237,230,0.3)", fontStyle: "italic" }}>No previous logs yet — start today!</div>
                    ) : (
                      <>
                        {histData.length > 1 && (
                          <div style={{ height: "50px", display: "flex", alignItems: "flex-end", gap: "2px", marginBottom: "10px", padding: "0 2px" }}>
                            {(() => {
                              const vals = histData.slice().reverse().map(h => parseFloat(h.weight) || 0);
                              const mx = Math.max(...vals, 1);
                              return vals.map((v, idx) => (
                                <div key={idx} style={{
                                  flex: 1, maxWidth: "16px", height: `${(v / mx) * 100}%`,
                                  background: `linear-gradient(180deg,${C},${C}55)`,
                                  borderRadius: "2px 2px 0 0", minHeight: "3px",
                                }} title={`${v} lb`} />
                              ));
                            })()}
                          </div>
                        )}
                        <div style={{ display: "flex", flexDirection: "column", gap: "3px", maxHeight: "180px", overflowY: "auto" }}>
                          {histData.map((h, idx) => {
                            const prev = histData[idx + 1];
                            const diff = prev ? (parseFloat(h.weight) - parseFloat(prev.weight)) : null;
                            return (
                              <div key={idx} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "3px 6px", borderRadius: "4px",
                                background: idx === 0 ? "rgba(255,255,255,0.035)" : "transparent",
                              }}>
                                <span style={{ fontSize: "11px", color: idx === 0 ? "#F0EDE6" : "rgba(240,237,230,0.45)", fontWeight: idx === 0 ? 600 : 400 }}>{h.date}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <span style={{ fontSize: "12px", fontWeight: 700, color: idx === 0 ? C : "rgba(240,237,230,0.5)" }}>{h.weight} lb</span>
                                  {diff !== null && diff !== 0 && (
                                    <span style={{ fontSize: "9px", fontWeight: 700, color: diff > 0 ? "#2A9D8F" : "#E63946" }}>
                                      {diff > 0 ? "▲" : "▼"} {Math.abs(diff)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
