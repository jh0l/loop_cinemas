import { useAppContext } from "../context/app-context";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Movie, Review, ReviewMovieFormError } from "../types";
import { ReturnData } from "../route_helpers/reviews";
import Stars from "../components/Stars";
import { TrashIcon } from "@radix-ui/react-icons";
import { ApiError } from "../route_helpers/lib/api_client";

/**
 * MAX_RATING is the maximum rating a user can give a movie.
 */
const MAX_RATING = 5;

/**
 * MAX_CONTENT is the maximum number of characters a user can write in a review.
 */
const MAX_CONTENT = 600;

/**
 * ReviewMovieForm is the form that allows users to review a movie. It is a form that takes in a review. If the review is undefined, then the form will be for creating a new review. Otherwise, the form will be for editing the review.
 * @param param0 review to be edited or undefined if creating a new review
 * @returns {JSX.Element} component
 */
function ReviewMovieForm({ review }: { review: Review | undefined }) {
  const navigate = useNavigate();
  // get movieId from url
  const fetcher = useFetcher<ReturnData>();
  const [[user], [, setPopup]] = useAppContext();
  const [errors, setErrors] = useState<ReviewMovieFormError>({});
  const [rating, setRating] = useState(review?.rating || 5);
  const [content, setContent] = useState(review?.content || "");

  /**
   * If review submission was successful, we set the popup to a success popup and navigate to the reviews page. If it was not successful, we set the errors to the errors returned by the server.
   */
  useEffect(() => {
    if (fetcher.data) {
      const res = fetcher.data;
      fetcher.data = undefined;
      if ("success" in res) {
        setErrors({});
        if (!fetcher.formMethod) return;
        // if submit type was POST then we are creating a new review
        if (fetcher.formMethod?.toUpperCase() === "POST") {
          setPopup({
            title: "Review Submitted",
            body: "Review submitted successfully.",
            type: "success",
          });
        } else {
          setPopup({
            title: "Review Deleted",
            body: "Your review has been deleted.",
            type: "success",
          });
        }
        navigate("/reviews");
      } else if ("form" in res.error) {
        setErrors(res.error.form);
      } else {
        setErrors({ message: res.error.message });
      }
    }
  }, [fetcher, setPopup, navigate, user]);
  const handleRating = (val: number) => {
    setRating(val);
  };
  const ratingFloor = Math.floor(rating);
  if (!user) return null;
  return (
    <CardBody position="relative" p="5">
      <Box
        as={fetcher.Form}
        method="POST"
        display="flex"
        flexDir="column"
        justifyContent="center"
        gap="5"
        width="full"
      >
        {"message" in errors && (
          <FormControl isInvalid={"message" in errors}>
            <FormErrorMessage data-cy="message_error">
              {errors.message}
            </FormErrorMessage>
          </FormControl>
        )}
        <input value={user.user_id} type="hidden" name="user_id" />
        <FormControl isInvalid={"rating" in errors}>
          <Box pb="5" mx="10" position="relative">
            <Stars
              handleRating={(x) => handleRating(x)}
              filled={ratingFloor}
              halfFilled={Math.ceil(rating - Math.floor(rating))}
              unfilled={
                MAX_RATING -
                ratingFloor -
                Math.ceil(rating - Math.floor(rating))
              }
              error={"rating" in errors}
            />
            <Slider
              data-cy="rating_slider"
              opacity={0}
              mt="3"
              transform="scale(0.9, 2)"
              value={rating * 10}
              onChange={(v) => handleRating(v / 10)}
              min={10}
              max={MAX_RATING * 10}
              step={5}
              name="rating"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={8} />
            </Slider>
            <FormHelperText pt="6">
              {"Give a rating from 1 to 5 stars"}
            </FormHelperText>
            <FormErrorMessage>{errors.rating}</FormErrorMessage>
          </Box>
        </FormControl>
        <FormControl isInvalid={"content" in errors}>
          <Textarea
            data-cy="content"
            name="content"
            placeholder="Write your review here."
            size="sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <FormHelperText>
            {"Share details of your own experience"}
            <Text
              fontSize={10}
              float="right"
              color={content.length > MAX_CONTENT ? "red" : "GrayText"}
            >
              {content.length}/{MAX_CONTENT} characters
            </Text>
          </FormHelperText>
          <FormErrorMessage>{errors.content}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={"human" in errors}>
          <FormLabel>Verify you're human</FormLabel>
          <Input name="human" placeholder="Type here." data-cy="human" />
          <FormHelperText>
            {
              "To make sure you're human please type 'I am not a robot' in this field."
            }
          </FormHelperText>
          <FormErrorMessage>{errors.human}</FormErrorMessage>
        </FormControl>
        <FormControl display="flex" gap="10" justifyContent="end">
          <Button type="submit" width="180px" data-cy="submit">
            Submit
          </Button>
        </FormControl>
      </Box>
      {/* form for deleting review */}
      {review && (
        <Box
          as={fetcher.Form}
          method="DELETE"
          display="flex"
          flexDir="column"
          justifyContent="center"
          position="absolute"
          left="0"
          bottom="0"
          m="5"
        >
          <input value={user.user_id} type="hidden" name="user_id" />
          <FormControl display="flex" gap="10" justifyContent="center">
            <Button
              gap="2"
              type="submit"
              width="180px"
              color="red"
              variant="ghost"
              data-cy="delete"
            >
              Delete
              <TrashIcon />
            </Button>
          </FormControl>
        </Box>
      )}
    </CardBody>
  );
}

/**
 * ReviewMovieLoaderData is the data that is passed to the ReviewMoviePage component through the react-router-dom 'loader' prop.
 */
export type ReviewMovieLoaderData =
  | {
      movie: Movie | undefined;
      review: Review[];
    }
  | ApiError<"message">;

/**
 * ReviewMoviePage is the page that allows users to review a movie.
 * @returns {JSX.Element} component
 */
export default function ReviewMoviePage() {
  const data = useLoaderData() as ReviewMovieLoaderData;
  const [[user]] = useAppContext();
  if (!user) return <Heading size="md">You are not logged in.</Heading>;
  if (data instanceof ApiError)
    return <Heading size="md">{data.message}</Heading>;
  const { movie } = data;
  if (!movie) return <Heading size="md">Movie not found.</Heading>;
  const review = data.review.find((r) => r.user_id === user.user_id);
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      direction="column"
      h="70vh"
      w="full"
      // bg="gray.100"
      maxW="container.lg"
      gap="5"
      p="5"
    >
      <Card w="full" maxW="md" variant="elevated">
        <CardHeader display="flex" flexDir="column" gap="5">
          <Heading size="sm">
            {review ? "Edit your review" : "Write a review"}
          </Heading>
          <Heading size="md">
            {movie.title} ({movie.year})
          </Heading>
        </CardHeader>
        {movie ? (
          <ReviewMovieForm review={review} />
        ) : (
          <Box
            display="flex"
            gap="4"
            flexDir="column"
            alignItems="center"
            pb="10"
          >
            <Text color="gray.600">Loading...</Text>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Box>
        )}
      </Card>
    </Flex>
  );
}
