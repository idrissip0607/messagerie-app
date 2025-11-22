import axios from "axios";
import { toast } from "react-toastify";

async function ChangeStatus(me: string, status: { status: string }) {
  try {
    // Vérifier que l'ID utilisateur est fourni
    if (!me) {
      console.error("ID utilisateur manquant pour la mise à jour du statut");
      return;
    }

    // Vérifier que le statut est fourni
    if (!status?.status) {
      console.error("Statut manquant pour la mise à jour");
      return;
    }

    // Ajouter un timeout pour éviter les blocages
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes timeout

    const response = await axios.patch(`/api/update-status/${me}`, status, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Vérifier la réponse de l'API
    if (response?.data?.message !== "ok") {
      console.error(
        "Erreur lors de la mise à jour du statut :",
        response?.data?.message
      );
    }
  } catch (error: any) {
    // Gérer les erreurs spécifiques
    if (error.name === "AbortError") {
      console.warn("La requête de mise à jour du statut a expiré");
    } else {
      console.error("Erreur lors de la mise à jour du statut :", error);
    }
    // Ne pas afficher de toast pour les erreurs de statut pour éviter de spammer l'utilisateur
  }
}

export default ChangeStatus;
