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
   === SCRIPT.JS UNIFIÉ : PARTIE 2 SUR 6 === [ ATTACHEMENT INITIALISATION ] ===
   ========================================================================== */
function saveToLocalStorage() { 
    localStorage.setItem("qbc_matrix_data", JSON.stringify(qbcDatabase)); 
    localStorage.setItem("qbc_active_server_id", activeServerId);
}
function loadFromLocalStorage() {
    const saved = localStorage.getItem("qbc_matrix_data");
    if (saved) {
        try {
            qbcDatabase = JSON.parse(saved); 
            const serverIds = Object.keys(qbcDatabase);
            const savedActiveId = localStorage.getItem("qbc_active_server_id");
            if (savedActiveId && qbcDatabase[savedActiveId]) {
                activeServerId = savedActiveId;
            } else if (serverIds.length > 0) {
                activeServerId = serverIds[0];
            }
        } catch(e) { console.error(e); }
    }
}

function renderServerSelect() {
    const selectServerEl = document.getElementById('serverSelect');
    if (!selectServerEl) return;
    selectServerEl.innerHTML = "";
    Object.keys(qbcDatabase).forEach(id => {
        const opt = document.createElement('option');
        opt.value = id;
        opt.innerText = qbcDatabase[id].name || id.toUpperCase();
        if (id === activeServerId) opt.selected = true;
        selectServerEl.appendChild(opt);
    });
    selectServerEl.value = activeServerId;
}

window.onServerSelectChange = function(val) {
    if (val && qbcDatabase[val]) {
        activeServerId = val;
        saveToLocalStorage();
        refreshAllViews();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    loadFromLocalStorage();
    const savedZoom = localStorage.getItem("qbc_preferred_zoom") || "80";
    changeUiZoom(savedZoom);
    const selectZoomEl = document.getElementById("uiZoomSelect");
    if (selectZoomEl) selectZoomEl.value = savedZoom;
    
    renderServerSelect();
    refreshAllViews();
});

function toggleLoginEnglish(checked) { 
    isLoginEnglishActive = checked; 
    const lines = qbcDatabase[activeServerId]?.loginLines || [];
    lines.forEach(line => { line.show_english = checked; });
    renderFormLines(); 
}

function toggleDescEnglish(checked) { 
    isDescEnglishActive = checked; 
    const lines = qbcDatabase[activeServerId]?.descLines || [];
    lines.forEach(line => { line.show_english = checked; });
    renderDescFormLines(); 
}

/* ==========================================================================
   === REFRESHEUR DE VUES ÉPURÉ (CONSERVE LE NOM 7DTD-LOGIN-DESC-SIMUL)   ===
   ========================================================================== */
function refreshAllViews() {
    // Le gros titre HTML en haut à gauche reste intact et ne bouge plus !
    
    // On relance simplement le dessin de la grille selon l'onglet actif
    if (currentActiveTab === 'login') {
        renderFormLines(); 
    } else {
        renderDescFormLines();
    }
}

// Liaison globale
window.refreshAllViews = refreshAllViews;
/* ==========================================================================
   === SCRIPT.JS UNIFIÉ : PARTIE 3 SUR 6 === [ COMMANDE DES LIGNES & COPIE ] ===
   ========================================================================== */
/* ==========================================================================
   === SYSTÈME DE TRADUCTION AUTOMATIQUE PAR API DIRECTE (AI STUDIO) ===
   ========================================================================== */
