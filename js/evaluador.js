/* =====================================================================
   MOTOR DE EVALUACIÓN CO-STAR (por reglas, 100% en el navegador)
   No hace falta modificar este archivo: los parámetros están en config.js
   ===================================================================== */
(function () {
  "use strict";
  const CFG = window.COSTAR_CONFIG;

  // ---------- Normalización ----------
  function normChar(c) {
    return c.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }
  function norm(s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }
  // Normaliza conservando un mapa de posiciones normalizado → original
  function normWithMap(orig) {
    let out = "", map = [];
    for (let i = 0; i < orig.length; i++) {
      const n = normChar(orig[i]);
      for (let k = 0; k < n.length; k++) { out += n[k]; map.push(i); }
    }
    map.push(orig.length);
    return { text: out, map };
  }
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  // Compila un término: "disen" → inicio de palabra; "=tu" → palabra exacta
  const reCache = new Map();
  function termRe(term) {
    if (reCache.has(term)) return reCache.get(term);
    let re;
    if (term.startsWith("=")) {
      re = new RegExp("(^|[^a-z0-9])" + escRe(term.slice(1)) + "(?![a-z0-9])", "g");
    } else {
      re = new RegExp("(^|[^a-z0-9])" + escRe(term), "g");
    }
    reCache.set(term, re);
    return re;
  }
  function countTerm(textN, term) {
    const re = termRe(term); re.lastIndex = 0;
    const m = textN.match(re);
    return m ? m.length : 0;
  }

  // ---------- Lectura de la estructura del prompt ----------
  const ALIAS = [];
  CFG.VARIABLES.forEach(v => v.alias.forEach(a => ALIAS.push({ alias: norm(a), id: v.id })));
  ALIAS.sort((a, b) => b.alias.length - a.alias.length);
  const LETRAS = {}; CFG.VARIABLES.forEach(v => LETRAS[v.letra.toLowerCase()] = v.id);

  function detectHeader(line) {
    const { text: n, map } = normWithMap(line.normalize("NFC"));
    let pos = 0;
    const lead = n.match(/^[\s#>*_\-•·\d.)]*/)[0];
    const markdown = /[#*]/.test(lead) || /^\s*\d+[.)]/.test(n);
    pos = lead.length;
    let s = n.slice(pos);

    // Prefijo de letra opcional: "(C)", "C)", "C -", "C."
    let letra = null;
    const ml = s.match(/^\(?([a-z])\)?\s*[\-–—:.)]?\s+/);
    if (ml && LETRAS[ml[1]]) { letra = LETRAS[ml[1]]; }

    function tryAlias(str, offset) {
      for (const a of ALIAS) {
        if (str.startsWith(a.alias)) {
          const after = str.slice(a.alias.length);
          if (after.length && /[a-z0-9]/.test(after[0])) continue;
          const mr = after.match(/^\s*(\([^)]*\))?\s*\**\s*([:\-–—]+)?\s*\**\s*/);
          const sep = !!(mr && mr[2]);
          const restStart = offset + a.alias.length + (mr ? mr[0].length : 0);
          const restN = n.slice(restStart).trim();
          return { id: a.id, sep, restStart, restN };
        }
      }
      return null;
    }

    let r = tryAlias(s, pos);
    if (!r && ml && letra) {
      r = tryAlias(s.slice(ml[0].length), pos + ml[0].length);
      if (r && r.id !== letra) r = null;
    }
    if (r) {
      const esCabecera = markdown || r.sep || r.restN === "" || !!letra;
      if (!esCabecera) return null;
      let rest = line.normalize("NFC").slice(map[r.restStart]).replace(/\*+\s*$/, "").trim();
      return { id: r.id, rest };
    }
    // Solo letra, con formato de cabecera (# C: ... / **C**)
    const ms = s.match(/^\(?([a-z])\)?\**\s*[:\-–—]\s*/);
    if (ms && LETRAS[ms[1]] && markdown) {
      const rest = line.normalize("NFC").slice(map[pos + ms[0].length]).trim();
      return { id: LETRAS[ms[1]], rest };
    }
    return null;
  }

  function parsePrompt(prompt) {
    const lines = prompt.replace(/\r\n?/g, "\n").split("\n");
    const secciones = {}; let actual = null; let preambulo = [];
    let encontradas = [];
    for (const line of lines) {
      const h = detectHeader(line);
      if (h) {
        actual = h.id;
        if (!(actual in secciones)) { secciones[actual] = []; encontradas.push(actual); }
        if (h.rest) secciones[actual].push(h.rest);
      } else if (actual) {
        secciones[actual].push(line);
      } else if (line.trim()) {
        preambulo.push(line);
      }
    }
    const out = {};
    for (const k in secciones) out[k] = secciones[k].join("\n").trim();
    return { secciones: out, encontradas, preambulo: preambulo.join("\n").trim() };
  }

  // ---------- Métricas de texto ----------
  function palabras(t) { return (norm(t).match(/[a-z0-9]+/g) || []); }
  function cifras(t) {
    const m = t.match(/\d+(?:[.,]\d+)?\s*%?/g) || [];
    return new Set(m.map(x => x.trim())).size;
  }
  function nombresPropios(t) {
    // Palabras con mayúscula inicial que no empiezan frase
    const tokens = t.match(/[^\s]+/g) || [];
    const set = new Set();
    for (let i = 0; i < tokens.length; i++) {
      const tk = tokens[i].replace(/^[("'“«¿¡]+|[)"'”».,;:!?]+$/g, "");
      if (tk.length < 2) continue;
      if (!/^[A-ZÁÉÍÓÚÑÜ]/.test(tk)) continue;
      const prev = i === 0 ? "" : tokens[i - 1];
      if (i === 0 || /[.!?:]$/.test(prev) || /^[-•*]$/.test(prev)) {
        // Acrónimos sí cuentan aunque inicien frase (UCA, HTML...)
        if (!/^[A-ZÁÉÍÓÚÑ]{2,}$/.test(tk)) continue;
      }
      set.add(tk);
    }
    return set.size;
  }
  function diversidad(words) {
    const largas = words.filter(w => w.length > 3);
    if (largas.length < 8) return largas.length ? 0.8 : 0;
    const r = new Set(largas).size / largas.length;
    return Math.max(0, Math.min(1, (r - 0.4) / 0.3));
  }
  function vagas(textN) {
    let n = 0; const det = [];
    for (const t of CFG.PALABRAS_VAGAS) {
      const c = countTerm(textN, t);
      if (c) { n += c; det.push(t.replace(/^=/, "")); }
    }
    return { n, det };
  }

  // Términos de un criterio: español + inglés (se buscan siempre ambos)
  function terminosDe(c) {
    if (!c._todos) c._todos = [...new Set([...(c.es || []), ...(c.en || []), ...(c.terminos || [])])];
    return c._todos;
  }

  // ---------- Evaluación de una variable ----------
  function evaluarVariable(v, texto) {
    const res = { id: v.id, palabras: 0, extension: 0, cobertura: 0, precision: 0, puntuacion: 0, presente: false, plantilla: false, vagas: [] };
    if (texto == null) return res;
    res.presente = true;
    // Eliminar huecos de plantilla sin rellenar: [ ... ]
    let limpio = texto.replace(/\[[^\]]*\]/g, m => { res.plantilla = true; return " "; }).trim();
    const words = palabras(limpio);
    res.palabras = words.length;
    if (!words.length) return res;

    const tN = " " + norm(limpio) + " ";
    const nCif = cifras(limpio), nProp = nombresPropios(limpio);

    // Extensión
    const ratio = words.length / v.palabrasObjetivo;
    res.extension = ratio >= 1 ? 1 : Math.pow(ratio, 0.8);

    // Cobertura
    let totalHits = 0;
    const det = v.criterios.map(c => {
      let hits = 0;
      for (const t of terminosDe(c)) if (countTerm(tN, t) > 0) hits++;
      if (c.cuentaCifras && nCif) hits += Math.min(nCif, 2);
      if (c.cuentaNombresPropios && nProp) hits += Math.min(nProp, 2);
      totalHits += hits;
      let s;
      if (c.multiple) s = hits === 0 ? 0 : hits === 1 ? 0.5 : hits === 2 ? 0.8 : 1;
      else s = hits === 0 ? 0 : hits === 1 ? 0.7 : 1;
      return { nombre: c.nombre, hits, score: s };
    });
    res.criterios = det;
    res.cobertura = det.reduce((a, b) => a + b.score, 0) / det.length;

    // Precisión
    const comps = [];
    if (v.precision.cifras) comps.push(Math.min(1, nCif / v.precision.cifras));
    if (v.precision.nombresPropios) comps.push(Math.min(1, nProp / v.precision.nombresPropios));
    comps.push(diversidad(words));
    comps.push(Math.min(1, totalHits / (v.criterios.length * 2))); // densidad de detalle
    let pre = comps.reduce((a, b) => a + b, 0) / comps.length;
    const vg = vagas(tN);
    res.vagas = vg.det;
    pre = Math.max(0, pre - Math.min(0.45, vg.n * 0.15));
    res.precision = pre;

    const P = CFG.PESOS;
    let score = 100 * (P.extension * res.extension + P.cobertura * res.cobertura + P.precision * res.precision);
    if (words.length < CFG.MINIMO_PALABRAS) score = Math.min(score, CFG.TOPE_MUY_CORTO);
    res.puntuacion = Math.round(Math.max(0, Math.min(100, score)));
    return res;
  }

  function evaluarPrompt(prompt) {
    const p = parsePrompt(prompt);
    const resultados = {};
    CFG.VARIABLES.forEach(v => {
      resultados[v.id] = evaluarVariable(v, p.secciones[v.id]);
    });
    const vals = CFG.VARIABLES.map(v => resultados[v.id].puntuacion);
    const media = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    // Recomendación del Playbook: el Contexto debería ir antes que el Objetivo
    const iC = p.encontradas.indexOf("contexto"), iO = p.encontradas.indexOf("objetivo");
    const ordenContexto = !(iC >= 0 && iO >= 0 && iO < iC);
    return { resultados, media, encontradas: p.encontradas, preambulo: p.preambulo, ordenContexto };
  }

  window.COSTAR = { evaluarPrompt, parsePrompt, norm };
})();
