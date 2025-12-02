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
      // const currentPath = window.location.pathname + window.location.search;
      // window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;

      window.location.href = `/auth/login`;

      // Hentikan Promise error agar tidak memicu error di komponen yang memanggil API
      return new Promise(() => {});
    }

    // Untuk error lain (404, 500, dll.), biarkan error diteruskan
    return Promise.reject(error);
  }
);

export default api;
