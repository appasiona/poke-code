/**
 * Base URL for the Pokémon API, used to fetch data about Pokémon.
 * @constant {string}
 */
export const API_BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Base URL for Pokémon assets, used to fetch media assets such as images.
 * @constant {string}
 */
export const API_ASSETS_URL = 'https://assets.pokemon.com/assets';

/**
 * Array to hold the initial Pokémon data.
 * @type {Array<Object>}
 */
export const pokemonData = [];

/**
 * Map to hold Pokémon types.
 * @type {Map<string, {url: string, data: Promise<Array<string>> | Array<string> | null}>}
 */
export const typeMap = new Map();

/**
 * Map to hold Pokémon colors.
 * @type {Map<string, {url: string, data: Promise<Array<string>> | Array<string> | null}>}
 */
export const colorMap = new Map();

/**
 * Map to hold Pokémon genders.
 * @type {Map<string, {url: string, data: Promise<Array<string>> | Array<string> | null}>}
 */
export const genderMap = new Map();

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
export const headerElms = {
    searchInput: headerContainer.querySelector('.header__search-input'),
    searchDropdown: headerContainer.querySelector('.header__search-dropdown'),
    resetSearchBox: headerContainer.querySelector('.header__search-cross')
};

/**
 * @const {HTMLElement} sidebar - The sidebar container element.
 */
export const sidebarContainer = document.getElementById('sidebar');

/**
 * @const {HTMLElement} mobileFilterButton - Button to show filters on mobile devices.
 */
export const mobileFilterButton = document.querySelector('.main__filter-button');

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
export const contentElms = {
    cardsContainer: contentContainer.querySelector('.content__cards'),
    loadMoreButton: contentContainer.querySelector('.content__button'),
    noResultsMessage: contentContainer.querySelector('.content__no-results'),
    loader: contentContainer.querySelector('pokeball-loader')
};