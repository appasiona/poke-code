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
// const filterData = () => {
//     const query = searchInput.value.trim().toLowerCase();

//     if (query === '') {
//         // If the search input is empty, use the full dataset
//         filteredData = pokemonData;
//     } else {
//         // Filter data by name or ID
//         filteredData = pokemonData.filter(pokemon =>
//             pokemon.name.toLowerCase().includes(query) ||
//             pokemon.id.toString().includes(query)
//         );
//     }

//     // Reset batch index and render filtered data
//     currentBatchIndex = 0;
//     cardsContainer.innerHTML = ''; // Clear current cards for filtered results

//     // Show "No Pokémons found" message if no results
//     if (filteredData.length === 0) {
//         noResultsMessage.style.display = 'block';
//     } else {
//         noResultsMessage.style.display = 'none';
//         loadNextBatch();
//     }
// };

/**
 * Gets the selected filters for types, colors, and genders.
 *
 * @function
 * @returns {Object} - Object containing arrays of selected types, colors, and genders.
 */
const getSelectedFilters = () => {
    const selectedFilters = {
        types: [],
        colors: [],
        genders: []
    };

    // Get selected types
    document.querySelectorAll(".sidebar__type:checked").forEach((checkbox) => {
        selectedFilters.types.push(checkbox.value);
    });

    // Get selected colors
    document.querySelectorAll(".sidebar__checkbox:checked").forEach((checkbox) => {
        selectedFilters.colors.push(checkbox.value);
    });

    // Get selected genders
    document.querySelectorAll(".sidebar__radio:checked").forEach((radio) => {
        selectedFilters.genders.push(radio.value);
    });

    return selectedFilters;
};

const typeCache = new Map();

const checkMatchType = async (pokemonName, types) => {
    if (types.length === 0) return true; 

    for (const type of types) {
        if (!typeCache.has(type)) {
            const typeElm = typeMap.get(type);

            if (typeElm.data.length === 0) {
                const fetchPromise = apiService.fetchSpecificTypePokemons(typeElm.url)
                    .then(pokemonList => {
                        typeElm.data = pokemonList;
                        return pokemonList;
                    })
                    .catch(error => {
                        console.error(`Error fetching type data for ${type}:`, error);
                        return []; 
                    });

                typeCache.set(type, fetchPromise);
            }
        }

        const typeData = await typeCache.get(type);
        if (typeData.includes(pokemonName)) return true; 
    }

    return false; 
};

const colorCache = new Map();

const checkMatchColor = async (pokemonName, colors) => {
    if (colors.length === 0) return true; 

    for (const color of colors) {
        if (!colorCache.has(color)) {
            const colorElm = colorMap.get(color);

            if (colorElm.data.length === 0) {
                const fetchPromise = apiService.fetchSpecificColorPokemons(colorElm.url)
                    .then(pokemonList => {
                        colorElm.data = pokemonList;
                        return pokemonList;
                    })
                    .catch(error => {
                        console.error(`Error fetching type data for ${color}:`, error);
                        return []; 
                    });

                    colorCache.set(color, fetchPromise);
            }
        }

        const typeData = await colorCache.get(color);
        if (typeData.includes(pokemonName)) return true; 
    }

    return false; 
};

const genderCache = new Map();

const checkMatchGender = async (pokemonName, genders) => {
    if (genders.includes('all')) return true; 

    for (const gender of genders) {
        if (!genderCache.has(gender)) {
            const genderElm = genderMap.get(gender);

            if (genderElm.data.length === 0) {
                const fetchPromise = apiService.fetchSpecificGenderPokemons(genderElm.url)
                    .then(pokemonList => {
                        genderElm.data = pokemonList;
                        return pokemonList;
                    })
                    .catch(error => {
                        console.error(`Error fetching type data for ${gender}:`, error);
                        return []; 
                    });

                    genderCache.set(gender, fetchPromise);
            }
        }

        const genderData = await genderCache.get(gender);
        if (genderData.includes(pokemonName)) return true; 
    }

    return false; 
};

const filterData = async () => {
    const query = searchInput.value.trim().toLowerCase();
    const { types, colors, genders } = getSelectedFilters();

    await Promise.all(Array.from(typeCache.values()));

    const filteredDataPromises = pokemonData.map(async pokemon => {
        const matchesQuery = query === '' || 
            pokemon.name.toLowerCase().includes(query) ||
            pokemon.id.toString().includes(query);

        // Comprobar tipo, color y género de forma asincrónica
        const matchesType = await checkMatchType(pokemon.name, types);
        const matchesColor = await checkMatchColor(pokemon.name, colors);
        const matchesGender = await checkMatchGender(pokemon.name, genders);

        return matchesQuery && matchesType && matchesColor && matchesGender ? pokemon : null;
    });

    try {
        const filteredDataResults = await Promise.all(filteredDataPromises);
        filteredData = filteredDataResults.filter(pokemon => pokemon !== null);

        currentBatchIndex = 0;
        cardsContainer.innerHTML = ''; 
        
        if (filteredData.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
            loadNextBatch();
        }
    } catch (error) {
        console.error('Error filtering data:', error);
        noResultsMessage.style.display = 'block'; 
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

    typeMap = new Map(Object.entries(await apiService.fetchPokemonTypes()));
    colorMap = new Map(Object.entries(await apiService.fetchPokemonColors()));
    genderMap = new Map(Object.entries(await apiService.fetchPokemonGenders()));
};

// Set up the event to load more data when the button is clicked.
loadMoreButton.addEventListener('click', loadNextBatch);

// Set up the event to filter data when the search input changes.
searchInput.addEventListener('input', filterData);

// Set up the event to filter data when any checkbox or radio button changes.
document.querySelector('.sidebar__filters-fieldset').addEventListener('change', filterData);

// Set up the event to load initial data when the document is loaded.
document.addEventListener('DOMContentLoaded', loadInitialData);
