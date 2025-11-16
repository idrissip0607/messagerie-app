import { auth } from "@/firebase/config";
import { Contact } from "@/types";
import { onAuthStateChanged } from "firebase/auth";
import { saveUser } from "./SaveUser";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const LoginMiddleware = (
  router: AppRouterInstance,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  page: string
) => {
  if (typeof window !== "undefined") {
    // on verifie si l'utilisateur existe dans le localsotorage
    const user: Contact = JSON.parse(localStorage.getItem("user")!) || null;

    if (!user) {
      if (page === "accueil") {
        // si on est sur la page login et que l'user n'est pas connecter dans firebase on affiche le bouton login
        return setLoading(false);
      } else {
        //si on est sur la page chat et que l'user n'est pas connecter dans firebase on affiche le bouton login
        router.push("/");
      }
    }

    // on verifie la connexion de l'user avec firebase (double verification)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        if (page === "accueil") {
          // si on est sur la page login et que l'user n'est pas connecter dans firebase on affiche le bouton login
           setLoading(false);
        } else {
          //si on est sur la page chat et que l'user n'est pas connecter dans firebase on affiche le bouton login
          router.push("/");
        }
        return;
      }

      // on le redirige vers la page de chat et met a jour son status "en ligne"
      if (page === "accueil") {
        saveUser(router, user);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // 🔁 Nettoyage
  }
};
