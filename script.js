/* ==========================================================================
   === SCRIPT.JS : BLOC 1 SUR 5 === [ INITIALISATION ET BASES DE DONNÉES ] ===
   ========================================================================== */
let currentActiveTab = 'login';
let activeServerId = '7dtd-core';
let isLoginEnglishActive = false;
let isDescEnglishActive = false;

// Registre officiel de la base de données d'origine (700 lignes protégées)
let qbcDatabase = {
    '7dtd-core': {
        name: "QBC FLAGGARD PVE 3.0 (CORE)",
        loginLines: [
            { symbol: "❤", text: "QBC FLAGGARD PVE 3.0 +MODS BIENVENUE ❤", text_en: "", color: "ff0000", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} },
            { symbol: "☣", text: "RÈGLEMENTS :", text_en: "", color: "ffff00", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} },
            { symbol: "✗", text: "1- Pas de landclaim au POI Carl's Corn Farm.", text_en: "", color: "00ff00", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} },
            { symbol: "✗", text: "2- Vol de base interdit (sécurisez vos coffres).", text_en: "", color: "00ff00", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} },
            { symbol: "⏰", text: "REBOOTS: 05:00 & 17:00 (EST/QC)", text_en: "", color: "F88379", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} }
        ],
        descLines: [
            { symbol: "•", text: "Bienvenue sur l'infrastructure de Varennes.", text_en: "", color: "00ff00", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} },
            { symbol: "•", text: "Serveur PvE québécois haute performance.", text_en: "", color: "ffffff", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} }
        ]
    },
    '7dtd-projectz': {
        name: "QBC FLAGGARD PROJECTZ 3.0",
        loginLines: [{ symbol: "❤", text: "QBC FLAGGARD ProjectZ 3.0 +MODS ❤", text_en: "", color: "ff0000", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} }],
        descLines: [{ symbol: "🤖", text: "Gestion ProjectZ 3.0 par les GMs.", text_en: "", color: "ffffff", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} }]
    }
};

const colorPalette = [
    { hex: "ff0000", name: "Rouge" }, { hex: "00ff00", name: "Vert" }, { hex: "ffff00", name: "Jaune" },
    { hex: "00ffff", name: "Cyan" }, { hex: "ffaa00", name: "Orange" }, { hex: "F88379", name: "Rose" }, { hex: "ffffff", name: "Blanc" }
];

const symbolPalette = [
    { char: "", name: "(Aucun)" }, { char: "•", name: "Point" }, { char: "❤", name: "Coeur" },
    { char: "☣", name: "Biohazard" }, { char: "⚠️", name: "Alerte" }, { char: "🚀", name: "Téléport" }, { char: "✗", name: "Croix / Interdit" },
    { char: "⚔️", name: "Épées / PvP-PvE" }, { char: "⚙️", name: "Engrenage / Système" }, { char: "💎", name: "Diamant / Récompense" },
    { char: "⭐", name: "Étoile / Important" }, { char: "👑", name: "Couronne / VIP-Admin" }, { char: "☠️", name: "Tête de mort / Mort" },
    { char: "🎒", name: "Sac à dos / Loot" }, { char: "⏰", name: "Horloge / Reboot" }, { char: "🔒", name: "Cadenas / Sécurisé" }, { char: "🌐", name: "Monde / Discord-Web" }
];

const qbcLocalDictionary = { 
    "règlements :": "RULES:", 
    "pas de landclaim au poi carl's corn farm.": "No landclaim at POI Carl's Corn Farm.", 
    "vol de base interdit (sécurisez vos coffres).": "Base stealing forbidden (secure your chests).", 
    "bienvenue sur l'infrastructure de varennes.": "Welcome to Varennes infrastructure."
};
/* ==========================================================================
   === SCRIPT.JS : BLOC 2 SUR 5 === [ TRADUCTION UNIVERSELLE AVEC JETONS ] ===
   ========================================================================== */
