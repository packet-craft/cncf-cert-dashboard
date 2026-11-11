(function () {
  "use strict";

  var KEY = { done: "cncf-dash:v1:done", known: "cncf-dash:v1:known", ui: "cncf-dash:v1:ui" };
  var VIEWS = [["overview", "Overview"], ["learn", "Study Guide"], ["checklist", "Checklist"], ["cheats", "Cheat Sheet"], ["flashcards", "Flashcards"], ["resources", "Resources"]];
  var PRIORITY_RANK = { high: 0, medium: 1, low: 2 };
  var MAX_IMPORT_BYTES = 1024 * 1024;

  function own(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }
  function $(sel, root) { return (root || document).querySelector(sel); }

  // ---------- model ----------
  // Flatten checklist tuples into objects with stable ids.
  var ITEM_IDS = new Set(), CARD_IDS = new Set();
  Object.keys(DATA.certs).forEach(function (certKey) {
    var cert = DATA.certs[certKey];
    cert.key = certKey;
    cert.domains.forEach(function (d) {
      d.items = d.items.map(function (t, i) {
        var id = certKey + "-" + d.key + "-" + i;
        ITEM_IDS.add(id);
        return { id: id, title: t[0], priority: t[1], week: t[2], domain: d.key };
      });
    });
  });
  // Study guide: attach each domain's topics and precompute the text used by guide search.
  Object.keys(DATA.certs).forEach(function (certKey) {
    var docs = DATA.docs && DATA.docs[certKey];
    DATA.certs[certKey].domains.forEach(function (d) {
      d.doc = docs && own(docs, d.key) ? docs[d.key] : null;
      if (!d.doc) return;
      d.doc.topics.forEach(function (t) {
        t.text = (t.title + " " + t.summary + " " + t.body.join(" ")).toLowerCase();
      });
    });
  });
  function fcId(card) { return card.cert + ":" + card.q; }
  DATA.flashcards.forEach(function (c) { CARD_IDS.add(fcId(c)); });

  // ---------- storage ----------
  // Saved state is untrusted: it may be missing, corrupt, stale, or written by another page on
  // the same origin. Everything read from it is shape-checked before use.
  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  var saveWarned = false;
  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      if (!saveWarned) { saveWarned = true; toast("Progress can't be saved in this browser — it will be lost on reload"); }
      return false;
    }
  }
  // Keep only ids that exist in the current content.
  function idSet(value, valid) {
    var out = new Set();
    if (Array.isArray(value)) value.forEach(function (v) { if (typeof v === "string" && valid.has(v)) out.add(v); });
    return out;
  }
  function loadUi() {
    var v = read(KEY.ui);
    return v && typeof v === "object" && !Array.isArray(v) ? v : {};
  }

  var ui = loadUi();
  var state = {
    cert: typeof ui.cert === "string" && own(DATA.certs, ui.cert) ? ui.cert : "kcna",
    view: VIEWS.some(function (v) { return v[0] === ui.view; }) ? ui.view : "overview",
    done: idSet(read(KEY.done), ITEM_IDS),
    known: idSet(read(KEY.known), CARD_IDS),
    filters: { domain: "all", priority: "all", week: "all", q: "", hideDone: false },
    doc: { domain: null, topic: null, q: "" },
    cheat: { tool: "all", q: "" },
    fc: { type: "all", hideKnown: false, index: 0, flipped: false, order: null }
  };

  function currentTheme() {
    var t = document.documentElement.dataset.theme;
    return t === "light" || t === "dark" ? t : null;
  }
  function saveUi() { return save(KEY.ui, { cert: state.cert, view: state.view, theme: currentTheme() }); }
  function saveDone() { return save(KEY.done, Array.from(state.done)); }
  function saveKnown() { return save(KEY.known, Array.from(state.known)); }

  function domainStats(d) {
    var done = d.items.filter(function (it) { return state.done.has(it.id); }).length;
    var ratio = d.items.length ? done / d.items.length : 0;
    return { done: done, total: d.items.length, ratio: ratio, points: ratio * d.weight };
  }
  // Weighted readiness: each domain contributes (completed / total) × exam weight.
  function readiness(cert) {
    return cert.domains.reduce(function (sum, d) { return sum + domainStats(d).points; }, 0);
  }
  // Round down so the display never claims a pass mark that hasn't been reached.
  function pct(score) { return Math.floor(score + 1e-6); }

  // ---------- helpers ----------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }
  function options(pairs, selected) {
    return pairs.map(function (p) {
      return '<option value="' + esc(p[0]) + '"' + (String(p[0]) === String(selected) ? " selected" : "") + ">" + esc(p[1]) + "</option>";
    }).join("");
  }
  function bar(percent) { return '<span class="bar"><span data-w="' + percent.toFixed(1) + '"></span></span>'; }
  // Widths are applied through the CSSOM so the page needs no inline style attributes (CSP).
  function applyWidths(root) {
    Array.prototype.forEach.call(root.querySelectorAll("[data-w]"), function (el) { el.style.width = el.dataset.w + "%"; });
  }
  var toastTimer;
  function toast(msg) {
    var el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2600);
  }

  // ---------- markdown ----------
  // Guide content is written as a small Markdown subset. Everything is escaped before any
  // markup is added, so content can never inject HTML.
  function inline(s) {
    return String(s).split("`").map(function (part, i) {
      if (i % 2) return "<code>" + esc(part) + "</code>";
      return esc(part)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    }).join("");
  }
  function cells(row) { return row.trim().replace(/^\||\|$/g, "").split("|"); }
  function md(lines) {
    var html = "", i = 0, n = lines.length, buf, m;
    while (i < n) {
      var line = lines[i];
      if (!line.trim()) { i++; continue; }
      if (/^```/.test(line)) {
        buf = []; i++;
        while (i < n && !/^```/.test(lines[i])) buf.push(lines[i++]);
        i++;
        html += '<pre tabindex="0"><code>' + esc(buf.join("\n")) + "</code></pre>";
      } else if ((m = /^(#{2,3}) (.*)/.exec(line))) {
        var tag = m[1].length === 2 ? "h3" : "h4";
        html += "<" + tag + ">" + inline(m[2]) + "</" + tag + ">"; i++;
      } else if (/^\|/.test(line)) {
        buf = [];
        while (i < n && /^\|/.test(lines[i])) buf.push(lines[i++]);
        html += '<div class="table-wrap" tabindex="0"><table><thead><tr>' +
          cells(buf[0]).map(function (c) { return "<th>" + inline(c.trim()) + "</th>"; }).join("") + "</tr></thead><tbody>" +
          buf.slice(2).map(function (r) {
            return "<tr>" + cells(r).map(function (c) { return "<td>" + inline(c.trim()) + "</td>"; }).join("") + "</tr>";
          }).join("") + "</tbody></table></div>";
      } else if (/^> /.test(line)) {
        buf = [];
        while (i < n && /^> ?/.test(lines[i])) buf.push(lines[i++].replace(/^> ?/, ""));
        html += '<p class="callout">' + inline(buf.join(" ")) + "</p>";
      } else if (/^(- |\d+\. )/.test(line)) {
        var ordered = /^\d/.test(line);
        buf = [];
        while (i < n && (/^(- |\d+\. )/.test(lines[i]) || (/^ {2,}\S/.test(lines[i]) && buf.length))) {
          if (/^ /.test(lines[i])) buf[buf.length - 1] += " " + lines[i].trim();
          else buf.push(lines[i].replace(/^(- |\d+\. )/, ""));
          i++;
        }
        html += (ordered ? "<ol>" : "<ul>") + buf.map(function (x) { return "<li>" + inline(x) + "</li>"; }).join("") + (ordered ? "</ol>" : "</ul>");
      } else {
        // Each remaining line is one paragraph.
        html += "<p>" + inline(line.trim()) + "</p>"; i++;
      }
    }
    return html;
  }

  // ---------- header ----------
  function renderHeader() {
    var certTabs = $("#certTabs");
    certTabs.innerHTML = Object.keys(DATA.certs).map(function (k) {
      var c = DATA.certs[k], r = readiness(c);
      return '<button class="cert-tab" type="button" data-cert="' + esc(k) + '" aria-pressed="' + (k === state.cert) + '">' +
        '<span class="row"><strong>' + esc(c.name) + '</strong><span class="small muted num">' + pct(r) +
        '%<span class="pct-label"> ready</span></span></span>' + bar(r) + '</button>';
    }).join("");
    applyWidths(certTabs);
    $("#viewTabs").innerHTML = VIEWS.map(function (v) {
      return '<button class="view-tab" type="button" data-view="' + v[0] + '"' +
        (v[0] === state.view ? ' aria-current="page"' : "") + ">" + v[1] + "</button>";
    }).join("");
  }

  // ---------- overview ----------
  function renderOverview(cert) {
    var score = readiness(cert);
    var C = 2 * Math.PI * 54;
    var gap = Math.ceil(cert.passMark - score - 1e-6);
    var verdict = gap <= 0
      ? ["good", "Coverage is above the pass mark"]
      : gap <= 15 ? ["warn", "Close — " + plural(gap, "point") + " short of the pass mark"]
        : ["bad", plural(gap, "point") + " short of the pass mark"];
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
          '<div class="readiness">' +
            '<div class="ring" role="img" aria-label="Readiness ' + pct(score) + ' percent, pass mark ' + cert.passMark + ' percent">' +
              '<svg viewBox="0 0 120 120"><circle class="track" cx="60" cy="60" r="54"/>' +
              '<circle class="value" cx="60" cy="60" r="54" stroke-dasharray="' + C.toFixed(2) + '" stroke-dashoffset="' + (C * (1 - score / 100)).toFixed(2) + '"/>' +
              '<circle class="mark" cx="60" cy="60" r="54" stroke-dasharray="1.5 ' + (C - 1.5).toFixed(2) + '" stroke-dashoffset="' + (-markAngle).toFixed(2) + '"/></svg>' +
              '<div class="ring-label"><b class="num">' + pct(score) + '%</b><span class="small muted">pass ' + cert.passMark + '%</span></div>' +
            '</div>' +
            '<div class="stack">' +
              '<p class="verdict ' + verdict[0] + '">' + verdict[1] + '</p>' +
              '<p class="muted small">Weighted score = Σ (completed ÷ total items in a domain) × domain weight. ' +
              'It measures how much of the syllabus you have ticked off — not a predicted exam result. Use timed mock exams to judge that.</p>' +
              '<p class="small num">' + totalDone + ' of ' + total + ' checklist items complete</p>' +
            '</div>' +
          '</div>' +
        '</section>' +
        '<section class="card" aria-labelledby="ex-h">' +
          '<h2 id="ex-h">' + esc(cert.title) + '</h2>' +
          '<dl class="facts"><dt>Format</dt><dd>' + esc(cert.format) + '</dd><dt>Duration</dt><dd>' + esc(cert.duration) +
          '</dd><dt>Pass mark</dt><dd>' + cert.passMark + '%</dd><dt>Study plan</dt><dd>' + cert.weeks + ' weeks</dd></dl>' +
          (cert.curriculumNote ? '<p class="note small">' + esc(cert.curriculumNote) + '</p>' : "") +
        '</section>' +
      '</div>' +

      '<div class="section-head"><h2>Domains</h2><span class="muted small">Select a domain to open its ' +
        (hasDocs(cert) ? "study guide" : "checklist") + '</span></div>' +
      '<div class="grid domains">' + cert.domains.map(function (d) {
        var s = domainStats(d);
        return '<button class="card domain-card" type="button" ' + (d.doc ? "data-doc" : "data-goto-domain") + '="' + esc(d.key) + '">' +
          '<span class="top"><span class="name">' + esc(d.name) + '</span><span class="badge accent num">' + d.weight + '%</span></span>' +
          bar(s.ratio * 100) +
          '<span class="stats small muted num"><span>' + s.done + ' / ' + s.total + ' items</span><span>' +
          s.points.toFixed(1) + ' / ' + d.weight + ' pts</span></span></button>';
      }).join("") + '</div>' +

      '<div class="section-head"><h2>Study next</h2><span class="muted small">Highest priority in the heaviest domains</span></div>' +
      '<div class="card">' + (next.length
        ? '<ul class="next-list">' + next.map(function (n) {
            return '<li><span class="badge ' + esc(n.it.priority) + '">' + cap(n.it.priority) + '</span><span><span>' + esc(n.it.title) +
              '</span><br><span class="small muted">' + esc(n.d.name) + ' · Week ' + n.it.week + '</span></span></li>';
          }).join("") + '</ul>'
        : '<p class="empty">Everything is checked off. Time for timed mock exams.</p>') +
      '</div>';
  }

  // ---------- study guide ----------
  function hasDocs(cert) { return cert.domains.some(function (d) { return d.doc; }); }
  function topicItems(d, t) { return t.items.map(function (i) { return d.items[i]; }); }
  function topicDone(d, t) { return topicItems(d, t).every(function (it) { return state.done.has(it.id); }); }
  function flatTopics(cert) {
    var out = [];
    cert.domains.forEach(function (d) {
      if (d.doc) d.doc.topics.forEach(function (t) { out.push({ d: d, t: t, ref: d.key + "/" + t.key }); });
    });
    return out;
  }
  // Resolve state.doc to a real domain (and topic); fall back to the first documented domain.
  function currentDoc(cert) {
    var d = cert.domains.filter(function (x) { return x.doc && x.key === state.doc.domain; })[0] ||
      cert.domains.filter(function (x) { return x.doc; })[0] || null;
    var t = d && d.doc.topics.filter(function (x) { return x.key === state.doc.topic; })[0] || null;
    state.doc.domain = d ? d.key : null;
    state.doc.topic = t ? t.key : null;
    return { d: d, t: t };
  }
  function tick(done) { return '<span class="tick' + (done ? " on" : "") + '" aria-hidden="true"></span>' + (done ? '<span class="sr-only">Completed: </span>' : ""); }
  function docNav(cert) {
    var cur = currentDoc(cert), q = state.doc.q.trim().toLowerCase();
    if (q) {
      var hits = flatTopics(cert).filter(function (x) { return x.t.text.indexOf(q) !== -1; });
      return hits.length ? '<ul class="doc-topics">' + hits.map(function (x) {
        return '<li><button type="button" class="doc-link" data-doc="' + esc(x.ref) + '">' + tick(topicDone(x.d, x.t)) +
          '<span>' + esc(x.t.title) + '<br><span class="small muted">' + esc(x.d.name) + '</span></span></button></li>';
      }).join("") + '</ul>' : '<p class="small muted doc-empty">No topics mention “' + esc(state.doc.q.trim()) + '”.</p>';
    }
    return cert.domains.map(function (d) {
      if (!d.doc) return "";
      var open = cur.d === d, s = domainStats(d);
      return '<button type="button" class="doc-domain" data-doc="' + esc(d.key) + '"' + (open && !cur.t ? ' aria-current="page"' : "") + '>' +
        '<span>' + esc(d.name) + '</span><span class="small muted num">' + s.done + "/" + s.total + '</span></button>' +
        (open ? '<ul class="doc-topics">' + d.doc.topics.map(function (t) {
          return '<li><button type="button" class="doc-link" data-doc="' + esc(d.key + "/" + t.key) + '"' +
            (cur.t === t ? ' aria-current="page"' : "") + '>' + tick(topicDone(d, t)) + '<span>' + esc(t.title) + '</span></button></li>';
        }).join("") + '</ul>' : "");
    }).join("");
  }
  function docSelect(cert) {
    var cur = currentDoc(cert), sel = cur.d.key + (cur.t ? "/" + cur.t.key : "");
    return '<label class="doc-select">Jump to<select data-doc-select>' + cert.domains.map(function (d) {
      if (!d.doc) return "";
      return '<optgroup label="' + esc(d.name + " (" + d.weight + "%)") + '">' +
        options([[d.key, "Domain overview"]].concat(d.doc.topics.map(function (t) { return [d.key + "/" + t.key, t.title]; })), sel) + '</optgroup>';
    }).join("") + '</select></label>';
  }
  function itemList(items) {
    return '<ul class="items">' + items.map(function (it) {
      var done = state.done.has(it.id);
      return '<li class="item' + (done ? " done" : "") + '"><label>' +
        '<input type="checkbox" data-item="' + esc(it.id) + '"' + (done ? " checked" : "") + '>' +
        '<span class="title">' + esc(it.title) + '</span>' +
        '<span class="tags"><span class="badge ' + esc(it.priority) + '">' + cap(it.priority) + '</span></span></label></li>';
    }).join("") + '</ul>';
  }
  function domainPage(cert, d) {
    var s = domainStats(d);
    return '<p class="crumbs small muted">' + esc(cert.name) + ' study guide</p>' +
      '<h2 class="doc-title">' + esc(d.name) + ' <span class="badge accent num">' + d.weight + '% of the exam</span></h2>' +
      '<div class="prose">' + md(d.doc.intro) + '</div>' +
      '<div class="doc-progress">' + bar(s.ratio * 100) + '<span class="small muted num">' + s.done + ' of ' + s.total +
        ' checklist items done · ' + s.points.toFixed(1) + ' / ' + d.weight + ' pts</span></div>' +
      '<h3 class="doc-sub">Topics</h3>' +
      '<ol class="topic-cards">' + d.doc.topics.map(function (t) {
        return '<li><button type="button" class="card topic-card" data-doc="' + esc(d.key + "/" + t.key) + '">' +
          '<span class="name">' + tick(topicDone(d, t)) + esc(t.title) + '</span>' +
          '<span class="small muted">' + esc(t.summary) + '</span></button></li>';
      }).join("") + '</ol>' +
      '<p class="doc-actions"><button type="button" class="btn ghost" data-goto-domain="' + esc(d.key) + '">Open this domain’s checklist</button> ' +
        '<button type="button" class="btn ghost" data-view="flashcards">Practise flashcards</button></p>';
  }
  function topicPage(cert, d, t) {
    var flat = flatTopics(cert), idx = -1;
    flat.forEach(function (x, i) { if (x.t === t) idx = i; });
    var prev = flat[idx - 1], next = flat[idx + 1];
    return '<p class="crumbs small"><button type="button" class="link" data-doc="' + esc(d.key) + '">' + esc(d.name) + '</button>' +
        ' <span class="muted">› Topic ' + (d.doc.topics.indexOf(t) + 1) + ' of ' + d.doc.topics.length + '</span></p>' +
      '<h2 class="doc-title">' + esc(t.title) + '</h2>' +
      '<p class="lead muted">' + esc(t.summary) + '</p>' +
      '<div class="prose">' + md(t.body) + '</div>' +
      (t.quiz && t.quiz.length ? '<h3 class="doc-sub">Check yourself</h3><div class="quiz">' + t.quiz.map(function (qa) {
        return '<details><summary>' + inline(qa[0]) + '</summary><p>' + inline(qa[1]) + '</p></details>';
      }).join("") + '</div>' : "") +
      '<h3 class="doc-sub">Track your progress</h3>' +
      '<p class="small muted">Tick these off once you can explain them without looking. They are the same items as in the Checklist tab.</p>' +
      '<div class="card group">' + itemList(topicItems(d, t)) + '</div>' +
      '<div class="doc-pager">' +
        (prev ? '<button type="button" class="card pager" data-doc="' + esc(prev.ref) + '"><span class="small muted">← Previous</span><span class="name">' + esc(prev.t.title) + '</span></button>' : '<span></span>') +
        (next ? '<button type="button" class="card pager next" data-doc="' + esc(next.ref) + '"><span class="small muted">Next →</span><span class="name">' + esc(next.t.title) + '</span></button>' : '<span></span>') +
      '</div>';
  }
  function renderLearn(cert) {
    if (!hasDocs(cert)) {
      return '<div class="card empty"><h2>' + esc(cert.name) + ' study guide</h2>' +
        '<p>The detailed guide for ' + esc(cert.name) + ' has not been written yet. Until then, use the ' +
        '<button type="button" class="link" data-view="checklist">checklist</button>, ' +
        '<button type="button" class="link" data-view="flashcards">flashcards</button> and ' +
        '<button type="button" class="link" data-view="resources">resources</button>.</p></div>';
    }
    var cur = currentDoc(cert);
    return '<div class="learn">' +
      '<aside class="doc-side" aria-label="Study guide contents">' +
        '<input type="search" data-doc-q placeholder="Search the guide" aria-label="Search the guide" value="' + esc(state.doc.q) + '">' +
        docSelect(cert) +
        '<nav id="docNav" class="doc-nav' + (state.doc.q.trim() ? " searching" : "") + '" aria-label="Guide topics">' + docNav(cert) + '</nav>' +
      '</aside>' +
      '<article class="doc">' + (cur.t ? topicPage(cert, cur.d, cur.t) : domainPage(cert, cur.d)) + '</article>' +
    '</div>';
  }

  // ---------- checklist ----------
  // The filter bar is rendered once; typing in the search box only replaces the list below it,
  // so the input element survives (keeps IME composition, caret and undo history).
  function checklistBody(cert) {
    var f = state.filters, q = f.q.trim().toLowerCase(), shown = 0;
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
            '<input type="checkbox" data-item="' + esc(it.id) + '"' + (done ? " checked" : "") + '>' +
            '<span class="title">' + esc(it.title) + '</span>' +
            '<span class="tags"><span class="badge ' + esc(it.priority) + '">' + cap(it.priority) + '</span>' +
            '<span class="badge">Week ' + it.week + '</span></span></label></li>';
        }).join("") + '</ul></section>';
    }).join("");
    return (groups || '<p class="empty">No items match these filters. ' +
      '<button class="link" type="button" data-clear-filters>Clear filters</button></p>') +
      '<p class="small muted count">' + plural(shown, "item") + ' shown</p>';
  }
  function renderChecklist(cert) {
    var f = state.filters;
    var weeks = [["all", "All weeks"]];
    for (var w = 1; w <= cert.weeks; w++) weeks.push([w, "Week " + w]);
    return '<h2 class="sr-only">' + esc(cert.name) + ' checklist</h2>' +
      '<div class="card filters">' +
        '<label>Domain<select data-filter="domain">' + options([["all", "All domains"]].concat(cert.domains.map(function (d) {
          return [d.key, d.name + " (" + d.weight + "%)"]; })), f.domain) + '</select></label>' +
        '<label>Priority<select data-filter="priority">' + options([["all", "All priorities"], ["high", "High"], ["medium", "Medium"], ["low", "Low"]], f.priority) + '</select></label>' +
        '<label>Study week<select data-filter="week">' + options(weeks, f.week) + '</select></label>' +
        '<label>Search<input type="search" data-filter="q" placeholder="Filter topics" value="' + esc(f.q) + '"></label>' +
        '<label class="check"><input type="checkbox" data-filter="hideDone"' + (f.hideDone ? " checked" : "") + '> Hide completed</label>' +
      '</div>' +
      '<div id="checklistBody">' + checklistBody(cert) + '</div>';
  }

  // ---------- cheat sheet ----------
  function cheatBody() {
    var c = state.cheat, q = c.q.trim().toLowerCase();
    var sections = DATA.cheats.map(function (s, si) {
      if (c.tool !== "all" && s.tool !== c.tool) return "";
      var cmds = s.cmds.map(function (cmd, ci) { return { cmd: cmd, ref: si + ":" + ci }; }).filter(function (x) {
        return !q || (x.cmd[0] + " " + x.cmd[1] + " " + s.title).toLowerCase().indexOf(q) !== -1;
      });
      if (!cmds.length) return "";
      return '<section class="card cheat-section"><div class="head"><h3>' + esc(s.title) + '</h3><span class="chips">' +
        s.certs.map(function (k) { return '<span class="badge accent">' + esc(DATA.certs[k].name) + '</span>'; }).join("") +
        '</span></div>' + cmds.map(function (x) {
          return '<div class="cmd"><code>' + esc(x.cmd[0]) + '</code>' +
            '<button class="btn ghost copy" type="button" data-copy="' + x.ref + '" aria-label="Copy: ' + esc(x.cmd[0]) + '">Copy</button>' +
            '<span class="desc small muted">' + esc(x.cmd[1]) + '</span></div>';
        }).join("") + '</section>';
    }).join("");
    return sections || '<p class="empty">No commands match.</p>';
  }
  function renderCheats() {
    var c = state.cheat, tools = ["all"];
    DATA.cheats.forEach(function (s) { if (tools.indexOf(s.tool) === -1) tools.push(s.tool); });
    return '<h2 class="sr-only">Command cheat sheet</h2>' +
      '<div class="card cheat-bar">' +
        '<input type="search" data-cheat-q placeholder="Search commands, e.g. drain, snapshot, can-i" value="' + esc(c.q) + '" aria-label="Search commands">' +
        '<div class="chips" role="group" aria-label="Tool">' + tools.map(function (t) {
          return '<button class="chip" type="button" data-tool="' + esc(t) + '" aria-pressed="' + (t === c.tool) + '">' + (t === "all" ? "All" : esc(t)) + '</button>';
        }).join("") + '</div></div>' +
      '<p class="small muted count">The cheat sheet is shared by all three certifications; badges show which exams each section matters for.</p>' +
      '<div id="cheatBody">' + cheatBody() + '</div>';
  }

  // ---------- flashcards ----------
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

    var head = '<h2 class="sr-only">' + esc(cert.name) + ' flashcards</h2>' +
      '<div class="fc-bar"><div class="chips" role="group" aria-label="Card type">' +
      ["all", "concept", "definition", "command"].map(function (t) {
        return '<button class="chip" type="button" data-fc-type="' + t + '" aria-pressed="' + (t === f.type) + '">' + cap(t) + '</button>';
      }).join("") + '</div>' +
      '<label class="small"><input type="checkbox" data-fc-hide' + (f.hideKnown ? " checked" : "") + '> Hide known (' + knownCount + ' / ' + all.length + ')</label></div>';

    if (!card) {
      return '<div class="fc-wrap">' + head + '<p class="empty card">No cards left in this deck. ' +
        '<button class="link" type="button" data-fc-reset>Reset known cards for ' + esc(cert.name) + '</button></p></div>';
    }
    var isKnown = state.known.has(fcId(card));
    var knownBadge = isKnown ? '<span class="badge low">Known</span>' : "";
    // The card's accessible name is its visible face; the hidden face is aria-hidden.
    return '<div class="fc-wrap">' + head +
      '<button class="flashcard' + (f.flipped ? " flipped" : "") + '" type="button" id="flashcard">' +
        '<span class="fc-inner">' +
          '<span class="fc-face fc-front" aria-hidden="' + f.flipped + '"><span class="meta"><span class="badge accent">' + cap(card.type) + '</span>' +
            knownBadge + '<span class="small muted num">Card ' + (f.index + 1) + ' of ' + deck.length + '</span></span>' +
            '<span class="body">' + esc(card.q) + '</span><span class="small muted">Question — select to flip</span></span>' +
          '<span class="fc-face fc-back" aria-hidden="' + !f.flipped + '"><span class="meta"><span class="badge accent">Answer</span>' +
            knownBadge + '</span>' +
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

  // ---------- resources ----------
  function renderResources(cert) {
    return '<p class="muted">Free and open-source study material for ' + esc(cert.name) +
      '. Links open external sites that this project does not maintain.</p>' +
      DATA.resources[cert.key].map(function (g) {
        return '<div class="section-head"><h2>' + esc(g.group) + '</h2></div><div class="grid resources">' +
          g.items.filter(function (r) { return /^https:\/\//.test(r[1]); }).map(function (r) {
            var host = r[1].replace(/^https:\/\/(www\.)?/, "").split("/")[0];
            return '<a class="card resource" href="' + esc(r[1]) + '" target="_blank" rel="noopener noreferrer">' +
              '<span class="name">' + esc(r[0]) + '</span><span class="small muted">' + esc(r[2]) + '</span>' +
              '<span class="small host">' + esc(host) + ' ↗</span></a>';
          }).join("") + '</div>';
      }).join("");
  }

  // ---------- render ----------
  function render() {
    var cert = DATA.certs[state.cert];
    if (!hasDocs(cert)) { state.doc.domain = null; state.doc.topic = null; }
    renderHeader();
    var main = $("#main");
    main.innerHTML = state.view === "overview" ? renderOverview(cert)
      : state.view === "learn" ? renderLearn(cert)
      : state.view === "checklist" ? renderChecklist(cert)
      : state.view === "cheats" ? renderCheats()
      : state.view === "resources" ? renderResources(cert)
      : renderFlashcards(cert);
    applyWidths(main);
    var page = VIEWS.filter(function (v) { return v[0] === state.view; })[0][1];
    if (state.view === "learn" && hasDocs(cert)) {
      var cur = currentDoc(cert);
      page = cur.t ? cur.t.title : cur.d.name;
    }
    document.title = cert.name + " · " + page + " — CNCF Exam Prep";
    syncHash();
  }

  // ---------- routing ----------
  // The address is #<cert>/<view>[/<domain>[/<topic>]], so guide pages can be linked and the
  // Back button works. Unknown parts are ignored.
  function hashFor() {
    var h = "#" + state.cert + "/" + state.view;
    if (state.view === "learn" && state.doc.domain) h += "/" + state.doc.domain + (state.doc.topic ? "/" + state.doc.topic : "");
    return h;
  }
  function applyHash() {
    var p = location.hash.replace(/^#\/?/, "").split("/");
    if (!own(DATA.certs, p[0])) return false;
    state.cert = p[0];
    if (VIEWS.some(function (v) { return v[0] === p[1]; })) state.view = p[1];
    if (state.view === "learn") { state.doc.domain = p[2] || null; state.doc.topic = p[3] || null; }
    return true;
  }
  var firstRender = true;
  function syncHash() {
    var h = hashFor(), replace = firstRender;
    firstRender = false;
    if (location.hash === h) return;
    try { history[replace ? "replaceState" : "pushState"](null, "", h); }
    catch (e) { location.hash = h; }
  }
  function onRoute() {
    if (location.hash === hashFor() || !applyHash()) return;
    saveUi(); render();
  }
  window.addEventListener("popstate", onRoute);
  window.addEventListener("hashchange", onRoute);
  function openDoc(ref) {
    var p = ref.split("/");
    state.view = "learn"; state.doc = { domain: p[0], topic: p[1] || null, q: "" };
    saveUi(); render(); window.scrollTo(0, 0);
  }

  // A re-render replaces the control that was just used. Put keyboard focus back on its
  // equivalent in the new markup (matched by its data-* attribute or id), or on <main>.
  function selectorFor(el) {
    for (var i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      if (a.name.indexOf("data-") === 0) return "[" + a.name + '="' + CSS.escape(a.value) + '"]';
    }
    return el.id ? "#" + CSS.escape(el.id) : null;
  }
  function restoreFocus(el) {
    if (el.isConnected) return;
    var sel = selectorFor(el), next = sel && $(sel);
    (next || $("#main")).focus({ preventScroll: true });
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
    // Toggle in place so the CSS flip animation plays.
    var el = $("#flashcard");
    if (!el) return;
    state.fc.flipped = !state.fc.flipped;
    el.classList.toggle("flipped", state.fc.flipped);
    $(".fc-front", el).setAttribute("aria-hidden", String(state.fc.flipped));
    $(".fc-back", el).setAttribute("aria-hidden", String(!state.fc.flipped));
  }
  function fcToggleKnown() {
    var card = fcDeck()[state.fc.index];
    if (!card) return;
    var id = fcId(card);
    if (state.known.has(id)) state.known.delete(id); else state.known.add(id);
    saveKnown();
    state.fc.flipped = false;
    render();
  }

  // ---------- events ----------
  document.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t) return;
    var d = t.dataset;

    if (d.cert) {
      if (!own(DATA.certs, d.cert)) return;
      state.cert = d.cert; resetFilters(); state.doc = { domain: null, topic: null, q: "" }; state.fc.index = 0; state.fc.flipped = false; state.fc.order = null;
      saveUi(); render(); window.scrollTo(0, 0);
    } else if (d.view) {
      state.view = d.view; saveUi(); render(); window.scrollTo(0, 0);
    } else if (d.doc) {
      openDoc(d.doc);
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
      saveKnown();
      state.fc.index = 0; state.fc.hideKnown = false; render();
    } else if (t.id === "themeBtn") {
      var dark = currentTheme() ? currentTheme() === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.dataset.theme = dark ? "light" : "dark";
      saveUi();
    } else if (t.id === "exportBtn") {
      exportProgress();
    } else if (t.id === "importBtn") {
      $("#importInput").click();
    } else if (t.id === "resetBtn") {
      if (!confirm("Clear all checklist progress and known flashcards for every certification? This cannot be undone.")) return;
      state.done.clear(); state.known.clear();
      saveDone(); saveKnown();
      render();
      toast("Progress reset");
    }
    restoreFocus(t);
  });

  document.addEventListener("change", function (e) {
    var t = e.target, d = t.dataset;
    if (d.item) {
      if (!ITEM_IDS.has(d.item)) return;
      if (t.checked) state.done.add(d.item); else state.done.delete(d.item);
      saveDone();
      if (state.view === "learn") {
        // Keep the page (and any opened answers) in place; refresh only what shows progress.
        renderHeader();
        var nav = $("#docNav"), li = t.closest(".item");
        if (nav) nav.innerHTML = docNav(DATA.certs[state.cert]);
        if (li) li.classList.toggle("done", t.checked);
        return;
      }
      render();
    } else if ("docSelect" in d) {
      openDoc(t.value);
      return;
    } else if (d.filter && t.type !== "search") {
      state.filters[d.filter] = t.type === "checkbox" ? t.checked : t.value;
      render();
    } else if ("fcHide" in d) {
      state.fc.hideKnown = t.checked; state.fc.index = 0; state.fc.flipped = false; render();
    } else if (t.id === "importInput") {
      if (t.files[0]) importProgress(t.files[0]);
      t.value = "";
      return;
    } else {
      return;
    }
    restoreFocus(t);
  });

  // Search boxes: update the results only, and wait for IME composition to finish.
  function onSearch(target) {
    var d = target.dataset, body;
    if (d.filter === "q") {
      state.filters.q = target.value;
      body = $("#checklistBody");
      if (body) body.innerHTML = checklistBody(DATA.certs[state.cert]);
    } else if ("docQ" in d) {
      state.doc.q = target.value;
      body = $("#docNav");
      if (body) {
        body.innerHTML = docNav(DATA.certs[state.cert]);
        body.classList.toggle("searching", !!target.value.trim());
      }
    } else if ("cheatQ" in d) {
      state.cheat.q = target.value;
      body = $("#cheatBody");
      if (body) body.innerHTML = cheatBody();
    }
  }
  document.addEventListener("input", function (e) { if (!e.isComposing) onSearch(e.target); });
  document.addEventListener("compositionend", function (e) { onSearch(e.target); });

  // Flashcard shortcuts: only without modifiers, and not while another control has focus.
  document.addEventListener("keydown", function (e) {
    if (state.view !== "flashcards" || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.repeat) return;
    var el = e.target, tag = el.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
    if ((tag === "BUTTON" || tag === "A") && !el.closest(".fc-wrap")) return;
    if (e.key === "ArrowRight") { fcMove(1); restoreFocus(el); }
    else if (e.key === "ArrowLeft") { fcMove(-1); restoreFocus(el); }
    else if (e.key === "k" || e.key === "K") { fcToggleKnown(); restoreFocus(el); }
    else if (e.key === " " && tag !== "BUTTON") { e.preventDefault(); fcFlip(); }
  });

  // Keep several open tabs in step instead of letting them overwrite each other.
  window.addEventListener("storage", function (e) {
    if (e.key !== null && e.key !== KEY.done && e.key !== KEY.known) return;
    state.done = idSet(read(KEY.done), ITEM_IDS);
    state.known = idSet(read(KEY.known), CARD_IDS);
    render();
  });

  // ---------- export / import ----------
  function exportProgress() {
    var blob = new Blob([JSON.stringify({ version: 1, done: Array.from(state.done), known: Array.from(state.known) }, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "cncf-exam-prep-progress.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function importProgress(file) {
    if (file.size > MAX_IMPORT_BYTES) { toast("That file is too large to be a progress export"); return; }
    file.text().then(function (text) {
      var data = JSON.parse(text);
      if (!data || !Array.isArray(data.done) || !Array.isArray(data.known)) throw new Error("bad shape");
      var done = idSet(data.done, ITEM_IDS), known = idSet(data.known, CARD_IDS);
      if ((state.done.size || state.known.size) &&
          !confirm("Replace your current progress with the imported file (" + plural(done.size, "checklist item") + ", " + plural(known.size, "known card") + ")?")) return;
      state.done = done; state.known = known;
      var savedDone = saveDone(), savedKnown = saveKnown();
      render();
      if (savedDone && savedKnown) toast("Progress imported");
    }).catch(function () { toast("That file isn't a valid progress export"); });
  }

  applyHash();
  render();
})();
