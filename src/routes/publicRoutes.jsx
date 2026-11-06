// src/routes/publicRoutes.jsx
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BookingPage from "../pages/BookingPage";
import SearchResults from "../pages/SearchResults";
import Loading from "../pages/Loading";
import MyBookings from "../pages/MyBookings";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Profile from "../pages/Profile";
import About from "../pages/About";
import FaqPolicy from "../pages/FaqPolicy";

const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/home", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/faq-policy", element: <FaqPolicy /> },
  { path: "/faq", element: <FaqPolicy /> },
  { path: "/policy", element: <FaqPolicy /> },
  { path: "/login", element: <Login /> },
  { path: "/booking", element: <BookingPage /> },
  { path: "/register", element: <Register /> },
  { path: "/search", element: <SearchResults /> },
  { path: "/loading", element: <Loading /> },
  { path: "/my-bookings", element: <MyBookings /> },
  { path: "/profile", element: <Profile /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
];

export default publicRoutes;
