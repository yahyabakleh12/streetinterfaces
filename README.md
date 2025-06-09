# Parking Management UI

This repository contains a simple frontend built with **Vue 3** and **Vite**. It provides a basic interface for managing parking cameras, tickets, and other resources, demonstrating CRUD operations against a REST API.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the `.env` file and adjust it if your backend runs on a different host:
   ```bash
   cp .env .env.local
   # edit .env.local to change VITE_API_BASE_URL if needed
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The application reads `VITE_API_BASE_URL` from the environment to locate the backend API. The default value in `.env` points to `http://127.0.0.1:18006`.

## Building for Production

Generate optimized assets in the `dist` directory with:
```bash
npm run build
```
You can preview the production build locally using:
```bash
npm run preview
```

For more information on working with Vue, see the [Vue 3 documentation](https://vuejs.org/).
