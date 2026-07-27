/* ==========================================================================
   === SCRIPT.JS UNIFIÉ : PARTIE 1 SUR 6 === [ REGISTRES & MATRIX DATABASE ] ===
   ========================================================================== */
let currentActiveTab = 'login';
let activeServerId = '7dtd_core';
let isLoginEnglishActive = false;
let isDescEnglishActive = false;

let qbcDatabase = {
    '7dtd_core': {
        name: "QBC FLAGGARD PVE 3.0 (CORE)",
        loginLines: [
            { symbol: "❤", symbol_start: "", symbol_en_start: "", symbol_en_end: "", text: "QBC FLAGGARD PVE 3.0 +MODS BIENVENUE ❤", text_en: "", color: "ff0000", color_en: "ff0000", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} },
            { symbol: "☣", symbol_start: "", symbol_en_start: "", symbol_en_end: "", text: "RÈGLEMENTS :", text_en: "", color: "ffff00", color_en: "ffff00", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} },
            { symbol: "✗", symbol_start: "", symbol_en_start: "", symbol_en_end: "", text: "1- Pas de landclaim au POI Carl's Corn Farm.", text_en: "", color: "00ff00", color_en: "00ff00", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} },
            { symbol: "✗", symbol_start: "", symbol_en_start: "", symbol_en_end: "", text: "2- Vol de base interdit (sécurisez vos coffres).", text_en: "", color: "00ff00", color_en: "00ff00", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} },
            { symbol: "⏰", symbol_start: "", symbol_en_start: "", symbol_en_end: "", text: "REBOOTS: 05:00 & 17:00 (EST/QC)", text_en: "", color: "F88379", color_en: "F88379", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} }
        ],
        descLines: [
            { symbol: "•", symbol_start: "", symbol_en_start: "", symbol_en_end: "", text: "Bienvenue sur l'infrastructure de Varennes.", text_en: "", color: "00ff00", color_en: "00ff00", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} },
            { symbol: "•", symbol_start: "", symbol_en_start: "", symbol_en_end: "", text: "Serveur PvE québécois haute performance.", text_en: "", color: "ffffff", color_en: "ffffff", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} }
        ]
    }
};

const colorPalette = [
    { hex: "ff0000", name: "Rouge" }, { hex: "00ff00", name: "Vert" }, { hex: "ffff00", name: "Jaune" },
    { hex: "00ffff", name: "Cyan" }, { hex: "ffaa00", name: "Orange" }, { hex: "F88379", name: "Rose" }, { hex: "ffffff", name: "Blanc" }
];

const symbolPalette = [
    { char: "", name: "(Aucun)" }, { char: "•", name: "Point" }, { char: "❤", name: "Coeur" },
    { char: "☣", name: "Biohazard" }, { char: "⚠️", name: "Alerte" }, { char: "🚀", name: "Téléport" }, { char: "✗", name: "Croix" },
    { char: "⚔️", name: "Épées" }, { char: "⚙️", name: "Système" }, { char: "💎", name: "Diamant" }, { char: "⏰", name: "Reboot" }
];
/* ==========================================================================
   === SCRIPT.JS UNIFIÉ : PARTIE 2 SUR 6 === [ INITIALISATION ABSOLUE ]    ===
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    window.loadFromLocalStorage();
    const savedZoom = localStorage.getItem("qbc_preferred_zoom") || "80";
    window.changeUiZoom(savedZoom);
    const selectZoomEl = document.getElementById("uiZoomSelect");
    if (selectZoomEl) selectZoomEl.value = savedZoom;
    
    const selectServerEl = document.getElementById('serverSelect');
    if (selectServerEl) {
        selectServerEl.innerHTML = "";
        Object.keys(qbcDatabase).forEach(id => {
            const opt = document.createElement('option');
            opt.value = id;
            opt.innerText = qbcDatabase[id].name || id.toUpperCase();
            selectServerEl.appendChild(opt);
        });
        selectServerEl.value = activeServerId;
        selectServerEl.addEventListener('change', (e) => {
            activeServerId = e.target.value;
            window.refreshAllViews();
        });
    }
    
    window.refreshAllViews();
});

// COMMUTATEURS GLOBAUX DE TRADUCTION ANGLAISE EN VARIABLE DIRECTE
window.toggleLoginEnglish = function(checked) { 
    isLoginEnglishActive = checked; 
    const lines = qbcDatabase[activeServerId]?.loginLines || [];
    lines.forEach(line => { line.show_english = checked; });
    window.renderFormLines(); 
};

window.toggleDescEnglish = function(checked) { 
    isDescEnglishActive = checked; 
    const lines = qbcDatabase[activeServerId]?.descLines || [];
    lines.forEach(line => { line.show_english = checked; });
    window.renderDescFormLines(); 
};

window.refreshAllViews = function() {
    if (currentActiveTab === 'login') window.renderFormLines(); else window.renderDescFormLines();
};
/* ==========================================================================
   === SCRIPT.JS UNIFIÉ : PARTIE 3 SUR 6 === [ COMMANDE DES LIGNES & COPIE ] ===
   ========================================================================== */
