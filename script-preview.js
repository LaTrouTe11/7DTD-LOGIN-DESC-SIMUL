/* ==========================================================================
   === MODULE : SCRIPT-PREVIEW.JS — PARTIE 1 === [ PARSER GRAPHIQUE FR ]  ===
   ========================================================================== */
function updatePreviewBox() {
    const previewEl = document.getElementById('preview');
    if (!previewEl) return;
    
    // Protection d'ID : empêche le freeze au démarrage
    if (!activeServerId || typeof activeServerId !== 'string' || !qbcDatabase[activeServerId]) {
        activeServerId = '7dtd_core';
    }
    
    const isLogin = (currentActiveTab === 'login');
    const currentLines = isLogin ? qbcDatabase[activeServerId].loginLines : qbcDatabase[activeServerId].descLines;
    if (!currentLines || !Array.isArray(currentLines)) {
        previewEl.innerHTML = "";
        return;
    }
    
    const isGlobalEnglish = isLogin ? isLoginEnglishActive : isDescEnglishActive;
    let htmlContent = "";
    
    currentLines.forEach((line, index) => {
        if (!line) return;
        let textFR = line.text ? line.text.trim() : "";
        let textEN = line.text_en ? line.text_en.trim() : "";
        
        if (line.symbol_start === undefined) line.symbol_start = "";
        if (line.symbol === undefined) line.symbol = "";
        if (line.symbol_en_start === undefined) line.symbol_en_start = "";
        if (line.symbol_en_end === undefined) line.symbol_en_end = "";
        if (line.color_en === undefined) line.color_en = line.color || "ffffff";
        
        // --- RENDU BLOC FRANÇAIS ---
        let fullFR = textFR;
        if (line.symbol_start && line.symbol_start.trim() !== "") fullFR = line.symbol_start + " " + fullFR;
        if (line.symbol && line.symbol.trim() !== "") fullFR = fullFR + " " + line.symbol;
        
        let frStyles = "";
        if (line.style_fr && line.style_fr.u) frStyles += "text-decoration:underline;";
        if (line.style_fr && line.style_fr.b) frStyles += "font-weight:bold;";
        
        htmlContent += `<span style="color:#${line.color}; ${frStyles}">${fullFR}</span>`;
/* ==========================================================================
   === MODULE : SCRIPT-PREVIEW.JS — PARTIE 2 === [ PARSER GRAPHIQUE EN & LIENS ] ===
   ========================================================================== */
        const isEnglishActive = line.show_english || isGlobalEnglish;
        
        // --- RENDU BLOC ANGLAIS ASYMÉTRIQUE ---
        if (isEnglishActive && textEN !== "" && !(isLogin && index === 0)) {
            let fullEN = textEN;
            if (line.symbol_en_start && line.symbol_en_start.trim() !== "") fullEN = line.symbol_en_start + " " + fullEN;
            if (line.symbol_en_end && line.symbol_en_end.trim() !== "") fullEN = fullEN + " " + line.symbol_en_end;
            
            let enStyles = "";
            if (line.style_en && line.style_en.u) enStyles += "text-decoration:underline;";
            if (line.style_en && line.style_en.b) enStyles += "font-weight:bold;";
            
            htmlContent += ` <span style="color:#666;">|</span> <span style="color:#${line.color_en}; ${enStyles}">${fullEN}</span>`;
        }
        
        // --- GESTION DES LIGNES ET BORDURES DE SÉPARATION ---
        if (line.border_style && line.border_style !== "none") {
            let lineChar = "═";
            if (line.border_style === "single") lineChar = "─";
            if (line.border_style === "dash") lineChar = "-";
            if (line.border_style === "dot") lineChar = ".";
            let separatorBlock = lineChar.repeat(45);
            htmlContent += `<div style="color:#${line.color}; font-size:11px; margin-top:2px;">${separatorBlock}</div>`;
        } else {
            htmlContent += "<br>";
        }
    });
    
    previewEl.innerHTML = htmlContent;
}

// DECLARATION PROPRE POUR LE SCRIPT DE DIAGNOSTIC
function updateLivePreview() {
    updatePreviewBox();
}

// SOUDURE MAÎTRESSE EN RACINE LIBRE : Totalement isolée des accolades
window.updateLivePreview = updateLivePreview;
window.updatePreviewBox = updatePreviewBox;



