import { contentElms, headerElms, sidebarContainer } from "../config/constants.js";
import { createElementWithClass } from '../utils/helper.js';
import { filterData } from "./core.js";

/**
 * Displays a dropdown menu with the provided list of items.
 * 
 * @param {Array<Object>} items - An array of objects to display in the dropdown. Each object should have an `id` and `name` property.
 * @returns {void}
 */
export const showSearchDropdown = (items) => {
    headerElms.searchDropdown.innerHTML = '';

    if (items.length === 0) {
        headerElms.searchDropdown.classList.remove('header__search-dropdown--visible');
        return;
    }

    // Use a document fragment to avoid repeated DOM manipulations
    const fragment = document.createDocumentFragment();

    // Reusable function to handle click on each dropdown item
    const handleClick = (item) => {
        headerElms.searchInput.value = item.name.charAt(0).toUpperCase() + item.name.slice(1);
        headerElms.searchDropdown.classList.remove('header__search-dropdown--visible');
        filterData();
    };

    // Add items to the fragment
    items.forEach(item => {
        const div = createElementWithClass('div', 'header__search-dropdown-item');
        div.textContent = `#${item.id} ${item.name}`;
        div.addEventListener('click', () => handleClick(item));
        fragment.appendChild(div);
    });

    // Append the entire fragment to the dropdown in one operation
    headerElms.searchDropdown.appendChild(fragment);
    headerElms.searchDropdown.classList.add('header__search-dropdown--visible');
};


/**
 * Renders a list of Pokémon cards in the container.
 *
 * @param {Array<{ id: number, name: string, image: string, url: string  }>} pokemonList - List of Pokémon objects, each with an id, a name and an image URL.
 * @returns {void}
 */
export const renderCards = (pokemonList) => {
    pokemonList.forEach(pokemon => {
        const card = document.createElement('pokemon-card');
        card.setAttribute('id', pokemon.id);
        card.setAttribute('name', pokemon.name);
        card.setAttribute('image', pokemon.image);
        card.setAttribute('url', pokemon.url);
        contentElms.cardsContainer.appendChild(card);
    });
};

/**
 * Show sidebar in mobile.
 * 
 * @returns {void} - This function does not return any value.
 */
export const showSidebar = () => {
    sidebarContainer.classList.add('sidebar--visible');
};

/**
 * Hide sidebar in mobile.
 * 
 * @returns {void} - This function does not return any value.
 */
export const hideSidebar = () => {
    sidebarContainer.classList.remove('sidebar--visible');
};

/**
 * Handles click events on the document to manage the visibility of the search dropdown and filters.
 * 
 * @listens document#click
 * @param {MouseEvent} event - The click event object.
 * @property {EventTarget} event.target - The target of the click event.
 */
document.addEventListener('click', (event) => {
    if (!event.target.closest('.header__search')) {
        headerElms.searchDropdown.classList.remove('header__search-dropdown--visible');
    }

    if (!event.target.closest('.main__filter-button') && !event.target.closest('.sidebar')) {
        hideSidebar();
    }
});