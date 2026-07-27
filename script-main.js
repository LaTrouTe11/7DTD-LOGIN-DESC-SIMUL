/* ==========================================================================
   === SCRIPT-MAIN.JS : PARTIE 1 SUR 2 === [ VARIABLES, ONGLETS & SÉCURITÉ ] ===
   ========================================================================== */
let currentActiveTab = 'login';
let activeServerId = '7dtd_core';
let isLoginEnglishActive = false;
let isDescEnglishActive = false;

let qbcDatabase = {
    '7dtd_core': {
        name: "QBC FLAGGARD PVE 3.0 (CORE)",
        loginLines: [
            { symbol: "❤", symbol_start: "", symbol_en_start: "", symbol_en_end: "", text: "QBC FLAGGARD PVE 3.0 +MODS BIENVENUE ❤", text_en: "", color: "ff0000", color_en: "ff0000", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} }
        ],
        descLines: [
            { symbol: "•", symbol_start: "", symbol_en_start: "", symbol_en_end: "", text: "Bienvenue sur l'infrastructure de Varennes.", text_en: "", color: "00ff00", color_en: "00ff00", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} }
        ]
    }
};

const colorPalette = [
    { hex: "ff0000", name: "Rouge" }, { hex: "00ff00", name: "Vert" }, { hex: "ffff00", name: "Jaune" },
    { hex: "00ffff", name: "Cyan" }, { hex: "ffaa00", name: "Orange" }, { hex: "F88379", name: "Rose" }, { hex: "ffffff", name: "Blanc" }
];

const symbolPalette = [
    { char: "", name: "(Aucun)" }, { char: "•", name: "Point" }, { char: "❤", name: "Coeur" },
    { char: "☣", name: "Biohazard" }, { char: "⚠️", name: "Alerte" }, { char: "🚀", name: "Téléport" }, { char: "✗", name: "Croix / Interdit" }
];

document.addEventListener("DOMContentLoaded", () => {
    loadFromLocalStorage();
    if (typeof changeUiZoom === "function") {
        const savedZoom = localStorage.getItem("qbc_preferred_zoom") || "80";
        changeUiZoom(savedZoom);
    }
    if (currentActiveTab === 'login') renderFormLines(); else renderDescFormLines();
});

function switchTab(t) { 
    currentActiveTab = t; 
    document.getElementById('tab-login-btn')?.classList.toggle('active', t==='login'); 
    document.getElementById('tab-desc-btn')?.classList.toggle('active', t==='desc'); 
    document.getElementById('tab-google-btn')?.classList.toggle('active', t==='google'); 
    document.getElementById('content-login')?.classList.toggle('active', t==='login'); 
    document.getElementById('content-desc')?.classList.toggle('active', t==='desc'); 
    document.getElementById('content-google')?.classList.toggle('active', t==='google'); 
    if (t==='login') renderFormLines(); else if (t==='desc') renderDescFormLines(); 
}

