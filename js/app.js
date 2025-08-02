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
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    if (!homeLink || !listLink || !detailView || !listView || !prevBtn || !nextBtn) {
        console.error('One or more navigation elements not found in DOM.');
        return;
    }

    let currentId = 1;
    let backgroundUrl = '';
    clearHistoryBtn?.addEventListener('click', () => {
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
    });


    try {
        backgroundUrl = await fetchBackground();
    } catch (err) {
        console.error('Failed to fetch background:', err);
        backgroundUrl = '';
    }
    const HISTORY_KEY = 'pokemonHistory';

    function updateHistory(pokemon) {
        if (window.innerWidth < 768) return; // desktop only

        let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

        // remove if already exists
        history = history.filter(entry => entry.id !== pokemon.id);

        // add to front
        history.unshift({ id: pokemon.id, name: pokemon.name });

        // keep only 10
        history = history.slice(0, 10);

        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        renderHistory();
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function renderHistory() {
        const list = document.getElementById('historyList');
        if (!list) return;

        list.innerHTML = '';

        const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

        history.forEach(p => {
            const li = document.createElement('li');
            li.textContent = `#${p.id} ${capitalize(p.name)}`;
            li.style.cursor = 'pointer';
            li.style.listStyle = 'none';
            li.addEventListener('click', () => {
                document.getElementById('homeLink').click(); // Simulate clicking "Home"
                loadPokemon(p.id);
            });

            list.appendChild(li);
        });
    }

    const loadPokemon = async (query) => {
        try {
            showLoader();
            const { pokemon, species, form, evolution, abilities } = await loadFullPokemon(query);
            renderPokemon({ pokemon, species, form, evolution, abilities }, backgroundUrl);
            currentId = pokemon.id;
            updateHistory(pokemon); // ✅ Move inside try after successful load
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
    renderHistory();

});