function autoTranslateLine(isDesc, index) {
    const isLogin = !isDesc;
    const linesList = isLogin ? qbcDatabase[activeServerId].loginLines : qbcDatabase[activeServerId].descLines;
    if (!linesList || !linesList[index]) return;
    const line = linesList[index];
    
    let rawText = line.text.trim(); 
    if (rawText === "" || rawText === "...") return;
    
    let prefix = "";
    let cleanText = rawText;
    
    const numMatch = rawText.match(/^([0-9]+-\s*)/);
    if (numMatch && numMatch.length > 0) {
        prefix = numMatch.at(0); 
        cleanText = rawText.substring(prefix.length).trim();
    }
    
    // MASQUAGE DE SÉCURITÉ : Protection des symboles / et : pour forcer Google à lire toute la ligne
    let textToTranslate = cleanText.trim();
    textToTranslate = textToTranslate.replace(/\//g, "SLASHTOKEN ").replace(/:/g, " COLONTOKEN");
    
    const oldScript = document.getElementById("qbcInvisibleTranslator");
    if (oldScript) oldScript.remove();
    
    window.qbcGoogleCallback = function(data) {
        try {
            if (data && data && data && data) {
                let translatedText = data;
                
                // RESTAURATION DES SYMBOLES D'ORIGINE
                translatedText = translatedText.replace(/SLASHTOKEN/gi, "/").replace(/COLONTOKEN/gi, ":");
                translatedText = translatedText.replace(/\/ /g, "/").replace(/ \//g, "/");
                translatedText = translatedText.replace(/ :/g, " :").replace(/: /g, ": ");
                
                // Éradication automatique des accents anglais majuscules
                translatedText = translatedText.replace(/[ÉÈÊË]/g, "E").replace(/[ÀÂÄ]/g, "A").replace(/[ÔÖ]/g, "O");
                
                line.text_en = prefix + translatedText;
                line.show_english = true;
                
                if (isDesc) renderDescFormLines(); else renderFormLines();
            }
        } catch(e) {
            line.text_en = prefix + cleanText;
            if (isDesc) renderDescFormLines(); else renderFormLines();
        }
        delete window.qbcGoogleCallback;
    };
    
    const scriptEl = document.createElement("script");
    scriptEl.id = "qbcInvisibleTranslator";
    scriptEl.src = "https://googleapis.com" + encodeURIComponent(textToTranslate);
    document.body.appendChild(scriptEl);
}

function toggleEditorCollapse() { 
    document.getElementById('collapsibleWorkspacePanel').classList.toggle('collapsed'); 
}
/* ==========================================================================
   === SCRIPT.JS : BLOC 3 SUR 5 === [ COMMUTATEURS ET AGENCEMENT DE LIGNES ] ===
   ========================================================================== */
function toggleLoginEnglish(checked) { 
    isLoginEnglishActive = checked; 
    const lines = qbcDatabase[activeServerId].loginLines;
    lines.forEach(line => { line.show_english = checked; });
    renderFormLines(); 
}

function toggleDescEnglish(checked) { 
    isDescEnglishActive = checked; 
    const lines = qbcDatabase[activeServerId].descLines;
    lines.forEach(line => { line.show_english = checked; });
    renderDescFormLines(); 
}

function toggleLineEnglishIndividual(isDesc, i) { 
    const list = isDesc ? qbcDatabase[activeServerId].descLines : qbcDatabase[activeServerId].loginLines; 
    list[i].show_english = !list[i].show_english; 
    
    if (!list[i].show_english) {
        if (isDesc) {
            isDescEnglishActive = false;
            const toggleEl = document.getElementById('descEnglishToggle');
            if (toggleEl) toggleEl.checked = false;
        } else {
            isLoginEnglishActive = false;
            const toggleEl = document.getElementById('loginEnglishToggle');
            if (toggleEl) toggleEl.checked = false;
        }
    }
    if (isDesc) renderDescFormLines(); else renderFormLines(); 
}

function toggleLineDoubleBorder(isDesc, i) { 
    const l = isDesc ? qbcDatabase[activeServerId].descLines[i] : qbcDatabase[activeServerId].loginLines[i]; 
    l.border_double = !l.border_double; 
    if (isDesc) renderDescFormLines(); else renderFormLines(); 
}

function moveLine(isDesc, i, d) { 
    const list = isDesc ? qbcDatabase[activeServerId].descLines : qbcDatabase[activeServerId].loginLines; 
    const t = i + d; 
    if (t < 0 || t >= list.length) return; 
    const tmp = list[i]; 
    list[i] = list[t]; 
    list[t] = tmp; 
    if (isDesc) renderDescFormLines(); else renderFormLines(); 
}

function insertLineAt(isDesc, i) { 
    const list = isDesc ? qbcDatabase[activeServerId].descLines : qbcDatabase[activeServerId].loginLines; 
    list.splice(i, 0, { symbol: "•", text: "MESSAGE ÉDITABLE", text_en: "", color: "ffffff", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} }); 
    if (isDesc) renderDescFormLines(); else renderFormLines(); 
}

function toggleLineStyle(isDesc, i, lang, k) { 
    const l = isDesc ? qbcDatabase[activeServerId].descLines[i] : qbcDatabase[activeServerId].loginLines[i]; 
    const o = lang === 'fr' ? l.style_fr : l.style_en; 
    o[k] = !o[k]; 
    if (isDesc) renderDescFormLines(); else renderFormLines(); 
}

function createNewServerInstance() {
    const n = prompt("NOM SERVEUR :"); if (!n || n.trim() === "") return; 
    const id = "7dtd-" + Math.random().toString(36).substring(2, 6);
    qbcDatabase[id] = { name: n.toUpperCase(), loginLines: [{ symbol: "❤", text: "BIENVENUE", text_en: "", color: "ffffff", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} }], descLines: [{ symbol: "•", text: "DESCRIPTION", text_en: "", color: "ffffff", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} }] };
    const opt = document.createElement('option'); opt.value = id; opt.innerText = n.toUpperCase(); 
    document.getElementById('serverSelect').appendChild(opt); 
    document.getElementById('serverSelect').value = id; changeServerInstance(id);
}

