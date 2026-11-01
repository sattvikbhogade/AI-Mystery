# AI Mystery Room

An AI-powered detective game. Create a fictional premise, examine a generated case, then submit one final accusation.

## Requirements

- Node.js 20+
- MongoDB (local or Atlas)
- A Google Gemini API key

## Setup

1. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` and `GEMINI_API_KEY`.
2. Copy `client/.env.example` to `client/.env` if the API is not running at `http://localhost:5000`.
3. Run `npm install`, `npm --prefix client install`, and `npm --prefix server install`.
4. Run `npm run dev` from the repository root. The client is at `http://localhost:5173`.

Case creation requires a working Gemini key and MongoDB connection. The server validates the generated case before saving it. Authentication is intentionally not enabled in this first playable version; generated cases use an anonymous owner identifier in the browser.

## Architecture

- `client/`: React, Vite, React Router, Axios and plain CSS.
- `server/`: Express API, Mongoose models, Zod validation and isolated Gemini generation service.
- Public case endpoints explicitly project out the culprit and private clue annotations until verdict.

See `spec.md` for the product and engineering baseline.