window.qbcCopierLigneFrançaise = function(isDesc, index) {
    const list = isDesc ? qbcDatabase[activeServerId]?.descLines : qbcDatabase[activeServerId]?.loginLines;
    if (!list || !list[index]) return;
    let txt = list[index].text ? list[index].text.trim() : "";
    if (txt === "") return;
    const numMatch = txt.match(/^([0-9]+-\s*)/);
    if (numMatch && numMatch.length > 0) { txt = txt.substring(numMatch.length).trim(); }
    const dummy = document.createElement("textarea"); document.body.appendChild(dummy);
    dummy.value = txt; dummy.select(); document.execCommand("copy"); dummy.remove();
};

window.qbcCollerLigneAnglaise = function(isDesc, index) {
    const list = isDesc ? qbcDatabase[activeServerId]?.descLines : qbcDatabase[activeServerId]?.loginLines;
    if (!list || !list[index]) return;
    navigator.clipboard.readText().then(texteCopie => {
        if (texteCopie && texteCopie.trim() !== "") {
            list[index].text_en = texteCopie.trim(); list[index].show_english = true;
            window.saveToLocalStorage(); window.refreshAllViews();
        }
    }).catch(err => { alert("Fais un Ctrl + V manuel dans la case EN !"); });
};

window.toggleLineEnglishIndividual = function(isDesc, i) { 
    const list = isDesc ? qbcDatabase[activeServerId]?.descLines : qbcDatabase[activeServerId]?.loginLines; 
    if (!list || !list[i]) return;
    list[i].show_english = !list[i].show_english; 
    window.refreshAllViews();
};

window.moveLine = function(isDesc, i, d) { 
    const list = isDesc ? qbcDatabase[activeServerId]?.descLines : qbcDatabase[activeServerId]?.loginLines; 
    if (!list) return; const t = i + d; if (t < 0 || t >= list.length) return; 
    const tmp = list[i]; list[i] = list[t]; list[t] = tmp; 
    window.refreshAllViews();
};

window.insertLineAt = function(isDesc, i) { 
    const list = isDesc ? qbcDatabase[activeServerId]?.descLines : qbcDatabase[activeServerId]?.loginLines; 
    if (!list) return;
    list.splice(i, 0, { symbol: "•", symbol_start: "", text: "MESSAGE ÉDITABLE", text_en: "", color: "ffffff", color_en: "ffffff", border_style: "none", show_english: false }); 
    window.refreshAllViews();
};
/* ==========================================================================
   === SCRIPT.JS UNIFIÉ : PARTIE 4 SUR 6 === [ CONSTRUCTEUR DE LA GRILLE ] ===
   ========================================================================== */
