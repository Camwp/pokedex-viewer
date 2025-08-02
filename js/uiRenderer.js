const card = document.getElementById('pokemonCard');
const loader = document.getElementById('loader');
const listContainer = document.getElementById('pokemonList');
import { fetchPokemon, fetchMove } from './apiService.js';

const typeColors = {
    normal: '#fffed4ff',
    fire: '#fee3cfff',
    water: '#d0dfffff',
    electric: '#fff6d4ff',
    grass: '#dff5e1',
    ice: '#d8fffdff',
    fighting: '#ffd0ceff',
    poison: '#ffc2feff',
    ground: '#ffefc7ff',
    flying: '#dfd4ffff',
    psychic: '#ffe2eaff',
    bug: '#f9ffcfff',
    rock: '#fff7ceff',
    ghost: '#e8d7ffff',
    dragon: '#e5daffff',
    dark: '#ffe8d9ff',
    steel: '#e4e4fdff',
    fairy: '#ffd7ebff'
};
const secondaryColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#4CAF50',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
};


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
    const primaryType = pokemon.types[0]?.type?.name || 'normal';
    const bgColor = typeColors[primaryType] || '#fff';
    const secondaryColor = secondaryColors[primaryType] || '#fff';
    const types = pokemon.types.map(t => capitalize(t.type.name)).join(', ');
    const stats = pokemon.stats.map(s => `<tr><td>${capitalize(s.stat.name)}</td><td>${s.base_stat}</td></tr>`).join('');
    const moves = pokemon.moves.map(m => `
        <li class="clickable-move" data-move="${m.move.name}">${capitalize(m.move.name)}</li>
      `).join('');
    const heldItems = pokemon.held_items.map(item =>
        `<li><strong style="color: ${secondaryColor}">${capitalize(item.item.name)}</strong>: ${item.version_details.map(v =>
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
        `<li><strong style="color: ${secondaryColor}">${capitalize(ab.name)}</strong>: ${ab.effect_entries.find(e => e.language.name === 'en')?.effect || 'No info'}</li>`
    ).join('');

    const evolutionChain = await renderEvolutionChainImages(evolution.chain, bgColor);


    card.innerHTML = `
      <div class="pokedex-container" style="background-color: ${bgColor}; border: 3px solid ${secondaryColor};">

        <h2 style="color:${secondaryColor}">#${pokemon.id} ${capitalize(pokemon.name)} <small>${genus}</small></h2>

        <div class="overview">
          <img src="${sprites}" alt="${pokemon.name}" />
          <div class="info-box">
            <p><strong style="color: ${secondaryColor}">Type:</strong> ${types}</p>
            <p><strong style="color: ${secondaryColor}">Height:</strong> ${pokemon.height}</p>
            <p><strong style="color: ${secondaryColor}">Weight:</strong> ${pokemon.weight}</p>
            <p><strong style="color: ${secondaryColor}">Base XP:</strong> ${pokemon.base_experience}</p>
            <p><strong style="color: ${secondaryColor}">Abilities:</strong> ${abilitiesList}</p>
            <p><strong style="color: ${secondaryColor}">Egg Groups:</strong> ${eggGroups}</p>
            <p><strong style="color: ${secondaryColor}">Color:</strong> ${capitalize(species.color.name)}</p>
            <p><strong style="color: ${secondaryColor}">Color:</strong> ${capitalize(species?.color?.name ?? 'Unknown')}</p>
            <p><strong style="color: ${secondaryColor}">Capture Rate:</strong> ${species?.capture_rate ?? 'Unknown'}</p>
            <p><strong style="color: ${secondaryColor}">Base Happiness:</strong> ${species?.base_happiness ?? 'Unknown'}</p>
            <p><strong style="color: ${secondaryColor}">Legendary:</strong> ${species?.is_legendary ? 'Yes' : 'No'}</p>
            <p><strong style="color: ${secondaryColor}">Mythical:</strong> ${species?.is_mythical ? 'Yes' : 'No'}</p>

            <p><strong style="color: ${secondaryColor}">Is Mega:</strong> ${mega_form}</p>
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
        <div class="evolution-chain" style="background-color: ${bgColor}">${evolutionChain}</div>` : ''}
        
        
        

        ${cry ? `
            <div class="cryContainer" style="text-align: center">
        <h3>Pokémon Cry</h3>
        <audio controls id="audioControls">
          <source src="${cry}" type="audio/ogg">
        </audio>
        </div>` : ''}

        <div class="spriteContainer" style="text-align: center">
        <h3>Sprites</h3>
        <div class="sprite-preview" style="display: inline-flex">
          ${sprites ? `<div><p>Official</p><img src="${sprites}" /></div>` : ''}
          ${shiny ? `<div><p>Shiny</p><img src="${shiny}" /></div>` : ''}
          ${animated ? `<div><p>Animated</p><img src="${animated}" /></div>` : ''}
        </div>
        </div>
      </div>
      <div id="movePopup" class="move-popup hidden"></div>

    `;
    document.querySelectorAll('.clickable-move').forEach(li => {
        li.addEventListener('click', async () => {
            const moveName = li.dataset.move;
            const popup = document.getElementById('movePopup');

            try {
                const move = await fetchMove(moveName);
                const effectEntry = move.effect_entries.find(e => e.language.name === 'en');
                const effectText = effectEntry
                    ? effectEntry.short_effect.replace(/\$effect_chance/g, move.effect_chance)
                    : 'No description.';

                // Populate popup
                popup.innerHTML = `
              <strong>${capitalize(move.name)}</strong><br>
              <strong>Type:</strong> ${capitalize(move.type.name)}<br>
              <strong>Power:</strong> ${move.power ?? '—'}<br>
              <strong>Accuracy:</strong> ${move.accuracy ?? '—'}<br>
              <strong>PP:</strong> ${move.pp}<br>
              <strong>Effect:</strong> ${effectText}
            `;

                // Position popup near clicked element
                const rect = li.getBoundingClientRect();
                popup.style.top = `${window.scrollY + rect.top - popup.offsetHeight - 10}px`;
                popup.style.left = `${window.scrollX + rect.left}px`;
                popup.classList.remove('hidden');
            } catch (err) {
                popup.innerHTML = `<strong>Error loading move.</strong>`;
                popup.classList.remove('hidden');
            }
        });
    });
    document.addEventListener('click', (e) => {
        const popup = document.getElementById('movePopup');
        if (!e.target.closest('.clickable-move')) {
            popup.classList.add('hidden');
        }
    });
}

