import ChangeStatus from "./ChangeStatus";

// Fonction exécutée quand l'utilisateur ferme l'application ou le navigateur
export const handleBeforeUnload = async (me: string) => {
  // Vérifier que l'ID utilisateur est fourni
  if (!me) {
    console.error("ID utilisateur manquant dans handleBeforeUnload");
    return;
  }

  // Utiliser sendBeacon pour une mise à jour fiable avant le déchargement
  // sendBeacon est plus fiable que les requêtes normales lors de la fermeture de la page
  if (typeof window !== "undefined" && navigator.sendBeacon) {
    try {
      const data = JSON.stringify({ status: "hors-ligne" });
      const url = `/api/update-status/${me}`;

      // Tenter d'utiliser sendBeacon pour une mise à jour fiable
      const success = navigator.sendBeacon(
        url,
        new Blob([data], { type: "application/json" })
      );

      if (!success) {
        console.warn(
          "sendBeacon a échoué, tentative de mise à jour alternative"
        );
        // En dernier recours, utiliser ChangeStatus
        ChangeStatus(me, { status: "hors-ligne" });
      }
    } catch (error) {
      console.error("Erreur lors de l'utilisation de sendBeacon:", error);
      // En dernier recours, utiliser ChangeStatus
      ChangeStatus(me, { status: "hors-ligne" });
    }
  } else {
    // Si sendBeacon n'est pas disponible, utiliser ChangeStatus
    ChangeStatus(me, { status: "hors-ligne" });
  }
};
