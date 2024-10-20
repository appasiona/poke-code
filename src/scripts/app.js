

/**
 * @module
 * @description
 * Module for handling the display of Pokémon cards and loading initial and additional data.
 */

import apiService from '../services/api-service.js';
import { createElementWithClass } from '../utils/helper.js';

/**
 * @module
 * @description
 * This module imports the custom element for displaying a Pokéball loader.
 */

import '../components/pokeball-loader/pokeball-loader.js';

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

/**
 * @const {HTMLElement} header - The header container element.
 */
const headerContainer = document.getElementById('header');

/**
 * @const {Object} headerElms - Elements within the header.
 * @property {HTMLElement} headerElms.searchInput - Input field for search in the header.
 * @property {HTMLElement} headerElms.searchDropdown - Search dropdown in the header.
 * @property {HTMLElement} headerElms.resetSearchBox - Button to reset the search in the header.
 */
const headerElms = {
    searchInput: headerContainer.querySelector('.header__search-input'),
    searchDropdown: headerContainer.querySelector('.header__search-dropdown'),
    resetSearchBox: headerContainer.querySelector('.header__search-cross')
};

/**
 * @const {HTMLElement} sidebar - The sidebar container element.
 */
const sidebarContainer = document.getElementById('sidebar');

/**
 * @const {HTMLElement} mobileFilterButton - Button to show filters on mobile devices.
 */
const mobileFilterButton = document.querySelector('.main__filter-button');

/**
 * @const {HTMLElement} content - The content container element.
 */
const contentContainer = document.getElementById('content');

/**
 * @const {Object} contentElms - Elements within the content container.
 * @property {HTMLElement} contentElms.cardsContainer - Container for Pokémon cards.
 * @property {HTMLElement} contentElms.loadMoreButton - Button to load more Pokémon cards.
 * @property {HTMLElement} contentElms.loader - Pokéball loader shown during loads.
 */
const contentElms = {
    cardsContainer: contentContainer.querySelector('.content__cards'),
    loadMoreButton: contentContainer.querySelector('.content__button'),
    noResultsMessage: contentContainer.querySelector('.content__no-results'),
    loader: contentContainer.querySelector('pokeball-loader')
};


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
        contentElms.cardsContainer.appendChild(card);
    });
};

/**
 * Loads and renders the next batch of filtered Pokémon data.
 *
 * @function
 * @returns {void}
 */
const loadNextBatch = () => {
    if (currentBatchIndex >= filteredData.length) {
        contentElms.loadMoreButton.classList.remove('content__button--visible');
        return;
    }

    contentElms.loader.show();

    const batch = filteredData.slice(currentBatchIndex, currentBatchIndex + batchSize);
    currentBatchIndex += batchSize;

    renderCards(batch);

    const hasMoreData = currentBatchIndex < filteredData.length;
    contentElms.loadMoreButton.classList.toggle('content__button--visible', hasMoreData);

    contentElms.loader.hide();
};

/**
 * Gets the selected filters for types, colors, and genders.
 *
 * @function
 * @returns {Object} - Object containing arrays of selected types, colors and gender.
 */
