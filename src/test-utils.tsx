import {
  RouteObject,
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";

import { routes } from "./App";
import AppContext from "./context/app-context";
import { ChakraProvider } from "@chakra-ui/react";

export default function renderWithRouter(
  path: string,
  routesOpt?: RouteObject[]
) {
  const router = createMemoryRouter(routesOpt || routes, {
    initialEntries: [path],
    initialIndex: 1,
  });

  return (
    <AppContext>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </AppContext>
  );
}
