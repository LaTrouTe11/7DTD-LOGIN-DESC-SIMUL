/* ==========================================================================
   === MODULE 1 : SCRIPT-MAIN.JS (Gestion Globale, Données et Interface) ===
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

// 2. INITIALISATION ET GESTION DES ONGLETS
document.addEventListener("DOMContentLoaded", () => {
    loadFromLocalStorage();
    initZoom();
    switchTab(currentActiveTab);
    
    // Attachement des événements globaux
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

// 3. FONCTION DE MISE À JOUR SYNCHRONISÉE
function refreshAllViews() {
    // Déclenche le rendu des formulaires (généré localement selon l'onglet actif)
    if (currentActiveTab === 'login') {
        renderFormLines();
    } else {
        renderDescFormLines();
    }
    
    // Déclenche la mise à jour de l'aperçu (Module 2) s'il existe
    if (typeof updateLivePreview === "function") {
        updateLivePreview();
    }
    
    // Déclenche la génération du code final (Module 3) s'il existe
    if (typeof generateMasterPayload === "function") {
        generateMasterPayload();
    }
}

// 4. MEMOIRE PERSISTANTE (LOCALSTORAGE)
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
                // Sécurité String pure
                activeServerId = serverIds.includes(activeServerId) ? activeServerId : serverIds[0]; 
                selectEl.value = activeServerId;
            }
        } catch(e) { console.error("Erreur LocalStorage", e); }
    }
}

// 5. IMPORTATION ET EXPORTATION JSON
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
            alert("IMPORTATION RÉUSSIE !");
        } catch (err) { alert("ERREUR LECTURE JSON"); }
    }; 
    reader.readAsText(files.item(0));
}

// 6. GESTION DU ZOOM DE L'INTERFACE
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


