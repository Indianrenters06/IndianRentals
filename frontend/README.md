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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Local visual preview (without MongoDB)

Run `npm run preview` to start the read-only sample API on port 5001 and the
frontend together. Requires Node.js and Python 3. The launcher checks API readiness,
reports port conflicts, and stops processes it started when you press Ctrl+C.
It can reuse an already-running sample API. Optional Next arguments are forwarded,
for example `npm run preview -- --port 3002`.

This mode contains sample products and CMS data for visual work. It does **not**
support login, checkout, application submissions or admin writes. Use the real
backend and MongoDB for those flows, set `NEXT_PUBLIC_API_URL` to that backend,
and run `npm run dev`. The normal development and production commands never
start the sample API automatically.

A Next.js “Issues” badge reporting failed category, hero, product, feature-banner
or collection requests usually means the configured API is not reachable. Check
that process and URL first; do not suppress the console errors to hide the outage.
