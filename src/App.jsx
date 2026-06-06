import { useState, useEffect } from "react";

const schedule = [
  {
    day: "Monday", short: "MON", type: "STRIKING", color: "#ef4444",
    exercises: [
      { id: "mon1", name: "Footwork Drills", time: "10 min", detail: "In-out, lateral steps, pivots, angles after combos" },
      { id: "mon2", name: "Technique Study", time: "15 min", detail: "Pick one strike — drill it slow and precise. No rushing" },
      { id: "mon3", name: "Shadow Boxing", time: "3 × 3 min", detail: "Move, breathe, vary combos. 1 min rest between rounds" },
    ]
  },
  {
    day: "Tuesday", short: "TUE", type: "GRAPPLING", color: "#f97316",
    exercises: [
      { id: "tue1", name: "Solo Grappling Drills", time: "15 min", detail: "Shrimping, hip escapes, granby rolls, guard retention" },
      { id: "tue2", name: "Takedown Entries", time: "10 min", detail: "Level changes, penetration steps, single leg entries in air" },
      { id: "tue3", name: "Strength Circuit", time: "15 min", detail: "Pushups, squats, lunges, core planks. No rest mentality" },
    ]
  },
  {
    day: "Wednesday", short: "WED", type: "CONDITIONING", color: "#eab308",
    exercises: [
      { id: "wed1", name: "Cardio", time: "20 min", detail: "Run outside or jump-in-place intervals. Mix steady pace + sprints" },
      { id: "wed2", name: "Power Circuit", time: "15 min", detail: "Sprawls, jump squats, explosive pushups, fast shadow combo bursts" },
      { id: "wed3", name: "Muscular Endurance", time: "20 min", detail: "High-rep burnout circuits. Push past comfort. 3 sets everything" },
    ]
  },
  {
    day: "Thursday", short: "THU", type: "STRIKING", color: "#ef4444",
    exercises: [
      { id: "thu1", name: "Footwork Drills", time: "10 min", detail: "Focus on angles. Southpaw pivot, orthodox pivot, retreat angles" },
      { id: "thu2", name: "Shadow Boxing", time: "3 × 3 min", detail: "Apply footwork from earlier. Move with purpose, not randomly" },
      { id: "thu3", name: "Combo Drilling", time: "10 min", detail: "2-3 combos at speed. Jab-cross-leg kick. Jab-cross-double leg entry" },
    ]
  },
  {
    day: "Friday", short: "FRI", type: "FULL MMA", color: "#22c55e",
    exercises: [
      { id: "fri1", name: "Technique", time: "15 min", detail: "Combine a striking + grappling element into one flow" },
      { id: "fri2", name: "Shadow Boxing", time: "3 × 3 min", detail: "Full intensity. Incorporate everything from the week" },
      { id: "fri3", name: "Ground Drills", time: "10 min", detail: "Full solo grappling movement sequence nonstop" },
      { id: "fri4", name: "Agility/Speed", time: "15 min", detail: "Reaction drills, lateral quickness, explosion off the mark" },
    ]
  },
  { day: "Saturday", short: "SAT", type: "REST", color: "#374151", exercises: [] },
  { day: "Sunday", short: "SUN", type: "REST", color: "#374151", exercises: [] },
];

