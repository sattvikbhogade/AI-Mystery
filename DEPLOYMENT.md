# Deployment walkthrough

This project deploys as two services: a React/Vite static site on Vercel and an Express API on Render. MongoDB Atlas stores cases, and Gemini remains a server-side integration.

## 1. Prepare GitHub

1. Create a private GitHub repository and push this project to its default branch.
2. Check that `.env`, `server/.env`, `client/.env`, and local `.env.*.local` files are not committed. Never put `GEMINI_API_KEY` or the Atlas password in GitHub.
3. Keep the `server/package-lock.json` and `client/package-lock.json` files in the repository so deploys use the locked dependencies.

## 2. Prepare MongoDB Atlas

1. Create or select an Atlas project and cluster.
2. Under **Database Access**, create a database user with a strong, unique password. Give it read/write access to the application database.
3. Under **Network Access**, allow the Render service to connect. For a tighter allowlist, add the outbound CIDR ranges listed for the API service in Render's **Connect → Outbound** panel. Render's shared outbound ranges can change, so check that panel if connections stop working. Avoid `0.0.0.0/0` for production where possible.
4. In Atlas, choose **Connect → Drivers**, copy the Node.js connection string, and replace the username/password placeholders. Add the database name `ai-mystery-room` before any query string, for example: `mongodb+srv://.../ai-mystery-room?retryWrites=true&w=majority`.

## 3. Deploy the API to Render

1. In Render, select **New → Blueprint** and connect the GitHub repository containing `render.yaml`.
2. Review the proposed `ai-mystery-room-api` web service. The blueprint uses `server/` as its root, installs with `npm ci`, starts with `npm start`, and checks `/api/health`.
3. When Render prompts for secret values, enter `MONGODB_URI` and `GEMINI_API_KEY`. For the initial `CLIENT_URL` value, use a temporary placeholder such as `http://localhost:5173`; replace it with the real Vercel origin after step 4.
4. Deploy. In the Render service's **Logs**, wait for `MongoDB connected` and `Mystery Room API listening on ...`.
5. Open `https://<your-render-service>.onrender.com/api/health`. A healthy service returns JSON containing `"status":"ok"`. Copy the service's base URL without a trailing slash.

The model is configured as `gemini-3.8-flash` in the blueprint. The API key is only set as a Render secret and is never included in the Vite build.

## 4. Deploy the frontend to Vercel

1. In Vercel, select **Add New → Project** and import the same GitHub repository.
2. Set **Root Directory** to `client` and leave the framework preset as **Vite**. Use `npm run build` for the build command and `dist` for the output directory if Vercel does not fill them automatically. `client/vercel.json` supplies the SPA rewrite so routes such as `/cases` and `/case/:id` work when opened directly.
3. Under **Environment Variables**, add `VITE_API_BASE_URL` with the Render URL followed by `/api/v1`, such as `https://<your-render-service>.onrender.com/api/v1`. Add it for Production (and Preview if you use preview deployments).
4. Deploy the project. Copy the production origin, for example `https://your-project.vercel.app` (no path and no trailing slash).

Vite embeds `VITE_*` values when it builds the frontend. If you change the API URL, redeploy the Vercel project.

## 5. Allow the frontend origin in the API

1. In Render, open the API service's **Environment** settings.
2. Set `CLIENT_URL` to the Vercel production origin copied above. Multiple exact origins can be comma-separated if needed; do not add a trailing slash.
3. Save and redeploy the API service.

The API only permits browser origins listed in `CLIENT_URL`; development still defaults to `http://localhost:5173`.
In production, Express trusts the single reverse proxy in front of the Render service so rate limiting can use the visitor's forwarded IP instead of treating all visitors as one client.

## 6. Verify the deployed app

1. Open the Vercel URL and refresh the page directly on a nested route to confirm the SPA rewrite works.
2. Open browser developer tools and confirm there are no CORS or failed API requests.
3. Create a test case. In Render logs, confirm the request reaches the API and check for any MongoDB or Gemini errors.
4. Confirm the investigation shows its suspects and evidence, then submit a test verdict to verify the stored solution is revealed.
5. If generation fails, check Render logs and verify `GEMINI_API_KEY`, `GEMINI_TEXT_MODEL`, Atlas credentials, and Atlas network access. Never paste secrets into the browser console or client environment.

## Local development

No production URL is needed locally. `client/src/services/api.js` uses `http://localhost:5000/api/v1` automatically in Vite development mode. Continue setting local MongoDB, Gemini, and CORS values in `server/.env`.
