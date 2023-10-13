export default async function fetchWithError(
  url: RequestInfo | URL,
  options?: RequestInit | undefined
) {
  const response = await fetch(url, options);

  if (response.ok) {
    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  }
  let err: Error;
  try {
    const result = await response.json();
    if (result.msg) {
      err = new Error(result.msg);
    } else {
      err = new Error(JSON.stringify(result));
    }
  } catch {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  throw err;
}
