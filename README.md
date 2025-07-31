# Star Wars Search App

A React-based search application for Star Wars data with image integration.

## Features

- 🔍 Real-time search across Star Wars characters, planets, films, species, vehicles, and starships
- 🖼️ Image integration with Unsplash and Pexels APIs
- 📱 Responsive design with Material-UI components
- 🚀 Fast autocomplete with debounced search

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Image API Keys (Optional - app works without them using placeholder images)
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
VITE_PEXELS_API_KEY=your_pexels_api_key_here
```

### Getting API Keys

- **Unsplash**: Sign up at [https://unsplash.com/developers](https://unsplash.com/developers)
- **Pexels**: Sign up at [https://www.pexels.com/api/](https://www.pexels.com/api/)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## API Endpoints

The app uses the Star Wars API (SWAPI) for data:
- Base URL: `https://swapi.py4e.com/api/`
- Supports search across all Star Wars entities
- No authentication required

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Material-UI (MUI)
- **State Management**: React Hooks
- **API**: SWAPI (Star Wars API)
- **Images**: Unsplash API, Pexels API
