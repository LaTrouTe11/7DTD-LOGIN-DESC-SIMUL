/* ==========================================================================
   === MODULE 2 : SCRIPT-PREVIEW.JS (Rendu de l'Aperçu Écran en Temps Réel) ===
   ========================================================================== */

function updateLivePreview() {
    const currentServer = qbcDatabase[activeServerId];
    if (!currentServer) return;

    // 1. RENDER APERÇU LOGIN (FR et EN)
    const loginFrScreen = document.getElementById('loginPreviewFr');
    const loginEnScreen = document.getElementById('loginPreviewEn');
    
    if (loginFrScreen) {
        loginFrScreen.innerHTML = "";
        currentServer.loginLines.forEach(line => {
            const div = document.createElement('div');
            div.style.color = "#" + (line.color || "ffffff");
            div.style.fontWeight = line.bold_fr ? "bold" : "normal";
            div.innerText = (line.symbol_start || "") + " " + (line.text_fr || "");
            loginFrScreen.appendChild(div);
        });
    }

    if (loginEnScreen) {
        loginEnScreen.innerHTML = "";
        currentServer.loginLines.forEach(line => {
            if (line.show_english) {
                const div = document.createElement('div');
                div.style.color = "#" + (line.color_en || "ffffff");
                div.style.fontWeight = line.bold_en ? "bold" : "normal";
                div.innerText = (line.symbol_en_start || "") + " " + (line.text_en || "");
                loginEnScreen.appendChild(div);
            }
        });
    }

    // 2. RENDER APERÇU DESCRIPTION (FR et EN)
    const descFrScreen = document.getElementById('descPreviewFr');
    const descEnScreen = document.getElementById('descPreviewEn');

    if (descFrScreen) {
        descFrScreen.innerHTML = "";
        currentServer.descLines.forEach(line => {
            const div = document.createElement('div');
            div.style.color = "#" + (line.color || "ffffff");
            div.style.fontWeight = line.bold_fr ? "bold" : "normal";
            div.innerText = (line.symbol_start || "") + " " + (line.text_fr || "");
            descFrScreen.appendChild(div);
        });
    }

    if (descEnScreen) {
        descEnScreen.innerHTML = "";
        currentServer.descLines.forEach(line => {
            if (line.show_english) {
                const div = document.createElement('div');
                div.style.color = "#" + (line.color_en || "ffffff");
                div.style.fontWeight = line.bold_en ? "bold" : "normal";
                div.innerText = (line.symbol_en_start || "") + " " + (line.text_en || "");
                descEnScreen.appendChild(div);
            }
        });
    }
}


