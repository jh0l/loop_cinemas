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
import { useFetcher } from "react-router-dom";
import { useEffect, useState } from "react";
import { EditProfileFormError } from "../types";
import { ReturnData } from "../api/profile";

/**
 * EditProfileForm is the form that allows users to edit their profile. It is a form that takes in a onClose function for when the form is closed.
 * @param param0 onClose function for when the form is closed.
 * @returns {JSX.Element} component
 */
function EditProfileForm({ onClose }: { onClose: () => void }) {
  const fetcher = useFetcher();
  const [[user, setUser], [, setPopup]] = useAppContext();
  const [errors, setErrors] = useState<EditProfileFormError>({});
  useEffect(() => {
    if (fetcher.data) {
      const res = JSON.parse(fetcher.data) as ReturnData;
      if ("success" in res) {
        setUser(res.success.user);
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
  }, [fetcher, setUser, setPopup, onClose]);
  if (!user) return null;
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
            <input value={user.user_id} type="hidden" name="user_id" />
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" defaultValue={user.name} />
            <FormHelperText>
              {"Change what everyone will call you by."}
            </FormHelperText>
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={"email" in errors}>
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" defaultValue={user.email} />
            <FormHelperText>
              {"this will be required to log in."}
            </FormHelperText>
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl display="flex" gap="10" justifyContent="center">
            <Button width="200px" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" width="200px">
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
            <Button type="submit" width="200px" colorScheme="red">
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
  const [[user]] = useAppContext();
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  if (!user) return <Heading size="md">You are not logged in.</Heading>;
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
              <Avatar name={user.name} />

              <Box>
                <Heading size="sm">{user.name}</Heading>
                <Text>{user.email}</Text>
              </Box>
            </Flex>
            <IconButton
              onClick={() => setEditMode(true)}
              variant="solid"
              colorScheme="gray"
              aria-label="Edit profile"
              icon={<Pencil1Icon />}
            />
            <IconButton
              onClick={() => setDeleteMode(true)}
              variant="outline"
              colorScheme="red"
              aria-label="See menu"
              icon={<TrashIcon />}
            />
          </Flex>
        </CardHeader>
        <CardBody>
          <Divider mb="5" />
          <Text>
            Joined: <b>{new Date(user.createdAt).toDateString()}</b>
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
