import { useEffect } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { Review } from "../types";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useAppContext } from "../context/app-context";
import Stars from "../components/Stars";
import { AllReviewsLoaderData, MAX_RATING } from "../api/reviews";

/**
 * ReviewPage is the page that shows all the reviews for all the movies. It is a page that takes in no props.
 * @returns {JSX.Element} component
 */
export default function ReviewPage() {
  const data = useLoaderData() as AllReviewsLoaderData;
  const { reviewMap, moviesSorted } = data;
  const [[user]] = useAppContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDir="column"
      w="full"
      maxW="container.lg"
      pt="10"
    >
      <Heading size="lg" w="full" textAlign="center" p="6">
        Movie Reviews
      </Heading>
      <Box
        py="2"
        display="flex"
        gap="2"
        flexDirection="column"
        alignItems="center"
        mx="auto"
      >
        {moviesSorted.length === 0 ? (
          <Heading size="md" textAlign="center" w="full">
            No reviews yet.
          </Heading>
        ) : (
          <>
            <Box w="full" p="2" display="flex" justifyContent="end" mx="auto">
              <Heading size="xs">sorted by rating</Heading>
            </Box>
            <Divider />
            {moviesSorted.map((movie) => {
              const reviews = reviewMap.get(movie.movie_id);
              if (!reviews)
                return (
                  <Box
                    key={movie.movie_id}
                    display="flex"
                    flexDir="row"
                    flexWrap="wrap"
                    w="full"
                    pt="20"
                    id={movie.movie_id}
                  >
                    <Box display="flex" flexDirection="column" gap="2">
                      <Heading size="md">
                        {movie.title} ({movie.year})
                      </Heading>
                      <Heading size="xs" color="GrayText" w="full">
                        no reviews
                      </Heading>
                      <Button
                        w="150px"
                        as={Link}
                        to={`/reviews/${movie.movie_id}`}
                      >
                        Add Review
                      </Button>
                    </Box>
                  </Box>
                );
              const rating = reviews.rating.sum / reviews.rating.count;
              return (
                <Box
                  key={movie.movie_id}
                  display="flex"
                  flexDir="row"
                  flexWrap="wrap"
                  w="full"
                  pt="20"
                  id={movie.movie_id}
                >
                  <Box display="flex" flexDirection="column" gap="2">
                    <Heading size="md">
                      {movie.title} ({movie.year})
                    </Heading>
                    <Box position="relative" w="10" pb="5">
                      <Stars
                        filled={Math.floor(rating)}
                        halfFilled={Math.ceil(rating - Math.floor(rating))}
                        unfilled={MAX_RATING - Math.ceil(rating)}
                        size="20"
                      />
                    </Box>
                    <Heading size="sm" color="GrayText" pt="1" px="1">
                      {rating.toPrecision(2)} stars · {reviews.rating.count}{" "}
                      rating{reviews.rating.count === 1 ? "" : "s"}
                    </Heading>
                  </Box>
                  <Box
                    display="flex"
                    w="full"
                    flexWrap="wrap"
                    gap="2"
                    pt="5"
                    justifyContent=""
                  >
                    {reviews.reviews.map((review) => {
                      return (
                        <ReviewCard key={review.review_id} review={review} />
                      );
                    })}
                  </Box>
                </Box>
              );
            })}
          </>
        )}
      </Box>
    </Box>
  );
}

/**
 * ReviewCard is a component that takes in a review and displays it. Uses the Stars component to display the rating.
 * @param param0
 * @returns
 */
function ReviewCard({ review }: { review: Review }) {
  const [[user]] = useAppContext();
  return (
    <Card w="xs">
      <CardHeader display="flex" flexDir="column" gap="5">
        <Box position="relative" w="10">
          <Stars
            filled={Math.floor(review.rating)}
            halfFilled={Math.ceil(review.rating - Math.floor(review.rating))}
            unfilled={MAX_RATING - Math.ceil(review.rating)}
            size="20"
          />
        </Box>
      </CardHeader>
      <CardBody display="flex" gap="3" flexDirection="column">
        <Box p="1">
          <Text>{review.content}</Text>
        </Box>
        <Divider />
        <Heading fontSize="xs" opacity={0.5} p="2">
          {new Date(review.created_at).toLocaleDateString()}
        </Heading>
        {user && review.user_id === user.user_id && (
          <Button w="150px" as={Link} to={`/reviews/${review.movie_id}`}>
            Edit
          </Button>
        )}
      </CardBody>
    </Card>
  );
}
