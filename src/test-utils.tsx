import { RouterProvider, createMemoryRouter } from "react-router-dom";

import { routes } from "./App";
import AppContext from "./context/app-context";
import { ChakraProvider } from "@chakra-ui/react";

export default function renderWithRouter(path: string) {
  const router = createMemoryRouter(routes, {
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
