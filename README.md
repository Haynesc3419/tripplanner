# Trip Planner

A web application that helps users plan their trips using AI assistance. The app provides a chat interface to interact with an AI assistant, displays locations on a map, and allows users to view and edit their travel itinerary.

## Features

- Interactive chat interface for trip planning
- Real-time map display of locations
- Options panel for selecting accommodations, transportation, and activities
- Itinerary drawer for viewing and editing trip details
- Firebase integration for data persistence

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_MAPBOX_TOKEN=your_mapbox_token
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

- `src/components/`: React components
  - `ChatPanel.tsx`: Chat interface for interacting with AI
  - `MapPanel.tsx`: Map display component
  - `OptionsPanel.tsx`: Options selection panel
  - `ItineraryDrawer.tsx`: Itinerary viewing and editing drawer
- `src/firebase.ts`: Firebase configuration
- `src/App.tsx`: Main application component

## Technologies Used

- React
- TypeScript
- Material-UI
- Firebase
- Mapbox GL JS
- React Router 