# Parking Management UI

This repository contains a simple frontend built with **Vue 3** and **Vite**. It provides a basic interface for managing parking cameras and demonstrates CRUD operations against a REST API.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

The application expects a backend available at `http://127.0.0.1:18006`. If your API runs elsewhere, update the `baseURL` setting in [`src/services/cameraService.js`](src/services/cameraService.js).

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
