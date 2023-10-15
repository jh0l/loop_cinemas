import {
  FormError,
  User,
  LoginFormFieldName,
  EditProfileFormFieldName,
  Movie,
  Review,
  InsertUser,
  SignupFormFieldName,
  Success,
  Session,
} from "../../types";
import fetchWithApiError from "./fetchWithApiError";

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

/**
 * client that speaks with the express server
 */
class ApiClient {
  /**
   * @param user the user to signup
   * @returns a Promise that resolves to the user if successful or a SignupFormError if not
   */
  async user_signup(
    user: InsertUser
  ): Promise<User | ApiError<SignupFormFieldName>> {
    return await fetchWithApiError<User>("/api/user/signup", {
      method: "POST",
      body: JSON.stringify(user),
    });
  }

  /**
   * @returns a Promise that resolves to the user if successful or a SignupFormError if not
   */
  async user_get(): Promise<User | null | ApiError<"message">> {
    return await fetchWithApiError<User>("/api/user", {
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
    return fetchWithApiError<User>(`/api/user/`, {
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
    return await fetchWithApiError<User>("/api/user/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  /**
   * sign out user and remove cookies
   */
  async user_logout(): Promise<Success | ApiError<"message">> {
    return await fetchWithApiError<Success>("/api/user/signout", {
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
    return await fetchWithApiError<User>(`/api/user`, {
      method: "DELETE",
      body: JSON.stringify({ user_id }),
    });
  }

  /**
   * gets all movies from the database
   * @returns a Promise that resolves to an array of movies
   */
  async getMovies(): Promise<Movie[] | ApiError<"message">> {
    return await fetchWithApiError<Movie[]>(`/api/movies`, {
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
    return await fetchWithApiError<Review[]>(`/api/reviews${query}`, {
      method: "GET",
    });
  }

  /**
   * adds a review to the database
   * @param review the review to add
   * @returns a Promise that resolves to the added review
   */
  async addReview(review: Review): Promise<Success | ApiError<"message">> {
    return await fetchWithApiError<Success>(`/api/reviews`, {
      method: "POST",
      body: JSON.stringify(review),
    });
  }

  /**
   *  deletes a review from the database
   * @param movie_id id of the movie the review to delete is for
   * @param user_id id of the user who created the review to delete
   */
  async deleteReview(
    movie_id: string,
    user_id: string
  ): Promise<Success | ApiError<"message">> {
    return await fetchWithApiError<Success>(`/api/reviews`, {
      method: "DELETE",
      body: JSON.stringify({ movie_id, user_id }),
    });
  }

  /**
   * get the sessions for a movie from the database
   * @param movie_id the id of the movie to get sessions for
   */
  async getSessions(
    movie_id: string
  ): Promise<Session[] | ApiError<"message">> {
    return await fetchWithApiError<Session[]>(
      `/api/sessions?movie_id=${movie_id}`,
      {
        method: "GET",
      }
    );
  }
}

/**
 * instance of the client class
 */
const instance = new ApiClient();
export default instance;
