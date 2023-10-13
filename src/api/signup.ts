import { ActionFunctionArgs } from "react-router-dom";
import {
  User,
  SignupFormFieldName,
  SignupFormError,
  FormReturnData,
  FormValidation,
} from "../types";
import Api, { ApiFormError } from "./lib/api_client";

/**
 * the return type of the signup endpoint
 */
export type ReturnData = FormReturnData<{ user: User }, SignupFormError>;

/**
 * creates a response object
 * @param data the return type from above
 * @param status the status code of the http response
 * @returns a Response object
 */
const response = (data: ReturnData, status: number): Response =>
  new Response(JSON.stringify(data), { status });

/**
 * the signup endpoint
 * @param args the ActionFunctionArgs supplied by react router dom
 * @returns a Response object
 * @returns Error with status code 400 if malformed request
 * @returns Error with status code 400 if email is invalid
 * @returns Error with status code 400 if password is invalid
 * @returns Error with status code 400 if user already exists
 * @returns User with status code 200 if successful
 */
export default async function signup({
  request,
}: ActionFunctionArgs): Promise<Response> {
  const validation = new FormValidation<SignupFormFieldName>();
  const { setInvalid } = validation;
  const data = await request.formData();
  const name = data.get("name");
  const email = data.get("email");
  const password = data.get("password");
  const confirm = data.get("confirm_password");

  if (!name || name.toString().trim() === "") {
    setInvalid("name").err("Name cannot be empty");
  }

  if (!email || email === "") {
    setInvalid("email").err("Email cannot be empty");
  } else if (!validateEmail(email.toString())) {
    setInvalid("email").err("Email is invalid");
  }

  if (!password || password === "") {
    setInvalid("password").err("Password cannot be empty");
  } else if (!confirm || confirm === "") {
    setInvalid("confirm_password").err("Confirm Password cannot be empty");
  } else if (password !== confirm) {
    setInvalid("confirm_password").err("Passwords do not match");
  } else {
    const res = testPasswordStrength(password.toString());
    if (res instanceof Error) {
      setInvalid("password").err(res.message);
    }
  }
  if (validation.length() > 0) {
    return response(
      {
        error: {
          form: validation.json(),
        },
      },
      400
    );
  }

  // malformed request
  if (!name || !email || !password)
    return response(
      {
        error: {
          message: "Malformed request",
        },
      },
      400
    );
  const newUser = {
    name: name.toString(),
    email: email.toString(),
    password: password.toString(),
  };
  const res = await Api.user_signup(newUser);
  if (res instanceof ApiFormError) {
    return response(
      {
        error: {
          form: res.json(),
        },
      },
      400
    );
  }
  return new Response(JSON.stringify({ success: { user: res } }), {
    status: 200,
  });
}

/**
 * validates an email address
 * @param email the email address to validate
 * @returns true if valid, false if not
 */
export function validateEmail(email: string): boolean {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

/**
 * tests the strength of a password
 * @param password the password to test
 * @returns null if valid, Error if not
 */
function testPasswordStrength(password: string): Error | null {
  if (password.length < 14)
    return new Error("Password must be at least 14 characters long");
  if (password.toLowerCase() === password)
    return new Error("Password must contain at least one uppercase letter");
  if (password.toUpperCase() === password)
    return new Error("Password must contain at least one lowercase letter");
  if (!/\d/.test(password))
    return new Error("Password must contain at least one number");
  if (!/\W/.test(password))
    return new Error("Password must contain at least one special character");
  // test if password repeats characters
  for (let i = 0; i < password.length - 2; i++) {
    const sub = password.substring(i, i + 3);
    if (sub[0] === sub[1] && sub[1] === sub[2]) {
      return new Error(
        "Password must not contain more than 2 repeating characters"
      );
    }
  }
  // test if password does not have enough unique characters
  const unique = new Set(password.split(""));
  if (unique.size < 5)
    return new Error("Password must contain at least 5 unique characters");

  // test if password has sequential characters
  for (let i = 0; i < password.length - 2; i++) {
    const sub = password.substring(i, i + 3);
    if (SEQUENTIAL.includes(sub)) {
      return new Error(
        "Password must not contain more than 2 sequential characters"
      );
    }
  }
  if (["password"].includes(password.toLowerCase()))
    return new Error('Password must not contain the word "password"');
  // test if password contains any number that looks like a date or year
  const date = /\d{1,2}\/\d{1,2}\/\d{2,4}/;
  const year = /\d{4}/;
  if (date.test(password) || year.test(password))
    return new Error("Password must not contain a date or year");
  if (password.includes("9GqkaVpu_~vwYp?"))
    return new Error("Password must not contain the example password");
  return null;
}
const SEQUENTIAL = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+|~qwertyuiop[]asdfghjkl;'zxcvbnm,./`;
