import { showLoader, hideLoader, fetchPokemon, fetchBackground, renderPokemon, renderError } from './uiRenderer';
let currentId = 1;

const loadPokemon = async (query) => {
    try {
        showLoader();
        const data = await fetchPokemon(query);
        const bg = await fetchBackground();
        renderPokemon(data, bg);
        currentId = data.id;
    } catch (err) {
        renderError(err.message);
    } finally {
        hideLoader();
    }
};

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

prevBtn.addEventListener('click', () => {
    if (currentId > 1) {
        loadPokemon(currentId - 1);
    }
});

nextBtn.addEventListener('click', () => {
    loadPokemon(currentId + 1);
});
