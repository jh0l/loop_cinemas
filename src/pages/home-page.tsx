import {
  Box,
  Divider,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import MoviePoster from "../components/MoviePoster";
import { AllReviewsLoaderData } from "../route_helpers/reviews";
import { ApiError } from "../route_helpers/lib/api_client";

/**
 * Home page, shows all movies and brief information about Loop Cinemas
 * @returns {JSX.Element} home page
 */
export default function HomePage() {
  const data = useLoaderData() as AllReviewsLoaderData;
  if (data instanceof ApiError) {
    return <Heading>{data.message}</Heading>;
  }
  const { reviewMap, moviesSorted } = data;
  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDir="column"
      w="full"
      maxW="1500px"
      pt="10"
    >
      <Heading
        px="10"
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        bgClip="text"
        fontSize="6xl"
        fontWeight="extrabold"
      >
        Welcome to Loop Cinemas
      </Heading>
      {/* list of movies in a flex grid */}
      <Box
        display="flex"
        justifyContent="center"
        pt="10"
        px="5"
        w="full"
        flexDir="column"
      >
        {/* brief information about Loop Web */}
        <Heading size="sm" p="3">
          About Us
        </Heading>
        <Text>
          {/* brief information about Loop Web */}
          Loop Cinemas is an Australian cinema chain that has been operating
          since 2000. We are a family-owned business that prides itself on
          providing the best movie experience possible. We have 20 locations
          across Australia, with our headquarters in Sydney. Our cinemas are
          located in major shopping centres and are open 7 days a week. We offer
          a range of movies, from the latest blockbusters to independent films.
          We also have a range of food and drinks available for purchase at our
          cinemas.
        </Text>
        <Divider my="4" />
        <Heading size="sm" p="3">
          What Makes Us the Best
        </Heading>
        <Text>
          {/* what makes them different from other cinema chains */}
          At Loop Cinemas, we are committed to providing you with the best
          experience possible. We are proud to be the only cinema chain in
          Australia that exclusively uses 4K digital projection in all our
          cinemas. We also have the largest screens in the country, with our
          biggest screen being 28.8 metres wide. Our premium cinema, Loop
          Cinemas Lux, is the first cinema in Australia to have laser
          projection.
        </Text>
        <Divider my="4" />
        {/* cinema locations */}
        <Locations />
        <Divider my="4" />
        <Heading size="lg" w="full" textAlign="center" p="3">
          Now Showing
        </Heading>

        <Box
          display="flex"
          flexWrap="wrap"
          gap="3"
          justifyContent="center"
          pb="10"
        >
          {moviesSorted.map((movie) => (
            <MoviePoster
              key={movie.movie_id}
              movie={movie}
              reviews={reviewMap.get(movie.movie_id)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/**
 * List of cinema locations in a flex grid with headings for each state
 * @returns {JSX.Element} list of cinema locations by state
 */
function Locations() {
  return (
    <>
      <Heading size="md" p="4">
        Locations
      </Heading>
      <Box display="flex" flexWrap="wrap" gap="10">
        <Box>
          <Heading size="xs">NSW</Heading>
          <UnorderedList>
            <ListItem>Broadway</ListItem>
            <ListItem>Cronulla</ListItem>
            <ListItem>Entertainment Quarter</ListItem>
            <ListItem>Tweed City</ListItem>
          </UnorderedList>
        </Box>
        <Box>
          <Heading size="xs">QLD</Heading>
          <UnorderedList>
            <ListItem>Indooroopilly</ListItem>
            <ListItem>Loganholme</ListItem>
            <ListItem>North Lakes</ListItem>
            <ListItem>Robina</ListItem>
          </UnorderedList>
        </Box>
        <Box>
          <Heading size="xs">SA</Heading>
          <UnorderedList>
            <ListItem>Marion</ListItem>
            <ListItem>Tea Tree Plaza</ListItem>
          </UnorderedList>
        </Box>
        <Box>
          <Heading size="xs">VIC</Heading>
          <UnorderedList>
            <ListItem>Chadstone</ListItem>
            <ListItem>Carlton</ListItem>
            <ListItem>Geelong</ListItem>
            <ListItem>Knox</ListItem>
          </UnorderedList>
        </Box>
        <Box>
          <Heading size="xs">WA</Heading>
          <UnorderedList>
            <ListItem>Booragoon</ListItem>
            <ListItem>Cockburn</ListItem>
            <ListItem>Innaloo</ListItem>
            <ListItem>Joondalup</ListItem>
          </UnorderedList>
        </Box>
        <Box>
          <Heading size="xs">TAS</Heading>
          <UnorderedList>
            <ListItem>Glenorchy</ListItem>
          </UnorderedList>
        </Box>
        <Box>
          <Heading size="xs">ACT</Heading>
          <UnorderedList>
            <ListItem>Manuka</ListItem>
          </UnorderedList>
        </Box>
        <Box>
          <Heading size="xs">NT</Heading>
          <UnorderedList>
            <ListItem>Casuarina</ListItem>
          </UnorderedList>
        </Box>
      </Box>
    </>
  );
}
