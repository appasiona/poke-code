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
     * @returns {void}
     */
    render() {
        const shadow = this.shadowRoot;

        // Clear any existing content
        shadow.innerHTML = '';

        // Create and append card container
        const cardContainer = document.createElement('div');
        cardContainer.setAttribute('class', 'card');

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
        name.textContent = this.getAttribute('name') || 'Pokemon Name';

        textContainer.appendChild(name);
        cardContainer.appendChild(img);
        cardContainer.appendChild(textContainer);

        // Create and append stylesheet link
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', 'components/pokemon-card/pokemon-card.css');

        shadow.appendChild(linkElem);
        shadow.appendChild(cardContainer);
    }

    /**
     * List of attributes to observe for changes.
     *
     * @static
     * @returns {Array<string>} - An array of attribute names to observe.
     */
    static get observedAttributes() {
        return ['name', 'image'];
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

