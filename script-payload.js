/* ==========================================================================
   === MODULE : SCRIPT-PAYLOAD.JS — PARTIE 1 === [ COMPILATEUR FR TEXTMESH ] ===
   ========================================================================== */
function processAndCompileQBC() {
    const isLogin = (currentActiveTab === 'login'); 
    
    // FIX SÉCURITÉ ABSOLUE : Force une chaîne texte pure pour empêcher le crash de l'aperçu
    if (!activeServerId || typeof activeServerId !== 'string' || !qbcDatabase[activeServerId]) {
        activeServerId = '7dtd_core';
    }
    
    const currentLines = isLogin ? qbcDatabase[activeServerId].loginLines : qbcDatabase[activeServerId].descLines;
    if (!currentLines || !Array.isArray(currentLines)) return; 
    
    const isGlobalEnglish = isLogin ? isLoginEnglishActive : isDescEnglishActive; 
    const limit = isLogin ? 3500 : 4000; 
    let masterPayload = "";
    
    currentLines.forEach((line, index) => {
        if (!line) return;
        let textFR = line.text ? line.text.trim() : ""; 
        let textEN = line.text_en ? line.text_en.trim() : "";
        
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
        let chunkFR = "[" + line.color + "]" + fullFR + "[-]"; 
        const isEnglishActive = line.show_english || isGlobalEnglish;
/* ==========================================================================
   === MODULE : SCRIPT-PAYLOAD.JS — PARTIE 2 === [ COMPILATEUR EN & PAYLOAD ] ===
   ========================================================================== */
        // --- COMPILATION DU BLOC ANGLAIS CROISÉ SANS BOUCLE INFINIE ---
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
            masterPayload += "\\n[" + line.color + "]" + separatorBlock + "[-]";
        }
        if (index < currentLines.length - 1) masterPayload += "\\n";
    });
    
    // ENVOI SÉCURISÉ DANS L'INTERRUPTEUR GRAPHIQUE HTML
    const outEl = document.getElementById('masterOutput'); 
    if (outEl) outEl.value = masterPayload; 
    
    // TRADUCTION DU CODE EN HTML VISUEL POUR L'APERÇU GRAPHIQUE
    let htmlContent = masterPayload.replace(/\\n/g, '\n')
                                   .replace(/\[([0-9a-fA-F]{6})\](.*?)\[-\]/g, '<span style="color:#$1;">$2</span>')
                                   .replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>')
                                   .replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>');
                                   
    const prevEl = document.getElementById('preview'); 
    if (prevEl) prevEl.innerHTML = htmlContent; 
    
    // CALCUL DU COMPTEUR ET AFFICHAGE DES ALERTES DE LIMITES
    const total = masterPayload.length;
    const counterEl = document.getElementById(isLogin ? 'totalCharCounter' : 'totalDescCharCounter');
    const alertEl = document.getElementById(isLogin ? 'alertBox' : 'descAlertBox');
    
    if (counterEl) { 
        counterEl.innerText = "TOTAL : " + total + " / " + limit + " CHARS"; 
        counterEl.style.color = total > limit ? "#f87171" : "#34d399"; 
    }
    if (alertEl) alertEl.style.display = total > limit ? "block" : "none";
}

// DECLARATION PROPRE POUR LE SCRIPT DE DIAGNOSTIC
function generateMasterPayload() {
    processAndCompileQBC();
}

// SOUDURE MAÎTRESSE EN RACINE LIBRE : Totalement isolée des accolades fermées
window.processAndCompileQBC = processAndCompileQBC;
window.generateMasterPayload = generateMasterPayload;




