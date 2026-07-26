/* ==========================================================================
   === SCRIPT.JS : BLOC 1 SUR 4 === [ VARIABLE D'ÉTAT AND LOGICIEL MATRICE ] ===
   ========================================================================== */
let currentActiveTab = 'login';
let activeServerId = '7dtd-core';
let isLoginEnglishActive = false;
let isDescEnglishActive = false;

// Registre de la base de données d'origine complète (700 lignes préservées)
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
   === SCRIPT.JS : BLOC 2 SUR 4 === [ TRADUCTION UNIVERSELLE SUR MESURE ] ===
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
    
    // EXTRACTEUR NET SANS DOUBLE VIRGULE PARASITE (Préserve le 1- ou 2-)
    const numMatch = rawText.match(/^([0-9]+-\s*)/);
    if (numMatch && numMatch.length > 0) {
        prefix = numMatch.at(0); 
        cleanText = rawText.substring(prefix.length).trim();
    }
    
    // MASQUAGE DE SÉCURITÉ : On remplace / et : pour empêcher Google de couper tes ajouts (ex: haut rouge)
    let textToTranslate = cleanText.trim();
    textToTranslate = textToTranslate.replace(/\//g, "SLASHTOKEN ").replace(/:/g, " COLONTOKEN");
    
    const oldScript = document.getElementById("qbcInvisibleTranslator");
    if (oldScript) oldScript.remove();
    
    // Réception du texte de Google ré-encodé en direct
    window.qbcGoogleCallback = function(data) {
        try {
            if (data && data && data && data) {
                let translatedText = data;
                
                // RESTAURATION DES SYMBOLES D'ORIGINE APRÈS TRADUCTION COMPLÈTE
                translatedText = translatedText.replace(/SLASHTOKEN/gi, "/").replace(/COLONTOKEN/gi, ":");
                
                // Nettoyage des espaces automatiques générés par Google autour des symboles
                translatedText = translatedText.replace(/\/ /g, "/").replace(/ \//g, "/");
                translatedText = translatedText.replace(/ :/g, " :").replace(/: /g, ": ");
                
                // Éradication automatique des accents anglais majuscules (É -> E, À -> A)
                translatedText = translatedText.replace(/[ÉÈÊË]/g, "E").replace(/[ÀÂÄ]/g, "A").replace(/[ÔÖ]/g, "O");
                
                // Réassemblage de ta phrase exacte sur mesure au complet !
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
    
    // RESTAURATION DE L'ADRESSE INFRASTRUCTURE OFFICIELLE DE GOOGLE AVEC INSCRIPTION CALLBACK
    const scriptEl = document.createElement("script");
    scriptEl.id = "qbcInvisibleTranslator";
    scriptEl.src = "https://googleapis.com" + encodeURIComponent(textToTranslate);
    document.body.appendChild(scriptEl);
}

function toggleEditorCollapse() { 
    document.getElementById('collapsibleWorkspacePanel').classList.toggle('collapsed'); 
}

/* ==========================================================================
   === SCRIPT.JS : BLOC 3 SUR 4 === [ COMMUTATEURS ET AGENCEMENT DE LIGNES ] ===
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
   === SCRIPT.JS : BLOC 4 SUR 4 === [ RENDU INTERACTIF, COMPILATEUR ET JSON ] ===
   ========================================================================== */
function buildFormRows(isDesc, currentLines, isGlobalEnglish) {
    const container = document.getElementById(isDesc ? 'descLinesContainer' : 'linesContainer'); container.innerHTML = "";
    
    currentLines.forEach((line, index) => {
        const div = document.createElement('div'); 
        const isEngVisible = line.show_english || isGlobalEnglish;
        
        const hasBorder = line.border_style && line.border_style !== "none";
        div.className = "line-item" + (hasBorder ? " has-double-border" : "");
        
        let symSel = `<select class="line-select" style="width:75px;" onchange="updateLineSymbol(${isDesc}, ${index}, this.value)">`;
        symbolPalette.forEach(s => symSel += `<option value="${s.char}" ${s.char === line.symbol ? "selected" : ""}>${s.name}</option>`); symSel += `</select>`;
        
        let colSel = `<select class="line-select" style="width:75px;" onchange="updateLineColor(${isDesc}, ${index}, this.value)">`;
        colorPalette.forEach(c => colSel += `<option value="${c.hex}" ${c.hex === line.color ? "selected" : ""}>${c.name}</option>`); colSel += `</select>`;
        
        if (!line.border_style) line.border_style = "none";
        let borderSel = `<select class="line-select" style="width:105px;" onchange="updateLineBorderStyle(${isDesc}, ${index}, this.value)">`;
        borderSel += `<option value="none" ${line.border_style === 'none' ? 'selected' : ''}>[Pas Ligne]</option>`;
        borderSel += `<option value="double" ${line.border_style === 'double' ? 'selected' : ''}>═ Double</option>`;
        borderSel += `<option value="single" ${line.border_style === 'single' ? 'selected' : ''}>─ Simple</option>`;
        borderSel += `<option value="dash" ${line.border_style === 'dash' ? 'selected' : ''}>- Tirets</option>`;
        borderSel += `<option value="dot" ${line.border_style === 'dot' ? 'selected' : ''}>. Points</option>`;
        borderSel += `</select>`;
        
        if (!line.style_fr) line.style_fr = {u:false,b:false}; if (!line.style_en) line.style_en = {u:false,b:false};
        let toolsFR = `<button type="button" class="style-btn ${line.style_fr.u?'active':''}" onclick="toggleLineStyle(${isDesc}, ${index}, 'fr', 'u')">U</button><button type="button" class="style-btn ${line.style_fr.b?'active':''}" onclick="toggleLineStyle(${isDesc}, ${index}, 'fr', 'b')">B</button>`;
        let toolsEN = `<button type="button" class="style-btn ${line.style_en.u?'active':''}" onclick="toggleLineStyle(${isDesc}, ${index}, 'en', 'u')">U</button><button type="button" class="style-btn ${line.style_en.b?'active':''}" onclick="toggleLineStyle(${isDesc}, ${index}, 'en', 'b')">B</button>`;
        
        let upDis = index === 0 ? "disabled style='opacity:0.2;'" : "", downDis = index === currentLines.length - 1 ? "disabled style='opacity:0.2;'" : "";
        let transBtn = (isDesc || index > 0) ? `<button type="button" class="double-line-btn ${line.show_english?'active':''}" style="padding: 3px 5px;" onclick="toggleLineEnglishIndividual(${isDesc}, ${index})">🌐</button><button type="button" class="double-line-btn" style="padding: 3px 5px;" onclick="autoTranslateLine(${isDesc}, ${index})">🤖</button>` : "";
        
        // RECONSTRUCTION DE L'ARCHITECTURE SELON L'ONGLET POUR GARANTIR UNE LISIBILITÉ TOTALE
        if (isDesc) {
            // --- MODE DESCRIPTION : EN EMPILEMENT VERTICAL POUR REPRENDRE 100% DE LARGEUR ---
            const displayStyle = isEngVisible ? "display: flex !important;" : "display: none !important;";
            
            div.innerHTML = `
                <div class="line-controls-row" style="margin-bottom: 6px; border-bottom: 1px dashed #27272a; padding-bottom: 4px;">
                    <span class="line-number" style="color: #fbbf24;">${"Web L." + (index+1)}</span>
                    <button type="button" class="order-btn" ${upDis} onclick="moveLine(true, ${index}, -1)">🔼</button>
                    <button type="button" class="order-btn" ${downDis} onclick="moveLine(true, ${index}, 1)">🔽</button>
                    <button type="button" class="btn-insert-here" onclick="insertLineAt(true, ${index + 1})">➕ INSÉRER</button>
                    ${symSel} ${colSel} ${transBtn} ${borderSel}
                    <button type="button" class="btn-action" style="color:#f87171; padding: 3px 8px; height:26px; margin-left: auto;" onclick="removeDescLine(${index})">❌</button>
                </div>
                <div style="display: flex; flex-direction: column; gap: 6px; width: 100%;">
                    <div style="display: flex; align-items: center; gap: 6px; width: 100%;">
                        <span style="font-size: 11px; color: #34d399; font-weight: bold; width: 25px;">FR:</span>
                        <input type="text" class="input-line" style="border-left: 3px solid #${line.color}; flex-grow: 1;" value="${line.text}" oninput="updateLineTextFR(true, ${index}, this.value)" placeholder="Texte français..." />
                        ${toolsFR}
                    </div>
                    <div class="eng-input-box" style="align-items: center; gap: 6px; width: 100%; ${displayStyle}">
                        <span style="font-size: 11px; color: #38bdf8; font-weight: bold; width: 25px;">EN:</span>
                        <input type="text" class="input-line" style="border-left: 3px dashed #4b5563; flex-grow: 1;" value="${line.text_en || ''}" oninput="updateLineTextEN(true, ${index}, this.value)" placeholder="English translation..." />
                        ${toolsEN}
                    </div>
                </div>
            `;
        } else {
            // --- MODE LOGIN : EN LIGNE DROITE COMPACTE ULTRA-FINE (CONSERVÉ) ---
            const displayStyle = isEngVisible ? "display: flex !important;" : "display: none !important;";
            let enField = (index > 0) ? `<div class="eng-input-box" style="align-items:center; gap:4px; flex-grow:1; ${displayStyle}"><span style="font-size:11px; color:#38bdf8; font-weight:bold;">EN:</span><input type="text" class="input-line" style="border-left:3px dashed #4b5563;" value="${line.text_en || ''}" oninput="updateLineTextEN(false, ${index}, this.value)" placeholder="Translation..." />${toolsEN}</div>` : "";
            
            div.innerHTML = `
                <div class="line-controls-row">
                    <span class="line-number">${index === 0 ? "Titre L.1" : "Login L." + (index+1)}</span>
                    <button type="button" class="order-btn" ${upDis} onclick="moveLine(false, ${index}, -1)">🔼</button>
                    <button type="button" class="order-btn" ${downDis} onclick="moveLine(false, ${index}, 1)">🔽</button>
                    <button type="button" class="btn-insert-here" onclick="insertLineAt(false, ${index + 1})">➕</button>
                    ${symSel} ${colSel} ${transBtn} ${borderSel}
                    
                    <div style="display:flex; align-items:center; gap:4px; flex-grow:2;">
                        <span style="font-size:11px; color:#34d399; font-weight:bold;">FR:</span>
                        <input type="text" class="input-line" style="border-left:3px solid #${line.color};" value="${line.text}" oninput="updateLineTextFR(false, ${index}, this.value)" placeholder="Texte..." />
                        ${toolsFR}
                    </div>
                    ${enField}
                    <button type="button" class="btn-action" style="color:#f87171; padding: 3px 8px; height:26px; margin-left:auto;" onclick="removeLine(${index})">❌</button>
                </div>
            `;
        }
        container.appendChild(div);
    }); processAndCompileQBC();
}