function buildFormRows(isDesc, currentLines, isGlobalEnglish) {
    const container = document.getElementById(isDesc ? 'descLinesContainer' : 'linesContainer'); 
    if (!container) return; container.innerHTML = "";
    
    currentLines.forEach((line, index) => {
        const div = document.createElement('div'); 
        const isEngVisible = line.show_english || isGlobalEnglish;
        div.className = "line-item" + (line.border_style && line.border_style !== "none" ? " has-double-border" : "");
        
        if (line.symbol_start === undefined) line.symbol_start = "";
        if (line.symbol_en_start === undefined) line.symbol_en_start = "";
        if (line.symbol_en_end === undefined) line.symbol_en_end = "";
        if (line.color_en === undefined) line.color_en = line.color || "ffffff";
        
        let symStartSel = `<select class="line-select" style="width:105px;" onchange="updateLineSymbolStart(${isDesc}, ${index}, this.value)">`;
        symbolPalette.forEach(s => symStartSel += `<option value="${s.char}" ${s.char === line.symbol_start ? "selected" : ""}>FR: ${s.name || 'Aucun'}</option>`); symStartSel += `</select>`;
        
        let symSel = `<select class="line-select" style="width:100px;" onchange="updateLineSymbol(${isDesc}, ${index}, this.value)">`;
        symbolPalette.forEach(s => symSel += `<option value="${s.char}" ${s.char === line.symbol ? "selected" : ""}>Fin: ${s.name || 'Aucun'}</option>`); symSel += `</select>`;
        
        let colSel = `<select class="line-select" style="width:90px;" onchange="updateLineColor(${isDesc}, ${index}, this.value)">`;
        colorPalette.forEach(c => colSel += `<option value="${c.hex}" ${c.hex === line.color ? "selected" : ""}>${c.name}</option>`); colSel += `</select>`;
        
        let symEnStartSel = `<select class="line-select" style="width:105px;" onchange="updateLineSymbolEnStart(${isDesc}, ${index}, this.value)">`;
        symbolPalette.forEach(s => symEnStartSel += `<option value="${s.char}" ${s.char === line.symbol_en_start ? "selected" : ""}>EN: ${s.name || 'Aucun'}</option>`); symEnStartSel += `</select>`;
        
        let symEnEndSel = `<select class="line-select" style="width:100px;" onchange="updateLineSymbolEnEnd(${isDesc}, ${index}, this.value)">`;
        symbolPalette.forEach(s => symEnEndSel += `<option value="${s.char}" ${s.char === line.symbol_en_end ? "selected" : ""}>EN Fin: ${s.name || 'Aucun'}</option>`); symEnEndSel += `</select>`;
        
        let colEnSel = `<select class="line-select" style="width:95px; border-color:#38bdf8;" onchange="updateLineColorEn(${isDesc}, ${index}, this.value)">`;
        colorPalette.forEach(c => colEnSel += `<option value="${c.hex}" ${c.hex === line.color_en ? "selected" : ""}>EN ${c.name}</option>`); colEnSel += `</select>`;
        
        let enRow = ""; 
        if (isDesc || index > 0) { 
            const displayStyle = isEngVisible ? "display: block !important;" : "display: none !important;";
            enRow = `<div class="eng-input-box" style="width:100%; ${displayStyle}"><div class="input-row" style="margin-top:6px; display:flex; width:100%; align-items:center;"><span style="font-size:11px; color:#38bdf8; width:30px; font-weight:bold;">EN:</span><input type="text" class="input-line" style="border-left:4px dashed #${line.color_en}; flex-grow:1;" value="${line.text_en || ''}" oninput="updateLineTextEN(${isDesc}, ${index}, this.value)" placeholder="Anglais..." /></div></div>`; 
        }
        
        let transBtn = (isDesc || index > 0) ? `<button type="button" class="double-line-btn" onclick="window.qbcCopierLigneFrançaise(${isDesc}, ${index})">📋 FR</button><button type="button" class="double-line-btn" onclick="window.qbcCollerLigneAnglaise(${isDesc}, ${index})">📥 EN</button><button type="button" class="double-line-btn ${line.show_english?'active':''}" onclick="window.toggleLineEnglishIndividual(${isDesc}, ${index})">🌐 EN</button>` : "";
        
        let upDis = index === 0 ? "disabled style='opacity:0.3;'" : "", downDis = index === currentLines.length - 1 ? "disabled style='opacity:0.3;'" : "";
        let lineControlsBlock = `
            <button type="button" class="order-btn" ${upDis} onclick="window.moveLine(${isDesc}, ${index}, -1)">🔼</button>
            <button type="button" class="order-btn" ${downDis} onclick="window.moveLine(${isDesc}, ${index}, 1)">🔽</button>
            <button type="button" class="btn-insert-here" onclick="window.insertLineAt(${isDesc}, ${index + 1})">➕ INSÉRER</button>
        `;

        div.innerHTML = `<div class="line-controls"><span class="line-number">L.${index+1}</span> ${lineControlsBlock} ${symStartSel} ${symSel} ${colSel} <span style="color:#4b5563;">|</span> ${symEnStartSel} ${symEnEndSel} ${colEnSel} ${transBtn}<button type="button" class="btn-action" style="color:#f87171; margin-left:auto;" onclick="${isDesc?'window.removeDescLine':'window.removeLine'}(${index})">❌</button></div><div class="line-inputs-block"><div class="input-row" style="display:flex; width:100%; align-items:center;"><span style="font-size:11px; color:#34d399; width:30px; font-weight:bold;">FR:</span><input type="text" class="input-line" style="border-left:4px solid #${line.color}; flex-grow:1;" value="${line.text || ''}" oninput="updateLineTextFR(${isDesc}, ${index}, this.value)" placeholder="Texte..." /></div>${enRow}</div>`;
        container.appendChild(div);
    }); 
    processAndCompileQBC();
}

