/* ==========================================================================
   === MODULE CENTRAL DE TRADUCTION INDIVIDUELLE GOOGLE — INJECTION SANS CORS ===
   ========================================================================== */

function executerTraductionQBC(isDesc, index, texteATraduire, prefixe) {
    const isLogin = !isDesc;
    const linesList = isLogin ? qbcDatabase[activeServerId].loginLines : qbcDatabase[activeServerId].descLines;
    if (!linesList || !linesList[index]) return;
    const line = linesList[index];

    let textePropre = texteATraduire.trim();
    if (textePropre === "" || textePropre === "...") return;

    // PROTECTION DES CARACTÈRES SPÉCIAUX POUR LES COMMANDES DE CHAT 7DTD
    textePropre = textePropre.replace(/\//g, "SLASHTOKEN ").replace(/:/g, " COLONTOKEN");

    // Supprime l'ancien pont s'il existe déjà dans la page
    const oldScript = document.getElementById("qbcInvisibleTranslator");
    if (oldScript) oldScript.remove();

    // RACCORDEMENT DU CALLBACK MAÎTRE POUR LIRE L'ARBRE DE DONNÉES DE GOOGLE
    window.qbcGoogleCallback = function(data) {
        try {
            // EXTRACTION CHIURGICALE EXACTE DU TEXTE GOOGLE DANS LA MATRICE MULTI-CROCHETS
            if (data && data[0] && data[0][0] && data[0][0][0]) {
                let texteTraduit = data[0][0][0];

                // RESTAURATION STRICTE DES SYMBOLES ET DES ENTRAÎNEMENTS 7DTD
                texteTraduit = texteTraduit.replace(/SLASHTOKEN/gi, "/").replace(/COLONTOKEN/gi, ":");
                texteTraduit = texteTraduit.replace(/\/ /g, "/").replace(/ \//g, "/");
                texteTraduit = texteTraduit.replace(/ :/g, " :").replace(/: /g, ": ");

                // NETTOYAGE DES ACCENTS MAJUSCULES (É -> E, À -> A) POUR TEXTMESHPRO
                texteTraduit = texteTraduit.replace(/[ÉÈÊËéèêë]/g, "E")
                                           .replace(/[ÀÂÄàâä]/g, "A")
                                           .replace(/[ÔÖôö]/g, "O");

                // Enregistrement définitif dans ta case anglaise EN
                line.text_en = prefixe + texteTraduit;
                line.show_english = true;

                // Rafraîchissement graphique de l'onglet actif
                if (isDesc) renderDescFormLines(); else renderFormLines();
            }
        } catch(e) {
            console.error("Erreur de décodage Google", e);
        }
        delete window.qbcGoogleCallback;
    };

    // INJECTION DU PONT INVISIBLE POUR PASSER AU-TRAVERS DU FILTRE CHROME SANS ERREUR CORS
    const scriptEl = document.createElement("script");
    scriptEl.id = "qbcInvisibleTranslator";
    scriptEl.src = "https://googleapis.com" + encodeURIComponent(textePropre);
    document.body.appendChild(scriptEl);
}






