import { useEffect } from "react";
import { useAppContext } from "../context/app-context";
import {
  Flex,
  Heading,
  Stack,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

/**
 * Logout page, shows message and logs user out, with link to go home
 * @returns {JSX.Element} logout page
 */
export default function LogoutPage() {
  const [[, setUser]] = useAppContext();
  useEffect(() => {
    setUser(false);
  }, [setUser]);
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      direction="column"
      h="full"
      gap="10"
    >
      <Stack spacing={3} bg="black" padding={10} rounded={"10px"} color="white">
        <Heading>You have been logged out.</Heading>
      </Stack>
      <ChakraLink as={Link} to="/">
        <Text>Go Home</Text>
      </ChakraLink>
    </Flex>
  );
}
