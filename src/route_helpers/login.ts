import { ActionFunctionArgs } from "react-router-dom";
import { User, LoginFormError, FormReturnData } from "../types";
import Api, { ApiError } from "./lib/api_client";
/**
 * the return type of the login endpoint
 */
export type ReturnData = FormReturnData<{ user: User }, LoginFormError>;
/**
 * the login endpoint
 * @param args the ActionFunctionArgs supplied by react router dom
 */
export default async function login({
  request,
}: ActionFunctionArgs): Promise<ReturnData> {
  const data = await request.formData();
  const email = data.get("email");
  const password = data.get("password");
  if (!email) {
    return { error: { form: { email: "Email is required" } } };
  }
  if (!password || !password.toString().trim()) {
    return { error: { form: { password: "Password is required" } } };
  }
  const res = await Api.user_login(email.toString(), password.toString());
  if (res instanceof ApiError) {
    return { error: { form: res.json() } };
  }
  return { success: { user: res } };
}
