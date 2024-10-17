/**
 * @module
 * @description
 * Module for displaying a Pokeball loading animation.
 */

/**
 * Custom element representing a Pokeball loader.
 *
 * @class
 * @extends HTMLElement
 */
class PokeballLoader extends HTMLElement {

    /**
     * Creates an instance of PokeballLoader.
     * @constructor
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        this.activeRequests = 0;
    }

    /**
     * Renders the Pokeball loader content and styles.
     *
     * @function
     * @returns {void} This method does not return any value.
     */
    render() {
        const shadow = this.shadowRoot;

        // Clear any existing content
        shadow.innerHTML = '';

        const createElementWithClass = (tag, ...classes) => {
            const element = document.createElement(tag);
            element.classList.add(...classes);
            return element;
        };

        // Create loader structure
        const loaderContainer = createElementWithClass('div', 'loader', 'loader--hide');
        const loaderItem = createElementWithClass('div', 'loader__item');
        const ball = createElementWithClass('div', 'loader__ball');
        const topHalfBall = createElementWithClass('div', 'loader__top-half-ball');
        const bottomHalfBall = createElementWithClass('div', 'loader__bottom-half-ball');
        const bigButton = createElementWithClass('div', 'loader__big-button');
        const smallButton = createElementWithClass('div', 'loader__small-button');
        const horizon = createElementWithClass('div', 'loader__horizon');

        // Append elements to loader item
        loaderItem.append(ball, topHalfBall, bottomHalfBall, bigButton, smallButton, horizon);

        // Append loader item to loader container
        loaderContainer.appendChild(loaderItem);

        // Create and append stylesheet link
        const linkStylesheet = document.createElement('link');
        linkStylesheet.setAttribute('rel', 'stylesheet');
        linkStylesheet.setAttribute('href', 'src/components/pokeball-loader/pokeball-loader.css');

        shadow.appendChild(linkStylesheet);
        shadow.appendChild(loaderContainer);
    }

    /**
     * Displays the Pokeball loader.
     * 
     * @function
     * @returns {void} This method does not return any value.
     */
    show() {
        this.activeRequests += 1;
        const loaderElement = this.shadowRoot.querySelector('.loader');
        loaderElement.classList.remove('loader--hide');
        loaderElement.classList.add('loader--show');
    }

    /**
     * Hides the Pokeball loader.
     * 
     * @function
     * @returns {void} This method does not return any value.
     */
    hide() {
        this.activeRequests -= 1;
        if (this.activeRequests <= 0) {
            this.activeRequests = 0;
            const loaderElement = this.shadowRoot.querySelector('.loader');
            loaderElement.classList.remove('loader--show');
            loaderElement.classList.add('loader--hide');
        }
    }
}

// Define the custom element
customElements.define('pokeball-loader', PokeballLoader);
