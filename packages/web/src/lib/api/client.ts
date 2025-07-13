import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

export const fetchClient = createFetchClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  fetch: (request) => {
    return fetch(request, {
      credentials: "include",
    });
  },
});

export const $api = createClient(fetchClient);
