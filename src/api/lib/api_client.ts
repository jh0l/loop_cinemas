import {
  FormError,
  User,
  SignupFormError,
  LoginFormFieldName,
  EditProfileFormFieldName,
  Movie,
  Review,
} from "../../types";
import { MOVIES } from "./fakeData";

/**
 * A class to help with form validation
 * @template T The field names
 */
export class ApiFormError<T extends string> {
  field: T;
  message: string;
  constructor(field: T, message: string) {
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
 * a Fake Database that stores JSOn to and retrieves data from localStorage
 */
class ApiClient {
  users: User[];
  movies: Movie[];
  reviews: Review[];

  /**
   * Creates a new instance of the fakeDb class
   * loads data from localStorage
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
   *
   * @param user the user to signup
   * @returns a Promise that resolves to the user if successful or a SignupFormError if not
   */
  async user_signup(user: User): Promise<User | SignupFormError> {
    if (this.users.find((u) => u.email === user.email)) {
      return new ApiFormError("email", "User already exists");
    }
    this.users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(this.users));
    return user;
  }

  /**
   * updates a user in the fake database
   * @param user_id user id of the user to update
   * @param user the fields of the user to update
   * @returns the updated user if successful or a EditProfileFormError if not
   */
  async updateUser(
    user_id: string,
    user: Partial<User>
  ): Promise<User | ApiFormError<EditProfileFormFieldName>> {
    const idx = this.users.findIndex((u) => u.user_id === user_id);
    if (idx < 0) {
      return new ApiFormError("email", "User does not exist");
    }
    this.users[idx] = { ...this.users[idx], ...user };
    localStorage.setItem(USERS_KEY, JSON.stringify(this.users));
    return this.users[idx];
  }

  /**
   * gets a user from the fake database
   * @param email the email of the user to get
   * @param password the password of the user to get
   * @returns the user if successful or a LoginFormFieldName if not
   */
  async getUserWithPassword(
    email: string,
    password: string
  ): Promise<User | ApiFormError<LoginFormFieldName>> {
    const user = this.users.find((u) => u.email === email);
    if (!user || user.password !== password) {
      return new ApiFormError("message", "User/Password combination incorrect");
    }
    return user;
  }

  /**
   * deletes a user from the fake database
   * @param user_id the user id of the user to delete
   * @returns the deleted user if successful or a EditProfileFormError if not
   */
  async deleteUser(
    user_id: string
  ): Promise<User | ApiFormError<EditProfileFormFieldName>> {
    const idx = this.users.findIndex((u) => u.user_id === user_id);
    if (idx < 0) {
      return new ApiFormError("email", "User does not exist");
    }
    const user = this.users[idx];
    this.users.splice(idx, 1);
    localStorage.setItem(USERS_KEY, JSON.stringify(this.users));
    return user;
  }

  /**
   * gets all movies from the fake database
   * @returns a Promise that resolves to an array of movies
   */
  async getMovies(): Promise<Movie[]> {
    return this.movies;
  }

  /**
   *
   * @param user_id (optional) the user id of the user to get reviews for
   * @returns a Promise that resolves to an array of reviews
   */
  async getReviews(user_id?: string): Promise<Review[]> {
    if (user_id) {
      return this.reviews.filter((r) => r.user_id === user_id);
    }
    return this.reviews;
  }

  /**
   * adds a review to the fake database
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
   *  deletes a review from the fake database
   * @param movie_id id of the movie the review to delete is for
   * @param user_id id of the user who created the review to delete
   * @returns the deleted review if successful or a ApiFormError if not
   */
  async deleteReview(movie_id: string, user_id: string) {
    const idx = this.reviews.findIndex(
      (r) => r.movie_id === movie_id && r.user_id === user_id
    );
    if (idx < 0) {
      return new ApiFormError("message", "Review does not exist");
    }
    const review = this.reviews[idx];
    this.reviews.splice(idx, 1);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(this.reviews));
    return review;
  }
}

/**
 * a singleton instance of the fakeDb class
 */
const instance = new ApiClient();
export default instance;
