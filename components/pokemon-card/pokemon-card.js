class PokemonCard extends HTMLElement {
    constructor() {
        super();
        
        const shadow = this.attachShadow({ mode: 'open' });

        const cardContainer = document.createElement('div');
        cardContainer.setAttribute('class', 'card');

        const img = document.createElement('img');
        img.setAttribute('class', 'card__image');
        img.alt = this.getAttribute('name') || 'Pokemon image';
        img.src = this.getAttribute('image');

        const textContainer = document.createElement('div');
        textContainer.setAttribute('class', 'card__text');

        const name = document.createElement('p');
        name.textContent = this.getAttribute('name') || 'Pokemon Name';

        textContainer.appendChild(name);
        cardContainer.appendChild(img);
        cardContainer.appendChild(textContainer);

        // Styles
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', 'components/pokemon-card/pokemon-card.css');

        shadow.appendChild(linkElem);
        shadow.appendChild(cardContainer);
    }
}

customElements.define('pokemon-card', PokemonCard);
