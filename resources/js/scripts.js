/**
 * @module
 * @description
 * Module for handling the display of Pokémon cards and loading initial and additional data.
 */

import apiService from '../../services/api-service.js';

/**
 * @module
 * @description
 * This module imports the custom element for displaying a Pokéball loader.
 */

import '../../components/pokeball-loader/pokeball-loader.js';

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


const searchDropdown = document.querySelector('.header__dropdown');


/**
 * Button to reset search bar.
 * @type {HTMLElement}
 */
const resetSearchBox = document.querySelector('.header__search-icon--right');

/**
 * Button to reset all filters.
 * @type {HTMLElement}
 */
const resetAllButton = document.getElementById('reset-all-button');

/**
 * Button to reset color filter.
 * @type {HTMLElement}
 */
const resetColorButton = document.getElementById('reset-color-button');

/**
 * Button to reset type filter.
 * @type {HTMLElement}
 */
const resetTypeButton = document.getElementById('reset-type-button');

/**
 * Button to reset gender filter.
 * @type {HTMLElement}
 */
const resetGenderButton = document.getElementById('reset-gender-button');

/** 
 * DOM element for displaying a "No Pokémons found" message.
 * @type {HTMLElement}
 */
const noResultsMessage = document.createElement('div');
noResultsMessage.textContent = 'No Pokémons found...';
noResultsMessage.className = 'content__no-results';
noResultsMessage.style.display = 'none';
cardsContainer.parentElement.appendChild(noResultsMessage);

/**
 * Array to hold the filtered Pokémon data.
 * @type {Array<Object>}
 */
let filteredData = [];

/**
 * Index to manage the current batch of displayed Pokémon.
 * @type {number}
 */
let currentBatchIndex = 0;

/**
 * The number of Pokémon to display per batch.
 * @type {number}
 */
const batchSize = 20;

/**
 * Array to hold the initial Pokémon data.
 * @type {Array<Object>}
 */
let pokemonData = [];

/**
 * Map to hold Pokémon types.
 * @type {Map<string, {url: string, data: Promise<Array<string>> | Array<string> | null}>}
 */
let typeMap = new Map();

/**
 * Map to hold Pokémon colors.
 * @type {Map<string, {url: string, data: Promise<Array<string>> | Array<string> | null}>}
 */
let colorMap = new Map();

/**
 * Map to hold Pokémon genders.
 * @type {Map<string, {url: string, data: Promise<Array<string>> | Array<string> | null}>}
 */
let genderMap = new Map();

const loader = document.querySelector('pokeball-loader');


/**
 * Renders a list of Pokémon cards in the container.
 *
 * @param {Array<{ id: number, name: string, image: string, url: string  }>} pokemonList - List of Pokémon objects, each with an id, a name and an image URL.
 * @returns {void}
 */
const renderCards = (pokemonList) => {
    pokemonList.forEach(pokemon => {
        const card = document.createElement('pokemon-card');
        card.setAttribute('id', pokemon.id);
        card.setAttribute('name', pokemon.name);
        card.setAttribute('image', pokemon.image);
        card.setAttribute('url', pokemon.url);
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
    loader.show();
    const batch = filteredData.slice(currentBatchIndex, currentBatchIndex + batchSize);
    currentBatchIndex += batchSize;
    renderCards(batch);

    // Hide load more button if no more data
    if (currentBatchIndex >= filteredData.length) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
    }

    loader.hide();
};


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

/**
 * Checks if a Pokémon matches any of the specified types.
 * 
 * @param {string} pokemonName - The name of the Pokémon.
 * @param {Array<string>} types - The list of types to check against.
 * @returns {Promise<boolean>} - True if the Pokémon matches any type, otherwise false.
 */
const checkMatchType = async (pokemonName, types) => {
    if (types.length === 0) return true;

    for (const type of types) {
        let typeElm = typeMap.get(type);

        if (typeElm && typeElm.data.length === 0) {
            typeElm.data = apiService.fetchSpecificTypePokemons(typeElm.url)
                .then(pokemonList => {
                    typeElm.data = pokemonList;
                    return pokemonList;
                })
                .catch(error => {
                    console.error(`[checkMatchType] Error fetching type data for <${type}>:`, error);
                    return [];
                });

            typeMap.set(type, typeElm);
        }

        const typeData = await typeElm.data;
        if (typeData.includes(pokemonName)) {
            return true;
        }
    }

    return false;
};

/**
 * Checks if a Pokémon matches any of the specified colors.
 * 
 * @param {string} pokemonName - The name of the Pokémon.
 * @param {Array<string>} colors - The list of colors to check against.
 * @returns {Promise<boolean>} - True if the Pokémon matches any color, otherwise false.
 */
const checkMatchColor = async (pokemonName, colors) => {
    if (colors.length === 0) return true;

    for (const color of colors) {
        let colorElm = colorMap.get(color);

        if (colorElm && colorElm.data.length === 0) {
            colorElm.data = apiService.fetchSpecificColorPokemons(colorElm.url)
                .then(pokemonList => {
                    colorElm.data = pokemonList;
                    return pokemonList;
                })
                .catch(error => {
                    console.error(`[checkMatchColor] Error fetching color data for <${color}>:`, error);
                    return [];
                });

            colorMap.set(color, colorElm);
        }

        const colorData = await colorElm.data;
        if (colorData.includes(pokemonName)) {
            return true;
        }
    }

    return false;
};

/**
 * Checks if a Pokémon matches any of the specified genders.
 * 
 * @param {string} pokemonName - The name of the Pokémon.
 * @param {Array<string>} genders - The list of genders to check against.
 * @returns {Promise<boolean>} - True if the Pokémon matches any gender, otherwise false.
 */
const checkMatchGender = async (pokemonName, genders) => {
    if (genders.includes('all')) return true;

    for (const gender of genders) {
        let genderElm = genderMap.get(gender);

        if (genderElm && genderElm.data.length === 0) {
            genderElm.data = apiService.fetchSpecificGenderPokemons(genderElm.url)
                .then(pokemonList => {
                    genderElm.data = pokemonList;
                    return pokemonList;
                })
                .catch(error => {
                    console.error(`[checkMatchGender] Error fetching gender data for <${gender}>:`, error);
                    return [];
                });

            genderMap.set(gender, genderElm);
        }

        const genderData = await genderElm.data;
        if (genderData.includes(pokemonName)) {
            return true;
        }
    }

    return false;
};

const filterDataFromSearchBar = async () => {
    await filterData();
    const dropdownData = filteredData.slice(0, 5);
    showSearchDropdown(dropdownData);
}

function showSearchDropdown(items) {
    searchDropdown.innerHTML = '';

    if (items.length === 0) {
        searchDropdown.style.display = 'none';
        return;
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.textContent = `#${item.id} ${item.name}`;
        div.className = 'header__dropdown-item';
        div.addEventListener('click', () => {
            searchInput.value = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            searchDropdown.style.display = 'none';
            filterData();
        });
        searchDropdown.appendChild(div);
    });

    searchDropdown.style.display = 'block';
}