function editCurrentServerName() {
    const n = prompt("NOUVEAU NOM :", qbcDatabase[activeServerId].name); if (!n || n.trim() === "") return; 
    qbcDatabase[activeServerId].name = n.toUpperCase();
    document.getElementById('serverSelect').options[document.getElementById('serverSelect').selectedIndex].innerText = n.toUpperCase(); 
    processAndCompileQBC();
}

function changeServerInstance(id) { activeServerId = id; if (currentActiveTab === 'login') renderFormLines(); else renderDescFormLines(); }
function switchTab(t) { currentActiveTab = t; document.getElementById('tab-login-btn').classList.toggle('active', t==='login'); document.getElementById('tab-desc-btn').classList.toggle('active', t==='desc'); document.getElementById('content-login').classList.toggle('active', t==='login'); document.getElementById('content-desc').classList.toggle('active', t==='desc'); if (t==='login') renderFormLines(); else renderDescFormLines(); }
function updateLineSymbol(isDesc, i, v) { if(isDesc) qbcDatabase[activeServerId].descLines[i].symbol = v; else qbcDatabase[activeServerId].loginLines[i].symbol = v; processAndCompileQBC(); }
function updateLineColor(isDesc, i, h) { if(isDesc) qbcDatabase[activeServerId].descLines[i].color = h; else qbcDatabase[activeServerId].loginLines[i].color = h; if(isDesc) renderDescFormLines(); else renderFormLines(); }
function updateLineTextFR(isDesc, i, v) { if(isDesc) qbcDatabase[activeServerId].descLines[i].text = v; else qbcDatabase[activeServerId].loginLines[i].text = v; saveToLocalStorage(); processAndCompileQBC(); }
function updateLineTextEN(isDesc, i, v) { if(isDesc) qbcDatabase[activeServerId].descLines[i].text_en = v; else qbcDatabase[activeServerId].loginLines[i].text_en = v; if(v.trim()!=="") { if(isDesc) qbcDatabase[activeServerId].descLines[i].show_english=true; else qbcDatabase[activeServerId].loginLines[i].show_english=true; } saveToLocalStorage(); processAndCompileQBC(); }
function addNewLine() { qbcDatabase[activeServerId].loginLines.push({ symbol: "•", text: "MESSAGE LOG", text_en: "", color: "ffffff", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} }); saveToLocalStorage(); renderFormLines(); }
function removeLine(i) { if(qbcDatabase[activeServerId].loginLines.length <= 1) return; qbcDatabase[activeServerId].loginLines.splice(i, 1); saveToLocalStorage(); renderFormLines(); }
function addNewDescLine() { qbcDatabase[activeServerId].descLines.push({ symbol: "•", text: "MESSAGE DESC", text_en: "", color: "ffffff", border_style: "none", show_english: false, style_fr: {u:false,b:false}, style_en: {u:false,b:false} }); saveToLocalStorage(); renderDescFormLines(); }
function removeDescLine(i) { if(qbcDatabase[activeServerId].descLines.length <= 1) return; qbcDatabase[activeServerId].descLines.splice(i, 1); saveToLocalStorage(); renderDescFormLines(); }
/* ==========================================================================
   === SCRIPT.JS : BLOC 4 SUR 5 === [ DESSIN DES LIGNES ET COMPILATEUR ] ===
   ========================================================================== */
