import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Routeur Express dédié pour l'API GitHub
const router = express.Router();

// 🚀 ROUTE : SAUVEGARDE DIRECTE AUTOMATIQUE VERS GITHUB
router.post('/save-to-github', async (req, res) => {
  try {
    const { databasePayload } = req.body;
    if (!databasePayload) return res.status(400).json({ error: "Contenu vide" });

    // Récupération des variables d'environnement (du fichier .env) ou headers
    const token = req.headers['x-github-token'] || process.env.GITHUB_TOKEN;
    const repo = req.headers['x-github-repo'] || process.env.GITHUB_REPO || "7DTD-LOGIN-DESC-SIMUL";
    const user = req.headers['x-github-user'] || process.env.GITHUB_USER || "LaTrouTe11";

    // 🔍 Option B : Console.log de vérification des variables au clic
    console.log(`[GitHub API Save] Requête reçue - Utilisateur: "${user}", Dépôt: "${repo}"`);
    console.log(`[GitHub API Save] Statut du Token: ${
      token 
        ? (token.startsWith('ghp_') || token.startsWith('github_pat_') 
            ? `Token valide détecté (${token.substring(0, 7)}...)` 
            : `Token présent mais format atypique (${token.substring(0, 5)}...)`)
        : 'UNDEFINED (Non chargé depuis .env ou absent)'
    }`);

    if (!token || token.includes("TON_TOKEN_ICI")) {
      console.error("[GitHub API Error] GITHUB_TOKEN est undefined ou non configuré.");
      return res.status(400).json({ 
        error: "Jeton GITHUB_TOKEN non configuré dans le fichier .env (Token undefined ou valeur par défaut)" 
      });
    }

    const filePath = "qbc-backup.json";
    const url = `https://api.github.com/repos/${user}/${repo}/contents/${filePath}`;
    const stringData = JSON.stringify(databasePayload, null, 4);
    const base64Content = Buffer.from(stringData).toString('base64');

    // Étape A : Demander à GitHub s'il y a déjà une ancienne version du fichier (pour récupérer son SHA)
    let sha = null;
    const getRes = await fetch(url, {
      headers: { 
        'Authorization': `token ${token}`, 
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'QBC-Matrix-Cockpit'
      }
    });
    
    if (getRes.status === 200) {
      const existingFile = await getRes.json();
      sha = existingFile.sha;
    }

    // Étape B : Pousser la nouvelle mise à jour sur GitHub
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'QBC-Matrix-Cockpit'
      },
      body: JSON.stringify({
        message: "💾 Backup automatique depuis le Cockpit QBC Matrix",
        content: base64Content,
        ...(sha ? { sha } : {})
      })
    });

    if (putRes.status === 200 || putRes.status === 201) {
      console.log(`[GitHub API Save] ✅ Succès ! Sauvegardé sur GitHub (${user}/${repo})`);
      return res.json({ success: true, message: "Fichier sauvegardé sur GitHub !" });
    } else {
      const errData = await putRes.json().catch(() => ({}));
      console.error(`[GitHub API Save] ❌ Erreur GitHub (${putRes.status}):`, errData);
      return res.status(putRes.status || 500).json({ 
        error: errData.message || `Erreur API GitHub (${putRes.status})` 
      });
    }

  } catch (err) {
    console.error("[GitHub API Save Exception]", err);
    res.status(500).json({ error: `Erreur serveur lors de l'envoi : ${err.message}` });
  }
});

// 📥 ROUTE : CHARGEMENT DEPUIS GITHUB
router.get('/load-from-github', async (req, res) => {
  try {
    const token = req.headers['x-github-token'] || process.env.GITHUB_TOKEN;
    const repo = req.headers['x-github-repo'] || process.env.GITHUB_REPO || "7DTD-LOGIN-DESC-SIMUL";
    const user = req.headers['x-github-user'] || process.env.GITHUB_USER || "LaTrouTe11";

    console.log(`[GitHub API Load] Chargement demandé pour "${user}/${repo}"`);
    console.log(`[GitHub API Load] Token: ${token ? 'Présent' : 'Absent (lecture publique)'}`);

    const filePath = "qbc-backup.json";
    const url = `https://api.github.com/repos/${user}/${repo}/contents/${filePath}`;

    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'QBC-Matrix-Cockpit'
    };
    if (token && !token.includes("TON_TOKEN_ICI")) {
      headers['Authorization'] = `token ${token}`;
    }

    const getRes = await fetch(url, { headers });
    if (getRes.status === 200) {
      const fileData = await getRes.json();
      const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
      const jsonContent = JSON.parse(content);
      console.log(`[GitHub API Load] ✅ Données chargées avec succès.`);
      return res.json({ success: true, databasePayload: jsonContent, database: jsonContent, fileName: fileData.name });
    } else {
      const errData = await getRes.json().catch(() => ({}));
      console.error(`[GitHub API Load] ❌ Erreur GitHub (${getRes.status}):`, errData);
      return res.status(getRes.status === 404 ? 404 : 500).json({ error: errData.message || "Fichier introuvable sur GitHub" });
    }
  } catch (err) {
    console.error("[GitHub API Load Exception]", err);
    res.status(500).json({ error: "Erreur lors du chargement depuis GitHub" });
  }
});

// Support pour les requêtes sous /api et sous-dossier /7dtd-simul/api (Nginx proxying)
app.use('/api', router);
app.use('/7dtd-simul/api', router);

// Fichiers statiques
app.use('/7dtd-simul', express.static(__dirname));
app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

