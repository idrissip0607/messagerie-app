import { Contact } from "@/types";
import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const saveUser = async (router: AppRouterInstance, body: Contact) => {
  try {
    localStorage.setItem("user", JSON.stringify(body));
    //  on ajoute une session storage pour verifier l'expiration des données
    sessionStorage.setItem("loginStatus", "en ligne");

    // on save l'user dans la db
    const req = await axios.patch("/api/save-user", body);
    const res = req?.data;

    if (res.message !== "ok") {
      return alert(res.message);
    }

    // on redirige vers la page de chat
    return router.push("/chat");
  } catch (error) {
    console.log(error);
  }
};
