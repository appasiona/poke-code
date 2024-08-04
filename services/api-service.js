const API_BASE_URL = 'https://pokeapi.co/api/v2';

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
     * Fetches data from the Pokémon API and transforms it.
     *
     * @async
     * @function
     * @returns {Promise<void>} - A promise that resolves when the data has been fetched and transformed.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchPokemonData() {
        try {
            const response = await fetch(`${API_BASE_URL}/pokedex/national`);
            const result = await response.json();
            return this.transformPokemonData(result.pokemon_entries);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    /**
     * Transforms raw Pokémon data into a structured format.
     *
     * @param {Array<Object>} wholeData - The raw Pokémon data from the API.
     * @returns {Array<Object>} - The transformed Pokémon data.
     */
    transformPokemonData(wholeData) {
        return wholeData.map(pokemonEntry => ({
            id: pokemonEntry.entry_number,
            name: pokemonEntry.pokemon_species.name,
            image: `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${String(pokemonEntry.entry_number).padStart(3, '0')}.png`,
            url: pokemonEntry.pokemon_species.url
        }));
    }

    /**
     * Fetches the list of Pokémon types from the API.
     * 
     * @returns {Promise<Object>} - A promise that resolves to an object where the keys are Pokémon type names and the values are objects containing a URL and an empty data array.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchPokemonTypes() {
        try {
            const response = await fetch(`${API_BASE_URL}/type`);
            const result = await response.json();
            return this.transformStructuredData(result.results);
        } catch (error) {
            console.error('[fetchPokemonTypes] Error fetching data:', error);
            throw error;
        }
    }

    /**
     * Fetches Pokémon data for a specific type from the provided URL.
     * 
     * @param {string} url - The URL to fetch Pokémon data from.
     * @returns {Promise<Array<string>>} - A promise that resolves to an array of Pokémon names for the specified type.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchSpecificTypePokemons(url) {
        try {
            const response = await fetch(url);
            const result = await response.json();
            return result.pokemon.map(elm => elm.pokemon.name);
        } catch (error) {
            console.error('[fetchSpecificTypePokemons] Error fetching data:', error);
            throw error;
        }
    }

    /**
     * Fetches the list of Pokémon colors from the API.
     * 
     * @returns {Promise<Object>} - A promise that resolves to an object where the keys are Pokémon color names and the values are objects containing a URL and an empty data array.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchPokemonColors() {
        try {
            const response = await fetch(`${API_BASE_URL}/pokemon-color`);
            const result = await response.json();
            return this.transformStructuredData(result.results);
        } catch (error) {
            console.error('[fetchPokemonColors] Error fetching data:', error);
            throw error;
        }
    }

    /**
     * Fetches Pokémon data for a specific color from the provided URL.
     * 
     * @param {string} url - The URL to fetch Pokémon data from.
     * @returns {Promise<Array<string>>} - A promise that resolves to an array of Pokémon names for the specified color.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchSpecificColorPokemons(url) {
        try {
            const response = await fetch(url);
            const result = await response.json();
            return result.pokemon_species.map(elm => elm.name);
        } catch (error) {
            console.error('[fetchSpecificColorPokemons] Error fetching data:', error);
            throw error;
        }
    }

    /**
     * Fetches the list of Pokémon genders from the API.
     * 
     * @returns {Promise<Object>} - A promise that resolves to an object where the keys are Pokémon gender names and the values are objects containing a URL and an empty data array.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchPokemonGenders() {
        try {
            const response = await fetch(`${API_BASE_URL}/gender`);
            const result = await response.json();
            return this.transformStructuredData(result.results);
        } catch (error) {
            console.error('[fetchPokemonGenders] Error fetching data:', error);
            throw error;
        }
    }

    /**
     * Fetches Pokémon data for a specific gender from the provided URL.
     * 
     * @param {string} url - The URL to fetch Pokémon data from.
     * @returns {Promise<Array<string>>} - A promise that resolves to an array of Pokémon names for the specified gender.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchSpecificGenderPokemons(url) {
        try {
            const response = await fetch(url);
            const result = await response.json();
            return result.pokemon_species_details.map(elm => elm.pokemon_species.name);
        } catch (error) {
            console.error('[fetchSpecificGenderPokemons] Error fetching data:', error);
            throw error;
        }
    }

    /**
     * Fetches detailed information about a Pokémon from the given URL.
     * 
     * @param {string} url - The URL from which to fetch Pokémon data.
     * @returns {Promise<string>} - A promise that resolves to a formatted string containing detailed Pokémon information.
     * @throws {Error} - Throws an error if the fetch operation fails or if there is a problem processing the data.
     */
    async fetchMoreInfoPokemons(url) {
        try {
            const response = await fetch(url);
            const result = await response.json();
            return this.structureMoreInfo(result);
        } catch (error) {
            console.error('[fetchSpecificGenderPokemons] Error fetching data:', error);
            throw error;
        }
    }

    /**
     * Transforms Pokémon data into a human-readable format.
     * 
     * @param {Object} data - The raw Pokémon data object.
     * @returns {string} - A formatted string containing detailed information about the Pokémon.
     */
    structureMoreInfo(data) {
        let output = '';

        if (data.id !== undefined && data.id !== null) {
            output += `Number: #${data.id} \n`;
        }

        if (data.name) {
            output += `Name: ${this.capitalize(data.name)} \n`;
        }

        if (data.color && data.color.name) {
            output += `Color: ${this.capitalize(data.color.name)} \n`;
        }

        if (data.capture_rate !== undefined && data.capture_rate !== null) {
            output += `Capture rate: ${data.capture_rate} \n`;
        }

        if (data.habitat && data.habitat.name) {
            output += `Habitat: ${this.capitalize(data.habitat.name)} \n`;
        }

        if (data.egg_groups && data.egg_groups.length > 0) {
            output += `Egg groups: ${data.egg_groups.map(gr => this.capitalize(gr.name)).join(',  ')} \n`;
        }

        if (data.is_legendary !== undefined) {
            output += `Is legendary: ${data.is_legendary ? 'Yes' : 'No'} \n`;
        }

        if (data.is_mythical !== undefined) {
            output += `Is mystical: ${data.is_mythical ? 'Yes' : 'No'} \n`;
        }

        return output;
    }

    /**
     * Capitalizes the first letter of a given text string.
     *
     * @param {string} text - The text to be capitalized.
     * @returns {string} - The capitalized text.
     */
    capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }


    /**
     * Transforms structured data from the API into a format suitable for internal use.
     * 
     * @param {Array<Object>} wholeData - The raw data from the API, containing objects with `name` and `url` properties.
     * @returns {Object} - An object where the keys are Pokémon names and the values are objects containing a URL and an empty data array.
     */
    transformStructuredData(wholeData) {
        return wholeData.reduce((acc, { name, url }) => {
            acc[name] = { url: url, data: [] };
            return acc;
        }, {});
    }

}

const apiService = new APIService();
export default apiService;