window.renderFormLines = function() { 
    const toggleEl = document.getElementById('loginEnglishToggle');
    buildFormRows(false, qbcDatabase[activeServerId]?.loginLines || [], toggleEl ? toggleEl.checked : false); 
};

window.renderDescFormLines = function() { 
    const toggleEl = document.getElementById('descEnglishToggle');
    buildFormRows(true, qbcDatabase[activeServerId]?.descLines || [], toggleEl ? toggleEl.checked : false); 
};
/* ==========================================================================
   === SCRIPT.JS UNIFIÉ : PARTIE 5 SUR 6 === [ ENCODAGE TEXTMESHPRO & APERÇU ] ===
   ========================================================================== */
function processAndCompileQBC() {
    const isLogin = (currentActiveTab === 'login'); 
    
    if (!activeServerId || typeof activeServerId !== 'string' || !qbcDatabase[activeServerId]) {
        activeServerId = '7dtd_core';
    }
    
    const serverData = qbcDatabase[activeServerId];
    if (!serverData) return;
    
    const currentLines = isLogin ? serverData.loginLines : serverData.descLines;
    if (!currentLines || !Array.isArray(currentLines)) return; 
    
    const isGlobalEnglish = isLogin ? isLoginEnglishActive : isDescEnglishActive; 
    const limit = isLogin ? 3500 : 4000; 
    let masterPayload = "";
    
    currentLines.forEach((line, index) => {
        if (!line) return;
        let textFR = (line.text || "").trim(); 
        let textEN = (line.text_en || "").trim();
        
        if (line.symbol_start === undefined) line.symbol_start = "";
        if (line.symbol === undefined) line.symbol = "";
        if (line.symbol_en_start === undefined) line.symbol_en_start = "";
        if (line.symbol_en_end === undefined) line.symbol_en_end = "";
        if (line.color_en === undefined) line.color_en = line.color || "ffffff";

        // --- COMPILATION DU BLOC FRANÇAIS ---
        let fullFR = textFR;
        if (line.symbol_start && line.symbol_start.trim() !== "") fullFR = line.symbol_start + " " + fullFR;
        if (line.symbol && line.symbol.trim() !== "") fullFR = fullFR + " " + line.symbol;
        if (line.style_fr && line.style_fr.u) fullFR = "[u]" + fullFR + "[/u]"; 
        if (line.style_fr && line.style_fr.b) fullFR = "[b]" + fullFR + "[/b]";
        let chunkFR = "[" + (line.color || "ffffff") + "]" + fullFR + "[-]"; 
        const isEnglishActive = line.show_english || isGlobalEnglish;
        
        // --- COMPILATION DU BLOC ANGLAIS CROISÉ ---
        if (isEnglishActive && textEN !== "" && !(isLogin && index === 0)) {
            let fullEN = textEN;
            if (line.symbol_en_start && line.symbol_en_start.trim() !== "") fullEN = line.symbol_en_start + " " + fullEN;
            if (line.symbol_en_end && line.symbol_en_end.trim() !== "") fullEN = fullEN + " " + line.symbol_en_end;
            if (line.style_en && line.style_en.u) fullEN = "[u]" + fullEN + "[/u]"; 
            if (line.style_en && line.style_en.b) fullEN = "[b]" + fullEN + "[/b]";
            
            masterPayload += chunkFR + " | [" + line.color_en + "]" + fullEN + "[-]";
        } else { 
            masterPayload += chunkFR; 
        }
        
        if (line.border_style && line.border_style !== "none") {
            let lineChar = "═";
            if (line.border_style === "single") lineChar = "─";
            if (line.border_style === "dash") lineChar = "-";
            if (line.border_style === "dot") lineChar = ".";
            let separatorBlock = lineChar.repeat(64);
            masterPayload += "\\n[" + (line.color || "ffffff") + "]" + separatorBlock + "[-]";
        }
        if (index < currentLines.length - 1) masterPayload += "\\n";
    });
    
    // INJECTION DE SÉCURITÉ DANS LES DEUX BLOCS NOIRS DU PANNEAU INFERIEUR
    const outEl = document.getElementById('masterOutput'); 
    if (outEl) outEl.value = masterPayload; 
    
    let htmlContent = masterPayload.replace(/\\n/g, '<br>')
                                   .replace(/\[([0-9a-fA-F]{6})\](.*?)\[-\]/g, '<span style="color:#$1;">$2</span>')
                                   .replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>')
                                   .replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>');
                                   
    const prevEl = document.getElementById('preview'); 
    if (prevEl) prevEl.innerHTML = htmlContent; 
    
    const total = masterPayload.length;
    const counterEl = document.getElementById(isLogin ? 'totalCharCounter' : 'totalDescCharCounter');
    const alertEl = document.getElementById(isLogin ? 'alertBox' : 'descAlertBox');
    
    if (counterEl) { 
        counterEl.innerText = "TOTAL : " + total + " / " + limit + " CHARS"; 
        counterEl.style.color = total > limit ? "#f87171" : "#34d399"; 
    }
    if (alertEl) alertEl.style.display = total > limit ? "block" : "none";
}
/* ==========================================================================
   === SCRIPT.JS UNIFIÉ : PARTIE 6 SUR 6 === [ MÉMOIRE & INTERRUPTEURS ]   ===
   ========================================================================== */
