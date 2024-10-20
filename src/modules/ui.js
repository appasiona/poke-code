import { contentElms, headerElms, mobileFilterButton, sidebarContainer } from "../config/constants.js";
import { createElementWithClass } from '../utils/helper.js';
import { filterData, filterDataFromSearchBar, loadNextBatch } from "./core.js";
import { closeFilters, resetAllFilters, resetColorFilterClick, resetGenderFilterClick, resetSearchBoxFilter, resetTypeFilterClick, showFilters } from "./filters.js";


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
        if (event.target.closest('.sidebar__close-button')) closeFilters();
    });

    sidebarContainer.querySelector('.sidebar__main-fieldset').addEventListener('change', filterData);

    contentElms.loadMoreButton.addEventListener('click', loadNextBatch);

    mobileFilterButton.addEventListener('click', showFilters);
}

/**
 * Displays a dropdown menu with the provided list of items.
 * 
 * @param {Array<Object>} items - An array of objects to display in the dropdown. Each object should have an `id` and `name` property.
 * @returns {void}
 */
const showSearchDropdown = (items) => {
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
const renderCards = (pokemonList) => {
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
        closeFilters();
    }
});

export { initializeEventListeners, renderCards, showSearchDropdown };
