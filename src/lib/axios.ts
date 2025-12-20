import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;
const api = axios.create({
  baseURL: backendURL,

  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika ada error pada respons
    if (
      (error.response && error.response.status === 401) ||
      error.response.status === 404
    ) {

      window.location.href = `/auth/login`;

      return new Promise(() => {});
    }


    return Promise.reject(error);
  }
);

export default api;
