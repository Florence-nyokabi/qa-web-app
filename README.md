# QA Web App

**Project Name:** QA Web App  

## Overview
This repository hosts a web application designed for quality assurance assessments, featuring authentication, integration with JSONPlaceholder for data, and a comprehensive testing suite. The app includes pages for landing, login, and authenticated sections for Home, User, Album, and Photo.

## Key Features
- **Authentication:** Leveraged via Firebase.
- **Frontend:** Developed using React.
- **API Integration:** Pulls data from JSONPlaceholder.
- **Testing:** Focuses on automated testing with Jest for JavaScript and React Testing Library for React component testing.

## Project Structure
- **/public**: This folder contains static files like `index.html` and other assets that are served directly to the client.
  
- **/src**: The source code for the web application, containing:
  - **/components**: The React components that form the app's UI.
    - Each component typically has three files:
      - `index.js`: The core React component logic.
      - `index.test.js`: A Jest-based test file for the component.
      - `style.css`: Component-specific styles.
  
  - **/tests**: This folder contains an automated test script.
    - For example, `test_search_functionality.py` contains a Python script that tests the search functionality.


## Installation

1. **Clone the repository:**
    ```bash
    git clone [https://github.com/Florence-nyokabi/qa-web-test]
    cd qa-web-test
    ```

2. **Setup Environment Variables:**
    You will need to manually create a `.env` file in `src/` with necessary configurations like Firebase credentials. Here's an example of what you might need:
    ```
    REACT_APP_FIREBASE_API_KEY=your-api-key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
    REACT_APP_FIREBASE_PROJECT_ID=your-project-id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
    REACT_APP_FIREBASE_APP_ID=your-app-id

    <!-- Test Data -->
    TEST_EMAIL=your-email-address
    TEST_PASSWORD=your-password
    ```

3. **Run the development server:**
    ```bash
    npm start
    ```

## Running Tests

### Automated Testing
#### Unit & Integration Tests:

Execute all tests with:
```bash
npm run test
```

### Running Selenium Tests

To run the Selenium-based tests, ensure you have the required dependencies and a compatible web driver (e.g., ChromeDriver for Google Chrome) installed. You can run the Selenium test script with:

```bash
python3 test_search_functionality.py
```

## Deployment

### Build the application for production:
To create a production-ready build of your application, run the following command:

```bash
npm run build
```

## Authors
- **Florence-Wangui** - [GitHub Profile](https://github.com/Florence-nyokabi)

## Acknowledgments
- **JSONPlaceholder** for the mock API service, which provides fake data for testing and prototyping.
- **Firebase** for authentication services, allowing seamless user authentication in the application.
- All the **open-source libraries and tools** utilized in this project, which have contributed to its functionality and ease of development.