const getSelectedFilters = () => {
    const selectedFilters = {
        types: [],
        colors: [],
        gender: ''
    };

    const filterMap = {
        types: ".sidebar__type-checkbox:checked",
        colors: ".sidebar__color-checkbox:checked",
    };

    Object.keys(filterMap).forEach(key => {
        sidebarContainer.querySelectorAll(filterMap[key]).forEach(el => {
            selectedFilters[key].push(el.value);
        });
    });

    const genderEl = sidebarContainer.querySelector(".sidebar__gender-radio:checked");
    if (genderEl) {
        selectedFilters.gender = genderEl.value;
    }

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

    for await (const type of types) {
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

    for await (const color of colors) {
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
 * @param {Array<string>} gender - The gender to check against.
 * @returns {Promise<boolean>} - True if the Pokémon matches any gender, otherwise false.
 */
const checkMatchGender = async (pokemonName, gender) => {
    if (gender === 'all') return true;

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

    return false;
};

/**
 * Filters the Pokémon data based on the search query and displays a dropdown with the top 5 results.
 * 
 * @async
 * @returns {Promise<void>} - Resolves when the data has been filtered and the dropdown has been updated.
 */

const filterDataFromSearchBar = async () => {
    await filterData();
    const dropdownData = filteredData.slice(0, 5);
    showSearchDropdown(dropdownData);
}

/**
 * Displays a dropdown menu with the provided list of items.
 * 
 * @param {Array<Object>} items - An array of objects to display in the dropdown. Each object should have an `id` and `name` property.
 * @returns {void}
 */
const showSearchDropdown = (items) => {
    headerElms.searchDropdown.innerHTML = '';

    if (items.length === 0) {
        headerElms.searchDropdown.classList.remove('header__search-dropdown--visible');
        return;
    }

    // Use a document fragment to avoid repeated DOM manipulations
    const fragment = document.createDocumentFragment();

    // Reusable function to handle click on each dropdown item
    const handleClick = (item) => {
        headerElms.searchInput.value = item.name.charAt(0).toUpperCase() + item.name.slice(1);
        headerElms.searchDropdown.classList.remove('header__search-dropdown--visible');
        filterData();
    };

    // Add items to the fragment
    items.forEach(item => {
        const div = createElementWithClass('div', 'header__search-dropdown-item');
        div.textContent = `#${item.id} ${item.name}`;
        div.addEventListener('click', () => handleClick(item));
        fragment.appendChild(div);
    });

    // Append the entire fragment to the dropdown in one operation
    headerElms.searchDropdown.appendChild(fragment);
    headerElms.searchDropdown.classList.add('header__search-dropdown--visible');
};


/**
 * Filters the Pokémon data based on the search query and selected filters.
 * 
 * @returns {Promise<void>} - Resolves when the data has been filtered and displayed.
 */

const filterData = async () => {
    contentElms.loader.show();

    const query = headerElms.searchInput.value.trim().toLowerCase();

    headerElms.resetSearchBox.classList.toggle('header__search-cross--visible', query !== '');

    const { types, colors, gender } = getSelectedFilters();

    const filteredDataPromises = pokemonData.map(async pokemon => {

        const matchesQuery = query === '' || pokemon.name.toLowerCase().includes(query) || pokemon.id.toString().includes(query);

        const [matchesType, matchesColor, matchesGender] = await Promise.all([
            checkMatchType(pokemon.name, types),
            checkMatchColor(pokemon.name, colors),
            checkMatchGender(pokemon.name, gender)
        ]);

        return matchesQuery && matchesType && matchesColor && matchesGender ? pokemon : null;
    });

    try {
        const filteredDataResults = await Promise.all(filteredDataPromises);
        filteredData = filteredDataResults.filter(pokemon => pokemon !== null);

        currentBatchIndex = 0;
        contentElms.cardsContainer.innerHTML = '';

        const hasResults = filteredData.length > 0;
        contentElms.noResultsMessage.classList.toggle('content__no-results--visible', !hasResults);

        if (hasResults) {
            loadNextBatch();
        } else {
            contentElms.loadMoreButton.classList.remove('content__button--visible');
        }
    } catch (error) {
        console.error('[filterData] Error filtering data:', error);
        contentElms.noResultsMessage.classList.add('content__no-results--visible');
    } finally {
        contentElms.loader.hide();
    }
};

/**
 * Resets all filters by calling the `resetTypeFilter`, `resetColorFilter`, and `resetGenderFilter` functions and recalculate data.
 * 
 * @returns {void} - This function does not return any value.
 */
const resetAllFilters = async () => {
    resetTypeFilter();
    resetColorFilter();
    resetGenderFilter();
    await filterData();
};

/**
 * Resets the color filter and updates the displayed data based on the current filters.
 *
 * @async
 * @function resetColorFilterClick
 * @returns {Promise<void>} A promise that resolves when the data filtering is complete.
 */
const resetColorFilterClick = async () => {
    resetColorFilter();
    await filterData();
}

/**
 * Resets the color filter by unchecking all selected color checkboxes.
 * 
 * @returns {void} - This function does not return any value.
 */
const resetColorFilter = async () => {
    sidebarContainer.querySelectorAll(".sidebar__color-checkbox:checked").forEach((checkbox) => {
        checkbox.checked = false;
    });
};

/**
 * Resets the type filter and updates the displayed data based on the current filters.
 *
 * @async
 * @function resetTypeFilterClick
 * @returns {Promise<void>} A promise that resolves when the data filtering is complete.
 */
const resetTypeFilterClick = async () => {
    resetTypeFilter();
    await filterData();
}

/**
 * Resets the type filter by unchecking all selected type checkboxes.
 * 
 * @returns {void} - This function does not return any value.
 */
const resetTypeFilter = () => {
    sidebarContainer.querySelectorAll(".sidebar__type-checkbox:checked").forEach((checkbox) => {
        checkbox.checked = false;
    });
};

/**
 * Resets the gender filter and updates the displayed data based on the current filters.
 *
 * @async
 * @function resetGenderFilterClick
 * @returns {Promise<void>} A promise that resolves when the data filtering is complete.
 */
const resetGenderFilterClick = async () => {
    resetGenderFilter();
    await filterData();
}

/**
 * Resets the gender filter by selecting the "all" radio button and ensuring that no other gender radio buttons are selected.
 * 
 * @returns {void} - This function does not return any value.
 */
const resetGenderFilter = async () => {
    const allRadioButton = sidebarContainer.querySelector(".sidebar__gender-radio[id='all']");
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
    headerElms.searchInput.value = '';
    headerElms.resetSearchBox.classList.remove('header__search-cross--visible');
    filterData();
};

/**
 * Show filters box in mobile.
 * 
 * @returns {void} - This function does not return any value.
 */
const showFilters = () => {
    sidebarContainer.classList.add('sidebar--visible');
};

/**
 * Close sidebar in mobile.
 * 
 * @returns {void} - This function does not return any value.
 */
const closeFilters = () => {
    sidebarContainer.classList.remove('sidebar--visible');
};


/**
 * Initializes event listeners for various elements in the application.
 * 
 * @function
 * @returns {void} This function does not return any value.
 */
const initializeEventListeners = () => {

    headerElms.searchInput.addEventListener('input', filterDataFromSearchBar);
    headerElms.resetSearchBox.addEventListener('click', resetSearchBoxFilter);

    sidebarContainer.addEventListener('click', (event) => {
        if (event.target.matches('#reset-type-button')) resetTypeFilterClick();
        if (event.target.matches('#reset-color-button')) resetColorFilterClick();
        if (event.target.matches('#reset-gender-button')) resetGenderFilterClick();
        if (event.target.matches('#reset-all-button')) resetAllFilters();
        if (event.target.closest('.sidebar__close-button')) closeFilters();
    });

    sidebarContainer.querySelector('.sidebar__main-fieldset').addEventListener('change', filterData);

    contentElms.loadMoreButton.addEventListener('click', loadNextBatch);

    mobileFilterButton.addEventListener('click', showFilters);
}

/**
 * Loads the initial data for Pokémon, types, colors, and genders, then applies the initial filter.
 * 
 * @returns {Promise<void>} - Resolves when the data has been loaded and the initial filter has been applied.
 */
const loadInitialData = async () => {
    contentElms.loader.show();

    try {
        pokemonData = await apiService.fetchPokemonData();
        filterData();

        typeMap = new Map(Object.entries(await apiService.fetchPokemonTypes()));
        colorMap = new Map(Object.entries(await apiService.fetchPokemonColors()));
        genderMap = new Map(Object.entries(await apiService.fetchPokemonGenders()));
    } catch (error) {
        console.error('Error loading initial data:', error);
    } finally {
        contentElms.loader.hide();
    }
};

/**
 * Initializes the component by setting up event listeners and loading the initial data.
 *
 * @async
 * @function initializeComponent
 * @returns {Promise<void>} A promise that resolves when the initial data loading is complete.
 */
const initializeComponent = async () => {
    initializeEventListeners();
    loadInitialData();
}


// Set up the event to load initial data when the document is loaded.
document.addEventListener('DOMContentLoaded', initializeComponent);

/**
 * Handles click events on the document to manage the visibility of the search dropdown and filters.
 * 
 * @listens document#click
 * @param {MouseEvent} event - The click event object.
 * @property {EventTarget} event.target - The target of the click event.
 */
document.addEventListener('click', (event) => {
    if (!event.target.closest('.header__search')) {
        headerElms.searchDropdown.classList.remove('header__search-dropdown--visible');
    }

    if (!event.target.closest('.main__filter-button') && !event.target.closest('.sidebar')) {
        closeFilters();
    }
});