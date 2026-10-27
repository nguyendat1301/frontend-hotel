<div align="center">
  <img src="./public/favicon.svg" width="72" height="72" alt="Lakeside Hotel Logo" />

  # Lakeside Hotel & Admin Web Application
  *Modern hotel reservation portal and management system built with React and Vite*

  [![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Google OAuth](https://img.shields.io/badge/Auth-Google_OAuth_2.0-4285F4?style=flat-square&logo=google&logoColor=white)](https://developers.google.com/identity)
  [![Recharts](https://img.shields.io/badge/Analytics-Recharts-22b5bf?style=flat-square)](https://recharts.org/)

  [Overview](#overview) • [Features](#features) • [Tech Stack](#tech-stack) • [Project Structure](#project-structure) • [Getting Started](#getting-started) • [Environment Variables](#environment-variables) • [Available Scripts](#available-scripts)

</div>

---

## Overview

**hotel-admin** is the frontend application for the Hanoi Luxury Lakeside Hotel platform. It delivers a unified experience comprising both a customer-facing booking portal and a role-protected administrative back-office.

- **Guest Portal**: Enables travelers to explore accommodations, check real-time room availability, make multi-room reservations, manage bookings, and sign in using traditional credentials or Google OAuth.
- **Admin Dashboard**: Equips hotel staff and administrators with operational controls over bookings, room inventory, room categories, customer directories, user accounts, and business performance metrics.

> [!NOTE]
> This frontend client connects to the backend API service (`hotel-back`), which operates by default at `http://localhost:5000/api`.

---

## Features

### Guest & Customer Portal
- **Showcase & Discovery**: Responsive landing experience showcasing room highlights, fine dining services, and hotel amenities.
- **Real-Time Search**: Search and filter available rooms across custom check-in and check-out date ranges.
- **Multi-Room Booking**: Reserve individual or multiple rooms in a single checkout workflow with automated stay calculation and pricing breakdowns.
- **Self-Service Reservations**: Review current and historical bookings under "My Bookings" with self-cancellation capabilities.
- **Authentication & Security**: Email/password authentication, Google OAuth 2.0 single sign-on, JWT token decoding, and password reset flows (Forgot & Reset Password).
- **Profile Management**: View and modify guest contact details.

### Hotel Administration & Operations
- **Analytics Dashboard**: Real-time KPI summaries (revenue, bookings, occupancy) with charts powered by Recharts.
- **Booking Management**: Track reservation status (`Pending`, `Confirmed`, `Checked-in`, `Completed`, `Cancelled`), process full payments, and view detailed booking dossiers.
- **Room Inventory**: Manage room records, assigned room numbers, current status, and room type associations.
- **Room Type Management**: Create and configure room tiers, base pricing, capacities, and amenity packages.
- **Customer Directory**: Access customer history, contact records, and reservation logs.
- **User & Access Control**: Manage administrative and staff accounts with role-based access control (`ADMIN` / `USER`), soft-deletes, and forced removals.

---

## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework & Core** | [React 19](https://react.dev/), [Vite 8](https://vite.dev/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [PostCSS](https://postcss.org/) |
| **Icons** | [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **HTTP Client & Auth** | [Axios](https://axios-http.com/) (with interceptors & cookie credentials), [jwt-decode](https://github.com/auth0/jwt-decode), [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) |

---

## Project Structure

```text
hotel-admin/
├── public/                  # Static assets (favicons, SVG icons, imagery)
│   ├── favicon.svg          # Application icon
│   └── image/               # Hotel showcase and room photography
├── src/
│   ├── assets/              # Component assets and logos
│   ├── components/          # Reusable UI components
│   │   ├── Admin/           # Admin modals, tables, and metric cards
│   │   ├── BookingPages/    # Reservation workflow and room selector components
│   │   ├── Customer/        # Customer detail views
│   │   ├── Home/            # Home hero, dining, room list, navbar, and footer
│   │   └── common/          # Shared components (modals, buttons, alerts)
│   ├── hooks/               # Custom hooks (useAuth, navigation helpers)
│   ├── layouts/             # Route layout wrappers (AdminLayout, ProtectedRoute)
│   ├── pages/               # Application view routes
│   │   ├── Admin/           # Admin pages (Dashboard, Bookings, Rooms, Users, etc.)
│   │   ├── BookingPage.jsx  # Multi-room checkout workflow
│   │   ├── Home.jsx         # Guest landing page
│   │   ├── Login.jsx        # Login with email/password and Google OAuth
│   │   ├── MyBookings.jsx   # Guest booking tracking
│   │   └── Profile.jsx      # User profile editor
│   ├── routes/              # Routing definitions (adminRoutes, publicRoutes)
│   ├── services/            # Axios API wrappers (booking, room, customer, user)
│   ├── App.jsx              # Main React application tree
│   ├── main.jsx             # React entry point with GoogleOAuthProvider
│   └── index.css            # Base styles and Tailwind imports
├── .env                     # Local environment configuration
├── package.json             # Dependencies and build scripts
└── vite.config.js           # Vite build and plugin configuration
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- Running instance of the [`hotel-back`](../hotel-back) API server

### Installation

1. Navigate to the `hotel-admin` directory:
   ```bash
   cd hotel-admin
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create or verify the `.env` file in the root of `hotel-admin`:
   ```ini
   VITE_BASE_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```

> [!TIP]
> If you are not utilizing Google Single Sign-On for local development, you can still sign in using registered email and password credentials.

4. Start the local development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## Environment Variables

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_BASE_URL` | Backend REST API base URL | `http://localhost:5000/api` |
| `VITE_GOOGLE_CLIENT_ID` | Client ID from Google Cloud Console for OAuth 2.0 | `your_client_id.apps.googleusercontent.com` |

> [!IMPORTANT]
> Any changes made to `.env` require restarting the Vite development server (`npm run dev`) to take effect.

---

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Launches Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles and bundles production-ready assets into the `dist/` directory.
- `npm run preview`: Starts a local web server to preview the production build output.
- `npm run lint`: Runs ESLint to check for code quality and formatting issues.
