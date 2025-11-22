import ChangeStatus from "./ChangeStatus";

// Fonction exécutée quand l'utilisateur quitte l'onglet (mais pas forcément le navigateur)
export const handleVisibilityChange = async (me: string) => {
  // Vérifier que l'ID utilisateur est fourni
  if (!me) {
    console.error("ID utilisateur manquant dans handleVisibilityChange");
    return;
  }

  if (document.visibilityState === "hidden") {
    ChangeStatus(me, { status: "hors-ligne" });
  } else if (document.visibilityState === "visible") {
    ChangeStatus(me, { status: "en ligne" });
  }
};
