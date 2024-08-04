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

        shadow.innerHTML = '';

        const cardContainer = document.createElement('div');
        cardContainer.setAttribute('class', 'card');

        const linkElem = document.createElement('a');
        linkElem.href = '#'; 
        linkElem.setAttribute('class', 'card__link');
        linkElem.setAttribute('data-url', this.getAttribute('url'));

        const flipContainer = document.createElement('div');
        flipContainer.setAttribute('class', 'card__flip-container');

        const cardFront = document.createElement('div');
        cardFront.setAttribute('class', 'card__front');

        const imgFront = document.createElement('img');
        imgFront.setAttribute('class', 'card__image');
        imgFront.alt = this.getAttribute('name') || 'Pokemon image';
        imgFront.src = this.getAttribute('image');

        const textContainer = document.createElement('div');
        textContainer.setAttribute('class', 'card__name');

        const name = document.createElement('p');
        name.setAttribute('class', 'card__text');
        name.textContent = `#${this.getAttribute('id')} ${this.getAttribute('name')}` || 'Pokemon Name';

        textContainer.appendChild(name);
        cardFront.appendChild(imgFront);
        cardFront.appendChild(textContainer);

        const cardBack = document.createElement('div');
        cardBack.setAttribute('class', 'card__back');

        const imgBack = document.createElement('img');
        imgBack.setAttribute('class', 'card__image');
        imgBack.alt = 'Pokemon back image'; 
        imgBack.src = 'resources/images/back-pokemon-card.png';

        cardBack.appendChild(imgBack);

        flipContainer.appendChild(cardFront);
        flipContainer.appendChild(cardBack);

        linkElem.appendChild(flipContainer);

        cardContainer.appendChild(linkElem);

        const linkStylesheet = document.createElement('link');
        linkStylesheet.setAttribute('rel', 'stylesheet');
        linkStylesheet.setAttribute('href', 'components/pokemon-card/pokemon-card.css');

        shadow.appendChild(linkStylesheet);
        shadow.appendChild(cardContainer);

        /* Rendererd HTML structure
        <div class="card">
            <a href="#" class="card__link" data-url="https://pokeapi.co/api/v2/pokemon-species/1/">
                <div class="card__flip-container">
                    <div class="card__front">
                        <img class="card__image" alt="bulbasaur" src="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png">
                        <div class="card__name">
                        <p class="card__text">#1 bulbasaur</p>
                        </div>
                    </div>
                    <div class="card__back"><img class="card__image" alt="Back image" src="resources/images/back-pokemon-card.png"></div>
                </div>
            </a>
        </div>
        */

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