function buildFormRows(isDesc, currentLines, isGlobalEnglish) {
    const container = document.getElementById(isDesc ? 'descLinesContainer' : 'linesContainer'); container.innerHTML = "";
    
    currentLines.forEach((line, index) => {
        const div = document.createElement('div'); 
        const isEngVisible = line.show_english || isGlobalEnglish;
        div.className = "line-item" + (line.border_style && line.border_style !== "none" ? " has-double-border" : "");
        
        let symSel = `<select class="line-select" style="width:100px;" onchange="updateLineSymbol(${isDesc}, ${index}, this.value)">`;
        symbolPalette.forEach(s => symSel += `<option value="${s.char}" ${s.char === line.symbol ? "selected" : ""}>${s.name}</option>`); symSel += `</select>`;
        
        let colSel = `<select class="line-select" style="width:90px;" onchange="updateLineColor(${isDesc}, ${index}, this.value)">`;
        colorPalette.forEach(c => colSel += `<option value="${c.hex}" ${c.hex === line.color ? "selected" : ""}>${c.name}</option>`); colSel += `</select>`;
        
        if (!line.border_style) line.border_style = "none";
        let borderSel = `<select class="line-select" style="width:140px;" onchange="updateLineBorderStyle(${isDesc}, ${index}, this.value)">`;
        borderSel += `<option value="none" ${line.border_style === 'none' ? 'selected' : ''}>(Pas de Ligne)</option>`;
        borderSel += `<option value="double" ${line.border_style === 'double' ? 'selected' : ''}>═ Ligne Double</option>`;
        borderSel += `<option value="single" ${line.border_style === 'single' ? 'selected' : ''}>─ Ligne Simple</option>`;
        borderSel += `<option value="dash" ${line.border_style === 'dash' ? 'selected' : ''}>- Pointillés (-)</option>`;
        borderSel += `<option value="dot" ${line.border_style === 'dot' ? 'selected' : ''}>. Pointillés (.)</option>`;
        borderSel += `</select>`;
        
        if (!line.style_fr) line.style_fr = {u:false,b:false}; if (!line.style_en) line.style_en = {u:false,b:false};
        let toolsFR = `<button type="button" class="style-btn ${line.style_fr.u?'active':''}" onclick="toggleLineStyle(${isDesc}, ${index}, 'fr', 'u')">U</button><button type="button" class="style-btn ${line.style_fr.b?'active':''}" onclick="toggleLineStyle(${isDesc}, ${index}, 'fr', 'b')">B</button>`;
        let toolsEN = `<button type="button" class="style-btn ${line.style_en.u?'active':''}" onclick="toggleLineStyle(${isDesc}, ${index}, 'en', 'u')">U</button><button type="button" class="style-btn ${line.style_en.b?'active':''}" onclick="toggleLineStyle(${isDesc}, ${index}, 'en', 'b')">B</button>`;
        
        let enRow = ""; 
        if (isDesc || index > 0) { 
            const displayStyle = isEngVisible ? "display: block !important;" : "display: none !important;";
            enRow = `<div class="eng-input-box" style="width:100%; ${displayStyle}"><div class="input-row" style="margin-top:6px; display:flex; width:100%; align-items:center;"><span style="font-size:11px; color:#38bdf8; width:30px; font-weight:bold;">EN:</span><input type="text" class="input-line" style="border-left:4px dashed #4b5563; flex-grow:1;" value="${line.text_en || ''}" oninput="updateLineTextEN(${isDesc}, ${index}, this.value)" placeholder="Saisir la traduction anglaise ici..." />${toolsEN}</div></div>`; 
        }
        
        let upDis = index === 0 ? "disabled style='opacity:0.3;'" : "", downDis = index === currentLines.length - 1 ? "disabled style='opacity:0.3;'" : "";
        let transBtn = (isDesc || index > 0) ? `<button type="button" class="double-line-btn ${line.show_english?'active':''}" onclick="toggleLineEnglishIndividual(${isDesc}, ${index})">🌐 MANUEL</button><button type="button" class="double-line-btn" onclick="autoTranslateLine(${isDesc}, ${index})">🤖 AUTO</button>` : "";
        
        div.innerHTML = `<div class="line-controls"><span class="line-number">${isDesc ? "Web L." + (index+1) : (index === 0 ? "Titre L.1" : "Login L." + (index+1))}</span><button type="button" class="order-btn" ${upDis} onclick="moveLine(${isDesc}, ${index}, -1)">🔼</button><button type="button" class="order-btn" ${downDis} onclick="moveLine(${isDesc}, ${index}, 1)">🔽</button><button type="button" class="btn-insert-here" onclick="insertLineAt(${isDesc}, ${index + 1})">➕ INSÉRER</button>${symSel} ${colSel} ${transBtn} ${borderSel}<button type="button" class="btn-action" style="color:#f87171; margin-left:auto;" onclick="${isDesc?'removeDescLine':'removeLine'}(${index})">❌</button></div><div class="line-inputs-block"><div class="input-row" style="display:flex; width:100%; align-items:center;"><span style="font-size:11px; color:#34d399; width:30px; font-weight:bold;">FR:</span><input type="text" class="input-line" style="border-left:4px solid #${line.color}; flex-grow:1;" value="${line.text}" oninput="updateLineTextFR(${isDesc}, ${index}, this.value)" placeholder="Saisissez le texte..." />${toolsFR}</div>${enRow}</div>`;
        container.appendChild(div);
    }); processAndCompileQBC();
}

