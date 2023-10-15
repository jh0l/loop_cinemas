import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/app-context";
import { useFetcher, useNavigate } from "react-router-dom";
import { LoginFormError } from "../types";
import { ReturnData } from "../api/login";

/**
 * LoginPage is the page where users can login. It is a form that takes in an email and password.
 * It will display an error message if the login fails.
 * @returns {JSX.Element} component
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [, [, setPopup]] = useAppContext();
  const fetcher = useFetcher<ReturnData>();
  const [[, setUser]] = useAppContext();
  const [errors, setErrors] = useState<LoginFormError>({});
  useEffect(() => {
    if (fetcher.data) {
      console.log(fetcher.data);
      const res = fetcher.data;
      if ("success" in res) {
        setUser(res.success.user);
        setErrors({});
        setPopup({
          title: "Success",
          body: "Login successful",
          type: "success",
        });
        navigate("/profile");
      } else if ("form" in res.error) {
        setErrors(res.error.form);
      } else {
        setErrors({ message: res.error.message });
      }
    }
  }, [fetcher, setUser, setPopup, navigate]);
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      p="2"
      flexDir="column"
      gap="10"
    >
      <Heading>Sign In</Heading>
      <Box
        as={fetcher.Form}
        method="post"
        display="flex"
        flexDir="column"
        justifyContent="center"
        gap="5"
        maxW="90vw"
        width="350px"
        p="1"
      >
        <FormControl isRequired isInvalid={"message" in errors}>
          <FormErrorMessage>{errors.message}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={"email" in errors}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            placeholder="email@example.com"
            data-cy="email"
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={"password" in errors}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            placeholder="Password"
            data-cy="password"
          />
          <FormErrorMessage data-cy="password_error">
            {errors.password}
          </FormErrorMessage>
        </FormControl>
        <FormControl display="flex" justifyContent="center">
          <Button type="submit" width="200px">
            Submit
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
}
