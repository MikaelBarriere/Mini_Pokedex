// Attendre que le DOM soit chargé avant d'ajouter les écouteurs d'événements
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', searchPokemon);
});

// Fonction principale pour rechercher un Pokémon
async function searchPokemon() {
    const id = document.getElementById('pokemonId').value;
    const errorMessage = document.getElementById('error-message');
    const pokemonInfo = document.getElementById('pokemonInfo');

    // Vérification de la validité de l'ID
    if (id < 1 || id > 893) {
        errorMessage.textContent = "L'ID doit être compris entre 1 et 893.";
        errorMessage.style.display = 'block';
        pokemonInfo.style.display = 'none';
        return;
    }

    errorMessage.style.display = 'none';
    try {
        // Récupération et affichage des données du Pokémon
        const pokemonData = await fetchPokemonData(id);
        updateUI(pokemonData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        errorMessage.textContent = "Erreur lors de la récupération des données. Veuillez réessayer.";
        errorMessage.style.display = 'block';
    }
}

// Fonction pour récupérer les données du Pokémon depuis l'API
async function fetchPokemonData(id) {
    // Utilisation de Promise.all pour effectuer les deux requêtes en parallèle
    const [speciesData, pokemonData] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`).then(res => res.json()),
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then(res => res.json())
    ]);

    // Extraction et formatage des données nécessaires
    return {
        id,
        name: speciesData.names.find(name => name.language.name === "fr").name,
        captureRate: speciesData.capture_rate,
        genus: speciesData.genera.find(genus => genus.language.name === "fr").genus,
        description: speciesData.flavor_text_entries.find(entry => entry.language.name === "fr").flavor_text,
        imageUrl: pokemonData.sprites.other['official-artwork'].front_default,
        color: speciesData.color ? speciesData.color.name : 'yellow'
    };
}

// Fonction pour mettre à jour l'interface utilisateur avec les données du Pokémon
function updateUI({ id, name, captureRate, genus, description, imageUrl, color }) {
    const pokemonInfo = document.getElementById('pokemonInfo');
    pokemonInfo.style.display = 'block';
    pokemonInfo.style.borderColor = color;

    // Mise à jour de l'ID et du nom
    document.getElementById('pokemonIdDisplay').textContent = `#${id}`;
    document.getElementById('pokemonName').textContent = name;

    // Calcul et affichage du taux de capture
    const captureRatePercentage = (captureRate / 255) * 100;
    document.getElementById('captureRateBar').style.width = `${captureRatePercentage}%`;
    document.getElementById('captureRateText').textContent = `${captureRate} (${captureRatePercentage.toFixed(1)}%)`;

    // Mise à jour des autres informations
    document.getElementById('pokemonGenus').textContent = genus;
    document.getElementById('pokemonDescription').textContent = description.replace(/\f/g, ' ');
    document.getElementById('pokemonImage').src = imageUrl;
}