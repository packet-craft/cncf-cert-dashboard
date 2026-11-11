(function () {
  "use strict";

  var KEY = { done: "cncf-dash:v1:done", known: "cncf-dash:v1:known", ui: "cncf-dash:v1:ui" };
  var VIEWS = [["overview", "Overview"], ["checklist", "Checklist"], ["cheats", "Cheat Sheet"], ["flashcards", "Flashcards"]];
  var PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

  // ---------- storage (works even when localStorage is unavailable) ----------
  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode: keep in memory */ }
  }

  // ---------- model ----------
  // Flatten checklist tuples into objects with stable ids.
  Object.keys(DATA.certs).forEach(function (certKey) {
    var cert = DATA.certs[certKey];
    cert.key = certKey;
    cert.domains.forEach(function (d) {
      d.items = d.items.map(function (t, i) {
        return { id: certKey + "-" + d.key + "-" + i, title: t[0], priority: t[1], week: t[2], domain: d.key };
      });
    });
  });

  var ui = load(KEY.ui, {});
  var state = {
    cert: DATA.certs[ui.cert] ? ui.cert : "kcna",
    view: VIEWS.some(function (v) { return v[0] === ui.view; }) ? ui.view : "overview",
    done: new Set(load(KEY.done, [])),
    known: new Set(load(KEY.known, [])),
    filters: { domain: "all", priority: "all", week: "all", q: "", hideDone: false },
    cheat: { tool: "all", q: "" },
    fc: { type: "all", hideKnown: false, index: 0, flipped: false, order: null }
  };

  function saveUi() {
    save(KEY.ui, { cert: state.cert, view: state.view, theme: document.documentElement.dataset.theme || null });
  }

  function domainStats(d) {
    var done = d.items.filter(function (it) { return state.done.has(it.id); }).length;
    var ratio = d.items.length ? done / d.items.length : 0;
    return { done: done, total: d.items.length, ratio: ratio, points: ratio * d.weight };
  }
  // Weighted readiness: each domain contributes (completed / total) × exam weight.
  function readiness(cert) {
    return cert.domains.reduce(function (sum, d) { return sum + domainStats(d).points; }, 0);
  }

  // ---------- helpers ----------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function options(pairs, selected) {
    return pairs.map(function (p) {
      return '<option value="' + esc(p[0]) + '"' + (String(p[0]) === String(selected) ? " selected" : "") + ">" + esc(p[1]) + "</option>";
    }).join("");
  }
  var toastTimer;
  function toast(msg) {
    var el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 1800);
  }

  // ---------- header ----------
  function renderHeader() {
    $("#certTabs").innerHTML = Object.keys(DATA.certs).map(function (k) {
      var c = DATA.certs[k], r = readiness(c);
      return '<button class="cert-tab" role="tab" type="button" data-cert="' + k + '" aria-selected="' + (k === state.cert) + '">' +
        '<span class="row"><strong>' + c.name + '</strong><span class="small muted num">' + Math.round(r) +
        '%<span class="pct-label"> ready</span></span></span>' +
        '<span class="bar"><span style="width:' + r.toFixed(1) + '%"></span></span></button>';
    }).join("");
    $("#viewTabs").innerHTML = VIEWS.map(function (v) {
      return '<button class="view-tab" type="button" data-view="' + v[0] + '"' +
        (v[0] === state.view ? ' aria-current="page"' : "") + ">" + v[1] + "</button>";
    }).join("");
  }

  // ---------- overview ----------
  function renderOverview(cert) {
    var score = readiness(cert);
    var C = 2 * Math.PI * 54;
    var gap = cert.passMark - score;
    var verdict = score >= cert.passMark
      ? ["good", "On track — above the pass mark"]
      : gap <= 15 ? ["warn", "Close — " + Math.ceil(gap) + " points to the pass mark"]
        : ["bad", Math.ceil(gap) + " points below the pass mark"];
    var totalDone = 0, total = 0;
    cert.domains.forEach(function (d) { var s = domainStats(d); totalDone += s.done; total += s.total; });

    // Suggest undone items: highest priority first, then heaviest domain.
    var next = [];
    cert.domains.forEach(function (d) {
      d.items.forEach(function (it) { if (!state.done.has(it.id)) next.push({ it: it, d: d }); });
    });
    next.sort(function (a, b) {
      return PRIORITY_RANK[a.it.priority] - PRIORITY_RANK[b.it.priority] || b.d.weight - a.d.weight || a.it.week - b.it.week;
    });
    next = next.slice(0, 5);

    var markAngle = cert.passMark / 100 * C;
    return '' +
      '<div class="grid overview-top">' +
        '<section class="card" aria-labelledby="rd-h">' +
          '<h2 id="rd-h">Exam readiness</h2>' +
          '<div class="readiness" style="margin-top:12px">' +
            '<div class="ring" role="img" aria-label="Readiness ' + Math.round(score) + ' percent, pass mark ' + cert.passMark + ' percent">' +
              '<svg viewBox="0 0 120 120"><circle class="track" cx="60" cy="60" r="54"/>' +
              '<circle class="value" cx="60" cy="60" r="54" stroke-dasharray="' + C.toFixed(2) + '" stroke-dashoffset="' + (C * (1 - score / 100)).toFixed(2) + '"/>' +
              '<circle class="mark" cx="60" cy="60" r="54" stroke-dasharray="1.5 ' + (C - 1.5).toFixed(2) + '" stroke-dashoffset="' + (-markAngle).toFixed(2) + '"/></svg>' +
              '<div class="ring-label"><b class="num">' + Math.round(score) + '%</b><span class="small muted">pass ' + cert.passMark + '%</span></div>' +
            '</div>' +
            '<div>' +
              '<p class="verdict ' + verdict[0] + '">' + verdict[1] + '</p>' +
              '<p class="muted small" style="margin-top:6px">Weighted score = Σ (completed ÷ total items in a domain) × domain weight. ' +
              'It measures study coverage, not a predicted exam result.</p>' +
              '<p class="small num" style="margin-top:6px">' + totalDone + ' of ' + total + ' checklist items complete</p>' +
            '</div>' +
          '</div>' +
        '</section>' +
        '<section class="card" aria-labelledby="ex-h">' +
          '<h2 id="ex-h">' + esc(cert.title) + '</h2>' +
          '<dl class="facts"><dt>Format</dt><dd>' + esc(cert.format) + '</dd><dt>Duration</dt><dd>' + esc(cert.duration) +
          '</dd><dt>Pass mark</dt><dd>' + cert.passMark + '%</dd><dt>Study plan</dt><dd>' + cert.weeks + ' weeks</dd></dl>' +
        '</section>' +
      '</div>' +

      '<div class="section-head"><h2>Domains</h2><span class="muted small">Select a domain to open its checklist</span></div>' +
      '<div class="grid domains">' + cert.domains.map(function (d) {
        var s = domainStats(d);
        return '<button class="card domain-card" type="button" data-goto-domain="' + d.key + '">' +
          '<span class="top"><h3>' + esc(d.name) + '</h3><span class="badge accent num">' + d.weight + '%</span></span>' +
          '<span class="bar"><span style="width:' + (s.ratio * 100).toFixed(1) + '%"></span></span>' +
          '<span class="stats small muted num"><span>' + s.done + ' / ' + s.total + ' items</span><span>' +
          s.points.toFixed(1) + ' / ' + d.weight + ' pts</span></span></button>';
      }).join("") + '</div>' +

      '<div class="section-head"><h2>Study next</h2><span class="muted small">Highest priority in the heaviest domains</span></div>' +
      '<div class="card">' + (next.length
        ? '<ul class="next-list">' + next.map(function (n) {
            return '<li><span class="badge ' + n.it.priority + '">' + cap(n.it.priority) + '</span><span><span>' + esc(n.it.title) +
              '</span><br><span class="small muted">' + esc(n.d.name) + ' · Week ' + n.it.week + '</span></span></li>';
          }).join("") + '</ul>'
        : '<p class="empty">Everything is checked off. Book the exam.</p>') +
      '</div>';
  }

  // ---------- checklist ----------
  function renderChecklist(cert) {
    var f = state.filters;
    var weeks = [["all", "All weeks"]];
    for (var w = 1; w <= cert.weeks; w++) weeks.push([w, "Week " + w]);
    var q = f.q.trim().toLowerCase();
    var shown = 0;

    var groups = cert.domains.map(function (d) {
      if (f.domain !== "all" && f.domain !== d.key) return "";
      var items = d.items.filter(function (it) {
        return (f.priority === "all" || it.priority === f.priority) &&
          (f.week === "all" || String(it.week) === String(f.week)) &&
          (!f.hideDone || !state.done.has(it.id)) &&
          (!q || it.title.toLowerCase().indexOf(q) !== -1);
      });
      if (!items.length) return "";
      shown += items.length;
      var s = domainStats(d);
      return '<section class="card group">' +
        '<div class="group-head"><h3>' + esc(d.name) + ' <span class="badge accent num">' + d.weight + '%</span></h3>' +
        '<span class="small muted num">' + s.done + ' / ' + s.total + ' done</span></div>' +
        '<ul class="items">' + items.map(function (it) {
          var done = state.done.has(it.id);
          return '<li class="item' + (done ? " done" : "") + '"><label>' +
            '<input type="checkbox" data-item="' + it.id + '"' + (done ? " checked" : "") + '>' +
            '<span class="title">' + esc(it.title) + '</span>' +
            '<span class="tags"><span class="badge ' + it.priority + '">' + cap(it.priority) + '</span>' +
            '<span class="badge">Week ' + it.week + '</span></span></label></li>';
        }).join("") + '</ul></section>';
      }).join("");

    return '<div class="card filters">' +
        '<label>Domain<select data-filter="domain">' + options([["all", "All domains"]].concat(cert.domains.map(function (d) {
          return [d.key, d.name + " (" + d.weight + "%)"]; })), f.domain) + '</select></label>' +
        '<label>Priority<select data-filter="priority">' + options([["all", "All priorities"], ["high", "High"], ["medium", "Medium"], ["low", "Low"]], f.priority) + '</select></label>' +
        '<label>Study week<select data-filter="week">' + options(weeks, f.week) + '</select></label>' +
        '<label>Search<input type="search" data-filter="q" placeholder="Filter topics" value="' + esc(f.q) + '"></label>' +
        '<label class="check"><input type="checkbox" data-filter="hideDone"' + (f.hideDone ? " checked" : "") + '> Hide completed</label>' +
      '</div>' +
      '<div id="checklistBody">' + (groups || '<p class="empty">No items match these filters. ' +
        '<button class="link" type="button" data-clear-filters>Clear filters</button></p>') + '</div>' +
      '<p class="small muted" style="margin-top:12px" aria-live="polite">' + shown + ' item' + (shown === 1 ? "" : "s") + ' shown</p>';
  }

  // ---------- cheat sheet ----------
  function renderCheats() {
    var c = state.cheat, q = c.q.trim().toLowerCase();
    var tools = ["all"];
    DATA.cheats.forEach(function (s) { if (tools.indexOf(s.tool) === -1) tools.push(s.tool); });

    var sections = DATA.cheats.map(function (s, si) {
      if (c.tool !== "all" && s.tool !== c.tool) return "";
      var cmds = s.cmds.map(function (cmd, ci) { return { cmd: cmd, ref: si + ":" + ci }; }).filter(function (x) {
        return !q || (x.cmd[0] + " " + x.cmd[1] + " " + s.title).toLowerCase().indexOf(q) !== -1;
      });
      if (!cmds.length) return "";
      return '<section class="card cheat-section"><div class="head"><h3>' + esc(s.title) + '</h3><span class="chips">' +
        s.certs.map(function (k) { return '<span class="badge accent">' + DATA.certs[k].name + '</span>'; }).join("") +
        '</span></div>' + cmds.map(function (x) {
          return '<div class="cmd"><code>' + esc(x.cmd[0]) + '</code>' +
            '<button class="btn ghost copy" type="button" data-copy="' + x.ref + '" aria-label="Copy command">Copy</button>' +
            '<span class="desc small muted">' + esc(x.cmd[1]) + '</span></div>';
        }).join("") + '</section>';
    }).join("");

    return '<div class="card cheat-bar">' +
        '<input type="search" data-cheat-q placeholder="Search commands, e.g. drain, snapshot, can-i" value="' + esc(c.q) + '" aria-label="Search commands">' +
        '<div class="chips" role="group" aria-label="Tool">' + tools.map(function (t) {
          return '<button class="chip" type="button" data-tool="' + t + '" aria-pressed="' + (t === c.tool) + '">' + (t === "all" ? "All" : esc(t)) + '</button>';
        }).join("") + '</div></div>' +
      (sections || '<p class="empty">No commands match.</p>');
  }

  // ---------- flashcards ----------
  function fcId(card) { return card.cert + ":" + card.q; }
  function fcDeck() {
    var f = state.fc;
    var deck = DATA.flashcards.filter(function (c) {
      return c.cert === state.cert && (f.type === "all" || c.type === f.type) && (!f.hideKnown || !state.known.has(fcId(c)));
    });
    if (f.order) {
      deck.sort(function (a, b) { return (f.order[fcId(a)] || 0) - (f.order[fcId(b)] || 0); });
    }
    return deck;
  }
  function renderFlashcards(cert) {
    var f = state.fc, deck = fcDeck();
    var all = DATA.flashcards.filter(function (c) { return c.cert === state.cert; });
    var knownCount = all.filter(function (c) { return state.known.has(fcId(c)); }).length;
    if (f.index >= deck.length) f.index = Math.max(0, deck.length - 1);
    var card = deck[f.index];

    var bar = '<div class="fc-bar"><div class="chips" role="group" aria-label="Card type">' +
      ["all", "concept", "definition", "command"].map(function (t) {
        return '<button class="chip" type="button" data-fc-type="' + t + '" aria-pressed="' + (t === f.type) + '">' + cap(t) + '</button>';
      }).join("") + '</div>' +
      '<label class="small"><input type="checkbox" data-fc-hide' + (f.hideKnown ? " checked" : "") + '> Hide known (' + knownCount + ' / ' + all.length + ')</label></div>';

    if (!card) {
      return '<div class="fc-wrap">' + bar + '<p class="empty card">No cards left in this deck. ' +
        '<button class="link" type="button" data-fc-reset>Reset known cards for ' + cert.name + '</button></p></div>';
    }
    var isKnown = state.known.has(fcId(card));
    return '<div class="fc-wrap">' + bar +
      '<button class="flashcard' + (f.flipped ? " flipped" : "") + '" type="button" id="flashcard" aria-label="Flashcard. Activate to flip.">' +
        '<span class="fc-inner">' +
          '<span class="fc-face fc-front"' + (f.flipped ? ' aria-hidden="true"' : "") + '><span class="meta"><span class="badge accent">' + cap(card.type) + '</span>' +
            '<span class="small muted num">' + (f.index + 1) + ' / ' + deck.length + '</span></span>' +
            '<span class="body">' + esc(card.q) + '</span><span class="small muted">Question</span></span>' +
          '<span class="fc-face fc-back"' + (f.flipped ? "" : ' aria-hidden="true"') + '><span class="meta"><span class="badge accent">Answer</span>' +
            (isKnown ? '<span class="badge low">Known</span>' : "") + '</span>' +
            '<span class="body' + (card.type === "command" ? " command" : "") + '">' + esc(card.a) + '</span></span>' +
        '</span></button>' +
      '<div class="fc-controls">' +
        '<button class="btn ghost" type="button" data-fc-nav="-1">← Previous</button>' +
        '<button class="btn" type="button" data-fc-flip>Flip</button>' +
        '<button class="btn ghost" type="button" data-fc-nav="1">Next →</button>' +
        '<button class="btn ghost" type="button" data-fc-known>' + (isKnown ? "Unmark known" : "Mark as known") + '</button>' +
        '<button class="btn ghost" type="button" data-fc-shuffle>Shuffle</button>' +
      '</div>' +
      '<p class="fc-hint small muted"><kbd>Space</kbd> flip · <kbd>←</kbd> <kbd>→</kbd> navigate · <kbd>K</kbd> mark known</p></div>';
  }

  // ---------- render ----------
  function render() {
    var cert = DATA.certs[state.cert];
    renderHeader();
    var html = state.view === "overview" ? renderOverview(cert)
      : state.view === "checklist" ? renderChecklist(cert)
      : state.view === "cheats" ? renderCheats()
      : renderFlashcards(cert);
    $("#main").innerHTML = html;
    document.title = cert.name + " · " + VIEWS.filter(function (v) { return v[0] === state.view; })[0][1] + " — CNCF Exam Prep";
  }
  // Re-render while keeping focus + caret in a text input that triggered the update.
  function renderKeepingFocus(selector) {
    var old = $(selector), pos = old ? old.selectionStart : null;
    render();
    var el = $(selector);
    if (el) { el.focus(); if (pos !== null) { try { el.setSelectionRange(pos, pos); } catch (e) {} } }
  }

  function resetFilters() {
    state.filters = { domain: "all", priority: "all", week: "all", q: "", hideDone: false };
  }
  function fcMove(step) {
    var n = fcDeck().length;
    if (!n) return;
    state.fc.index = (state.fc.index + step + n) % n;
    state.fc.flipped = false;
    render();
  }
  function fcFlip() {
    // Toggle the class in place so the CSS flip animation plays.
    var el = $("#flashcard");
    if (!el) return;
    state.fc.flipped = !state.fc.flipped;
    el.classList.toggle("flipped", state.fc.flipped);
    $(".fc-front", el).toggleAttribute("aria-hidden", state.fc.flipped);
    $(".fc-back", el).toggleAttribute("aria-hidden", !state.fc.flipped);
  }
  function fcToggleKnown() {
    var card = fcDeck()[state.fc.index];
    if (!card) return;
    var id = fcId(card);
    if (state.known.has(id)) state.known.delete(id); else state.known.add(id);
    save(KEY.known, Array.from(state.known));
    state.fc.flipped = false;
    render();
  }

  // ---------- events ----------
  document.addEventListener("click", function (e) {
    var t = e.target.closest("button, [data-copy]");
    if (!t) return;
    var d = t.dataset;

    if (d.cert) {
      state.cert = d.cert; resetFilters(); state.fc.index = 0; state.fc.flipped = false; state.fc.order = null;
      saveUi(); render();
    } else if (d.view) {
      state.view = d.view; saveUi(); render();
    } else if (d.gotoDomain) {
      resetFilters(); state.filters.domain = d.gotoDomain; state.view = "checklist"; saveUi(); render();
      window.scrollTo(0, 0);
    } else if ("clearFilters" in d) {
      resetFilters(); render();
    } else if (d.tool) {
      state.cheat.tool = d.tool; render();
    } else if (d.copy) {
      var ref = d.copy.split(":"), text = DATA.cheats[ref[0]].cmds[ref[1]][0];
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(
        function () { toast("Copied to clipboard"); },
        function () { toast("Copy failed — select the text manually"); }
      );
    } else if (d.fcType) {
      state.fc.type = d.fcType; state.fc.index = 0; state.fc.flipped = false; render();
    } else if (d.fcNav) {
      fcMove(Number(d.fcNav));
    } else if ("fcFlip" in d || t.id === "flashcard") {
      fcFlip();
    } else if ("fcKnown" in d) {
      fcToggleKnown();
    } else if ("fcShuffle" in d) {
      var order = {};
      DATA.flashcards.forEach(function (c) { order[fcId(c)] = Math.random(); });
      state.fc.order = order; state.fc.index = 0; state.fc.flipped = false; render();
      toast("Deck shuffled");
    } else if ("fcReset" in d) {
      DATA.flashcards.forEach(function (c) { if (c.cert === state.cert) state.known.delete(fcId(c)); });
      save(KEY.known, Array.from(state.known));
      state.fc.index = 0; render();
    }
  });

  document.addEventListener("change", function (e) {
    var t = e.target, d = t.dataset;
    if (d.item) {
      if (t.checked) state.done.add(d.item); else state.done.delete(d.item);
      save(KEY.done, Array.from(state.done));
      render();
      var again = $('[data-item="' + d.item + '"]');
      if (again) again.focus();
    } else if (d.filter && t.type !== "search") {
      state.filters[d.filter] = t.type === "checkbox" ? t.checked : t.value;
      render();
      var sel = $('[data-filter="' + d.filter + '"]');
      if (sel) sel.focus();
    } else if ("fcHide" in d) {
      state.fc.hideKnown = t.checked; state.fc.index = 0; state.fc.flipped = false; render();
    } else if (t.id === "importInput" && t.files[0]) {
      importProgress(t.files[0]);
      t.value = "";
    }
  });

  document.addEventListener("input", function (e) {
    var d = e.target.dataset;
    if (d.filter === "q") { state.filters.q = e.target.value; renderKeepingFocus('[data-filter="q"]'); }
    else if ("cheatQ" in d) { state.cheat.q = e.target.value; renderKeepingFocus("[data-cheat-q]"); }
  });

  document.addEventListener("keydown", function (e) {
    if (state.view !== "flashcards" || e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = e.target.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
    if (e.key === "ArrowRight") { fcMove(1); }
    else if (e.key === "ArrowLeft") { fcMove(-1); }
    else if (e.key === "k" || e.key === "K") { fcToggleKnown(); }
    else if (e.key === " " && tag !== "BUTTON") { e.preventDefault(); fcFlip(); }
  });

  // ---------- theme, export/import, reset ----------
  $("#themeBtn").addEventListener("click", function () {
    var root = document.documentElement;
    var dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    saveUi();
  });

  $("#exportBtn").addEventListener("click", function () {
    var blob = new Blob([JSON.stringify({ version: 1, done: Array.from(state.done), known: Array.from(state.known) }, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cncf-exam-prep-progress.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  function importProgress(file) {
    file.text().then(function (text) {
      var data = JSON.parse(text);
      if (!Array.isArray(data.done) || !Array.isArray(data.known)) throw new Error("bad shape");
      state.done = new Set(data.done.map(String));
      state.known = new Set(data.known.map(String));
      save(KEY.done, Array.from(state.done));
      save(KEY.known, Array.from(state.known));
      render();
      toast("Progress imported");
    }).catch(function () { toast("That file isn't a valid progress export"); });
  }

  $("#resetBtn").addEventListener("click", function () {
    if (!confirm("Clear all checklist progress and known flashcards for every certification? This cannot be undone.")) return;
    state.done.clear(); state.known.clear();
    save(KEY.done, []); save(KEY.known, []);
    render();
    toast("Progress reset");
  });

  render();
})();
