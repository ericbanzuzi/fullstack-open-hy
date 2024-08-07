
Diagram depicting the situation where the user creates a new note on the page https://studies.cs.helsinki.fi/exampleapp/notes by writing something into the text field and clicking the Save button:

```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: The browser will send the user input for the new note to the server to process and create a new object.
    browser->>server: POST <https://studies.cs.helsinki.fi/exampleapp/new_note>
    activate server
    server-->>browser: 302 
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: 200, HTML document
    deactivate server

    browser->>server: GET <https://studies.cs.helsinki.fi/exampleapp/main.css>
    activate server
    server-->>browser: 200, the css file
    deactivate server

    browser->>server: GET <https://studies.cs.helsinki.fi/exampleapp/main.js>
    activate server
    server-->>browser: 200, the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET <https://studies.cs.helsinki.fi/exampleapp/data.json>
    activate server
    server-->>browser: 200, [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
```
