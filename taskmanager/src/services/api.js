import axios from "axios";

// 1. Create the Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor - runs before every request is sent
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // read token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // attach it
    }
    return config; // must return config or request will not proceed
  },
  (error) => Promise.reject(error), // handle req setup errors
);

// 3. Response Interceptor runs after every res comes back
api.interceptors.response.use(
  (response) => response, // success
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid force logout
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else if (status === 403) {
      console.error("Access forbidden");
    } else if (status === 500) {
      console.log("Server error, try again later");
    }

    return Promise.reject(error); // always re-reject so callers can handle too
  },
);

export default api;