function refreshAllViews() {
    if (currentActiveTab === 'login') renderFormLines(); else renderDescFormLines();
    if (typeof processAndCompileQBC === "function") processAndCompileQBC();
}
/* ==========================================================================
   === SCRIPT-MAIN.JS : PARTIE 2 SUR 2 === [ FORMULAIRES & PERSISTANCE ]   ===
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
        
        let transBtn = (isDesc || index > 0) ? `<button type="button" class="double-line-btn" onclick="qbcCopierLigneFrançaise(${isDesc}, ${index})">📋 FR</button><button type="button" class="double-line-btn" onclick="qbcCollerLigneAnglaise(${isDesc}, ${index})">📥 EN</button><button type="button" class="double-line-btn ${line.show_english?'active':''}" onclick="toggleLineEnglishIndividual(${isDesc}, ${index})">🌐 EN</button>` : "";
        
        div.innerHTML = `<div class="line-controls"><span class="line-number">L.${index+1}</span> ${symStartSel} ${symSel} ${colSel} <span style="color:#4b5563;">|</span> ${symEnStartSel} ${symEnEndSel} ${colEnSel} ${transBtn}<button type="button" class="btn-action" style="color:#f87171; margin-left:auto;" onclick="${isDesc?'removeDescLine':'removeLine'}(${index})">❌</button></div><div class="line-inputs-block"><div class="input-row" style="display:flex; width:100%; align-items:center;"><span style="font-size:11px; color:#34d399; width:30px; font-weight:bold;">FR:</span><input type="text" class="input-line" style="border-left:4px solid #${line.color}; flex-grow:1;" value="${line.text || ''}" oninput="updateLineTextFR(${isDesc}, ${index}, this.value)" placeholder="Texte..." /></div>${enRow}</div>`;
        container.appendChild(div);
    }); 
    if (typeof processAndCompileQBC === "function") processAndCompileQBC();
}

function renderFormLines() { 
    const toggleEl = document.getElementById('loginEnglishToggle');
    buildFormRows(false, qbcDatabase[activeServerId]?.loginLines || [], toggleEl ? toggleEl.checked : false); 
}

function renderDescFormLines() { 
    const toggleEl = document.getElementById('descEnglishToggle');
    buildFormRows(true, qbcDatabase[activeServerId]?.descLines || [], toggleEl ? toggleEl.checked : false); 
}

function saveToLocalStorage() { 
    localStorage.setItem("qbc_matrix_data", JSON.stringify(qbcDatabase)); 
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem("qbc_matrix_data");
    if (saved) {
        try {
            qbcDatabase = JSON.parse(saved);
            const serverIds = Object.keys(qbcDatabase);
            if (serverIds.length > 0) activeServerId = serverIds.includes(activeServerId) ? activeServerId : serverIds[0];
        } catch(e) { console.error("Erreur LocalStorage", e); }
    }
}

function updateLineTextFR(isDesc, i, v) { if(isDesc) qbcDatabase[activeServerId].descLines[i].text = v; else qbcDatabase[activeServerId].loginLines[i].text = v; saveToLocalStorage(); if (typeof processAndCompileQBC === "function") processAndCompileQBC(); }
function updateLineTextEN(isDesc, i, v) { if(isDesc) qbcDatabase[activeServerId].descLines[i].text_en = v; else qbcDatabase[activeServerId].loginLines[i].text_en = v; if(v.trim()!=="") { if(isDesc) qbcDatabase[activeServerId].descLines[i].show_english=true; else qbcDatabase[activeServerId].loginLines[i].show_english=true; } saveToLocalStorage(); if (typeof processAndCompileQBC === "function") processAndCompileQBC(); }
function updateLineSymbol(isDesc, i, v) { if(isDesc) qbcDatabase[activeServerId].descLines[i].symbol = v; else qbcDatabase[activeServerId].loginLines[i].symbol = v; if (typeof processAndCompileQBC === "function") processAndCompileQBC(); }
function updateLineColor(isDesc, i, h) { if(isDesc) qbcDatabase[activeServerId].descLines[i].color = h; else qbcDatabase[activeServerId].loginLines[i].color = h; if(isDesc) renderDescFormLines(); else renderFormLines(); }
function addNewLine() { qbcDatabase[activeServerId].loginLines.push({ symbol: "•", symbol_start: "", text: "MESSAGE LOG", text_en: "", color: "ffffff", color_en: "ffffff", border_style: "none", show_english: false }); saveToLocalStorage(); renderFormLines(); }
function removeLine(i) { if(qbcDatabase[activeServerId].loginLines.length <= 1) return; qbcDatabase[activeServerId].loginLines.splice(i, 1); saveToLocalStorage(); renderFormLines(); }
function addNewDescLine() { qbcDatabase[activeServerId].descLines.push({ symbol: "•", symbol_start: "", text: "MESSAGE DESC", text_en: "", color: "ffffff", color_en: "ffffff", border_style: "none", show_english: false }); saveToLocalStorage(); renderDescFormLines(); }
function removeDescLine(i) { if(qbcDatabase[activeServerId].descLines.length <= 1) return; qbcDatabase[activeServerId].descLines.splice(i, 1); saveToLocalStorage(); renderDescFormLines(); }



