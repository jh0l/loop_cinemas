import { ActionFunctionArgs } from "react-router-dom";
import Api, { ApiError } from "./lib/api_client";
import {
  FormReturnData,
  FormValidation,
  Movie,
  PostReviewMovieFormFieldName,
  Review,
  ReviewMovieFormError,
} from "../types";
import { ReviewMovieLoaderData } from "../pages/review-movie-page";

/**
 * the return type of the reviews endpoint
 */
export type ReturnData = FormReturnData<
  { msg: string; type: "success" },
  ReviewMovieFormError
>;

/**
 * a helper function to create a promise that resolves after a set time
 * @param delay time to delay by
 * @param value value to return from promise
 * @returns a promise that resolves after a set time
 */
export const timeoutPromise = (delay: number, value: any = undefined) =>
  new Promise((resolve) => setTimeout(resolve, delay, value));

/**
 * the reviews endpoint for creating, editing, and deleting reviews
 * @param args the ActionFunctionArgs supplied by react router dom
 * @returns a Response object
 */
export default async function reviews(
  args: ActionFunctionArgs
): Promise<ReturnData> {
  if (args.request.method === "POST") return await POST(args);
  if (args.request.method === "DELETE") return await DELETE(args);
  return {
    error: {
      message: `Method ${args.request.method} not allowed`,
    },
  };
}

/**
 * the DELETE handler for the reviews endpoint
 * @param args the ActionFunctionArgs supplied by react router dom
 * @returns a Response object
 */
async function DELETE(args: ActionFunctionArgs): Promise<ReturnData> {
  const data = await args.request.formData();
  const movie_id = args.params.movieId;
  const user_id = data.get("user_id");
  if (!movie_id || !user_id) {
    return {
      error: {
        message: "Missing required fields",
      },
    };
  }
  const review = await Api.deleteReview(movie_id, user_id.toString());
  if (review instanceof ApiError) {
    return {
      error: {
        message: review.message,
      },
    };
  }
  return { success: { ...review } };
}

/**
 * MAX_CONTENT is the maximum number of characters a user can write in a review.
 */
const MAX_CONTENT = 600;

/**
 * the POST handler for the reviews endpoint
 * @param args the ActionFunctionArgs supplied by react router dom
 * @returns a Response object
 */
async function POST(args: ActionFunctionArgs): Promise<ReturnData> {
  const data = await args.request.formData();
  const validation = new FormValidation<PostReviewMovieFormFieldName>();
  // get movie_id from url
  const movie_id = args.params.movieId;
  const { setInvalid } = validation;
  const user_id = data.get("user_id")?.toString();
  const rating = data.get("rating")?.toString();
  const content = data.get("content")?.toString();
  const human = data.get("human")?.toString();
  if (!movie_id || movie_id.toString().trim() === "") {
    setInvalid("movie_id").err("Movie ID cannot be empty");
  }
  if (!user_id || user_id.toString().trim() === "") {
    setInvalid("user_id").err("User ID cannot be empty");
  }
  if (!rating || rating.toString().trim() === "") {
    setInvalid("rating").err("Rating cannot be empty");
  } else {
    const ratingN = Number(rating.toString()) / 10;
    if (isNaN(ratingN) || ratingN < 1 || ratingN > 5) {
      setInvalid("rating").err("Rating must be a number between 1 and 5");
    }
  }

  if (!content || content.toString().trim() === "") {
    setInvalid("content").err("Content cannot be empty");
  } else if (content.toString().length > MAX_CONTENT) {
    setInvalid("content").err(
      `Content cannot be longer than ${MAX_CONTENT} characters`
    );
  }

  if (validation.length() > 0) {
    return {
      error: {
        form: validation.json(),
      },
    };
  }

  // PREVENT FAKE REVIEWS
  const reviews = await Api.getReviews(user_id);
  if (reviews instanceof ApiError) {
    return { error: { message: reviews.message } };
  }
  // if last review was less than 3 hours ago, return an error
  if (reviews.length > 0) {
    const lastReview = reviews[reviews.length - 1];
    const lastReviewDate = new Date(lastReview.createdAt || new Date());
    const now = new Date();
    const diff = now.getTime() - lastReviewDate.getTime();
    const hours = diff / (1000 * 60 * 60);
    if (hours < 3) {
      setInvalid("message").err(
        "You must wait at least 3 hours before posting a new review, or before editing an existing review."
      );
    }
  }
  if (human?.toString() !== "I am not a robot") {
    setInvalid("human").err(
      "You must prove you are not a robot by typing 'I am not a robot' (without the quotes)."
    );
  }

  if (validation.length() > 0) {
    return {
      error: {
        form: validation.json(),
      },
    };
  }

  if (!movie_id || !user_id || !rating || !content) {
    return {
      error: {
        message: "Missing required fields",
      },
    };
  }
  const ratingN = Number(rating.toString()) / 10;
  const review: Review = {
    movie_id: movie_id.toString(),
    user_id: user_id.toString(),
    rating: ratingN,
    content: content.toString(),
  };

  const res = await Api.addReview(review);

  if (res instanceof ApiError) {
    return {
      error: {
        message: res.message,
      },
    };
  }

  return { success: { ...res } };
}

