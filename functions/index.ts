import functions from 'firebase-functions';
import { IncomingMessage, ServerResponse } from 'http';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, conf: { distDir: 'out' } });
const handle = app.getRequestHandler();

exports.nextApp = functions.https.onRequest(async (req: IncomingMessage, res: ServerResponse) => {
  await app.prepare();
  return await handle(req, res);
});
