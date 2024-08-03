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

    async fetchPokemonTypes() {
        try {
            const response = await fetch(`${API_BASE_URL}/type`);
            const result = await response.json();
            return this.transformStructuredData(result.results);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async fetchSpecificTypePokemons(url) {
        try {
            const response = await fetch(url);
            const result = await response.json();
            return result.pokemon.map(elm => elm.pokemon.name);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async fetchPokemonColors() {
        try {
            const response = await fetch(`${API_BASE_URL}/pokemon-color`);
            const result = await response.json();
            return this.transformStructuredData(result.results);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async fetchSpecificColorPokemons(url) {
        try {
            const response = await fetch(url);
            const result = await response.json();
            return result.pokemon_species.map(elm => elm.name);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async fetchPokemonGenders() {
        try {
            const response = await fetch(`${API_BASE_URL}/gender`);
            const result = await response.json();
            return this.transformStructuredData(result.results);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async fetchSpecificGenderPokemons(url) {
        try {
            const response = await fetch(url);
            const result = await response.json();
            return result.pokemon.map(elm => elm.pokemon.name);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    transformStructuredData(wholeData) {
        return wholeData.reduce((acc, { name, url }) => {
            acc[name] = {url: url, data: []};
            return acc;
        }, {});
    }
}

const apiService = new APIService();
export default apiService;
