const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const modal = document.getElementById('pokemonModal');
const closeModal = document.querySelector('.close');
const modalContent = document.getElementById('modalContent');

const maxRecords = 240
const limit = 12
let offset = 0;



function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function closeModalFunction() {
    modal.style.display = 'none';
}

closeModal.addEventListener('click', closeModalFunction);

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModalFunction();
    }
});

pokemonList.addEventListener('click', (event) => {
    const pokemonItem = event.target.closest('.pokemon');
    if (pokemonItem) {
        const pokemonIndex = Array.from(pokemonItem.parentElement.children).indexOf(pokemonItem);
        pokeApi.getPokemonDetailByUrl(`https://pokeapi.co/api/v2/pokemon/${pokemonIndex + 1}/`)
            .then(openModal)
            .catch((error) => console.error('Error fetching Pokemon details:', error));
    }
});

function openModal(pokemonDetails) {
    const abilityPromise = pokeApi.getPokemonAbilities(pokemonDetails);
    const statPromise = pokeApi.getPokemonStats(pokemonDetails);

    Promise.all([abilityPromise, statPromise]).then(([abilities, stats]) => {
        console.log('Abilities:', abilities);
        console.log('Stats:', stats);
        modalContent.innerHTML = `
        <h2>${pokemonDetails.name}</h2>
        <p>Number: #${pokemonDetails.number}</p>
        <p>Types: ${pokemonDetails.types.join(', ')}</p>
        <p>Abilities: ${abilities.map((ability) => ability.name).join(', ')}</p>
        <p>Stats:</p>
            <ul>
                ${stats.map((stat) => `<li>${stat.name}: ${stat.base_stat}</li>`).join('')}
            </ul>
        <img src="${pokemonDetails.photo}" alt="${pokemonDetails.name}">
    `;

    modalContent.parentElement.style.backgroundColor = getColorByType(pokemonDetails.type);

    modal.style.display = 'block';
    })
}

function getColorByType(type) {
    switch (type) {
        case 'normal':
            return '#c4c9a1';
        case 'grass':
            return '#99d181';
        case 'fire':
            return '#f19578';
        case 'water':
            return '#8cb1e1';
        case 'electric':
            return '#f7e955';
        case 'ice':
            return '#b5ebf2';
        case 'ground':
            return '#eadb8b';
        case 'flying':
            return '#b8a3eb';
        case 'poison':
            return '#c779bf';
        case 'fighting':
            return '#da7063';
        case 'psychic':
            return '#f9a1b7';
        case 'dark':
            return '#9b8b7c';
        case 'rock':
            return '#d8cb9e';
        case 'bug':
            return '#c4d32b';
        case 'ghost':
            return '#957aa1';
        case 'steel':
            return '#c8c6db';
        case 'dragon':
            return '#a46bf4';
        case 'fairy':
            return '#facbd5';
        default:
            return '#ffffff'; 
    }
}