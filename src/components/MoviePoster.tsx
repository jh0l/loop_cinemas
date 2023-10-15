import {
  Image,
  Card,
  CardBody,
  Stack,
  Heading,
  Divider,
  ButtonGroup,
  Button,
  Text,
  Box,
} from "@chakra-ui/react";
import { Movie } from "../types";
import { useAppContext } from "../context/app-context";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { MAX_RATING, MovieReviewData } from "../route_helpers/reviews";
import Stars from "./Stars";

/**
 * Truncate a string and add "..." if it is longer than max
 * @param str string to truncate
 * @param max max length of string
 * @returns truncated string
 */
function truncatDot(str: string, max = 128) {
  if (str.length > max) {
    return str.slice(0, max) + "...";
  }
  return str;
}

/**
 * Popup for movie poster, shows more information about the movie including session times
 * @param param0 movie to show
 * @returns {JSX.Element} popup
 */
function MoviePosterPopup({ movie }: { movie: Movie }) {
  // similar to MoviePoster, but with more information including session times
  return (
    <Card w="full" variant="unstyled">
      <Heading
        size="md"
        color="black"
        bg="hsla(0, 50%, 100%, 0.2)"
        backdropFilter="blur(10px)"
        rounded="sm"
        p="4"
        w="full"
      >
        {movie.title} ({movie.year})
      </Heading>
      <CardBody>
        <Image
          rounded="md"
          src={`posters/${movie.poster_url}.jpg`}
          fallbackSrc={PLACEHOLDER}
          height="max"
          alt={movie.title}
          fit="cover"
          w="full"
        />
        <Stack mt="3" mb="6" spacing="1">
          <Text fontSize="xs">{movie.plot}</Text>
        </Stack>
        <Box position="relative">
          <Text
            color="blue.600"
            fontSize="xs"
            position="absolute"
            bottom="0"
            maxW="75%"
            overflow="hidden"
            whiteSpace="nowrap"
          >
            {movie.genres.join(", ")}
          </Text>
          <Text
            color="gray.400"
            fontSize="xs"
            position="absolute"
            bottom="1"
            right="0"
          >
            {movie.content_rating}
          </Text>
        </Box>
        {/* list of session times for each day */}
        <Divider my="4" />
        <Text fontWeight="bold">Session Times</Text>
        <Box display="flex" flexDir="column" flexWrap="wrap">
          {/* TODO */}
          {/* {movie.showTimes.map((sessions) => (
            <Box key={sessions.day} py="1">
              <Heading size="xs" p="2">
                {new Date(Date.parse(sessions.day)).toDateString()}
              </Heading>
              <ButtonGroup flexWrap="wrap" gap="2" spacing="0">
                {sessions.times.map((time) => (
                  <Button
                    key={time}
                    size="sm"
                    onClick={() =>
                      alert(
                        `Congratulations!!!! you're our 10000th customer 😲!\nyou've won a free ticket! Your confirmation code is: ${Math.random()
                          .toString(36)
                          .substring(8)
                          .toUpperCase()}.\nClick here to claim your prize.`
                      )
                    }
                  >
                    {time}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>
          ))} */}
        </Box>
      </CardBody>
    </Card>
  );
}

/**
 * Movie poster component, shows a movie poster with some information and a button to show more information in a popup (MoviePosterPopup)
 * @param param0 movie to show poster for and reviews for that movie
 * @returns {JSX.Element} movie poster
 */
export default function MoviePoster({
  movie,
  reviews = new MovieReviewData(),
}: {
  movie: Movie;
  reviews?: MovieReviewData;
}) {
  const [[user], [, setPopup]] = useAppContext();
  const handleClick = () => {
    // show a popup of the movie with more information
    setPopup({
      body: <MoviePosterPopup movie={movie} />,
      type: "info",
    });
  };
  const rating = reviews.rating.sum / reviews.rating.count || 0;
  return (
    <Card maxW="250">
      <CardBody p="2">
        <Box minHeight="sm">
          <Image
            rounded="md"
            src={`posters/${movie.poster_url}.jpg`}
            fallbackSrc={PLACEHOLDER}
            // height="300"
            alt={movie.title}
            fit="cover"
            w="full"
          />
        </Box>
        <Stack mt="3" mb="20" spacing="1">
          <Box position="relative" w="10" pb="5">
            <Stars
              filled={Math.floor(rating)}
              halfFilled={Math.ceil(rating - Math.floor(rating))}
              unfilled={MAX_RATING - Math.ceil(rating)}
              size="20"
            />
          </Box>
          <Text
            color="gray.400"
            fontSize="sm"
            maxW="full"
            h="full"
            wordBreak="break-word"
          >
            {user && (
              <ChakraLink as={Link} to={`/reviews/${movie.movie_id}`}>
                {reviews.reviews.findIndex((r) => r.user_id === user.user_id) >=
                0
                  ? "Edit your "
                  : "Leave a "}
                review
              </ChakraLink>
            )}
            {" · "}
            <ChakraLink as={Link} to={`/reviews#${movie.movie_id}`}>
              {reviews.reviews.length} review
              {reviews.reviews.length === 1 ? "" : "s"}
            </ChakraLink>
          </Text>
          <Text fontSize="xs">{truncatDot(movie.plot)}</Text>
        </Stack>
        <Box position="absolute" left="3" right="3" bottom="8">
          <Box position="relative" pb="10">
            <Text
              color="blue.600"
              fontSize="xs"
              position="absolute"
              bottom="2"
              maxW="75%"
              overflow="hidden"
              whiteSpace="nowrap"
            >
              {truncatDot(movie.genres.join(", "), 26)}
            </Text>
            <Text
              color="gray.400"
              fontSize="xs"
              position="absolute"
              bottom="2"
              right="0"
            >
              {movie.content_rating}
            </Text>
          </Box>
        </Box>
        <Button onClick={handleClick} size="xs" position="absolute" bottom="2">
          Session Times
        </Button>
      </CardBody>
    </Card>
  );
}

/**
 * Placeholder image for when the poster is loading
 */
const PLACEHOLDER = `data:image/png;base64,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`;