async function renderEvolutionChainImages(chain, bgColor) {
    if (!chain) return '';

    const stages = [];

    async function walk(evo, level = null) {
        const name = evo?.species?.name;
        if (!name) return;

        try {
            const data = await fetchPokemon(name);
            const img = data.sprites.front_default || '';
            stages.push({ name, img, minLevel: level });
        } catch (err) {
            console.error('Failed to fetch evolution Pokémon:', name, err);
        }

        if (evo.evolves_to?.length) {
            for (const next of evo.evolves_to) {
                const nextLevel = next.evolution_details?.[0]?.min_level ?? null;
                await walk(next, nextLevel);
            }
        }
    }

    await walk(chain); // Start from base

    return stages.map((stage) => `
        <div class="evolution-stage" style="background-color: ${bgColor}">
            <img src="${stage.img}" alt="${capitalize(stage.name)}" />
            <p>${capitalize(stage.name)}</p>
            ${stage.minLevel !== null ? `<div>Lv. ${stage.minLevel}</div>` : 'Lv. 1'}
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

export async function renderMoveDetail(move) {
    const detailDiv = document.getElementById('moveDetails');
    if (!detailDiv) return;

    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
    const effectEntry = move.effect_entries.find(e => e.language.name === 'en');
    const effectText = effectEntry ? effectEntry.short_effect.replace(/\$effect_chance/g, move.effect_chance) : 'No description.';

    detailDiv.innerHTML = `
      <h2>${capitalize(move.name)}</h2>
      <p><strong>Type:</strong> ${capitalize(move.type.name)}</p>
      <p><strong>Power:</strong> ${move.power ?? '—'}</p>
      <p><strong>Accuracy:</strong> ${move.accuracy ?? '—'}</p>
      <p><strong>PP:</strong> ${move.pp}</p>
      <p><strong>Priority:</strong> ${move.priority}</p>
      <p><strong>Effect:</strong> ${effectText}</p>
      <button id="backToPokemon">⬅ Back</button>
    `;
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
