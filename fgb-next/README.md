# FGB Theaters — Next.js

Next.js port of the FGB Theaters site (originally React + Vite), built for
deployment on Vercel. Same pages, styling, and animations as the Vite app,
with bug fixes and a much smaller dependency footprint.

## Pages

| Route        | Page                                                            |
| ------------ | --------------------------------------------------------------- |
| `/`          | Home — slideshow hero, theater toggle, date picker, showtimes, coming-soon marquee |
| `/tickets`   | Ticket prices, online purchase link, terms                       |
| `/locations` | Both theaters with Mapbox maps and tap-to-call                   |
| `/rentals`   | Theater rental information                                       |
| `/about`     | History and photos                                               |
| `/home`      | Permanent redirect to `/`                                        |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the two values
npm run dev
```

### Environment variables

| Variable                          | Purpose                                              |
| --------------------------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_AWS_API_GATEWAY_URL` | API endpoint returning `{ Capitol, Paramount, Upcoming, Slideshow }` (was `VITE_AWS_API_GATEWAY_URL`) |
| `NEXT_PUBLIC_MAPBOX_API_KEY`      | Mapbox token for the Locations maps (was `VITE_MAPBOX_API_KEY`) |

## Deploying to Vercel

1. Import the repository in Vercel.
2. Set **Root Directory** to `fgb-next`.
3. Add the two environment variables above (Production + Preview).
4. Deploy — framework preset **Next.js**, no other configuration needed.

## Differences from the Vite app

**Fixes / improvements**

- Active nav highlight derives from the URL (`usePathname`), so it stays
  correct on browser back/forward and deep links.
- The Paramount "call" button now dials the Paramount (802-479-0078);
  previously both buttons dialed the Capitol.
- Slides whose `Background` palette is empty fall back to a solid color
  instead of a broken `linear-gradient(undefined, ...)`.
- Trailer modal no longer renders a broken iframe for movies with a bare
  `https://www.youtube.com/embed/` stub URL.
- `prices.css` referenced an undefined `--foreground-blur` variable; now
  uses `--foreground-glass`.
- Corrupt localStorage cache entries no longer crash the app on load.
- One animation library (`framer-motion`) instead of two (`framer-motion`
  + `motion`), and `@popmotion/popcorn` replaced by a 3-line `wrap` util.
- Dependencies trimmed from 27 to 10 — dead packages (swiper, animejs,
  react-beautiful-dnd, react-day-picker, react-datepicker, aws-amplify,
  react-router-dom, etc.) are gone.

**Intentionally not ported**

- `src/pages/admin.jsx` + `src/admincomponents/` — the admin console was
  imported but never routed in the Vite app (unreachable), and depends on
  AWS Amplify Auth + the deprecated `react-beautiful-dnd`.
- `gift.jsx` and `concessions.jsx` — imported but never rendered anywhere.
