import { ApiResponse } from "../../types";
import { ApiFormError } from "./api_client";

export default async function fetchWithSoftError<T>(
  url: RequestInfo | URL,
  options: RequestInit
): Promise<T | ApiFormError<"message">> {
  options.headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const response = await fetch(url, options);

  if (response.ok) {
    const result = await response.json();

    if (result.error) {
      return new ApiFormError("message", String(result.error));
    }

    const data = result as ApiResponse;
    if (data.type === "user") {
      return data.user as T;
    }
    return data as T;
  }
  let err: string;
  try {
    const result = await response.json();
    if (result.msg) {
      err = String(result.msg);
    } else {
      err = JSON.stringify(result);
    }
  } catch {
    err = `Error ${response.status}: ${response.statusText}`;
  }
  return new ApiFormError("message", err);
}
