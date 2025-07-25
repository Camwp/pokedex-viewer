const card = document.getElementById('pokemonCard');
const loader = document.getElementById('loader');
const listContainer = document.getElementById('pokemonList');
import { fetchPokemon } from './apiService.js';

export async function renderPokemon({ pokemon, species, form, evolution, abilities }, bgUrl) {
    if (!pokemon || !species) {
        renderError('Missing Pokémon or species data.');
        return;
    }

    document.body.style.backgroundImage = `url('${bgUrl}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';

    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

    const types = pokemon.types.map(t => capitalize(t.type.name)).join(', ');
    const stats = pokemon.stats.map(s => `<tr><td>${capitalize(s.stat.name)}</td><td>${s.base_stat}</td></tr>`).join('');
    const moves = pokemon.moves.map(m => `<li>${capitalize(m.move.name)}</li>`).join('');
    const heldItems = pokemon.held_items.map(item =>
        `<li><strong>${capitalize(item.item.name)}</strong>: ${item.version_details.map(v =>
            `${capitalize(v.version.name)} (Rarity: ${v.rarity})`
        ).join(', ')}</li>`).join('') || '<li>None</li>';
    const games = pokemon.game_indices.map(g => capitalize(g.version.name)).join(', ');
    const abilitiesList = pokemon.abilities.map(a =>
        `${capitalize(a.ability.name)} ${a.is_hidden ? '(Hidden)' : ''}`
    ).join(', ');

    const genus = species.genera.find(g => g.language.name === 'en')?.genus || '';
    const flavorText = species.flavor_text_entries.find(f => f.language.name === 'en')?.flavor_text || '';

    const mega_form = form?.is_mega;
    const cry = pokemon.cries?.latest;
    const sprites = pokemon.sprites?.other?.['official-artwork']?.front_default;
    const shiny = pokemon.sprites?.other?.['official-artwork']?.front_shiny;
    const animated = pokemon.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default;

    const eggGroups = species.egg_groups.map(e => capitalize(e.name)).join(', ');
    const abilityDetails = abilities.map(ab =>
        `<li><strong>${capitalize(ab.name)}</strong>: ${ab.effect_entries.find(e => e.language.name === 'en')?.effect || 'No info'}</li>`
    ).join('');

    const evolutionChain = await renderEvolutionChainImages(evolution.chain);

    card.innerHTML = `
      <div class="pokedex-container">
        <h2>#${pokemon.id} ${capitalize(pokemon.name)} <small>${genus}</small></h2>

        <div class="overview">
          <img src="${sprites}" alt="${pokemon.name}" />
          <div>
            <p><strong>Type:</strong> ${types}</p>
            <p><strong>Height:</strong> ${pokemon.height}</p>
            <p><strong>Weight:</strong> ${pokemon.weight}</p>
            <p><strong>Base XP:</strong> ${pokemon.base_experience}</p>
            <p><strong>Abilities:</strong> ${abilitiesList}</p>
            <p><strong>Egg Groups:</strong> ${eggGroups}</p>
            <p><strong>Color:</strong> ${capitalize(species.color.name)}</p>
            <p><strong>Color:</strong> ${capitalize(species?.color?.name ?? 'Unknown')}</p>
            <p><strong>Capture Rate:</strong> ${species?.capture_rate ?? 'Unknown'}</p>
            <p><strong>Base Happiness:</strong> ${species?.base_happiness ?? 'Unknown'}</p>
            <p><strong>Legendary:</strong> ${species?.is_legendary ? 'Yes' : 'No'}</p>
            <p><strong>Mythical:</strong> ${species?.is_mythical ? 'Yes' : 'No'}</p>

            <p><strong>Is Mega:</strong> ${mega_form}</p>
          </div>
        </div>

        <h3>Flavor Text</h3>
        <p class="flavor-text">${flavorText}</p>

        <h3>Base Stats</h3>
        <table class="stats-table">
          <tbody>${stats}</tbody>
        </table>

        <h3>Abilities (Detailed)</h3>
        <ul>${abilityDetails}</ul>

        <h3>Held Items</h3>
        <ul>${heldItems}</ul>

        <h3>Game Appearances</h3>
        <p>${games}</p>

        <h3>Moves</h3>
        <ul class="moves-list">${moves}</ul>

        ${evolutionChain ? `
        <h3>Evolution Chain</h3>
        <div class="evolution-chain">${evolutionChain}</div>` : ''}

        ${cry ? `
        <h3>Pokémon Cry</h3>
        <audio controls id="audioControls">
          <source src="${cry}" type="audio/ogg">
        </audio>` : ''}

        <h3>Sprites</h3>
        <div class="sprite-preview">
          ${sprites ? `<div><p>Official</p><img src="${sprites}" /></div>` : ''}
          ${shiny ? `<div><p>Shiny</p><img src="${shiny}" /></div>` : ''}
          ${animated ? `<div><p>Animated</p><img src="${animated}" /></div>` : ''}
        </div>
      </div>
    `;
}

async function renderEvolutionChainImages(chain) {
    if (!chain) return '';

    const stages = [];

    async function walk(evo) {
        const name = evo?.species?.name;
        if (!name) return;

        try {
            const data = await fetchPokemon(name);
            const img = data.sprites.front_default || '';
            stages.push({ name, img });
        } catch (err) {
            console.error('Failed to fetch evolution Pokémon:', name, err);
        }

        if (evo.evolves_to?.length) {
            for (const next of evo.evolves_to) {
                await walk(next);
            }
        }
    }

    await walk(chain);

    return stages.map(stage => `
        <div class="evolution-stage">
            <img src="${stage.img}" alt="${capitalize(stage.name)}" />
            <p>${capitalize(stage.name)}</p>
        </div>
    `).join('<span class="arrow">➡</span>');
}



export function renderPokemonList(pokemonArray, loadFullPokemon) {
    listContainer.innerHTML = '';
    pokemonArray.forEach(pokemon => {
        const li = document.createElement('li');
        li.textContent = capitalize(pokemon.name);
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => {
            document.getElementById('homeLink').click();
            loadFullPokemon(pokemon.name);
        });
        listContainer.appendChild(li);
    });
}

export function renderError(message) {
    card.innerHTML = `<p style="color:red;">${message}</p>`;
}

export function showLoader() {
    loader.classList.remove('hidden');
}

export function hideLoader() {
    loader.classList.add('hidden');
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
