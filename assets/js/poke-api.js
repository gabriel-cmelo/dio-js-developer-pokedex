
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    pokemon.abilities = pokeDetail.abilities; 
    pokemon.stats = pokeDetail.stats.map((stat) => ({
        name: stat.stat.name,
        base_stat: stat.base_stat,
    }));

    return pokemon
}


pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

pokeApi.getPokemonDetailByUrl = (url) => {
    return fetch(url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon);
}

pokeApi.getPokemonAbilities = (pokemon) => {
    console.log('Getting abilities for:', pokemon.name);
    
    const abilityUrls = pokemon.abilities.map((ability) => ability.ability.url);
    const abilityRequests = abilityUrls.map((url) => fetch(url).then((response) => response.json()));
    
    return Promise.all(abilityRequests);
};

pokeApi.getPokemonStats = (pokemon) => {
    console.log('Getting stats for:', pokemon.name);
    return Promise.resolve(pokemon.stats);
};

