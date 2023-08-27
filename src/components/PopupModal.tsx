import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useAppContext } from "../context/app-context";

export function PopupModal() {
  const [, [popup, setPopup]] = useAppContext();
  const onClose = () => {
    setPopup(false);
  };
  if (popup)
    return (
      <>
        <Modal blockScrollOnMount={false} isOpen={true} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            {popup.title && <ModalHeader>{popup.title}</ModalHeader>}
            <ModalCloseButton zIndex="10" />
            <ModalBody>
              {typeof popup.body === "string" ? (
                <Text fontWeight="bold" mb="1rem">
                  {popup.body}
                </Text>
              ) : (
                popup.body
              )}
            </ModalBody>

            <ModalFooter>
              {popup.footer || (
                <Button colorScheme="blue" m={1} mb={2} onClick={onClose}>
                  Close
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  return null;
}
