/* =====================================================================
   LÓGICA DE LA INTERFAZ: identificación, evaluación, historial e informe
   ===================================================================== */
(function () {
  "use strict";
  const CFG = window.COSTAR_CONFIG;
  const VARS = CFG.VARIABLES;
  const UMBRAL = CFG.UMBRAL_RECORDATORIO;
  const KEY = "costar-evaluador-v1";
  const KEY_LANG = "costar-idioma";
  const I18N = window.COSTAR_I18N;
  const $ = id => document.getElementById(id);

  // ---------- Idioma ----------
  let L = (() => {
    try { const g = localStorage.getItem(KEY_LANG); if (g && I18N[g]) return g; } catch (e) {}
    const nav = (navigator.language || "").slice(0, 2).toLowerCase();
    return I18N[nav] ? nav : (CFG.IDIOMA_POR_DEFECTO || "es");
  })();
  function t(key, params) {
    let s = (I18N[L] && I18N[L][key] != null) ? I18N[L][key] : I18N.es[key];
    if (params && typeof s === "string") s = s.replace(/\{(\w+)\}/g, (m, k) => params[k] != null ? params[k] : m);
    return s;
  }
  const tx = obj => (obj && typeof obj === "object" && !Array.isArray(obj)) ? (obj[L] || obj.es) : obj;
  const nom = v => tx(v.nombre);

  function aplicarIdioma() {
    document.documentElement.lang = L;
    document.title = t("titulo");
    document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
    document.querySelectorAll("[data-i18n-html]").forEach(el => el.innerHTML = t(el.dataset.i18nHtml));
    document.querySelectorAll("[data-i18n-title]").forEach(el => el.title = t(el.dataset.i18nTitle));
    document.querySelectorAll("[data-i18n-ph]").forEach(el => el.placeholder = t(el.dataset.i18nPh));
    document.querySelectorAll(".lang button").forEach(b => b.classList.toggle("on", b.dataset.lang === L));
    pintarEstatico();
    if (estado.alumno) {
      actualizarEditor(); pintarHistorial();
      const it = estado.intentos[(intentoVisible || 0) - 1];
      if (it) pintarResultado(it);
    }
  }
  document.querySelectorAll(".lang button").forEach(b => b.addEventListener("click", () => {
    L = b.dataset.lang; try { localStorage.setItem(KEY_LANG, L); } catch (e) {}
    aplicarIdioma();
  }));

  let estado = { alumno: null, intentos: [] };
  let intentoVisible = null;

  // ---------- Persistencia local (solo en este navegador) ----------
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(estado)); } catch (e) {} }
  function cargar() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.alumno) estado = s; } catch (e) {}
  }

  // ---------- Utilidades ----------
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const nivel = p => p < 40 ? 0 : p < UMBRAL ? 1 : p < 80 ? 2 : 3;
  const NIVELES = i => t("niveles")[i];
  const COLOR_NIVEL = ["#dc2626", "#d97706", "#2563eb", "#16a34a"];
  const fechaTxt = iso => new Date(iso).toLocaleString(t("locale"), { dateStyle: "short", timeStyle: "short" });
  function toast(msg) {
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 3200);
  }
  function contarPalabras(t) { return (t.match(/[A-Za-zÀ-ÿ0-9]+/g) || []).length; }

  // ---------- Validación DNI / NIE / pasaporte ----------
  const LETRAS_DNI = "TRWAGMYFPDXBNJZSQVHLCKE";
  function validarDocumento(raw) {
    const v = raw.toUpperCase().replace(/[\s\-.]/g, "");
    if (!v) return { ok: false, msg: t("errDocVacio") };
    if (/^\d{8}[A-Z]$/.test(v)) {
      return LETRAS_DNI[parseInt(v.slice(0, 8), 10) % 23] === v[8]
        ? { ok: true, valor: v } : { ok: false, msg: t("errLetraDni") };
    }
    if (/^[XYZ]\d{7}[A-Z]$/.test(v)) {
      const num = "XYZ".indexOf(v[0]) + v.slice(1, 8);
      return LETRAS_DNI[parseInt(num, 10) % 23] === v[8]
        ? { ok: true, valor: v } : { ok: false, msg: t("errLetraNie") };
    }
    if (/^\d{7,8}$/.test(v) || /^[XYZ]\d{7}$/.test(v)) return { ok: false, msg: t("errFaltaLetra") };
    if (/^[A-Z0-9]{5,15}$/.test(v)) return { ok: true, valor: v, pasaporte: true };
    return { ok: false, msg: t("errFormato") };
  }

  // ---------- Cabecera, guía y pie ----------
  function pintarEstatico() {
    $("logo").innerHTML = VARS.map(v => `<span style="background:${v.color}">${v.letra}</span>`).join("");
    $("guiaGrid").innerHTML = VARS.map(v =>
      `<div class="guide-item" style="border-color:${v.color}"><b style="color:${v.color}">${v.letra} · ${esc(nom(v))}</b>${esc(tx(v.definicion))}</div>`).join("");
    $("consejos").innerHTML = tx(CFG.CONSEJOS).map(c => `<li>${esc(c)}</li>`).join("");
    $("fuente").textContent = tx(CFG.FUENTE);
    $("cita").textContent = CFG.CITA;
    $("citaFuente").textContent = "— " + CFG.CITA_FUENTE;
    $("pie").textContent = `${tx(CFG.ASIGNATURA)} · ${tx(CFG.CENTRO)} · ${t("pie")}`;
  }

  function mostrarApp() {
    $("ident").classList.add("hidden");
    $("app").classList.remove("hidden");
    $("chip").classList.remove("hidden");
    $("chipNombre").textContent = `${estado.alumno.nombre} ${estado.alumno.apellidos}`;
    $("chipDni").textContent = estado.alumno.dni;
    if (!estado.intentos.length) $("guia").open = true;
    const ult = estado.intentos[estado.intentos.length - 1];
    if (ult && !$("prompt").value) $("prompt").value = ult.prompt;
    actualizarEditor();
    pintarHistorial();
    if (ult) pintarResultado(ult);
  }

  // ---------- Identificación ----------
  $("formIdent").addEventListener("submit", e => {
    e.preventDefault();
    const nombre = $("nombre").value.trim(), apellidos = $("apellidos").value.trim();
    const doc = validarDocumento($("dni").value);
    $("errNombre").textContent = nombre ? "" : t("errNombre");
    $("errApellidos").textContent = apellidos ? "" : t("errApellidos");
    $("errDni").textContent = doc.ok ? "" : doc.msg;
    if (!nombre || !apellidos || !doc.ok) return;
    estado = { alumno: { nombre, apellidos, dni: doc.valor, pasaporte: !!doc.pasaporte, inicio: new Date().toISOString() }, intentos: [] };
    guardar();
    mostrarApp();
  });

  $("btnSalir").addEventListener("click", () => {
    const n = estado.intentos.length;
    const msg = n ? t("confirmSalir", { nombre: estado.alumno.nombre, n }) : t("confirmSalirVacio");
    if (!confirm(msg)) return;
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  });

  // ---------- Editor ----------
  $("btnPlantilla").addEventListener("click", () => {
    const ta = $("prompt");
    if (ta.value.trim() && !confirm(t("reemplazarPlantilla"))) return;
    ta.value = tx(CFG.PLANTILLA); ta.focus(); actualizarEditor();
  });
  $("prompt").addEventListener("input", actualizarEditor);

  function actualizarEditor() {
    const txt = $("prompt").value;
    $("contador").textContent = t("palabras", { n: contarPalabras(txt) });
    const enc = window.COSTAR.parsePrompt(txt).encontradas;
    $("detected").innerHTML = `<span class="muted small" style="margin-right:4px">${esc(t("seccionesDetectadas"))}</span>` +
      VARS.map(v => enc.includes(v.id)
        ? `<span class="pill on" style="background:${v.color}">${v.letra} ${esc(nom(v))}</span>`
        : `<span class="pill" title="${esc(t("seccionNoEncontrada"))}">${v.letra} ${esc(nom(v))}</span>`).join("");
    $("intentoLabel").textContent = t("intentoN", { n: estado.intentos.length + 1 });
  }

  // ---------- Evaluación ----------
  $("btnEvaluar").addEventListener("click", () => {
    const prompt = $("prompt").value.trim();
    if (!prompt) { toast(t("escribePrimero")); return; }
    const ev = window.COSTAR.evaluarPrompt(prompt);
    if (!ev.encontradas.length) {
      alert(t("sinEstructura"));
      return;
    }
    const ult = estado.intentos[estado.intentos.length - 1];
    if (ult && ult.prompt === prompt) {
      toast(t("identico"));
      pintarResultado(ult);
      return;
    }
    const intento = {
      n: estado.intentos.length + 1,
      fecha: new Date().toISOString(),
      prompt,
      media: ev.media,
      preambulo: !!ev.preambulo,
      ordenContexto: ev.ordenContexto !== false,
      puntuaciones: {}, detalle: {}
    };
    VARS.forEach(v => {
      const r = ev.resultados[v.id];
      intento.puntuaciones[v.id] = r.puntuacion;
      intento.detalle[v.id] = {
        palabras: r.palabras, presente: r.presente, plantilla: r.plantilla, vagas: r.vagas,
        extension: Math.round(r.extension * 100), cobertura: Math.round(r.cobertura * 100), precision: Math.round(r.precision * 100)
      };
    });
    estado.intentos.push(intento);
    guardar();
    pintarResultado(intento);
    pintarHistorial();
    actualizarEditor();
    if (window.innerWidth < 980) $("resultados").scrollIntoView({ behavior: "smooth" });
  });

  function pintarResultado(it) {
    intentoVisible = it.n;
    $("resEmpty").classList.add("hidden");
    const body = $("resBody"); body.classList.remove("hidden");
    const prev = estado.intentos[it.n - 2];
    const lvG = nivel(it.media);

    const avisos = [];
    const faltan = VARS.filter(v => !it.detalle[v.id].presente);
    if (faltan.length) avisos.push(t("avisoFaltan", { v: faltan.map(v => esc(nom(v))).join(", ") }));
    const plant = VARS.filter(v => it.detalle[v.id].plantilla);
    if (plant.length) avisos.push(t("avisoPlantilla", { v: plant.map(v => esc(nom(v))).join(", ") }));
    const vag = VARS.filter(v => it.detalle[v.id].vagas.length);
    if (vag.length) avisos.push(t("avisoVagas", { v: [...new Set(vag.flatMap(v => it.detalle[v.id].vagas))].map(w => L === "en" ? `“${esc(w)}”` : `«${esc(w)}»`).join(", ") }));
    if (it.preambulo) avisos.push(esc(t("avisoPreambulo")));
    const infos = [];
    if (it.ordenContexto === false) infos.push(esc(t("avisoOrden")));

    const bajo = VARS.filter(v => it.puntuaciones[v.id] < UMBRAL).length;
    const resumen = bajo ? t("variablesBajo", { n: bajo, u: UMBRAL }) : t("todasSuperan", { u: UMBRAL });

    body.innerHTML = `
      <div class="res-head">
        <div class="gauge" style="--p:${it.media};--c:${COLOR_NIVEL[lvG]}"><div>${it.media}%</div></div>
        <div class="res-title">
          <h2>${esc(t("intentoTitulo", { n: it.n, nivel: NIVELES(lvG) }))}</h2>
          <small>${fechaTxt(it.fecha)} · ${esc(t("completitudMedia"))}${prev ? ` · ${difTxt(it.media - prev.media)} ${esc(t("respectoAnterior"))}` : ""}</small>
          <small><b style="color:${bajo ? "#b45309" : "#166534"}">${resumen}</b></small>
        </div>
      </div>
      ${avisos.length || infos.length ? `<ul class="alerts">${avisos.map(a => `<li>${a}</li>`).join("")}${infos.map(a => `<li class="info">${a}</li>`).join("")}</ul>` : ""}
      <div class="vars">${VARS.map(v => tarjetaVariable(v, it, prev)).join("")}</div>`;
  }

  function difTxt(d) {
    if (d > 0) return `<span class="delta up">▲ +${d}</span>`;
    if (d < 0) return `<span class="delta down">▼ ${d}</span>`;
    return `<span class="delta">= 0</span>`;
  }

  function tarjetaVariable(v, it, prev) {
    const p = it.puntuaciones[v.id], d = it.detalle[v.id], lv = nivel(p);
    const delta = prev ? difTxt(p - prev.puntuaciones[v.id]) : "";
    const rec = p < UMBRAL ? `
      <div class="reminder">
        <p><b>${esc(t("recuerdaQue", { v: nom(v) }))}</b> ${esc(tx(v.definicion))}</p>
        <p style="margin-top:6px"><b>${esc(t("deberiaIncluir"))}</b></p>
        <ul>${tx(v.recordatorio).map(r => `<li>${esc(r)}</li>`).join("")}</ul>
      </div>` : "";
    return `
      <div class="var">
        <div class="var-top">
          <div class="letter" style="background:${v.color}">${v.letra}</div>
          <div><div class="var-name">${esc(nom(v))}</div></div>
          <span class="level lv-${lv}">${NIVELES(lv)}</span>
          <div class="var-score">${p}%${delta}</div>
        </div>
        <div class="bar"><i style="width:${p}%;background:${v.color}"></i></div>
        <div class="sub">
          <span>${esc(t("palabrasLbl"))}: <b>${d.palabras}</b></span>
          <span>${esc(t("extension"))}: <b>${d.extension}%</b></span>
          <span>${esc(t("cobertura"))}: <b>${d.cobertura}%</b></span>
          <span>${esc(t("precision"))}: <b>${d.precision}%</b></span>
        </div>
        ${rec}
      </div>`;
  }

  // ---------- Historial ----------
  function pintarHistorial() {
    const h = $("historial");
    if (!estado.intentos.length) { h.classList.add("hidden"); return; }
    h.classList.remove("hidden");
    const cab = `<tr><th>${esc(t("intento"))}</th>${VARS.map(v => `<th title="${esc(nom(v))}" style="color:${v.color}">${v.letra}<br><span style="font-weight:500;text-transform:none">${esc(nom(v))}</span></th>`).join("")}<th>${esc(t("media"))}</th><th></th></tr>`;
    const filas = estado.intentos.slice().reverse().map(it => `
      <tr class="${it.n === intentoVisible ? "sel" : ""}">
        <td><b>#${it.n}</b><br><span class="muted small">${fechaTxt(it.fecha)}</span></td>
        ${VARS.map(v => celda(it.puntuaciones[v.id])).join("")}
        <td>${celda(it.media, true)}</td>
        <td><button class="btn btn-light btn-sm" data-ver="${it.n}">${esc(t("ver"))}</button>
            <button class="btn btn-light btn-sm" data-rec="${it.n}">${esc(t("recuperar"))}</button></td>
      </tr>`).join("");
    $("tablaHist").innerHTML = cab + filas;
  }
  function celda(p, raw) { const c = `<span class="cell c${nivel(p)}">${p}%</span>`; return raw ? c : `<td>${c}</td>`; }
  $("tablaHist").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.ver) {
      pintarResultado(estado.intentos[+b.dataset.ver - 1]); pintarHistorial();
      $("resultados").scrollIntoView({ behavior: "smooth" });
    }
    if (b.dataset.rec) {
      const it = estado.intentos[+b.dataset.rec - 1];
      if ($("prompt").value.trim() && $("prompt").value.trim() !== it.prompt &&
          !confirm(t("confirmRecuperar", { n: it.n }))) return;
      $("prompt").value = it.prompt; actualizarEditor();
      $("prompt").scrollIntoView({ behavior: "smooth" });
      toast(t("recuperado", { n: it.n }));
    }
  });

  // ---------- Informe PDF ----------
  function pdfSafe(s) {
    return String(s)
      .replace(/[–—−]/g, "-").replace(/[“”„]/g, '"').replace(/[‘’‚]/g, "'")
      .replace(/…/g, "...").replace(/[•●▪‣]/g, "-").replace(/€/g, "EUR")
      .replace(/\t/g, "    ").replace(/[^\n\x20-\x7E\xA0-\xFF]/g, "");
  }
  const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));

  $("btnInforme").addEventListener("click", generarInforme);

  function generarInforme() {
    if (!window.jspdf) { alert(t("pdfNoCarga")); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210, M = 16, CW = W - 2 * M;
    const a = estado.alumno, its = estado.intentos;
    let y = 0;
    const ahora = new Date();

    // Cabecera
    doc.setFillColor(30, 41, 59); doc.rect(0, 0, W, 30, "F");
    VARS.forEach((v, i) => { doc.setFillColor(...hex2rgb(v.color)); doc.roundedRect(M + i * 7.5, 8, 6.5, 7, 1, 1, "F");
      doc.setTextColor(255); doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.text(v.letra, M + i * 7.5 + 3.25, 13, { align: "center" }); });
    doc.setFontSize(15); doc.text(pdfSafe(t("pdfTitulo")), M + 50, 13.5);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9.5);
    doc.text(pdfSafe(`${tx(CFG.ASIGNATURA)} · ${tx(CFG.CENTRO)}`), M + 50, 20);
    y = 40;

    // Identificación
    doc.setTextColor(15, 23, 42);
    doc.autoTable({
      startY: y, margin: { left: M, right: M }, theme: "plain",
      styles: { fontSize: 10, cellPadding: 1.6 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 46, textColor: [100, 116, 139] } },
      body: [
        [t("pdfAlumno"), pdfSafe(`${a.nombre} ${a.apellidos}`)],
        [a.pasaporte ? t("pdfPasaporte") : t("pdfDni"), a.dni],
        [t("pdfGenerado"), ahora.toLocaleString(t("locale"))],
        [t("pdfNumIntentos"), String(its.length)],
        ...(its.length ? [
          [t("pdfMediaPrimero"), `${its[0].media}%`],
          [t("pdfMediaUltimo"), `${its[its.length - 1].media}%`],
          [t("pdfMejor"), t("pdfMejorDet", { m: Math.max(...its.map(i => i.media)), n: its.reduce((b, i) => i.media > b.media ? i : b).n })]
        ] : [])
      ]
    });
    y = doc.lastAutoTable.finalY + 8;

    if (!its.length) {
      doc.setFontSize(11); doc.text(pdfSafe(t("pdfSinIntentos")), M, y);
    } else {
      // Tabla resumen
      doc.setFont("helvetica", "bold"); doc.setFontSize(12.5); doc.text(pdfSafe(t("pdfEvolucion")), M, y); y += 3;
      doc.autoTable({
        startY: y, margin: { left: M, right: M },
        head: [[t("intento"), t("pdfFecha"), ...VARS.map(v => `${v.letra} · ${nom(v)}`), t("media")]],
        body: its.map(it => [`#${it.n}`, fechaTxt(it.fecha), ...VARS.map(v => `${it.puntuaciones[v.id]}%`), `${it.media}%`]),
        styles: { fontSize: 8.5, halign: "center", cellPadding: 1.8 },
        headStyles: { fillColor: [30, 41, 59], fontSize: 7.8 },
        columnStyles: { 0: { halign: "left", fontStyle: "bold" }, 1: { halign: "left", cellWidth: 26 } },
        didParseCell: d => {
          if (d.section === "body" && d.column.index >= 2) {
            const p = parseInt(d.cell.raw, 10);
            const fills = [[254, 226, 226], [255, 237, 213], [219, 234, 254], [220, 252, 231]];
            d.cell.styles.fillColor = fills[nivel(p)];
            if (d.column.index === VARS.length + 2) d.cell.styles.fontStyle = "bold";
          }
        }
      });
      y = doc.lastAutoTable.finalY + 4;
      doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(100, 116, 139);
      doc.text(pdfSafe(t("pdfLeyenda", { u: UMBRAL, u1: UMBRAL - 1 })), M, y);
      y += 10;

      // Detalle de cada intento
      const lineH = 4.1;
      its.forEach(it => {
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setDrawColor(226, 232, 240); doc.line(M, y - 4, W - M, y - 4);
        doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.setFontSize(12);
        doc.text(pdfSafe(t("pdfIntento", { n: it.n })), M, y);
        doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(100, 116, 139);
        doc.text(pdfSafe(t("pdfMediaNivel", { f: fechaTxt(it.fecha), m: it.media, nivel: NIVELES(nivel(it.media)) })), M + 36, y);
        y += 3;
        doc.autoTable({
          startY: y, margin: { left: M, right: M },
          head: [[t("pdfVariable"), t("pdfPuntuacion"), t("pdfPalabras"), t("pdfExtension"), t("pdfCobertura"), t("pdfPrecision")]],
          body: VARS.map(v => { const d = it.detalle[v.id]; return [`${v.letra} · ${nom(v)}`, `${it.puntuaciones[v.id]}%`, d.palabras, `${d.extension}%`, `${d.cobertura}%`, `${d.precision}%`]; }),
          styles: { fontSize: 8.3, halign: "center", cellPadding: 1.3 },
          headStyles: { fillColor: [241, 245, 249], textColor: [51, 65, 85], fontSize: 8 },
          columnStyles: { 0: { halign: "left", fontStyle: "bold" } },
          didParseCell: d => {
            if (d.section === "body" && d.column.index === 1) {
              const p = parseInt(d.cell.raw, 10);
              d.cell.styles.textColor = hex2rgb(COLOR_NIVEL[nivel(p)]); d.cell.styles.fontStyle = "bold";
            }
          }
        });
        y = doc.lastAutoTable.finalY + 6;
        doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(15, 23, 42);
        doc.text(pdfSafe(t("pdfPromptEnviado")), M, y); y += 5;
        doc.setFont("courier", "normal"); doc.setFontSize(8.6); doc.setTextColor(30, 41, 59);
        const lines = doc.splitTextToSize(pdfSafe(it.prompt), CW - 6);
        let blockStart = y - 3.5;
        lines.forEach((ln, idx) => {
          if (y > 280) {
            doc.setDrawColor(203, 213, 225); doc.line(M, blockStart, M, y - 3);
            doc.addPage(); y = 20; blockStart = y - 3.5;
            doc.setFont("courier", "normal"); doc.setFontSize(8.6); doc.setTextColor(30, 41, 59);
          }
          doc.text(ln, M + 4, y); y += lineH;
        });
        doc.setDrawColor(203, 213, 225); doc.setLineWidth(0.6); doc.line(M, blockStart, M, y - 3); doc.setLineWidth(0.2);
        y += 12;
      });
    }

    // Pie con numeración
    const n = doc.getNumberOfPages();
    for (let i = 1; i <= n; i++) {
      doc.setPage(i); doc.setFont("helvetica", "normal"); doc.setFontSize(7.8); doc.setTextColor(148, 163, 184);
      doc.text(pdfSafe(`${a.nombre} ${a.apellidos} · ${a.dni} · ${t("pie")}`), M, 290);
      doc.text(pdfSafe(t("pdfPagina", { i, n })), W - M, 290, { align: "right" });
    }

    const slug = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
    const f = ahora.toISOString().slice(0, 10);
    doc.save(`${t("pdfArchivo")}_${slug(a.apellidos)}_${slug(a.nombre)}_${f}.pdf`);
    toast(t("pdfDescargado"));
  }

  // ---------- Arranque ----------
  cargar();
  aplicarIdioma();
  if (estado.alumno) mostrarApp();
})();
