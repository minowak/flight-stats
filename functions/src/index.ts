import { onRequest } from "firebase-functions/v2/https";
import next from "next";

// Detect if we're in dev or production mode
const dev = process.env.NODE_ENV !== "production";

// Point to the correct Next.js build output (default is `.next`; use 'out' if you've set distDir in next.config.js)
const app = next({
  dev,
  conf: {
    distDir: "out", // change to '.next' if you're not customizing it in next.config.js
  },
});

const handle = app.getRequestHandler();

// Export a Firebase HTTPS Function in the europe-west1 region
export const nextApp = onRequest(
  { region: "europe-west1" },
  async (req, res) => {
    await app.prepare();
    handle(req, res);
  }
);
