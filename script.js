const readline = require('readline');
const axios = require('axios');

const defaultInviteCode = 'r55Dg3GsEG'; // Code d'invitation par défaut
let intervalId;
let countdownTimerId;
let remainingTime = 30000; // 30 seconds

// Fonction principale pour démarrer le processus
async function start() {
    await fetchServerData(defaultInviteCode);
}

// Requête à l'API Discord pour récupérer les données du serveur
async function fetchServerData(inviteCode) {
    const apiUrl = `https://discord.com/api/v9/invites/${encodeURIComponent(inviteCode)}?with_counts=true`; // Correction ici

    try {
        const response = await axios.get(apiUrl);
        updateServerInfo(response.data);
        startUpdateInterval(inviteCode);
        startCountdownTimer();
    } catch (error) {
        showError('Erreur lors de la récupération des données du serveur');
        console.error('Erreur :', error.message);
    }
}

// Mise à jour des informations du serveur à partir des données récupérées
function updateServerInfo(serverData) {
    console.log(`Nom du serveur : ${serverData.guild.name}`);
    console.log(`Total des membres : ${serverData.approximate_member_count}`);
    console.log(`Membres en ligne : ${serverData.approximate_presence_count}`);
}

// Démarrage de l'intervalle pour mettre à jour les données du serveur
function startUpdateInterval(inviteCode) {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        fetchServerData(inviteCode);
    }, 30000); // Mise à jour toutes les 30 secondes
}

// Démarrage du compte à rebours
function startCountdownTimer() {
    clearInterval(countdownTimerId);
    countdownTimerId = setInterval(updateCountdownTimer, 1000);
}

// Mise à jour de l'affichage du compte à rebours
function updateCountdownTimer() {
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    
    console.log(`Prochaine mise à jour dans : ${minutes}:${seconds.toString().padStart(2, '0')}`);

    remainingTime -= 1000;
    if (remainingTime <= 0) {
        remainingTime = 30000; // Réinitialiser à 30 secondes
        clearInterval(countdownTimerId);
        startCountdownTimer(); // Redémarrer le compte à rebours
    }
}

// Affichage des messages d'erreur
function showError(message) {
    console.log(message);
}

// Démarrer l'application avec le code d'invitation par défaut
start();
