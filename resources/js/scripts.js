/**
 * @module
 * @description
 * Module for handling the display of Pokémon cards and loading initial and additional data.
 */

import apiService from '../../services/api-service.js';

/** 
 * DOM element that contains the Pokémon cards.
 * @type {HTMLElement}
 */
const cardsContainer = document.querySelector('.content__cards');

/** 
 * Button for loading more data.
 * @type {HTMLElement}
 */
const loadMoreButton = document.querySelector('.content__button');

/**
 * Search input field.
 * @type {HTMLElement}
 */
const searchInput = document.querySelector('.header__input');

/** 
 * DOM element for displaying a "No Pokémons found" message.
 * @type {HTMLElement}
 */
const noResultsMessage = document.createElement('div');
noResultsMessage.textContent = 'No Pokémons found...';
noResultsMessage.className = 'content__no-results';
noResultsMessage.style.display = 'none';
cardsContainer.parentElement.appendChild(noResultsMessage);

// Variables to manage filtering and pagination
let filteredData = [];
let currentBatchIndex = 0;
const batchSize = 20;

/** 
* @property {Array<Object>} data - Array to hold Pokémon data.
*/
let pokemonData = [];
let typeMap = new Map();
let colorMap = new Map();
let genderMap = new Map();


/**
 * Renders a list of Pokémon cards in the container.
 *
 * @param {Array<{ name: string, image: string }>} pokemonList - List of Pokémon objects, each with an id, a name and an image URL.
 * @returns {void}
 */
const renderCards = (pokemonList) => {
    pokemonList.forEach(pokemon => {
        const card = document.createElement('pokemon-card');
        card.setAttribute('id', pokemon.id);
        card.setAttribute('name', pokemon.name);
        card.setAttribute('image', pokemon.image);
        cardsContainer.appendChild(card);
    });
};

/**
 * Loads and renders the next batch of filtered Pokémon data.
 *
 * @function
 * @returns {void}
 */
const loadNextBatch = () => {
    const batch = filteredData.slice(currentBatchIndex, currentBatchIndex + batchSize);
    currentBatchIndex += batchSize;
    renderCards(batch);

    // Hide load more button if no more data
    if (currentBatchIndex >= filteredData.length) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
    }
};

/**
 * Filters Pokémon data based on the search input and resets pagination.
 *
 * @function
 * @returns {void}
 */
const filterData = () => {
    const query = searchInput.value.trim().toLowerCase();

    if (query === '') {
        // If the search input is empty, use the full dataset
        filteredData = pokemonData;
    } else {
        // Filter data by name or ID
        filteredData = pokemonData.filter(pokemon =>
            pokemon.name.toLowerCase().includes(query) ||
            pokemon.id.toString().includes(query)
        );
    }

    // Reset batch index and render filtered data
    currentBatchIndex = 0;
    cardsContainer.innerHTML = ''; // Clear current cards for filtered results

    // Show "No Pokémons found" message if no results
    if (filteredData.length === 0) {
        noResultsMessage.style.display = 'block';
    } else {
        noResultsMessage.style.display = 'none';
        loadNextBatch();
    }
};

/**
 * Loads initial data and renders the first batch of cards.
 *
 * @async
 * @function
 * @returns {Promise<void>} - A promise that resolves when the initial data has been loaded and cards have been rendered.
 */
const loadInitialData = async () => {
    pokemonData = await apiService.fetchPokemonData();
    filterData(); // Apply initial filter based on the empty search query
    
    typeMap = await apiService.fetchPokemonTypes();
    colorMap = await apiService.fetchPokemonColors();
    genderMap = await apiService.fetchPokemonGenders();
};

// Set up the event to load more data when the button is clicked.
loadMoreButton.addEventListener('click', loadNextBatch);

// Set up the event to filter data when the search input changes.
searchInput.addEventListener('input', filterData);

// Set up the event to load initial data when the document is loaded.
document.addEventListener('DOMContentLoaded', loadInitialData);
