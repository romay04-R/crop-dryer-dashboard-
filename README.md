# Crop Dryer Dashboard

A Next.js frontend for the **Crop Dryer Monitor API** — a control-panel-styled
dashboard for watching temperature, humidity, water level, fan status, and
alarms from an Arduino-based crop drying system.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (custom "control panel" theme — no UI kit)
- Recharts for the temperature/humidity trend chart

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Point the app at your backend:

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` if your Spring Boot API isn't on `http://localhost:8080`:

   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ```

3. Make sure your backend allows this app's origin. In the API's
   `application.yml`:

   ```yaml
   cropdryer:
     cors:
       allowed-origins: "http://localhost:3000,http://localhost:5173"
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## What's included

- **Dashboard (`/`)** — latest reading as gauge-style stat cards (temperature,
  humidity, water level, fan), color-coded alarm badge, and an area chart of
  the last 50 readings. Polls the API every 12 seconds; a manual refresh
  button is also available.
- **History (`/history`)** — table of recent readings with a 20/50/100 limit
  toggle.
- **Alerts (`/alerts`)** — card grid of only WARN/HIGH readings, with a calm
  empty state when everything's OK.
- **Device filter** — a device ID field in the navbar (desktop) or menu
  (mobile) filters all three pages and persists across visits.
- Loading skeletons and a "Signal lost" error state with retry on every page,
  in case the API is unreachable.

## Deployment

### GitHub Pages

The project is configured for automatic deployment to GitHub Pages:

1. Push your code to the `main` branch of your GitHub repository
2. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions
3. The workflow will automatically build and deploy on push to `main`

The deployment uses a static export (Next.js `output: 'export'`), which generates a pure static site suitable for GitHub Pages.

## Notes

- If `cropdryer.api.key` is set on the backend, this frontend's `GET`
  requests don't need it (the key only guards the `POST /api/readings`
  endpoint, which the Arduino calls directly) — no changes needed here.
- Fully responsive from small phones up through desktop; the navbar collapses
  into a menu below the `md` breakpoint and tables scroll horizontally on
  narrow screens.
