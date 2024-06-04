sequenceDiagram
    participant Browser
    participant User

    Note over Browser: User writes a new note in the text field and clicks "Save"

    Browser ->> Server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate Server
    Note right of Server: Processes the new note and saves it to the database
    Server -->> Browser: 302 Found (redirect)
    deactivate Server

    Browser ->> Server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate Server
    Server -->> Browser: HTML document
    deactivate Server

    Browser ->> Server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate Server
    Server -->> Browser: CSS file
    deactivate Server

    Browser ->> Server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate Server
    Server -->> Browser: JavaScript file
    deactivate Server

    Note right of Browser: Browser starts executing JavaScript code that fetches JSON data from the server

    Browser ->> Server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate Server
    Server -->> Browser: JSON data
    deactivate Server

    Note right of Browser: Browser executes the callback function that renders the notes, including the new one
