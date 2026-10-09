/* Blended Family Devotional - 365 days.
   Works fully offline / logged out with localStorage.
   When signed in via Supabase magic link, progress, favorites, and notes sync to the cloud. */

var SUPABASE_URL = "https://nssdfhkzjoanbzgpilvz.supabase.co";
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zc2RmaGt6am9hbmJ6Z3BpbHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNDgyMDgsImV4cCI6MjA5ODkyNDIwOH0.noQB7SiltD400wftYPv309n5AX8sf5-Kp1ycNJS-0B8";

var TOTAL_DAYS = 365;

var MONTHS = [
  { en: "Foundations for the Blended Home", es: "Fundamentos para el Hogar Ensamblado", start: 1, end: 31 },
  { en: "Love and Patience", es: "Amor y Paciencia", start: 32, end: 61 },
  { en: "Grace for the Hard People", es: "Gracia para las Personas Difíciles", start: 62, end: 91 },
  { en: "Unity as a Couple", es: "Unidad como Pareja", start: 92, end: 121 },
  { en: "Mothers and Fathers in Blended Homes", es: "Madres y Padres en Hogares Ensamblados", start: 122, end: 151 },
  { en: "The Kids' Hearts", es: "El Corazón de los Hijos", start: 152, end: 181 },
  { en: "Rest and Rhythms", es: "Descanso y Ritmos", start: 182, end: 211 },
  { en: "Discipline as a Team", es: "Disciplina en Equipo", start: 212, end: 241 },
  { en: "New Mercies for New Seasons", es: "Nuevas Misericordias para Nuevas Temporadas", start: 242, end: 271 },
  { en: "Gratitude", es: "Gratitud", start: 272, end: 301 },
  { en: "Forgiveness", es: "Perdón", start: 302, end: 331 },
  { en: "Hope and Traditions", es: "Esperanza y Tradiciones", start: 332, end: 365 }
];

var STR = {
  en: {
    navToday: "Today", navMonths: "Months", navSaved: "Saved", navNotes: "Notes", navSearch: "Search",
    bothBtn: "Both", langLabel: "Language",
    appTitle: "Blended Family Devotional", appSub: "365 days",
    dayNum: "Day",
    reflect: "Reflect", prayer: "Prayer",
    notesH: "My notes", notesPriv: "Private to you.",
    notesPh: "Write your thoughts, prayers, or what God showed you today...",
    noteSaved: "Saved ✓",
    roleMom: "Mom", roleDad: "Dad", roleFamily: "Family",
    searchPh: "Search themes or titles...",
    noResults: "No matches. Try another word.",
    noFavs: "No saved days yet. Tap the heart on any day to save it here.",
    noNotes: "No notes yet. Write in the notes box on any day and it will appear here.",
    savedH: "Saved", notesVH: "Notes", searchH: "Search",
    streak1: "day streak", streakN: "day streak",
    signIn: "Sign in", signOut: "Sign out",
    authTitle: "Sign in",
    authDesc: "Enter your email and we will send you a sign-in link. No password to remember. Your progress, favorites, and notes sync across your devices.",
    authSend: "Send sign-in link", authClose: "Close",
    month: "Month", shareBrand: "Blended Family Devotional"
  },
  es: {
    navToday: "Hoy", navMonths: "Meses", navSaved: "Guardados", navNotes: "Notas", navSearch: "Buscar",
    bothBtn: "Ambos", langLabel: "Idioma",
    appTitle: "Devocional para la Familia", appSub: "365 días",
    dayNum: "Día",
    reflect: "Reflexiona", prayer: "Oración",
    notesH: "Mis notas", notesPriv: "Privadas.",
    notesPh: "Escribe tus pensamientos, oraciones, o lo que Dios te mostró hoy...",
    noteSaved: "Guardado ✓",
    roleMom: "Mamá", roleDad: "Papá", roleFamily: "Familia",
    searchPh: "Busca temas o títulos...",
    noResults: "Sin resultados. Prueba otra palabra.",
    noFavs: "Aún no guardas días. Toca el corazón en cualquier día para guardarlo aquí.",
    noNotes: "Aún no tienes notas. Escribe en la caja de notas de cualquier día y aparecerá aquí.",
    savedH: "Guardados", notesVH: "Notas", searchH: "Buscar",
    streak1: "día de racha", streakN: "días de racha",
    signIn: "Entrar", signOut: "Salir",
    authTitle: "Entrar",
    authDesc: "Escribe tu correo y te enviaremos un enlace para entrar. Sin contraseña que recordar. Tu progreso, favoritos y notas se sincronizan en tus dispositivos.",
    authSend: "Enviar enlace", authClose: "Cerrar",
    month: "Mes", shareBrand: "Devocional para la Familia"
  }
};

