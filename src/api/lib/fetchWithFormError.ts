import { ApiResponse } from "../../types";
import { ApiError } from "./api_client";

export default async function fetchWithFormError<T>(
  url: RequestInfo | URL,
  options: RequestInit
): Promise<T | ApiError<"message">> {
  options.headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const response = await fetch(url, options);

  if (response.ok) {
    const result = await response.json();

    if (result.error) {
      return new ApiError("message", String(result.error));
    }

    const data = result as ApiResponse;
    switch (data.type) {
      case "movies":
        return data.movies as T;
      case "reviews":
        return data.reviews as T;
      case "user":
        return data.user as T;
      case "success":
        return data as T;
      default:
        return new ApiError("message", "Unknown response type");
    }
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
  return new ApiError("message", err);
}
