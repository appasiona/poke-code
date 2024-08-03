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
         * @property {Array<Object>} data - Array to hold Pokémon data.
         */
        this.data = [];
        
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
    async fetchData() {
        try {
            const response = await fetch(`${API_BASE_URL}/pokedex/national`);
            const result = await response.json();
            this.data = this.transformData(result.pokemon_entries);
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
    transformData(wholeData) {
        return wholeData.map(pokemonEntry => ({
            id: pokemonEntry.entry_number,
            name: pokemonEntry.pokemon_species.name,
            image: `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${String(pokemonEntry.entry_number).padStart(3, '0')}.png`,
            url: pokemonEntry.pokemon_species.url
        }));
    }

    /**
     * Retrieves the next batch of Pokémon data.
     *
     * @param {number} [batchSize=20] - The number of Pokémon to retrieve in the batch. Defaults to 20.
     * @returns {Array<Object>} - The next batch of Pokémon data.
     */
    getNextBatch(batchSize = 20) {
        const batch = this.data.slice(this.currentIndex, this.currentIndex + batchSize);
        this.currentIndex += batchSize;
        return batch;
    }
}

const apiService = new APIService();
export default apiService;