const meals = [
  {
    name: "Breakfast", time: "7:00 AM", cal: 600, p: 30, c: 70, f: 20,
    foods: ["4 whole eggs", "2 bread slices / 1 cup poha", "1 banana", "1 glass milk (200ml)"]
  },
  {
    name: "Mid-Morning", time: "10:30 AM", cal: 300, p: 12, c: 35, f: 15,
    foods: ["30g peanuts", "1 seasonal fruit (apple/guava)", "1 glass buttermilk"]
  },
  {
    name: "Lunch", time: "1:00 PM", cal: 700, p: 30, c: 110, f: 12,
    foods: ["2 cups rice / 4 rotis", "1 cup dal", "Mixed sabzi", "1 cup curd"]
  },
  {
    name: "Pre-Training", time: "4:30 PM", cal: 350, p: 10, c: 65, f: 10,
    foods: ["2 bananas", "2 tbsp peanut butter on bread", "250ml water"]
  },
  {
    name: "Post-Training", time: "6:30 PM", cal: 400, p: 40, c: 50, f: 10,
    foods: ["4 egg whites + 2 whole eggs", "1 cup rice / 2 rotis", "1 glass milk"]
  },
  {
    name: "Dinner", time: "8:30 PM", cal: 350, p: 18, c: 35, f: 8,
    foods: ["Chicken / paneer (150g)", "2 rotis", "Dal + salad"]
  },
];

const phases = [
  { num: "1-2", label: "FOUNDATION", desc: "Form over everything. 3 min rounds. Learn every movement.", color: "#3b82f6" },
  { num: "3-4", label: "BUILD", desc: "Increase intensity. Push to 4 min rounds. Drill faster.", color: "#f97316" },
  { num: "5-6", label: "PEAK", desc: "Full gas. 5 min rounds. Measure all improvements.", color: "#ef4444" },
];

