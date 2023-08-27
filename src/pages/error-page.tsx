import {
  Flex,
  Heading,
  Stack,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import { Link, useRouteError } from "react-router-dom";

/**
 * Error page for when something goes wrong, shows error message and error object
 * @returns {JSX.Element} error page
 */
export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  // get message from url query string if there is one
  const message = new URLSearchParams(window.location.search).get("message");
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      direction="column"
      h="full"
      gap="10"
    >
      <Stack spacing={3} bg="black" padding={10} rounded={"10px"} color="white">
        <Heading>{message || "Sorry, something went wrong."}</Heading>
        <pre>{JSON.stringify(error, null, "    ")}</pre>
      </Stack>
      <ChakraLink as={Link} to="/">
        <Text>Go Home</Text>
      </ChakraLink>
    </Flex>
  );
}