function renderFormLines() { 
    const toggleEl = document.getElementById('loginEnglishToggle');
    const isGlobalEng = toggleEl ? toggleEl.checked : false;
    buildFormRows(false, qbcDatabase[activeServerId].loginLines, isGlobalEng); 
}

function renderDescFormLines() { 
    const toggleEl = document.getElementById('descEnglishToggle');
    const isGlobalEng = toggleEl ? toggleEl.checked : false;
    buildFormRows(true, qbcDatabase[activeServerId].descLines, isGlobalEng); 
}

function updateLineBorderStyle(isDesc, i, style) {
    if (isDesc) qbcDatabase[activeServerId].descLines[i].border_style = style;
    else qbcDatabase[activeServerId].loginLines[i].border_style = style;
    saveToLocalStorage();
    if (isDesc) renderDescFormLines(); else renderFormLines();
}

function translateAllActiveLines() {
    const isLogin = currentActiveTab === 'login';
    const list = isLogin ? qbcDatabase[activeServerId].loginLines : qbcDatabase[activeServerId].descLines;
    let delay = 0;
    list.forEach((line, index) => {
        if (isLogin && index === 0) return;
        setTimeout(() => { 
            line.show_english = true;
            autoTranslateLine(!isLogin, index); 
        }, delay);
        delay += 350; 
    });
}

