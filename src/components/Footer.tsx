import React from "react";
import { Box } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { FaFacebook } from "react-icons/fa";

/**
 * Footer component for the website that contains the links to the facebook page and the year.
 * @returns {JSX.Element} The footer component.
 */
export default function Footer() {
  const linkHandler: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    window.location.href = "https://youtu.be/WIRK_pGdIdA";
  };
  return (
    <Box p="10" bg="black" as="footer" display="flex" flexDir="row" gap="5">
      <Box
        bg="white"
        w="fit-content"
        p="3"
        display="flex"
        flexDir="row"
        gap="2"
        justifyContent="center"
        alignItems="center"
      >
        © Loop Cinemas 2023
      </Box>
      <Link
        href="https://www.facebook.com/loop_cinemas"
        target="_blank"
        rel="noreferrer"
        className="link"
        onClick={linkHandler}
        isExternal
      >
        <Box
          bg="white"
          w="min-content"
          p="3"
          display="flex"
          flexDir="row"
          gap="2"
          justifyContent="center"
          alignItems="center"
        >
          <Box pt="1">facebook</Box>
          <FaFacebook />
          <ExternalLinkIcon mx="2px" />
        </Box>
      </Link>
    </Box>
  );
}
