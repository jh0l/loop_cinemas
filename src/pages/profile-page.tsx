import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useAppContext } from "../context/app-context";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useFetcher, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { EditProfileFormError } from "../types";
import { ProfileLoaderData, ReturnData } from "../route_helpers/profile";
import { useRevalidator } from "react-router-dom";
import { ApiError } from "../route_helpers/lib/api_client";

/**
 * EditProfileForm is the form that allows users to edit their profile. It is a form that takes in a onClose function for when the form is closed.
 * @param param0 onClose function for when the form is closed.
 * @returns {JSX.Element} component
 */
function EditProfileForm({ onClose }: { onClose: () => void }) {
  const data = useLoaderData() as ProfileLoaderData;
  const revalidator = useRevalidator();
  const fetcher = useFetcher();
  const [[, setUser], [, setPopup]] = useAppContext();
  const [errors, setErrors] = useState<EditProfileFormError>({});
  useEffect(() => {
    if (fetcher.data) {
      const res = JSON.parse(fetcher.data) as ReturnData;
      if ("success" in res) {
        setUser(res.success.user);
        revalidator.revalidate();
        setErrors({});
        setPopup({
          title: "Success",
          body: "You have successfully updated your profile.",
          type: "success",
        });
        onClose();
      } else if ("form" in res.error) {
        setErrors(res.error.form);
      } else {
        setErrors({ message: res.error.message });
      }
    }
  }, [fetcher, setUser, setPopup, onClose, revalidator]);
  if (!data) return null;
  if (data instanceof ApiError) {
    return (
      <Heading size="md">
        {data.field}: {data.message}
      </Heading>
    );
  }
  return (
    <Card>
      <CardHeader>
        <Heading size="md">Edit Profile</Heading>
      </CardHeader>
      <CardBody>
        <Box
          as={fetcher.Form}
          method="PATCH"
          display="flex"
          flexDir="column"
          justifyContent="center"
          gap="5"
          width="full"
          p="1"
        >
          {"message" in errors && (
            <FormControl isRequired isInvalid={"message" in errors}>
              <FormErrorMessage>{errors.message}</FormErrorMessage>
            </FormControl>
          )}
          <FormControl isInvalid={"name" in errors}>
            <input value={data.user_id} type="hidden" name="user_id" />
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              defaultValue={data.name}
              data-cy="edit_name"
            />
            <FormHelperText>
              {"Change what everyone will call you by."}
            </FormHelperText>
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={"email" in errors}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              defaultValue={data.email}
              data-cy="edit_email"
            />
            <FormHelperText>
              {"this will be required to log in."}
            </FormHelperText>
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl display="flex" gap="10" justifyContent="center">
            <Button width="200px" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" width="200px" data-cy="edit_submit">
              Submit
            </Button>
          </FormControl>
        </Box>
      </CardBody>
    </Card>
  );
}

/**
 * DeleteProfileForm is the form that allows users to delete their profile. It is a form that takes in a onClose function for when the form is closed.
 * @param param0 onClose function for when the form is closed.
 * @returns {JSX.Element} component
 */
function DeleteProfileForm({ onClose }: { onClose: () => void }) {
  const [[user, setUser], [, setPopup]] = useAppContext();
  const fetcher = useFetcher();
  useEffect(() => {
    if (fetcher.data) {
      const res = JSON.parse(fetcher.data) as ReturnData;
      if ("success" in res) {
        setPopup({
          title: "Account Deleted",
          body: "You have successfully deleted your account.",
          type: "success",
        });
        setUser(false);
        onClose();
      }
    }
  }, [fetcher, setUser, onClose, setPopup]);
  if (!user) return null;
  return (
    <Card>
      <CardHeader>
        <Heading size="md">Delete Account</Heading>
      </CardHeader>
      <CardBody>
        <Box
          as={fetcher.Form}
          method="DELETE"
          display="flex"
          flexDir="column"
          justifyContent="center"
          gap="5"
          width="full"
          p="1"
        >
          <input value={user.user_id} type="hidden" name="user_id" />
          <FormControl isRequired isInvalid>
            <FormHelperText>
              Are you sure You want to delete your account? This action cannot
              be undone.
            </FormHelperText>
          </FormControl>
          <FormControl display="flex" gap="10" justifyContent="center">
            <Button width="200px" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              width="200px"
              colorScheme="red"
              data-cy="delete_submit"
            >
              Delete
            </Button>
          </FormControl>
        </Box>
      </CardBody>
    </Card>
  );
}

/**
 * ProfilePage is the page that displays the user's profile. It is a page that takes in no props. It displays the user's profile and allows them to edit or delete their profile. If the user is not logged in, it will display a message saying that they are not logged in. Provides buttons for editing and deleting the user's profile.
 * @returns {JSX.Element} component
 */
export default function ProfilePage() {
  const data = useLoaderData() as ProfileLoaderData;
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  if (!data) return <Heading size="md">You are not logged in.</Heading>;
  if (data instanceof ApiError)
    return (
      <Heading size="md">
        {data.field}: {data.message}
      </Heading>
    );
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      direction="column"
      h="full"
      w="full"
      // bg="gray.100"
      maxW="container.lg"
      gap="5"
      p="5"
    >
      <Card w="full" maxW="md">
        <CardHeader display="flex" flexDir="column" gap="5">
          <Heading size="md">Profile</Heading>
          <Flex gap="4">
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Avatar name={data.name} />
              <Box>
                <Heading size="sm">{data.name}</Heading>
                <Text>{data.email}</Text>
              </Box>
            </Flex>
            <IconButton
              onClick={() => setEditMode(true)}
              variant="solid"
              colorScheme="gray"
              aria-label="Edit profile"
              data-cy="edit"
              icon={<Pencil1Icon />}
            />
            <IconButton
              onClick={() => setDeleteMode(true)}
              variant="outline"
              colorScheme="red"
              aria-label="See menu"
              data-cy="delete"
              icon={<TrashIcon />}
            />
          </Flex>
        </CardHeader>
        <CardBody>
          <Divider mb="5" />
          <Text>
            Joined: <b>{new Date(data.createdAt).toDateString()}</b>
          </Text>
        </CardBody>
      </Card>
      <Modal isOpen={editMode} onClose={() => setEditMode(false)}>
        <ModalOverlay />
        <ModalContent>
          <EditProfileForm onClose={() => setEditMode(false)} />
        </ModalContent>
      </Modal>
      <Modal isOpen={deleteMode} onClose={() => setDeleteMode(false)}>
        <ModalOverlay />
        <ModalContent>
          <DeleteProfileForm onClose={() => setDeleteMode(false)} />
        </ModalContent>
      </Modal>
    </Flex>
  );
}