function processAndCompileQBC() {
    const isLogin = currentActiveTab === 'login'; if (!qbcDatabase[activeServerId]) activeServerId = Object.keys(qbcDatabase);
    const currentLines = isLogin ? qbcDatabase[activeServerId].loginLines : qbcDatabase[activeServerId].descLines;
    const isGlobalEnglish = isLogin ? isLoginEnglishActive : isDescEnglishActive; const limit = isLogin ? 3500 : 4000; let masterPayload = "";
    
    currentLines.forEach((line, index) => {
        let textFR = line.text ? line.text.trim() : ""; let textEN = line.text_en ? line.text_en.trim() : "";
        let fullFR = textFR; if (line.symbol && line.symbol.trim() !== "") fullFR = line.symbol + " " + textFR + " " + line.symbol;
        if(line.style_fr?.u) fullFR = "[u]" + fullFR + "[/u]"; if(line.style_fr?.b) fullFR = "[b]" + fullFR + "[/b]";
        let chunkFR = "[" + line.color + "]" + fullFR + "[-]"; const isEnglishActive = line.show_english || isGlobalEnglish;
        
        if (isEnglishActive && textEN !== "" && !(isLogin && index === 0)) {
            let fullEN = textEN; if (line.symbol && line.symbol.trim() !== "") fullEN = line.symbol + " " + textEN + " " + line.symbol;
            if(line.style_en?.u) fullEN = "[u]" + fullEN + "[/u]"; if(line.style_en?.b) fullEN = "[b]" + fullEN + "[/b]";
            masterPayload += chunkFR + " | [" + line.color + "]" + fullEN + "[-]";
        } else { masterPayload += chunkFR; }
        
        if (line.border_style && line.border_style !== "none") {
            let lineChar = "═";
            if (line.border_style === "single") lineChar = "─";
            if (line.border_style === "dash") lineChar = "-";
            if (line.border_style === "dot") lineChar = ".";
            let separatorBlock = lineChar.repeat(64);
            masterPayload += "\\n[" + line.color + "]" + separatorBlock + "[-]";
        }
        if (index < currentLines.length - 1) masterPayload += "\\n";
    });
    
    document.getElementById('masterOutput').value = masterPayload; 
    let htmlContent = masterPayload.replace(/\\n/g, '\n').replace(/\[([0-9a-fA-F]{6})\](.*?)\[-\]/g, '<span style="color:#$1;">$2</span>').replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>').replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>');
    document.getElementById('preview').innerHTML = htmlContent; const total = masterPayload.length;
    const counterEl = document.getElementById(isLogin ? 'totalCharCounter' : 'totalDescCharCounter'), alertEl = document.getElementById(isLogin ? 'alertBox' : 'descAlertBox');
    counterEl.innerText = "TOTAL : " + total + " / " + limit + " CHARS"; counterEl.style.color = total > limit ? "#f87171" : "#34d399"; alertEl.style.display = total > limit ? "block" : "none";
}
/* ==========================================================================
   === SCRIPT.JS : BLOC 5 SUR 5 === [ MÉMOIRE PERSISTANTE, ZOOM ET EXPEDITION ] ===
   ========================================================================== */
