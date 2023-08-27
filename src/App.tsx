import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import SignupPage from "./pages/signup-page";
import ErrorPage from "./pages/error-page";
import RootPage from "./pages/root";
import HomePage from "./pages/home-page";
import AppContext from "./context/app-context";
import LogoutPage from "./pages/logout-page";
import LoginPage from "./pages/login-page";
import signup from "./api/signup";
import login from "./api/login";
import ProfilePage from "./pages/profile-page";
import profile from "./api/profile";
import "@fontsource/poppins";
import ReviewPage from "./pages/review-page";
import reviews, {
  allReviewsLoader as allReviewsMoviesLoader,
  reviewsLoader,
} from "./api/reviews";
import ReviewMoviePage from "./pages/review-movie-page";

/**
 * Theme for the app. Colors for Loop Cinemas. Font for the app is Poppins.
 */
const theme = {
  colors: {
    brand: {
      900: "#1a365d",
      800: "#153e75",
      700: "#2a69ac",
    },
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Poppins', sans-serif",
  },
};

/**
 * Router for the app. Some routes have loaders for data loading. Some routes have actions for form submissions.
 */
const router = createBrowserRouter([
  {
    path: "",
    element: <RootPage />,
    errorElement: (
      <RootPage>
        <ErrorPage />
      </RootPage>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
        errorElement: <ErrorPage />,
        loader: allReviewsMoviesLoader,
      },
      {
        path: "/signup",
        element: <SignupPage />,
        errorElement: <ErrorPage />,
        action: signup,
      },
      {
        path: "/login",
        element: <LoginPage />,
        errorElement: <ErrorPage />,
        action: login,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
        errorElement: <ErrorPage />,
        action: profile,
      },
      {
        path: "/reviews",
        element: <ReviewPage />,
        errorElement: <ErrorPage />,
        loader: allReviewsMoviesLoader,
      },
      {
        path: "/reviews/:movieId",
        element: <ReviewMoviePage />,
        errorElement: <ErrorPage />,
        action: reviews,
        loader: reviewsLoader,
      },
      {
        path: "/logout",
        element: <LogoutPage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

/**
 * Combines the theme with the Chakra default theme.
 */
const themeExt = extendTheme(theme);

/**
 * App component. Provides the app context and the router.
 * @returns {JSX.Element} The app.
 */
export const App = () => {
  return (
    <AppContext>
      <ChakraProvider theme={themeExt}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </AppContext>
  );
};
