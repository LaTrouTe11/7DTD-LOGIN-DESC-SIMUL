/* ==========================================================================
   === MODULE CENTRAL DE TRADUCTION CHIRURGICALE GOOGLE — LIGNE PAR LIGNE ===
   ========================================================================== */

function executerTraductionQBC(isDesc, index, texteATraduire, prefixe) {
    const isLogin = !isDesc;
    const linesList = isLogin ? qbcDatabase[activeServerId].loginLines : qbcDatabase[activeServerId].descLines;
    if (!linesList || !linesList[index]) return;
    const line = linesList[index];

    let textePropre = texteATraduire.trim();
    if (textePropre === "" || textePropre === "...") return;

    // COUVRE-SYMBOLE : On protège / et : pour forcer Google à traduire l'entièreté des rajouts de mots
    textePropre = textePropre.replace(/\//g, "SLASHTOKEN ").replace(/:/g, " COLONTOKEN");

    // L'URL OFFICIELLE ET BRUTE DE L'INFRASTRUCTURE MONDIALE GOOGLE TRANSLATE
    const urlMoteurGoogle = "https://googleapis.com" + encodeURIComponent(textePropre);

    fetch(urlMoteurGoogle)
        .then(reponse => reponse.json())
        .then(donnees => {
            // Décompression chirurgicale de la première ligne de texte traduite dans l'arbre JSON de Google
            if (donnees && donnees[0] && donnees[0][0] && donnees[0][0][0]) {
                let texteTraduit = donnees[0][0][0];

                // RESTAURATION STRICTE DES SYMBOLES ET COMMANDES DE CHAT 7DTD
                texteTraduit = texteTraduit.replace(/SLASHTOKEN/gi, "/").replace(/COLONTOKEN/gi, ":");
                texteTraduit = texteTraduit.replace(/\/ /g, "/").replace(/ \//g, "/");
                texteTraduit = texteTraduit.replace(/ :/g, " :").replace(/: /g, ": ");

                // NETTOYAGE DES ACCENTS MAJUSCULES (É -> E, À -> A) POUR TEXTMESHPRO 7DTD
                texteTraduit = texteTraduit.replace(/[ÉÈÊËéèêë]/g, "E")
                                           .replace(/[ÀÂÄàâä]/g, "A")
                                           .replace(/[ÔÖôö]/g, "O");

                // Enregistrement chirurgical uniquement sur la ligne désirée !
                line.text_en = prefixe + texteTraduit;
                line.show_english = true;

                // Rafraîchissement graphique immédiat de l'onglet actif
                if (isDesc) renderDescFormLines(); else renderFormLines();
            }
        })
        .catch(erreur => {
            // RECOURS SÉCURISÉ : Si Google sature temporairement, ON N'ÉCRASE PLUS l'ancienne case anglaise !
            // Le script refuse de remplacer ton texte anglais actuel par du français.
            console.error("Temporisation réseau Google sur la ligne " + (index + 1), erreur);
        });
}





