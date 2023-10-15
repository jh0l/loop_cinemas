import { ActionFunctionArgs } from "react-router-dom";
import { User, EditProfileFormError, FormReturnData } from "../types";
import Api, { ApiError } from "./lib/api_client";
import { validateEmail } from "./signup";

/**
 * the return type of the profile endpoint
 */
export type ReturnData = FormReturnData<
  { user: User | false },
  EditProfileFormError
>;

/**
 * creates a response object
 * @param data the return type from above
 * @param status the status code of the http response
 * @returns a Response object
 */
const response = (data: ReturnData, status: number): Response =>
  new Response(JSON.stringify(data), { status });

/**
 * the profile endpoint for editing and deleting a user
 * @param param0 the ActionFunctionArgs supplied by react router dom
 * @returns a Response object with the user or false if deleted
 */
export default async function profile({
  request,
}: ActionFunctionArgs): Promise<Response> {
  const { method } = request;
  if (!["PATCH", "DELETE"].includes(method)) {
    return response({ error: { message: "Method not allowed" } }, 405);
  }
  const data = await request.formData();
  const user_id = data.get("user_id");
  if (method === "DELETE") {
    if (!user_id) {
      return response({ error: { form: { email: "user ID required" } } }, 400);
    }
    const user = await Api.deleteUser(user_id.toString());
    if (user instanceof ApiError) {
      return response({ error: { form: user.json() } }, 400);
    }
    return response({ success: { user: false } }, 200);
  }
  const email = data.get("email");
  const name = data.get("name");
  if (!user_id || !email || !name) {
    return response(
      { error: { form: { message: "user ID, email, and name are required" } } },
      400
    );
  } else if (!validateEmail(email.toString())) {
    return response({ error: { form: { email: "email is invalid" } } }, 400);
  }
  const res = await Api.updateUser({
    name: name.toString(),
    email: email.toString(),
  });
  if (res instanceof ApiError) {
    return response({ error: { form: res.json() } }, 400);
  }
  return response({ success: { user: res } }, 200);
}

export type ProfileLoaderData = User | ApiError<"message"> | null;
export function profileLoader(): Promise<ProfileLoaderData> {
  return Api.user_get();
}
