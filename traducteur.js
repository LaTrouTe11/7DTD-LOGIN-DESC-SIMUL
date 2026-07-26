/* ==========================================================================
   === MODULE CENTRAL DE TRADUCTION ASYNCHRONE — INFRASTRUCTURE SOUVERAINE ===
   ========================================================================== */

function executerTraductionQBC(isDesc, index, texteATraduire, prefixe) {
    const isLogin = !isDesc;
    const linesList = isLogin ? qbcDatabase[activeServerId].loginLines : qbcDatabase[activeServerId].descLines;
    if (!linesList || !linesList[index]) return;
    const line = linesList[index];

    let textePropre = texteATraduire.trim();
    
    // INFRASTRUCTURE INTERNATIONALE MUTUALISÉE LINGVA OPEN-SOURCE
    const urlMoteur = "https://lingva.ml" + encodeURIComponent(textePropre);

    fetch(urlMoteur)
        .then(reponse => reponse.json())
        .then(donnees => {
            if (donnees && donnees.translation) {
                let texteTraduit = donnees.translation;

                // RESTAURATION NETTE DE LA SYNTAXE DES COMMANDES DE SERVEURS 7DTD
                texteTraduit = texteTraduit.replace(/\/ /g, "/").replace(/ \//g, "/");
                texteTraduit = texteTraduit.replace(/ :/g, " :").replace(/: /g, ": ");

                // ÉRADICATION AUTOMATIQUE DES ACCENTS ANGLAIS SUR LES MAJUSCULES (É -> E, À -> A)
                texteTraduit = texteTraduit.replace(/[ÉÈÊËéèêë]/g, "E")
                                           .replace(/[ÀÂÄàâä]/g, "A")
                                           .replace(/[ÔÖôö]/g, "O");

                // Réassemblage final de votre phrase complète
                line.text_en = prefixe + texteTraduit;
                line.show_english = true;

                // Rafraîchissement visuel instantané du cockpit
                if (isDesc) renderDescFormLines(); else renderFormLines();
            }
        })
        .catch(erreur => {
            // Sécurité anti-plantage : En cas de coupure, recopie le FR par défaut
            line.text_en = prefixe + textePropre;
            if (isDesc) renderDescFormLines(); else renderFormLines();
        });
}




