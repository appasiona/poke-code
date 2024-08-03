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
 * Renders a list of Pokémon cards in the container.
 *
 * @param {Array<{ name: string, image: string }>} pokemonList - List of Pokémon objects, each with a name and an image URL.
 * @returns {void}
 */
const renderCards = (pokemonList) => {
    pokemonList.forEach(pokemon => {
        const card = document.createElement('pokemon-card');
        card.setAttribute('name', pokemon.name);
        card.setAttribute('image', pokemon.image);
        cardsContainer.appendChild(card);
    });
};

/**
 * Loads initial data and renders the first batch of cards.
 *
 * @async
 * @function
 * @returns {Promise<void>} - A promise that resolves when the initial data has been loaded and cards have been rendered.
 */
const loadInitialData = async () => {
    await apiService.fetchData();
    const initialBatch = apiService.getNextBatch();
    renderCards(initialBatch);
};

/**
 * Loads the next batch of data and renders more cards.
 *
 * @function
 * @returns {void}
 */
const loadMoreData = () => {
    const nextBatch = apiService.getNextBatch();
    if(nextBatch.length < 20) {
        loadMoreButton.style.display = 'none';
    }
    renderCards(nextBatch);
};

// Set up the event to load more data when the button is clicked.
loadMoreButton.addEventListener('click', loadMoreData);

// Set up the event to load initial data when the document is loaded.
document.addEventListener('DOMContentLoaded', loadInitialData);

