# Express-EJS Project Setup Guide

This document explains all steps to set up and run the **Express-EJS** project locally.

## 1) Prerequisites

Make sure these are installed:

- Node.js (recommended: v18+)
- npm (comes with Node.js)
- MongoDB (local installation or MongoDB Atlas)

Check versions:

```bash
node -v
npm -v
```

---

## 2) Open the Project Folder

From terminal, go to the project directory:

```bash
cd Express-EJS
```

(Or use the full path if needed.)

---

## 3) Install Dependencies

Install all required packages:

```bash
npm install
```

Or install each package explicitly:

```bash
npm install express ejs mongoose dotenv cookie-parser express-session jsonwebtoken bcryptjs
```

Current project dependencies from `package.json`:

- `express`
- `ejs`
- `mongoose`
- `dotenv`
- `cookie-parser`
- `express-session`
- `jsonwebtoken`
- `bcryptjs`

Optional development dependency:

```bash
npm install -D nodemon
```

---

## 4) Environment Variables (.env)

Create a `.env` file in the root of `Express-EJS` and add:

```env
MONGO_URI=mongodb://localhost:27017/express_ejs_admin
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
PORT=3000
```

### Notes

- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT token signing.
- `SESSION_SECRET`: Secret key for Express session.
- `PORT`: App running port (default: 3000).

---

## 5) Start MongoDB

If using local MongoDB, ensure MongoDB service is running before starting the app.

---

## 6) Run the Application

This project’s entry file is `app.js`, so start with:

```bash
node app.js
```

You should see:

- `✅ MongoDB connected`
- `Server is running on port 3000 http://localhost:3000`

---

## 7) Open in Browser

Go to:

- `http://localhost:3000`

---

## 8) Main Folder Structure (Quick View)

- `Config/` → DB connection config
- `Controller/` → Controller logic
- `Middleware/` → Auth and role middlewares
- `Module/` → Mongoose models
- `routes/` → Route files
- `views/` → EJS templates
- `public/` → Static assets (CSS/JS)
- `app.js` → Main server file

---

## 9) Troubleshooting

### MongoDB connection failed

- Check if MongoDB is running.
- Verify `MONGO_URI` in `.env`.

### Port already in use

- Change `PORT` in `.env` to another value (e.g., `3001`).

### Module not found

- Run `npm install` again in `Express-EJS`.

---

## 10) Useful Development Tip

You can install `nodemon` for auto-restart during development:

```bash
npm install -D nodemon
npx nodemon app.js
```

---

Setup is complete. ✅
