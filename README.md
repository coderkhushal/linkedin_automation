# LinkedIn Email Fetcher API

Welcome to the LinkedIn Email Fetcher API! This tool automates the process of fetching emails from LinkedIn users who are in your connections and have commented on your post, filtering them through a specific keyword.

## Features

- **Automated Email Fetching**: Automatically retrieves emails from LinkedIn users in your connections who have commented on your posts.
- **Keyword Filtering**: Filters the fetched emails based on a specified keyword to ensure relevance.
- **Seamless Integration**: Easily integrates into your existing workflows and systems.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime for robust backend development.
- **Puppeteer**: Headless browser for web scraping and automation.
- **Object-Oriented Programming (OOP)**: Ensures maintainable and scalable code structure.
- **TypeScript**: Provides static typing to enhance code quality and developer experience.

## Installation

1. **Clone the Repository**
    ```bash
    git clone https://github.com/coderkhushal/linkedin-automation.git
    cd linkedin-automation
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Build App**
    ```bash
    npx tsc -b
    ```
4. **Run the app**
    ```bash
    node dist/routes/index.js
    ``` 

## Usage
`

2. **API Endpoint**
    - **Fetch Emails**: `POST /getemails`
      (parameters)
        - `username`: Your Linkedin UserName as string.
        - `password`: Your Linkedin Password as string.
        - `postnumber` : The no of post on which you want to perform search ( latest post has postnumber 1 then it increases as post become older)
        - `keyword` : the keyword you are looking in comments as string
    


