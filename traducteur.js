/* ==========================================================================
   === MODULE CENTRAL DE TRADUCTION ASYNCHRONE — INFRASTRUCTURE SOUVERAINE ===
   ========================================================================== */

function executerTraductionQBC(isDesc, index, texteA-Traduire, prefixe) {
    const isLogin = !isDesc;
    const linesList = isLogin ? qbcDatabase[activeServerId].loginLines : qbcDatabase[activeServerId].descLines;
    if (!linesList || !linesList[index]) return;
    const line = linesList[index];

    // NETTOYAGE ET SÉCURISATION DU TEXTE AVANT ENVOI SANS COUPURE RE-MÉLANGÉE
    let textePropre = texteA-Traduire.trim();
    
    // API SECRÈTE DE TRADUCTION DE MASSE SANS CLÉ (LINGVA OPEN-SOURCE)
    const urlMoteur = "https://lingva.ml" + encodeURIComponent(textePropre);

    fetch(urlMoteur)
        .then(reponse => response.json())
        .then(donnees => {
            if (donnees && donnees.translation) {
                let texteTraduit = donnees.translation;

                // NETTOYAGE ABSOLU DES ACCENTS ANGLAIS SUR LES MAJUSCULES (É -> E, À -> A) POUR 7DTD
                texteTraduit = texteTraduit.replace(/[ÉÈÊËéèêë]/g, "E")
                                           .replace(/[ÀÂÄàâä]/g, "A")
                                           .replace(/[ÔÖôö]/g, "O");

                // Restauration propre de la syntaxe des commandes de serveurs 7DTD
                texteTraduit = texteTraduit.replace(/\/ /g, "/").replace(/ \//g, "/");
                texteTraduit = texteTraduit.replace(/ :/g, " :").replace(/: /g, ": ");

                // Réassemblage final de votre phrase complète
                line.text_en = prefixe + texteTraduit;
                line.show_english = true;

                // Rafraîchissement instantané du visuel
                if (isDesc) renderDescFormLines(); else renderFormLines();
            }
        })
        .catch(erreur => {
            // Sécurité absolue anti-plantage : En cas de coupure, recopie le FR temporairement
            line.text_en = prefixe + textePropre;
            if (isDesc) renderDescFormLines(); else renderFormLines();
        });
}



