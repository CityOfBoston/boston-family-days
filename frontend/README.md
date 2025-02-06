# Boston Family Days Frontend Application

This is the frontend application for Boston Family Days, hosted via Firebase Hosting and integrated with callable Cloud Functions. The application uses Shadow DOM to ensure that when embedded in Boston.gov Drupal pages, the global styles from Drupal do not interfere with the unique styles of this application.

## Prerequisites

- **Node Version Manager (NVM):** Ensure you have NVM installed to manage Node.js versions.
- **Node.js:** Use Node.js version 18. You can set this up using NVM:
  ```bash
  nvm install 18
  nvm use 18
  ```
- **Yarn:** This project uses Yarn as the package manager. Install it globally if you haven't:
  ```bash
  npm install --global yarn
  ```

## Setup

1. **Install Dependencies:**
   ```bash
   yarn install
   ```

2. **Environment Variables:**
   - Copy `.env.example` to `.env` and fill in the necessary Firebase configuration values.
   - **Important:** After any changes to environment variables, you must rebuild the project before deployment:
     ```bash
     yarn build
     ```

3. **Development Server:**
   - Start the development server:
     ```bash
     yarn dev
     ```

## Deployment

- Deploy the application to Firebase Hosting:
  ```bash
  firebase deploy --only hosting
  ```

## Tailwind CSS Setup

This project uses Tailwind CSS for styling. The setup includes:

- **Base Styles:** Tailwind's base styles are imported to provide a solid foundation.
- **Components and Utilities:** Tailwind's component and utility classes are used extensively throughout the application.
- **Custom Fonts:** The application uses Lora and Montserrat fonts, applied using Tailwind's `@apply` directive.

## File Structure

- **`frontend/.env.example`:** Template for environment variables.
- **`frontend/index.html`:** The main HTML file, setting up the application entry point.
- **`frontend/src/App.tsx`:** The main React component, defining the application's routes and structure.
- **`frontend/src/main.tsx`:** The entry point for the React application, setting up the Shadow DOM and rendering the app.
- **`frontend/src/index.css`:** The main CSS file, importing USWDS styles and Tailwind CSS, and applying custom styles.

## Notes

- The application uses Shadow DOM to encapsulate styles, preventing style conflicts when embedded in other pages.
- Ensure all environment variables are correctly set and the project is rebuilt before deploying to avoid runtime errors.

## Contributing

Feel free to open issues or submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.
