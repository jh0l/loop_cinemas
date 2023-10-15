import {
  FormError,
  User,
  LoginFormFieldName,
  EditProfileFormFieldName,
  Movie,
  Review,
  InsertUser,
  SignupFormFieldName,
} from "../../types";
import { MOVIES } from "./fakeData";
import fetchWithFormError from "./fetchWithFormError";

/**
 * A class to help with api error handling and form validation
 * @template T The field names
 */
export class ApiError<T extends string | "message"> extends Error {
  field: T;
  message: string;
  constructor(field: T, message: string) {
    super(message);
    this.field = field;
    this.message = message;
  }
  /**
   * converts the error to a JSON representation
   * @returns a JSON representation of the error
   */
  json(): FormError<T> {
    const res = {} as FormError<T>;
    res[this.field] = this.message;
    return res;
  }
}

const USERS_KEY = "users";
const REVIEWS_KEY = "reviews";

/**
 * client that speaks with the express server
 */
class ApiClient {
  users: User[];
  movies: Movie[];
  reviews: Review[];

  /**
   * Creates a new instance of the client class
   */
  constructor() {
    const users = localStorage.getItem(USERS_KEY);
    const reviews = localStorage.getItem(REVIEWS_KEY);
    if (users) {
      this.users = JSON.parse(users);
    } else {
      this.users = [];
    }
    if (reviews) {
      this.reviews = JSON.parse(reviews);
    } else {
      this.reviews = [];
    }

    this.movies = MOVIES;
  }

  /**
   * @param user the user to signup
   * @returns a Promise that resolves to the user if successful or a SignupFormError if not
   */
  async user_signup(
    user: InsertUser
  ): Promise<User | ApiError<SignupFormFieldName>> {
    return await fetchWithFormError<User>("/api/user/signup", {
      method: "POST",
      body: JSON.stringify(user),
    });
  }

  /**
   * @returns a Promise that resolves to the user if successful or a SignupFormError if not
   */
  async user_get(): Promise<User | null | ApiError<"message">> {
    return await fetchWithFormError<User>("/api/user", {
      method: "GET",
    });
  }

  /**
   * updates a user in the database
   * @param user_id user id of the user to update
   * @param user the fields of the user to update
   * @returns the updated user if successful or a EditProfileFormError if not
   */
  async updateUser(
    user: Partial<User>
  ): Promise<User | ApiError<EditProfileFormFieldName>> {
    return fetchWithFormError<User>(`/api/user/`, {
      method: "PATCH",
      body: JSON.stringify({ ...user }),
    });
  }

  /**
   * gets a user from theke database
   * @param email the email of the user to get
   * @param password the password of the user to get
   * @returns the user if successful or a LoginFormFieldName if not
   */
  async user_login(
    email: string,
    password: string
  ): Promise<User | ApiError<LoginFormFieldName>> {
    return await fetchWithFormError<User>("/api/user/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  /**
   * sign out user and remove cookies
   */
  async user_logout(): Promise<User | ApiError<"message">> {
    return await fetchWithFormError<User>("/api/user/signout", {
      method: "GET",
    });
  }

  /**
   * deletes a user from the database
   * @param user_id the user id of the user to delete
   * @returns the deleted user if successful or a EditProfileFormError if not
   */
  async deleteUser(
    user_id: string
  ): Promise<User | ApiError<EditProfileFormFieldName>> {
    return await fetchWithFormError<User>(`/api/user`, {
      method: "DELETE",
      body: JSON.stringify({ user_id }),
    });
  }

  /**
   * gets all movies from the database
   * @returns a Promise that resolves to an array of movies
   */
  async getMovies(): Promise<Movie[] | ApiError<"message">> {
    return await fetchWithFormError<Movie[]>(`/api/movies`, {
      method: "GET",
    });
  }

  /**
   *
   * @param user_id (optional) the user id of the user to get reviews for
   * @returns a Promise that resolves to an array of reviews
   */
  async getReviews(user_id?: string): Promise<Review[] | ApiError<"message">> {
    const query = user_id ? `?user_id=${user_id}` : "";
    return await fetchWithFormError<Review[]>(`/api/reviews${query}`, {
      method: "GET",
    });
  }

  /**
   * adds a review to the database
   * @param review the review to add
   * @returns a Promise that resolves to the added review
   */
  async addReview(review: Review): Promise<Review> {
    const oldReview = this.reviews.findIndex(
      (r) => r.movie_id === review.movie_id && r.user_id === review.user_id
    );
    if (oldReview >= 0) {
      this.reviews[oldReview] = review;
    } else {
      this.reviews.push(review);
    }
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(this.reviews));
    return review;
  }

  /**
   *  deletes a review from the database
   * @param movie_id id of the movie the review to delete is for
   * @param user_id id of the user who created the review to delete
   * @returns the deleted review if successful or a ApiFormError if not
   */
  async deleteReview(movie_id: string, user_id: string) {
    const idx = this.reviews.findIndex(
      (r) => r.movie_id === movie_id && r.user_id === user_id
    );
    if (idx < 0) {
      return new ApiError("message", "Review does not exist");
    }
    const review = this.reviews[idx];
    this.reviews.splice(idx, 1);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(this.reviews));
    return review;
  }
}

/**
 * instance of the client class
 */
const instance = new ApiClient();
export default instance;
