```mermaid
sequenceDiagram
    participant browser
    participant spa
    participant server
    
    browser->>spa: User creates a new note
    spa->>server: AJAX POST request to create new note
    server-->>spa: Status 201 Created
    spa-->>browser: Confirmation of successful note creation
    
    Note right of spa: SPA updates the interface to reflect the new note
    
    spa->>server: AJAX request for updated data.json
    server-->>spa: Updated list of notes
```
