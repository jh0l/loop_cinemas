/**
 * This file contains all the types used in the application
 */

/**
 * A user object
 */
export interface User {
  user_id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface InsertUser {
  email: string;
  name: string;
  password: string;
}

export type Success = {
  msg: string;
  type: "success";
};

/**
 * A form error object. The keys are the field names and the values are the error messages
 */
export type FormError<T extends string> = Partial<Record<T, string>>;

// SIGN UP
/**
 * The fields to have error messages for in the Signup form.
 */
export type SignupFormFieldName =
  | "name"
  | "email"
  | "password"
  | "confirm_password"
  | "message";
/**
 * The error messages for the Signup form.
 */
export type SignupFormError = FormError<SignupFormFieldName>;

// SIGN IN
/**
 * The fields to have error messages for in the Login form.
 */
export type LoginFormFieldName = "email" | "password" | "message";
/**
 * The error messages for the Login form.
 */
export type LoginFormError = FormError<LoginFormFieldName>;

// EDIT PROFILE
/**
 * The fields to have error messages for in the Edit Profile form.
 */
export type EditProfileFormFieldName =
  | "mode"
  | "user_id"
  | "name"
  | "email"
  | "message";
/**
 * The error messages for the Edit Profile form.
 */
export type EditProfileFormError = FormError<EditProfileFormFieldName>;

// REVIEW
/**
 * The fields to have error messages for in the Review form.
 */
export type PostReviewMovieFormFieldName =
  | "movie_id"
  | "user_id"
  | "message"
  | "rating"
  | "content"
  | "human";
/**
 * The error messages for the Review form.
 */
export type ReviewMovieFormError = FormError<PostReviewMovieFormFieldName>;

/**
 * The generic return type for all form submission api endpoints. Ok is the type of the data returned on success, and Err is the type of the error data returned on failure. The error data can be either a form error or a message.
 */
export type FormReturnData<Ok, Err> =
  | {
      error:
        | {
            form: Err;
          }
        | {
            message: string;
          };
    }
  | {
      success: Ok;
    };

/**
 * A class to help with form validation. It is used in the api endpoints to validate the form data.
 */
export class FormValidation<ID extends string> {
  /**
   * The fields to have error messages for in the form.
   */
  fields: Record<
    ID,
    {
      err: (msg: string) => void;
      message: string;
    }
  >;
  /**
   * A function to set the error message for a field that can be destructured from the fields object.
   */
  setInvalid: (id: ID) => {
    err: (msg: string) => void;
    message: string;
  };
  /**
   * Create a new FormValidation object.
   */
  constructor() {
    this.fields = {} as Record<
      ID,
      {
        err: (msg: string) => void;
        message: string;
      }
    >;
    /**
     * A function to set the error message for a field that can be destructured from the fields object.
     */
    this.setInvalid = this._setInvalid.bind(this);
  }

  /**
   * Set the error message for a field.
   * @param id the field to set the error message for
   * @returns the field being an object with a function for setting the error message for the field.
   */
  _setInvalid(id: ID) {
    this.fields[id] = {
      err: (msg: string) => {
        this.fields[id].message = msg;
      },
      message: "",
    };
    return this.fields[id];
  }

  /**
   * Get the number of fields with error messages.
   * @returns the number of fields with error messages
   */
  length() {
    return Object.entries(this.fields).length;
  }

  /**
   * Convert the error messages to a JSON representation.
   * @returns a JSON representation of the error messages as map of field names and the error
   */
  json(): Partial<Record<ID, string>> {
    const record: Partial<Record<ID, string>> = {} as Partial<
      Record<ID, string>
    >;
    for (const key in this.fields) {
      const res = this.fields[key].message;
      record[key] = res;
    }
    return record;
  }
}

/**
 * The Popup type of the App Context. It is an easy way to display popups on the screen.
 */
export interface Popup {
  title?: string;
  body: string | JSX.Element;
  type: "success" | "info" | "error";
  footer?: JSX.Element;
}

/**
 * The Movie type. It is used to represent a movie in the application.
 */
export interface Movie {
  movie_id: string;
  title: string;
  year: string;
  content_rating: string;
  poster_url: string;
  plot: string;
  genres: string[];
  showTimes: {
    day: string;
    times: string[];
  }[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * The Review type. It is used to represent a review in the application.
 */
export interface Review {
  movie_id: string;
  user_id: string;
  rating: number;
  content: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type ApiResponse =
  | { type: "user"; user: User }
  | { type: "error"; msg: string }
  | { type: "success"; msg: string }
  | { type: "movies"; movies: Movie[] }
  | { type: "reviews"; reviews: Review[] };
