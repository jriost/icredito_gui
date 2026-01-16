"use client";

import axios from "axios";

// This file configures an Axios instance for client-side API calls.
// All requests made using this instance will be sent to our Next.js API proxy route,
// located at /src/app/api/[...path]/route.ts.
// The proxy will then securely forward the request to the actual backend API,
// adding the httpOnly authentication token on the server-side.

const api = axios.create({
  // The baseURL is set to '/api'. This makes all requests from the client
  // go to the Next.js server's own API routes.
  baseURL: "/api",
  headers: {
    'Content-Type': 'application/json'
  }
});

// The client-side interceptor for adding the auth token is no longer needed
// because the cookie is httpOnly and cannot be read by the browser.
// The server-side proxy is now responsible for attaching the token.

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // The middleware will handle 401 redirects, so we just log the error here.
    if (error.response && error.response.status === 401) {
      console.error("API request unauthorized. The middleware should handle redirection.");
    }
    return Promise.reject(error);
  }
);

export default api;
