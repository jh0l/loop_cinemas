import React, { useLayoutEffect, useState } from "react";
import { Location, NavLink, useLocation } from "react-router-dom";
import { Heading } from "@chakra-ui/react";
import { Box, Tab, TabIndicator, TabList, Tabs } from "@chakra-ui/react";
import { useAppContext } from "../context/app-context";

/**
 * finds index of the nav link that matches the current route (will fallback to home)
 * @param navs array of nav links to check
 * @param location current location
 * @returns index of the nav link that matches the current route in `navs` parameter
 */
const handleRoutesTabIndex = (navs: typeof LoggedInNav, location: Location) => {
  for (const nav of navs) {
    if (location.pathname.startsWith(nav.path)) {
      return navs.indexOf(nav);
    }
  }
  return 0;
};

/**
 * Nav links for logged in users
 */
const LoggedInNav = [
  {
    name: "Profile",
    path: "/profile",
  },
  {
    name: "Reviews",
    path: "/reviews",
  },
  { name: "Logout", path: "/logout" },
  {
    name: "Home",
    path: "/",
  },
];

/**
 * Nav links for logged out users
 */
const LoggedOutNav = [
  {
    name: "Login",
    path: "/login",
  },
  {
    name: "Signup",
    path: "/signup",
  },
  {
    name: "Home",
    path: "/",
  },
];

/**
 * Navbar component for the app (top bar) that shows the current route and allows navigation
 * @returns Navbar component
 */
export default function Navbar() {
  const [[user]] = useAppContext();
  const location = useLocation();
  const [navLinks, setNavLinks] = useState(user ? LoggedInNav : LoggedOutNav);
  const [tabIndex, setTabIndex] = useState(
    handleRoutesTabIndex(navLinks, location)
  );
  useLayoutEffect(() => {
    const newNavLinks = user ? [...LoggedInNav] : LoggedOutNav;
    setNavLinks(newNavLinks);
    setTabIndex(handleRoutesTabIndex(newNavLinks, location));
  }, [user, location]);
  return (
    <FixedComponent>
      <Box
        w="full"
        h="full"
        p="4"
        as="nav"
        display="flex"
        flexDir="row"
        gap="10"
        justifyContent="start"
        alignItems="center"
        px="10"
        shadow="sm"
        position="relative"
      >
        <Box
          position="absolute"
          inset="0"
          bg="hsla(10, 100%, 98%, 0.9)"
          backdropFilter="blur(20px)"
          zIndex="-1"
        />
        <Heading size="md">➰ Loop Cinemas</Heading>
        <Tabs position="relative" variant="unstyled" index={tabIndex}>
          <TabList>
            {navLinks.map((link) => (
              <NavLink to={link.path} key={link.name}>
                <Tab width="75px">{link.name}</Tab>
              </NavLink>
            ))}
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="blue.500"
            borderRadius="1px"
          />
        </Tabs>
      </Box>
    </FixedComponent>
  );
}

/**
 * Component that fixes its children to the top of the screen
 * @param param0 children to fix to the top of the screen
 * @returns fixed component
 */
function FixedComponent({ children }: { children: React.ReactNode }) {
  return (
    <Box position="fixed" top="0" left="0" right="0" zIndex="10">
      {children}
    </Box>
  );
}
