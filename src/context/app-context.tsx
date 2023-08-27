import React, { useMemo } from "react";
import { Popup, User } from "../types";

/**
 * App context for the app, contains the user and popup state, and the setter for the user state and popup state.
 */
const APP_CONTEXT = React.createContext<
  [
    [User | false, React.Dispatch<React.SetStateAction<User | false>>],
    [Popup | false, React.Dispatch<React.SetStateAction<Popup | false>>]
  ]
>([
  [false, () => {}],
  [false, () => {}],
]);

/**
 * The key for the authenticated user in localStorage.
 */
const AUTHENTICATED_USER = "authenticated_user";

/**
 * The app context provider component. This component should be placed at the root of the app.
 * Loads the authenticated user from localStorage. If the user is not authenticated, the user state will be set to false.
 * @param param0 children of the app context provider
 * @returns {JSX.Element} app context provider
 */
export default function AppContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = React.useState<User | false>(() => {
    const userStr = localStorage.getItem(AUTHENTICATED_USER);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return false;
  });
  const popupState = React.useState<Popup | false>(false);
  const setUserHandler: typeof setUser = useMemo(() => {
    return (user) => {
      if (user) {
        localStorage.setItem(AUTHENTICATED_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTHENTICATED_USER);
      }
      setUser(user);
    };
  }, [setUser]);
  return (
    <APP_CONTEXT.Provider value={[[user, setUserHandler], popupState]}>
      {children}
    </APP_CONTEXT.Provider>
  );
}

/**
 * Hook to get the app context.
 */
export function useAppContext() {
  return React.useContext(APP_CONTEXT);
}