/**
 * data type returned by the all reviews loader function
 */
export interface MovieReviewData {
  reviews: Review[];
  rating: {
    sum: number;
    count: number;
  };
}

/**
 * tracks the reviews, and the data for calculating the average rating of a movie
 */
export class MovieReviewData {
  constructor() {
    this.reviews = [];
    this.rating = {
      sum: 0,
      count: 0,
    };
  }
}

/**
 * the maximum rating a movie can have
 */
export const MAX_RATING = 5;

export type AllReviewsLoaderData =
  | {
      moviesSorted: Movie[];
      reviewMap: Map<string, MovieReviewData>;
    }
  | ApiError<"message">;

/**
 * loads all reviews and movies from the database, then sorts the movies by average rating
 * and number of reviews, and returns the sorted movies and a map of movie ids to reviews
 * @returns a Promise that resolves to the data described above
 */
export async function allReviewsLoader(): Promise<AllReviewsLoaderData> {
  const reviews = await Api.getReviews();
  if (reviews instanceof ApiError) {
    return reviews;
  }
  const movies = await Api.getMovies();
  if (movies instanceof ApiError) {
    return movies;
  }
  const reviewMap = new Map<string, MovieReviewData>();
  reviews.forEach((review) => {
    let movieData = reviewMap.get(review.movie_id);
    if (!movieData) {
      movieData = new MovieReviewData();
      reviewMap.set(review.movie_id, movieData);
    }
    movieData.reviews.push(review);
    movieData.rating.sum += review.rating;
    movieData.rating.count++;
  });
  const moviesSorted = [...movies];
  moviesSorted.sort((a, b) => {
    const aData = reviewMap.get(a.movie_id) || new MovieReviewData();
    const bData = reviewMap.get(b.movie_id) || new MovieReviewData();
    const aRating = aData.rating.sum / aData.rating.count;
    const bRating = bData.rating.sum / bData.rating.count;
    const res = bRating - aRating || 0;
    if (res === 0) {
      return bData.rating.count - aData.rating.count;
    }
    return res;
  });
  return { reviewMap, moviesSorted };
}

/**
 * returns the movie and reviews for a given movie id
 * @param param0 the params object from the react router dom
 * @returns a Promise that resolves to the movie and reviews for the given movie id
 */
export async function reviewsLoader({
  params,
}: any): Promise<ReviewMovieLoaderData> {
  if (!("movieId" in params)) return new ApiError("message", "Not found");
  const movies = await Api.getMovies();
  if (movies instanceof ApiError) {
    return movies;
  }
  const movie = movies.find((m) => m.movie_id === params.movieId);
  const reviews = await Api.getReviews();
  if (reviews instanceof ApiError) {
    return reviews;
  }
  const review = reviews.filter((r) => r.movie_id === params.movieId);
  return { movie, review };
}