function t(key) {
  var lang = state.lang === "es" ? "es" : "en";
  return STR[lang][key] || STR.en[key];
}

var state = {
  lang: localStorage.getItem("bfd_lang") || "both",
  day: 1,
  done: {},
  fav: {},
  notes: {},
  notesMeta: {},
  user: null,
  view: "today"
};

function saveLocal() {
  localStorage.setItem("bfd_lang", state.lang);
  localStorage.setItem("bfd_done", JSON.stringify(state.done));
  localStorage.setItem("bfd_fav", JSON.stringify(state.fav));
  localStorage.setItem("bfd_notes", JSON.stringify(state.notes));
  localStorage.setItem("bfd_notes_meta", JSON.stringify(state.notesMeta));
}

function loadLocal() {
  try {
    var raw = JSON.parse(localStorage.getItem("bfd_done") || "null");
    state.done = { mom: {}, dad: {}, family: {} };
    if (raw) {
      if (raw.mom || raw.dad || raw.family) {
        ["mom", "dad", "family"].forEach(function (r) { if (raw[r]) state.done[r] = raw[r]; });
      } else {
        // legacy single-button format: those checkmarks become Mom's
        state.done.mom = raw;
      }
    }
  } catch (e) { state.done = { mom: {}, dad: {}, family: {} }; }
  try { state.fav = JSON.parse(localStorage.getItem("bfd_fav") || "{}"); } catch (e) { state.fav = {}; }
  try { state.notes = JSON.parse(localStorage.getItem("bfd_notes") || "{}"); } catch (e) { state.notes = {}; }
  try { state.notesMeta = JSON.parse(localStorage.getItem("bfd_notes_meta") || "{}"); } catch (e) { state.notesMeta = {}; }
  var start = localStorage.getItem("bfd_start");
  if (!start) {
    start = new Date().toISOString().slice(0, 10);
    localStorage.setItem("bfd_start", start);
  }
  var diff = Math.floor((Date.now() - new Date(start + "T12:00:00").getTime()) / 86400000);
  state.day = Math.min(TOTAL_DAYS, Math.max(1, diff + 1));
}

