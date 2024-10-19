import { API_BASE_URL, API_ASSETS_URL } from '../utils/constants.js';

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
        /** 
         * @property {number} currentIndex - Index for tracking data retrieval.
         */
        this.currentIndex = 0;
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
        return this.transformPokemonData(result.pokemon_entries);
    }

    /**
     * Transforms raw Pokémon data into a structured format.
     *
     * @param {Array<Object>} wholeData - The raw Pokémon data from the API.
     * @returns {Array<Object>} - The transformed Pokémon data.
     */
    transformPokemonData(wholeData) {
        return wholeData.map(({ entry_number, pokemon_species }) => ({
            id: entry_number,
            name: pokemon_species.name,
            image: `${API_ASSETS_URL}/cms2/img/pokedex/detail/${String(entry_number).padStart(3, '0')}.png`,
            url: pokemon_species.url
        }));
    }

    /**
     * Fetches the list of Pokémon types from the API.
     * 
     * @returns {Promise<Object>} - A promise that resolves to an object where the keys are Pokémon type names and the values are objects containing a URL and an empty data array.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchPokemonTypes() {
        const result = await this.fetchData(`${API_BASE_URL}/type`);
        return this.transformStructuredData(result.results);
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
        return this.transformStructuredData(result.results);
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
        return this.transformStructuredData(result.results);
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
        return this.structureMoreInfo(result);
    }

    /**
     * Transforms Pokémon data into a human-readable format.
     * 
     * @param {Object} data - The raw Pokémon data object.
     * @returns {string} - A formatted string containing detailed information about the Pokémon.
     */
    structureMoreInfo(data) {
        const lines = [];

        if (data.id != null) {
            lines.push(`Number: #${data.id}`);
        }

        if (data.name) {
            lines.push(`Name: ${this.capitalize(data.name)}`);
        }

        if (data.color?.name) {
            lines.push(`Color: ${this.capitalize(data.color.name)}`);
        }

        if (data.capture_rate != null) {
            lines.push(`Capture rate: ${data.capture_rate}`);
        }

        if (data.habitat?.name) {
            lines.push(`Habitat: ${this.capitalize(data.habitat.name)}`);
        }

        if (data.egg_groups?.length) {
            lines.push(`Egg groups: ${data.egg_groups.map(gr => this.capitalize(gr.name)).join(', ')}`);
        }

        if (data.is_legendary != null) {
            lines.push(`Is legendary: ${data.is_legendary ? 'Yes' : 'No'}`);
        }

        if (data.is_mythical != null) {
            lines.push(`Is mystical: ${data.is_mythical ? 'Yes' : 'No'}`);
        }

        return lines.join('\n');
    }

    /**
     * Capitalizes the first letter of a given text string.
     *
     * @param {string} text - The text to be capitalized.
     * @returns {string} - The capitalized text.
     */
    capitalize(text) {
        if (typeof text !== 'string' || text.length === 0) {
            return text; // Return original input if it's not a string or is empty
        }
        return text.charAt(0).toUpperCase() + text.slice(1);
    }


    /**
     * Transforms structured data from the API into a format suitable for internal use.
     * 
     * @param {Array<Object>} wholeData - The raw data from the API, containing objects with `name` and `url` properties.
     * @returns {Object} - An object where the keys are Pokémon names and the values are objects containing a URL and an empty data array.
     */
    transformStructuredData(wholeData) {
        if (!Array.isArray(wholeData)) {
            throw new TypeError('Expected an array of objects');
        }

        return wholeData.reduce((acc, { name, url }) => {
            acc[name] = { url: url, data: [] };
            return acc;
        }, {});
    }

}

const apiService = new APIService();
export default apiService;