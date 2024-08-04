# POKE:CODE

**POKE:CODE** is a web application that provides detailed information about Pokémon. The app allows users to search for Pokémon by name or ID and filter by type, color, and gender. Users can also view detailed information about each Pokémon such as color, habitat, egg groups, and more.

## Features

- Search Pokémon by name or ID
- Filter Pokémon by type, color, and gender
- View detailed information about each Pokémon

## Demo

[Link to live demo](https://appasiona.github.io/poke-code/) 

## Usage

To get started with **POKE:CODE**, follow these steps:

### Clone the Repository

```bash
git clone https://github.com/appasiona/poke-code.git
cd poke-code
```

### Navigate

1. **Search for Pokémon**: Use the search bar to look up Pokémon by name or ID.
2. **Filter Pokémon**: Apply filters to narrow down Pokémon by type, color, and gender.
3. **View Details**: Click on a Pokémon to view detailed information including:
   - **Number**: The unique identifier of the Pokémon.
   - **Name**: The name of the Pokémon.
   - **Color**: The color associated with the Pokémon.
   - **Capture Rate**: The likelihood of capturing the Pokémon.
   - **Habitat**: The natural habitat where the Pokémon is commonly found.
   - **Egg Groups**: The groups that determine the Pokémon’s breeding compatibility.
   - **Legendary Status**: Whether the Pokémon is considered legendary.
   - **Mythical Status**: Whether the Pokémon is considered mythical.


## CORS Issues and Local Development

When developing locally, you may encounter CORS (Cross-Origin Resource Sharing) issues if you try to access files using the `file://` protocol. To avoid these issues, use a local server to serve your files over `http` or `https`. Below are a few options for setting up a local server:

### XAMPP

1. Download and install XAMPP from [Apache Friends](https://www.apachefriends.org/index.html).
2. Place your project files in the `htdocs` directory within the XAMPP installation folder.
3. Start the Apache server from the XAMPP control panel.
4. Access your project at `http://localhost/your-project-folder`.

### Live Server Extension (VS Code)

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.liveserver) extension in Visual Studio Code.
2. Open your project folder in VS Code.
3. Right-click on your `index.html` file and select "Open with Live Server."
4. Your project will be served at `http://127.0.0.1:5500` (or another port specified by Live Server).

### `http-server` (npm package)

1. Install the `http-server` package globally using npm:

   ```bash
   npm install -g http-server
   ```
   
2. Navigate to your project directory:

    ```bash
   cd /path/to/your/project
   ```
   
3. Start the server:

    ```bash
   http-server
   ```
4. Access your project at http://localhost:8080 (default port).
   
## API Endpoints

The application fetches data from the PokéAPI. For more details on available endpoints, visit the [PokéAPI Documentation](https://pokeapi.co/).

## Contributing

Contributions are welcome! To contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License. 


## Acknowledgements

- [PokéAPI](https://pokeapi.co)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Original Pokeball Loading by Henry Lim](https://dribbble.com/shots/3014076-Pokeball-Loading)