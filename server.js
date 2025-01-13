const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour servir des fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route pour récupérer les données du serveur Discord
app.get('/api/server-data', async (req, res) => {
    const inviteCode = 'r55Dg3GsEG'; // Remplacez par votre code d'invitation

    try {
        const apiUrl = `https://discord.com/api/v9/invites/${encodeURIComponent(inviteCode)}?with_counts=true`;
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données du serveur:', error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération des données du serveur' });
    }
});

// Gestion de la page 404
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
