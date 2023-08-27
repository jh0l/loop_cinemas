import { Box } from "@chakra-ui/react";
import { StarIcon, StarFilledIcon } from "@radix-ui/react-icons";

/**
 * Blank function for checking if handleRating is provided or if it's blankFn
 */
const blankFn = () => {};

/**
 * Stars component for displaying rating stars. Displays a different number of stars depending on the number of filled, half-filled, and unfilled stars. Error prop is used to display a red border around the stars. handleRating is a function that is called when a star is clicked. size is the size of the stars.
 * @param param0 refer to typescript prop types for more information
 * @returns {JSX.Element} stars component
 */
export default function Stars({
  error,
  unfilled,
  handleRating = blankFn,
  size = "50",
  filled,
  halfFilled,
}: {
  error?: boolean;
  handleRating?: (val: number) => void;
  filled: number;
  halfFilled: number;
  unfilled: number;
  size?: string;
}) {
  return (
    <>
      <Box
        cursor={handleRating === blankFn ? "" : "pointer"}
        display="flex"
        gap="2"
        width="full"
        justifyContent="space-between"
        position="absolute"
        left="0"
        right="0"
        top="0"
        borderStyle="solid"
        borderWidth="2px"
        borderColor={error ? "red" : "rgba(0,0,0,0)"}
        rounded="md"
      >
        {Array(filled)
          .fill(0)
          .map((_, i) => (
            <Box key={i} onClick={() => handleRating(1)}>
              <StarFilledIcon width={size} height={size} color="gold" />
            </Box>
          ))}
        {Array(halfFilled)
          .fill(0)
          .map((_, i) => (
            <Box key={i} position="relative">
              <StarFilledIcon
                width={size}
                height={size}
                color="gold"
                clipPath="polygon(0 0, 50% 0, 50% 100%, 0% 100%)"
              />
              <Box position="absolute" top="0" right="0">
                <StarIcon
                  width={size}
                  height={size}
                  clipPath="polygon(50% 0, 100% 0, 100% 100%, 50% 100%)"
                />
              </Box>
            </Box>
          ))}
        {Array(unfilled)
          .fill(0)
          .map((_, i) => (
            <Box key={i} onClick={() => handleRating(5)}>
              <StarIcon width={size} height={size} />
            </Box>
          ))}
      </Box>
    </>
  );
}