function saveToLocalStorage() { 
    localStorage.setItem("qbc_matrix_data", JSON.stringify(qbcDatabase)); 
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem("qbc_matrix_data");
    if (saved) {
        try {
            qbcDatabase = JSON.parse(saved);
            const serverIds = Object.keys(qbcDatabase);
            const selectEl = document.getElementById('serverSelect'); selectEl.innerHTML = "";
            serverIds.forEach(id => { const opt = document.createElement('option'); opt.value = id; opt.innerText = qbcDatabase[id].name || id.toUpperCase(); selectEl.appendChild(opt); });
            activeServerId = serverIds.includes(activeServerId) ? activeServerId : serverIds[0]; selectEl.value = activeServerId;
            document.getElementById('qbcTimeTrackerText').innerText = "💾 RESTAURATION AUTOMATIQUE DE TON TRAVAIL ACTIVE !";
        } catch(e) { console.error("Erreur LocalStorage"); }
    }
}

function exportQbcConfig() { const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(qbcDatabase, null, 4)); const anchor = document.createElement('a'); anchor.setAttribute("href", dataStr); anchor.setAttribute("download", "qbc-backup.json"); document.body.appendChild(anchor); anchor.click(); anchor.remove(); }
function triggerJsonImport() { document.getElementById('jsonFileInput').click(); }

function importQbcConfig(event) {
    const files = event.target.files; if (!files || files.length === 0) return; const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsedData = JSON.parse(e.target.result), serverIds = Object.keys(parsedData); if (serverIds.length === 0) return;
            serverIds.forEach(id => {
                const s = parsedData[id];
                if (s.loginLines) s.loginLines.forEach(l => { if(!l.style_fr) l.style_fr={u:false,b:false}; if(!l.style_en) l.style_en={u:false,b:false}; l.show_english = !!(l.text_en && l.text_en.trim() !== ""); });
                if (s.descLines) s.descLines.forEach(l => { if(!l.style_fr) l.style_fr={u:false,b:false}; if(!l.style_en) l.style_en={u:false,b:false}; l.show_english = !!(l.text_en && l.text_en.trim() !== ""); });
            });
            const oldId = activeServerId; const selectEl = document.getElementById('serverSelect'); selectEl.innerHTML = "";
            serverIds.forEach(id => { const opt = document.createElement('option'); opt.value = id; opt.innerText = parsedData[id].name || id.toUpperCase(); selectEl.appendChild(opt); });
            qbcDatabase = parsedData; activeServerId = serverIds.includes(oldId) ? oldId : serverIds[0]; selectEl.value = activeServerId;
            
            saveToLocalStorage(); 
            const d = new Date();
            document.getElementById('qbcTimeTrackerText').innerText = "[ ARCHIVE REÇUE LE : " + d.toLocaleDateString('fr-FR') + " à " + d.toLocaleTimeString('fr-FR') + " ] - " + qbcDatabase[activeServerId].name;
            
            if (currentActiveTab === 'login') renderFormLines(); else renderDescFormLines();
            event.target.value = ''; alert("IMPORTATION REUSSIE AVEC SUCCES");
        } catch (err) { alert("ERREUR LECTURE JSON"); }
    }; 
    const targetFile = files.item(0); reader.readAsText(targetFile);
}

function copyMasterPayload() { const output = document.getElementById('masterOutput'); output.select(); document.execCommand('copy'); alert('CHAINE COPIEE AVEC SUCCES'); }

// CONFIGURATION DU VARIATEUR AUTOMATIQUE POUR COMPACTER LE SITE SANS CASSER LE DESIGN
function changeUiZoom(zoomValue) {
    document.body.style.zoom = zoomValue + "%";
    document.body.style.transform = "scale(" + (zoomValue / 100) + ")";
    document.body.style.transformOrigin = "top center";
}

// ALLUMAGE INTERNE DU COCKPIT D'ESSAI
changeUiZoom(80);
loadFromLocalStorage();
renderFormLines();


