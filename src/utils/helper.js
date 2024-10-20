import { API_ASSETS_URL } from '../config/constants.js';

/**
 * Creates a new HTML element with the specified tag name and class(es).
 *
 * @param {string} tag - The tag name of the element to create.
 * @param {...string} classes - The class names to be added to the created element.
 * @returns {HTMLElement} The newly created HTML element with the specified classes.
 */
export function createElementWithClass(tag, ...classes) {
    const element = document.createElement(tag);
    element.classList.add(...classes);
    return element;
}

/**
 * Transforms Pokémon data into a human-readable format.
 * 
 * @param {Object} data - The raw Pokémon data object.
 * @returns {string} - A formatted string containing detailed information about the Pokémon.
 */
export function structureMoreInfo(data) {
    const lines = [];

    if (data.id != null) {
        lines.push(`Number: #${data.id}`);
    }

    if (data.name) {
        lines.push(`Name: ${capitalize(data.name)}`);
    }

    if (data.color?.name) {
        lines.push(`Color: ${capitalize(data.color.name)}`);
    }

    if (data.capture_rate != null) {
        lines.push(`Capture rate: ${data.capture_rate}`);
    }

    if (data.habitat?.name) {
        lines.push(`Habitat: ${capitalize(data.habitat.name)}`);
    }

    if (data.egg_groups?.length) {
        lines.push(`Egg groups: ${data.egg_groups.map(gr => capitalize(gr.name)).join(', ')}`);
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
export function capitalize(text) {
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
export function transformStructuredData(wholeData) {
    if (!Array.isArray(wholeData)) {
        throw new TypeError('Expected an array of objects');
    }

    return wholeData.reduce((acc, { name, url }) => {
        acc[name] = { url: url, data: [] };
        return acc;
    }, {});
}

/**
 * Transforms raw Pokémon data into a structured format.
 *
 * @param {Array<Object>} wholeData - The raw Pokémon data from the API.
 * @returns {Array<Object>} - The transformed Pokémon data.
 */
export function transformPokemonData(wholeData) {
    return wholeData.map(({ entry_number, pokemon_species }) => ({
        id: entry_number,
        name: pokemon_species.name,
        image: `${API_ASSETS_URL}/cms2/img/pokedex/detail/${String(entry_number).padStart(3, '0')}.png`,
        url: pokemon_species.url
    }));
}