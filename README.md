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

## Authentication

All API endpoints are now protected by JWT authentication. Obtain a token by
sending your username and password to the `/token` endpoint:

```bash
curl -X POST http://127.0.0.1:18006/token \
     -d 'username=<user>' -d 'password=<pass>'
```

The returned `access_token` can be used to sign in through the `/login` page of
the UI. After logging in, the token will be stored in the browser and
automatically sent with every request.

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