/**
 * Filters the Pokémon data based on the search query and selected filters.
 * 
 * @returns {Promise<void>} - Resolves when the data has been filtered and displayed.
 */
const filterData = async () => {
    loader.show();

    const query = searchInput.value.trim().toLowerCase();

    if (query !== '') {
        resetSearchBox.style.display = 'block';
    } else {
        resetSearchBox.style.display = 'none';
    }

    const { types, colors, genders } = getSelectedFilters();

    const filteredDataPromises = pokemonData.map(async pokemon => {
        const matchesQuery = query === '' || pokemon.name.toLowerCase().includes(query) || pokemon.id.toString().includes(query);
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
            loadMoreButton.style.display = 'none';
        } else {
            noResultsMessage.style.display = 'none';
            loadNextBatch();
        }
    } catch (error) {
        console.error('[filterData] Error filtering data:', error);
        noResultsMessage.style.display = 'block';
    } finally {
        loader.hide();
    }
};


/**
 * Loads the initial data for Pokémon, types, colors, and genders, then applies the initial filter.
 * 
 * @returns {Promise<void>} - Resolves when the data has been loaded and the initial filter has been applied.
 */
const loadInitialData = async () => {
    loader.show();

    try {
        pokemonData = await apiService.fetchPokemonData();
        filterData();

        typeMap = new Map(Object.entries(await apiService.fetchPokemonTypes()));
        colorMap = new Map(Object.entries(await apiService.fetchPokemonColors()));
        genderMap = new Map(Object.entries(await apiService.fetchPokemonGenders()));
    } catch (error) {
        console.error('Error loading initial data:', error);
    } finally {
        loader.hide();
    }
};


/**
 * Resets all filters by calling the `resetTypeFilter`, `resetColorFilter`, and `resetGenderFilter` functions.
 * 
 * @returns {void} - This function does not return any value.
 */
const resetAllFilters = () => {
    resetTypeFilter();
    resetColorFilter();
    resetGenderFilter();
};

/**
 * Resets the color filter by unchecking all selected color checkboxes.
 * 
 * @returns {void} - This function does not return any value.
 */
const resetColorFilter = () => {
    document.querySelectorAll(".sidebar__checkbox:checked").forEach((checkbox) => {
        checkbox.checked = false;
    });
};

/**
 * Resets the type filter by unchecking all selected type checkboxes.
 * 
 * @returns {void} - This function does not return any value.
 */
const resetTypeFilter = () => {
    document.querySelectorAll(".sidebar__type:checked").forEach((checkbox) => {
        checkbox.checked = false;
    });
};

/**
 * Resets the gender filter by selecting the "all" radio button and ensuring that no other gender radio buttons are selected.
 * 
 * @returns {void} - This function does not return any value.
 */
const resetGenderFilter = () => {
    const allRadioButton = document.querySelector(".sidebar__radio[value='all']");
    if (allRadioButton) {
        allRadioButton.checked = true;
    }
};

/**
 * Resets the search box and refilter.
 * 
 * @returns {void} - This function does not return any value.
 */
const resetSearchBoxFilter = () => {
    searchInput.value = '';
    resetSearchBox.style.display = 'none';
    filterData();
};


// Set up the event to load more data when the button is clicked.
loadMoreButton.addEventListener('click', loadNextBatch);

// Set up the event to filter data when the search input changes.
searchInput.addEventListener('input', filterDataFromSearchBar);

// Add event listeners for the buttons
resetAllButton.addEventListener('click', resetAllFilters);
resetColorButton.addEventListener('click', resetColorFilter);
resetTypeButton.addEventListener('click', resetTypeFilter);
resetGenderButton.addEventListener('click', resetGenderFilter);
resetSearchBox.addEventListener('click', resetSearchBoxFilter);

// Set up the event to filter data when any checkbox or radio button changes.
document.querySelector('.sidebar__filters-fieldset').addEventListener('change', filterData);

// Set up the event to load initial data when the document is loaded.
document.addEventListener('DOMContentLoaded', loadInitialData);


document.addEventListener('click', (event) => {
    if (!event.target.closest('.header__search')) {
        searchDropdown.style.display = 'none';
    }
});
