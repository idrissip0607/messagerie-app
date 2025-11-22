import { auth } from "@/firebase/config";
import axios from "axios";
import { signOut } from "firebase/auth";

export const Logout = async () => {
  try {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const id = storedUser ? JSON.parse(storedUser)?.id : null;

      if (!id) {
        alert("utilisateur introuvable");
        return;
      }

      // Mettre à jour le statut avant de se déconnecter
      try {
        await axios.patch(`/api/update-status/${id}`, {
          status: "hors-ligne",
        });
      } catch (statusError) {
        console.error(
          "Erreur lors de la mise à jour du statut avant déconnexion:",
          statusError
        );
      }

      localStorage.removeItem("user"); // on supprime le user du local storage

      // Vérifier que l'authentification Firebase est disponible avant de se déconnecter
      if (auth) {
        await signOut(auth); // on deconnecte le user de firebase
      }

      // Rediriger vers la page d'accueil
      return (location.href = "/");
    }
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    alert("Erreur lors de la déconnexion. Veuillez réessayer.");

    // Même en cas d'erreur, on redirige vers la page d'accueil
    if (typeof window !== "undefined") {
      location.href = "/";
    }
  }
};
