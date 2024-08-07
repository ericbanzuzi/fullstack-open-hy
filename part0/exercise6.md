Diagram depicting the situation where the user creates a new note using the single-page version of the app:

```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: 201 Created
    Note over server: A new node is created and added to the database, no further HTTP requests needed
    deactivate server

    Note over browser: The browser executes the JavaScript file that updates the HTML and displays the new data
```
