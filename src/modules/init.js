/**
 * @module init
 * @description Module for initializing the application.
 */

import { colorMap, contentElms, genderMap, headerElms, mobileFilterButton, pokemonData, sidebarContainer, typeMap } from '../config/constants.js';
import apiService from '../services/api-service.js';
import { filterData, filterDataFromSearchBar, loadNextBatch } from './core.js';
import { resetAllFilters, resetColorFilterClick, resetGenderFilterClick, resetSearchBoxFilter, resetTypeFilterClick } from "./filters.js";
import { hideSidebar, showSidebar } from "./ui.js";


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
        if (event.target.closest('.sidebar__close-button')) hideSidebar();
    });

    sidebarContainer.querySelector('.sidebar__main-fieldset').addEventListener('change', filterData);

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
        pokemonData.push(...await apiService.fetchPokemonData());
        filterData();

        const types = await apiService.fetchPokemonTypes();
        Object.entries(types).forEach(([key, value]) => typeMap.set(key, value));

        const colors = await apiService.fetchPokemonColors();
        Object.entries(colors).forEach(([key, value]) => colorMap.set(key, value));

        const genders = await apiService.fetchPokemonGenders();
        Object.entries(genders).forEach(([key, value]) => genderMap.set(key, value));
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
    loadInitialData();
}

// Set up the event to load initial data when the document is loaded.
document.addEventListener('DOMContentLoaded', initializeComponent);
