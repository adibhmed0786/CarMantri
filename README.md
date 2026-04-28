# CarMantri

CarMantri is a Node.js + Express web application that uses EJS templates and MongoDB for a car service booking platform.

## Project Structure

This repository uses the following layout:

- `Express-EJS/` - main application source code
- `__MACOSX/` - ignored archive metadata folder

## Tech Stack

- Node.js
- Express
- EJS
- MongoDB + Mongoose
- JWT + Sessions

## Quick Start

1. Open a terminal in the repository root.
2. Move into the app directory:

```bash
cd Express-EJS
```

3. Install dependencies:

```bash
npm install
```

4. Create `.env` inside `Express-EJS/`:

```env
MONGO_URI=mongodb://localhost:27017/express_ejs_admin
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
PORT=3000
```

5. Run the app:

```bash
npm start
```

Or for development:

```bash
npm run dev
```

6. Open in browser:

- http://localhost:3000

## Useful Scripts

Run these from `Express-EJS/`:

- `npm start` - start server with Node
- `npm run dev` - start server with Nodemon

## Notes

- Make sure MongoDB is running before starting the app.
- Sensitive files like `.env` and dependencies are excluded using `.gitignore`.