export default function FightLab() {
  const [tab, setTab] = useState("today");
  const [currentWeek, setCurrentWeek] = useState(1);
  const [completed, setCompleted] = useState({});
  const [waterCount, setWaterCount] = useState(0);
  const [notes, setNotes] = useState({});
  const [noteInput, setNoteInput] = useState("");
  const [expandedDay, setExpandedDay] = useState(null);
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try { const r = await window.storage.get('fl-week'); if (r) setCurrentWeek(parseInt(r.value) || 1); } catch (e) { }
      try { const r = await window.storage.get('fl-completed'); if (r) setCompleted(JSON.parse(r.value) || {}); } catch (e) { }
      try { const r = await window.storage.get('fl-water'); if (r) setWaterCount(parseInt(r.value) || 0); } catch (e) { }
      try { const r = await window.storage.get('fl-notes'); if (r) setNotes(JSON.parse(r.value) || {}); } catch (e) { }
      setLoaded(true);
    };
    load();
  }, []);

  useEffect(() => {
    setNoteInput(notes[currentWeek] || "");
  }, [currentWeek, notes]);

  const toggleExercise = async (key) => {
    const next = { ...completed, [key]: !completed[key] };
    setCompleted(next);
    try { await window.storage.set('fl-completed', JSON.stringify(next)); } catch (e) { }
  };

  const setWeek = async (w) => {
    setCurrentWeek(w);
    try { await window.storage.set('fl-week', String(w)); } catch (e) { }
  };

  const addWater = async () => {
    const n = waterCount + 1;
    setWaterCount(n);
    try { await window.storage.set('fl-water', String(n)); } catch (e) { }
  };

  const saveNote = async (week, text) => {
    const next = { ...notes, [week]: text };
    setNotes(next);
    try { await window.storage.set('fl-notes', JSON.stringify(next)); } catch (e) { }
  };

  const todayIndex = (new Date().getDay() + 6) % 7;
  const todaySchedule = schedule[todayIndex];
  const currentPhase = currentWeek <= 2 ? phases[0] : currentWeek <= 4 ? phases[1] : phases[2];
  const todayDone = todaySchedule.exercises.filter(e => completed[`w${currentWeek}-${e.id}`]).length;

  const totalEx = schedule.reduce((a, d) => a + d.exercises.length, 0) * 6;
  const doneCount = Object.values(completed).filter(Boolean).length;
  const percent = totalEx > 0 ? Math.min(Math.round((doneCount / totalEx) * 100), 100) : 0;

  const s = {
    app: { fontFamily: "'Barlow', sans-serif", background: "#080808", minHeight: "100vh", color: "#fff", maxWidth: "430px", margin: "0 auto", paddingBottom: "72px" },
    header: { padding: "18px 20px 12px", borderBottom: "1px solid #161616", display: "flex", justifyContent: "space-between", alignItems: "center" },
    nav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "430px", background: "#0c0c0c", borderTop: "1px solid #1a1a1a", display: "flex", zIndex: 100 },
    nb: (a) => ({ flex: 1, padding: "10px 0 8px", background: "none", border: "none", color: a ? "#ef4444" : "#3a3a3a", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", fontSize: "9px", fontFamily: "'Oswald', sans-serif", letterSpacing: "1.5px", transition: "color 0.2s" }),
    card: { background: "#0f0f0f", margin: "10px 14px", borderRadius: "14px", overflow: "hidden", border: "1px solid #181818" },
    sec: { fontFamily: "'Oswald', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#3a3a3a", padding: "18px 18px 6px", textTransform: "uppercase" },
  };

  if (!loaded) return (
    <div style={{ background: "#080808", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "6px", fontSize: "13px", color: "#ef4444" }}>LOADING...</div>
    </div>
  );

  return (
    <div style={s.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Barlow:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        textarea:focus { outline: none; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <div style={s.header}>
    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "22px", fontWeight: 700, letterSpacing: "4px", color: "#ef4444" }}>
      FIGHT<span style={{ color: "#333" }}>//</span>LAB
    </div>
    <div style={{ background: "#111", border: "1px solid #222", borderRadius: "20px", padding: "5px 14px", fontSize: "11px", color: "#555", fontFamily: "'Oswald', sans-serif", letterSpacing: "2px" }}>
      W{currentWeek} · 6WK EXP
    </div>
  </div>

  {/* TODAY TAB */ }
  {
    tab === "today" && (
      <div>
        {/* Phase strip */}
        <div style={{ background: `${currentPhase.color}12`, borderBottom: `1px solid ${currentPhase.color}25`, padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "10px", letterSpacing: "3px", color: currentPhase.color }}>PHASE — WEEK {currentWeek}</div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "20px", fontWeight: 700 }}>{currentPhase.label}</div>
          </div>
          <div style={{ fontSize: "11px", color: "#444", textAlign: "right", maxWidth: "150px" }}>{currentPhase.desc}</div>
        </div>

        {/* Today session */}
        <div style={s.sec}>TODAY — {todaySchedule.day.toUpperCase()}</div>
        <div style={s.card}>
          <div style={{ background: `${todaySchedule.color}10`, padding: "14px 16px", borderBottom: "1px solid #181818", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "18px", fontWeight: 700, color: todaySchedule.color }}>{todaySchedule.type}</div>
              <div style={{ fontSize: "12px", color: "#444", marginTop: "2px" }}>{todaySchedule.exercises.length > 0 ? `${todaySchedule.exercises.length} exercises` : "Active recovery day"}</div>
            </div>
            {todaySchedule.exercises.length > 0 && (
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "28px", fontWeight: 700, color: todayDone === todaySchedule.exercises.length ? "#22c55e" : "#fff" }}>
                {todayDone}/{todaySchedule.exercises.length}
              </div>
            )}
          </div>
          {todaySchedule.exercises.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center" }}>
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>🛌</div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "18px", letterSpacing: "3px", color: "#333" }}>REST DAY</div>
              <div style={{ fontSize: "12px", color: "#2a2a2a", marginTop: "6px" }}>Recovery is part of training</div>
            </div>
          ) : (
            todaySchedule.exercises.map(ex => {
              const key = `w${currentWeek}-${ex.id}`;
              const done = completed[key];
              return (
                <div key={ex.id} onClick={() => toggleExercise(key)} style={{ padding: "14px 16px", borderBottom: "1px solid #111", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: "12px", opacity: done ? 0.5 : 1, transition: "opacity 0.2s" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", border: `2px solid ${done ? "#22c55e" : "#2a2a2a"}`, background: done ? "#22c55e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px", transition: "all 0.25s" }}>
                    {done && <span style={{ color: "#000", fontSize: "12px", fontWeight: 700 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "15px", fontWeight: 500, textDecoration: done ? "line-through" : "none", color: done ? "#333" : "#ddd" }}>{ex.name}</div>
                      <div style={{ fontSize: "11px", color: todaySchedule.color, fontFamily: "'Oswald', sans-serif", letterSpacing: "1px", flexShrink: 0, marginLeft: "8px" }}>{ex.time}</div>
                    </div>
                    <div style={{ fontSize: "12px", color: "#444", marginTop: "4px" }}>{ex.detail}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Macro grid */}
        <div style={s.sec}>DAILY TARGETS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "0 14px 4px" }}>
          {[
            { l: "CALORIES", v: "2700", u: "kcal/day", c: "#ef4444" },
            { l: "PROTEIN", v: "140g", u: "per day", c: "#f97316" },
            { l: "CARBS", v: "365g", u: "per day", c: "#eab308" },
            { l: "FAT", v: "75g", u: "per day", c: "#22c55e" },
          ].map(m => (
            <div key={m.l} style={{ background: "#0f0f0f", border: "1px solid #181818", borderRadius: "12px", padding: "14px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#333", fontFamily: "'Oswald', sans-serif" }}>{m.l}</div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "24px", fontWeight: 700, color: m.c, marginTop: "4px" }}>{m.v}</div>
              <div style={{ fontSize: "11px", color: "#333" }}>{m.u}</div>
            </div>
          ))}
        </div>

        {/* Water */}
        <div style={s.sec}>WATER INTAKE</div>
        <div style={s.card}>
          <div style={{ padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "26px", fontWeight: 700 }}>
                  {(waterCount * 0.25).toFixed(2)}L
                  <span style={{ fontSize: "14px", color: "#333", marginLeft: "6px" }}>/ 3.5L</span>
                </div>
                <div style={{ fontSize: "12px", color: "#444", marginTop: "2px" }}>{waterCount} × 250ml glasses</div>
              </div>
              <button onClick={addWater} style={{ background: "#0d2035", border: "1px solid #1e4060", borderRadius: "10px", color: "#60a5fa", padding: "12px 18px", cursor: "pointer", fontFamily: "'Oswald', sans-serif", letterSpacing: "1px", fontSize: "13px" }}>
                + GLASS
              </button>
            </div>
            <div style={{ background: "#1a1a1a", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(90deg, #2563eb, #60a5fa)", height: "100%", width: `${Math.min((waterCount * 0.25 / 3.5) * 100, 100)}%`, transition: "width 0.4s", borderRadius: "4px" }} />
            </div>
          </div>
        </div>

        {/* Week switcher */}
        <div style={s.sec}>SET CURRENT WEEK</div>
        <div style={{ display: "flex", gap: "8px", padding: "0 14px 24px", overflowX: "auto" }}>
          {[1, 2, 3, 4, 5, 6].map(w => {
            const ph = w <= 2 ? phases[0] : w <= 4 ? phases[1] : phases[2];
            return (
              <button key={w} onClick={() => setWeek(w)} style={{ flexShrink: 0, width: "52px", height: "52px", borderRadius: "12px", border: `2px solid ${currentWeek === w ? ph.color : "#1a1a1a"}`, background: currentWeek === w ? `${ph.color}18` : "#0f0f0f", color: currentWeek === w ? ph.color : "#333", cursor: "pointer", fontFamily: "'Oswald', sans-serif", fontSize: "17px", fontWeight: 700, transition: "all 0.2s" }}>
                W{w}
              </button>
            );
          })}
        </div>
      </div>
    )
  }

  {/* TRAINING TAB */ }
  {
    tab === "training" && (
      <div>
        <div style={s.sec}>6-WEEK PHASES</div>
        <div style={{ padding: "0 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {phases.map(p => (
            <div key={p.num} style={{ background: "#0f0f0f", border: `1px solid ${p.color}25`, borderLeft: `3px solid ${p.color}`, borderRadius: "12px", padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "10px", letterSpacing: "2px", color: p.color }}>WEEK {p.num}</div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "16px", fontWeight: 700 }}>{p.label}</div>
              </div>
              <div style={{ fontSize: "12px", color: "#555", marginTop: "6px" }}>{p.desc}</div>
            </div>
          ))}
        </div>

        <div style={s.sec}>WEEKLY SCHEDULE</div>
{schedule.map((day, i) => (
  <div key={day.day} style={s.card}>
    <div onClick={() => day.exercises.length > 0 && setExpandedDay(expandedDay === i ? null : i)}
      style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: day.exercises.length > 0 ? "pointer" : "default" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: `${day.color}15`, border: `1px solid ${day.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald', sans-serif", fontSize: "10px", color: day.color, letterSpacing: "1px", flexShrink: 0 }}>{day.short}</div>
        <div>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "16px", fontWeight: 600 }}>{day.day}</div>
          <div style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>{day.type}</div>
        </div>
      </div>
      {day.exercises.length > 0 && (
        <div style={{ color: "#2a2a2a", fontSize: "14px" }}>{expandedDay === i ? "▲" : "▼"}</div>
      )}
    </div>
    {expandedDay === i && day.exercises.map(ex => {
      const key = `w${currentWeek}-${ex.id}`;
      const done = completed[key];
      return (
        <div key={ex.id} onClick={() => toggleExercise(key)} style={{ padding: "12px 16px", borderTop: "1px solid #111", cursor: "pointer", display: "flex", gap: "10px", alignItems: "flex-start", opacity: done ? 0.5 : 1 }}>
          <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${done ? "#22c55e" : "#222"}`, background: done ? "#22c55e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px", transition: "all 0.2s" }}>
            {done && <span style={{ color: "#000", fontSize: "10px" }}>✓</span>}
          </div>
          <div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "14px", color: done ? "#333" : "#ccc", textDecoration: done ? "line-through" : "none" }}>
              {ex.name} <span style={{ color: day.color }}>· {ex.time}</span>
            </div>
            <div style={{ fontSize: "11px", color: "#3a3a3a", marginTop: "3px" }}>{ex.detail}</div>
          </div>
        </div>
      );
    })}
  </div>
))}
<div style={s.sec}>WEEK {currentWeek} NOTES</div>
        <div style={s.card}>
          <div style={{ padding: "14px" }}>
            <textarea
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              onBlur={() => saveNote(currentWeek, noteInput)}
              placeholder={`Week ${currentWeek} — How's the training?`}
              style={{ width: "100%", background: "#080808", border: "1px solid #1e1e1e", borderRadius: "10px", color: "#888", fontSize: "13px", padding: "14px", minHeight: "110px", resize: "none", fontFamily: "sans-serif", lineHeight: "1.5" }}
            />
            <div style={{ fontSize: "10px", color: "#222", marginTop: "6px" }}>AUTO-SAVES ON TAP AWAY</div>
          </div>
        </div>
        <div style={s.sec}>WHAT TO MEASURE</div>
        <div style={s.card}>
          <div style={{ padding: "14px 16px" }}>
            {["Gas tank — rounds before you gas out?", "Technique — combos feeling smoother?", "Conditioning — pushing harder than week 1?", "Body weight — on lean bulk track?", "App value — structure helping or generic?"].map((item, i) => (
              <div key={i} style={{ padding: "9px 0", fontSize: "13px", color: "#555", borderBottom: i < 4 ? "1px solid #111" : "none", display: "flex", gap: "10px" }}>
                <span style={{ color: "#ef4444", flexShrink: 0, fontWeight: 700 }}>{i + 1}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
          <div style={{ height: "24px" }} />
        </div>
      )
    }
  
    </div>
    );
  }