window.saveToLocalStorage = saveToLocalStorage;
window.loadFromLocalStorage = loadFromLocalStorage;

function updateLineTextFR(isDesc, i, v) { if(isDesc) qbcDatabase[activeServerId].descLines[i].text = v; else qbcDatabase[activeServerId].loginLines[i].text = v; saveToLocalStorage(); processAndCompileQBC(); }
function updateLineTextEN(isDesc, i, v) { if(isDesc) qbcDatabase[activeServerId].descLines[i].text_en = v; else qbcDatabase[activeServerId].loginLines[i].text_en = v; if(v.trim()!=="") { if(isDesc) qbcDatabase[activeServerId].descLines[i].show_english=true; else qbcDatabase[activeServerId].loginLines[i].show_english=true; } saveToLocalStorage(); processAndCompileQBC(); }
function updateLineSymbol(isDesc, i, v) { if(isDesc) qbcDatabase[activeServerId].descLines[i].symbol = v; else qbcDatabase[activeServerId].loginLines[i].symbol = v; processAndCompileQBC(); }
function updateLineSymbolStart(isDesc, i, v) { if(isDesc) qbcDatabase[activeServerId].descLines[i].symbol_start = v; else qbcDatabase[activeServerId].loginLines[i].symbol_start = v; processAndCompileQBC(); }
function updateLineSymbolEnStart(isDesc, i, v) { if(isDesc) qbcDatabase[activeServerId].descLines[i].symbol_en_start = v; else qbcDatabase[activeServerId].loginLines[i].symbol_en_start = v; processAndCompileQBC(); }
function updateLineSymbolEnEnd(isDesc, i, v) { if(isDesc) qbcDatabase[activeServerId].descLines[i].symbol_en_end = v; else qbcDatabase[activeServerId].loginLines[i].symbol_en_end = v; processAndCompileQBC(); }
function updateLineColor(isDesc, i, h) { if(isDesc) qbcDatabase[activeServerId].descLines[i].color = h; else qbcDatabase[activeServerId].loginLines[i].color = h; window.refreshAllViews(); }
function updateLineColorEn(isDesc, i, h) { if(isDesc) qbcDatabase[activeServerId].descLines[i].color_en = h; else qbcDatabase[activeServerId].loginLines[i].color_en = h; window.refreshAllViews(); }

window.addNewLine = function() { qbcDatabase[activeServerId].loginLines.push({ symbol: "•", symbol_start: "", text: "NOUVEAU MESSAGE", text_en: "", color: "ffffff", color_en: "ffffff", border_style: "none", show_english: false }); saveToLocalStorage(); window.renderFormLines(); };
window.removeLine = function(i) { if(qbcDatabase[activeServerId].loginLines.length <= 1) return; qbcDatabase[activeServerId].loginLines.splice(i, 1); saveToLocalStorage(); window.renderFormLines(); };
window.addNewDescLine = function() { qbcDatabase[activeServerId].descLines.push({ symbol: "•", symbol_start: "", text: "NOUVELLE DESCRIPTION", text_en: "", color: "ffffff", color_en: "ffffff", border_style: "none", show_english: false }); saveToLocalStorage(); window.renderDescFormLines(); };
window.removeDescLine = function(i) { if(qbcDatabase[activeServerId].descLines.length <= 1) return; qbcDatabase[activeServerId].descLines.splice(i, 1); saveToLocalStorage(); window.renderDescFormLines(); };

