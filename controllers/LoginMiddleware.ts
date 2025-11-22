import { auth } from "@/firebase/config";
import { Contact } from "@/types";
import { onAuthStateChanged } from "firebase/auth";
import { saveUser } from "./SaveUser";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "react-toastify";

export const LoginMiddleware = (
  router: AppRouterInstance,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  page: string
) => {
  if (typeof window !== "undefined") {
    // Vérifier si l'utilisateur existe dans le localStorage
    let user: Contact | null = null;
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
      } catch (error) {
        console.error(
          "Erreur lors du parsing de l'utilisateur depuis localStorage :",
          error
        );
        toast.error("Erreur de session. Veuillez vous reconnecter.");
      }
    }

    if (!user) {
      if (page === "accueil") {
        // Si on est sur la page login et que l'user n'est pas connecté dans firebase on affiche le bouton login
        return setLoading(false);
      } else {
        // Si on est sur la page chat et que l'user n'est pas connecté dans firebase on redirige vers la page d'accueil
        router.push("/");
        return;
      }
    }

    // Vérifier la connexion de l'user avec firebase (double verification)
    // Vérifier que l'authentification Firebase est disponible avant de l'utiliser
    if (!auth) {
      console.error("Firebase authentification non disponible");
      if (page !== "accueil") {
        toast.error(
          "Service d'authentification non disponible. Veuillez réessayer."
        );
        router.push("/");
      } else {
        setLoading(false);
      }
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        if (page === "accueil") {
          // Si on est sur la page login et que l'user n'est pas connecté dans firebase on affiche le bouton login
          setLoading(false);
        } else {
          // Si on est sur la page chat et que l'user n'est pas connecté dans firebase on redirige vers la page d'accueil
          toast.info("Session expirée. Veuillez vous reconnecter.");
          router.push("/");
        }
        return;
      }

      // On le redirige vers la page de chat et met à jour son status "en ligne"
      if (page === "accueil") {
        saveUser(router, user!);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // 🔁 Nettoyage
  }
};
