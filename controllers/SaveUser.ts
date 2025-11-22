import { Contact } from "@/types";
import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "react-toastify";

export const saveUser = async (router: AppRouterInstance, body: Contact) => {
  try {
    // Vérifier que le corps de la requête contient les informations nécessaires
    if (!body?.id || !body?.name) {
      toast.error("Informations utilisateur incomplètes.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(body));
    // On ajoute une session storage pour vérifier l'expiration des données
    sessionStorage.setItem("loginStatus", "en ligne");

    // On sauvegarde l'utilisateur dans la base de données
    const req = await axios.patch("/api/save-user", body);
    const res = req?.data;

    if (res.message !== "ok") {
      toast.error(
        res.message || "Erreur lors de la sauvegarde de l'utilisateur."
      );
      return;
    }

    // On redirige vers la page de chat
    router.push("/chat");
    toast.success("Connexion réussie !");
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'utilisateur :", error);
    toast.error("Erreur lors de la connexion. Veuillez réessayer.");
  }
};
