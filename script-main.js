/* ==========================================================================
   === SCRIPT-MAIN.JS : PARTIE A === [ CORE APPLICATIF & REGISTRES ]      ===
   ========================================================================== */

// 1. BASE DE DONNÉES ET CONFIGURATION PAR DÉFAUT
let qbcDatabase = {
    "7dtd_core": {
        name: "🔴 SERVEUR PRINCIPAL (7DTD)",
        loginLines: [
            { text_fr: "BIENVENUE SUR NOTRE SERVEUR !", text_en: "WELCOME TO OUR SERVER!", color: "ff0000", color_en: "ff0000", bold_fr: true, bold_en: true, show_english: true, symbol_start: "🔥", symbol_en_start: "🔥" }
        ],
        descLines: [
            { text_fr: "Description du serveur ici...", text_en: "Server description here...", color: "ffffff", color_en: "ffffff", bold_fr: false, bold_en: false, show_english: true }
        ]
    }
};

let activeServerId = "7dtd_core";
let currentActiveTab = "login"; // 'login' ou 'desc'

// 2. INITIALISATION ET GESTION DES ONGLETS D'USINE
document.addEventListener("DOMContentLoaded", () => {
    loadFromLocalStorage();
    initZoom();
    switchTab(currentActiveTab);
    
    // Raccordement direct de la liste de sélection de serveurs
    document.getElementById('serverSelect')?.addEventListener('change', (e) => {
        activeServerId = e.target.value;
        refreshAllViews();
    });
});

function switchTab(tabName) {
    currentActiveTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (tabName === 'login') {
        document.getElementById('btnTabLogin')?.classList.add('active');
        document.getElementById('loginFormContainer').style.display = 'block';
        document.getElementById('descFormContainer').style.display = 'none';
    } else {
        document.getElementById('btnTabDesc')?.classList.add('active');
        document.getElementById('loginFormContainer').style.display = 'none';
        document.getElementById('descFormContainer').style.display = 'block';
    }
    refreshAllViews();
}

// 3. FONCTION DE MISE À ZONE SYNCHRONISÉE
function refreshAllViews() {
    if (currentActiveTab === 'login') {
        renderFormLines();
    } else {
        renderDescFormLines();
    }
    
    if (typeof updateLivePreview === "function") {
        updateLivePreview();
    }
    
    if (typeof generateMasterPayload === "function") {
        generateMasterPayload();
    }
}
/* ==========================================================================
   === SCRIPT-MAIN.JS : PARTIE B === [ CONSTRUCTEURS & PERSISTANCE LOCALE ] ===
   ========================================================================== */

