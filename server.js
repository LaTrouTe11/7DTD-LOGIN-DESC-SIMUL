import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// ⚠️ COORDONNÉES GITHUB (Variables d'environnement ou constantes)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "ghp_TON_TOKEN_ICI"; // Jeton d'accès personnel GitHub
const GITHUB_REPO = process.env.GITHUB_REPO || "7DTD-LOGIN-DESC-SIMUL"; // Nom du dépôt
const GITHUB_USER = process.env.GITHUB_USER || "TON_PSEUDO_GITHUB"; // Nom d'utilisateur GitHub

app.use(express.json({ limit: '10mb' })); // Permet de lire les gros fichiers JSON
app.use(express.static(__dirname));

// 🚀 ROUTE : SAUVEGARDE DIRECTE AUTOMATIQUE VERS GITHUB
app.post('/api/save-to-github', async (req, res) => {
  try {
    const { databasePayload } = req.body;
    if (!databasePayload) return res.status(400).json({ error: "Contenu vide" });

    const token = req.headers['x-github-token'] || GITHUB_TOKEN;
    const repo = req.headers['x-github-repo'] || GITHUB_REPO;
    const user = req.headers['x-github-user'] || GITHUB_USER;

    if (!token || token.includes("TON_TOKEN_ICI")) {
      return res.status(400).json({ error: "Jeton GITHUB_TOKEN non configuré dans server.js ou .env" });
    }

    const filePath = "qbc-backup.json"; // Le fichier qui sera créé/écrasé sur ton GitHub
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
      sha = existingFile.sha; // SHA récupéré pour écraser le fichier proprement
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
        ...(sha ? { sha } : {}) // Inclus si le fichier existait déjà
      })
    });

    if (putRes.status === 200 || putRes.status === 201) {
      return res.json({ success: true, message: "Fichier sauvegardé sur GitHub !" });
    } else {
      const errData = await putRes.json();
      return res.status(500).json({ error: errData.message || "Erreur lors de la sauvegarde GitHub" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de l'envoi" });
  }
});

// 📥 ROUTE : CHARGEMENT DEPUIS GITHUB
app.get('/api/load-from-github', async (req, res) => {
  try {
    const token = req.headers['x-github-token'] || GITHUB_TOKEN;
    const repo = req.headers['x-github-repo'] || GITHUB_REPO;
    const user = req.headers['x-github-user'] || GITHUB_USER;

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
      return res.json({ success: true, databasePayload: jsonContent, database: jsonContent, fileName: fileData.name });
    } else {
      const errData = await getRes.json();
      return res.status( getRes.status === 404 ? 404 : 500 ).json({ error: errData.message || "Fichier introuvable sur GitHub" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors du chargement depuis GitHub" });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

