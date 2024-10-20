/**
 * @module init
 * @description Module for initializing the application.
 */

import { colorMap, contentElms, genderMap, pokemonData, typeMap } from '../config/constants.js';
import apiService from '../services/api-service.js';
import { filterData } from './core.js';
import { initializeEventListeners } from './ui.js';


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
