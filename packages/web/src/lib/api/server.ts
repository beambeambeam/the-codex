import { cookies } from "next/headers";
import createFetchClient from "openapi-fetch";

export const fetchClientServer = createFetchClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  fetch: async (request) => {
    return fetch(request, {
      headers: {
        cookie: (await cookies()).toString(),
      },
      cache: "no-store",
    });
  },
});
