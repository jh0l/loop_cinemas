import { ActionFunctionArgs } from "react-router-dom";
import { User, LoginFormError, FormReturnData } from "../types";
import Api, { ApiFormError } from "./lib/fakeDb";

/**
 * the return type of the login endpoint
 */
export type ReturnData = FormReturnData<{ user: User }, LoginFormError>;

/**
 * creates a response object
 * @param data the return type from above
 * @param status the status code of the http response
 * @returns a Response object
 */
const response = (data: ReturnData, status: number): Response =>
  new Response(JSON.stringify(data), { status });

/**
 * the login endpoint
 * @param args the ActionFunctionArgs supplied by react router dom
 * @returns a Response object
 */
export default async function login({
  request,
}: ActionFunctionArgs): Promise<Response> {
  const data = await request.formData();
  const email = data.get("email");
  const password = data.get("password");
  if (!email) {
    return response({ error: { form: { email: "Email is required" } } }, 400);
  }
  if (!password || !password.toString().trim()) {
    return response(
      { error: { form: { password: "Password is required" } } },
      400
    );
  }
  const res = await Api.getUserWithPassword(
    email.toString(),
    password.toString()
  );
  if (res instanceof ApiFormError) {
    return response({ error: { form: res.json() } }, 400);
  }
  return response({ success: { user: res } }, 200);
}
