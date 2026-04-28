# CarMantri

CarMantri is a Node.js and Express application for managing car service bookings. The app uses EJS templates for server-rendered pages, MongoDB for storage, and session-based authentication for users, admins, and super admins.

The project is organized as a full web portal rather than a single landing page. Public visitors can browse services and read informational pages, signed-in users can book services and track their bookings, admins can manage services and bookings, and super admins can manage admin accounts.

## What This Project Does

CarMantri is designed around a simple service workflow:

1. A visitor opens the site and browses the available car services.
2. The user signs up or logs in.
3. The user selects a service and submits a booking request.
4. Admins review bookings, update statuses, and manage the services offered.
5. After a service is completed, the user can submit feedback.

That flow is reflected in the routes, controllers, and views inside the app.

## Main Features

- Public service browsing with a home page and services page.
- Individual service detail pages.
- User signup, login, logout, password reset, and forgot-password flow.
- Booking creation for authenticated users.
- User booking history page.
- Booking cancellation rules for allowed statuses.
- User feedback after a booking is completed.
- Admin dashboard for service management and booking oversight.
- Super admin dashboard for managing admin credentials.
- JSON API endpoints for service and feedback data.

## Tech Stack

- Node.js
- Express
- EJS
- MongoDB
- Mongoose
- express-session
- cookie-parser
- dotenv
- jsonwebtoken
- bcryptjs

## Folder Structure

The repository contains the app in the nested `Express-EJS/` folder:

- `Express-EJS/app.js` - application entry point
- `Express-EJS/Config/` - database connection setup
- `Express-EJS/Controller/` - request handling logic
- `Express-EJS/Middleware/` - authentication and role checks
- `Express-EJS/Module/` - Mongoose models
- `Express-EJS/routes/` - route definitions
- `Express-EJS/views/` - EJS templates
- `Express-EJS/public/` - static assets and fallback service data

There is also a root `README.md` so the GitHub repository itself has a clear overview before someone opens the app folder.

## Application Roles

The app uses three main access levels:

- User: can sign in, book services, view bookings, cancel eligible bookings, and submit feedback.
- Admin: can log in to the admin area, manage services, and review or update bookings.
- Super admin: can manage admin accounts and access the super admin dashboard.

These roles are stored in the session and are checked by middleware before protected pages and APIs are accessed.

## How the App Works

The main server file is [Express-EJS/app.js](Express-EJS/app.js), which does the following:

- loads environment variables from `.env`
- connects to MongoDB
- configures EJS as the view engine
- enables JSON and URL-encoded request parsing
- sets up cookies and sessions
- exposes shared session data to templates
- serves static files from `public/`
- mounts the route groups for auth, public pages, bookings, admin, super admin, and API endpoints

This means most of the behavior is split into route files and controllers instead of being hard-coded in one file.

## Route Overview

### Public Pages

The public page routes are handled in [Express-EJS/routes/webRoutes.js](Express-EJS/routes/webRoutes.js).

These routes render:

- the home page
- the services listing
- the about page
- the contact page
- feature pages such as comprehensive auto services, experienced mechanics, and customer satisfaction
- service detail pages

The home page also loads service data and recent public feedback when available.

### Authentication

Authentication routes live in [Express-EJS/routes/authRoutes.js](Express-EJS/routes/authRoutes.js).

They provide:

- login and signup pages
- forgot password and reset password flows
- logout

The app also supports both `/login` and `/signin` style entry points for the user-facing auth flow.

### Bookings

Booking routes live in [Express-EJS/routes/bookingRoutes.js](Express-EJS/routes/bookingRoutes.js).

They support:

- creating a booking for a signed-in user
- listing the current user’s bookings
- cancelling bookings when allowed
- submitting feedback after a completed service
- admin-only booking status updates
- admin-only access to all bookings

### Admin Area

Admin routes live in [Express-EJS/routes/adminRoutes.js](Express-EJS/routes/adminRoutes.js).

Admins can:

- log in to the admin panel
- open the dashboard
- add, update, and delete services
- view bookings in the admin area
- log out

### Super Admin Area

Super admin routes live in [Express-EJS/routes/superAdminRoutes.js](Express-EJS/routes/superAdminRoutes.js).

Super admins can:

- log in to the super admin panel
- view the super admin dashboard
- create admin credentials
- delete admin accounts
- log out

### API Endpoints

API routes live in [Express-EJS/routes/apiRoutes.js](Express-EJS/routes/apiRoutes.js).

They provide JSON responses for:

- admin service lists with pagination and short-term caching
- admin feedback lists with filters for service and rating

## Booking Flow Details

The booking logic is handled in [Express-EJS/Controller/bookingController.js](Express-EJS/Controller/bookingController.js).

Important behavior includes:

- required booking fields are validated before a booking is created
- contact numbers must contain exactly 10 digits
- bookings are created only for existing services
- users can only cancel their own bookings
- bookings can only be cancelled in allowed statuses
- feedback can only be submitted after the booking is completed
- ratings must be between 1 and 5

This keeps the booking process strict enough to prevent invalid or unauthorized updates.

## Environment Variables

Create a `.env` file inside `Express-EJS/` and define:

```env
MONGO_URI=mongodb://localhost:27017/express_ejs_admin
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
PORT=3000
```

What each variable does:

- `MONGO_URI` - connection string for MongoDB
- `JWT_SECRET` - secret used for token signing
- `SESSION_SECRET` - secret used by Express sessions
- `PORT` - port where the app will listen

If `SESSION_SECRET` is missing, the app falls back to a default development secret, but you should still set a real one for proper deployments.

## Install and Run

From the repository root:

```bash
cd Express-EJS
npm install
```

Then start the app:

```bash
npm start
```

For development with automatic restart:

```bash
npm run dev
```

Then open:

- http://localhost:3000

## Package Scripts

Defined in [Express-EJS/package.json](Express-EJS/package.json):

- `npm start` - starts the server with Node.js
- `npm run dev` - starts the server with Nodemon for development
- `npm test` - placeholder script at the moment

## Notes

- Make sure MongoDB is running before starting the app.
- The project uses server-rendered EJS templates, so most pages are built on the backend.
- Static content such as CSS, sample services, and page assets live in `public/`.
- Sensitive files like `.env` and generated dependencies are excluded from Git with `.gitignore`.
