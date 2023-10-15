import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Link, useFetcher, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/app-context";
import { SignupFormError } from "../types";
import { ReturnData } from "../api/signup";

/**
 * SignupPage is the page where users can signup. It is a form that takes in a name, email, password, and confirm password. It will display an error message if the signup fails. It will display a success message if the signup succeeds.
 * @returns {React.ReactElement} The SignupPage component
 */
export default function SignupPage() {
  const navigate = useNavigate();
  const fetcher = useFetcher<ReturnData>();
  const [[user, setUser], [, setPopup]] = useAppContext();
  const [errors, setErrors] = useState<SignupFormError>({});
  useEffect(() => {
    if (fetcher.data) {
      const res = fetcher.data;
      if ("success" in res) {
        setUser(res.success.user);
        setErrors({});
        setPopup({
          title: "Success",
          body: "Welcome to Loop Cinemas! You have successfully signed up.",
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
      <Heading>Sign Up</Heading>
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
        <FormControl isRequired isInvalid={"name" in errors}>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            name="name"
            placeholder="Alex Smith"
            data-cy="name"
          />
          <FormHelperText>{"This is what we'll know you by."}</FormHelperText>
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={"email" in errors}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            placeholder="email@example.com"
            data-cy="email"
          />
          <FormHelperText>
            {"We'll never share your email with anyone."}
          </FormHelperText>
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
          <FormHelperText>
            {
              "Must be at least 14 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
            }
          </FormHelperText>
          <div data-cy="password_error">
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </div>
        </FormControl>
        <FormControl isRequired isInvalid={"confirm_password" in errors}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            data-cy="confirm_password"
          />
          <FormHelperText>{"Please confirm your password."}</FormHelperText>
          <FormErrorMessage>{errors.confirm_password}</FormErrorMessage>
        </FormControl>
        <FormControl display="flex" justifyContent="center">
          <Button type="submit" width="200px" data-cy="submit">
            Submit
          </Button>
        </FormControl>
      </Box>
      <SuccessModal isOpen={!!user} />
    </Box>
  );
}

/**
 * SuccessModal is a modal that displays when the user successfully signs up.
 * @param {boolean} isOpen Whether the modal is open
 * @returns {React.ReactElement} The SuccessModal component
 */
function SuccessModal({ isOpen }: { isOpen: boolean }) {
  return (
    <>
      <Modal
        isCentered
        isOpen={isOpen}
        motionPreset="slideInBottom"
        onClose={() => {}}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Signup Complete</ModalHeader>
          <ModalBody>
            Welcome to Loop Cinemas! You have successfully signed up.
          </ModalBody>
          <ModalFooter>
            <Link to="/">
              <Button mr={3}>Continue</Button>
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
