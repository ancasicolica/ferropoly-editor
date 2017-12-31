# Ferropoly Editor

A game played on the public transport system in Switzerland. Visit www.ferropoly.ch for more details about this game.

This software project is generously supported by BrowserStack, [www.browserstack.com](https://www.browserstack.com), a tool enabling tests for every webbrowser on every device.

## Language policy
The documentation of the project is  in English while the user interface is in German (there are no plans for the support of other
languages).

## Design
Using Bootstrap and great free designs from [Bootswatch](https://bootswatch.com/cosmo/)

## Licence
GPL V3

## Testing
### Unit Tests
Run the unit tests in folder test/unit. These "unit" tests are testing several functionalites of the game, they need the mongodb running (so they don't use any sandboxing, could be refactored to be "real" unit tests).

### Intgration Tests
These tests are validating the functionality of the backend system: HTTP-Routes and sequences of the game. They're located in the test/integration/tests directory (the other folders in the integration directory contain helpers for easier testing).

Note that for the tests both instances, Editor and Main, must be running!

