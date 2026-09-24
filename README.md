This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Production notes (Vercel + MongoDB Atlas)

Data saves, product text, and image uploads go through MongoDB Atlas and must work **identically** locally and on Vercel. After deploying, check these:

1. **Environment variables in Vercel** — Add `MONGODB_URI` and `MONGODB_DB` under *Project → Settings → Environment Variables* (copy the values from `.env.local`) and redeploy. They are **not** bundled from `.env.local` (that file is git-ignored), so without them the admin save returns an explicit error.
2. **Atlas Network Access** — MongoDB Atlas → *Network Access* must allow Vercel's serverless egress IPs. For testing, add `0.0.0.0/0` ("Allow access from anywhere"). If you only added your own IP, the **local** app works but the **deployed** app cannot connect — this is the classic "works locally, not on Vercel" failure.
3. **Atlas Database Access** — the database user needs read/write on the `MONGODB_DB` database ("read and write to any database").
4. **Image/video uploads are stored in MongoDB Atlas** (`mediaFiles`/`mediaChunks` collections), not in `public/uploads`. Vercel's filesystem is read-only and ephemeral, so local-filesystem uploads can never persist there. Files are served from `/api/uploads/<id>.<ext>`.
5. **Upload size** — Vercel rejects request bodies above ~4.5 MB, so the upload route caps files at 4 MB with a clear error message.
6. **See Vercel logs** — *Project → Logs* (or `vercel logs`) shows `console.error` output from the API routes (`Unable to save site content`, `Unable to upload media`), which contains the exact Mongo error.
7. **"Old data appears after refresh"** — if the public site can't reach Atlas, `lib/site-content.ts` falls back to `data/site-content.json`. That is a fallback, not a cache: fix the connection (steps 1–3) and the real content will render. Re-save once after deploying the fix.
8. **Rotate the Atlas password** — the original `.env.example` contained a real password and was committed to this public repository. Change the user's password in Atlas (Database Access → edit → password) and update `MONGODB_URI` locally and in Vercel.
