// Define specific type overrides for our utility function
interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, any> | BodyInit | null;
}

export async function fetchFn<TResponse = any>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<TResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const fullUrl = `${baseUrl}${endpoint}`;

  const headers = new Headers(options.headers);

  // 3. Smart body handling: If it's a plain object, stringify it and set JSON header
  let serializedBody: BodyInit | null | undefined = options.body as
    | BodyInit
    | null
    | undefined;

  if (
    options.body &&
    typeof options.body === "object" &&
    !(options.body instanceof FormData) &&
    !(options.body instanceof Blob)
  ) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    serializedBody = JSON.stringify(options.body);
  }

  // 4. Attach authentication tokens automatically if stored locally (Optional layer)
  //   const token = localStorage.getItem("auth_token");
  //   if (token && !headers.has("Authorization")) {
  //     headers.set("Authorization", `Bearer ${token}`);
  //   }

  // 5. Execute network request
  const config: RequestInit = {
    credentials: "include",
    ...options,
    headers,
    body: serializedBody,
  };

  const response = await fetch(fullUrl, config);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorMessage =
      errorBody.message ||
      `API Error: ${response.status} ${response.statusText}`;

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as TResponse;
  }

  const data = (await response.json()) as TResponse;
  return data;
}