// SOUDURE DIRECTE ET ABSOLUE PAR INTERRUPTEUR DE VARIABLE GLOBALE
window.switchTab = function(t) { 
    currentActiveTab = t; 
    
    const btnLogin = document.getElementById('tab-login-btn');
    const btnDesc = document.getElementById('tab-desc-btn');
    if (btnLogin) btnLogin.classList.toggle('active', t === 'login');
    if (btnDesc) btnDesc.classList.toggle('active', t === 'desc');
    
    const containerLogin = document.getElementById('content-login');
    const containerDesc = document.getElementById('content-desc');
    if (containerLogin) containerLogin.style.display = (t === 'login') ? 'block' : 'none';
    if (containerDesc) containerDesc.style.display = (t === 'desc') ? 'block' : 'none';
    
    window.refreshAllViews(); 
};

window.importQbcConfig = function(event) {
    const files = event.target.files; if (!files || files.length === 0) return; const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsedData = JSON.parse(e.target.result); const serverIds = Object.keys(parsedData); if (serverIds.length === 0) return;
            qbcDatabase = parsedData; activeServerId = serverIds[0]; saveToLocalStorage(); 
            const selectServerEl = document.getElementById('serverSelect');
            if (selectServerEl) {
                selectServerEl.innerHTML = "";
                serverIds.forEach(id => {
                    const opt = document.createElement('option'); opt.value = id; opt.innerText = qbcDatabase[id].name || id.toUpperCase(); selectServerEl.appendChild(opt);
                });
                selectServerEl.value = activeServerId;
            }
            window.refreshAllViews(); alert("IMPORTATION RÉUSSIE !");
        } catch (err) { alert("ERREUR LECTURE JSON"); }
    }; reader.readAsText(files.item(0));
};

window.changeUiZoom = function(zoomValue) {
    document.body.style.zoom = zoomValue + "%";
    localStorage.setItem("qbc_preferred_zoom", zoomValue);
};

window.copyMasterPayload = function() { 
    const output = document.getElementById('masterOutput'); 
    if (output) { output.select(); document.execCommand('copy'); alert('CHAINE COPIEE AVEC SUCCES'); }
};

window.editCurrentServerName = function() {
    const n = prompt("NOUVEAU NOM :", qbcDatabase[activeServerId].name); if (!n || n.trim() === "") return;
    qbcDatabase[activeServerId].name = n.toUpperCase();
    const selectServerEl = document.getElementById('serverSelect');
    if (selectServerEl) selectServerEl.options[selectServerEl.selectedIndex].innerText = n.toUpperCase();
    processAndCompileQBC();
};

window.createNewServerInstance = function() {
    const n = prompt("NOM SERVEUR :"); if (!n || n.trim() === "") return; 
    const id = "7dtd_" + Math.random().toString(36).substring(2, 6);
    qbcDatabase[id] = { name: n.toUpperCase(), loginLines: [{ symbol: "❤", symbol_start: "", text: "BIENVENUE", text_en: "", color: "ffffff", color_en: "ffffff", border_style: "none", show_english: false }], descLines: [{ symbol: "•", symbol_start: "", text: "DESCRIPTION", text_en: "", color: "ffffff", color_en: "ffffff", border_style: "none", show_english: false }] };
    const opt = document.createElement('option'); opt.value = id; opt.innerText = n.toUpperCase(); 
    document.getElementById('serverSelect')?.appendChild(opt); 
    document.getElementById('serverSelect').value = id; activeServerId = id;
    window.refreshAllViews();
};

window.triggerJsonImport = function() { document.getElementById('jsonFileInput')?.click(); };
window.exportQbcConfig = function() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(qbcDatabase, null, 4)); 
    const anchor = document.createElement('a'); anchor.setAttribute("href", dataStr); anchor.setAttribute("download", "qbc-backup.json");
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
};