var sb = null;
function initSupabase() {
  try {
    if (window.supabase && window.supabase.createClient) {
      sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  } catch (e) { sb = null; }
}

function $(id) { return document.getElementById(id); }
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function dev(day) { return (typeof DEVOTIONALS !== "undefined") ? DEVOTIONALS[day - 1] : null; }
function pick(obj, base) {
  if (state.lang === "es") return obj[base + "_es"];
  if (state.lang === "both") return { en: obj[base + "_en"], es: obj[base + "_es"] };
  return obj[base + "_en"];
}
function monthOf(day) {
  for (var i = 0; i < MONTHS.length; i++) {
    if (day >= MONTHS[i].start && day <= MONTHS[i].end) return i;
  }
  return 0;
}

/* ---------- rendering ---------- */

function renderChrome() {
  var both = state.lang === "both";
  $("navToday").textContent = t("navToday");
  $("navMonths").textContent = t("navMonths");
  $("navSaved").textContent = t("navSaved");
  $("navNotes").textContent = t("navNotes");
  $("navSearch").textContent = t("navSearch");
  $("reflectHeading").textContent = t("reflect");
  $("prayerHeading").textContent = t("prayer");
  $("notesHeading").textContent = t("notesH");
  $("notesPriv").textContent = t("notesPriv");
  $("notesArea").placeholder = t("notesPh");
  $("notesArea").setAttribute("aria-label", t("notesH"));
  $("searchInput").placeholder = t("searchPh");
  $("searchInput").setAttribute("aria-label", t("searchH"));
  $("savedHeading").textContent = t("savedH");
  $("notesViewHeading").textContent = t("notesVH");
  $("searchHeading").textContent = t("searchH");
  $("authTitle").textContent = t("authTitle");
  $("authDesc").textContent = t("authDesc");
  $("authSend").textContent = t("authSend");
  $("authClose").textContent = t("authClose");
  var bothBtn = document.querySelector('.langtoggle button[data-lang="both"]');
  if (bothBtn) bothBtn.textContent = t("bothBtn");
  document.querySelector(".langtoggle").setAttribute("aria-label", t("langLabel"));
  // header: bilingual lockup in "both" mode, single language otherwise
  $("appKicker").style.display = both ? "" : "none";
  $("appTitle").textContent = both ? "Devocional para la Familia" : t("appTitle");
  $("appSub").textContent = both ? "365 days · 365 días · English + Español" : t("appSub");
  document.title = both ? "Blended Family Devotional | Devocional para la Familia" : t("appTitle");
  document.documentElement.lang = state.lang === "es" ? "es" : "en";
  document.querySelectorAll(".langtoggle button").forEach(function (b) {
    b.classList.toggle("active", b.dataset.lang === state.lang);
  });
  renderStreak();
}

function streakFor(set) {
  var days = Object.keys(set || {}).map(Number).sort(function (a, b) { return a - b; });
  var streak = 0;
  if (days.length) {
    var cur = days[days.length - 1];
    streak = 1;
    for (var i = days.length - 2; i >= 0; i--) {
      if (days[i] === cur - 1) { streak++; cur = days[i]; }
      else break;
    }
  }
  return streak;
}

function renderStreak() {
  var parts = [
    t("roleMom") + " 🔥" + streakFor(state.done.mom),
    t("roleDad") + " 🔥" + streakFor(state.done.dad),
    t("roleFamily") + " 🔥" + streakFor(state.done.family)
  ];
  $("streakLine").textContent = parts.join(" · ");
}

function renderDay() {
  var d = dev(state.day);
  if (!d) { $("devTitle").textContent = "Loading..."; return; }
  var both = state.lang === "both";

  $("dayNum").textContent = t("dayNum") + " " + d.day;
  $("themePill").textContent = both ? d.theme_en + " · " + d.theme_es : pick(d, "theme");

  if (both) {
    $("devTitle").innerHTML = esc(d.title_en) + '<span class="es">' + esc(d.title_es) + "</span>";
  } else {
    $("devTitle").textContent = pick(d, "title");
  }

  var vb = $("verseBlocks");
  vb.innerHTML = "";
  function addVerse(text, ref) {
    var bq = document.createElement("div");
    bq.className = "verse";
    bq.innerHTML = "<p>" + esc(text) + "</p>";
    var cite = document.createElement("span");
    cite.className = "ref";
    cite.textContent = ref;
    bq.appendChild(cite);
    vb.appendChild(bq);
  }
  if (both) {
    addVerse(d.verse_en, d.verse_ref_en);
    addVerse(d.verse_es, d.verse_ref_es + " (RVR 1960)");
  } else if (state.lang === "es") {
    addVerse(d.verse_es, d.verse_ref_es + " (RVR 1960)");
  } else {
    addVerse(d.verse_en, d.verse_ref_en);
  }

  var bodyText = both ? d.body_en + "\n\n" + d.body_es : pick(d, "body");
  $("devBody").innerHTML = bodyText.split("\n\n").map(function (p) {
    return "<p>" + esc(p) + "</p>";
  }).join("");

  $("reflectText").textContent = both ? d.reflection_en + " / " + d.reflection_es : pick(d, "reflection");
  $("prayerText").textContent = both ? d.prayer_en + " / " + d.prayer_es : pick(d, "prayer");

  var na = $("notesArea");
  na.value = state.notes[d.day] || "";
  $("noteSaved").textContent = "";

  [["mom", "doneMom", "roleMom"], ["dad", "doneDad", "roleDad"], ["family", "doneFamily", "roleFamily"]].forEach(function (r) {
    var btn = $(r[1]);
    var isDone = !!(state.done[r[0]] && state.done[r[0]][d.day]);
    btn.textContent = t(r[2]) + (isDone ? " ✓" : "");
    btn.setAttribute("aria-label", t(r[2]));
    btn.classList.toggle("done", isDone);
  });

  var fb = $("favBtn");
  fb.textContent = state.fav[d.day] ? "♥" : "♡";
  fb.classList.toggle("faved", !!state.fav[d.day]);

  $("prevBtn").disabled = d.day <= 1;
  $("nextBtn").disabled = d.day >= TOTAL_DAYS;
}

function renderMonths() {
  var box = $("monthBlocks");
  box.innerHTML = "";
  MONTHS.forEach(function (m, mi) {
    var block = document.createElement("div");
    block.className = "month-block";
    var h = document.createElement("h3");
    if (state.lang === "both") {
      h.innerHTML = "<b>Month · Mes " + (mi + 1) + "</b> · " +
        esc(m.en) + " · " + esc(m.es);
    } else {
      h.innerHTML = "<b>" + t("month") + " " + (mi + 1) + "</b> · " +
        esc(state.lang === "es" ? m.es : m.en);
    }
    block.appendChild(h);
    var grid = document.createElement("div");
    grid.className = "grid";
    for (var day = m.start; day <= m.end; day++) {
      (function (dn) {
        var b = document.createElement("button");
        b.textContent = dn;
        var rolesDone = ["mom", "dad", "family"].filter(function (r) {
          return state.done[r] && state.done[r][dn];
        });
        if (rolesDone.length === 3) b.classList.add("done");
        else if (rolesDone.length) b.classList.add("partial");
        if (dn === state.day) b.classList.add("today");
        var d = dev(dn);
        var label = d ? pick(d, "title") : "";
        if (rolesDone.length) {
          var names = rolesDone.map(function (r) {
            return t("role" + r.charAt(0).toUpperCase() + r.slice(1));
          }).join(" ✓, ") + " ✓";
          label += " (" + names + ")";
        }
        b.title = label;
        b.onclick = function () { state.day = dn; showView("today"); };
        grid.appendChild(b);
      })(day);
    }
    block.appendChild(grid);
    box.appendChild(block);
  });
}

function renderFavs() {
  var box = $("favList");
  box.innerHTML = "";
  var days = Object.keys(state.fav).map(Number).sort(function (a, b) { return a - b; });
  if (!days.length) { box.innerHTML = "<p class='empty'>" + esc(t("noFavs")) + "</p>"; return; }
  days.forEach(function (n) {
    var d = dev(n);
    if (!d) return;
    var b = document.createElement("button");
    b.className = "result";
    b.innerHTML = "<strong>" + n + ". " + esc(pick(d, "title")) + "</strong><small>" + esc(pick(d, "theme")) + "</small>";
    b.onclick = function () { state.day = n; showView("today"); };
    box.appendChild(b);
  });
}

function renderNotesList() {
  var box = $("notesList");
  box.innerHTML = "";
  var days = Object.keys(state.notes).filter(function (n) {
    return state.notes[n] && state.notes[n].trim();
  }).map(Number).sort(function (a, b) {
    return (state.notesMeta[b] || 0) - (state.notesMeta[a] || 0);
  });
  if (!days.length) { box.innerHTML = "<p class='empty'>" + esc(t("noNotes")) + "</p>"; return; }
  days.forEach(function (n) {
    var d = dev(n);
    if (!d) return;
    var b = document.createElement("button");
    b.className = "result";
    var snippet = state.notes[n].trim().slice(0, 90);
    b.innerHTML = "<strong>" + n + ". " + esc(pick(d, "title")) + "</strong>" +
      "<span class='snippet'>" + esc(snippet) + (state.notes[n].trim().length > 90 ? "..." : "") + "</span>";
    b.onclick = function () { state.day = n; showView("today"); };
    box.appendChild(b);
  });
}

function renderSearch(q) {
  var box = $("searchResults");
  box.innerHTML = "";
  q = (q || "").trim().toLowerCase();
  if (!q || typeof DEVOTIONALS === "undefined") return;
  var hits = DEVOTIONALS.filter(function (d) {
    var hay = (d.title_en + " " + d.title_es + " " + d.theme_en + " " + d.theme_es).toLowerCase();
    return hay.indexOf(q) !== -1;
  });
  if (!hits.length) { box.innerHTML = "<p class='empty'>" + esc(t("noResults")) + "</p>"; return; }
  hits.slice(0, 60).forEach(function (d) {
    var b = document.createElement("button");
    b.className = "result";
    b.innerHTML = "<strong>" + d.day + ". " + esc(pick(d, "title")) + "</strong><small>" + esc(pick(d, "theme")) + "</small>";
    b.onclick = function () { state.day = d.day; showView("today"); };
    box.appendChild(b);
  });
}

function showView(v) {
  state.view = v;
  ["today", "months", "saved", "notes", "search"].forEach(function (name) {
    $("view-" + name).classList.toggle("hidden", name !== v);
  });
  document.querySelectorAll(".bottomnav button").forEach(function (b) {
    b.classList.toggle("on", b.dataset.view === v);
  });
  if (v === "today") renderDay();
  if (v === "months") renderMonths();
  if (v === "saved") renderFavs();
  if (v === "notes") renderNotesList();
  window.scrollTo(0, 0);
}

/* ---------- cloud sync ---------- */

async function cloudPull() {
  if (!sb || !state.user) return;
  try {
    var p = await sb.from("devotional_progress").select("day, role");
    var f = await sb.from("devotional_favorites").select("day");
    var n = await sb.from("devotional_notes").select("day, note_text, updated_at");
    (p.data || []).forEach(function (r) {
      var role = r.role || "mom";
      if (!state.done[role]) state.done[role] = {};
      state.done[role][r.day] = true;
    });
    (f.data || []).forEach(function (r) { state.fav[r.day] = true; });
    (n.data || []).forEach(function (r) {
      var ts = new Date(r.updated_at).getTime();
      if (!state.notes[r.day] || ts > (state.notesMeta[r.day] || 0)) {
        state.notes[r.day] = r.note_text;
        state.notesMeta[r.day] = ts;
      }
    });
    saveLocal();
  } catch (e) { /* offline: keep local */ }
}

async function cloudPush(table, day, on, role) {
  if (!sb || !state.user) return;
  try {
    if (table === "devotional_progress") {
      if (on) {
        await sb.from(table).upsert({ user_id: state.user.id, day: day, role: role }, { onConflict: "user_id,day,role" });
      } else {
        await sb.from(table).delete().eq("user_id", state.user.id).eq("day", day).eq("role", role);
      }
    } else if (on) {
      await sb.from(table).upsert({ user_id: state.user.id, day: day }, { onConflict: "user_id,day" });
    } else {
      await sb.from(table).delete().eq("user_id", state.user.id).eq("day", day);
    }
  } catch (e) { /* offline */ }
}

async function cloudPushNote(day) {
  if (!sb || !state.user) return;
  try {
    var text = (state.notes[day] || "").trim();
    if (text) {
      await sb.from("devotional_notes").upsert({
        user_id: state.user.id,
        day: day,
        note_text: text,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id,day" });
    } else {
      await sb.from("devotional_notes").delete().eq("user_id", state.user.id).eq("day", day);
    }
  } catch (e) { /* offline */ }
}

async function cloudPushAll() {
  if (!sb || !state.user) return;
  var rows = [];
  ["mom", "dad", "family"].forEach(function (role) {
    Object.keys(state.done[role] || {}).forEach(function (d) {
      rows.push({ user_id: state.user.id, day: Number(d), role: role });
    });
  });
  var frows = Object.keys(state.fav).map(function (d) { return { user_id: state.user.id, day: Number(d) }; });
  var nrows = Object.keys(state.notes).filter(function (d) {
    return state.notes[d] && state.notes[d].trim();
  }).map(function (d) {
    return { user_id: state.user.id, day: Number(d), note_text: state.notes[d].trim() };
  });
  try {
    if (rows.length) await sb.from("devotional_progress").upsert(rows, { onConflict: "user_id,day,role" });
    if (frows.length) await sb.from("devotional_favorites").upsert(frows, { onConflict: "user_id,day" });
    if (nrows.length) await sb.from("devotional_notes").upsert(nrows, { onConflict: "user_id,day" });
  } catch (e) { /* offline */ }
}

function renderAuth() {
  var area = $("authArea");
  area.innerHTML = "";
  if (state.user && state.user.email) {
    var span = document.createElement("span");
    span.className = "who";
    span.innerHTML = '<span class="dot"></span>';
    var em = document.createElement("span");
    em.textContent = state.user.email;
    span.appendChild(em);
    var out = document.createElement("button");
    out.textContent = t("signOut");
    out.style.marginLeft = "8px";
    out.onclick = async function () {
      if (sb) { try { await sb.auth.signOut(); } catch (e) {} }
      state.user = null;
      renderAuth();
    };
    area.appendChild(span);
    area.appendChild(out);
  } else {
    var btn = document.createElement("button");
    btn.textContent = t("signIn");
    btn.onclick = function () {
      $("authModal").classList.remove("hidden");
      $("authMsg").textContent = "";
    };
    area.appendChild(btn);
  }
}

async function checkSession() {
  if (!sb) { renderAuth(); return; }
  try {
    var res = await sb.auth.getSession();
    state.user = (res.data && res.data.session) ? res.data.session.user : null;
    if (state.user) {
      await cloudPull();
      await cloudPushAll();
      renderDay(); renderStreak();
    }
  } catch (e) {}
  renderAuth();
  sb.auth.onAuthStateChange(async function (ev, session) {
    state.user = session ? session.user : null;
    if (state.user) { await cloudPull(); await cloudPushAll(); renderDay(); renderStreak(); }
    renderAuth();
  });
}

/* ---------- share card ---------- */

function wrapText(ctx, text, maxW) {
  var words = text.split(" ");
  var lines = [], line = "";
  words.forEach(function (w) {
    var test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  });
  if (line) lines.push(line);
  return lines;
}

function shareCard() {
  var d = dev(state.day);
  if (!d) return;
  var c = $("shareCanvas");
  var ctx = c.getContext("2d");
  var W = 1080, H = 1920;

  ctx.fillStyle = "#faf6f3";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#5E1F2E";
  ctx.fillRect(0, 0, W, 26);
  ctx.fillRect(0, H - 26, W, 26);

  var verse = state.lang === "es" ? d.verse_es : d.verse_en;
  var ref = state.lang === "es" ? d.verse_ref_es + " (RVR 1960)" : d.verse_ref_en;

  ctx.fillStyle = "#5E1F2E";
  ctx.font = "700 64px Caveat, cursive";
  ctx.textAlign = "center";
  var dayLabel = (state.lang === "es" ? "Día " : "Day ") + d.day;
  ctx.fillText(dayLabel, W / 2, 250);

  ctx.fillStyle = "#2b2320";
  ctx.font = "italic 54px Georgia, serif";
  var lines = wrapText(ctx, "\u201C" + verse + "\u201D", W - 170);
  var y = 430;
  lines.forEach(function (ln) { ctx.fillText(ln, W / 2, y); y += 82; });

  ctx.fillStyle = "#8a7a72";
  ctx.font = "40px Georgia, serif";
  ctx.fillText(ref, W / 2, y + 70);

  ctx.fillStyle = "#5E1F2E";
  ctx.font = "600 44px Caveat, cursive";
  var brand = state.lang === "both"
    ? "Blended Family Devotional · Devocional para la Familia"
    : t("shareBrand");
  ctx.fillText(brand, W / 2, H - 130);

  var a = document.createElement("a");
  a.download = "devotional-day-" + d.day + ".png";
  a.href = c.toDataURL("image/png");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ---------- events ---------- */

document.querySelectorAll(".langtoggle button").forEach(function (b) {
  b.onclick = function () {
    state.lang = b.dataset.lang;
    saveLocal();
    renderChrome(); renderAuth(); showView(state.view);
  };
});

document.querySelectorAll(".bottomnav button").forEach(function (b) {
  b.onclick = function () { showView(b.dataset.view); };
});

$("prevBtn").onclick = function () { if (state.day > 1) { state.day--; renderDay(); window.scrollTo(0, 0); } };
$("nextBtn").onclick = function () { if (state.day < TOTAL_DAYS) { state.day++; renderDay(); window.scrollTo(0, 0); } };

[["mom", "doneMom"], ["dad", "doneDad"], ["family", "doneFamily"]].forEach(function (r) {
  $(r[1]).onclick = function () {
    var day = state.day, role = r[0];
    if (!state.done[role]) state.done[role] = {};
    if (state.done[role][day]) delete state.done[role][day]; else state.done[role][day] = true;
    saveLocal(); renderDay(); renderStreak();
    cloudPush("devotional_progress", day, !!state.done[role][day], role);
  };
});

$("favBtn").onclick = function () {
  var day = state.day;
  if (state.fav[day]) delete state.fav[day]; else state.fav[day] = true;
  saveLocal(); renderDay();
  cloudPush("devotional_favorites", day, !!state.fav[day]);
};

$("shareBtn").onclick = shareCard;

var noteTimer = null;
$("notesArea").addEventListener("input", function (e) {
  var day = state.day;
  var val = e.target.value;
  if (noteTimer) clearTimeout(noteTimer);
  noteTimer = setTimeout(function () {
    if (val.trim()) {
      state.notes[day] = val;
      state.notesMeta[day] = Date.now();
    } else {
      delete state.notes[day];
      delete state.notesMeta[day];
    }
    saveLocal();
    $("noteSaved").textContent = t("noteSaved");
    cloudPushNote(day);
  }, 600);
});

$("searchInput").addEventListener("input", function (e) { renderSearch(e.target.value); });

$("authSend").onclick = async function () {
  var email = $("authEmail").value.trim();
  if (!email || !sb) return;
  $("authMsg").textContent = "";
  try {
    var res = await sb.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: window.location.origin + window.location.pathname }
    });
    $("authMsg").textContent = res.error
      ? (state.lang === "es" ? "Algo salió mal. Inténtalo de nuevo." : "Something went wrong. Try again.")
      : (state.lang === "es" ? "Revisa tu correo para el enlace de acceso." : "Check your email for the sign-in link.");
  } catch (e) {
    $("authMsg").textContent = state.lang === "es" ? "Algo salió mal. Inténtalo de nuevo." : "Something went wrong. Try again.";
  }
};
$("authClose").onclick = function () { $("authModal").classList.add("hidden"); };

/* ---------- boot ---------- */
loadLocal();
initSupabase();
renderChrome();
renderAuth();
checkSession();
showView("today");
