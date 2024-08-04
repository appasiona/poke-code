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

        // Create and configure the loader container
        const loaderContainer = document.createElement('div');
        loaderContainer.setAttribute('class', 'loader');
        loaderContainer.setAttribute('style', 'display: none');

        // Create and configure the loader item container
        const loaderItem = document.createElement('div');
        loaderItem.setAttribute('class', 'loader__item');

        // Create and configure the ball elements
        const ball = document.createElement('div');
        ball.setAttribute('class', 'loader__ball');

        const topHalfBall = document.createElement('div');
        topHalfBall.setAttribute('class', 'loader__top-half-ball');

        const bottomHalfBall = document.createElement('div');
        bottomHalfBall.setAttribute('class', 'loader__bottom-half-ball');

        const bigButton = document.createElement('div');
        bigButton.setAttribute('class', 'loader__big-button');

        const smallButton = document.createElement('div');
        smallButton.setAttribute('class', 'loader__small-button');

        const horizon = document.createElement('div');
        horizon.setAttribute('class', 'loader__horizon');

        // Append elements to loader item
        loaderItem.appendChild(ball);
        loaderItem.appendChild(topHalfBall);
        loaderItem.appendChild(bottomHalfBall);
        loaderItem.appendChild(bigButton);
        loaderItem.appendChild(smallButton);
        loaderItem.appendChild(horizon);

        // Append loader item to loader container
        loaderContainer.appendChild(loaderItem);

        // Create and append stylesheet link
        const linkStylesheet = document.createElement('link');
        linkStylesheet.setAttribute('rel', 'stylesheet');
        linkStylesheet.setAttribute('href', 'components/pokeball-loader/pokeball-loader.css');

        shadow.appendChild(linkStylesheet);
        shadow.appendChild(loaderContainer);
    }

    show() {
        this.activeRequests += 1;
        this.shadowRoot.querySelector('.loader').style.display = 'flex';
    }

    hide() {
        this.activeRequests -= 1;
        if (this.activeRequests <= 0) {
            this.activeRequests = 0;
            this.shadowRoot.querySelector('.loader').style.display = 'none';
        }
    }
}

// Define the custom element
customElements.define('pokeball-loader', PokeballLoader);
