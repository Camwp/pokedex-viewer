import { loadFullPokemon, fetchBackground, fetchPokemonList } from './apiService.js';
import { renderPokemon, renderPokemonList, showLoader, hideLoader, renderError } from './uiRenderer.js';

document.addEventListener('DOMContentLoaded', async () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const homeLink = document.getElementById('homeLink');
    const listLink = document.getElementById('listLink');
    const detailView = document.getElementById('detailView');
    const listView = document.getElementById('listView');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!homeLink || !listLink || !detailView || !listView || !prevBtn || !nextBtn) {
        console.error('One or more navigation elements not found in DOM.');
        return;
    }

    let currentId = 1;
    let backgroundUrl = '';


    try {
        backgroundUrl = await fetchBackground();
    } catch (err) {
        console.error('Failed to fetch background:', err);
        backgroundUrl = '';
    }

    const loadPokemon = async (query) => {
        try {
            showLoader();
            const { pokemon, species, form, evolution, abilities } = await loadFullPokemon(query);
            renderPokemon({ pokemon, species, form, evolution, abilities }, backgroundUrl);


            currentId = pokemon.id;
        } catch (err) {
            renderError(err.message);
        } finally {
            hideLoader();
        }
    };

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query) loadPokemon(query);
    });

    function setActiveNav(link) {
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
    }

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        detailView.classList.remove('hidden');
        listView.classList.add('hidden');
        setActiveNav(homeLink);
    });

    listLink.addEventListener('click', async (e) => {
        e.preventDefault();
        detailView.classList.add('hidden');
        listView.classList.remove('hidden');
        setActiveNav(listLink);

        const pokemonArray = await fetchPokemonList(1025, 0);
        renderPokemonList(pokemonArray, loadPokemon);
    });


    prevBtn.addEventListener('click', () => {
        if (currentId > 1) {
            loadPokemon(currentId - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        loadPokemon(currentId + 1);
    });

    // initial pokemon load
    loadPokemon(1);
});
