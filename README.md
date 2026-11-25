# Airport Services – front-end

Next.js 16 + Tailwind 4. Front-end only: the backend is mocked behind `src/lib/booking-service.ts`
(one interface, localStorage store). Business rules live in `src/config/booking.ts`, catalog data in `src/data/catalog.ts`.

## Run
    npm install
    npm run dev        # http://localhost:3000
    npm run build      # static site in ./out

## Deploy (static)
The build output `out/` is plain files. Drag the `out` folder to https://app.netlify.com/drop
or run `npx vercel --prod` from this folder (framework: Next.js, output: export).

## Swap in the real thing
- Backend: write an object satisfying `BookingService` and change the last export in `booking-service.ts`.
- Brand: `src/config/site.ts` (name), `src/components/layout/Logo.tsx`, accent in `src/app/globals.css`.
- Photos: `public/images/` (AI-generated placeholders), mapped per lounge in `src/data/catalog.ts`.
