sequenceDiagram
    participant Selain
    participant Käyttäjä

    Note over Selain: Käyttäjä kirjoittaa uuden muistiinpanon tekstikenttään ja painaa "Tallenna"

    Selain ->> Palvelin: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate Palvelin
    Note right of Palvelin: Käsittelee uuden muistiinpanon ja tallentaa sen tietokantaan
    Palvelin -->> Selain: 302 Found (uudelleenohjaus)
    deactivate Palvelin

    Selain ->> Palvelin: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate Palvelin
    Palvelin -->> Selain: HTML-dokumentti
    deactivate Palvelin

    Selain ->> Palvelin: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate Palvelin
    Palvelin -->> Selain: CSS-tiedosto
    deactivate Palvelin

    Selain ->> Palvelin: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate Palvelin
    Palvelin -->> Selain: JavaScript-tiedosto
    deactivate Palvelin

    Note right of Selain: Selain alkaa suorittaa JavaScript-koodia, joka hakee JSON-tietoja palvelimelta

    Selain ->> Palvelin: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate Palvelin
    Palvelin -->> Selain: JSON-data
    deactivate Palvelin

    Note right of Selain: Selain suorittaa callback-funktion, joka renderöi muistiinpanot, mukaan lukien uuden muistiinpanon
