const BASE = 'https://pokeapi.co/api/v2';

function logError(source, url, res) {
    console.error(`[${source}] Fetch failed: ${url} — Status ${res.status} ${res.statusText}`);
}

export async function fetchPokemon(query) {
    const url = `${BASE}/pokemon/${query}`;
    const res = await fetch(url);
    if (!res.ok) {
        logError('fetchPokemon', url, res);
        throw new Error('Pokémon not found');
    }
    return res.json();
}

export async function fetchSpecies(query) {
    const url = `${BASE}/pokemon-species/${query}`;
    const res = await fetch(url);
    if (!res.ok) {
        console.warn(`Species not found for query: ${query}`);
        return {};
    }
    return res.json();
}


export async function fetchForm(query) {
    const url = `${BASE}/pokemon-form/${query}`;
    const res = await fetch(url);
    if (!res.ok) {
        logError('fetchForm', url, res);
        throw new Error('Form not found');
    }
    return res.json();
}

export async function fetchShape(id) {
    const url = `${BASE}/pokemon-shape/${id}`;
    const res = await fetch(url);
    if (!res.ok) {
        logError('fetchShape', url, res);
        throw new Error('Shape not found');
    }
    return res.json();
}

export async function fetchEvolutionChain(chainUrl) {
    const res = await fetch(chainUrl);
    if (!res.ok) {
        logError('fetchEvolutionChain', chainUrl, res);
        throw new Error('Evolution chain not found');
    }
    return res.json();
}

export async function fetchAbility(name) {
    if (!name) {
        console.warn('[fetchAbility] Called with undefined or null ability name');
        return null;
    }
    const url = `${BASE}/ability/${name}`;
    const res = await fetch(url);
    if (!res.ok) {
        logError('fetchAbility', url, res);
        throw new Error(`Failed to fetch ability: ${name}`);
    }
    return res.json();
}

export async function fetchAllAbilities() {
    const url = `${BASE}/ability?limit=999`;
    const res = await fetch(url);
    if (!res.ok) {
        logError('fetchAllAbilities', url, res);
        throw new Error('Failed to fetch all abilities');
    }
    const data = await res.json();
    return data.results;
}

export async function loadFullPokemon(nameOrId) {
    try {
        const pokemon = await fetchPokemon(nameOrId);
        if (!pokemon) return { notFound: true };

        const id = pokemon.id;


        const species = await fetchSpecies(id);
        let form = { is_mega: false };

        try {
            const fetchedForm = await fetchForm(id);
            if (fetchedForm) form = fetchedForm;
        } catch {

        }

        let evolution = {};
        try {
            if (species?.evolution_chain?.url) {
                evolution = await fetchEvolutionChain(species.evolution_chain.url);
            }
        } catch {

        }

        const abilities = pokemon.abilities
            ? await Promise.all(
                pokemon.abilities.map(a =>
                    fetchAbility(a.ability.name).catch(() => null)
                )
            )
            : [];

        return {
            pokemon,
            species,
            form,
            evolution,
            abilities,
        };

    } catch (err) {
        console.error('[loadFullPokemon] Unexpected error:', err);
        return { notFound: true };
    }
}
export async function fetchMove(moveName) {
    const res = await fetch(`https://pokeapi.co/api/v2/move/${moveName.toLowerCase()}`);
    if (!res.ok) throw new Error('Failed to fetch move data');
    return res.json();
}



export async function fetchPokemonList(limit = 1025, offset = 0) {
    const url = `${BASE}/pokemon?limit=${limit}&offset=${offset}`;
    const res = await fetch(url);
    if (!res.ok) {
        logError('fetchPokemonList', url, res);
        throw new Error('Failed to fetch Pokémon list');
    }
    const data = await res.json();
    return data.results;
}


const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const ENABLE_UNSPLASH = false;

export async function fetchBackground() {
    if (ENABLE_UNSPLASH) {
        const res = await fetch(
            `https://api.unsplash.com/photos/random?query=gradient&orientation=landscape&client_id=${ACCESS_KEY}`
        );

        if (!res.ok) throw new Error('Failed to fetch Unsplash image');

        const data = await res.json();
        return data.urls.full;
    }
    return;
}

