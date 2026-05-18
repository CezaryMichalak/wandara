# WanderAI

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-Powered-111827?style=for-the-badge&logo=openai)

**WanderAI** is a premium dark luxury AI travel planner built for curated, high-end trip discovery. It combines a polished glassmorphism interface with OpenAI-powered itinerary generation, bilingual PL/EN experiences, saved trip workflows, reviews, KPIs, and client-side PDF exports with Polish character support.

Designed as a modern startup-style product, WanderAI turns destination ideas into elegant travel plans that can be previewed, saved, reopened, reviewed, and exported.

## Highlights

- **AI itinerary generation** powered by the OpenAI SDK through a Next.js App Router API route.
- **PL/EN language switcher** with Polish as the default language and smooth UI transitions.
- **Premium loading experience** for itinerary generation and polished async states.
- **Generated itinerary cards** with contextual Lucide icons and destination artwork.
- **Sample itinerary preview modal** with clickable static data for instant product exploration.
- **Saved Trips** using `localStorage`, including save, reopen, delete, and PDF export flows.
- **Reviews system** using `localStorage`, with 1-5 star ratings, optional comments, deletion, and live KPI updates.
- **Hero KPIs** connected to real review data for dynamic social proof.
- **PDF export** powered by `jsPDF`, including local Noto Sans fonts for Polish characters.
- **Responsive dark glassmorphism UI** built with Tailwind CSS v4.

## Screenshots

> Add screenshots to `docs/screenshots/` and update the image paths below.

<!--
![WanderAI Hero](docs/screenshots/hero.png)
![AI Itinerary Results](docs/screenshots/itinerary-results.png)
![Saved Trips](docs/screenshots/saved-trips.png)
![Reviews and KPIs](docs/screenshots/reviews.png)
-->

```text
docs/screenshots/
  hero.png
  itinerary-results.png
  saved-trips.png
  reviews.png
```

## Tech Stack

**Framework:** Next.js 16, React 19, App Router  
**Language:** TypeScript  
**Styling:** Tailwind CSS v4, dark glassmorphism UI  
**AI:** OpenAI SDK with `OPENAI_API_KEY`  
**Icons:** Lucide React  
**PDF Export:** jsPDF with local Noto Sans fonts  
**Persistence:** Browser `localStorage`

## AI Integration

WanderAI uses an App Router API route to generate travel itineraries with OpenAI. The client submits trip preferences, the server-side route calls the OpenAI SDK using `OPENAI_API_KEY`, and the UI renders the generated plan as premium itinerary cards.

Create `.env.local` in the project root:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Never commit real API keys. For production deployments, configure `OPENAI_API_KEY` in the hosting provider's environment variables.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Run quality checks:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Start the production server locally:

```bash
npm start
```

## Deployment

WanderAI is ready to deploy on [Vercel](https://vercel.com/), the recommended platform for Next.js applications.

1. Import the repository into Vercel.
2. Install dependencies with `npm install`.
3. Set the production environment variable `OPENAI_API_KEY`.
4. Deploy with the default Next.js build command: `npm run build`.

Because saved trips and reviews currently use browser `localStorage`, user data is stored per device and browser. There is no backend database or authentication layer in the current version.

## Data & Persistence

WanderAI intentionally keeps persistence lightweight:

- Saved trips are stored in the user's browser through `localStorage`.
- Reviews and rating KPIs are also stored locally.
- PDF generation happens client-side with `jsPDF`.
- No user accounts, backend database, or cloud sync are currently included.

This makes the app simple to run, easy to deploy, and ideal for product demos, prototypes, and early-stage validation.

## Future Improvements

- User authentication with cloud-synced saved trips and review history.
- Shareable public trip pages and collaborative planning.
- Map views, route planning, and calendar export.
- Richer traveler personalization based on budget, pace, style, and preferences.
- More advanced PDF exports with branded templates and multi-language formatting.
- Automated tests for itinerary generation, saved trips, reviews, and PDF export.
- Optional database layer for production-grade persistence and analytics.

## License

This project is private and currently does not declare an open-source license.
