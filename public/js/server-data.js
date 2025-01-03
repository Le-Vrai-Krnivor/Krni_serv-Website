async function fetchServerData() {
    try {
        const response = await fetch('/api/server-data');
        const data = await response.json();

        document.getElementById('memberCount').textContent = data.approximate_member_count || 'N/A';

        let remainingTime = 30;
        setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                document.getElementById('updateTime').textContent = `00:${remainingTime.toString().padStart(2, '0')}`;
            } else {
                remainingTime = 30;
                document.getElementById('updateTime').textContent = `00:${remainingTime.toString().padStart(2, '0')}`;
                fetchServerData();
            }
        }, 1000);

    } catch (error) {
        console.error('Erreur lors de la récupération des données du serveur:', error);
    }
}

fetchServerData();