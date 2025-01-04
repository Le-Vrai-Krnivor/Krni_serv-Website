function toggleMenu() {
    document.getElementById('menu').classList.toggle('active');
}

async function updateCounter() {
    try {
        const response = await fetch('/api/server-data');
        const data = await response.json();
        const memberCount = data.approximate_member_count;
        document.getElementById('memberCount').textContent = memberCount;

        let seconds = 30;
        const updateTimeElement = document.getElementById('updateTime');

        setInterval(async () => {
            seconds--;
            if (seconds < 0) {
                seconds = 30;
                const newResponse = await fetch('/api/server-data');
                const newData = await newResponse.json();
                const newMemberCount = newData.approximate_member_count;
                document.getElementById('memberCount').textContent = newMemberCount;
            }
            updateTimeElement.textContent = `00:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    } catch (error) {
        console.error('Erreur lors de la récupération des données du serveur:', error);
    }
}

// Initialiser le compteur
updateCounter();