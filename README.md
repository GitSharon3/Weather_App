# Weather App (React + Vite + OpenWeatherMap)

A modern weather app built with **React**, **Vite**, and the **OpenWeatherMap API**.

## Features

- City search
- Use current location (geolocation)
- Current weather (temperature, feels like, humidity, wind)
- 5-day forecast (3-hour intervals)
- Unit toggle (°C / °F)
- Favorites + recent searches (saved in localStorage)
- Temperature chart (SVG)
- Loading and error states
- Responsive UI (mobile/tablet/desktop)

## Tech Stack

- React 18
- Vite 5
- OpenWeatherMap API

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file in the project root:

Create **`.env.local`**:

```env
VITE_OWM_API_KEY=YOUR_OPENWEATHERMAP_API_KEY
```

3. Start dev server:

```bash
npm run dev
```