function qbcCopierLigneFrançaise(isDesc, index) {
    const list = isDesc ? qbcDatabase[activeServerId]?.descLines : qbcDatabase[activeServerId]?.loginLines;
    if (!list || !list[index]) return;
    
    let txtFR = list[index].text ? list[index].text.trim() : "";
    if (txtFR === "") return;

    // 🤖 TRADUCTION EN DIRECT SANS CORROMPRE LE NAVIGATEUR
    // Interroge l'API MyMemory Translator (Gratuite et sans clé d'API requise)
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(txtFR)}&langpair=fr|en`;

    // Affiche un petit indicateur visuel de chargement dans la case anglaise pendant le calcul
    list[index].text_en = "Traduction en cours...";
    if (isDesc) renderDescFormLines(); else renderFormLines();

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.responseData && data.responseData.translatedText) {
                // Nettoie le texte traduit et l'injecte dans la case EN
                list[index].text_en = data.responseData.translatedText.trim();
                list[index].show_english = true;
            } else {
                list[index].text_en = "Erreur de traduction";
            }
            saveToLocalStorage();
            if (isDesc) renderDescFormLines(); else renderFormLines();
        })
        .catch(err => {
            console.error("Erreur API Traduction:", err);
            list[index].text_en = "Erreur réseau";
            if (isDesc) renderDescFormLines(); else renderFormLines();
        });
}

function qbcCollerLigneAnglaise(isDesc, index) {
    const list = isDesc ? qbcDatabase[activeServerId]?.descLines : qbcDatabase[activeServerId]?.loginLines;
    if (!list || !list[index]) return;
    navigator.clipboard.readText().then(texteCopie => {
        if (texteCopie && texteCopie.trim() !== "") {
            list[index].text_en = texteCopie.trim();
            list[index].show_english = true;
            saveToLocalStorage();
            refreshAllViews();
        }
    }).catch(err => { console.log("L'API automatique a pris le relais."); });
}

function toggleLineEnglishIndividual(isDesc, i) { 
    const list = isDesc ? qbcDatabase[activeServerId]?.descLines : qbcDatabase[activeServerId]?.loginLines; 
    if (!list || !list[i]) return;
    list[i].show_english = !list[i].show_english; 
    refreshAllViews();
}

function moveLine(isDesc, i, d) { 
    const list = isDesc ? qbcDatabase[activeServerId]?.descLines : qbcDatabase[activeServerId]?.loginLines; 
    if (!list) return; const t = i + d; if (t < 0 || t >= list.length) return; 
    const tmp = list[i]; list[i] = list[t]; list[t] = tmp; 
    refreshAllViews();
}

function insertLineAt(isDesc, i) { 
    const list = isDesc ? qbcDatabase[activeServerId]?.descLines : qbcDatabase[activeServerId]?.loginLines; 
    if (!list) return;
    list.splice(i, 0, { symbol: "•", symbol_start: "", text: "MESSAGE ÉDITABLE", text_en: "", color: "ffffff", color_en: "ffffff", border_style: "none", show_english: false }); 
    refreshAllViews();
}
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
        
        // 🇫🇷 SÉLECTEURS DU FRANÇAIS : HABILLÉS EN VERT ÉMERAUDE ÉPURÉ
        let symStartSel = `<select class="select-qbc-fr" style="width:105px;" onchange="updateLineSymbolStart(${isDesc}, ${index}, this.value)">`;
        symbolPalette.forEach(s => symStartSel += `<option value="${s.char}" ${s.char === line.symbol_start ? "selected" : ""}>FR: ${s.name || 'Aucun'}</option>`); symStartSel += `</select>`;
        
        let symSel = `<select class="select-qbc-fr" style="width:100px;" onchange="updateLineSymbol(${isDesc}, ${index}, this.value)">`;
        symbolPalette.forEach(s => symSel += `<option value="${s.char}" ${s.char === line.symbol ? "selected" : ""}>Fin: ${s.name || 'Aucun'}</option>`); symSel += `</select>`;
        
        let colSel = `<select class="select-qbc-fr" style="width:90px;" onchange="updateLineColor(${isDesc}, ${index}, this.value)">`;
        colorPalette.forEach(c => colSel += `<option value="${c.hex}" ${c.hex === line.color ? "selected" : ""}>${c.name}</option>`); colSel += `</select>`;
        
        // 🇬🇧 SÉLECTEURS DE L'ANGLAIS : HABILLÉS EN BLEU TURQUOISE ÉPURÉ
        let symEnStartSel = `<select class="select-qbc-en" style="width:105px;" onchange="updateLineSymbolEnStart(${isDesc}, ${index}, this.value)">`;
        symbolPalette.forEach(s => symEnStartSel += `<option value="${s.char}" ${s.char === line.symbol_en_start ? "selected" : ""}>EN: ${s.name || 'Aucun'}</option>`); symEnStartSel += `</select>`;
        
        let symEnEndSel = `<select class="select-qbc-en" style="width:100px;" onchange="updateLineSymbolEnEnd(${isDesc}, ${index}, this.value)">`;
        symbolPalette.forEach(s => symEnEndSel += `<option value="${s.char}" ${s.char === line.symbol_en_end ? "selected" : ""}>EN Fin: ${s.name || 'Aucun'}</option>`); symEnEndSel += `</select>`;
        
        let colEnSel = `<select class="select-qbc-en" style="width:95px;" onchange="updateLineColorEn(${isDesc}, ${index}, this.value)">`;
        colorPalette.forEach(c => colEnSel += `<option value="${c.hex}" ${c.hex === line.color_en ? "selected" : ""}>EN ${c.name}</option>`); colEnSel += `</select>`;
        
        let enRow = ""; 
        if (isDesc || index > 0) { 
            const displayStyle = isEngVisible ? "display: block !important;" : "display: none !important;";
            enRow = `<div class="eng-input-box" style="width:100%; ${displayStyle}"><div class="input-row" style="margin-top:6px; display:flex; width:100%; align-items:center;"><span style="font-size:11px; color:#38bdf8; width:30px; font-weight:bold;">EN:</span><input type="text" class="input-line" style="border-left:4px dashed #${line.color_en}; flex-grow:1;" value="${line.text_en || ''}" oninput="updateLineTextEN(${isDesc}, ${index}, this.value, this)" placeholder="Anglais..." /></div></div>`; 
        }
        
        let transBtn = (isDesc || index > 0) ? `<button type="button" class="double-line-btn" style="background:#10b981; border-color:#34d399;" onclick="window.qbcCopierLigneFrançaise(${isDesc}, ${index})">🤖 TRADUIRE FR ➔ EN</button><button type="button" class="double-line-btn ${line.show_english?'active':''}" onclick="window.toggleLineEnglishIndividual(${isDesc}, ${index})">🌐 VOIR EN</button>` : "";
        
        let upDis = index === 0 ? "disabled style='opacity:0.3;'" : "", downDis = index === currentLines.length - 1 ? "disabled style='opacity:0.3;'" : "";
        
        // 📌 NOUVEAU : On garde en mémoire si la ligne était cochée "Focus"
        if (line.keep_visible === undefined) line.keep_visible = false;
        let focusChecked = line.keep_visible ? "checked" : "";

        let lineControlsBlock = `
            <button type="button" class="order-btn" ${upDis} onclick="window.moveLine(${isDesc}, ${index}, -1)">🔼</button>
            <button type="button" class="order-btn" ${downDis} onclick="window.moveLine(${isDesc}, ${index}, 1)">🔽</button>
            <button type="button" class="btn-insert-here" onclick="window.insertLineAt(${isDesc}, ${index + 1})">➕ INSÉRER</button>
            <label class="focus-checkbox-label">
                <input type="checkbox" ${focusChecked} onchange="window.toggleLineKeepVisible(${isDesc}, ${index}, this.checked)"> 📌 Focus
            </label>
        `;

        let countFR = (line.text || "").length;
        let countEN = (line.text_en || "").length;

        div.innerHTML = `<div class="line-controls"><span class="line-number">L.${index+1}</span> ${lineControlsBlock} ${symStartSel} ${symSel} ${colSel} <span style="color:#4b5563;">|</span> ${symEnStartSel} ${symEnEndSel} ${colEnSel} ${transBtn}<button type="button" class="btn-action" style="color:#f87171; margin-left:auto;" onclick="${isDesc?'window.removeDescLine':'window.removeLine'}(${index})">❌</button></div><div class="line-inputs-block"><div class="input-row" style="display:flex; width:100%; align-items:center;"><span style="font-size:11px; color:#34d399; width:30px; font-weight:bold;">FR:</span><input type="text" class="input-line" style="border-left:4px solid #${line.color}; flex-grow:1;" value="${line.text || ''}" oninput="updateLineTextFR(${isDesc}, ${index}, this.value, this)" placeholder="Texte..." /><span class="line-char-badge" style="color:#34d399;">${countFR} ch</span></div>${enRow ? enRow.replace('placeholder="Anglais..." />', `placeholder="Anglais..." />\n<span class="line-char-badge" style="color:#38bdf8;">${countEN} ch</span>`) : ""}</div>`;
        container.appendChild(div);
    }); 
    processAndCompileQBC();
}

function renderFormLines() { 
    const toggleEl = document.getElementById('loginEnglishToggle');
    buildFormRows(false, qbcDatabase[activeServerId]?.loginLines || [], toggleEl ? toggleEl.checked : false); 
}

function renderDescFormLines() { 
    const toggleEl = document.getElementById('descEnglishToggle');
    buildFormRows(true, qbcDatabase[activeServerId]?.descLines || [], toggleEl ? toggleEl.checked : false); 
}
/* ==========================================================================
   === SCRIPT.JS UNIFIÉ : PARTIE 5 SUR 6 === [ LIVE COMPILATEUR LOGIC ]    ===
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
        
        // 🔍 ÉTAPE 1 : Détecter et extraire le numéro de ligne (ex: "1- ", "2. ") s'il y en a un
        let prefixNum = "";
        
        // On vérifie si la case FR commence par un numéro
        const matchFR = textFR.match(/^([0-9]+\s*[-.]\s*)/);
        if (matchFR) {
            prefixNum = matchFR[1];
            textFR = textFR.substring(prefixNum.length).trim(); // On nettoie le texte FR brut
        } else {
            // Si pas sur le FR, on vérifie si la case EN commence par un numéro
            const matchEN = textEN.match(/^([0-9]+\s*[-.]\s*)/);
            if (matchEN) {
                prefixNum = matchEN[1];
                textEN = textEN.substring(prefixNum.length).trim(); // On nettoie le texte EN brut
            }
        }
        
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
        let linePayload = "";
        
        // --- COMPILATION DU BLOC ANGLAIS CROISÉ ---
        if (isEnglishActive && textEN !== "" && !(isLogin && index === 0)) {
            let fullEN = textEN;
            if (line.symbol_en_start && line.symbol_en_start.trim() !== "") fullEN = line.symbol_en_start + " " + fullEN;
            if (line.symbol_en_end && line.symbol_en_end.trim() !== "") fullEN = fullEN + " " + line.symbol_en_end;
            if (line.style_en && line.style_en.u) fullEN = "[u]" + fullEN + "[/u]"; 
            if (line.style_en && line.style_en.b) fullEN = "[b]" + fullEN + "[/b]";
            
            linePayload = chunkFR + " | [" + line.color_en + "]" + fullEN + "[-]";
        } else { 
            linePayload = chunkFR; 
        }
        
        // 🤝 ÉTAPE 2 : On injecte de force le numéro de ligne AU TOUT DÉBUT de la chaîne finale, avant les couleurs !
        if (prefixNum !== "") {
            masterPayload += "[" + (line.color || "ffffff") + "]" + prefixNum + "[-]" + linePayload;
        } else {
            masterPayload += linePayload;
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
    
    // INJECTION DANS LA ZONE DE TEXTE PAYLOAD (BOÎTE NOIRE)
    const outEl = document.getElementById('masterOutput'); 
    if (outEl) outEl.value = masterPayload; 
    
    // INJECTION DANS L'APERÇU VISUEL DU JEU (BOÎTE NOIRE)
    let htmlContent = masterPayload.replace(/\\n/g, '<br>')
                                   .replace(/\[([0-9a-fA-F]{6})\](.*?)\[-\]/g, '<span style="color:#$1;">$2</span>')
                                   .replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>')
                                   .replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>');
                                   
    const prevEl = document.getElementById('preview'); 
    if (prevEl) prevEl.innerHTML = htmlContent; 
    
    // --- CALCULATEUR DE COMPTEURS UNITAIRES ET GLOBAUX ---
    const totalChars = masterPayload.length;
    const totalLines = currentLines.length;

    const linesCounterEl = document.getElementById('qbcTotalLinesCounter');
    const masterCharCounterEl = document.getElementById('qbcMasterCharCounter');
    const alertEl = document.getElementById('qbcAlertBox');

    if (linesCounterEl) {
        linesCounterEl.innerText = `LIGNES TOTALES : ${totalLines}`;
    }

    if (masterCharCounterEl) {
        masterCharCounterEl.innerText = `CARACTÈRES TOTAL : ${totalChars} / ${limit}`;
        masterCharCounterEl.style.color = totalChars > limit ? "#f87171" : "#34d399";
    }

    if (alertEl) {
        alertEl.style.display = totalChars > limit ? "inline" : "none";
    }

    // Support rétrocompatible des anciens compteurs s'ils existent
    const counterEl = document.getElementById(isLogin ? 'totalCharCounter' : 'totalDescCharCounter');
    const oldAlertEl = document.getElementById(isLogin ? 'alertBox' : 'descAlertBox');
    
    if (counterEl) { 
        counterEl.innerText = `TOTAL : ${totalChars} / ${limit} CHARS`; 
        counterEl.style.color = totalChars > limit ? "#f87171" : "#34d399"; 
    }
    if (oldAlertEl) oldAlertEl.style.display = totalChars > limit ? "block" : "none";
}
/* ==========================================================================
   === SCRIPT.JS UNIFIÉ : PARTIE 6 SUR 6 === [ MÉMOIRE & INTERRUPTEURS ]   ===
   ========================================================================== */
function updateLineTextFR(isDesc, i, v, inputEl) { 
    if(isDesc) qbcDatabase[activeServerId].descLines[i].text = v; 
    else qbcDatabase[activeServerId].loginLines[i].text = v; 
    if (inputEl && inputEl.nextElementSibling && inputEl.nextElementSibling.classList.contains('line-char-badge')) {
        inputEl.nextElementSibling.innerText = v.length + " ch";
    }
    saveToLocalStorage(); 
    processAndCompileQBC(); 
}
function updateLineTextEN(isDesc, i, v, inputEl) { 
    if(isDesc) qbcDatabase[activeServerId].descLines[i].text_en = v; 
    else qbcDatabase[activeServerId].loginLines[i].text_en = v; 
    if(v.trim()!=="") { 
        if(isDesc) qbcDatabase[activeServerId].descLines[i].show_english=true; 
        else qbcDatabase[activeServerId].loginLines[i].show_english=true; 
    } 
    if (inputEl && inputEl.nextElementSibling && inputEl.nextElementSibling.classList.contains('line-char-badge')) {
        inputEl.nextElementSibling.innerText = v.length + " ch";
    }
    saveToLocalStorage(); 
    processAndCompileQBC(); 
}
function updateLineSymbol(isDesc, i, v) { if(isDesc) qbcDatabase[activeServerId].descLines[i].symbol = v; else qbcDatabase[activeServerId].loginLines[i].symbol = v; processAndCompileQBC(); }
function updateLineSymbolStart(isDesc, i, v) { if(isDesc) qbcDatabase[activeServerId].descLines[i].symbol_start = v; else qbcDatabase[activeServerId].loginLines[i].symbol_start = v; processAndCompileQBC(); }
function updateLineSymbolEnStart(isDesc, i, v) { if(isDesc) qbcDatabase[activeServerId].descLines[i].symbol_en_start = v; else qbcDatabase[activeServerId].loginLines[i].symbol_en_start = v; processAndCompileQBC(); }
function updateLineSymbolEnEnd(isDesc, i, v) { if(isDesc) qbcDatabase[activeServerId].descLines[i].symbol_en_end = v; else qbcDatabase[activeServerId].loginLines[i].symbol_en_end = v; processAndCompileQBC(); }
function updateLineColor(isDesc, i, h) { if(isDesc) qbcDatabase[activeServerId].descLines[i].color = h; else qbcDatabase[activeServerId].loginLines[i].color = h; refreshAllViews(); }
function updateLineColorEn(isDesc, i, h) { if(isDesc) qbcDatabase[activeServerId].descLines[i].color_en = h; else qbcDatabase[activeServerId].loginLines[i].color_en = h; refreshAllViews(); }

function addNewLine() { qbcDatabase[activeServerId].loginLines.push({ symbol: "•", symbol_start: "", text: "NOUVEAU MESSAGE", text_en: "", color: "ffffff", color_en: "ffffff", border_style: "none", show_english: false }); saveToLocalStorage(); renderFormLines(); }
function removeLine(i) { if(qbcDatabase[activeServerId].loginLines.length <= 1) return; qbcDatabase[activeServerId].loginLines.splice(i, 1); saveToLocalStorage(); renderFormLines(); }
function addNewDescLine() { qbcDatabase[activeServerId].descLines.push({ symbol: "•", symbol_start: "", text: "NOUVELLE DESCRIPTION", text_en: "", color: "ffffff", color_en: "ffffff", border_style: "none", show_english: false }); saveToLocalStorage(); renderDescFormLines(); }
function removeDescLine(i) { if(qbcDatabase[activeServerId].descLines.length <= 1) return; qbcDatabase[activeServerId].descLines.splice(i, 1); saveToLocalStorage(); renderDescFormLines(); }

// ENREGISTRE LE CHOIX DE FOCUS DE LA LIGNE DANS LA BASE DE DONNÉES
window.toggleLineKeepVisible = function(isDesc, index, checked) {
    const list = isDesc ? qbcDatabase[activeServerId]?.descLines : qbcDatabase[activeServerId]?.loginLines;
    if (list && list[index]) {
        list[index].keep_visible = checked;
        saveToLocalStorage();
    }
};

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
    
    refreshAllViews(); 
};

/* ==========================================================================
   === SYSTÈME D'IMPORTATION AVEC HORODATAGE ET TÉLÉMÉTRIE EN COULEUR       ===
   ========================================================================== */
window.importQbcConfig = function(event) {
    const files = event.target.files; 
    if (!files || files.length === 0) return; 
    
    // Capture du nom du fichier sélectionné (ex: "qbc-backup-stable.json")
    const uploadedFileName = files[0].name;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsedData = JSON.parse(e.target.result); 
            const serverIds = Object.keys(parsedData); 
            if (serverIds.length === 0) return;
            
            qbcDatabase = parsedData; 
            activeServerId = serverIds[0]; 
            saveToLocalStorage(); 
            renderServerSelect();
            refreshAllViews(); 
            
            // 🕒 CALCUL DE LA DATE ET DE L'HEURE COMPLÈTE À LA SECONDE
            const maintenant = new Date();
            const jour = String(maintenant.getDate()).padStart(2, '0');
            const mois = String(maintenant.getMonth() + 1).padStart(2, '0');
            const annee = maintenant.getFullYear();
            const heures = String(maintenant.getHours()).padStart(2, '0');
            const minutes = String(maintenant.getMinutes()).padStart(2, '0');
            const secondes = String(maintenant.getSeconds()).padStart(2, '0');
            
            const horodatageComplet = `${jour}/${mois}/${annee} à ${heures}:${minutes}:${secondes}`;
            const serverName = qbcDatabase[activeServerId]?.name || "SERVEUR UNIQUE";

            // 🟢 MIS À JOUR DE LA ZONE DE TEXTE EN HAUT À GAUCHE DE L'INTERFACE
            const syncLabel = document.getElementById('qbcTimeTrackerText');
            const historyLabel = document.getElementById('qbcFileHistoryText');

            if (syncLabel) {
                syncLabel.innerText = `✅ IMPORTATION RÉUSSIE — CONFIG [${serverName}] LIÉE !`;
                syncLabel.style.color = "#34d399"; // Reste vert fluo visible
            }

            if (historyLabel) {
                // Écrit proprement le nom du fichier importé avec son heure et sa date exactes
                historyLabel.innerHTML = `📁 Fichier : <strong style="color:#ffffff;">${uploadedFileName}</strong> | 📅 Importé le : <span style="color:#fbbf24;">${horodatageComplet}</span>`;
                historyLabel.style.display = "block"; // Fait apparaître la ligne de suivi
            }

        } catch (err) { 
            console.error(err);
            const syncLabel = document.getElementById('qbcTimeTrackerText');
            if (syncLabel) {
                syncLabel.innerText = "❌ ERREUR CRITIQUE : LE FICHIER JSON EST INCORRECT !";
                syncLabel.style.color = "#f87171"; // Passe au rouge en cas de panne
            }
        }
    }; 
    reader.readAsText(files[0]);
};

window.changeUiZoom = function(zoomValue) {
    document.body.style.zoom = zoomValue + "%";
    localStorage.setItem("qbc_preferred_zoom", zoomValue);
};

function showQbcPromptModal(title, defaultValue, callback) {
    const modal = document.getElementById('qbcCustomModal');
    const titleEl = document.getElementById('qbcModalTitle');
    const inputEl = document.getElementById('qbcModalInput');
    const cancelBtn = document.getElementById('qbcModalCancelBtn');
    const confirmBtn = document.getElementById('qbcModalConfirmBtn');

    if (!modal || !titleEl || !inputEl || !cancelBtn || !confirmBtn) {
        let val = null;
        try { val = prompt(title, defaultValue); } catch(e) { val = null; }
        callback(val);
        return;
    }

    titleEl.innerText = title;
    inputEl.value = defaultValue || '';
    modal.style.display = 'flex';

    setTimeout(() => {
        inputEl.focus();
        inputEl.select();
    }, 50);

    const closeModal = () => {
        modal.style.display = 'none';
        confirmBtn.onclick = null;
        cancelBtn.onclick = null;
        inputEl.onkeydown = null;
    };

    confirmBtn.onclick = () => {
        const val = inputEl.value;
        closeModal();
        callback(val);
    };

    cancelBtn.onclick = () => {
        closeModal();
        callback(null);
    };

    inputEl.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            confirmBtn.click();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelBtn.click();
        }
    };
}

window.copyMasterPayload = function() { 
    const output = document.getElementById('masterOutput'); 
    if (output) { 
        output.select(); 
        document.execCommand('copy'); 
        const statusEl = document.getElementById('qbcImportStatusAlert');
        if (statusEl) {
            statusEl.innerText = '📋 CODE PAYLOAD COPIÉ DANS LE PRESSE-PAPIER !';
            statusEl.style.border = '1px solid #10b981';
            statusEl.style.background = '#064e3b';
            statusEl.style.color = '#34d399';
            statusEl.style.display = 'block';
            setTimeout(() => { statusEl.style.display = 'none'; }, 4000);
        }
    }
};

function editCurrentServerName() {
    if (!qbcDatabase || !activeServerId || !qbcDatabase[activeServerId]) {
        const keys = Object.keys(qbcDatabase || {});
        if (keys.length > 0) {
            activeServerId = keys[0];
        } else {
            return;
        }
    }
    
    const actuelNom = qbcDatabase[activeServerId].name || "";
    showQbcPromptModal("RENOMMER LE SERVEUR :", actuelNom, (n) => {
        if (n === null || n.trim() === "") return;
        qbcDatabase[activeServerId].name = n.trim().toUpperCase();
        saveToLocalStorage();
        renderServerSelect();
        refreshAllViews();
    });
}

function createNewServerInstance() {
    showQbcPromptModal("NOM DU NOUVEAU SERVEUR :", "", (n) => {
        if (n === null || n.trim() === "") return; 
        
        const id = "7dtd_" + Math.random().toString(36).substring(2, 6);
        
        qbcDatabase[id] = { 
            name: n.trim().toUpperCase(), 
            loginLines: [{ symbol: "❤", symbol_start: "", symbol_en_start: "", symbol_en_end: "", text: "BIENVENUE SUR MON NOUVEAU SERVEUR", text_en: "", color: "ffffff", color_en: "ffffff", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} }], 
            descLines: [{ symbol: "•", symbol_start: "", symbol_en_start: "", symbol_en_end: "", text: "DESCRIPTION DU SERVEUR", text_en: "", color: "ffffff", color_en: "ffffff", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} }] 
        };
        
        activeServerId = id;
        saveToLocalStorage();
        renderServerSelect();
        refreshAllViews();
    });
}

window.editCurrentServerName = editCurrentServerName;
window.createNewServerInstance = createNewServerInstance;

// LIENS DE SOUDURE UNIVERSELS DIRECTS
window.qbcCopierLigneFrançaise = qbcCopierLigneFrançaise;
window.qbcCollerLigneAnglaise = qbcCollerLigneAnglaise;
window.toggleLineEnglishIndividual = toggleLineEnglishIndividual;
window.moveLine = moveLine;
window.insertLineAt = insertLineAt;
window.addNewLine = addNewLine;
window.addNewDescLine = addNewDescLine;
window.triggerJsonImport = function() { document.getElementById('jsonFileInput')?.click(); };
// 👑 LE MOTEUR DU MODE FOCUS : Masque tout SAUF les lignes cochées "Focus" !
window.togglePanelVisibility = function(containerId, buttonEl) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // On récupère toutes les lignes (divs) affichées dans la grille actuelle
    const lineDivs = container.getElementsByClassName('line-item');
    const isDesc = (containerId === 'descLinesContainer');
    const list = isDesc ? qbcDatabase[activeServerId]?.descLines : qbcDatabase[activeServerId]?.loginLines;

    // Si le panneau est déjà réduit, on réaffiche TOUTES les lignes normalement
    if (buttonEl.getAttribute('data-reduced') === "true") {
        for (let i = 0; i < lineDivs.length; i++) {
            lineDivs[i].style.display = "flex";
        }
        buttonEl.innerText = "🔼 Réduire Panneau";
        buttonEl.style.background = "#334155";
        buttonEl.setAttribute('data-reduced', "false");
    } 
    // Sinon, on passe en MODE FOCUS !
    else {
        for (let i = 0; i < lineDivs.length; i++) {
            // Si la ligne correspondante dans la base de données n'est pas cochée "keep_visible", on la cache !
            if (list && list[i] && !list[i].keep_visible) {
                lineDivs[i].style.display = "none";
            } else {
                lineDivs[i].style.display = "flex"; // La ligne cochée reste affichée !
            }
        }
        buttonEl.innerText = "🔽 Déployer Panneau";
        buttonEl.style.background = "#1e3a8a"; // Devient bleu foncé
        buttonEl.setAttribute('data-reduced', "true");
    }
};

/* ==========================================================================
   === DOUBLE INFRASTRUCTURE D'EXPORTATION (LOCAL SUR DISQUE & GITHUB CLOUD) ===
   ========================================================================== */

// 💾 EXPORTATION OPTION 1 : Téléchargement direct d'un fichier physique sur ton Bureau
window.exportQbcConfigLocal = function() {
    let comment = prompt("Ajouter un commentaire pour le nom du fichier local (Ex: stable, v2) :\n(Laisse vide pour le nom par défaut : qbc-backup.json)");
    let name = "qbc-backup.json";
    
    if (comment && comment.trim() !== "") {
        // Nettoie le texte pour éviter les espaces ou caractères interdits dans un fichier Windows/Mac
        let cleanComment = comment.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
        name = `qbc-backup-${cleanComment}.json`;
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(qbcDatabase, null, 4)); 
    const anchor = document.createElement('a'); 
    anchor.setAttribute("href", dataStr); 
    anchor.setAttribute("download", name);
    document.body.appendChild(anchor); 
    anchor.click(); 
    anchor.remove();
};
window.exportQbcConfig = window.exportQbcConfigLocal;

// 🌐 TÉLÉCHARGEMENT ET CHARGEMENT DU JSON DEPUIS TON GITHUB
window.importQbcConfigFromGitHub = function() {
    const syncLabel = document.getElementById('qbcTimeTrackerText');
    const historyLabel = document.getElementById('qbcFileHistoryText');
    
    if (syncLabel) {
        syncLabel.innerText = "⏳ RÉCUPÉRATION DU FICHIER SUR GITHUB EN COURS...";
        syncLabel.style.color = "#fbbf24";
    }

    // Appelle notre API Express qui utilise ton Token
    fetch('/api/load-from-github')
    .then(res => res.json())
    .then(data => {
        const payload = data && (data.database || data.databasePayload);
        if (data && data.success && payload) {
            // Écrase la base locale par la version officielle de GitHub
            qbcDatabase = payload;
            
            // On se repositionne sur le premier serveur de l'archive
            const serverIds = Object.keys(qbcDatabase);
            if (serverIds.length > 0) activeServerId = serverIds[0];
            
            if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
            if (typeof renderServerSelect === 'function') renderServerSelect();
            if (typeof initServerSelector === 'function') initServerSelector();
            if (typeof refreshAllViews === 'function') refreshAllViews();

            const m = new Date();
            const horodatage = `${String(m.getDate()).padStart(2,'0')}/${String(m.getMonth()+1).padStart(2,'0')}/${m.getFullYear()} à ${String(m.getHours()).padStart(2,'0')}:${String(m.getMinutes()).padStart(2,'0')}:${String(m.getSeconds()).padStart(2,'0')}`;
            
            if (syncLabel) {
                syncLabel.innerText = `✅ CHARGEMENT RÉUSSI — CONFIG [${qbcDatabase[activeServerId]?.name || "UNIQUE"}] SYNCHRONISÉE !`;
                syncLabel.style.color = "#34d399";
            }
            if (historyLabel) {
                historyLabel.innerHTML = `🌐 Source : <strong style="color:#ffffff;">GitHub (${data.fileName || 'qbc-backup.json'})</strong> | 📅 Synchronisé le : <span style="color:#fbbf24;">${horodatage}</span>`;
                historyLabel.style.display = "block";
            }
            alert("🌐 PARFAIT ! Ton cockpit a récupéré et chargé la dernière sauvegarde officielle de ton GitHub !");
        } else {
            alert("❌ IMPOSSIBLE DE CHARGER : " + (data.error || "Vérifie ton fichier sur GitHub"));
            if (syncLabel) { syncLabel.innerText = "❌ ÉCHEC DU CHARGEMENT GITHUB"; syncLabel.style.color = "#f87171"; }
        }
    })
    .catch(err => {
        console.error(err);
        alert("❌ ERREUR RÉSEAU : Le serveur local n'a pas répondu.");
        if (syncLabel) { syncLabel.innerText = "❌ ERREUR DE CHARGEMENT GITHUB"; syncLabel.style.color = "#f87171"; }
    });
};

// 🚀 TÉLÉVERSEMENT EN DIRECT DU JSON VERS LE REPOSITORIE GITHUB
window.exportQbcConfigToGitHub = function() {
    const syncLabel = document.getElementById('qbcTimeTrackerText');
    const historyLabel = document.getElementById('qbcFileHistoryText');
    
    if (syncLabel) {
        syncLabel.innerText = "⏳ CONNEXION ET ENVOI VERS GITHUB EN COURS...";
        syncLabel.style.color = "#fbbf24"; // Devient jaune pendant le chargement
    }

    // Envoi de la base de données courante à notre API Express
    fetch('/api/save-to-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ databasePayload: qbcDatabase })
    })
    .then(res => res.json())
    .then(data => {
        if (data && data.success) {
            const m = new Date();
            const horodatage = `${String(m.getDate()).padStart(2,'0')}/${String(m.getMonth()+1).padStart(2,'0')}/${m.getFullYear()} à ${String(m.getHours()).padStart(2,'0')}:${String(m.getMinutes()).padStart(2,'0')}:${String(m.getSeconds()).padStart(2,'0')}`;
            
            if (syncLabel) {
                syncLabel.innerText = "✅ SAUVEGARDE EN LIGNE PROPULSÉE AVEC SUCCÈS !";
                syncLabel.style.color = "#34d399"; // Repasse au vert de validation
            }
            if (historyLabel) {
                historyLabel.innerHTML = `📁 Backup : <strong style="color:#ffffff;">qbc-backup.json</strong> | 🔄 Synchronisé le : <span style="color:#38bdf8;">${horodatage}</span>`;
                historyLabel.style.display = "block";
            }
            alert("🚀 INCROYABLE ! Ton fichier de configuration a été poussé et synchronisé directement sur ton dépôt GitHub !");
        } else {
            alert("❌ ÉCHEC DE LA SAUVEGARDE : " + (data.error || "Vérifie tes configurations de Token"));
            if (syncLabel) { 
                syncLabel.innerText = "❌ ERREUR DE SYNCHRONISATION GITHUB"; 
                syncLabel.style.color = "#f87171"; 
            }
        }
    })
    .catch(err => {
        console.error(err);
        alert("❌ ERREUR RÉSEAU : Impossible de joindre le serveur Express !");
        if (syncLabel) { 
            syncLabel.innerText = "❌ ERREUR DE SYNCHRONISATION GITHUB"; 
            syncLabel.style.color = "#f87171"; 
        }
    });
};
