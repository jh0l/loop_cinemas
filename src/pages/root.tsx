import { Box, Container } from "@chakra-ui/react";
import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { PopupModal } from "../components/PopupModal";

/**
 * Root page component, wraps all pages in the app. It takes in a children prop that is the page to be rendered.
 * @param param0 children prop that is the page to be rendered
 * @returns {JSX.Element} component
 */
export default function RootPage({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <ScrollRestoration />
      <Container minW="100%" bg="hsl(10, 20%, 98%)">
        <Container minH="calc(100vh)" maxWidth="1500px">
          <header>
            <Navbar />
          </header>
          <Box p="10" width="full"></Box>
          <Box role="main" mx="auto" w="full" maxW="1500px">
            {children || <Outlet />}
          </Box>
        </Container>
      </Container>
      <Footer />
      <PopupModal />
    </>
  );
}
