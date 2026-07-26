/* ==========================================================================
   === MODULE CENTRAL DE TRADUCTION INDIVIDUELLE SOUVERAINE — INSTANCE B     ===
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

    // UTILISATION DE L'INFRASTRUCTURE ANONYME DE LINGVA (ÉVITE LE BAN D'IP DE GOOGLE)
    const urlMoteurAlternative = "https://lingva.ml" + encodeURIComponent(textePropre);

    fetch(urlMoteurAlternative)
        .then(reponse => reponse.json())
        .then(donnees => {
            // Extraction directe de la chaîne textuelle nettoyée
            if (donnees && donnees.translation) {
                let texteTraduit = donnees.translation;

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
        })
        .catch(erreur => {
            // En cas de micro-coupure internet, on préserve l'ancienne valeur sans l'effacer
            console.error("Temporisation réseau active sur la ligne " + (index + 1), erreur);
        });
}






