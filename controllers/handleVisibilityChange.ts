// a revoir explicitement
import ChangeStatus from "./ChangeStatus";

// 🔹 Fonction exécutée quand l’utilisateur quitte l’onglet (mais pas forcément le navigateur)
export const handleVisibilityChange = async (me: string) => {
        if (document.visibilityState === "hidden") {
          ChangeStatus(me, { status: "hors-ligne" })
        } else if (document.visibilityState === "visible") {
          ChangeStatus(me, { status: "en ligne" })
        }
      };