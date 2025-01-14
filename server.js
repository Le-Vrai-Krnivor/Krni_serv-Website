require('dotenv').config({ path: './login.env' });
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration webhook Discord
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1328781850252021870/AFNEMOptmwQvXf_DePJcJimlfHsodU1QtNT6jd4ycc1nBSN5aPshL51QqAd4YzSWSLkA';

// Fonction pour envoyer les logs à Discord
async function sendDiscordLog(username, success) {
    const embed = {
        title: "Tentative de connexion",
        color: success ? 0x00ff00 : 0xff0000, // Vert si succès, rouge si échec
        fields: [
            {
                name: "Utilisateur",
                value: username,
                inline: true
            },
            {
                name: "Statut",
                value: success ? "✅ Succès" : "❌ Échec",
                inline: true
            }
        ],
        timestamp: new Date().toISOString()
    };

    try {
        await axios.post(WEBHOOK_URL, {
            embeds: [embed]
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi du log Discord:', error.message);
    }
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuration auth admin
const validUsers = process.env.ADMIN_USERS.split(',');
const validPassword = process.env.ADMIN_PASSWORD;

// Route pour l'authentification admin
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    const success = validUsers.includes(username) && password === validPassword;
    
    // Envoyer le log à Discord
    await sendDiscordLog(username, success);
    
    console.log('Tentative de connexion :', {
        username,
        receivedPassword: password,
        validUsers,
        passwordMatch: password === validPassword
    });
    
    res.json({ success });
});

// Route pour récupérer les données du serveur Discord
app.get('/api/server-data', async (req, res) => {
    const inviteCode = 'r55Dg3GsEG';

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
    console.log('Utilisateurs autorisés:', validUsers);
    console.log('Mot de passe chargé:', validPassword ? 'Oui' : 'Non');
});