// 4. CONSTRUCTION DYNAMIQUE DES LIGNES (LOGIN)
function renderFormLines() {
    const container = document.getElementById('loginLinesInputsContainer');
    if (!container) return;
    container.innerHTML = "";
    
    const server = qbcDatabase[activeServerId];
    if (!server || !server.loginLines) return;
    
    server.loginLines.forEach((line, index) => {
        const div = document.createElement('div');
        div.className = "line-item-box";
        div.innerHTML = `
            <div style="display:flex; gap:10px; margin-bottom:5px; align-items:center;">
                <strong>Ligne #${index + 1} (FR) :</strong>
                <input type="text" value="${line.symbol_start || ''}" placeholder="Symbole" style="width:50px;" oninput="updateLineData('login', ${index}, 'symbol_start', this.value)">
                <input type="text" value="${line.text_fr || ''}" placeholder="Texte Français" style="flex:1;" oninput="updateLineData('login', ${index}, 'text_fr', this.value)">
                <input type="color" value="#${line.color || 'ffffff'}" onchange="updateLineData('login', ${index}, 'color', this.value.replace('#',''))">
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
                <label><input type="checkbox" ${line.show_english ? 'checked' : ''} onchange="updateLineData('login', ${index}, 'show_english', this.checked)"> Anglais</label>
                <input type="text" value="${line.symbol_en_start || ''}" placeholder="Symbole EN" style="width:50px; display:${line.show_english ? 'block' : 'none'};" oninput="updateLineData('login', ${index}, 'symbol_en_start', this.value)">
                <input type="text" value="${line.text_en || ''}" placeholder="Texte Anglais" style="flex:1; display:${line.show_english ? 'block' : 'none'};" oninput="updateLineData('login', ${index}, 'text_en', this.value)">
                <input type="color" value="#${line.color_en || 'ffffff'}" style="display:${line.show_english ? 'block' : 'none'};" onchange="updateLineData('login', ${index}, 'color_en', this.value.replace('#',''))">
                <button type="button" class="btn-danger" onclick="deleteLine('login', ${index})">❌</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// 5. CONSTRUCTION DYNAMIQUE DES LIGNES (DESCRIPTION)
function renderDescFormLines() {
    const container = document.getElementById('descLinesInputsContainer');
    if (!container) return;
    container.innerHTML = "";
    
    const server = qbcDatabase[activeServerId];
    if (!server || !server.descLines) return;
    
    server.descLines.forEach((line, index) => {
        const div = document.createElement('div');
        div.className = "line-item-box";
        div.innerHTML = `
            <div style="display:flex; gap:10px; margin-bottom:5px; align-items:center;">
                <strong>Ligne #${index + 1} (FR) :</strong>
                <input type="text" value="${line.symbol_start || ''}" placeholder="Symbole" style="width:50px;" oninput="updateLineData('desc', ${index}, 'symbol_start', this.value)">
                <input type="text" value="${line.text_fr || ''}" placeholder="Texte Français" style="flex:1;" oninput="updateLineData('desc', ${index}, 'text_fr', this.value)">
                <input type="color" value="#${line.color || 'ffffff'}" onchange="updateLineData('desc', ${index}, 'color', this.value.replace('#',''))">
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
                <label><input type="checkbox" ${line.show_english ? 'checked' : ''} onchange="updateLineData('desc', ${index}, 'show_english', this.checked)"> Anglais</label>
                <input type="text" value="${line.symbol_en_start || ''}" placeholder="Symbole EN" style="width:50px; display:${line.show_english ? 'block' : 'none'};" oninput="updateLineData('desc', ${index}, 'symbol_en_start', this.value)">
                <input type="text" value="${line.text_en || ''}" placeholder="Texte Anglais" style="flex:1; display:${line.show_english ? 'block' : 'none'};" oninput="updateLineData('desc', ${index}, 'text_en', this.value)">
                <input type="color" value="#${line.color_en || 'ffffff'}" style="display:${line.show_english ? 'block' : 'none'};" onchange="updateLineData('desc', ${index}, 'color_en', this.value.replace('#',''))">
                <button type="button" class="btn-danger" onclick="deleteLine('desc', ${index})">❌</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// 6. ACTIONS DIRECTES SUR LES LIGNES (AJOUT, MODIFICATION, SUPPRESSION)
function updateLineData(type, index, key, value) {
    const server = qbcDatabase[activeServerId];
    const lines = type === 'login' ? server.loginLines : server.descLines;
    if (lines && lines[index]) {
        lines[index][key] = value;
        saveToLocalStorage();
        if (key === 'show_english') {
            if (type === 'login') renderFormLines(); else renderDescFormLines();
        }
        if (typeof updateLivePreview === "function") updateLivePreview();
        if (typeof generateMasterPayload === "function") generateMasterPayload();
    }
}

function addLine(type) {
    const server = qbcDatabase[activeServerId];
    const lines = type === 'login' ? server.loginLines : server.descLines;
    if (lines) {
        lines.push({ text_fr: "", text_en: "", color: "ffffff", color_en: "ffffff", bold_fr: false, bold_en: false, show_english: false });
        saveToLocalStorage();
        refreshAllViews();
    }
}

function deleteLine(type, index) {
    const server = qbcDatabase[activeServerId];
    const lines = type === 'login' ? server.loginLines : server.descLines;
    if (lines && lines.length > 0) {
        lines.splice(index, 1);
        saveToLocalStorage();
        refreshAllViews();
    }
}

// 7. SYSTÈMES EXTÉRIEURS ET PERSISTANCE MÉMOIRE
function saveToLocalStorage() { 
    localStorage.setItem("qbc_matrix_data", JSON.stringify(qbcDatabase)); 
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem("qbc_matrix_data");
    if (saved) {
        try {
            qbcDatabase = JSON.parse(saved);
            const serverIds = Object.keys(qbcDatabase);
            const selectEl = document.getElementById('serverSelect'); 
            if (selectEl && serverIds.length > 0) {
                selectEl.innerHTML = "";
                serverIds.forEach(id => { 
                    const opt = document.createElement('option'); 
                    opt.value = id; 
                    opt.innerText = qbcDatabase[id].name || id.toUpperCase(); 
                    selectEl.appendChild(opt); 
                });
                activeServerId = serverIds.includes(activeServerId) ? activeServerId : serverIds[0]; 
                selectEl.value = activeServerId;
            }
        } catch(e) { console.error("Erreur LocalStorage", e); }
    }
}

// 8. FONCTIONS D'ÉCHANGE ET EXPORTATIONS JSON
function exportQbcConfig() { 
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(qbcDatabase, null, 4)); 
    const anchor = document.createElement('a'); 
    anchor.setAttribute("href", dataStr); 
    anchor.setAttribute("download", "qbc-backup.json"); 
    document.body.appendChild(anchor); 
    anchor.click(); 
    anchor.remove(); 
}

function triggerJsonImport() { 
    document.getElementById('jsonFileInput')?.click(); 
}

function importQbcConfig(event) {
    const files = event.target.files; 
    if (!files || files.length === 0) return; 
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsedData = JSON.parse(e.target.result);
            const serverIds = Object.keys(parsedData); 
            if (serverIds.length === 0) return;
            
            qbcDatabase = parsedData;
            activeServerId = serverIds[0];
            
            const selectEl = document.getElementById('serverSelect'); 
            if (selectEl) {
                selectEl.innerHTML = "";
                serverIds.forEach(id => { 
                    const opt = document.createElement('option'); 
                    opt.value = id; 
                    opt.innerText = qbcDatabase[id].name || id.toUpperCase(); 
                    selectEl.appendChild(opt); 
                });
                selectEl.value = activeServerId;
            }
            saveToLocalStorage(); 
            refreshAllViews();
            alert("IMPORTATION RÉUSSIE SANS ERREUR !");
        } catch (err) { alert("ERREUR LECTURE JSON"); }
    }; 
    reader.readAsText(files.item(0));
}

// 9. REGLAGES ET ALLUMAGE DE L'ÉCRAN COMPACT
function initZoom() {
    const savedZoom = localStorage.getItem("qbc_preferred_zoom") || "80";
    const zoomSelectEl = document.getElementById("uiZoomSelect");
    if (zoomSelectEl) {
        zoomSelectEl.value = savedZoom;
        changeUiZoom(savedZoom);
    }
}

function changeUiZoom(zoomValue) {
    document.body.style.zoom = zoomValue + "%";
    document.body.style.transform = "scale(" + (zoomValue / 100) + ")";
    document.body.style.transformOrigin = "top center";
    localStorage.setItem("qbc_preferred_zoom", zoomValue);
}


