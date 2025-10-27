import { addCookieToHeaders } from "../addCookieToHeader";

export const addAuthorizationHeader = addCookieToHeaders(
  "new-vision-token",
  "Authorization",
  (v) => `Bearer ${v}`,
  Boolean
);
