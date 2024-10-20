import { contentElms, headerElms, pokemonData, typeMap, colorMap, genderMap  } from "../config/constants.js";
import { getSelectedFilters } from "./filters.js";
import { showSearchDropdown, renderCards } from "./ui.js";
import apiService from '../services/api-service.js';

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


export { checkMatchColor, checkMatchGender, checkMatchType, filterData, filterDataFromSearchBar, loadNextBatch };
