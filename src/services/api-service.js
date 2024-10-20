import { API_BASE_URL } from '../config/constants.js';
import { structureMoreInfo, transformPokemonData, transformStructuredData } from '../utils/helper.js';

/**
 * Class for interacting with the Pokémon API.
 *
 * @class
 */
class APIService {

    /**
     * Creates an instance of APIService.
     * @constructor
     */
    constructor() {
    }

    /**
     * Fetches data from the specified URL.
     *
     * @async
     * @function fetchData
     * @param {string} url - The URL from which to fetch data. This should be a valid URL string.
     * @returns {Promise<Object>} - A promise that resolves to the JSON data retrieved from the specified URL.
     * @throws {Error} - Throws an error if the fetch operation fails or if the response status is not OK.
     */
    async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    /**
     * Fetches data from the Pokémon API and transforms it.
     *
     * @async
     * @function
     * @returns {Promise<void>} - A promise that resolves when the data has been fetched and transformed.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchPokemonData() {
        const result = await this.fetchData(`${API_BASE_URL}/pokedex/national`);
        return transformPokemonData(result.pokemon_entries);
    }

    /**
     * Fetches the list of Pokémon types from the API.
     * 
     * @returns {Promise<Object>} - A promise that resolves to an object where the keys are Pokémon type names and the values are objects containing a URL and an empty data array.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchPokemonTypes() {
        const result = await this.fetchData(`${API_BASE_URL}/type`);
        return transformStructuredData(result.results);
    }

    /**
     * Fetches Pokémon data for a specific type from the provided URL.
     * 
     * @param {string} url - The URL to fetch Pokémon data from.
     * @returns {Promise<Array<string>>} - A promise that resolves to an array of Pokémon names for the specified type.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchSpecificTypePokemons(url) {
        const result = await this.fetchData(url);
        return result.pokemon.map(elm => elm.pokemon.name);
    }

    /**
     * Fetches the list of Pokémon colors from the API.
     * 
     * @returns {Promise<Object>} - A promise that resolves to an object where the keys are Pokémon color names and the values are objects containing a URL and an empty data array.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchPokemonColors() {
        const result = await this.fetchData(`${API_BASE_URL}/pokemon-color`);
        return transformStructuredData(result.results);
    }

    /**
     * Fetches Pokémon data for a specific color from the provided URL.
     * 
     * @param {string} url - The URL to fetch Pokémon data from.
     * @returns {Promise<Array<string>>} - A promise that resolves to an array of Pokémon names for the specified color.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchSpecificColorPokemons(url) {
        const result = await this.fetchData(url);
        return result.pokemon_species.map(elm => elm.name);
    }

    /**
     * Fetches the list of Pokémon genders from the API.
     * 
     * @returns {Promise<Object>} - A promise that resolves to an object where the keys are Pokémon gender names and the values are objects containing a URL and an empty data array.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchPokemonGenders() {
        const result = await this.fetchData(`${API_BASE_URL}/gender`);
        return transformStructuredData(result.results);
    }

    /**
     * Fetches Pokémon data for a specific gender from the provided URL.
     * 
     * @param {string} url - The URL to fetch Pokémon data from.
     * @returns {Promise<Array<string>>} - A promise that resolves to an array of Pokémon names for the specified gender.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchSpecificGenderPokemons(url) {
        const result = await this.fetchData(url);
        return result.pokemon_species_details.map(elm => elm.pokemon_species.name);
    }

    /**
     * Fetches detailed information about a Pokémon from the given URL.
     * 
     * @param {string} url - The URL from which to fetch Pokémon data.
     * @returns {Promise<string>} - A promise that resolves to a formatted string containing detailed Pokémon information.
     * @throws {Error} - Throws an error if the fetch operation fails or if there is a problem processing the data.
     */
    async fetchMoreInfoPokemons(url) {
        const result = await this.fetchData(url);
        return structureMoreInfo(result);
    }
}

const apiService = new APIService();
export default apiService;