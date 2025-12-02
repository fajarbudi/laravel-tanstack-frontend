import { redirect } from "@tanstack/react-router";
import api from "./axios";

const checkAuth = async (location: any) => {
  const { data } = await api.get("/check-auth");

  if (!data.authenticated) {
    // Jika TIDAK terotentikasi, kita paksa router untuk redirect dengan "throw"
    throw redirect({
      to: "/auth/login",
      search: {
        redirect: location.href,
      },
    });
  }
};

export { checkAuth };
