/**
 * @module init
 * @description Module for initializing the application.
 */

import { contentElms, headerElms, mobileFilterButton, sidebarContainer } from '../config/constants.js';
import { getPokemonColors, getPokemonGenders, getPokemonTypes, filterData, filterDataFromSearchBar, getPokemonData, loadNextBatch } from './core.js';
import { resetAllFilters, resetColorFilterClick, resetGenderFilterClick, resetSearchBoxFilter, resetTypeFilterClick } from "./filters.js";
import { hideSidebar, showSidebar } from "./ui.js";


/**
 * Initializes event listeners for various elements in the application.
 * 
 * @function
 * @returns {void} This function does not return any value.
 */
const initializeEventListeners = async () => {

    headerElms.searchInput.addEventListener('input', filterDataFromSearchBar);
    headerElms.resetSearchBox.addEventListener('click', resetSearchBoxFilter);

    sidebarContainer.addEventListener('click', async (event) => {
        if (event.target.matches('#reset-type-button')) await resetTypeFilterClick();
        if (event.target.matches('#reset-color-button')) await resetColorFilterClick();
        if (event.target.matches('#reset-gender-button')) await resetGenderFilterClick();
        if (event.target.matches('#reset-all-button')) resetAllFilters();
        if (event.target.closest('.sidebar__close-button')) hideSidebar();
    });

    sidebarContainer.querySelector('.sidebar__main-fieldset').addEventListener('change', await filterData);

    contentElms.loadMoreButton.addEventListener('click', loadNextBatch);

    mobileFilterButton.addEventListener('click', showSidebar);
}


/**
 * Loads the initial data for Pokémon, types, colors, and genders, then applies the initial filter.
 * 
 * @returns {Promise<void>} - Resolves when the data has been loaded and the initial filter has been applied.
 */
const loadInitialData = async () => {
    contentElms.loader.show();

    try {
        await Promise.all([
            getPokemonData(),
            getPokemonTypes(),
            getPokemonColors(),
            getPokemonGenders()
        ]);

        await filterData();
    } catch (error) {
        console.error('Error loading initial data:', error);
    } finally {
        contentElms.loader.hide();
    }
};

/**
 * Initializes the component by setting up event listeners and loading the initial data.
 * 
 * @returns {Promise<void>}
 */
const initializeComponent = async () => {
    initializeEventListeners();
    await loadInitialData();
}

// Set up the event to load initial data when the document is loaded.
document.addEventListener('DOMContentLoaded', initializeComponent);
