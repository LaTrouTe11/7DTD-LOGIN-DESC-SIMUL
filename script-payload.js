/* ==========================================================================
   === MODULE 3 : SCRIPT-PAYLOAD.JS (Génération et Copie du Code Final) ===
   ========================================================================== */

function generateMasterPayload() {
    const currentServer = qbcDatabase[activeServerId];
    if (!currentServer) return;

    let payloadParts = [];

    // Compilation des lignes de Login
    currentServer.loginLines.forEach(line => {
        let frPart = `[${line.color || "ffffff"}]${line.symbol_start || ""}${line.text_fr || ""}`;
        let enPart = line.show_english ? `\\n[${line.color_en || "ffffff"}]${line.symbol_en_start || ""}${line.text_en || ""}` : "";
        payloadParts.push(frPart + enPart);
    });

    // Liaison et affichage dans le champ Master Output
    const finalPayloadString = payloadParts.join("\\n");
    const outputField = document.getElementById('masterOutput');
    if (outputField) {
        outputField.value = finalPayloadString;
    }
}

function copyMasterPayload() { 
    const output = document.getElementById('masterOutput'); 
    if (output && output.value.trim() !== "") {
        output.select(); 
        output.setSelectionRange(0, 99999); // Sécurité Mobile
        document.execCommand('copy'); 
        alert('📋 CODE PAYLOAD COPIÉ AVEC SUCCÈS !'); 
    } else {
        alert('⚠️ Rien à copier, le code final est vide !');
    }
}


