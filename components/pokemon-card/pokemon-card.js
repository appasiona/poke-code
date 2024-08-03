/**
 * @module
 * @description
 * Module for handling the display of Pokémon cards and loading initial and additional data.
 */

import apiService from '../../services/api-service.js';

/**
 * Custom element representing a Pokémon card.
 *
 * @class
 * @extends HTMLElement
 */
class PokemonCard extends HTMLElement {


    /**
     * Creates an instance of PokemonCard.
     * @constructor
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    /**
   * Renders the Pokémon card content and styles.
   *
   * @function
   * @returns {void} This method does not return any value.
   */
    render() {
        const shadow = this.shadowRoot;

        // Clear any existing content
        shadow.innerHTML = '';

        // Create and configure the card container
        const cardContainer = document.createElement('div');
        cardContainer.setAttribute('class', 'card');

        // Create and configure the link element
        const linkElem = document.createElement('a');
        linkElem.href = '#'; // Prevent default behavior, we'll handle click with JS
        linkElem.setAttribute('class', 'card__link');
        linkElem.setAttribute('data-url', this.getAttribute('url')); // Custom attribute for the URL

        // Create and configure image element
        const img = document.createElement('img');
        img.setAttribute('class', 'card__image');
        img.alt = this.getAttribute('name') || 'Pokemon image';
        img.src = this.getAttribute('image');

        // Create and configure text container
        const textContainer = document.createElement('div');
        textContainer.setAttribute('class', 'card__text');

        // Create and configure name element
        const name = document.createElement('p');
        name.textContent = `#${this.getAttribute('id')} ${this.getAttribute('name')}` || 'Pokemon Name';

        textContainer.appendChild(name);
        linkElem.appendChild(img);
        linkElem.appendChild(textContainer);

        // Append the link to the card container
        cardContainer.appendChild(linkElem);

        // Create and append stylesheet link
        const linkStylesheet = document.createElement('link');
        linkStylesheet.setAttribute('rel', 'stylesheet');
        linkStylesheet.setAttribute('href', 'components/pokemon-card/pokemon-card.css');

        shadow.appendChild(linkStylesheet);
        shadow.appendChild(cardContainer);

        // Add event listener to open the alert
        linkElem.addEventListener('click', async (event) => {
            event.preventDefault();
            const url = linkElem.getAttribute('data-url');
            await this.openAlert(url);
        });
    }

    /**
     * Opens an alert with additional information about a Pokémon.
     *
     * @function
     * @param {string} url - The URL to fetch additional information about the Pokémon.
     * @returns {Promise<void>} This method returns a promise that resolves when the alert is shown.
     */
    async openAlert(url) {
        const info = await apiService.fetchMoreInfoPokemons(url);
        alert(info);
    }

    /**
     * List of attributes to observe for changes.
     *
     * @static
     * @returns {Array<string>} - An array of attribute names to observe.
     */
    static get observedAttributes() {
        return ['id', 'name', 'image', 'url'];
    }

    /**
     * Callback function invoked when an observed attribute changes.
     *
     * @function
     * @returns {void}
     */
    attributeChangedCallback() {
        this.render();
    }
}

// Define the custom element
customElements.define('pokemon-card', PokemonCard);

